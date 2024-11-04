import React from 'react'
import Header from '../../component/Header/Header'
import Navbar from '../../component/navbar/Navbar'
import Footer from '../../component/Footer/Footer'

const Contact = () => {
  return (
    <div>
      <Header/>
      <Navbar/>
      <div class="inner-banner img-adjust">
    <div class="linear-left"></div>
    <div class="linear-center"></div>
    <div class="linear-right"></div>
    <div class="container">
        <h2 class="inner-banner-title">Contact</h2>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Contact</li>
            </ol>
        </nav>
    </div>
</div>
    <section class="contact-section position-relative pt-110 pb-110">
        <div class="linear-left"></div>
        <div class="linear-right"></div>
        <div class="container">
            <div class="row g-0 align-items-stretch">
                <div class="col-lg-9">
                    <div class="urgent-call">
                        <div class="icon">
                            
                        </div>
                        <div class="text">
                            <h3>Prompt Support, Just an Hour Away</h3>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="address-wrapper" style={{background:" linear-gradient(90deg,rgba(0,0,0,.9),rgba(0,0,0,0.8))" }}>
                        <div class="address-item">
                            <div class="icon">
                                <i class="bi bi-envelope"></i>
                            </div>
                            <div class="content">
                                <h5>Email</h5>
                                <a href="mailto:+9943453453">Gainbot891@gmail.com</a>
                            </div>
                        </div>
                        <div class="address-item">
                            <div class="icon">
                                <i class="bi bi-telephone"></i>
                            </div>
                            <div class="content">
                                <h5>Phone</h5>
                                <a href="tel:+9943453453">+9943453453</a>
                            </div>
                        </div>
                        <div class="address-item">
                            <div class="icon">
                                <i class="bi bi-geo-alt"></i>
                            </div>
                            <div class="content">
                                <h5>Location</h5>
                                <p>123 Main Street, Suite 456 Cityville, State 78901</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="form-wrapper contact-form">
                        <div class="subtitle">
                            <h3>Connect With Us</h3>
                        </div>
                        <form method="POST" action="https://gainbot.io/contact/store">
                            <input type="hidden" name="_token" value="EhfO6qaw02t0QpZS4aPW84dZ3ub8q4G282EJAVxz" autocomplete="off"/>                            <div class="row">
                                <div class="col-12">
                                    <div class="form-inner">
                                        <label for="email">Email</label>
                                        <input type="email" id="email" name="email" value="" placeholder="Enter email"/>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="form-inner">
                                        <label for="subject">Subject</label>
                                        <input type="text" id="subject" name="subject" value="" placeholder="Enter subject"/>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="form-inner">
                                        <label for="message">Message</label>
                                        <textarea rows="5" id="message" name="message" placeholder="Write Your Message" required>  </textarea>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button class="i-btn btn--lg btn--primary w-100" type="submit">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <Footer/>
    </div>

  )
}

export default Contact
