import React, { useState } from 'react';
import { FaCopy, FaShare, FaWallet, FaUsers, FaCaretUp, FaExchangeAlt } from 'react-icons/fa';

const Dashboard = ({ userData, usersData }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = `http://gainbot.techbabua.com/register?referral=${userData?.tokenId}`;
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
        url: `http://gainbot.techbabua.com/register?referral=${userData?.tokenId}`,
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
    .filter(tx => tx.title.startsWith("Investment Income"))
    .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);
  const walletBalance = transactions
    .filter(tx => tx.method.startsWith("Deposit") && (tx.Status === "Paid" || !tx.Status))
    .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);
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

  return (
    <div className="min-h-screen  px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Welcome, {userData?.name}</h1>

      <div className=" bg-white rounded-lg shadow-lg p-6 mb-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Your Referral Code</h2>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="text"
            readOnly
            value={`http://gainbot.techbabua.com/register?referral=${userData?.tokenId}`}
            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 text-white rounded-lg transition ${
              copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
          iconColor: 'bg-pink-600'
        }, {
          title: 'My Team',
          value: totalUsers,
          icon: <FaUsers />,
          bg: 'bg-gradient-to-b from-yellow-200 to-yellow-100',
          borderColor: 'border-yellow-500',
          iconColor: 'bg-yellow-500'
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
              <div className={`rounded-full p-4 ${card.iconColor} shadow-lg text-white`}>
                {card.icon}
              </div>
              <div className="flex-1 text-right ml-4">
                <h2 className="font-semibold text-gray-700">{card.title}</h2>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
