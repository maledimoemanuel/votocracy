import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import CountdownTimer from '../CountdownTimer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function Ongoing() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8086/events')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const viewEvent = (event_id) => {
    let path = `/admin/event-view/${event_id}`;
    navigate(path);
  };

  // Filter events based on closing date
  const filteredEvents = data.filter((d) => {
    if (d.event_date) {
      const now = new Date().getTime();
      const targetTime = new Date(d.event_date).getTime();
      return targetTime > now; // Only include events with a closing date in the future
    }
    return true;
  });

  const deleteEvent = async (event_id) => {
    try {
      // Use Axios to send a DELETE request
      await axios.delete(`http://localhost:8086/delete-event/${event_id}`);

      // After deleting, update the state to reflect the changes
      setData((prevData) => prevData.filter((event) => event.event_id !== event_id));
    } catch (error) {
      console.error('Error deleting event', error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full px-4 md:px-10">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-8">
          <label className="relative items-center justify-center flex w-full md:w-auto">
            <span className="sr-only">Search</span>
            <span className="absolute left-0 inset-y-0 flex items-center pl-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredEvents.map((d, i) => (
              <div
                key={i}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow bg-gradient-to-r from-violet-700 to-indigo-700 dark:border-gray-700 py-5 px-5"
              >
                <a href="#">
                  <img className="rounded-t-lg w-full h-40 object-cover" src={d.event_url} alt="" />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {d.event_name}
                    </h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {d.event_description}
                  </p>
                  <div className="flex flex-col md:flex-col justify-between items-center">
                    <a
                      href="#"
                      className="mb-3 md:mb-0 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => viewEvent(d.event_id)}
                    >
                      View <FaEye className="ml-1 " />
                    </a>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => deleteEvent(d.event_id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                      >
                        Delete <FaTrash className="ml-1" />
                      </button>
                      <p className="text-white font-bold">
                        <CountdownTimer targetDate={d.event_date} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ongoing;
