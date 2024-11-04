import React, { useState } from 'react';
import { firebase } from '../../Firebase/config';
import { FaTachometerAlt, FaUser, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../component/Admin/Dashboard';
import PaymentDetails from '../../component/Admin/PaymentDetails';
import Transaction from '../../component/Admin/Transaction';
import WithdrawTransaction from '../../component/Admin/WithdrawTransaction'; // Import the new component

const Profile = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  // Function to render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Transaction':
        return <Transaction />;
      case 'WithdrawTransaction': // Add case for Withdraw Transaction
        return <WithdrawTransaction />;
      case 'PaymentDetails':
        return <PaymentDetails />;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Icon (FAB) */}
      <button
        className="absolute top-4 right-4 z-50 p-2 bg-blue-800 text-white rounded-full lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white flex flex-col transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64`}>
        <div className="p-4 text-center text-xl font-bold border-b border-gray-700">Dashboard</div>
        <nav className="flex flex-col space-y-4 mt-4 p-4">
          {/* Sidebar links */}
          {[
            { name: 'Dashboard', icon: <FaTachometerAlt /> },
            { name: 'Transaction', icon: <FaUser /> },
            { name: 'WithdrawTransaction', icon: <FaUserCircle /> }, // New Withdraw Transaction tab
            { name: 'PaymentDetails', icon: <FaUserCircle /> },
            { name: 'Logout', icon: <FaSignOutAlt /> } // Add logout option
          ].map((tab, index) => (
            <button
              key={index}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-700 ${activeTab === tab.name ? 'bg-blue-700' : ''}`}
              onClick={() => {
                if (tab.name === 'Logout') {
                  handleLogout(); // Handle logout
                } else {
                  setActiveTab(tab.name);
                  setIsSidebarOpen(false); // Close the sidebar on tab click
                }
              }}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="text-2xl font-bold mb-4">{activeTab}</div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
