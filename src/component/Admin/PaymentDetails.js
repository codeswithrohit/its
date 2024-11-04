import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentDetails = () => {
  const [id, setId] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editDocId, setEditDocId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // Holds the current image URL for editing

  // Fetch QR codes from Firestore
  useEffect(() => {
    const fetchQrCodes = async () => {
      const db = firebase.firestore();
      const snapshot = await db.collection('qrCodes').get();
      const qrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQrCodes(qrData);
    };
    fetchQrCodes();
  }, [isSubmitting]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setQrImage(e.target.files[0]);
      setCurrentImageUrl(null); // Hide current image preview if a new image is selected
    }
  };

  const handleEdit = (qr) => {
    setId(qr.id); // This is your custom ID field
    setIsEditing(true);
    setEditDocId(qr.id); // Use qr.id for document ID
    setShowForm(true);
    setCurrentImageUrl(qr.imageUrl); // Set current image URL to show in the form
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || (!qrImage && !isEditing)) {
      toast.error('Please provide both ID and QR code image');
      return;
    }
    setIsSubmitting(true);

    try {
        let imageUrl = currentImageUrl;
        if (qrImage) {
            // Upload image to Firebase Storage
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`qrcodes/${qrImage.name}`);
            await imageRef.put(qrImage);
            imageUrl = await imageRef.getDownloadURL();
        }

        const db = firebase.firestore();
        if (isEditing) {
            // Update existing QR code
            await db.collection('qrCodes')
            .where("id", "==", editDocId) // Corrected the where condition
            .get() // Use get() to retrieve the documents matching the query
            .then(snapshot => {
                if (!snapshot.empty) {
                    // Loop through each document in the snapshot
                    snapshot.forEach(doc => {
                        // Update each document found
                        db.collection('qrCodes').doc(doc.id).update({
                            id, // your custom ID field
                            imageUrl,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        });
                    });
                } else {
                    console.log('No matching documents found.');
                }
            })
            .catch(error => {
                console.error('Error updating document: ', error);
            });
        
            toast.success('QR code updated successfully!');
        } else {
            // Add new QR code
            await db.collection('qrCodes').add({
                id, // your custom ID field
                imageUrl,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            toast.success('QR code uploaded successfully!');
        }

        // Reset form
        setId('');
        setQrImage(null);
        setIsEditing(false);
        setEditDocId(null);
        setCurrentImageUrl(null);
    } catch (error) {
        console.error('Error uploading/updating QR code:', error);
        const errorMessage = error.message.includes("not found") 
            ? 'Document does not exist for update' 
            : 'Failed to upload/update QR code';
        toast.error(errorMessage);
    } finally {
        setIsSubmitting(false);
        setShowForm(false);
    }
};

  

 
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      {/* <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        {showForm ? 'Hide Form' : 'Upload QR Code Data'}
      </button> */}

      {showForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {isEditing ? 'Edit Payment QR Code' : 'Upload Payment QR Code'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">ID</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ID"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">QR Code Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-lg cursor-pointer"
              />
              {currentImageUrl && !qrImage && (
                <div className="mt-4">
                  <p className="text-gray-700">Current Image:</p>
                  <img src={currentImageUrl} alt="Current QR Code" className="w-16 h-16 mt-2" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : isEditing ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">QR Code List</h2>
        <ul>
          {qrCodes.map((qr) => (
            <li key={qr.id} className="flex items-center justify-between mb-4">
              <div>
                <p>ID: {qr.id}</p>
                <img src={qr.imageUrl} alt="QR Code" className="w-16 h-16 mt-2" />
              </div>
              <button
                onClick={() => handleEdit(qr)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PaymentDetails;
