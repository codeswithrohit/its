import { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config"; // Ensure correct Firebase configuration is imported
import { FaEye } from "react-icons/fa";

const Retopup = () => {
  const [userData, setUserData] = useState(null);
  const [level1, setLevel1] = useState(null);
  const [level2, setLevel2] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [level1UserData, setLevel1UserData] = useState([]);
  const [level2UserData, setLevel2UserData] = useState([]);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Fetch current authenticated user data
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const unsubscribeUserData = userRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          }
        });
        return () => unsubscribeUserData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch referral data when userData is available
 // Fetch referral data when userData is available
// useEffect(() => {
//   if (userData && userData.referralId) {
//     const referralIds = userData.referralId.split(",");
//     setLevel1(referralIds[0] || null);
//     setLevel2(referralIds[1] || null);
//   } else {
//     // Handle case where referralId is missing
//     setLevel1(null);
//     setLevel2(null);
//   }
// }, [userData]);


//   // Fetch Level 1 user data
//   useEffect(() => {
//     if (level1) {
//       const usersRef = firebase.firestore().collection("users");
//       const unsubscribeLevel1 = usersRef.where("tokenId", "==", level1).onSnapshot((snapshot) => {
//         if (!snapshot.empty) {
//           const level1Users = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setLevel1UserData(level1Users);
//         }
//       });
//       return () => unsubscribeLevel1();
//     }
//   }, [level1]);

//   // Fetch Level 2 user data
//   useEffect(() => {
//     if (level2) {
//       const usersRef = firebase.firestore().collection("users");
//       const unsubscribeLevel2 = usersRef.where("tokenId", "==", level2).onSnapshot((snapshot) => {
//         if (!snapshot.empty) {
//           const level2Users = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setLevel2UserData(level2Users);
//         }
//       });
//       return () => unsubscribeLevel2();
//     }
//   }, [level2]);

  return (
    <div className="p-5">
      {/* Level 1 Users Table */}
      <div className="overflow-x-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Upline 1 </h2>
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
            {level1UserData.length > 0 ? (
              level1UserData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">{user.name} {user.lname}</td>
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
      <div className="overflow-x-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Upline 2 </h2>
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
            {level2UserData.length > 0 ? (
              level2UserData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">{user.name} {user.lname}</td>
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
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Transactions for {selectedUser.name}</h2>
            {selectedUser.Transaction && selectedUser.Transaction.length > 0 ? (
              <ul className="space-y-2">
                {selectedUser.Transaction.map((transaction, index) => (
                  <li key={index} className="p-3 border border-gray-300 rounded-md">
                    <p><strong>Title:</strong> {transaction.title}</p>
                    <p><strong>Amount:</strong> ₹{transaction.amount}</p>
                    <p><strong>Date:</strong> {transaction.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions found.</p>
            )}
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retopup;
