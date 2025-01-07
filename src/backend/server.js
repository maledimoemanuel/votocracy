const express = require('express');
const mysql = require('mysql2');
const cors  = require('cors');
const cookieParser = require('cookie-parser'); // Use require for CommonJS
require('dotenv').config()

const jwt = require("jsonwebtoken");

const app = express();
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        methods:["POST, GET, DELETE, PUT",],
        credentials: true
    }
))
app.use(express.json());
app.use(cookieParser());

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Message: 'We need a token, please provide it.'})
    } else {
        jwt.verify(token, 'our-jsonwebtoken-secret-key', (err, decoded) => {
            if(err){
                return res.json({Message: "Authentication error"})
            } else{
                req.name = decoded.name;
                next();
            }
        })
    }
}
app.get('/', verifyUser,(req, res) => {
  return res.json({Status: 'Success', name: req.name})
})

const verifyAdmin = (req, res, next) => {
  const adminToken = req.cookies.adminToken;
  if(!adminToken){
      return res.json({Message: 'We need a token, please provide it.'})
  } else {
      jwt.verify(adminToken, 'our-jsonwebtoken-secret-key', (err, decoded) => {
          if(err){
              return res.json({Message: "Authentication error"})
          } else{
              req.admin = decoded.admin;
              next();
          }
      })
  }
}

app.post("/register", (req, res) => {
    const email  = req.body.email;
    const age = req.body.age;
    const fullname = req.body.fullname;
    const password = req.body.password;
    
    const q = "INSERT INTO users (fullname,age,email, password ) VALUES (?, ?, ?, ?)";
    db.query(q,[fullname, age, email, password], 
        (err, data) => {
        if(data){
            res.send(data);
        }else{
            res.send({message: "Enter Correct Details!"})
        }
    })
})

app.post("/login", (req, res) => {
    const email  = req.body.email;
    const password = req.body.password;
    
    const q = "SELECT * FROM users WHERE email = ? AND password = ? ";
    db.query(q,[email, password], 
        (err, data) => {
        if(err){
            req.setEncoding({err: err})
        } else {
            if(data.length > 0){
                const name = data[0].id;
                const token = jwt.sign({ name }, 'our-jsonwebtoken-secret-key', { expiresIn: '1d' });
                
                res.cookie('token', token);
                return res.json({ Status: "Success" });
            } else {
                res.send({message: "Wrong email or password!"})
            }
        }
        
    })
})

