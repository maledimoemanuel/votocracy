// Results.jsx
import React, {useState, useEffect} from 'react';
import { FaEye, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Results() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const viewResults = (event_id) => {
    // Navigate to the detailed results page for the selected event
    let path = `/results/${event_id}`;
    navigate(path);
  };

  useEffect(() => {
    fetch('http://localhost:8086/events')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err))
  }, [])
  


    // Filter events based on closing date
    const filteredEvents = data.filter((d) => {
      if (d.event_date) {
        const now = new Date().getTime();
        const targetTime = new Date(d.event_date).getTime();
        return targetTime > now; // Only include events with a closing date in the future
      }
      return true; 
    });
  return (
    <div className="w-full">
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
          <h3 className="font-bold py-2">Closed Events</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.event_id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow bg-gradient-to-r from-violet-700 to-indigo-700 dark:border-gray-700 py-5 px-5"
              >
                <div>
                  <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {event.event_name}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {event.event_description}
                  </p>
                </div>
                <div className="flex justify-between align-center">
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => viewResults(event.event_id)}
                  >
                    View Results <FaEye className="ml-1 " />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
