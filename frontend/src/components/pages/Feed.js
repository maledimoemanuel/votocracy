import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import CountdownTimer from './CountdownTimer';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios'

function Feed() {
  const Ref = useRef(null);
  const [auth,setAuth] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('')
  const [name, setName] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:8086');
        if (response.data.Status === 'Success') {
          setAuth(true);
          setName(response.data.name);
        } else {
          setMessage(response.data.Message);
        }
      } catch (error) {
        console.error('Error checking authentication status', error);
      } finally {
        // Set loading to false once the authentication check is complete
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);
  useEffect(() => {
    fetch('http://localhost:8086/events')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err))
  }, [])

  const viewEvent = (event_id) => {
    let path = `/event-view/${event_id}`;
    navigate(path);
  }

    // Filter events based on closing date
    const filteredEvents = data.filter((d) => {
      if (d.event_date) {
        const now = new Date().getTime();
        const targetTime = new Date(d.event_date).getTime();
        return targetTime > now;
      }
      return true; 
    });

    function goToLogin(){
      navigate('/')
    }

    if (loading) {
      // Optional: You can render a loading spinner or message while checking authentication
      return <div>Loading...</div>;
    }

  return (
    <div className="w-full">
    <Navbar/>
    {
      auth ? (
    <div className="w-full pl-5 pr-5">
      <div className="w-full flex flex-col md:flex-row justify-between items-center mt-8">
        <label className="relative items-center justify-center flex w-full md:w-auto">
          <span className="sr-only">Search</span>
          <span className="absolute insert-y-0 left-0 flex items-center pl-2">
            <FaSearch className="text-gray-500" />
          </span>
          <input
          className="placeholder:italic placeholder:text-slate-300 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 sm:text-sm"
          placeholder="Search..."
          name="search"
        />
      </label>
    </div>
    <div>
      <h3 className="font-bold py-2">Ongoing Events</h3>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEvents.map((d, i) => (
        
          <div
            key={i}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow bg-gradient-to-r from-violet-700 to-indigo-700 dark:border-gray-700 py-5 px-5"
          >
            <a href="#">
              <img className="rounded-t-lg" src={d.event_url} alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {d.event_name}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {d.event_description}
              </p>
              <div className="flex justify-between align-center">
                <button
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => viewEvent(d.event_id)}
                  >
                  View <FaEye className="ml-1 " />
                </button>
                {d.event_date && (
                  <h3 className="text-white font-bold">
                    <CountdownTimer targetDate={d.event_date} />
                  </h3>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>) : (
    navigate('/')
  )
}
  </div>
  
  );
}

export default Feed;
