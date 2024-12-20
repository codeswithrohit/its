import React, { useEffect, useState } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    const fetchTransaction = async () => {
      const db = firebase.firestore();
      const snapshot = await db.collection('users').get();
      const qrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(qrData);
    };
    fetchTransaction();
  }, []);

  // Filter transactions for title "Deposit for gainbot"
  const filteredTransactions = transactions.flatMap(user =>
    Array.isArray(user.Transaction) ?
      user.Transaction
        .filter(transaction => transaction.title === "Withdraw from gainbot")
        .map(transaction => ({
          ...transaction,
          name: user.name,
          email: user.email,
          number: user.number,
          userId: user.id // Keep the user ID for updates if needed
        })) : []
  ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending


  // Handle status update
  const handleUpdateStatus = async (userId, transactionTitle, transactionDate, newStatus) => {
    const db = firebase.firestore();
    // Find the user document
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const transactionIndex = userData.Transaction.findIndex(
        (transaction) =>
          transaction.title === transactionTitle && transaction.date === transactionDate
      );

      if (transactionIndex !== -1) {
        // Update the status of the transaction
        userData.Transaction[transactionIndex].Status = newStatus;
        await userDocRef.update({ Transaction: userData.Transaction });

        // Show a success message
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error('Transaction not found');
      }
    } else {
      toast.error('User not found');
    }
  };

  // Log the transactions data
  console.log("data", filteredTransactions);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Transaction</h1>

      {filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b px-4 py-2">Name</th>
                <th className="border-b px-4 py-2">Email</th>
                <th className="border-b px-4 py-2">Number</th>
                <th className="border-b px-4 py-2">Amount</th>
                <th className="border-b px-4 py-2">Withdrawal Amount</th>
                <th className="border-b px-4 py-2">Qr Code</th>
                <th className="border-b px-4 py-2">Id</th>
                <th className="border-b px-4 py-2">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">{transaction.name}</td>
                  <td className="border-b px-4 py-2">{transaction.email}</td>
                  <td className="border-b px-4 py-2">{transaction.number}</td>
                  <td className="border-b px-4 py-2">$ {transaction.amount}</td>
                  <td className="border-b px-4 py-2">$ {transaction.withdrawAmount}</td>
                  <td className="border-b px-4 py-2">
                    {transaction.qrcodeimage && (
                      <a href={transaction.qrcodeimaget} target="_blank" rel="noopener noreferrer">
                        View Image
                      </a>
                    )}
                  </td>
                  <td className="border-b px-4 py-2">{transaction.upiId}</td>
                  <td className="border-b px-4 py-2">
                    <select
                      value={transaction.Status} // Use the transaction's current status
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        handleUpdateStatus(transaction.userId, transaction.title, transaction.date, newStatus); // Call the update function
                      }}
                      className="p-2 border rounded"
                      disabled={transaction.Status === 'Paid'} // Disable if status is 'Paid'
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No transactions found for "Deposit for gainbot".</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default Transaction;
