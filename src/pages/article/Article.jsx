import React from 'react'
import Header from '../../component/Header/Header'
import Navbar from '../../component/navbar/Navbar'

const Article = () => {
  return (
    <div>
    <Header/>
    <Navbar/>
    <div class="inner-banner img-adjust">
    <div class="linear-left"></div>
    <div class="linear-center"></div>
    <div class="linear-right"></div>
    <div class="container">
        <h2 class="inner-banner-title">Article of Gainbot</h2>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Article of Gainbot</li>
            </ol>
        </nav>
    </div>
    <div className="container bg-white mx-auto p-6 space-y-8">
          {/* Growth Introduction */}
          <section>
            <h3 className="text-3xl font-semibold">Growth with Artificial Intelligence</h3>
            <p>Welcome to Gainbot! Start here, succeed everywhere.</p>
          </section>

          {/* About Us */}
          <section>
            <h4 className="text-2xl font-bold">About Us</h4>
            <p>
              Gainbot is a cutting-edge technology company revolutionizing industries through artificial intelligence,
              automation, and robotics. Our team develops innovative solutions that empower individuals and organizations
              to achieve more.
            </p>
          </section>

          {/* Founder Details */}
          <section>
            <h4 className="text-2xl font-bold">Founder: Mr. Matthew Rojwak</h4>
            <p>
              Mr. Matthew Rojwak, founder of Bloq and a respected American investor, is known for his pioneering work
              in the tech and blockchain sectors. His journey from a student to a leader exemplifies the impact of
              passion and perseverance in entrepreneurship.
            </p>
          </section>

          {/* Mission and Vision */}
          <section>
            <h4 className="text-2xl font-bold">Mission</h4>
            <p>
              To harness the power of AI and automation to drive efficiency, productivity, and growth, while fostering
              a culture of innovation, excellence, and integrity.
            </p>
            <h4 className="text-2xl font-bold mt-4">Vision</h4>
            <ul className="list-disc pl-5">
              <li>Pioneering innovation</li>
              <li>Exceptional performance</li>
              <li>Strategic partnerships</li>
              <li>Ethical practices</li>
            </ul>
          </section>

          {/* Reasons to Trade with Gainbot */}
          <section>
            <h4 className="text-2xl font-bold">Why Choose Gainbot?</h4>
            <p>Here are some potential reasons why trading with Gainbot is beneficial:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold">For Traders:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Simplified Trading</li>
                  <li>Increased Efficiency</li>
                  <li>Improved Accuracy</li>
                  <li>Enhanced Risk Management</li>
                  <li>Access to Expert Insights</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold">For Investors:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Diversified Portfolio</li>
                  <li>Passive Income</li>
                  <li>Reduced Risk</li>
                  <li>Expert Guidance</li>
                  <li>Transparency</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Types of Income */}
          <section>
            <h4 className="text-2xl font-bold">Types of Income with Gainbot</h4>
            <ul className="list-decimal pl-5 space-y-2">
              <li><strong>Sign-up Bonus:</strong> Free $1 USDT for trial purposes.</li>
              <li><strong>Trade Profit:</strong> Earn 15-20% on trades through AI-driven strategies.</li>
              <li><strong>Referral Program:</strong> Earn commissions from referrals up to 2 levels.</li>
              <li><strong>Affiliate Program:</strong> Maximize earnings with level-wise referral income.</li>
              <li><strong>Re-top-up & Trade Bonuses:</strong> Reinvestment rewards of 5% and additional trade bonuses.</li>
            </ul>
          </section>

          {/* Support and Contact */}
          <section>
            <h4 className="text-2xl font-bold">Support and Contact</h4>
            <ul className="list-disc pl-5">
              <li>Live Chat: 24/7 support</li>
              <li>Email: Gainbot891@gmail.com</li>
              <li>FAQ: Extensive knowledge base</li>
            </ul>
          </section>
        </div>
</div>

      
    </div>
  )
}

export default Article
