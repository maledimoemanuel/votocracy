/*import React, { useState } from 'react';
import axios from 'axios';

function Create() {
  const [formData, setFormData] = useState({
    title: '',
    profilePicture: null,
    profilePicturePreview: '', // Store the profile picture preview
    profilePictureURL: '', // Store the profile picture URL
    participants: [],
    closingDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'profilePicture' ? files[0] : value,
    }));

    if (name === 'profilePicture') {
      // Preview the profile picture
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          profilePicturePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveParticipant = (index) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants.splice(index, 1);
    setFormData({ ...formData, participants: updatedParticipants });
  };

  const handleParticipantChange = (e, index) => {
    const { name, value, files } = e.target;
    const updatedParticipants = [...formData.participants];
    updatedParticipants[index][name] = name === 'participantPicture' ? files[0] : value;
    setFormData({ ...formData, participants: updatedParticipants });
  };

  const handleParticipant = () => {
    const newParticipant = {
      name: '',
      description: '',
      participantPicture: null,
      participantPicturePreview: '', // Store the participant picture preview
      participantPictureURL: '', // Store the participant picture URL
    };
    setFormData((prevData) => ({
      ...prevData,
      participants: [...prevData.participants, newParticipant],
    }));
  };

  const handleParticipantPictureUpload = async (file, index) => {
    if (file) {
      try {
        const storageRef = ref(storage, `participant_images/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
  
        const updatedParticipants = [...formData.participants];
        updatedParticipants[index].participantPictureURL = imageUrl;
        setFormData({ ...formData, participants: updatedParticipants });
        return imageUrl; // Return the Firebase URL
      } catch (error) {
        console.error('Error uploading participant image:', error);
      }
    }
  
    return ''; // Return an empty string if no file is provided
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the form data to send to the server
    const data = new FormData();
    data.append('title', formData.title);
    data.append('closingDate', formData.closingDate);
    data.append('profilePicture', formData.profilePicture);
    data.append('profilePictureURL', formData.profilePictureURL);
  
    
  // Get the Firebase URLs for participant pictures
  const participantUrls = await Promise.all(
    formData.participants.map(async (participant, index) => {
      if (participant.participantPictureURL) return participant.participantPictureURL;
      return await handleParticipantPictureUpload(participant.participantPicture, index);
    })
  );

  formData.participants.forEach((participant, index) => {
    data.append(`participants[${index}].name`, participant.name);
    data.append(`participants[${index}].description`, participant.description);
    data.append(`participants[${index}].participantPicture`, participant.participantPicture);
    data.append(`participants[${index}].participantPictureURL`, participantUrls[index]);
  });
  
    // Make a POST request to your server's endpoint
    axios
      .post('http://localhost:8086/create-event', formData)
      .then((response) => {
        // Handle the response from the server, e.g., show a success message or redirect
        console.log('Event created:', response.data);
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message
        console.error('Error creating event:', error);
      });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form className="bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title/Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="title"
            name="title"
            placeholder="Enter name/title"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePicture">
            Profile Picture/Logo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*" // Allow only image files
            onChange={handleInputChange}
          />
          {formData.profilePicturePreview && (
            <img
              src={formData.profilePicturePreview}
              alt="Profile Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full"
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="closingDate">
            Closing Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            id="closingDate"
            name="closingDate"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Participants</label>
          {formData.participants.map((participant, index) => (
            <div key={index} className="mb-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Participant's Name"
                name={`participants[${index}].name`}
                onChange={(e) => handleParticipantChange(e, index)}
              />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Description"
                name={`participants[${index}].description`}
                onChange={(e) => handleParticipantChange(e, index)}
              />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="file"
                id={`participantPicture-${index}`}
                name={`participants[${index}].participantPicture`}
                accept="image/*"
                onChange={(e) => {
                  handleParticipantChange(e, index);
                  handleParticipantPictureUpload(e.target.files[0], index);
                }}
              />
              {participant.participantPicturePreview && (
                <img
                  src={participant.participantPicturePreview}
                  alt={`Participant ${index + 1}`}
                  className="mt-2 w-24 h-24 object-cover rounded-full"
                />
              )}
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveParticipant(index)}
              >
                Remove participant
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleParticipant}
          >
            Add Participant
          </button>
        </div>
        <div className="mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            onClick={handleSubmit}
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default Create;
*/