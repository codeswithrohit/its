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
  const [userData, setUserData] = useState(null);
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
  
      // Filter and sort investment income transactions by date
      const investmentIncomeTransactions = transactions
        .filter((transaction) => transaction.title.startsWith("Investment Income"))
        .map((transaction) => new Date(transaction.date))
        .sort((a, b) => a - b); // Sort by date, earliest first
  
      if (investmentIncomeTransactions.length >= 1) {
        
      let firstIncomeDate = investmentIncomeTransactions[0]; // Earliest date
      let lastIncomeDate = investmentIncomeTransactions[investmentIncomeTransactions.length - 1]; // Latest date
  
      console.log("First income date:", firstIncomeDate);
      console.log("Last income date:", lastIncomeDate);
  
      // If no last income date, use lastUpdated date
      if (!lastIncomeDate) {
        lastIncomeDate = lastUpdated ? lastUpdated.toDate() : null;
      }
  
      // If there's no last income or last update date, return
      if (!lastIncomeDate) {
        console.error('No last update date available to determine missing days.');
        return;
      }
  
      // Calculate the total number of days between the first and last income date
      const daysBetweenFirstAndLast = Math.floor((lastIncomeDate - firstIncomeDate) / (1000 * 60 * 60 * 24));
      console.log(`Total days between first and last income date: ${daysBetweenFirstAndLast}`);
  
      // Find missing dates between the first and last income date
      const missingDates = [];
      let currentDate = new Date(firstIncomeDate);
      currentDate.setDate(currentDate.getDate() + 1); // Start from the day after the first income date
  
      while (currentDate <= lastIncomeDate) {
        const dateString = currentDate.toLocaleDateString();
        const existingIncomeForDate = transactions.find(
          (transaction) => transaction.title === `Investment Income of ${dateString}`
        );
  
        if (!existingIncomeForDate) {
          missingDates.push(new Date(currentDate)); // Add missing date
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      // Check how many dates are missing
      const totalMissingDays = missingDates.length;
      console.log(`Missing investment income for ${totalMissingDays} days.`);
      console.log("Missing dates:", missingDates.map(date => date.toLocaleDateString()));
  
      // Count the total number of investment income transactions
      const totalInvestmentIncomeCount = investmentIncomeTransactions.length;
      console.log(`Total number of investment income transactions: ${totalInvestmentIncomeCount}`);
  
      // If no missing dates, return
      if (totalMissingDays === 0) {
        console.log('No missing dates found. All investment income transactions are up to date.');
        return;
      }
        const batch = firebase.firestore().batch();
        missingDates.forEach((missingDate) => {
          const dateString = missingDate.toLocaleDateString();
          const uniqueDepositId = `InvestmentIncome_${myuser.uid}_${missingDate.toISOString()}`;
          
          // Check if the transaction with this unique ID already exists
          const existingTransaction = transactions.find(transaction => transaction.id === uniqueDepositId);
          
          if (!existingTransaction) { // Only add if it doesn't already exist
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
          (transaction) => transaction.title === `Investment Income of ${new Date().toLocaleDateString()}`
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
    } catch (error) {
      console.error('Error updating missing transactions: ', error);
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
