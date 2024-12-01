import React, { useEffect, useState } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [transactionSummary, setTransactionSummary] = useState({
        depositTotal: 0,
        withdrawalTotal: 0,
        totalProfit: 0
    });
    const [filters, setFilters] = useState({ name: '', tokenId: '' });
    const [transactionTitleFilter, setTransactionTitleFilter] = useState('');
    const [selectedTransactions, setSelectedTransactions] = useState([]); // Store selected transactions

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchTransaction = async () => {
            const db = firebase.firestore();
            const snapshot = await db.collection('users').get();
            const qrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sortedUsers = qrData.sort((a, b) => b.createdAt - a.createdAt);
            setUsers(sortedUsers);
            setFilteredUsers(sortedUsers);
        };
        fetchTransaction();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));

        const filtered = users.filter(user => {
            const matchesName = user.name?.toLowerCase().includes(filters.name.toLowerCase());
            const matchesTokenId = user.tokenId?.toLowerCase().includes(filters.tokenId.toLowerCase());
            return matchesName && matchesTokenId;
        });

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleTransactionTitleFilterChange = (e) => {
        setTransactionTitleFilter(e.target.value);
        setCurrentPage(1);

        if (selectedTransaction) {
            const filteredTransactions = selectedTransaction.filter(txn =>
                txn.title.toLowerCase().includes(e.target.value.toLowerCase())
            );

            handleShowTransactions(filteredTransactions);
        }
    };

    const handleShowTransactions = (transactions) => {
        setSelectedTransaction(transactions);

        const totalProfit = transactions
            .filter(tx => tx.title !== "Deposit for gainbot")
            .reduce((total, tx) => {
                if (tx.method.startsWith("Withdraw") && (tx.Status === "Pending" || tx.Status === "Paid")) {
                    return total - parseFloat(tx.amount || 0);
                }
                return total + parseFloat(tx.amount || 0);
            }, 0);

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

    const startOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startOffset, startOffset + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteSelectedTransactions = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete the selected transactions?");
        if (!isConfirmed) return;

        try {
            if (!selectedUser) {
                toast.error("User ID not found for these transactions.");
                return;
            }

            const db = firebase.firestore();
            const userRef = db.collection('users');
            const userQuerySnapshot = await userRef.where("tokenId", "==", selectedUser).get();

            if (userQuerySnapshot.empty) {
                toast.error("User document not found.");
                return;
            }

            const userDoc = userQuerySnapshot.docs[0];
            
            // Deleting selected transactions
            await userDoc.ref.update({
                Transaction: firebase.firestore.FieldValue.arrayRemove(...selectedTransactions)
            });

            setSelectedTransaction(prevTransactions =>
                prevTransactions.filter(txn => !selectedTransactions.some(selectedTxn => selectedTxn.title === txn.title))
            );

            setSelectedTransactions([]); // Clear selected transactions
            toast.success("Selected transactions deleted successfully!");
        } catch (error) {
            console.error("Error deleting transactions:", error);
            toast.error("Error deleting transactions. Please try again.");
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user.tokenId); // Set the selected user
        handleShowTransactions(user.Transaction); // Show their transactions
    };

    const handleTransactionSelect = (transaction) => {
        const isSelected = selectedTransactions.some(txn => txn.title === transaction.title);
        if (isSelected) {
            setSelectedTransactions(prev => prev.filter(txn => txn.title !== transaction.title)); // Deselect
        } else {
            setSelectedTransactions(prev => [...prev, transaction]); // Select
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
                                    onClick={() => handleSelectUser(user)} // Set user as selected user
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
                    className="px-2 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className="px-2 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}"
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="px-2 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Transaction Modal */}
            {selectedUser && selectedTransaction && (
                <div className="mt-6">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold">Transactions for User: {selectedUser}</h2>
                        <button
                            onClick={handleDeleteSelectedTransactions}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Selected
                        </button>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Filter by Title"
                            value={transactionTitleFilter}
                            onChange={handleTransactionTitleFilterChange}
                            className="border p-2 rounded"
                        />
                    </div>
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
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr>
                                <th className="p-2 border">Select</th>
                                <th className="p-2 border">Title</th>
                                <th className="p-3 text-left border-b">Date</th>
                                <th className="p-2 border">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        {selectedTransaction
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort transactions by date, latest first
                        .map((txn, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b">
                                    <td className="p-2 border">
                                        <input
                                            type="checkbox"
                                            checked={selectedTransactions.some(selectedTxn => selectedTxn.title === txn.title)}
                                            onChange={() => handleTransactionSelect(txn)}
                                        />
                                    </td>
                                    <td className="p-2 border">{txn.title}</td>
                                    <td className="p-3 border-b">{new Date(txn.date).toLocaleString()}</td>
                                    <td className="p-2 border">{txn.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
