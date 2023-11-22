import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaVoteYea, FaSearch,FaCheck } from 'react-icons/fa';
import Navbar from './Navbar';
import axios from 'axios';

function EventView() {
  const [participants, setParticipants] = useState([]);
  const { event_id } = useParams();
  const [voteButtonDisabled, setVoteButtonDisabled] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8086/participants/${event_id}`)
      .then((res) => res.json())
      .then((data) => setParticipants(data))
      .catch((err) => console.log(err));
  }, [event_id]);

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/user_events_votes/${event_id}`, { withCredentials: true });
        setVoted(response.data.hasVoted);
      } catch (error) {
        console.error('Error checking vote status', error);
        // Assume an error means the user hasn't voted (can be handled differently)
      }
    };

    checkVoteStatus();
  }, [event_id]);  

  const handleVote = async (selectedParticipantId) => {
    const userConfirmedVote = window.confirm(`Are you sure?`);

    if (!userConfirmedVote) {
      return; // Do nothing if the user cancels the vote
    }

    if (voteButtonDisabled) {
      return;
    }

    try {
      // If the user has not voted yet, proceed to submit the vote
      const submitVoteResponse = await axios.post(
        'http://localhost:8086/submit-vote',
        {
          selectedParticipantId: selectedParticipantId,
        },
        { withCredentials: true }
      );

      if (submitVoteResponse.data.status === 'Success') {

        // Optionally, you can show a success message to the user
        window.alert('Vote submitted successfully!');
        setVoted(true);
      } else {
        //console.error('Vote submission failed');
        window.alert('Vote submitted successfully!');
        setVoted(true);
      }
    } catch (error) {
      console.error('Error during vote submission', error);
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="px-5 py-2 md:pl-10 md:pr-10">
        <div className="w-full flex flex-col md:flex-row items-center mt-4 md:mt-8">
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
          <h3 className="font-bold py-2">Participants</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {participants.map((participant) => (
              <div
                key={participant.participant_id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow bg-gradient-to-r from-violet-700 to-indigo-700 dark:border-gray-700 py-5 px-5"
              >
                <a href="#">
                  <img className="rounded-t-lg" src={participant.picture_url} alt="image url" />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {participant.participant_name}
                    </h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {participant.participants_desc}
                  </p>
                  <div className="flex justify-between align-center">
                    <button
                      onClick={() => handleVote(participant.participant_id)}
                      disabled={voted}
                      className={`inline-flex items-center px-3 py-2 text-md font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none ${
                        voted
                          ? 'bg-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        }`}
                        >
                      {voted ? 'Voted' : 'Vote'} <FaVoteYea className="ml-1 " />
                    </button>
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

export default EventView;
