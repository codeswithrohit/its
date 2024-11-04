import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
const Success = () => {
  return (
    <>
    
      <div class="testimonial-section pt-110 pb-110">
        <div class="quote">
          <i class="bi bi-quote"></i>
        </div>
        <div class="linear-left"></div>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5">
              <div class="section-title text-center mb-60">
                <h2>Success Stories from Our Clients</h2>
                <p>
                  Discover how FinFunder has empowered individuals and
                  businesses in their crypto trading and investment journey.{" "}
                </p>
              </div>
            </div>
          </div>

          <div class="row justify-content-center align-items-center gy-5 mb-30">
            <div class="col-xl-3">
              <div class="testimonial-card">
                <h5>Amazing !</h5>
                <ul>
                  <li>
                    <i class="bi bi-star-fill"></i>
                  </li>
                  <li>
                    <i class="bi bi-star-fill"></i>
                  </li>
                  <li>
                    <i class="bi bi-star-fill"></i>
                  </li>
                  <li>
                    <i class="bi bi-star-fill"></i>
                  </li>
                  <li>
                    <i class="bi bi-star"></i>
                  </li>
                </ul>
                <p>
                  <span>885 Reviews</span>
                </p>
              </div>
            </div>

            <div class="col-xl-9">
              <div class="swiper testimonial-slider">
              
                <div class="swiper-wrapper">
                <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
        
      >
                <SwiperSlide>
                <div class="">
                    <div class="testimonial-item">
                      <div class="content">
                        <p>
                          As a professional in finance, I&#039;m impressed by
                          FinFunder&#039;s precise market analytics and
                          user-friendly interface. It&#039;s revolutionized the
                          way I approach crypto investment. Highly recommended
                          for those who value data-driven decisions.
                        </p>
                        <div class="designation">
                          {/* <h6>Alex Johnson</h6> */}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                <div class="">
                    <div class="testimonial-item">
                      <div class="content">
                        <p>
                          {" "}
                          FinFunder&#039;s commitment to security and innovative
                          technology stands out in the crypto world. It&#039;s
                          the only platform I trust for managing my diverse
                          crypto portfolio. The interface is incredibly
                          intuitive, even for beginners.
                        </p>
                        <div class="designation">
                          {/* <h6>Emily Torres</h6> */}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                <div class="">
                    <div class="testimonial-item">
                      <div class="content">
                        <p>
                          What I love about FinFunder is the community aspect.
                          It&#039;s not just a trading platform; it&#039;s a hub
                          of knowledge and insights. The support team is
                          fantastic, always ready to help with any queries.
                        </p>
                        <div class="designation">
                          {/* <h6>David Kim</h6> */}
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                <div class="">
                    <div class="testimonial-item">
                      <div class="content">
                        <p>
                          I&#039;ve used several trading platforms, but
                          FinFunder stands out for its ease of use and
                          comprehensive features. It&#039;s my go-to for all my
                          crypto investments. The real-time data has been
                          crucial for my investment strategies.
                        </p>
                        <div class="designation">
                          {/* <h6>Sarah Bennett</h6> */}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                <div class="">
                    <div class="testimonial-item">
                      <div class="content">
                        <p>
                          From a developer&#039;s perspective, I appreciate
                          FinFunder&#039;s robust security measures and
                          cutting-edge tech. It&#039;s great to see a platform
                          that not only prioritizes user experience but also the
                          safety and integrity of digital assets.
                        </p>
                        <div class="designation">
                          {/* <h6>Michael Smith</h6> */}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                </Swiper>
                </div>
              
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </>
  );
};

export default Success;
