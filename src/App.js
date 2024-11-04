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
import { useState, useEffect } from "react";
import { firebase } from '../src/Firebase/config';
import Article from './pages/article/Article';

function App() {

  const [loading, setLoading] = useState(true);

  const [level1, setLevel1] = useState(null);
  const [level2, setLevel2] = useState(null);
  const [level1UserData, setLevel1UserData] = useState([]);
  const [level2UserData, setLevel2UserData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [percentageAmount, setPercentageAmount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [myuser, setMyuser] = useState(null);
  const [hasUpdatedToday, setHasUpdatedToday] = useState(false); // Track if update has been made today
  const [usersData, setUsersData] = useState([]);
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
                  distributeDirectIncome()
                  distributeLevelIncome()
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
    try {
      const userRef = firebase.firestore().collection('users').doc(myuser.uid);
      const userDoc = await userRef.get();
      const transactions = userDoc.data().Transaction || [];
  
      
  
      // Check if any transaction with title "Deposit" exists
      const hasDeposit = transactions.some(
        transaction => transaction.title === "Deposit for gainbot" && transaction.Status === "Paid"
      );
      
  
      if (hasDeposit ) {
        // Filter and sort investment income transactions by date
        const investmentIncomeTransactions = transactions
          .filter(transaction => transaction.title.startsWith("Investment Income"))
          .map(transaction => new Date(transaction.date))
          .sort((a, b) => a - b);
  
        if (investmentIncomeTransactions.length >= 1) {
          let firstIncomeDate = investmentIncomeTransactions[0];
          let lastIncomeDate = investmentIncomeTransactions[investmentIncomeTransactions.length - 1];
  
          console.log("First income date:", firstIncomeDate);
          console.log("Last income date:", lastIncomeDate);
  
          if (!lastIncomeDate) {
            lastIncomeDate = lastUpdated ? lastUpdated.toDate() : null;
          }
  
          if (!lastIncomeDate) {
            console.error('No last update date available to determine missing days.');
            return;
          }
  
          const daysBetweenFirstAndLast = Math.floor((lastIncomeDate - firstIncomeDate) / (1000 * 60 * 60 * 24));
          console.log(`Total days between first and last income date: ${daysBetweenFirstAndLast}`);
  
          const missingDates = [];
          let currentDate = new Date(firstIncomeDate);
          currentDate.setDate(currentDate.getDate() + 1);
  
          while (currentDate <= lastIncomeDate) {
            const dateString = currentDate.toLocaleDateString();
            const existingIncomeForDate = transactions.find(
              transaction => transaction.title === `Investment Income of ${dateString}`
            );
  
            if (!existingIncomeForDate) {
              missingDates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
  
          const totalMissingDays = missingDates.length;
          console.log(`Missing investment income for ${totalMissingDays} days.`);
          console.log("Missing dates:", missingDates.map(date => date.toLocaleDateString()));
  
          if (totalMissingDays === 0) {
            console.log('No missing dates found. All investment income transactions are up to date.');
            return;
          }
  
          const batch = firebase.firestore().batch();
          missingDates.forEach(missingDate => {
            const dateString = missingDate.toLocaleDateString();
            const uniqueDepositId = `InvestmentIncome_${myuser.uid}_${missingDate.toISOString()}`;
  
            const existingTransaction = transactions.find(transaction => transaction.id === uniqueDepositId);
  
            if (!existingTransaction) {
              const depositData = {
                id: uniqueDepositId,
                amount: percentageAmount.toFixed(2),
                date: missingDate.toISOString(),
                method: 'Deposit',
                title: `Investment Income of ${dateString}`,
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
          const currentDateTime = new Date().toISOString();
          const uniqueDepositId = `InvestmentIncome_${myuser.uid}_${currentDateTime}`;
  
          const existingDeposits = transactions.filter(
            transaction => transaction.title === `Investment Income of ${new Date().toLocaleDateString()}`
          );
  
          if (existingDeposits.length === 0) {
            const depositData = {
              id: uniqueDepositId,
              amount: percentageAmount.toFixed(2),
              date: currentDateTime,
              method: 'Deposit',
              title: `Investment Income of ${new Date().toLocaleDateString()}`,
            };
  
            await userRef.update({
              Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
              lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            });
  
            console.log(`Transaction updated for user: ${myuser.uid} at ${new Date().toLocaleTimeString()}`);
          } else {
            console.log(`Deposit already exists for today.`);
          }
          
          console.log("Multiple transactions found, skipping missing date check.");
        }
      } else {
        console.log("No eligible 'Deposit' transactions found or gainbot length is zero. Skipping update.");
      }
    } catch (error) {
      console.error('Error updating missing transactions: ', error);
    }
  };
  
  
  //directincome

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
          calculateDistributeLevelIncome(usersList);
          calculatedistributeDirectIncome(usersList); // Call to calculate income whenever users data changes
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
  
  const calculatedistributeDirectIncome = async (usersList) => {
    if (!myuser || !userData) return; // Ensure user data is available
  
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
  
    // Update transactions for level1 and level2 users
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

        const mybalance = parseFloat(user.totalbalance) + incomeFromTransaction;

        const uniqueDepositId = `DirectIncome_${user.id}_${transaction.title}_${transaction.date}`;

        const existingDeposits = await firebase.firestore().collection('users')
          .doc(myuser.uid)
          .get()
          .then(doc => doc.data().Transaction || [])
          .then(transactions => transactions.filter(deposit => deposit.id === uniqueDepositId));

        if (existingDeposits.length === 0) {
          const depositData = {
            id: uniqueDepositId,
            amount: incomeFromTransaction.toFixed(2),
            date: currentDateTime,
            paymentdate: `${transaction.date}`,
            method: 'Deposit',
            title: `Direct Income from ${user.name} ${user.lname}`,
            totalbalance: mybalance,
          };

          await firebase.firestore().collection('users').doc(myuser.uid).update({
            Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
            totalbalance: firebase.firestore.FieldValue.increment(incomeFromTransaction),
          });

          console.log(`Transaction updated for user: ${user.name}, Income from ${transaction.title}: + ₹${incomeFromTransaction}`);
        } else {
          console.log(`Deposit already exists for user: ${user.name} for transaction: ${transaction.title}`);
        }
      }

      return totalIncome;
    } catch (error) {
      console.error('Error updating transaction: ', error);
      return 0;
    }
  };
  
  //level income

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

        const mybalance = parseFloat(user.totalbalance) + incomeFromTransaction;

        const uniqueDepositId = `LevelIncome_${user.id}_${transaction.title}_${transaction.date}`;

        const existingDeposits = await firebase.firestore().collection('users')
          .doc(myuser.uid)
          .get()
          .then(doc => doc.data().Transaction || [])
          .then(transactions => transactions.filter(deposit => deposit.id === uniqueDepositId));

        if (existingDeposits.length === 0) {
          const depositData = {
            id: uniqueDepositId,
            amount: incomeFromTransaction.toFixed(2),
            date: currentDateTime,
            paymentdate: `${transaction.date}`,
            method: 'Deposit',
            title: `Level Income from ${user.name} ${user.lname}`,
            totalbalance: mybalance,
          };

          await firebase.firestore().collection('users').doc(myuser.uid).update({
            Transaction: firebase.firestore.FieldValue.arrayUnion(depositData),
            totalbalance: firebase.firestore.FieldValue.increment(incomeFromTransaction),
          });

          console.log(`Transaction updated  level income for user: ${user.name} ${user.lname}, Income from ${transaction.title}: + ₹${incomeFromTransaction}`);
        } else {
          console.log(`Deposit already exists for level user: ${user.name} for transaction: ${transaction.title}`);
        }
      }

      return totalIncome;
    } catch (error) {
      console.error('Error updating transaction: ', error);
      return 0;
    }
  };


 //RetopUp Income

 useEffect(() => {
  if (userData && userData.referralId) {
    const referralIds = userData.referralId.split(",");
    setLevel1(referralIds[0] || null);
    setLevel2(referralIds[1] || null);
  } else {
    // Handle case where referralId is missing
    setLevel1(null);
    setLevel2(null);
  }
}, [userData]);


  // Fetch Level 1 user data
  useEffect(() => {
    if (level1) {
      const usersRef = firebase.firestore().collection("users");
      const unsubscribeLevel1 = usersRef.where("tokenId", "==", level1).onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const level1Users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLevel1UserData(level1Users);
        }
      });
      return () => unsubscribeLevel1();
    }
  }, [level1]);

  // Fetch Level 2 user data
  useEffect(() => {
    if (level2) {
      const usersRef = firebase.firestore().collection("users");
      const unsubscribeLevel2 = usersRef.where("tokenId", "==", level2).onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const level2Users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLevel2UserData(level2Users);
        }
      });
      return () => unsubscribeLevel2();
    }
  }, [level2]);

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
