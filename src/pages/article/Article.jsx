import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../../component/Header/Header'
import Navbar from '../../component/navbar/Navbar'
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GainbotArticle = () => {
  const data = {
    labels: ['66,620', '67,000', '67,380'], // X-Axis (Price points)
    datasets: [
      {
        label: 'Profit/Loss',
        data: [0, 1000, 2000], // Y-Axis (Profit/Loss values)
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        fill: true,
        tension: 0.4, // Smooth curve for profit/loss line
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const affiliateIncomeLevels = [
    { level: 1, income: "15%" },
    { level: 2, income: "10%" },
    { level: 3, income: "05%" },
    { level: 4, income: "04%" },
    { level: 5, income: "03%" },
    { level: 6, income: "02%" },
    { level: 7, income: "01%" },
    { level: 8, income: "0.5%" },
    { level: 9, income: "0.5%" },
    { level: 10, income: "0.5%" },
    { level: 11, income: "0.5%" },
    { level: 12, income: "0.5%" },
    { level: 13, income: "0.1%" },
    { level: 14, income: "0.2%" },
    { level: 15, income: "0.3%" },
  ];
  
  const straddleStrategySteps = [
    "Choose the Underlying Asset: Look for stocks or indices expected to experience high volatility.",
    "Select Strike Price: Opt for an at-the-money (ATM) strike price.",
    "Determine Expiration Date: Choose an expiration date that gives enough time for the anticipated move to occur.",
    "Buy Both Options: Purchase the BUY and SELL options simultaneously."
  ];
  
  const affiliateIncomeText = (
    <>
      For each affiliate level income, you should qualify certain criteria to increase your income. There are 15 levels of income given. You will have to invest.
      <ul className="list-disc ml-5 mt-4">
        {affiliateIncomeLevels.map((item) => (
          <li key={item.level}>
            Affiliate {item.level}: {item.income}
          </li>
        ))}
      </ul>
      <p className="mt-4">1 direct to get level 1-3 affiliate income. In this way you will get:</p>
      <ul className="list-disc ml-5">
        <li>3-6 levels earning for 2 directs</li>
        <li>6-9 levels earning for 3 directs</li>
        <li>9-12 levels earning for 4 directs</li>
        <li>12-15 level earning you should have 5 directs</li>
      </ul>
    </>
  );
  
  const straddleStrategyText = (
    <>
      Definition: A straddle involves buying a call and a put option with the same strike price and expiration date, betting on significant price movement in either direction.
      <p className="mt-4">Steps to Implement a Straddle:</p>
      <ul className="list-decimal ml-5">
        {straddleStrategySteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
      <p className="mt-4">Example Scenario:</p>
      <ul className="list-inside ml-5">
        <li>Underlying Asset: BTC / USDT</li>
        <li>Current Price: $67,000</li>
        <li>Strike Price: $67,000 (ATM)</li>
        <li>BUY Option Premium target 🎯: 2%</li>
        <li>SELL Option Premium: 1% (Stop loss)</li>
        <li>Total Investment: 100% + monthly profit 25%</li>
      </ul>
      <p className="mt-4">Risk and Reward Analysis:</p>
      <ul className="list-inside ml-5">
        <li>Maximum Loss: Total premium paid = $380</li>
        <li>Break-even Points:</li>
        <ul className="list-inside ml-5">
          <li>Upper Break-even: $67,000 + $380 = $67,380</li>
          <li>Lower Break-even: $67,000 - $380 = $66,620</li>
        </ul>
        <li>Maximum Profit: Unlimited if the price moves significantly in either direction.</li>
      </ul>
    </>
  );
  return (
    <div>
    {/* <Header/>
    <Navbar/> */}
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-xl font-semibold mb-6 text-center">
        <span className="italic text-blue-600">_Article of Gainbot_</span>
      </div>

      <div className="mb-6 text-center text-2xl font-bold">
        <span className="italic">_Growth artificial intelligence navigation bot_</span>
      </div>

      <div className="text-center mb-6 text-xl">
        <span className="italic">_Welcome to Gainbot_</span>
      </div>

      <div className="mb-6 text-center text-lg">
        <span className="italic">_Start here succeed everywhere_</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed">
          Gainbot is a cutting-edge technology company revolutionizing industries through artificial intelligence, automation, and robotics. Our diverse team of experts collaborates to develop innovative solutions, empowering individuals and organizations to achieve more.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Gainbot Founder Details</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed">
          Mr. Matthew Rojwak stands out as a visionary leader in the tech and blockchain sector. His journey from a curious student of the founder of Bloq and a respected investor exemplifies the impact of passion and perseverance in the world of entrepreneurship.

          Mr. Matthew Rojwak: Founder of Bloq and American Investor
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Early Life and Education</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed">
          Matthew Rojwak was born in the United States and raised in a family that valued innovation and entrepreneurship. From a young age, he showed a keen interest in technology and business, often spending time tinkering with gadgets and exploring the burgeoning world of the internet. His passion led him to pursue a degree in Business Administration with a focus on Information Technology at a prominent university. During his studies, he excelled in courses related to entrepreneurship and technology management, laying the groundwork for his future endeavors.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Journey of Gainbot</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed">
          Matthew Rojwak started making Gainbot in 2020, but this dream of his came into full function in 2022, and it came into marketing in August of 2023. With a community of millions of people, his users are increasing very fast.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Mission</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed">
          To harness the power of AI and automation to drive efficiency, productivity, and growth, while fostering a culture of innovation, excellence, and integrity.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Vision</h2>
        <p className="whitespace-pre-line text-lg leading-relaxed">
          To become a global leader in AI-driven solutions, transforming industries and improving lives through:
        </p>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Pioneering innovation</li>
          <li>Exceptional performance</li>
          <li>Strategic partnerships</li>
          <li>Ethical practices</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">For Traders</h2>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Simplified Trading: Gainbot's automated trading bots simplify the trading process.</li>
          <li>Increased Efficiency: AI-driven trading saves time and effort.</li>
          <li>Improved Accuracy: Machine learning algorithms minimize emotional biases.</li>
          <li>Enhanced Risk Management: Advanced risk management tools protect investments.</li>
          <li>Access to Expert Insights: Gainbot's market analysis and research.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">For Investors</h2>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Diversified Portfolio: Gainbot's AI optimizes portfolio allocation.</li>
          <li>Passive Income: Automated trading generates consistent returns.</li>
          <li>Reduced Risk: Advanced risk management and diversification.</li>
          <li>Expert Guidance: Gainbot's market experts provide valuable insights.</li>
          <li>Transparency: Real-time portfolio tracking and reporting.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">For Financial Freedom</h2>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Achieve Financial Goals: Gainbot helps traders and investors reach financial objectives.</li>
          <li>Wealth Creation: Consistent returns and growth.</li>
          <li>Financial Security: Protected investments and reduced risk.</li>
          <li>Peace of Mind: Automated trading and expert guidance.</li>
          <li>Freedom to Focus: On personal and professional goals.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Why Choose Gainbot</h2>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Cutting-Edge Technology: AI-powered trading and machine learning.</li>
          <li>Expert Team: Seasoned traders, developers, and market analysts.</li>
          <li>Proven Track Record: Consistent returns and satisfied clients.</li>
          <li>Customer Support: Dedicated support and education.</li>
          <li>Security and Compliance: SOC 2 compliant and registered with regulatory bodies.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Our Promise</h2>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Empower Traders and Investors: With innovative technology and expert guidance.</li>
          <li>Simplify Trading: Automated trading and streamlined processes.</li>
          <li>Deliver Results: Consistent returns and growth.</li>
          <li>Foster Community: Collaboration, education, and support.</li>
          <li>Continuously Innovate: Stay ahead of market trends and technologies.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Here's a step-by-step guide on how to earn with Gainbot:</h2>
        
        <h3 className="text-2xl font-semibold mb-4">Getting Started</h3>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Sign up: Create an account on Gainbot's</li>
          <li>Deposit funds: Fund your wallet with a supported cryptocurrency or fiat currency.</li>
          <li>Verify wallet: Complete Know Your Customer (KYC) verification.</li>
        </ul>

        <h3 className="text-2xl font-semibold mb-4">Trading with Gainbot</h3>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Choose trading bot: Select from various AI-powered trading bots.</li>
          <li>Set trading parameters: Configure bot settings, risk management, and strategy.</li>
          <li>Start trading: Activate the bot and let it trade automatically.</li>
        </ul>

        <h3 className="text-2xl font-semibold mb-4">Earning Opportunities</h3>
        <ul className="list-inside list-decimal pl-6 mt-2">
          <li>Sign-up bonus free registration $1</li>
          <li>Trade profits: Earn profits from successful trades.</li>
          <li>Referral program: Refer friends and earn commissions.</li>
          <li>Affiliate program: Promote Gainbot and earn rewards.</li>
          <li>Re-top-up: Reinvestment for additional rewards (5%).</li>
        </ul>

        <h3 className="text-xl font-semibold mb-4">Types of income in Gainbot.AI</h3>
        <ul className="list-inside list-decimal pl-6 mt-2 whitespace-pre-line leading-relaxed">
          <li>Sign-up bonus: Gainbot gives us a free $1 USDT wealth for trial.</li>
          <li>Trade profit: 15-20% trade income with capital in various markets.</li>
          <li>Referral program: Earn 5% of a referral's investment in 2 levels.</li>
          <li>Affiliate program: Maximize earnings through level-wise referral income.</li>
          <li>Re-top-up & Trade Bonus: 5% bonus for reinvesting capital, plus additional trade bonuses.</li>
        </ul>
        <h2 className="text-xl font-semibold mb-6">Affiliate Income Criteria</h2>
      <div className="text-lg mb-6">{affiliateIncomeText}</div>

      <h3 className="text-lg font-semibold mt-6 mb-4">Straddle Strategy Overview</h3>
      <div className="text-lg  mb-6">{straddleStrategyText}</div>
      <h1 className="text-3xl font-semibold text-center mb-4">Profit/Loss Chart</h1>

{/* Chart */}
<div className="bg-white p-4 shadow-lg rounded-lg">
  <Line data={data} options={options} />
</div>

{/* Explanation */}
<div className="mt-8">
  <h2 className="text-2xl font-semibold">Detailed Explanation of the Chart</h2>
  <ul className="list-disc pl-6">
    <li><strong>X-Axis</strong>: Price of the underlying asset (BTC/USDT).</li>
    <li><strong>Y-Axis</strong>: Profit or Loss.</li>
    <li><strong>Break-even Points</strong>: The points where the profit line crosses the x-axis:</li>
    <ul className="list-inside list-decimal pl-4">
      <li>Below $66,620 = Loss.</li>
      <li>Between $66,620 and $67,380 = Loss decreases as the price approaches either break-even.</li>
      <li>Above $67,380 = Profit.</li>
    </ul>
  </ul>
</div>

<div>
        <h3 className="text-2xl font-semibold">Key Considerations</h3>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Volatility:</strong> The straddle profits from volatility. If the price remains close to $67,000, both options may expire worthless, resulting in a total loss of $380.</li>
          <li><strong>Time Decay:</strong> As expiration approaches, the value of options declines. If the anticipated movement does not occur, time decay can erode potential profits.</li>
          <li><strong>Market Events:</strong> Earnings announcements or significant news can cause sharp movements, favoring the straddle strategy.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold">Conclusion</h3>
        <p>The straddle strategy can be highly effective in volatile markets, offering the potential for significant profits. However, it also carries risks, particularly if the market remains stable. Proper analysis, timing, and risk management are crucial to success with this strategy.</p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold">Withdrawal</h3>
        <ul className="list-decimal pl-6 space-y-2">
          <li><strong>Request withdrawal:</strong> Withdraw earnings to your wallet.</li>
          <li><strong>Verification:</strong> Confirm withdrawal request.</li>
          <li><strong>Processing:</strong> Gainbot 24 - 72 Hours processes withdrawal.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold">Fees</h3>
        <ul className="list-decimal pl-6 space-y-2">
          <li><strong>Trading fees:</strong> 15% Bot charges Apply to each trade.</li>
          <li><strong>Management & withdrawal fees:</strong> Apply to bot performance 6%™️.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold">Criteria</h3>
        <ul className="list-decimal pl-6 space-y-2">
          <li>Minimum investment $25</li>
          <li>Minimum withdrawal $10</li>
          <li>15 level someone to get their income, 5 direct minimum</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold">Support</h3>
        <ul className="list-decimal pl-6 space-y-2">
          <li><strong>Live chat:</strong> 24/7 support.</li>
          <li><strong>Email:</strong> Support ticket system.</li>
          <li><strong>FAQ:</strong> Extensive knowledge base.</li>
          <li><strong>Email:</strong> Gainbot891@gmail.com</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold">Gainbot Benefits</h3>
        <ul className="list-disc pl-6 space-y-2">
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
