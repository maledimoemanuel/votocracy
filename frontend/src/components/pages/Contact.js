import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Contact() {
  const [suggestion, setSuggestion] = useState('');
  const [auth, setAuth] = useState()
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8086')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setMessage(res.data.Message);
          // Redirect to login page
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error checking authentication status', error);
        // Handle error, maybe show an error message
      });
  }, [navigate]);

  const handleSuggestionChange = (e) => {
    setSuggestion(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8086/submit-suggestion', { suggestion }, { withCredentials: true })
      .then((response) => {
        setSuccess('Message sent!');
        console.log('Message sent successfully:', response.data);
        setSuggestion('');
      })
      .catch((error) => {
        console.error('Error submitting suggestion:', error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-4 bg-white border border-gray-300 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Contact us</h2>
        {success && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="success">{success}</Alert>
          </Stack>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="suggestion" className="block text-sm font-medium text-gray-600">
              Message
            </label>
            <textarea
              id="suggestion"
              name="suggestion"
              value={suggestion}
              onChange={handleSuggestionChange}
              rows="4"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-md font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
