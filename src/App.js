import './App.css';
import React, {useState,useEffect} from 'react';
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Navbar from './components/pages/Navbar';
import About from './components/pages/About';
import Contact from './components/pages/Contact'
import Feed from './components/pages/Feed';
import Create from './components/pages/Create';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import EventView from './components/pages/EventView';

import AdminLogin from './components/pages/admin/auth/AdminLogin'
import AdminLayout from './components/pages/admin/AdminLayout'
import AdminEventView from './components/pages/admin/AdminEventView'
import AddParticipantForm from './components/pages/admin/AddParticipantForm'
import UpdateParticipantForm from './components/pages/admin/UpdateParticipantForm'
import EventResult from './components/pages/admin/EventResult';
import axios from 'axios';

function App() {
  const [auth, setAuth] =useState(false);
  const [name, setName] = useState("")
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8086')
    .then(res=> {
      if(res.data.Status === "Success"){
        setAuth(true)
        setName(res.data.name)
      } else {
        setMessage(res.data.Message)
      }
    })
  }, [])

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/feed' element={<Feed />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/create-event' element={<Create/>}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path='/event-view/:event_id' element={<EventView/>}/>

        <Route path='/admin-login' element={<AdminLogin />}/>
        <Route path='/admin' element={<AdminLayout />}/>
        <Route path='/admin/event-view/:event_id' element={<AdminEventView/>}/>
        <Route path="/admin-event/:event_id" element={<AdminEventView />} />
        <Route path="/add-participant/:event_id" element={<AddParticipantForm />} />
        <Route path="/update-participant/:participant_id" element={<UpdateParticipantForm />} />
        <Route path="/results/:event_id" element={<EventResult />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
