import React, { useState,useEffect } from 'react';
import { FaCopy, FaShare, FaWallet, FaUsers, FaCaretUp, FaExchangeAlt, FaBell } from 'react-icons/fa';
import { firebase } from '../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Dashboard = ({ userData, usersData }) => {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const copyToClipboard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = `https://gainbot.io/register?referral=${userData?.tokenId}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

console.log("notifications",notifications)
  useEffect(() => {
    // Fetch notifications from Firestore
    fetchNotifications();
  }, []);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const snapshot = await firebase.firestore().collection('notifications').get();
      const notificationsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsList);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      toast.error('Failed to fetch notifications');
      setLoading(false); // Set loading to false in case of error
    }
  };
  const notificationsToday = notifications.filter(notification => {
    const notificationDate = new Date(notification.date);
    const today = new Date();
    return notificationDate.toDateString() === today.toDateString();
  });
  const shareReferral = async () => {
    try {
      await navigator.share({
        title: 'Share Referral Link',
        text: 'Join me on GainBot and earn rewards!',
        url: `https://gainbot.io/register?referral=${userData?.tokenId}`,
      });
    } catch (error) {
      console.error('Sharing failed', error);
    }
  };

  const transactions = userData?.Transaction || [];
  const myInvestment = transactions
    .filter(tx => tx.title === "Deposit for gainbot" && tx.Status === "Paid")
    .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);
  const myProfit = transactions
    .filter(tx => tx.title.startsWith("Trade Income"))
    .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);
  
  const walletBalance = transactions
    .reduce((total, tx) => {
      if (tx.method.startsWith("Deposit") && (tx.Status === "Paid" || !tx.Status)) {
        return total + parseFloat(tx.amount || 0);
      }
      if (tx.method.startsWith("Withdraw") && (tx.Status === "Pending" || tx.Status === "Paid")) {
        return total - parseFloat(tx.amount || 0);
      }
      return total;
    }, 0);

    const totalProfit = transactions
    .filter(tx => tx.title !== "Deposit for gainbot")
    .reduce((total, tx) => {
      // Check if the transaction method starts with "Withdraw" and status is either "Pending" or "Paid"
      if (tx.method.startsWith("Withdraw") && (tx.Status === "Pending" || tx.Status === "Paid")) {
        return total - parseFloat(tx.amount || 0); // Subtract the amount for withdrawal transactions
      }
      return total + parseFloat(tx.amount || 0); // Add the amount for other transactions
    }, 0);
    const Capping = myInvestment !== 0 ? totalProfit / myInvestment : 0;

