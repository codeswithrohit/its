import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';

const Directincome = () => {
  const [userData, setUserData] = useState(null);
  const [myuser, setMyuser] = useState(null);
  const [totalmoney, setTotalMoney] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const levelPercentages = [0.15, 0.10, 0.05, 0.04, 0.03, 0.02, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.01, 0.02, 0.03];

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setMyuser(user);
        const userRef = firebase.firestore().collection('users').doc(user.uid);

        const unsubscribeUserData = userRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log('No user data found');
          }
        });

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

  // Calculate total investment for a user
  const calculateTotalInvestment = (transactions) => {
    if (!transactions) return 0;
    return transactions
      .filter((transaction) => transaction.title === "Deposit for gainbot")
      .reduce((total, transaction) => total + parseFloat(transaction.amount || 0), 0);
  };

  if (!userData || !userData.tokenId) return <p>No user data available</p>;

  const userTokenId = userData.tokenId;

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-white">Level Income</h1>

      {[...Array(15)].map((_, level) => {
        const levelUsers = usersData.filter((user) => {
          const referralIds = user.referralId ? user.referralId.split(',') : [];
          return referralIds[level] === userTokenId;
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
                  <th className="py-3 px-4 border-b">Total Investment</th>
                </tr>
              </thead>
              <tbody>
                {levelUsers.length > 0 ? (
                  levelUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4 border-b">{user.name} {user.lname}</td>
                      <td className="py-3 px-4 border-b">{user.tokenId}</td>
                      <td className="py-3 px-4 border-b">${calculateTotalInvestment(user.Transaction).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-3 px-4 border-b text-center">
                      No Level {level + 1} Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Directincome;
