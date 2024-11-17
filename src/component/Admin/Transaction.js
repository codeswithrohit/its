import React, { useEffect, useState } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';

const ITEMS_PER_PAGE = 10; // Number of items per page

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTransaction = async () => {
      const db = firebase.firestore();
      const snapshot = await db.collection('users').get();
      const qrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(qrData);
    };
    fetchTransaction();
  }, []);

  const filteredTransactions = transactions.flatMap(user =>
    Array.isArray(user.Transaction)
      ? user.Transaction
          .filter(transaction => transaction.title === "Deposit for gainbot")
          .map(transaction => ({
            ...transaction,
            name: user.name,
            email: user.email,
            number: user.number,
            userId: user.id
          }))
      : []
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleUpdateStatus = async (userId, transactionTitle, transactionDate, newStatus) => {
    const db = firebase.firestore();
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const transactionIndex = userData.Transaction.findIndex(
        (transaction) =>
          transaction.title === transactionTitle && transaction.date === transactionDate
      );

      if (transactionIndex !== -1) {
        userData.Transaction[transactionIndex].Status = newStatus;
        await userDocRef.update({ Transaction: userData.Transaction });
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error('Transaction not found');
      }
    } else {
      toast.error('User not found');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Transaction</h1>

      {currentTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b px-4 py-2">Name</th>
                <th className="border-b px-4 py-2">Email</th>
                <th className="border-b px-4 py-2">Number</th>
                <th className="border-b px-4 py-2">Amount</th>
                <th className="border-b px-4 py-2">Screenshot</th>
                <th className="border-b px-4 py-2">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">{transaction.name}</td>
                  <td className="border-b px-4 py-2">{transaction.email}</td>
                  <td className="border-b px-4 py-2">{transaction.number}</td>
                  <td className="border-b px-4 py-2">$ {transaction.amount}</td>
                  <td className="border-b px-4 py-2">
                    {transaction.screenshot && (
                      <a className="text-blue-500" href={transaction.screenshot} target="_blank" rel="noopener noreferrer">
                        View Receipt
                      </a>
                    )}
                  </td>
                  <td className="border-b px-4 py-2">
                    <select
                      value={transaction.Status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        handleUpdateStatus(transaction.userId, transaction.title, transaction.date, newStatus);
                      }}
                      className="p-2 border rounded"
                      disabled={transaction.Status === 'Paid'}
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
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No transactions found for "Deposit for gainbot".</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default Transaction;
