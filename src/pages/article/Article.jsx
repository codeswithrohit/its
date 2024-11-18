import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Header from '../../component/Header/Header';
import Navbar from '../../component/navbar/Navbar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GainbotArticle = () => {
  const data = {
    labels: ['66,620', '67,000', '67,380'], 
    datasets: [
      {
        label: 'Profit/Loss',
        data: [0, 1000, 2000],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1000 },
      },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-black min-h-screen">
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto py-36 px-6">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
         <span className="text-blue-600 italic">Gainbot Artificial Intelligence Navigation Bot</span>
          </h1>
          <p className="mt-4 text-lg text-white italic">Welcome to Gainbot - Start here, succeed everywhere!</p>
        </div>

        {/* About Us Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-600 leading-relaxed">
            Gainbot is a cutting-edge technology company revolutionizing industries through artificial intelligence,
            automation, and robotics. Our diverse team of experts collaborates to develop innovative solutions,
            empowering individuals and organizations to achieve more.
          </p>
        </div>

        {/* Founder Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Gainbot Founder Details</h2>
          <p className="text-gray-600 leading-relaxed">
            Mr. Matthew Rojwak stands out as a visionary leader in the tech and blockchain sector. His journey from a
            curious student to the founder of Bloq and a respected investor exemplifies the impact of passion and
            perseverance in the world of entrepreneurship.<br/>
            <p className="text-gray-600 leading-relaxed" >Mr. Matthew Rojwak: Founder of Bloq and American Investor
            </p>
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Early Life and Education</h2>
          <p className="text-gray-600 leading-relaxed">
          Matthew Rojwak was born in the United States and raised in a family that valued innovation and entrepreneurship. From a young age, he showed a keen interest in technology and business, often spending time tinkering with gadgets and exploring the burgeoning world of the internet. His passion led him to pursue a degree in Business Administration with a focus on Information Technology at a prominent university. During his studies, he excelled in courses related to entrepreneurship and technology management, laying the groundwork for his future endeavors.
          .<br/>
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Journey of Gainbot</h2>
          <p className="text-gray-600 leading-relaxed">
          Matthew Rojwak started making the gainbot from the year 2020, but this dream of his came into full functioning in the year 2022, but came into marketing in August of the year 2023 and with a community of millions of people, his users are increasing very fast
       
          .<br/>
          <p className="text-gray-600 leading-relaxed" >To harness the power of AI and automation to drive efficiency, productivity, and growth, while fostering a culture of innovation, excellence, and integrity.
          </p>
          </p>
        </div>

        {/* Profit/Loss Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Profit/Loss Chart</h2>
          <Line data={data} options={options} />
        </div>

        {/* Why Choose Gainbot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Gainbot</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Cutting-Edge Technology: AI-powered trading and machine learning.</li>
              <li>Expert Team: Seasoned traders, developers, and market analysts.</li>
              <li>Proven Track Record: Consistent returns and satisfied clients.</li>
              <li>Customer Support: Dedicated support and education.</li>
              <li>Security and Compliance: SOC 2 compliant and registered with regulatory bodies.</li>
            </ul>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">For Traders</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Simplified Trading: Gainbot's automated trading bots simplify the trading process.</li>
              <li>Increased Efficiency: AI-driven trading saves time and effort.</li>
              <li>Improved Accuracy: Machine learning algorithms minimize emotional biases.</li>
              <li>Enhanced Risk Management: Advanced risk management tools protect investments.</li>
              <li>Access to Expert Insights: Gainbot's market analysis and research.</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Vision</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li> Pioneering innovation              </li>
              <li>Exceptional performance.</li>
              <li>Strategic partnerships.</li>
              <li>Ethical practices.</li>
            </ul>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">For Investors</h2>
  <ul className="list-disc pl-6 text-gray-600 space-y-2">
    <li>Diversified Portfolio: Gainbot's AI optimizes portfolio allocation.</li>
    <li>Passive Income: Automated trading generates consistent returns.</li>
    <li>Reduced Risk: Advanced risk management and diversification.</li>
    <li>Expert Guidance: Gainbot's market experts provide valuable insights.</li>
    <li>Transparency: Real-time portfolio tracking and reporting.</li>
  </ul>
</div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">For Financial Freedom</h2>
  <ul className="list-disc pl-6 text-gray-600 space-y-2">
    <li>Achieve Financial Goals: Gainbot helps traders and investors reach financial objectives.</li>
    <li>Wealth Creation: Consistent returns and growth.</li>
    <li>Financial Security: Protected investments and reduced risk.</li>
    <li>Peace of Mind: Automated trading and expert guidance.</li>
    <li>Freedom to Focus: On personal and professional goals.</li>
  </ul>
</div>

<div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Promise</h2>
  <ul className="list-disc pl-6 text-gray-600 space-y-2">
    <li>Empower Traders and Investors: With innovative technology and expert guidance.</li>
    <li>Simplify Trading: Automated trading and streamlined processes.</li>
    <li>Deliver Results: Consistent returns and growth.</li>
    <li>Foster Community: Collaboration, education, and support.</li>
    <li>Continuously Innovate: Stay ahead of market trends and technologies.</li>
    <li>Here's a step-by-step guide on how to earn with Gainbot:</li>
  </ul>
</div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">Getting Started</h2>
  <ul className="list-disc pl-6 text-gray-600 space-y-2">
    <li>Sign up: Create an account on Gainbot's platform to begin your journey.</li>
    <li>Deposit funds: Fund your wallet with a supported cryptocurrency or fiat currency to start trading.</li>
    <li>Verify wallet: Complete Know Your Customer (KYC) verification for security and compliance.</li>
  </ul>
</div>


<div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">Trading with Gainbot</h2>
  <ul className="list-disc pl-6 text-gray-600 space-y-2">
    <li>Choose trading bot: Select from a variety of AI-powered trading bots tailored to your preferences.</li>
    <li>Set trading parameters: Configure bot settings, risk management options, and trading strategies to suit your goals.</li>
    <li>Start trading: Activate the bot and let it trade automatically, maximizing your investment potential.</li>
  </ul>
</div>



        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-2">
        <div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">Earning Opportunities</h2>
  <ul className="list-disc pl-6 text-gray-600 space-y-2">
    <li>Sign-up bonus: Enjoy a free $1 bonus upon registration.</li>
    <li>Trade profits: Earn profits from successful trades powered by Gainbot's AI.</li>
    <li>Referral program: Refer friends to Gainbot and earn commissions on their trades.</li>
    <li>Affiliate program: Promote Gainbot and earn attractive rewards for every successful referral.</li>
    <li>Re-top-up: Invest additional funds and earn a 5% reward on your reinvestment.</li>
  </ul>
</div>







        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mt-2">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">Types of Income in Gainbot.AI</h2>
  
  {/* Sign-up Bonus Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">1. Sign-up Bonus</h3>
    <p className="text-gray-600">
      Gainbot offers a free $1 USDT to experience the features of this vast market without any initial investment. Join quickly to get started!
    </p>
  </div>

  {/* Trade Profit Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">2. Trade Profit</h3>
    <p className="text-gray-600">
      Our trading partners at Gainbot.AI provide a chance to earn 15-20% profit from trades. This platform offers a chance to grow your capital by up to 4x, the best growth rate across markets.
    </p>
  </div>

  {/* Referral Program Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">3. Referral Program</h3>
    <p className="text-gray-600">
      With Gainbot.AI, you can earn 5% of each investment made through your referral link, with a two-level system (5% for both you and your upline).
    </p>
  </div>

  {/* Affiliate Program Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">4. Affiliate Program</h3>
    <p className="text-gray-600">
      Maximize your earnings through level-based referral income. Gainbot.AI's advanced AI-powered bots offer the best protection and returns for your trades. 
      <br />
      Wondering how each level compares? Let’s break it down.
    </p>
  </div>

  {/* Re-top Up & Trade Bonus Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">5. Re-top Up & Trade Bonus</h3>
    <p className="text-gray-600">
      Reinvest your capital and earn a 5% bonus on top of your reinvestment. You’ll also receive a 5% bonus for your upline. Additionally, Gainbot rewards you with exciting bonuses on trades and targets.
    </p>
  </div>

  {/* Affiliate Income Criteria Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">Affiliate Income Criteria</h3>
    <p className="text-gray-600">
      To earn affiliate income, meet the following criteria:
    </p>
    <ul className="list-disc pl-6 text-gray-600 space-y-2">
      <li>Affiliate 1: 15%</li>
      <li>Affiliate 2: 10%</li>
      <li>Affiliate 3: 5%</li>
      <li>Affiliate 4: 4%</li>
      <li>Affiliate 5: 3%</li>
      <li>Affiliate 6: 2%</li>
      <li>Affiliate 7: 1%</li>
      <li>Affiliate 8-15: 0.5% to 0.1%</li>
    </ul>
    <p className="text-gray-600">
      The number of direct referrals you have will determine your level of earning:
      <ul className="list-inside pl-6 text-gray-600 space-y-2">
        <li>1 direct for levels 1-3</li>
        <li>2 directs for levels 4-6</li>
        <li>3 directs for levels 7-9</li>
        <li>4 directs for levels 10-12</li>
        <li>5 directs for levels 13-15</li>
      </ul>
    </p>
  </div>

  {/* Straddle Strategy Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">Straddle Strategy Overview</h3>
    <p className="text-gray-600">
      Learn how to profit from market volatility with the straddle strategy, which involves buying both call and put options.
    </p>
    <div className="border-t mt-4 pt-4 text-sm text-gray-600">
      <h4 className="font-semibold">Risk and Reward Analysis</h4>
      <p>Maximum Loss: Total premium paid = $380</p>
      <p>Break-even Points: $66,620 (lower) and $67,380 (upper)</p>
      <p>Maximum Profit: Unlimited if price moves significantly in either direction.</p>
    </div>
  </div>

  {/* Withdrawal & Fees Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">Withdrawal & Fees</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-2">
      <li>Trading fees: 15% charged by the bot on each trade.</li>
      <li>Management & Withdrawal fees: 6% applied to bot performance.</li>
      <li>Minimum Investment: $25</li>
      <li>Minimum Withdrawal: $10</li>
    </ul>
  </div>

  {/* Support Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">Support</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-2">
      <li>Live chat: 24/7 support</li>
      <li>Email: support ticket system</li>
      <li>FAQ: Extensive knowledge base</li>
      <li>Email: Gainbot891@gmail.com</li>
    </ul>
  </div>

  {/* Gainbot Benefits Section */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-gray-800">Gainbot Benefits</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-2">
      <li>Automated trading</li>
      <li>AI-powered bots</li>
      <li>Expert market analysis</li>
      <li>Risk management tools</li>
      <li>User-friendly interface</li>
    </ul>
  </div>
</div>

      </div>
    </div>
  );
};

export default GainbotArticle;
