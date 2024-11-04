import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { BeatLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaDollarSign, FaCopy } from 'react-icons/fa'; // Import an icon for deposit representation
import { PiHandDepositFill } from "react-icons/pi";
const Walllet = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [userloading, setUserLoading] = useState(false);
  const [userData, setUserData] = useState(null); // State for user data
  const [totalBalance, setTotalBalance] = useState(0); // State for total balance
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);


  const MINIMUM_DEPOSIT = 25;

  useEffect(() => {
    const fetchQrCodes = async () => {
      const db = firebase.firestore();
      const snapshot = await db.collection('qrCodes').get();
      const qrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQrCodes(qrData);
    };
    fetchQrCodes();
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setUserLoading(true); // Start loading

      // Ensure Firebase Auth is initialized and get the current authenticated user
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            // Get data from the "users" collection based on the current user's UID
            const userRef = firebase.firestore().collection("users").doc(user.uid);
            const doc = await userRef.get();

            if (doc.exists) {
              // Set the user data in the state
              setUserData(doc.data());
              calculateTotalBalance(doc.data().Transaction || []); // Calculate initial balance
            } else {
              console.log("No user data found");
            }
          } catch (error) {
            console.error("Error fetching user data: ", error);
          }
        } else {
          console.log("No user signed in");
        }

        setUserLoading(false); // Stop loading after data is fetched or if there's no user
      });

      // Cleanup the subscription on unmount
      return () => unsubscribe();
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const calculateTotalBalance = (transactions) => {
    console.log("transactions", transactions); // Log the transactions array

    const total = transactions.reduce((acc, transaction) => {
        // Check if the transaction method is 'Deposit'
        if (transaction.method === 'Deposit') {
            // Check if the Status is 'Paid', or if it is not available (undefined or null)
            if (transaction.Status === 'Paid' || !transaction.Status) {
                return acc + parseFloat(transaction.amount); // Add the amount to the accumulator
            }
        }

        // Check if the transaction method is 'Withdraw'
        if (transaction.method === 'Withdraw') {
            // Check if the Status is 'Pending' or 'Paid'
            if (transaction.Status === 'Pending' || transaction.Status === 'Paid') {
                return acc - parseFloat(transaction.amount); // Subtract the amount from the accumulator
            }
            // If status is 'Failed', do nothing (the accumulator remains unchanged)
        }

        return acc; // Return the accumulator unchanged if conditions aren't met
    }, 0);

    setTotalBalance(total); // Set the total balance
};



  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPaymentScreenshot(e.target.files[0]);
    }
  };
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code); // Use the passed code directly
      toast.success('Code copied to clipboard!'); // Use toast instead of alert
    } catch (error) {
      console.error('Failed to copy: ', error);
      toast.error('Failed to copy code. Please try again.'); // Inform the user about the failure
    }
  };
  

  const handlePayment = async () => {
    if (amount < MINIMUM_DEPOSIT) {
      toast.error(`Minimum deposit amount is $${MINIMUM_DEPOSIT}.`);
      return;
    }
    if (!paymentScreenshot) {
      toast.error("Please upload a screenshot of your payment.");
      return;
    }

    setLoading(true);
    const user = firebase.auth().currentUser;
    const currentDateTime = new Date().toISOString();
    const total = Number(amount) + Number(totalBalance);

    // Upload the payment screenshot to Firebase Storage
    const storageRef = firebase.storage().ref();
    const screenshotRef = storageRef.child(`payments/${user.uid}/${paymentScreenshot.name}`);
    await screenshotRef.put(paymentScreenshot);
    const screenshotURL = await screenshotRef.getDownloadURL();

    const depositData = {
      amount: amount,
      date: currentDateTime,
      method: "Deposit",
      title: 'Deposit for gainbot',
      totalbalance: total,
      screenshot: screenshotURL,
       Status:"Pending"
    };

    await firebase.firestore().collection('users').doc(user.uid).update({
      Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
    });
    calculateTotalBalance([...userData.Transaction, depositData]);

    const depositCollectionData = {
      ...depositData,
      name: userData?.name || 'Unknown',
      email: userData?.email || 'unknown@example.com',
      number: userData?.number || '0000000000',
      userid: user.uid,
     
    };

    await firebase.firestore().collection('Transaction').add(depositCollectionData);

    toast.success("Deposit successful!");
    setLoading(false);
    setAmount('');
    setPaymentScreenshot(null);
  };

  return (
    <div className="flex  ">
         {userloading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-50 z-50">
          <BeatLoader loading={userloading} size={30} />
        </div>
      )}
     <div className="w-full px-4 flex flex-col md:flex-row md:space-x-6 space-y-6">
     <div className="w-96 md:w-[70%]  p-6 rounded-lg shadow-lg">
          {/* Balance section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Balance</h2>
            <p className="text-4xl font-bold flex items-center text-green-600 mt-2">
  <FaDollarSign className="mr-2" /> {totalBalance.toFixed(2)} {/* Show total balance with 2 decimal places */}
