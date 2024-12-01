import React, { useEffect, useState } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionSummary, setTransactionSummary] = useState({
        depositTotal: 0,
        withdrawalTotal: 0,
        totalProfit: 0
    });
    const [filters, setFilters] = useState({ name: '', tokenId: '' });
    const [transactionTitleFilter, setTransactionTitleFilter] = useState(''); // State for title search filter

    const ITEMS_PER_PAGE = 10; // Number of items per page

    useEffect(() => {
        const fetchTransaction = async () => {
            const db = firebase.firestore();
            const snapshot = await db.collection('users').get();
            const qrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort users by 'createdAt' field in descending order
            const sortedUsers = qrData.sort((a, b) => b.createdAt - a.createdAt);
            setUsers(sortedUsers);
            setFilteredUsers(sortedUsers);
        };
        fetchTransaction();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));

        // Apply filters to users
        const filtered = users.filter(user => {
            const matchesName = user.name?.toLowerCase().includes(filters.name.toLowerCase());
            const matchesTokenId = user.tokenId?.toLowerCase().includes(filters.tokenId.toLowerCase());
            return matchesName && matchesTokenId;
        });

        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to the first page when filters change
    };

    const handleTransactionTitleFilterChange = (e) => {
        setTransactionTitleFilter(e.target.value);
        setCurrentPage(1); // Reset to the first page when filter changes

        // Apply the transaction title filter to the selected transactions
        if (selectedTransaction) {
            const filteredTransactions = selectedTransaction.filter(txn =>
                txn.title.toLowerCase().includes(e.target.value.toLowerCase())
            );

            handleShowTransactions(filteredTransactions); // Update the displayed transactions based on filter
        }
    };

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

    // Pagination logic
    const startOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startOffset, startOffset + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleDeleteTransaction = async (transactionId) => {
        // Ask for confirmation before deleting the transaction
        const isConfirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (!isConfirmed) return; // If the user cancels the action, do nothing
    
        try {
            // Delete the transaction from Firestore
            const db = firebase.firestore();
            const userRef = db.collection('users').doc(selectedTransaction[0].userId); // Assuming the first transaction's user ID is enough for reference
            await userRef.update({
                Transaction: firebase.firestore.FieldValue.arrayRemove({ id: transactionId }) // Remove the transaction from the array
            });
    
            // Update the UI by removing the transaction from the selectedTransaction array
            setSelectedTransaction(prevTransactions =>
                prevTransactions.filter(txn => txn.id !== transactionId)
            );
    
            // Show a success toast notification
            toast.success("Transaction deleted successfully!");
        } catch (error) {
            // Show an error toast notification if something goes wrong
            toast.error("Error deleting transaction. Please try again.");
        }
    };
    
    
    return (
        <div className="container mx-auto p-4">
            <ToastContainer />

            {/* Filter Inputs */}
            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Filter by Name"
                    className="border p-2 rounded w-1/3"
                />
                <input
                    type="text"
                    name="tokenId"
                    value={filters.tokenId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Token ID"
                    className="border p-2 rounded w-1/3"
                />
            </div>

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Transactions</h2>
            
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                onClick={() => setSelectedTransaction(null)}
            >
                <span className="text-xl">×</span>
            </button>

            {/* Search Bar */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search by Title</label>
                <input
                    type="text"
                    value={transactionTitleFilter}
                    onChange={handleTransactionTitleFilterChange}
                    placeholder="Search Title"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Transaction Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="text-lg">
                    <strong>Deposit Total:</strong> {transactionSummary.depositTotal}
                </div>
                <div className="text-lg">
                    <strong>Withdrawal Total:</strong> {transactionSummary.withdrawalTotal}
                </div>
                <div className="text-lg">
                    <strong>Total Profit:</strong> {transactionSummary.totalProfit}
                </div>
            </div>

            {/* Transactions Table */}
            <table className="table-auto w-full mt-6 bg-gray-50 rounded-lg shadow-md border-separate border-spacing-0">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="p-3 text-left border-b">Title</th>
                        <th className="p-3 text-left border-b">Amount</th>
                        <th className="p-3 text-left border-b">Date</th>
                        <th className="p-3 text-left border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedTransaction
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort transactions by date, latest first
                        .map((txn, index) => (
                            <tr key={index} className="hover:bg-gray-100 transition-all duration-300">
                                <td className="p-3 border-b">{txn.title}</td>
                                <td className="p-3 border-b">{txn.amount}</td>
                                <td className="p-3 border-b">{new Date(txn.date).toLocaleString()}</td>
                                <td className="p-3 border-b">
                                    <button
                                        className="text-red-500 hover:text-red-700 underline"
                                        onClick={() => handleDeleteTransaction(txn.id)} // Pass the transaction id for deletion
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    </div>
)}

        </div>
    );
};

export default Users;
