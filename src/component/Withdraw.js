import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Withdraw = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('withdraw');
  const [upiId, setUpiId] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);

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
              calculateTotalBalance(doc.data().Transaction || []);
              const { qrdetails } = doc.data();
              if (qrdetails) {
                setUpiId(qrdetails.upiId || '');
                setQrCodeUrl(qrdetails.qrCodeUrl || '');
              }
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

  const calculateTotalBalance = (transactions) => {
    console.log("transactions", transactions); // Log the transactions array

    const total = transactions.reduce((acc, transaction) => {
        // Check if the transaction method is 'Deposit' and title is not 'Gainbot'
        if (transaction.method === 'Deposit' && transaction.title !== 'Deposit for gainbot') {
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



  const handleQrCodeUpload = async (file) => {
    if (file) {
      setQrCodeImage(file);
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`qr_codes/${file.name}`);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();
      setQrCodeUrl(fileUrl);
    }
  };

  const handleSave = async () => {
    if (!upiId || !qrCodeImage) {
      toast.error('Please fill in UPI ID and upload a QR code image.');
      return;
    }

    setIsSubmitting(true);
    try {
      await handleQrCodeUpload(qrCodeImage);
      const user = firebase.auth().currentUser;
      if (user) {
        await firebase.firestore().collection('users').doc(user.uid).update({
          qrdetails: { upiId, qrCodeUrl },
        });
        toast.success('QR details saved successfully!');
      }
    } catch (error) {
      console.error('Error saving QR details: ', error);
      toast.error('Failed to save QR details. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsEditMode(false);
    }
  };

  const handlePayment = async () => {
    const charge = parseFloat(amount) / 6;
    const withdrawAmount = parseFloat(amount) + charge; // Use the amount entered by the user
  
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount to withdraw.');
      return;
    }
  
    if (withdrawAmount < 8) {
      toast.error('The minimum withdrawal amount is $10.');
      return;
    }
  
    if (withdrawAmount > totalBalance) {
      toast.error('Withdrawal amount cannot exceed your total balance.');
      return;
    }
  
    const user = firebase.auth().currentUser;
    if (!user) {
      toast.error('User not authenticated.');
      return;
    }
  
    const currentDateTime = new Date().toISOString();
  
    // Check if qrCodeUrl is valid
    if (!qrCodeUrl) {
      toast.error('QR Code URL is missing or invalid.');
      return;
    }
  
    const depositData = {
      amount: withdrawAmount,
      date: currentDateTime,
      method: "Withdraw",
      title: 'Withdraw from gainbot',
      Status: "Pending",
      qrcodeimage: qrCodeUrl, // Ensure this is not empty or undefined
      upiId: upiId,
    };
  
    setIsSubmitting(true); // Set submitting to true to show loading state
  
    try {
      // Add transaction data to the user's document in Firestore
      await firebase.firestore().collection('users').doc(user.uid).update({
        Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
      });
  
      // Update the total balance for the user (if applicable)
      calculateTotalBalance([...userData.Transaction, depositData]);
  
      // Prepare deposit data for the Transaction collection
      const depositCollectionData = {
        ...depositData,
        name: userData?.name || 'Unknown',
        email: userData?.email || 'unknown@example.com',
        number: userData?.number || '0000000000',
        userid: user.uid,
      };
  
      // Add transaction details to the Transaction collection
      await firebase.firestore().collection('Transaction').add(depositCollectionData);
  
      // Show success message
      toast.success("Withdrawal successful! Funds will be transferred to your account within 24 hours.");
  
      setAmount(''); // Clear the amount input
    } catch (error) {
      console.error('Error processing withdrawal: ', error);
      toast.error('Failed to process withdrawal. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };
  

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 space-y-6  min-h-screen">
      <ToastContainer />

      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 mx-2 font-semibold rounded transition-colors duration-300 ${activeTab === 'withdraw' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab('arcade')}
            className={`flex-1 py-2 mx-2 font-semibold rounded transition-colors duration-300 ${activeTab === 'arcade' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            QR ID Info
          </button>
        </div>

        {activeTab === 'withdraw' ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Withdraw Funds</h2>
            <div className="text-center mb-4">
              {/* <p className="text-gray-600">Wallet Balance</p> */}
              <p className="text-3xl font-semibold text-green-600">${totalBalance.toFixed(2)}</p>
            </div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="amount">
              Enter Amount
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
               <p className="text-red-600">Withdrawal charges is 6%</p>
            <p className="text-green-600">Transaction amount in this ID: {upiId}</p>
            <button
              onClick={handlePayment} // Call handlePayment on click
              className="w-full px-4 py-2 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              disabled={isSubmitting} // Disable button if submitting
            >
              {isSubmitting ? 'Loading...' : 'Withdraw'} {/* Show loading text if submitting */}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">QR Detail Info</h2>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="upiId">
              UPI ID
            </label>
            <input
              type="text"
              id="upiId"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!isEditMode}
            />

            <label className="block text-gray-700 font-medium mb-1" htmlFor="qrCode">
              Upload QR Code Image
            </label>
            <input
              type="file"
              id="qrCode"
              accept="image/*"
              onChange={(e) => handleQrCodeUpload(e.target.files[0])}
              className="w-full mb-4"
              disabled={!isEditMode}
            />
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="mb-4" />}
            {isEditMode ? (
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Loading...' : 'Save'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                Edit QR Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
