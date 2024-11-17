import React from 'react'
import Navbar from '../../component/navbar/Navbar'
import Top from '../../component/Top/Top'
import Advanced from '../../component/Advanced/Advanced'
import Footer from '../../component/Footer/Footer'
import Header from '../../component/Header/Header'
import TradingChart from '../../component/TradingChart'

const Trade = () => {
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
<TradingChart/>
      <Top/>
      <Advanced/>
      <Footer/>
    </div>
  )
}

export default Trade
