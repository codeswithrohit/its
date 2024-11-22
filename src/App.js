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
import Adminogin from './pages/Admin/login';
import AdminRegister from './pages/Admin/register';
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
  const isDistributedRef = useRef(false);  // Ref to track if distribution has occurred

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setMyuser(user);
        const userRef = firebase.firestore().collection('users').doc(user.uid);

        // Listen for changes in the user's data
        const unsubscribeUserData = userRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
            const transactions = doc.data().Transaction || [];
            // console.log("Transaction", transactions);
            const depositTransactions = transactions
              .filter(
                (transaction) =>
                  transaction.title === "Deposit for gainbot" && transaction.Status === "Paid"
              )
              .map((transaction) => parseFloat(transaction.amount));

            if (depositTransactions.length > 0 && usersData.length > 0 && !isDistributedRef.current) {
              calculatedistributeDirectIncome(usersData);
              calculateDistributeLevelIncome(usersData)
              isDistributedRef.current = true;  // Ensure it's triggered only once
            }
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
  }, [usersData]);

  const transactions = userData?.Transaction || [];
  const myInvestment = transactions
  .filter(tx => tx.title === "Deposit for gainbot" && tx.Status === "Paid")
  .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);
  const totalProfit = transactions
  .filter(tx => tx.title !== "Deposit for gainbot")
  .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);

  const Capping = totalProfit/myInvestment

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
                  // console.log("Data updated:", data);
                  
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
                    // console.log(`Last update time: ${data.lastUpdated.toDate()}`);
                  }
                } else {
                  // console.log("No data update, forcing income distribution.");
                  // Call distributeInvestmentIncome when there are no data updates
                  distributeInvestmentIncome();
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
    if (Capping >= 4) {
      console.log("Capping limit reached. No further Trade Income updates.");
      return; // Skip income distribution if capping is 4 or more
    }
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
    if (Capping >= 4) {
      console.log("Capping limit reached. No further Affiliate Income or Sponsor Income updates.");
      return; // Skip income distribution if capping is 4 or more
    }
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
    const levelPercentages = [0.005, 0.0033, 0.0016, 0.0013, 0.001, 0.00066, 0.00033, 0.00016, 0.00016, 0.00016, 0.00016, 0.00016, 0.00033, 0.00066, 0.001]; // Level 1 to 15 percentages

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
    if (Capping >= 4) {
      console.log("Capping limit reached. No further Sponsor Income updates.");
      return 0; // Skip income distribution if capping is 4 or more
    }
    try {
      const currentDateTime = new Date().toISOString();
      const transactions = user.Transaction;
  
      if (!transactions || transactions.length === 0) {
        console.log(`No transactions found for user: ${user.name}`);
        return 0;
      }
  
      // Filter for transactions with titles that start with "Trade Income"
      const filteredTransactions = transactions.filter(
        (transaction) => transaction.title.startsWith("Trade Income")
      );
  
      if (filteredTransactions.length === 0) {
        console.log(`No relevant transactions found for user: ${user.name}`);
        return 0;
      }
  
      console.log("transaction level wise", filteredTransactions);
      let totalIncome = 0;
  
      // Sort transactions by date
      const sortedTransactions = filteredTransactions
        .map((transaction) => new Date(transaction.date))
        .sort((a, b) => a - b);
  
      const firstIncomeDate = sortedTransactions[0];
      const lastIncomeDate = sortedTransactions[sortedTransactions.length - 1];
  
      console.log("First income date:", firstIncomeDate);
      console.log("Last income date:", lastIncomeDate);
  
      // Detect and log missing dates
      const missingDates = [];
      let currentDate = new Date(firstIncomeDate);
      currentDate.setDate(currentDate.getDate() + 1);
  
      while (currentDate <= lastIncomeDate) {
        const dateString = currentDate.toLocaleDateString();
        const existingIncomeForDate = transactions.find(
          transaction => transaction.title === `Affiliate Income from ${user.tokenId} of ${dateString}`
        );
  
        if (!existingIncomeForDate) {
          missingDates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      const totalMissingDays = missingDates.length;
      console.log(`Missing level income for ${totalMissingDays} days.`);
      console.log("Missing dates:", missingDates.map(date => date.toLocaleDateString()));
  
      if (totalMissingDays > 0) {
        const batch = firebase.firestore().batch();
  
        missingDates.forEach(missingDate => {
          const dateString = missingDate.toLocaleDateString();
          const uniqueDepositId = `AffiliateIncome_${user.tokenId}_${missingDate.toISOString()}`;
  
          const depositData = {
            id: uniqueDepositId,
            amount: (percentage * 100).toFixed(2),  // Adjust the calculation as needed
            date: missingDate.toISOString(),
            method: 'Deposit',
            title: `Affiliate Income from ${user.tokenId} of ${dateString}`,
          };
  
          batch.update(firebase.firestore().collection('users').doc(myuser.uid), {
            Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
  
        await batch.commit();
        console.log(`Missing level income transactions updated for ${totalMissingDays} days.`);
      } else {
        console.log('All level income transactions are up to date.');
      }
  
      // Process daily transactions
      for (let transaction of filteredTransactions) {
        const transactionAmount = parseFloat(transaction.amount || 0);
        const incomeFromTransaction = transactionAmount * percentage;
        totalIncome += incomeFromTransaction;
  
        const today = new Date();
        const todayString = today.toLocaleDateString();
        const title = `Affiliate Income from ${user.tokenId} of ${todayString}`;
  
        const existingDeposits = await firebase.firestore().collection('users')
          .doc(myuser.uid)
          .get()
          .then(doc => doc.data().Transaction || [])
          .then(transactions => transactions.filter(deposit => deposit.title === title));
  
        if (existingDeposits.length === 0) {
          const depositData = {
            amount: incomeFromTransaction.toFixed(7),
            date: currentDateTime,
            paymentdate: transaction.date,
            method: 'Deposit',
            title: title,
          };
  
          await firebase.firestore().collection('users').doc(myuser.uid).update({
            Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
          });
  
          console.log(`Transaction updated for level income for user: ${user.name} ${user.lname}, Income from ${transaction.title}: + ₹${incomeFromTransaction}`);
        } else {
          console.log(`Deposit already exists for level income from user: ${user.name} for transaction: ${transaction.title}`);
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
        <Route path='/Admin/login' element={<Adminogin />} />
        <Route path='/Admin/register' element={<AdminRegister />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
