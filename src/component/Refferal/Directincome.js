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
          // calculatedistributeDirectncome(usersList); 
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

  // const calculatedistributeDirectncome = async (usersList) => {
  //   if (!myuser || !userData) return; // Ensure user data is available

  //   const userTokenId = userData.tokenId;

  //   const level1Users = usersList.filter((user) => {
  //     const referralIds = user.referralId ? user.referralId.split(',') : [];
  //     return referralIds[0] === userTokenId;
  //   });

  //   const level2Users = usersList.filter((user) => {
  //     const referralIds = user.referralId ? user.referralId.split(',') : [];
  //     return referralIds[1] === userTokenId;
  //   });

  //   let totalIncome = 0;

  //   // Update transactions for level1 and level2 users
  //   for (let level1User of level1Users) {
  //     const depositData = await distributeDirectncome(level1User, 0.05); // 5% for Level 1
  //     totalIncome += depositData; // Sum up the total income
  //   }

  //   for (let level2User of level2Users) {
  //     const depositData = await distributeDirectncome(level2User, 0.05); // 5% for Level 2
  //     totalIncome += depositData;
  //   }

  //   // Update total money state
  //   setTotalMoney((prevTotal) => prevTotal + totalIncome);
  // };

  // const distributeDirectncome = async (user, percentage) => {
  //   try {
  //     const currentDateTime = new Date().toISOString();
  //     const transactions = user.Transaction;

  //     if (!transactions || transactions.length === 0) {
  //       console.log(`No transactions found for user: ${user.name}`);
  //       return 0;
  //     }

  //     const filteredTransactions = transactions.filter(
  //       (transaction) => transaction.title === "Deposit for gainbot"
  //     );

  //     if (filteredTransactions.length === 0) {
  //       console.log(`No relevant transactions found for user: ${user.name}`);
  //       return 0;
  //     }

  //     let totalIncome = 0;

  //     for (let transaction of filteredTransactions) {
  //       const transactionAmount = parseFloat(transaction.amount || 0);
  //       const incomeFromTransaction = transactionAmount * percentage;
  //       totalIncome += incomeFromTransaction;

  //       const mybalance = parseFloat(user.totalbalance) + incomeFromTransaction;

  //       const uniqueDepositId = `DirectIncome_${user.id}_${transaction.title}_${transaction.date}`;

  //       const existingDeposits = await firebase.firestore().collection('users')
  //         .doc(myuser.uid)
  //         .get()
  //         .then(doc => doc.data().Transaction || [])
  //         .then(transactions => transactions.filter(deposit => deposit.id === uniqueDepositId));

  //       if (existingDeposits.length === 0) {
  //         const depositData = {
  //           id: uniqueDepositId,
  //           amount: incomeFromTransaction.toFixed(2),
  //           date: currentDateTime,
  //           paymentdate: `${transaction.date}`,
  //           method: 'Deposit',
  //           title: `Direct Income from ${user.name} ${user.lname}`,
  //           totalbalance: mybalance,
  //         };

  //         await firebase.firestore().collection('users').doc(myuser.uid).update({
  //           Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
  //           totalbalance: firebase.firestore.FieldValue.increment(incomeFromTransaction),
  //         });

  //         console.log(`Transaction updated for user: ${user.name}, Income from ${transaction.title}: + ₹${incomeFromTransaction}`);
  //       } else {
  //         console.log(`Deposit already exists for user: ${user.name} for transaction: ${transaction.title}`);
  //       }
  //     }

  //     return totalIncome;
  //   } catch (error) {
  //     console.error('Error updating transaction: ', error);
  //     return 0;
  //   }
  // };

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

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex justify-center items-center bg-gray-200 z-50">
//         <BeatLoader loading={loading} size={30} color="#4A90E2" />
//       </div>
//     );
//   }

  if (!userData || !userData.tokenId) return <p>No user data available</p>;

  const userTokenId = userData.tokenId;

  const level1Users = usersData.filter((user) => {
    const referralIds = user.referralId ? user.referralId.split(',') : [];
    return referralIds[0] === userTokenId;
  });

  const level2Users = usersData.filter((user) => {
    const referralIds = user.referralId ? user.referralId.split(',') : [];
    return referralIds[1] === userTokenId;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Direct Income</h1>

      {/* Level 1 Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Number</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {level1Users.length > 0 ? (
              level1Users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">{user.name}</td>
                  <td className="py-3 px-4 border-b">{user.number}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b text-center">
                    <button
                      onClick={() => openModal(user)}
                      className="text-blue-500 hover:text-blue-700 transition flex items-center justify-center">
                      <FaEye className="mr-1" />
                      View Transactions
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 border-b text-center">
                  No Level 1 Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Level 2 Users Table */}
      <div className="mt-12 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Number</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {level2Users.length > 0 ? (
              level2Users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">{user.name}</td>
                  <td className="py-3 px-4 border-b">{user.number}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b text-center">
                    <button
                      onClick={() => openModal(user)}
                      className="text-blue-500 hover:text-blue-700 transition flex items-center justify-center">
                      <FaEye className="mr-1" />
                      View Transactions
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 border-b text-center">
                  No Level 2 Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
          <><table className="min-w-full bg-white border border-gray-300">
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

          </table><button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Close
            </button></>
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
