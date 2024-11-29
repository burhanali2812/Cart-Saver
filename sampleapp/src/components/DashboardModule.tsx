import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { fetchActivityLog, fetchStatsData } from "../services/api";
import "./DashboardModule.css"; // Add relevant styles

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type ActivityLog = {
  timestamp: string;
  activity: string;
  user_name: string;
};

type Stats = {
  users: number;
  sessions: number;
  active_carts: number;
  users_percentage_change: number;
  sessions_percentage_change: number;
  carts_percentage_change: number;
};

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    label?: string;
  }[];
};

const DashboardModule: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    sessions: 0,
    active_carts: 0,
    users_percentage_change: 0,
    sessions_percentage_change: 0,
    carts_percentage_change: 0,
  });
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [dailyActivityData, setDailyActivityData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [retentionData, setRetentionData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [cartActivityData, setCartActivityData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  // Fetch updated stats and activity log
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStats = await fetchStatsData(); // This should return the stats object from the API
        const activities = await fetchActivityLog();

        const transformedActivities = activities.map((activity: { time: string; event: string; user: string }) => ({
          timestamp: activity.time,
          activity: activity.event,
          user_name: activity.user,
        }));

        // Ensure stats includes the missing percentage change fields with defaults
        const updatedStats: Stats = {
          users: fetchedStats.users || 0,
          sessions: fetchedStats.sessions || 0,
          active_carts: fetchedStats.active_carts || 0,
          // Default to 0 if undefined or missing fields
          users_percentage_change: fetchedStats.users_percentage_change ?? 0,
          sessions_percentage_change: fetchedStats.sessions_percentage_change ?? 0,
          carts_percentage_change: fetchedStats.carts_percentage_change ?? 0,
        };

        setStats(updatedStats);
        setActivityLog(transformedActivities);

        // Chart data setup
        setDailyActivityData({
          labels: ["Added to Cart", "Removed from Cart", "Purchased"],
          datasets: [
            {
              data: [40, 30, 30],
              backgroundColor: ["#36a2eb", "#ff6384", "#4bc0c0"],
            },
          ],
        });

        setRetentionData({
          labels: ["Counseling", "Workshops", "Online Courses"],
          datasets: [
            {
              data: [45, 30, 25],
              backgroundColor: ["#36a2eb", "#ffcd56", "#4bc0c0"],
            },
          ],
        });

        setCartActivityData({
          labels: ["Jan", "Feb", "Mar", "Apr"],
          datasets: [
            {
              label: "Additions",
              data: [50, 70, 60, 90],
              backgroundColor: ["#36a2eb"],
            },
            {
              label: "Removals",
              data: [30, 50, 40, 70],
              backgroundColor: ["#ff6384"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Set different intervals for stats updates
    const updateUsersInterval = setInterval(() => {
      setStats((prevStats) => {
        const newUsers = prevStats.users + 1;
        const users_percentage_change =
          prevStats.users === 0 ? 0 : ((newUsers - prevStats.users) / prevStats.users) * 100;

        return {
          ...prevStats,
          users: newUsers,
          users_percentage_change,
        };
      });
    }, 3000); // Update users every 3 seconds

    const updateSessionsInterval = setInterval(() => {
      setStats((prevStats) => {
        const newSessions = prevStats.sessions + 1;
        const sessions_percentage_change =
          prevStats.sessions === 0 ? 0 : ((newSessions - prevStats.sessions) / prevStats.sessions) * 100;

        return {
          ...prevStats,
          sessions: newSessions,
          sessions_percentage_change,
        };
      });
    }, 5000); // Update sessions every 5 seconds

    const updateCartsInterval = setInterval(() => {
      setStats((prevStats) => {
        const newActiveCarts = prevStats.active_carts + 1;
        const carts_percentage_change =
          prevStats.active_carts === 0 ? 0 : ((newActiveCarts - prevStats.active_carts) / prevStats.active_carts) * 100;

        return {
          ...prevStats,
          active_carts: newActiveCarts,
          carts_percentage_change,
        };
      });
    }, 7000); // Update active carts every 7 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(updateUsersInterval);
      clearInterval(updateSessionsInterval);
      clearInterval(updateCartsInterval);
    };
  }, []);

  useEffect(() => {
    // Update chart data when stats change
    setDailyActivityData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [stats.users, stats.sessions, stats.active_carts],
        },
      ],
    }));

    setRetentionData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [stats.users_percentage_change, stats.sessions_percentage_change, stats.carts_percentage_change],
        },
      ],
    }));

    setCartActivityData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [stats.users, stats.sessions, stats.active_carts],
        },
        {
          ...prevData.datasets[1],
          data: [stats.users_percentage_change, stats.sessions_percentage_change, stats.carts_percentage_change],
        },
      ],
    }));
  }, [stats]);

  return (
    <div className="dashboard-module">
      <div className="stats">
        <div className="stat-item">
          <h3>{stats.users}</h3>
          <p>Users</p>
          <span
            className={`percentage-change ${stats.users_percentage_change >= 0 ? "positive" : "negative"}`}
          >
            {stats.users_percentage_change.toFixed(2)}%
          </span>
        </div>
        <div className="stat-item">
          <h3>{stats.sessions}</h3>
          <p>Sessions</p>
          <span
            className={`percentage-change ${stats.sessions_percentage_change >= 0 ? "positive" : "negative"}`}
          >
            {stats.sessions_percentage_change.toFixed(2)}%
          </span>
        </div>
        <div className="stat-item">
          <h3>{stats.active_carts}</h3>
          <p>Active Carts</p>
          <span
            className={`percentage-change ${stats.carts_percentage_change >= 0 ? "positive" : "negative"}`}
          >
            {stats.carts_percentage_change.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="activity-log">
        <h3>Recent Activity</h3>
        <ul>
          {activityLog.map((log, index) => (
            <li key={index}>
              {log.timestamp} - {log.activity} ({log.user_name})
            </li>
          ))}
        </ul>
      </div>

      <div className="charts">
        <div className="chart">
          <h3>Daily Cart Activity</h3>
          <Pie data={dailyActivityData} />
        </div>

        <div className="chart">
          <h3>Retention Rates</h3>
          <Pie data={retentionData} />
        </div>

        <div className="chart">
          <h3>Cart Activity</h3>
          <Bar data={cartActivityData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
