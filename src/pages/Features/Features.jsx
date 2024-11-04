import React from 'react'
import Header from '../../component/Header/Header'
import Navbar from '../../component/navbar/Navbar'
import Innovator from '../../component/Innovator/Innovator'
import Footer from '../../component/Footer/Footer'

const Features = () => {
  return (
    <div>
      <Header/>
      <Navbar/>
      <div class="inner-banner img-adjust">
    <div class="linear-left"></div>
    <div class="linear-center"></div>
    <div class="linear-right"></div>
    <div class="container">
        <h2 class="inner-banner-title">Features</h2>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Features</li>
            </ol>
        </nav>
    </div>
</div>
<Innovator/>
<Footer/>
    </div>
  )
}

export default Features