const totalcap = myInvestment*4
const Remainingcap = totalcap-totalProfit
  const userTokenId = userData?.tokenId;
  const totalUsers = usersData.filter(user => {
    const referralIds = user.referralId ? user.referralId.split(',') : [];
    return referralIds.includes(userTokenId);
  }).length;
  
  const totalDirect = usersData.filter(user => {
    const referralIds = user.referralId ? user.referralId.split(',') : [];
    return referralIds[0] === userTokenId;
  }).length;

  // Function to show pop-up with user data
  const handleViewDirect = () => {
    const directUsers = usersData.filter(user => user.referralId?.split(',')[0] === userTokenId);
    setPopupData(directUsers);
    setShowPopup(true);
  };

  const handleViewTeam = () => {
    const teamUsers = usersData.filter(user => user.referralId?.includes(userTokenId));
    setPopupData(teamUsers);
    setShowPopup(true);
  };
  const handleBellClick = () => {
    setShowNotification(prev => !prev);
  };

  return (
    <div className="min-h-screen px-4 py-8">
       <div className="absolute md:top-4 md:right-4 top-6 right-16">
        <div className="relative">
          <FaBell   onClick={handleBellClick} className="md:text-5xl text-4xl text-red-700 cursor-pointer" />
          {notificationsToday.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
              {notificationsToday.length}
            </span>
          )}
        </div>
        </div>
        {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="w-full h-full bg-gray-800 bg-opacity-90 top-0 overflow-y-auto overflow-x-hidden fixed sticky-0" id="chec-div">
            <div className="w-full absolute z-10 right-0 h-full overflow-x-hidden transform translate-x-0 transition ease-in-out duration-700" id="notification">
              <div className="2xl:w-4/12 bg-gray-50 h-screen overflow-y-auto p-8 absolute right-0">
                <button onClick={() => setShowNotification(false)} className="absolute top-4 text-4xl right-2 text-red-500 hover:text-red-800">
                  &times;
                </button>
                
                <h2 className="focus:outline-none text-sm leading-normal pt-8 border-b pb-2 border-gray-300 text-gray-600">TODAY</h2>
                {notificationsToday.map(notification => (
                  <div key={notification.id} className="w-full p-3 mt-6 bg-white rounded flex">
                    <div className="w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center">
                      <FaBell className="text-indigo-700" />
                    </div>
                    <div className="pl-3">
                      <p className="focus:outline-none text-sm leading-none text-indigo-700">{notification.title}</p>
                      <p className="focus:outline-none text-xs leading-3 pt-1 text-gray-500">{new Date(notification.date).toLocaleTimeString()}</p>
                      <p className="focus:outline-none text-xs pt-2 text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <hr className="w-full" />
                  <p className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500">That's it for now :)</p>
                  <hr className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
   {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 bg-gray-900">
          <div className="animate-spin border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
        </div>
      )}
<div className="flex items-center justify-center ">
  <div className=" p-4">
    <img src='/logo1.jpeg' className='w-24 h-24  rounded-lg object-contain' />
  </div>
</div>


    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
  <h1 className="md:text-4xl font-bold text-white text-center text-xl mb-8">Welcome, {userData?.name}</h1>
  <h1 className="md:text-4xl font-bold text-white text-center text-xl  mb-8">
    <span>Join at</span> <br/>
    <span className='text-md' >
  {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleString() : "Loading..."}
  </span>
</h1>
{/* <h1 className="md:text-4xl font-bold text-white text-center text-xl  mb-8">
    <span>Capping</span> <br/>
    <span className='text-md' >
    {Capping.toFixed(2)}X
  </span>
</h1> */}

  {/* <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome To {userData?.name}</h1>
  <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome To {userData?.name}</h1>
  <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome To {userData?.name}</h1> */}
</div>


      <div className="bg-white rounded-lg shadow-lg px-6 py-3 mb-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Your Referral Code</h2>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="text"
            readOnly
            value={`https://gainbot.io/register?referral=${userData?.tokenId}`}
            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 text-white rounded-lg transition ${copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button
          onClick={shareReferral}
          className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-all"
        >
          <FaShare className="mr-2" />
          Share Now
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full mx-auto">
        {[{
          title: 'My Investment',
          value: `$${myInvestment.toFixed(2)}`,
          icon: <FaWallet />,
          bg: 'bg-gradient-to-b from-blue-200 to-blue-100',
          borderColor: 'border-blue-600',
          iconColor: 'bg-blue-600'
        }, {
          title: 'My Profit',
          value: `$${myProfit.toFixed(2)}`,
          icon: <FaWallet />,
          bg: 'bg-gradient-to-b from-green-200 to-green-100',
          borderColor: 'border-green-600',
          iconColor: 'bg-green-600'
        }, {
          title: 'My Direct',
          value: totalDirect,
          icon: <FaUsers />,
          bg: 'bg-gradient-to-b from-pink-200 to-pink-100',
          borderColor: 'border-pink-500',
          iconColor: 'bg-pink-600',
          onClick: handleViewDirect
        }, {
          title: 'My Team',
          value: totalUsers,
          icon: <FaUsers />,
          bg: 'bg-gradient-to-b from-yellow-200 to-yellow-100',
          borderColor: 'border-yellow-500',
          iconColor: 'bg-yellow-500',
          onClick: handleViewTeam
        }, {
          title: 'Wallet Balance',
          value: `$${walletBalance.toFixed(2)}`,
          icon: <FaWallet />,
          bg: 'bg-gradient-to-b from-purple-200 to-purple-100',
          borderColor: 'border-purple-600',
          iconColor: 'bg-purple-600'
        }, {
          title: 'Total Profit',
          value: `$${totalProfit.toFixed(2)}`,
          icon: <FaWallet />,
          bg: 'bg-gradient-to-b from-teal-200 to-teal-100',
          borderColor: 'border-teal-600',
          iconColor: 'bg-teal-600'
        }, {
          title: 'Remaining Cap',
          value: `$${Remainingcap.toFixed(2)}`,
          icon: <FaWallet />,
          bg: 'bg-gradient-to-b from-purple-200 to-purple-100',
          borderColor: 'border-purple-600',
          iconColor: 'bg-purple-600'
        }, {
          title: 'Total Capiing',
          value: `$${totalcap.toFixed(2)}`,
          icon: <FaWallet />,
          bg: 'bg-gradient-to-b from-teal-200 to-teal-100',
          borderColor: 'border-teal-600',
          iconColor: 'bg-teal-600'
        }].map((card, index) => (
          <div key={index} className={`${card.bg} ${card.borderColor} border-b-4 rounded-lg shadow-lg p-6`}>
            <div className="flex items-center">
              {/* <div className={`rounded-full p-2 ${card.iconColor} shadow-lg text-white`}>
                {card.icon}
              </div> */}
              <div className="flex-1 text-right ml-4">
                <h2 className="font-semibold text-gray-700 md:text-xl text-sm">{card.title}</h2>
                <p className="text-3xl font-bold text-gray-900 md:text-2xl text-sm">{card.value}</p>
                {card.onClick && (
                  <button onClick={card.onClick} className="text-blue-600 hover:underline mt-2">View</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-Up for displaying user data */}
      {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-full h-auto max-h-[80vh] overflow-y-auto mx-auto">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <ul className="space-y-2">
        {popupData.map((user, index) => (
          <li key={index} className="border-b pb-2">
            <p>Name: {user.name} {user.lname}</p>
            <p>Sponsor ID: {user.tokenId}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowPopup(false)}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
  
      )}
    </div>
  );
};

export default Dashboard;
