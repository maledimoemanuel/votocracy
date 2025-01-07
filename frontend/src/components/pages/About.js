import React from 'react';
import Navbar from './Navbar';

function About() {
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-white border border-gray-300 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">About Votocracy</h2>
        <p>
          Welcome to Votocracy, your go-to platform for organizing and conducting online voting events.
          Whether it's for elections, surveys, or fun polls, we've got you covered!
        </p>

        <h3 className="text-xl font-bold mt-4">Our Mission</h3>
        <p>
          At Votocracy, our mission is to empower individuals and organizations to make decisions
          through accessible and secure online voting. We believe in the democratic process and strive
          to make it easy for everyone to participate and express their opinions.
        </p>

        <h3 className="text-xl font-bold mt-4">Key Features</h3>
        <ul>
          <li>Effortless Voting: Participate in votes with just a few clicks.</li>
          <li>Secure and Anonymous: Your votes are confidential and secure.</li>
          <li>Real-time Results: Get instant insights into voting outcomes.</li>
          {/* Add more features as needed */}
        </ul>

        <h3 className="text-xl font-bold mt-4">Meet the Team</h3>
        <div className="flex space-x-4">
          {/* Add team member cards with names, roles, and descriptions */}
          <div className="flex-shrink-0">
            <img
              src=""
              alt="Team Member 1"
              className="w-12 h-12 rounded-full"
            />
          </div>
          <div>
            <p className="font-bold">Maledimo Emanuel</p>
            <p>Developer</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-4">Technologies Used</h3>
        <p>
          Votocracy is built using modern web technologies, including:
          React, Node.js, Express, MySQL, and more.
        </p>
      </div>
    </div>
  );
}

export default About;
