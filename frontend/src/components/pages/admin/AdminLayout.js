import React, { useState } from 'react';
import { FaHome, FaPlus, FaCog, FaSignOutAlt, FaBars, FaMedal, FaInfo } from 'react-icons/fa';
import axios from 'axios';
import Admin from './Admin';
import Create from './Create';
import Ongoing from './Ongoing';
import Results from './Results';
import SuggestionsAdmin from './ContactAdmin'

const AdminLayout = () => {
  const [selectedNavItem, setSelectedNavItem] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (selectedNavItem) {
      case 'home':
        return <Admin />;
      case 'create':
        return <Create />;
      case 'ongoing':
        return <Ongoing />;
      case 'results':
        return <Results/>
      case 'suggestions':
        return <SuggestionsAdmin/>

      default:
        return null;
    }
  };

  const handleLogout =()=>{
    axios.get('http://localhost:8086/admin/logout', { withCredentials: true })
    .then(res => {
      if(res.data.Status === "Success"){
        window.location.href = '/admin-login';
      } else{
        alert("error")
      }
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`flex-shrink-0 w-64 bg-gray-800 ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className="p-4">
          <h1 className="text-white text-2xl font-bold mb-4">Votocracy</h1>
          <button
            onClick={() => setSelectedNavItem('home')}
            className={`flex items-center text-white p-2 ${selectedNavItem === 'home' && 'bg-indigo-500'}`}
          >
            <FaHome className="mr-2" />
            Home
          </button>
          <button
            onClick={() => setSelectedNavItem('create')}
            className={`flex items-center text-white p-2 ${selectedNavItem === 'create' && 'bg-indigo-500'}`}
          >
            <FaPlus className="mr-2" />
            Create
          </button>
          <button
            onClick={() => setSelectedNavItem('ongoing')}
            className={`flex items-center text-white p-2 ${selectedNavItem === 'ongoing' && 'bg-indigo-500'}`}
          >
            <FaCog className="mr-2" />
            Ongoing
          </button>

          <button
            onClick={() => setSelectedNavItem('results')}
            className={`flex items-center text-white p-2 ${selectedNavItem === 'ongoing' && 'bg-indigo-500'}`}
          >
            <FaMedal className="mr-2 text-white" />
            Results
          </button>

          <button
            onClick={() => setSelectedNavItem('suggestions')}
            className={`flex items-center text-white p-2 ${selectedNavItem === 'ongoing' && 'bg-indigo-500'}`}
          >
            <FaInfo className="mr-2 text-white" />
            Suggestions
          </button>
          <button
            onClick={() => {
              handleLogout()
            }}
            className="mt-4 flex items-center text-white p-2 bg-red-500 hover:bg-red-600"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Menu button for smaller screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 right-4 text-white"
      >
        <FaBars size={24} />
      </button>

      {/* Main content area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        {/* Navbar */}

        {/* Main content */}
        <main className="p-4">
          {/* Render the content based on the selected navigation item */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
