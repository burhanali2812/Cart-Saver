import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

interface FormattedData {
  name: string; // Display name
  activity: number; // Activity score (just a placeholder, can be derived from other factors)
  purchases: number; // Purchase count (could be derived similarly)
}

interface AnalyticsProps {
  tableData: { name: string; email: string; segment: string; fullTerm: string; likelihood: string; id: number }[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tableData }) => {
  const [analyticsData, setAnalyticsData] = useState<FormattedData[]>([]);

  // Update chart data based on the table data
  useEffect(() => {
    const formattedData = tableData.map((item, index) => ({
      name: item.name || `User ${index + 1}`,
      activity: Math.floor(Math.random() * 100), // Placeholder for activity score
      purchases: Math.floor(Math.random() * 50), // Placeholder for purchase count
    }));

    setAnalyticsData(formattedData);
  }, [tableData]); // Re-run when the table data changes

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Analytics Dashboard</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={analyticsData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fill: '#8884d8' }} />
          <YAxis tick={{ fill: '#8884d8' }} />
          <Tooltip contentStyle={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Line type="monotone" dataKey="activity" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="purchases" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
