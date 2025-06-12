import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [avg, setAvg] = useState(0);
  const [ticker, setTicker] = useState("AAPL");
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/stocks/${ticker}?minutes=${minutes}`)
      .then(res => {
        setData(res.data.priceHistory);
        setAvg(res.data.averageStockPrice);
      });
  }, [ticker, minutes]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Stock Chart - {ticker}</h2>
      <input value={ticker} onChange={e => setTicker(e.target.value)} />
      <input type="number" value={minutes} onChange={e => setMinutes(e.target.value)} />
      <LineChart width={800} height={400} data={data}>
        <XAxis dataKey="lastUpdatedAt" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="blue" />
        <Line type="monotone" data={data.map(d => ({ ...d, avg }))} dataKey="avg" stroke="red" dot={false} />
      </LineChart>
    </div>
  );
}

export default App;
