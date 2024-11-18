import React from "react";

const Footer = () => {
  return (
    <div>
      <footer class="pt-10 position-relative">
        <div class="footer-vector">
          {/* <img src="default/images/481x481.jpg" alt="Vector Image" /> */}
        </div>
        <div class="container">
          <div class="row align-items-end mb-60 gy-4">
            <div class="col-lg-7 pe-lg-5">
              <div class="footer-logo mb-4">
                <img src="https://gainbot.io/assets/files/FEStVr9r2DrfajwT.png" alt="white logo" />
              </div>
              <h5 class="footer-title mb-0">
                Subscribe to our newsletter for the latest crypto trends,
                GainBot updates, and exclusive insights.
              </h5>
            </div>

            <div class="col-lg-5">
              <div class="newsletter-box row align-items-center g-4">
                <form class="subscribe-form" method="POST">
                  <div class="input-wrapper">
                    <input
                      type="email"
                      id="email_subscribe"
                      placeholder="Your Email Address"
                      required
                    />
                    <button>
                      <i class="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="row gy-5">
            <div class="col-lg-5 col-md-12 pe-lg-5">
              <p class="mb-5">
                GainBot is your trusted partner in navigating the crypto world.
                We&#039;re here to assist you 24/7 with any queries and provide
                support for your trading and investment needs. Discover more
                about us, access our help center, and follow our social channels
                for the latest updates and insights.
              </p>
              <div class="payment-logos">
                {/* <img src="default/images/583x83.jpg" alt="image" /> */}
              </div>
            </div>

            <div class="col-lg-2 col-md-6 col-6">
              <h5 class="footer-title">Important Link</h5>
              <ul class="footer-menu">
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li>
                  <a href="trades.html">Trade</a>
                </li>
                <li>
                  <a href="page/plans.html">Pricing</a>
                </li>
                <li>
                  <a href="page/features.html">Features</a>
                </li>
                <li>
                  <a href="page/faq.html">FAQ</a>
                </li>
              </ul>
            </div>

            <div class="col-lg-2 col-md-6 col-6">
              <h5 class="footer-title">Quick Link</h5>
              <ul class="footer-menu">
                <li>
                  <a href="quick/privacy-policy/65.html">Privacy Policy</a>
                </li>
                <li>
                  <a href="quick/terms-conditions/66.html">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a href="contact.html">Contact</a>
                </li>
              </ul>
            </div>

            <div class="col-lg-3">
              <div class="footer-address-wrapper">
                <div class="address-item d-flex gap-2">
                  <i class="bi bi-envelope text-white"></i>
                  <a class="address" href="mailto:info@example.com">
                    info@example.com
                  </a>
                </div>
                <div class="address-item d-flex gap-2">
                  <i class="bi bi-telephone text-white"></i>
                  <a class="address" href="tel:+9943453453">
                    +9943453453
                  </a>
                </div>
                <div class="address-item d-flex gap-2">
                  <i class="bi bi-geo-alt text-white"></i>
                  <div class="address">
                    123 Main Street, Suite 456 Cityville, State 78901
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="container">
            <div class="row">
              <div class="col-lg-6 col-lg-6 text-lg-start text-center">
                <ul class="footer-social">
                  <li>
                    <a href="https://www.facebook.com/">
                      <i class="bi bi-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com/">
                      <i class="bi bi-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/">
                      <i class="bi bi-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.tiktok.com/">
                      <i class="bi bi-tiktok"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.telegram.com/">
                      <i class="bi bi-telegram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-6 col-lg-6 text-lg-end text-center">
                <p>© 2024byGainBot. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
