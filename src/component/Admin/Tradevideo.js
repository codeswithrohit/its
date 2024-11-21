import React, { useState, useEffect } from 'react'
import { firebase } from '../../Firebase/config'
import { toast, ToastContainer } from 'react-toastify'

const Tradevideo = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showSubmitButton, setShowSubmitButton] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState(null) // Store the current video document ID in Firestore

  // Fetch existing video on component mount
  useEffect(() => {
    const fetchVideo = async () => {
      const tradeRef = firebase.firestore().collection('trades')
      const snapshot = await tradeRef.orderBy("uploadDate", "desc").limit(1).get()

      if (!snapshot.empty) {
        const videoData = snapshot.docs[0].data()
        setVideoUrl(videoData.videoUrl)
        setVideoId(snapshot.docs[0].id) // Save the document ID for updating later
      }
    }

    fetchVideo()
  }, [])

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setShowSubmitButton(true)
    }
  }

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error("Please select a video file first.")
      return
    }

    setIsUploading(true)
    const storageRef = firebase.storage().ref()
    const videoRef = storageRef.child(`videos/${videoFile.name}`)

    try {
      // Uploading video to Firebase Storage
      await videoRef.put(videoFile)
      const videoUrl = await videoRef.getDownloadURL()

      if (videoId) {
        // If videoId exists, it's an update operation
        await firebase.firestore().collection('trades').doc(videoId).update({
          videoUrl,
          uploadDate: new Date().toISOString()
        })
        toast.success("Video updated successfully!")
      } else {
        // Otherwise, it's a new video upload
        const tradeRef = firebase.firestore().collection('trades')
        const currentDate = new Date().toISOString()
        await tradeRef.add({
          videoUrl,
          uploadDate: currentDate
        })
        toast.success("Video uploaded successfully!")
      }

      setIsUploading(false)
    } catch (error) {
      toast.error("Error uploading video.")
      setIsUploading(false)
    }
  }

  const handleEdit = () => {
    setVideoFile(null)  // Reset the file state to allow file selection for editing
    setShowSubmitButton(true)  // Show submit button again for editing
  }

  return (
    <div className="relative">
      {/* Upload Button positioned at top-right */}
      <button
        onClick={() => document.getElementById('video-upload').click()}
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full"
      >
        Upload Trade Video
      </button>

      {/* Hidden file input */}
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        className="hidden"
      />

      {/* Show existing video */}
      {videoUrl && !videoFile && (
        <div className="mt-4">
          <video controls className="w-full h-auto">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button
            onClick={handleEdit}
            className="mt-4 bg-yellow-500 text-white p-2 rounded"
          >
            Edit Video
          </button>
        </div>
      )}

      {/* Conditional rendering of submit button */}
      {showSubmitButton && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white p-2 rounded"
            disabled={isUploading}
          >
            {isUploading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}

export default Tradevideo