//admin login
app.post("/admin/login", (req, res) => {
  const adminEmail = req.body.email;
  const adminPassword = req.body.password;
  
  const q = "SELECT * FROM admin WHERE email = ? AND password = ? ";
  db.query(q,[adminEmail, adminPassword], 
      (err, data) => {
      if(err){
          req.setEncoding({err: err})
      } else {
          if(data.length > 0){
              const admin = data[0].admin_id;
              const adminToken = jwt.sign({ admin }, 'our-jsonwebtoken-secret-key', { expiresIn: '1d' });
              
              res.cookie('adminToken', adminToken);
              return res.json({ Status: "Success" });
          } else{
              res.send({message: "Wrong email or password!"})
          }
      }
      
  })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.get('/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  return res.json({Status: "Success"});
})

// Create a new event
app.post('/create-event', verifyAdmin, (req, res) => {
    const { eventName, eventDescription, closingDate, eventUrl } = req.body;
  
    if (!eventName || !eventDescription || !closingDate || !eventUrl) {
      return res.status(400).json({ status: 'Error', message: 'All fields are required.' });
    }
  
    // Insert the new event into the events table
    const getMaxEventIdQuery = 'SELECT MAX(event_id) AS maxEventId FROM events';

    // Retrieve the maximum event_id
    db.query(getMaxEventIdQuery, (err, result) => {
      if (err) {
        console.error('Error retrieving max event_id', err);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
        return;
      }
    
      const maxEventId = result[0].maxEventId || 0;
    
      // Insert the new event into the events table
      const insertQuery = 'INSERT INTO events (event_id, event_name, event_description, event_date, event_url) VALUES (?, ?, ?, ?, ?)';
      db.query(insertQuery, [maxEventId + 1, eventName, eventDescription, closingDate, eventUrl], (err, data) => {
        if (err) {
          console.error('Error creating event', err);
          res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
        } else {
          res.status(200).json({ status: 'Success', message: 'Event created successfully!' });
        }
      });
    });
  });

  // Add participant to event
  app.post('/add-participant', verifyAdmin, (req, res) => {
    const { event_id, participant_name, participants_desc, picture_url } = req.body;
    const vote_count = 0;
    console.log('Received data:', req.body);
  
    if (!event_id || !participant_name || !participants_desc || !picture_url) {
      return res.status(400).json({ status: 'Error', message: 'All fields are required.' });
    }
  
    // Fetch the last participant_id from the table
    const getLastParticipantIdQuery = 'SELECT MAX(participant_id) as maxId FROM participants';
    db.query(getLastParticipantIdQuery, (err, result) => {
      if (err) {
        console.error('Error fetching last participant_id', err);
        return res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
      }
  
      // Calculate the new participant_id by incrementing the last participant_id by 1
      const newParticipantId = result[0].maxId + 1;
  
      // Insert the new participant with the calculated participant_id
      const insertQuery = 'INSERT INTO participants (participant_id, event_id, participant_name, participants_desc, picture_url, vote_count) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [newParticipantId, event_id, participant_name, participants_desc, picture_url, vote_count], (err, data) => {
        if (err) {
          console.error('Error adding participant', err);
          return res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
        }
  
        // Retrieve the added participant
        const getParticipantQuery = 'SELECT * FROM participants WHERE participant_id = ?';
        db.query(getParticipantQuery, [newParticipantId], (err, participantData) => {
          if (err) {
            console.error('Error retrieving added participant', err);
            return res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
          }
  
          res.status(200).json({ status: 'Success', message: 'Participant added successfully!', participant: participantData[0] });
        });
      });
    });
  });
  
  // Update participant
  app.put('/update-participant/:participant_id', verifyAdmin, (req, res) => {
    const { participant_name, participants_desc, picture_url } = req.body;
    const { participant_id } = req.params;
  
    if (!participant_name || !participants_desc || !picture_url) {
      return res.status(400).json({ status: 'Error', message: 'All fields are required.' });
    }
  
    const updateQuery = 'UPDATE participants SET participant_name=?, participants_desc=?, picture_url=? WHERE participant_id=?';
    db.query(updateQuery, [participant_name, participants_desc, picture_url, participant_id], (err, data) => {
      if (err) {
        console.error('Error updating participant', err);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
      } else {
        // Retrieve the updated participant
        const getParticipantQuery = 'SELECT * FROM participants WHERE participant_id = ?';
        db.query(getParticipantQuery, [participant_id], (err, participantData) => {
          if (err) {
            console.error('Error retrieving updated participant', err);
            res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
          } else {
            res.status(200).json({ status: 'Success', message: 'Participant updated successfully!', participant: participantData[0] });
          }
        });
      }
    });
  });
  
  // Delete participant
  app.delete('/delete-participant/:participant_id', verifyAdmin, (req, res) => {
    const { participant_id } = req.params;
  
    const deleteQuery = 'DELETE FROM participants WHERE participant_id=?';
    db.query(deleteQuery, [participant_id], (err, data) => {
      if (err) {
        console.error('Error deleting participant', err);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
      } else {
        res.status(200).json({ status: 'Success', message: 'Participant deleted successfully!' });
      }
    });
  });
  
  
app.get("/events", (req, res) => {
    const q = "SELECT * FROM events";
    db.query(q, (err, data)=>{
        if(err){
            res.json(err)
        } else{
            res.json(data)
        }
    })
})

  // Delete event
  app.delete('/delete-event/:event_id', verifyAdmin, (req, res) => {
    const { event_id } = req.params;
  
    const deleteQuery = 'DELETE FROM events WHERE event_id=?';
    db.query(deleteQuery, [event_id], (err, data) => {
      if (err) {
        console.error('Error deleting event', err);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
      } else {
        res.status(200).json({ status: 'Success', message: 'Event deleted successfully!' });
      }
    });
  });
  
// Endpoint to get the total number of events
app.get('/total-events', (req, res) => {
    const q = 'SELECT COUNT(*) AS totalEvents FROM events';
    db.query(q, (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(data[0]);
      }
    });
  });

  // Endpoint to get the total number of participants
  app.get('/total-participants', (req, res) => {
    const q = 'SELECT COUNT(*) AS totalParticipants FROM participants';
    db.query(q, (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(data[0]);
      }
    });
  });

  // Endpoint to get the total number of votes
  app.get('/total-votes', (req, res) => {
    const q = 'SELECT SUM(vote_count) AS totalVotes FROM participants';
    db.query(q, (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(data[0]);
      }
    });
  });

  // Get participants of a specific event
