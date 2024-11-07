import logo from './logo.svg';
import './App.css';
import './css/main.css';
import './css/bootstrap.min.css';
import Home from './pages/home/Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Faq from './pages/faq/Faq';
import Trade from './pages/Trade/Trade';
import Features from './pages/Features/Features';
import Contact from './pages/Contact/Contact';
import Dashboard from './pages/Admin/Dashboard';
import Profile from './pages/Profile';
import { useState, useEffect, useRef } from "react";
import { firebase } from '../src/Firebase/config';
import Article from './pages/article/Article';
import ForgotPassword from './pages/Forgotpassword/forgotpassword';

function App() {
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [percentageAmount, setPercentageAmount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [myuser, setMyuser] = useState(null);
  const [hasUpdatedToday, setHasUpdatedToday] = useState(false); // Track if update has been made today
  const [distributed, setDistributed] = useState(false);  // Track distribution status
  const isDistributedRef = useRef(false);  // Ref to track if distribution has occurred


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const unsubscribeAuth = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          setMyuser(user);
          try {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
  
            // Listen for changes in the user's data
            const unsubscribeUserData = userRef.onSnapshot((doc) => {
              if (doc.exists) {
                const data = doc.data();
                if (JSON.stringify(userData) !== JSON.stringify(data)) {
                  console.log("Data updated:", data);
                  setUserData(data);
                  setLoading(false);
  
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
  
                  setPercentageAmount(percentage);
  
                  if (data.lastUpdated) {
                    setLastUpdated(data.lastUpdated.toDate());
                    console.log(`Last update time: ${data.lastUpdated.toDate()}`);
                  }
                } else {
                  console.log("No data update, forcing income distribution.");
                  // Call distributeInvestmentIncome when there are no data updates
                  distributeInvestmentIncome();
                }
              } else {
                console.log("No user data found");
              }
            });
  
            // Listen for changes in the users collection
            const usersRef = firebase.firestore().collection('users');
            const unsubscribeUsersData = usersRef.onSnapshot((snapshot) => {
              const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              setUsersData(usersList);
  
              // Call the income distribution functions when the usersData updates
              if (usersList.length > 0 && !isDistributedRef.current) {
                console.log("Distributing income based on user data...");
                calculatedistributeDirectIncome(usersList); // Direct income distribution
                calculateDistributeLevelIncome(usersList); // Level income distribution
                isDistributedRef.current = true;  // Ensure it triggers only once
              }
            });
  
            return () => {
              unsubscribeUserData();
              unsubscribeUsersData();
            };
  
          } catch (error) {
            console.error("Error fetching user data: ", error);
          }
        } else {
          console.log("No user signed in");
          setLoading(false);
        }
      });
  
      return () => unsubscribeAuth();
    };
  
    fetchUserData();
  }, [myuser, userData, usersData]);
  


  useEffect(() => {
    const checkAndUpdateInvestmentTransaction = async () => {
      if (!myuser || !lastUpdated) return;
  
      const now = new Date();
      const lastUpdateDate = new Date(lastUpdated);
  
      if (now.toDateString() !== lastUpdateDate.toDateString() && !hasUpdatedToday) {
        await distributeInvestmentIncome(); // Update missing dates
        setHasUpdatedToday(true); 
        console.log(`Data updated today at ${now.toLocaleTimeString()}`);
      } else {
        console.log("Data was already updated today.");
      }
    };
  
    checkAndUpdateInvestmentTransaction();
    const interval = setInterval(() => {
      checkAndUpdateInvestmentTransaction();
    }, 60 * 1000);
  
    return () => clearInterval(interval);
  }, [lastUpdated, myuser, hasUpdatedToday]);
  
  const distributeInvestmentIncome = async () => {
    try {
      const userRef = firebase.firestore().collection('users').doc(myuser.uid);
      const userDoc = await userRef.get();
      const transactions = userDoc.data().Transaction || [];
  
      // Check if any transaction with title "Deposit" exists
      const hasDeposit = transactions.some(
        transaction => transaction.title === "Deposit for gainbot" && transaction.Status === "Paid"
      );
  
      if (hasDeposit) {
        // Filter and sort investment income transactions by date
        const investmentIncomeTransactions = transactions
          .filter(transaction => transaction.title.startsWith("Trade Income"))
          .map(transaction => new Date(transaction.date))
          .sort((a, b) => a - b);
  
        if (investmentIncomeTransactions.length >= 1) {
          let firstIncomeDate = investmentIncomeTransactions[0];
          let lastIncomeDate = investmentIncomeTransactions[investmentIncomeTransactions.length - 1];
  
          console.log("First income date:", firstIncomeDate);
          console.log("Last income date:", lastIncomeDate);
  
          const today = new Date();
          const todayString = today.toLocaleDateString();
          const existingIncomeToday = transactions.some(
            transaction => transaction.title === `Trade Income of ${todayString}`
          );
  
          if (!existingIncomeToday) {
            const uniqueDepositId = `TradeIncome_${myuser.uid}_${today.toISOString()}`;
            const depositData = {
              id: uniqueDepositId,
              amount: percentageAmount.toFixed(2),
              date: today.toISOString(),
              method: 'Deposit',
              title: `Trade Income of ${todayString}`,
            };
  
            await userRef.update({
              Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
              lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            });
  
            console.log(`Transaction updated for user: ${myuser.uid} on ${todayString}`);
          } else {
            console.log(`Deposit already exists for today: ${todayString}`);
          }
  
          // Calculate missing dates between first and last income dates
          const missingDates = [];
          let currentDate = new Date(firstIncomeDate);
          currentDate.setDate(currentDate.getDate() + 1);
  
          while (currentDate <= lastIncomeDate) {
            const dateString = currentDate.toLocaleDateString();
            const existingIncomeForDate = transactions.find(
              transaction => transaction.title === `Trade Income of ${dateString}`
            );
  
            if (!existingIncomeForDate) {
              missingDates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
  
          const totalMissingDays = missingDates.length;
          console.log(`Missing investment income for ${totalMissingDays} days.`);
          console.log("Missing dates:", missingDates.map(date => date.toLocaleDateString()));
  
          if (totalMissingDays > 0) {
            const batch = firebase.firestore().batch();
            missingDates.forEach(missingDate => {
              const dateString = missingDate.toLocaleDateString();
              const uniqueDepositId = `TradeIncome_${myuser.uid}_${missingDate.toISOString()}`;
  
              const existingTransaction = transactions.find(transaction => transaction.id === uniqueDepositId);
  
              if (!existingTransaction) {
                const depositData = {
                  id: uniqueDepositId,
                  amount: percentageAmount.toFixed(2),
                  date: missingDate.toISOString(),
                  method: 'Deposit',
                  title: `Trade Income of ${dateString}`,
                };
  
                batch.update(userRef, {
                  Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
                  lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            });
  
            await batch.commit();
            console.log(`Missing transactions updated for ${missingDates.length} days.`);
          } else {
            console.log('No missing dates found. All investment income transactions are up to date.');
          }
        } else {
          console.log("No investment income transactions found. Initial deposit will be created for today.");
  
          const currentDateTime = new Date().toISOString();
          const uniqueDepositId = `TradeIncome_${myuser.uid}_${currentDateTime}`;
          const depositData = {
            id: uniqueDepositId,
            amount: percentageAmount.toFixed(2),
            date: currentDateTime,
            method: 'Deposit',
            title: `Trade Income of ${new Date().toLocaleDateString()}`,
          };
  
          await userRef.update({
            Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          });
  
          console.log(`Initial transaction created for user: ${myuser.uid} on ${new Date().toLocaleDateString()}`);
        }
      } else {
        console.log("No eligible 'Deposit' transactions found. Skipping update.");
      }
    } catch (error) {
      console.error('Error updating missing transactions: ', error);
    }
  };

  const calculatedistributeDirectIncome = async (usersList) => {
    if (!myuser || !userData) return;

    const userTokenId = userData.tokenId;

    const level1Users = usersList.filter((user) => {
      const referralIds = user.referralId ? user.referralId.split(',') : [];
      return referralIds[0] === userTokenId;
    });

    const level2Users = usersList.filter((user) => {
      const referralIds = user.referralId ? user.referralId.split(',') : [];
      return referralIds[1] === userTokenId;
    });

    let totalIncome = 0;

    for (let level1User of level1Users) {
      totalIncome += await distributeDirectIncome(level1User, 0.05); // 5% for Level 1
    }

    for (let level2User of level2Users) {
      totalIncome += await distributeDirectIncome(level2User, 0.05); // 5% for Level 2
    }
  };

  const distributeDirectIncome = async (user, percentage) => {
    try {
      const currentDateTime = new Date().toISOString();
      const transactions = user.Transaction;

      if (!transactions || transactions.length === 0) {
        console.log(`No transactions found for user: ${user.name}`);
        return 0;
      }

      const filteredTransactions = transactions.filter(
        (transaction) => transaction.title === "Deposit for gainbot"
      );

      if (filteredTransactions.length === 0) {
        console.log(`No relevant transactions found for user: ${user.name}`);
        return 0;
      }

      let totalIncome = 0;

      for (let transaction of filteredTransactions) {
        const transactionAmount = parseFloat(transaction.amount || 0);
        const incomeFromTransaction = transactionAmount * percentage;
        totalIncome += incomeFromTransaction;

        const title = `Sponsor Income from ${user.tokenId}`;
        const paymentDate = `${transaction.date}`;

        // Check for existing deposits with the specific title and paymentDate
        const existingDeposits = await firebase.firestore().collection('users')
          .doc(myuser.uid)
          .get()
          .then(doc => doc.data().Transaction || [])
          .then(transactions => transactions.filter(deposit =>
            deposit.title === title ));

        if (existingDeposits.length === 0) {
          const depositData = {
            amount: incomeFromTransaction.toFixed(2),
            date: currentDateTime,
            paymentdate: paymentDate,
            method: 'Deposit',
            title: title,
          };

          // Add transaction using arrayUnion to avoid duplicate entries
          await firebase.firestore().collection('users').doc(myuser.uid).update({
            Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
          });

          console.log(`Transaction updated for user: ${user.name}, Income from ${transaction.title}: + ₹${incomeFromTransaction}`);
        } else {
          console.log(`Deposit already exists for Direct Income from user: ${user.name} for transaction: ${transaction.title}`);
        }
      }

      return totalIncome;
    } catch (error) {
      console.error('Error updating transaction: ', error);
      return 0;
    }
  };

  const calculateDistributeLevelIncome = async (usersList) => {
    if (!myuser || !userData) return; // Ensure user data is available

    const userTokenId = userData.tokenId;
    const levelPercentages = [0.15, 0.10, 0.05, 0.04, 0.03, 0.02, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.01, 0.02, 0.03]; // Level 1 to 15 percentages

    let totalIncome = 0;

    // Iterate over levels 1 to 15
    for (let level = 1; level <= 15; level++) {
      const levelUsers = usersList.filter((user) => {
        const referralIds = user.referralId ? user.referralId.split(',') : [];
        return referralIds[level - 1] === userTokenId; // level - 1 to match array index
      });

      for (let levelUser of levelUsers) {
        const depositData = await distributeLevelIncome(levelUser, levelPercentages[level - 1]); // Get percentage for the current level
        totalIncome += depositData; // Sum up the total income
      }
    }

    
  };

  const distributeLevelIncome = async (user, percentage) => {
    try {
      const currentDateTime = new Date().toISOString();
      const transactions = user.Transaction;

      if (!transactions || transactions.length === 0) {
        console.log(`No transactions found for user: ${user.name}`);
        return 0;
      }

      const filteredTransactions = transactions.filter(
        (transaction) => transaction.title === "Deposit for gainbot"
      );

      if (filteredTransactions.length === 0) {
        console.log(`No relevant transactions found for user: ${user.name}`);
        return 0;
      }

      let totalIncome = 0;

      for (let transaction of filteredTransactions) {
        const transactionAmount = parseFloat(transaction.amount || 0);
        const incomeFromTransaction = transactionAmount * percentage;
        totalIncome += incomeFromTransaction;

      

        const title = `Affiliate Income from ${user.tokenId}`;

        const existingDeposits = await firebase.firestore().collection('users')
        .doc(myuser.uid)
        .get()
        .then(doc => doc.data().Transaction || [])
        .then(transactions => transactions.filter(deposit =>
          deposit.title === title ));

        if (existingDeposits.length === 0) {
          const depositData = {
            amount: incomeFromTransaction.toFixed(2),
            date: currentDateTime,
            paymentdate: `${transaction.date}`,
            method: 'Deposit',
            title: title,
          };

          await firebase.firestore().collection('users').doc(myuser.uid).update({
            Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
          });

          console.log(`Transaction updated  level income for user: ${user.name} ${user.lname}, Income from ${transaction.title}: + ₹${incomeFromTransaction}`);
        } else {
          console.log(`Deposit already exists for level Income from user: ${user.name} for transaction: ${transaction.title}`);
        }
      }

      return totalIncome;
    } catch (error) {
      console.error('Error updating transaction: ', error);
      return 0;
    }
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/article' element={<Article />} />
        <Route path='/trade' element={<Trade />} />
        <Route path='/features' element={<Features />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/Admin/Dashboard' element={<Dashboard />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
