import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './Performance.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Performance: React.FC = () => {
  const [performanceData, setPerformanceData] = useState({
    lineChartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'User Activity',
          data: [10, 30, 45, 60, 75, 90, 110],
          fill: false,
          borderColor: '#36A2EB',
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#FF6384',
        },
      ],
    },
    barChartData: {
      labels: ['Segment A', 'Segment B', 'Segment C', 'Segment D'],
      datasets: [
        {
          label: 'Performance by Segment',
          data: [65, 75, 85, 95],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderWidth: 1,
        },
      ],
    },
    performanceSummary: {
      totalUsers: 1000,
      activeUsers: 800,
      avgSessionTime: '12 minutes',
      engagementRate: '80%',
    },
  });

  return (
    <div className="performance-container">
      <header className="performance-header text-center">
        <h1 className="text-primary mb-4">Performance Dashboard</h1>
        <p className="text-muted">Track your key performance metrics and engagement levels</p>
      </header>

      {/* Performance Summary */}
      <div className="performance-summary card p-4 shadow-sm mb-4">
        <h3 className="text-primary">Performance Overview</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Total Users:</strong> {performanceData.performanceSummary.totalUsers}
          </li>
          <li className="list-group-item">
            <strong>Active Users:</strong> {performanceData.performanceSummary.activeUsers}
          </li>
          <li className="list-group-item">
            <strong>Average Session Time:</strong> {performanceData.performanceSummary.avgSessionTime}
          </li>
          <li className="list-group-item">
            <strong>Engagement Rate:</strong> {performanceData.performanceSummary.engagementRate}
          </li>
        </ul>
      </div>

      {/* Line Chart */}
      <div className="chart-container card p-4 shadow-sm mb-4">
        <h3 className="text-primary">User Activity Over Time</h3>
        <Line
          data={performanceData.lineChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          }}
        />
      </div>

      {/* Bar Chart */}
      <div className="chart-container card p-4 shadow-sm">
        <h3 className="text-primary">Performance by Segment</h3>
        <Bar
          data={performanceData.barChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Performance;
