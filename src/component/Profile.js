import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [updating, setUpdating] = useState(false); // State for "Updating..." message

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            const doc = await userRef.get();
            if (doc.exists) {
              setUserData(doc.data());
              setName(doc.data().name || '');
              setNumber(doc.data().number || '');
            } else {
              console.log('No user data found');
            }
          } catch (error) {
            console.error('Error fetching user data: ', error);
          }
        } else {
          console.log('No user signed in');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    };
    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    const user = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`profileImages/${user.uid}/${image.name}`);

    setUploading(true);
    try {
      await imageRef.put(image);
      const imageUrl = await imageRef.getDownloadURL();
      await firebase.firestore().collection('users').doc(user.uid).update({
        profileImageUrl: imageUrl,
      });
      setUserData((prevData) => ({ ...prevData, profileImageUrl: imageUrl }));
      setImage(null);
      setImagePreview(null);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image: ', error);
      toast.error("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const user = firebase.auth().currentUser;
    setUpdating(true); // Start updating state
    try {
      await firebase.firestore().collection('users').doc(user.uid).update({
        name: name,
        number: number,
      });
      setUserData((prevData) => ({ ...prevData, name, number }));
      toast.success("Profile updated successfully!");
      setEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Error updating profile: " + error.message);
    } finally {
      setUpdating(false); // End updating state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="w-16 h-16 animate-spin" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM10 1a9 9 0 110 18A9 9 0 0110 1z" />
        </svg>
      </div>
    );
  }

  if (!userData) {
    return <div className="text-center mt-4">No user data available.</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-10 transition duration-300 ease-in-out hover:shadow-xl">
      <div className="flex items-center mb-6">
        <div className="relative w-12 h-12 overflow-hidden bg-gray-200 rounded-lg shadow-md">
          {userData.profileImageUrl ? (
            <img src={userData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg
              className="absolute w-14 h-14 text-gray-400 -left-1 -top-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </div>
        {editing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ml-4 text-xl font-semibold text-gray-800 border-b"
            placeholder="Enter name"
          />
        ) : (
          <h2 className="ml-4 text-xl font-semibold text-gray-800">{userData.name}</h2>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
          <span className="font-medium text-gray-700">Email:</span>
          <span className="text-gray-600">{userData.email}</span>
        </div>
        <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
          <span className="font-medium text-gray-700">Phone Number:</span>
          {editing ? (
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="text-gray-600 border-b"
              placeholder="Enter phone number"
            />
          ) : (
            <span className="text-gray-600">{userData.number}</span>
          )}
        </div>
      </div>

      <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
      <button 
        onClick={handleUpload} 
        className={`mt-4 px-4 py-2 rounded-lg ${uploading ? 'bg-gray-500' : 'bg-blue-500'} text-white`} 
        disabled={uploading}
      >
        {uploading ? 'Loading...' : 'Upload Profile Image'}
      </button>

      <div className="mt-4">
        {editing ? (
          <button
            onClick={handleUpdateProfile}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            {updating ? 'Updating...' : 'Save Changes'}
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