</p>

          </div>
          {/* All Transactions */}
          <div>
  <h3 className="text-xl font-semibold text-gray-900 mb-4">All Transactions</h3>
  <div className="p-4 bg-gray-100 rounded-lg text-gray-600">
    {userData && userData.Transaction && userData.Transaction.length > 0 ? (
      // Sort the transactions by date in descending order before mapping
      userData.Transaction
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((transaction, index) => (
          <div key={index} className="flex items-center justify-between border-b py-2">
            <div>
              <div className="flex items-center">
                <PiHandDepositFill className="text-green-600 mr-2" /> {/* Deposit icon */}
                <span className="font-bold">
  {transaction.title}
  {transaction.Status && ` (${transaction.Status})`}
</span>

              </div>
              <p className="text-sm text-center text-gray-500">{new Date(transaction.date).toLocaleString()}</p>
            </div>
            <div>
  <p className={`text-lg font-bold ${transaction.method === 'Withdraw' ? 'text-red-500' : 'text-green-600'}`}>
    <FaDollarSign className="inline mr-1" />
    {transaction.method === 'Withdraw' ? '-' : '+'}{transaction.amount} <br />
    {/* <span className='text-gray-900 text-md'>Bal: $ {transaction.totalbalance}</span> */}
  </p>
</div>

          </div>
        ))
    ) : (
      <p>No transactions yet.</p>
    )}
  </div>
</div>

        </div>

        <div className="w-96 md:w-[30%] bg-white p-6 rounded-lg shadow-lg">
          {/* Tabs for Deposit/Withdraw */}
          <div className="flex space-x-4 mb-1">
            <button
              className={`w-full py-2 font-bold text-center rounded-lg transition-colors duration-200 ${activeTab === 'deposit' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
              onClick={() => setActiveTab('deposit')}
            >
              Deposit
            </button>
            {/* <button
              className={`w-full py-2 font-bold text-center rounded-lg transition-colors duration-200 ${activeTab === 'withdraw' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
              onClick={() => setActiveTab('withdraw')}
            >
              Withdraw
            </button> */}
          </div>

          {/* Content for Deposit/Withdraw */}
          {activeTab === 'deposit' ? (
              <div>
              <h3 className="text-lg font-semibold ">Enter Amount in USD</h3>
              <div className="flex items-center border rounded-lg p-3 ">
                <FaDollarSign className="mr-2 text-gray-500" />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 outline-none text-lg text-gray-900"
                />
                
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Upload Screenshot of Payment</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded-lg" />
              </div>
              {qrCodes.map((qr) => (
              <div key={qr.id} className="mb-6 text-center">
                     <span className="text-sm text-gray-800 font-semibold">Scan this qr code to deposit money</span>
        <img src={qr.imageUrl}  alt="Arcade" className="w-full h-48 object-cover rounded-md mb-4" />
        <div className="mt-6 bg-black p-4 rounded-lg relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300 font-semibold">Copy id</span>
          <FaCopy 
  onClick={() => handleCopyCode(qr.id)} // Pass qr.id to the function
  className="text-gray-300 hover:text-white cursor-pointer"
/>
        </div>
        <pre className="text-white text-sm">
        {qr.id}
        </pre>
      </div>
      </div>
              ))}
              <button
                onClick={handlePayment}
                className={`w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 ${loading ? 'cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? <BeatLoader loading={loading} size={15} /> : 'Deposit'}
              </button>
            </div>
          ) : (
            <div>
              {/* <h3 className="text-lg font-semibold mb-2">Withdrawal Limit: {withdrawalLimit}</h3>
              <p className="text-sm text-gray-500 mb-4">Note: {note} is not withdrawable</p> */}
              {/* <div className="flex items-center border rounded-lg p-3 mb-4">
                <FaDollarSign className="mr-2 text-gray-500" />
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-2 outline-none text-lg text-gray-900"
                />
              </div>
             
              <button className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors duration-200">
                Withdraw Money
              </button> */}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Walllet