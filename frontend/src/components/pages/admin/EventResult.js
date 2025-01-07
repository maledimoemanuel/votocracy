import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EventResults() {
  const [participants, setParticipants] = useState([]);
  const { event_id } = useParams();

  // Fetch participants for a specific event
  const fetchParticipants = async () => {
    try {
      const response = await fetch(`http://localhost:8086/events/${event_id}/participants`);
      const data = await response.json();
      // Sort participants based on vote count from highest to lowest
      const sortedParticipants = data.participants.sort((a, b) => b.vote_count - a.vote_count);
      setParticipants(sortedParticipants || []);
    } catch (error) {
      console.error('Error fetching participants for the event', error);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [event_id]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white border border-gray-300 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Event Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div key={participant.participant_id} className="p-4 border border-gray-200 rounded shadow-md">
              <img
                src={participant.picture_url}
                alt={`Participant ${participant.participant_id}`}
                className="w-full h-auto object-cover rounded mb-2"
              />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {participant.participant_name}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  Votes: {participant.vote_count}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-400 text-center">No participants available for this event.</p>
        )}
      </div>
    </div>
  );
}

export default EventResults;
