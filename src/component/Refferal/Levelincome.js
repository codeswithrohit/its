import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { BeatLoader } from 'react-spinners';
import { FaEye } from 'react-icons/fa';

const Directincome = () => {
  const [userData, setUserData] = useState(null);
  const [myuser, setMyuser] = useState(null);
  const [totalmoney, setTotalMoney] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const levelPercentages = [0.15, 0.10, 0.05, 0.04, 0.03, 0.02, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.01, 0.02, 0.03]; // Percentages for Levels 1 to 15

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setMyuser(user);
        const userRef = firebase.firestore().collection('users').doc(user.uid);

        // Listen for changes in the user's data
        const unsubscribeUserData = userRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log('No user data found');
          }
        });

        // Listen for changes in the users collection
        const usersRef = firebase.firestore().collection('users');
        const unsubscribeUsersData = usersRef.onSnapshot((snapshot) => {
          const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsersData(usersList);
        });

        return () => {
          unsubscribeUserData();
          unsubscribeUsersData();
        };
      } else {
        console.log('No user signed in');
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Function to calculate total balance from transactions
  const calculateTotalBalance = (transactions) => {
    return transactions.reduce((total, transaction) => total + parseFloat(transaction.amount || 0), 0);
  };

  useEffect(() => {
    if (userData && userData.Transaction) {
      const totalBalance = calculateTotalBalance(userData.Transaction);
      setTotalMoney(totalBalance);
      console.log("userdata", userData, "Total Balance from Transactions:", totalBalance);
    }
  }, [userData]);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (!userData || !userData.tokenId) return <p>No user data available</p>;

  const userTokenId = userData.tokenId;

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-white">Level Income</h1>

      {/* Users Table for Levels 1 to 15 */}
      {[...Array(15)].map((_, level) => {
        const levelUsers = usersData.filter((user) => {
          const referralIds = user.referralId ? user.referralId.split(',') : [];
          return referralIds[level] === userTokenId; // Level is the index
        });

        return (
          <div key={level} className="mt-12 overflow-x-auto">
            <h2 className="text-2xl text-white font-semibold mb-4">
              Level {level + 1} Users ({(levelPercentages[level] * 100).toFixed(2)}% / Month)
            </h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-600">
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">Sponsor Id</th>
                </tr>
              </thead>
              <tbody>
                {levelUsers.length > 0 ? (
                  levelUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4 border-b">{user.name} {user.lname}</td>
                      <td className="py-3 px-4 border-b">{user.tokenId}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="py-3 px-4 border-b text-center">
                      No Level {level + 1} Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Modal for Viewing User Transactions */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Transactions for {selectedUser.name}</h2>
            {/* Filter transactions to show only those with title "Deposit for gainbot" */}
            {(() => {
              const filteredTransactions = selectedUser.Transaction.filter(trans => trans.title === "Deposit for gainbot");
              console.log("Filtered Transactions:", filteredTransactions);

              return filteredTransactions.length > 0 ? (
                <>
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600">
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((trans) => (
                        <tr key={trans.date} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b">{trans.date}</td>
                          <td className="py-2 px-4 border-b">{trans.title}</td>
                          <td className="py-2 px-4 border-b">{trans.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Close
                  </button>
                </>
              ) : (
                <p className="text-center">No transactions found for this user.</p>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Directincome;
