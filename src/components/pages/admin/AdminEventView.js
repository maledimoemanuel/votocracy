import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaVoteYea, FaSearch, FaTimes, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AddParticipantForm from './AddParticipantForm';
import UpdateParticipantForm from './UpdateParticipantForm'; // Import the UpdateParticipantForm
import axios from 'axios';

function AdminEventView() {
  const { event_id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [addParticipantModalOpen, setAddParticipantModalOpen] = useState(false);
  const [updateParticipantModalOpen, setUpdateParticipantModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [voteCount, setVoteCount] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch participants data for the specific event from the backend
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/participants/${event_id}`, { withCredentials: true });
        setParticipants(response.data);
      } catch (error) {
        console.error('Error fetching participants', error);
      }
    };

    // Call the fetch function
    fetchParticipants();
  }, [event_id]);

  const addPath = () => {
    // Open the Add Participant modal
    setAddParticipantModalOpen(true);
  };

  const closeAddParticipantModal = () => {
    // Close the Add Participant modal
    setAddParticipantModalOpen(false);
  };

  const handleAddParticipant = (newParticipant) => {
    // Update the participants state or perform any other logic as needed
    setParticipants((prevParticipants) => [...prevParticipants, newParticipant]);
    closeAddParticipantModal();
  };

  const updatePath = (participant) => {
    // Open the Update Participant modal and set the selected participant
    setUpdateParticipantModalOpen(true);
    setSelectedParticipant(participant);
  };

  const closeUpdateParticipantModal = () => {
    // Close the Update Participant modal
    setUpdateParticipantModalOpen(false);
    setSelectedParticipant(null); // Clear the selected participant when the modal is closed
  };

  const handleUpdateParticipant = (updatedParticipant) => {
    // Update the participants state or perform any other logic as needed
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.participant_id === updatedParticipant.participant_id ? updatedParticipant : participant
      )
    );
    closeUpdateParticipantModal();
  };

  const handleDeleteParticipant = async (selectedParticipantId) => {
    if (selectedParticipantId) {
      try {
        // Make an API call to delete the participant with the corresponding participant_id
        await axios.delete(`http://localhost:8086/delete-participant/${selectedParticipantId}`, { withCredentials: true });
        // Remove the deleted participant from the state
        setParticipants((prevParticipants) =>
          prevParticipants.filter((participant) => participant.participant_id !== selectedParticipantId)
        );
      } catch (error) {
        console.error('Error deleting participant', error);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Your existing search bar */}
      <div className="px-5 py-2 md:pl-10 md:pr-10">
        {/* Participants section */}
        <div>
          <h3 className="font-bold py-2">Participants</h3>
          {/* Add participant button */}
          <button
            onClick={addPath}
            className="mb-4 inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300"
          >
            Add Participant <FaPlus className="ml-1" />
          </button>
          {addParticipantModalOpen && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  {/* Close button in the top right */}
                  <button
                    onClick={closeAddParticipantModal}
                    type="button"
                    className="absolute top-0 right-0 m-4 text-gray-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                  {/* AddParticipantForm component */}
                  <AddParticipantForm onAddParticipant={handleAddParticipant} />
                </div>
              </div>
            </div>
          )}
          {/* Update participant modal */}
          {updateParticipantModalOpen && selectedParticipant && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  {/* Close button in the top right */}
                  <button
                    onClick={closeUpdateParticipantModal}
                    type="button"
                    className="absolute top-0 right-0 m-4 text-gray-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                  {/* UpdateParticipantForm component */}
                  <UpdateParticipantForm
                    participant={selectedParticipant}
                    onUpdateParticipant={handleUpdateParticipant}
                    onCancelUpdate={closeUpdateParticipantModal}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Participants list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {participants.map((participant) => (
              <div
                key={participant.participant_id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow bg-gradient-to-r from-violet-700 to-indigo-700 dark:border-gray-700 py-5 px-5"
              >
                {/* Participant image */}
                <a href="#">
                  <img className="rounded-t-lg" src={participant.picture_url} alt="image url" />
                </a>
                {/* Participant information */}
                <div className="p-5">
                  {/* Participant name */}
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {participant.participant_name}
                    </h5>
                  </a>
                  {/* Participant description */}
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {participant.participants_desc}
                  </p>
                  {/* Actions */}
                  <div className="flex flex-col md:flex-row justify-between align-center">
                    {/* Edit participant button */}
                    <button
                      onClick={() => updatePath(participant)}
                      className="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300"
                    >
                      Edit <FaEdit className="ml-1 " />
                    </button>
                    {/* Delete participant button */}
                    <button
                      onClick={() => handleDeleteParticipant(participant.participant_id)}
                      className="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                    >
                      Delete <FaTrash className="ml-1 " />
                    </button>
                    <p className=" mt-2 md:mt-0 text-md font-bold text-white">{participant.vote_count} Votes</p>
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

export default AdminEventView;
