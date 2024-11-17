import React from 'react';
import TradeViewChart from 'react-crypto-chart';

export default function App() {
  return (
    <div className="overflow-hidden">
      <h3 className="font-[Lato]">BTC/USDT</h3>
      <div
        style={{
          width: '100%', // Make it responsive
          height: '400px', // Fixed height can still be used for the chart container
          marginBottom: '30px',
        }}
      >
        <TradeViewChart
        containerStyle={{
          minHeight: '300px', // Ensure minimum height for the chart
          width: '100%', // Let the width adjust based on the parent container
          marginBottom: '30px',
        }}
          pair="BTCUSDT"
        />
      </div>
    </div>
  );
}
