import React from 'react'
import Frequently from '../../component/Frequently/Frequently'
import Header from '../../component/Header/Header'
import Navbar from '../../component/navbar/Navbar'

const Faq = () => {
  return (
    <div>
    <Header/>
    <Navbar/>
    <div class="inner-banner img-adjust">
    <div class="linear-left"></div>
    <div class="linear-center"></div>
    <div class="linear-right"></div>
    <div class="container">
        <h2 class="inner-banner-title">Faq</h2>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Faq</li>
            </ol>
        </nav>
    </div>
</div>
    <Frequently/>
      
    </div>
  )
}

export default Faq
