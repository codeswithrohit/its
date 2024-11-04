import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { BeatLoader } from 'react-spinners';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaWallet, 
  FaUsers, 
  FaChartLine, 
  FaLifeRing, 
  FaUserCircle, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaMoneyCheckAlt // Import the Withdraw icon
} from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../component/Dashboard';
import Directincome from '../component/Refferal/Directincome';
import Investmentincome from '../component/Refferal/Investmentincome';
import LevelIncome from '../component/Refferal/Levelincome';
import RetopupIncome from '../component/Refferal/Retopup';
import Walllet from '../component/Wallet';
import Profiles from '../component/Profile';
import Withdraw from '../component/Withdraw'; // Import the Withdraw component

const Profile = () => {
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            const doc = await userRef.get();
            if (doc.exists) {
              setUserData(doc.data());
              const usersRef = firebase.firestore().collection('users');
              const unsubscribeUsersData = usersRef.onSnapshot((snapshot) => {
                const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setUsersData(usersList);
              });
              return () => unsubscribeUsersData();
            } else {
              console.log('No user data found');
            }
          } catch (error) {
            console.error('Error fetching user data: ', error);
          }
        } else {
          console.log('No user signed in');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigate('/')
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard userData={userData} usersData={usersData} />;
      case 'Profile':
        return <Profiles />;
      case 'Sponsor Income':
        return <div><Directincome /></div>;
      case 'Trade Income':
        return <div><Investmentincome /></div>;
      case 'Affiliate Income':
        return <div><LevelIncome /></div>;
      case 'Wallet':
        return <div><Walllet /></div>;
      case 'Withdraw': // Add case for Withdraw tab
        return <div><Withdraw /></div>;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <div 
      className="flex min-h-screen"
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149166910.jpg?t=st=1730680185~exp=1730683785~hmac=87a70cd22f5c4311c4ef56bc5fbe413d80031beb491286fe061a9b54f6ec1faa&w=2000)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <button
        className="absolute top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-full lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64`}>
        <div className="p-4 text-center text-xl font-bold border-b border-gray-700">Dashboard</div>
        <nav className="flex flex-col space-y-4 mt-4 p-4">
  {[
    { name: 'Dashboard', icon: <FaTachometerAlt /> },
    { name: 'Profile', icon: <FaUser /> },
    { name: 'Sponsor Income', icon: <FaWallet /> },
    { name: 'Trade Income', icon: <FaChartLine /> },
    { name: 'Affiliate Income', icon: <FaUsers /> },
    { name: 'Wallet', icon: <FaWallet /> },
    { name: 'Withdraw', icon: <FaMoneyCheckAlt /> }, // Add Withdraw tab here
    { name: 'Logout', icon: <FaSignOutAlt /> }
  ].map((tab, index) => (
    <button
      key={index}
      className={`flex items-center space-x-2 p-2 rounded hover:bg-white hover:text-black ${activeTab === tab.name ? 'bg-black text-white' : ''}`}
      onClick={() => {
        if (tab.name === 'Logout') {
          handleLogout();
        } else {
          setActiveTab(tab.name);
          if (window.innerWidth <= 768) { // Check if the screen size is mobile
            setIsSidebarOpen(false); // Close sidebar on mobile
          }
        }
      }}
    >
      {tab.icon}
      <span>{tab.name}</span>
    </button>
  ))}
</nav>

      </div>

      <div className="flex-1 py-4 bg-opacity-80 ">
        <div className="text-2xl font-bold text-white mb-4 ml-4">{activeTab}</div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
