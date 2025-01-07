import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContactAdmin() {
  const [suggestions, setSuggestions] = useState([]);

  const [auth, setAuth] =useState(false);
  const [message, setMessage] = useState('')

  axios.default.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8086')
    .then(res=> {
      if(res.data.Status === "Success"){
        setAuth(true)
        window.location.href = '/admin';
      } else {
        setMessage(res.data.Message)
      }
    })
  }, [])

  useEffect(() => {
    // Fetch user suggestions when the component mounts
    axios.get('http://localhost:8086/admin/suggestions', {
      withCredentials: true,
    })
      .then((response) => {
        const data = response.data;
        console.log('Response data:', data);
        if (data.status === 'Success') {
          setSuggestions(data.suggestions);
        } else {
          console.error('Error fetching user suggestions:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching user suggestions:', error);
      });
  }, []);

  // Log the state to check if it's updating correctly
  console.log('Suggestions state:', suggestions);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white border border-gray-300 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Suggestions</h2>
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.suggestion_id} className="mb-4 p-4 border rounded">
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-bold">Date:</span> {suggestion.submission_date}
            </p>
            <p className="text-lg">{suggestion.suggestion_text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactAdmin;
