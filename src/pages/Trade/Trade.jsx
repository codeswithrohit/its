import React, { useState, useEffect } from 'react'
import { firebase } from '../../Firebase/config'
import Navbar from '../../component/navbar/Navbar'
import Top from '../../component/Top/Top'
import Advanced from '../../component/Advanced/Advanced'
import Footer from '../../component/Footer/Footer'
import Header from '../../component/Header/Header'

const Trade = () => {
  const [videoUrl, setVideoUrl] = useState('')
  useEffect(() => {
    const fetchVideo = async () => {
      const tradeRef = firebase.firestore().collection('trades')
      const snapshot = await tradeRef.orderBy("uploadDate", "desc").limit(1).get()

      if (!snapshot.empty) {
        const videoData = snapshot.docs[0].data()
        setVideoUrl(videoData.videoUrl)
      }
    }

    fetchVideo()
  }, [])
  return (
    <div>
      <Header/>
      <Navbar/>
      <div class="inner-banner img-adjust">
    <div class="linear-left"></div>
    <div class="linear-center"></div>
    <div class="linear-right"></div>
    <div class="container">
        <h2 class="inner-banner-title">Trade Overview</h2>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Trade Overview</li>
            </ol>
        </nav>
    </div>
</div>
<div className="video-container relative ">
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
           className="w-full max-h-[650px] object-cover rounded-lg shadow-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>

      <Top/>
      <Advanced/>
      <Footer/>
    </div>
  )
}

export default Trade
