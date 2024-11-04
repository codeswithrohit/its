import React from 'react'
import Header from '../../component/Header/Header'
import Navbar from '../../component/navbar/Navbar'
import Hero from '../../component/hero/Hero'
import Innovator from '../../component/Innovator/Innovator'
import Matrix from '../../component/Matrix/Matrix'
import Investment from '../../component/Investment/Investment'
import Maximizing from '../../component/Maximizing/Maximizing'
import Unlock from '../../component/Unlock/Unlock'
import Advanced from '../../component/Advanced/Advanced'
import Top from '../../component/Top/Top'

import AdvancedPredictive from '../../component/AdvancedPredictive/AdvancedPredictive'
import Frequently from '../../component/Frequently/Frequently'
import Success from '../../component/Success/Success'
import Real from '../../component/Real/Real'
import Footer from '../../component/Footer/Footer'

const home = () => {
  return (
    <div>
      <Header/>
      <Navbar/>
      <Hero/>
      <Innovator/>
      <Matrix/>
      <Investment/>
      <Maximizing/>
      <Unlock/>
     <Advanced/>
     <Top/>
     <AdvancedPredictive/>
     <Frequently/>
     <Success/>
     <Real/>
     <Footer/>
    </div>
  )
}

export default home
