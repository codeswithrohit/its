import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const [showForm, setShowForm] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editNotificationId, setEditNotificationId] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch notifications from Firestore
    fetchNotifications();
  }, []);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const snapshot = await firebase.firestore().collection('notifications').get();
      const notificationsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsList);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      toast.error('Failed to fetch notifications');
      setLoading(false); // Set loading to false in case of error
    }
  };

  const handleFormToggle = () => {
    setShowForm(!showForm);
    setEditNotificationId(null); // Reset editing state when toggling form
    setNotificationTitle('');
    setNotificationMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notificationTitle || !notificationMessage) {
      toast.error('Please fill in both fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const notificationData = {
        title: notificationTitle,
        message: notificationMessage,
        date: new Date().toISOString(),
      };

      if (editNotificationId) {
        // Update existing notification
        await firebase.firestore().collection('notifications').doc(editNotificationId).update(notificationData);
        toast.success('Notification updated successfully');
      } else {
        // Create new notification
        await firebase.firestore().collection('notifications').add(notificationData);
        toast.success('Notification sent successfully');
      }

      setNotificationTitle('');
      setNotificationMessage('');
      setIsSubmitting(false);
      setShowForm(false);
      setEditNotificationId(null); // Reset editing state
      fetchNotifications(); // Refetch notifications after submit
    } catch (error) {
      toast.error('Failed to submit notification');
      setIsSubmitting(false);
    }
  };

  const handleEdit = (notification) => {
    setNotificationTitle(notification.title);
    setNotificationMessage(notification.message);
    setEditNotificationId(notification.id);
    setShowForm(true); // Show the form for editing
  };

  const handleDelete = async (id) => {
    try {
      await firebase.firestore().collection('notifications').doc(id).delete();
      toast.success('Notification deleted successfully');
      fetchNotifications(); // Refetch notifications after delete
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div>
      {/* Send Notification Button */}
      <button
        onClick={handleFormToggle}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        Send Notification
      </button>

      {/* Notification Form */}
      {showForm && (
        <div className="fixed top-20 right-4 bg-white p-6 rounded-lg shadow-lg w-80">
          <h3 className="text-xl font-semibold mb-4">{editNotificationId ? 'Edit Notification' : 'Create Notification'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 bg-gray-900">
          <div className="animate-spin border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
        </div>
      )}

      {/* Notification Table */}
      <div className="mt-8">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Title</th>
              <th className="px-4 py-2 text-left border-b">Message</th>
              <th className="px-4 py-2 text-left border-b">Date</th>
              <th className="px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td className="px-4 py-2 border-b">{notification.title}</td>
                <td className="px-4 py-2 border-b">{notification.message}</td>
                <td className="px-4 py-2 border-b">{new Date(notification.date).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(notification)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Notifications;
