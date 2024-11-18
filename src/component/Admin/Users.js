import React, { useEffect, useState } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionSummary, setTransactionSummary] = useState({
        depositTotal: 0,
        withdrawalTotal: 0,
        totalProfit: 0
    });

    const ITEMS_PER_PAGE = 10; // Number of items per page

    useEffect(() => {
        const fetchTransaction = async () => {
            const db = firebase.firestore();
            const snapshot = await db.collection('users').get();
            const qrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Sort users by 'createdAt' field in descending order
            const sortedUsers = qrData.sort((a, b) => b.createdAt - a.createdAt);
            setUsers(sortedUsers);
        };
        fetchTransaction();
    }, []);

    const handleShowTransactions = (transactions) => {
        setSelectedTransaction(transactions);

        // Calculate total profit using the specified method
        const totalProfit = transactions
            .filter(tx => tx.title !== "Deposit for gainbot")
            .reduce((total, tx) => {
                if (tx.method.startsWith("Withdraw") && (tx.Status === "Pending" || tx.Status === "Paid")) {
                    return total - parseFloat(tx.amount || 0); // Subtract the amount for withdrawals
                }
                return total + parseFloat(tx.amount || 0); // Add the amount for other transactions
            }, 0);

        // Calculate deposit and withdrawal totals for display
        let depositTotal = 0;
        let withdrawalTotal = 0;

        transactions.forEach(txn => {
            if (txn.title === "Deposit for gainbot") {
                depositTotal += parseFloat(txn.amount || 0);
            } else if (txn.method.startsWith("Withdraw")) {
                withdrawalTotal += parseFloat(txn.amount || 0);
            }
        });

        setTransactionSummary({
            depositTotal,
            withdrawalTotal,
            totalProfit
        });
    };


    console.log("users", users);

    // Pagination logic
    const startOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = users.slice(startOffset, startOffset + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <table className="table-auto w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Last Name</th>
                        <th className="p-2 border">Number</th>
                        <th className="p-2 border">Token ID</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Registration At</th>
                        <th className="p-2 border">Transactions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 border-b">
                            <td className="p-2 border">{user.name}</td>
                            <td className="p-2 border">{user.lname}</td>
                            <td className="p-2 border">{user.number}</td>
                            <td className="p-2 border">{user.tokenId}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">{new Date(user.createdAt.seconds * 1000).toLocaleDateString()}</td>
                            <td className="p-2 border">
                                <button
                                    className="text-blue-500 underline"
                                    onClick={() => handleShowTransactions(user.Transaction)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-center items-center space-x-2">
                <button
                    className={`px-2 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`px-2 py-1 border rounded ${
                            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className={`px-2 py-1 border rounded ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Modal for displaying transactions */}
            {selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Transactions</h2>
                        <div className="mb-4 p-4 bg-white shadow rounded-lg flex justify-between items-center gap-6">
  <div className="text-center">
    <p className="text-sm text-gray-500 font-medium">Total Deposit</p>
    <p className="text-lg font-bold text-green-600">
      ${transactionSummary.depositTotal.toFixed(2)}
    </p>
  </div>
  <div className="text-center">
    <p className="text-sm text-gray-500 font-medium">Total Withdrawal</p>
    <p className="text-lg font-bold text-red-600">
      ${transactionSummary.withdrawalTotal.toFixed(2)}
    </p>
  </div>
  <div className="text-center">
    <p className="text-sm text-gray-500 font-medium">Total Profit</p>
    <p className="text-lg font-bold text-blue-600">
      ${transactionSummary.totalProfit.toFixed(2)}
    </p>
  </div>
</div>

                        {selectedTransaction.map((txn, index) => (
                            <div key={index} className="mb-4 border-b pb-2">
                                <p><strong>Transaction for:</strong> {txn.title}</p>
                                <p><strong>Date:</strong> {new Date(txn.date).toLocaleString()}</p>
                                <p><strong>Amount:</strong> $ {txn.amount}</p>
                            </div>
                        ))}
               

                        <button
                            className="bg-red-500 text-white py-1 px-3 rounded"
                            onClick={() => setSelectedTransaction(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
