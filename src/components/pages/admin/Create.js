import React, { useState } from 'react';
import axios from 'axios';
import { Alert, AlertTitle } from '@mui/material';

const Create = () => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [eventUrl, setEventUrl] = useState('');
  const [eventCreated, setEventCreated] = useState(false);
  const [creationError, setCreationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8086/create-event', {
        eventName,
        eventDescription,
        closingDate,
        eventUrl,
      }, {withCredentials: true});
    
      if (response.data.status === 'Success') {
        setEventCreated(true);
        setEventName('');
        setEventDescription('');
        setClosingDate('');
        setEventUrl('');
      } else {
        console.error('Event creation failed:', response.data.message);
        setCreationError('Event creation failed');
      }
    } catch (error) {
      console.error('Error during event creation:', error.message);
      setCreationError('Error during event creation');
    }
    
  };

  return (
    <div className="mx-auto max-w-xl p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      {eventCreated && (
        <Alert severity="success" onClose={() => setEventCreated(false)}>
          <AlertTitle>Success</AlertTitle>
          Event created successfully!
        </Alert>
      )}
      {creationError && (
        <Alert severity="error" onClose={() => setCreationError('')}>
          <AlertTitle>Error</AlertTitle>
          {creationError}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="eventName" className="block text-gray-700 text-sm font-bold mb-2">
            Event Name:
          </label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="eventDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Event Description:
          </label>
          <textarea
            id="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="closingDate" className="block text-gray-700 text-sm font-bold mb-2">
            Closing Date:
          </label>
          <input
            id="closingDate"
            value={closingDate}
            onChange={(e) => setClosingDate(e.target.value)}
            className="w-full border-solid rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="eventUrl" className="block text-gray-700 text-sm font-bold mb-2">
            Event URL:
          </label>
          <input
            type="text"
            id="eventUrl"
            value={eventUrl}
            onChange={(e) => setEventUrl(e.target.value)}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
