import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateParticipantForm = ({ participant, onUpdateParticipant, onCancelUpdate }) => {
  const [participantName, setParticipantName] = useState('');
  const [participantsDesc, setParticipantsDesc] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  
  useEffect(() => {
    // Set initial values when the form is mounted
    setParticipantName(participant.participant_name);
    setParticipantsDesc(participant.participants_desc);
    setPictureUrl(participant.picture_url);
  }, [participant]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedParticipant = {
      participant_id: participant.participant_id,
      participant_name: participantName,
      participants_desc: participantsDesc,
      picture_url: pictureUrl,
    };

    try {
      // Make an API call to update the participant
      const response = await axios.put(`http://localhost:8086/update-participant/${participant.participant_id}`, updatedParticipant, { withCredentials: true });
      console.log(response.data);

      // Call the parent component's function to update the participant in the state
      onUpdateParticipant(updatedParticipant);
    } catch (error) {
      console.error('Error updating participant', error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Update Participant</h2>
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
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancelUpdate}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateParticipantForm;
