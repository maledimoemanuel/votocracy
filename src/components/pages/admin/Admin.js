import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  const [auth, setAuth] =useState(false);
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate();

  axios.default.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8086')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setMessage(res.data.Message);
          navigate('/admin-login');
        }
      })
      .catch(error => {
        console.error('Error checking authentication status', error);
      });
  }, [navigate]);  

  useEffect(() => {
    // Fetch total number of events
    axios.get('http://localhost:8086/total-events')
      .then(response => setTotalEvents(response.data.totalEvents))
      .catch(error => console.error('Error fetching total events:', error));

    // Fetch total number of participants
    axios.get('http://localhost:8086/total-participants')
      .then(response => setTotalParticipants(response.data.totalParticipants))
      .catch(error => console.error('Error fetching total participants:', error));

    // Fetch total number of votes
    axios.get('http://localhost:8086/total-votes')
      .then(response => setTotalVotes(response.data.totalVotes))
      .catch(error => console.error('Error fetching total votes:', error));
  }, []); // Empty dependency array means this effect runs once after the component mounts

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>

      {/* Display key statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Events */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-white">Total Events</h3>
          {/* Fetch and display total events count from your backend */}
          <span className="text-white font-bold">{totalEvents}</span>
        </div>

        {/* Total Participants */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-white">Total Participants</h3>
          {/* Fetch and display total participants count from your backend */}
          <span className="text-white font-bold">{totalParticipants}</span>
        </div>

        {/* Total Votes */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-white">Total Votes</h3>
          {/* Fetch and display total votes count from your backend */}
          <span className="text-white font-bold">{totalVotes}</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        {/* Add links to other admin sections */}
        <a href="#" className="text-blue-500 hover:underline mr-4">Create Event</a>
        {/* Add more links as needed */}
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        {/* Display a feed of recent activities */}
        {/* Example: "John Doe voted for Event X", "New event created", etc. */}
      </div>

      {/* System Status */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">System Status</h2>
        {/* Display any system status updates or issues */}
        {/* Example: "System maintenance scheduled for tomorrow", "No ongoing issues" */}
      </div>

      {/* Event Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Event Summary</h2>
        {/* Display a summary of ongoing or upcoming events */}
        {/* Example: Event names, dates, and details */}
      </div>
    </div>
  );
};

export default Admin;
