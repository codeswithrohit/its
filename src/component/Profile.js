import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  console.log("userdata", userData);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-4">No user data available.</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">User Profile</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Name:</span>
          <span className="text-gray-600">{userData.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Last Name:</span>
          <span className="text-gray-600">{userData.lname}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Email:</span>
          <span className="text-gray-600">{userData.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Phone Number:</span>
          <span className="text-gray-600">{userData.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Token ID:</span>
          <span className="text-gray-600">{userData.tokenId}</span>
        </div>
        {/* <div className="flex justify-between">
          <span className="font-medium text-gray-700">Total Balance:</span>
          <span className="text-gray-600">{userData.totalbalance}</span>
        </div> */}
      </div>
    </div>
  );
}

export default Profile;
