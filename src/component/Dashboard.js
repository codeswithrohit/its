import React, { useState } from 'react';
import { FaCopy, FaShare, FaWallet, FaUsers, FaCaretUp, FaExchangeAlt } from 'react-icons/fa';

const Dashboard = ({ userData, usersData }) => {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);

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
    .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);

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
  console.log("userdata",userData)

  return (
    <div className="min-h-screen px-4 py-8">
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
  <h1 className="md:text-4xl font-bold text-white text-center text-xl mb-8">Welcome To {userData?.name}</h1>
  <h1 className="md:text-4xl font-bold text-white text-center text-xl  mb-8">
  {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleString() : "Loading..."}
</h1>

  {/* <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome To {userData?.name}</h1>
  <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome To {userData?.name}</h1>
  <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome To {userData?.name}</h1> */}
</div>


      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-xl mx-auto">
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
        }].map((card, index) => (
          <div key={index} className={`${card.bg} ${card.borderColor} border-b-4 rounded-lg shadow-lg p-6`}>
            <div className="flex items-center">
              <div className={`rounded-full p-2 ${card.iconColor} shadow-lg text-white`}>
                {card.icon}
              </div>
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