app.get('/events/:event_id/participants', (req, res) => {
  const { event_id } = req.params;
  const query = 'SELECT * FROM participants WHERE event_id = ?';
  
  db.query(query, [event_id], (err, data) => {
      if (err) {
          console.error('Error fetching participants for the event', err);
          res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
      } else {
          res.status(200).json({ status: 'Success', participants: data });
      }
  });
});

  

app.get("/users", (req, res) => {
    const q = "SELECT * FROM users";
    db.query(q, (err, data)=>{
        if(err){
            res.json(err)
        } else{
            res.json(data)
        }
    })
})

app.get("/participants/:event_id", (req, res) => {
    const event_id = req.params.event_id;
    const q = "SELECT * FROM participants WHERE event_id= ?";;
    db.query(q, [event_id], (err, data)=>{
        if(err){
            res.json(err)
        } else{
            res.json(data)
        }
    })
})

app.get("/participants", (req, res) => {
    const q = "SELECT * FROM participants";;
    db.query(q, (err, data)=>{
        if(err){
            res.json(err)
        } else{
            res.json(data)
        }
    })
})

// Check vote status
app.post('/check-vote-status', verifyUser, async (req, res) => {
    const { selectedParticipantId } = req.body;
    const userId = req.name;
  
    try {
      const checkVoteQuery = 'SELECT * FROM user_events_votes WHERE id = ? AND event_id = (SELECT event_id FROM participants WHERE participant_id = ?)';
      const [existingVote] = await db.execute(checkVoteQuery, [userId, selectedParticipantId]);
  
      if (existingVote.length > 0) {
        // User has already voted for this event, send an appropriate response
        return res.json({ Status: 'Already Voted' });
      }
  
      // User has not voted for this event yet
      res.json({ Status: 'Not Voted' });
    } catch (error) {
      console.error('Error during vote status check', error);
      res.json({ Status: 'Error' });
    }
  });
  
  app.get('/user_events_votes/:event_id', verifyUser, (req, res) => {
    const userId = req.name;
    const eventId = req.params.event_id;

    const query = 'SELECT * FROM user_events_votes WHERE id = ? AND event_id = ?';
    db.query(query, [userId, eventId], (err, data) => {
      if (err) {
        res.json(err);
      } else {
        if (data.length === 0) {
          // user hasn't voted for this event
          res.json({ hasVoted: false });
        } else {
          // user has already voted for this event
          res.json({ hasVoted: true });
        }
      }
    });
});

  

  // Submit vote
  app.post('/submit-vote', verifyUser, async (req, res) => {
    const { selectedParticipantId } = req.body;
    const userId = req.name;

    try {get
        // update the vote count in the participants table
        const updateQuery = 'UPDATE participants SET vote_count = vote_count + 1 WHERE participant_id = ?';
        await db.execute(updateQuery, [selectedParticipantId]);

        // record the user's vote in the user_events_votes table
        const recordVoteQuery = 'INSERT INTO user_events_votes (id, event_id) VALUES (?, ?)';
        await db.execute(recordVoteQuery, [userId, selectedParticipantId]);

        // send a response to the frontend
        res.json({ Status: 'Success' });
    } catch (error) {
        console.error('Error during vote submission', error);
        res.json({ Status: 'Error' });
    }
});

//submit suggestions
app.post('/submit-suggestion', verifyUser, (req, res) => {
  const { suggestion } = req.body;

  if (!suggestion) {
    return res.status(400).json({ status: 'Error', message: 'Suggestion cannot be empty.' });
  }

  // insert the new suggestion into the suggestions table
  const insertQuery = 'INSERT INTO suggetions (user_id, suggestion_text) VALUES (?, ?)';
  const userId = req.name;

  db.query(insertQuery, [userId, suggestion], (err, data) => {
    if (err) {
      console.error('Error submitting suggestion', err);
      return res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }

    return res.status(200).json({ status: 'Success', message: 'Suggestion submitted successfully!' });
  });
});

//get suggestions
app.get('/admin/suggestions', verifyAdmin, (req, res) => {
  const getSuggestionsQuery = 'SELECT * FROM suggetions';
  db.query(getSuggestionsQuery, (err, data) => {
    if (err) {
      console.error('Error fetching suggestions', err);
      res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    } else {
      res.status(200).json({ status: 'Success', suggestions: data });
    }
  });
});


app.listen(8086, () => {
    console.log("connected...")
})