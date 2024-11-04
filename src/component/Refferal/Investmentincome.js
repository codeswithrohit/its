import { useState, useEffect } from "react";
import { firebase } from '../../Firebase/config';

const Investmentincome = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [charge, setCharge] = useState(0);
  const [totalAfterDeduction, setTotalAfterDeduction] = useState(0);
  const [percentageAmount, setPercentageAmount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [myuser, setMyuser] = useState(null);
  const [hasUpdatedToday, setHasUpdatedToday] = useState(false); // Track if update has been made today

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          setMyuser(user);
          try {
            const userRef = firebase.firestore().collection("users").doc(user.uid);

            // Set up real-time listener
            userRef.onSnapshot((doc) => {
              if (doc.exists) {
                const data = doc.data();
                if (JSON.stringify(userData) !== JSON.stringify(data)) {
                  console.log("Data updated:", data);
                  setUserData(data);

                  const transactions = data.Transaction || [];
                  const depositTransactions = transactions
                  .filter((transaction) => 
                      transaction.title === "Deposit for gainbot" && transaction.Status === "Paid"
                  )
                  .map((transaction) => parseFloat(transaction.amount));
              

                  const totalAmount = depositTransactions.reduce((acc, curr) => acc + curr, 0);
                  const deductionCharge = totalAmount * 0.15;
                  const adjustedTotal = totalAmount - deductionCharge;
                  const percentage = adjustedTotal * 0.0056;

                  setTotalDeposit(totalAmount);
                  setCharge(deductionCharge);
                  setTotalAfterDeduction(adjustedTotal);
                  setPercentageAmount(percentage);

                  if (data.lastUpdated) {
                    setLastUpdated(data.lastUpdated.toDate());
                    console.log(`Last update time: ${data.lastUpdated.toDate()}`);
                  }
                } else {
                  console.log("No data update, forcing income distribution.");
                  // Call distributeIncome when there are no data updates
                  // distributeIncome();
                }
              } else {
                console.log("No user data found");
              }
            });
          } catch (error) {
            console.error("Error fetching user data: ", error);
          }
        } else {
          console.log("No user signed in");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, [myuser, userData]);

  // useEffect(() => {
  //   const checkAndUpdateTransaction = async () => {
  //     if (!myuser || !lastUpdated) return;

  //     const now = new Date();
  //     const lastUpdateDate = new Date(lastUpdated);

  //     // Check if the last update was not today
  //     if (now.toDateString() !== lastUpdateDate.toDateString() && !hasUpdatedToday) {
  //       await distributeIncome();
  //       setHasUpdatedToday(true); // Mark that update has been made for today
  //       console.log(`Data updated today at ${now.toLocaleTimeString()}`);
  //     } else {
  //       console.log("Data was already updated today.");
  //     }
  //   };

  //   // Run the check immediately when the component mounts
  //   checkAndUpdateTransaction();

  //   // Set up an interval to check every minute
  //   const interval = setInterval(() => {
  //     checkAndUpdateTransaction();
  //   }, 60 * 1000); // Check every minute

  //   return () => clearInterval(interval);
  // }, [lastUpdated, myuser, hasUpdatedToday]); // Added hasUpdatedToday as a dependency

  // const distributeIncome = async () => {
  //   try {
  //     const currentDateTime = new Date().toISOString();
  //     const uniqueDepositId = `InvestmentIncome_${myuser.uid}_${currentDateTime}`;

  //     const userRef = firebase.firestore().collection('users').doc(myuser.uid);
  //     const userDoc = await userRef.get();
  //     const transactions = userDoc.data().Transaction || [];

  //     const existingDeposits = transactions.filter((transaction) => transaction.title === `Investment Income of ${new Date().toLocaleDateString()}`);

  //     // If no deposit for the day exists, add a new transaction
  //     if (existingDeposits.length === 0) {
  //       const depositData = {
  //         id: uniqueDepositId,
  //         amount: percentageAmount.toFixed(2),
  //         date: currentDateTime,
  //         method: 'Deposit',
  //         title: `Investment Income of ${new Date().toLocaleDateString()}`,
  //       };

  //       await userRef.update({
  //         Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
  //         lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
  //       });

  //       console.log(`Transaction updated for user: ${myuser.uid} at ${new Date().toLocaleTimeString()}`);
  //     } else {
  //       console.log(`Deposit already exists for today.`);
  //     }
  //   } catch (error) {
  //     console.error('Error updating transaction: ', error);
  //   }
  // };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Investment Income Summary</h1>

        {/* Total Deposit */}
        <div className="mb-4">
          <p className="text-lg text-gray-600">Total Deposit for Gainbot</p>
          <p className="text-3xl font-bold text-gray-900">${totalDeposit.toFixed(2)}</p>
        </div>

        {/* 15% Charge Deduction */}
        <div className="mb-4">
          <p className="text-lg text-gray-600">15% Charge Deduction</p>
          <p className="text-2xl font-semibold text-red-600">- ${charge.toFixed(2)}</p>
        </div>

        {/* Available Amount */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <p className="text-lg text-gray-600">Available Balance after Deduction</p>
          <p className="text-3xl font-bold text-green-600">${totalAfterDeduction.toFixed(2)}</p>
        </div>

        {/* 0.56% of Available Amount */}
        <div className="border-t border-gray-300 pt-4">
          <p className="text-lg text-gray-600">You have Daily Rewards</p>
          <p className="text-2xl font-bold text-blue-600">${percentageAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Investmentincome;
