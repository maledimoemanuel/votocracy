import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddParticipantForm = ({ onAddParticipant }) => {
  const { event_id } = useParams();
  const [participantName, setParticipantName] = useState('');
  const [participantsDesc, setParticipantsDesc] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newParticipant = {
      participant_name: participantName,
      participants_desc: participantsDesc,
      picture_url: pictureUrl,
      event_id: event_id,
    };
    console.log(newParticipant)

    try {
      // Make an API call to add the participant with the corresponding event_id
      const response = await axios.post('http://localhost:8086/add-participant', newParticipant, { withCredentials: true } ) 
      console.log(response.data)
      onAddParticipant(newParticipant);

      // Clear the form fields
      setParticipantName('');
      setParticipantsDesc('');
      setPictureUrl('');
    } catch (error) {
      console.error('Error adding participant', error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add Participant</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="participantName">
          Participant Name:
        </label>
        <input
          className="border border-gray-300 p-2 w-full rounded-md"
          type="text"
          id="participantName"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="participantsDesc">
          Participants Description:
        </label>
        <input
          className="border border-gray-300 p-2 w-full rounded-md"
          type="text"
          id="participantsDesc"
          value={participantsDesc}
          onChange={(e) => setParticipantsDesc(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pictureUrl">
          Picture URL:
        </label>
        <input
          className="border border-gray-300 p-2 w-full rounded-md"
          type="text"
          id="pictureUrl"
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-400"
      >
        Add Participant
      </button>
    </form>
  );
};

export default AddParticipantForm;
