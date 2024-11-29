import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, Tooltip, Legend } from "chart.js";
import { Audience } from "../types/Audience"; // Ensure the correct path for Audience type
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Home.css"; // Import the CSS file

ChartJS.register(ArcElement, CategoryScale, Tooltip, Legend);

interface HomeProps {
  tableData: Audience[];
  setTableData: React.Dispatch<React.SetStateAction<Audience[]>>;
}

const Home: React.FC<HomeProps> = ({ tableData, setTableData }) => {
  const [newData, setNewData] = useState<Audience>({
    id: 0,
    name: "",
    email: "",
    segment: "",
    fullTerm: "",
    likelihood: "",
    activityScore: 0,
    purchaseCount: 0,
  });

  const [editingData, setEditingData] = useState<Audience | null>(null);

  const [audienceData, setAudienceData] = useState({
    labels: ["Age 18-24", "Age 25-34", "Age 35-44", "Age 45+"],
    datasets: [
      {
        label: "Audience Segments",
        data: [40, 30, 10, 20],
        backgroundColor: ["#4ECDC4", "#FF6F61", "#6A4E76", "#FFE156"],
        hoverOffset: 4,
      },
    ],
  });

  useEffect(() => {
    const updateChartData = () => {
      const segmentCounts: { [key: string]: number } = {
        "Age 18-24": 0,
        "Age 25-34": 0,
        "Age 35-44": 0,
        "Age 45+": 0,
      };

      tableData.forEach((item) => {
        const segment = item.segment as
          | "Age 18-24"
          | "Age 25-34"
          | "Age 35-44"
          | "Age 45+";
        segmentCounts[segment]++;
      });

      setAudienceData({
        labels: ["Age 18-24", "Age 25-34", "Age 35-44", "Age 45+"],
        datasets: [
          {
            label: "Audience Segments",
            data: [
              segmentCounts["Age 18-24"],
              segmentCounts["Age 25-34"],
              segmentCounts["Age 35-44"],
              segmentCounts["Age 45+"],
            ],
            backgroundColor: ["#4ECDC4", "#FF6F61", "#6A4E76", "#FFE156"],
            hoverOffset: 4,
          },
        ],
      });
    };

    updateChartData();
  }, [tableData]);

  const handleAdd = () => {
    if (!newData.name || !newData.email || !newData.segment) {
      alert("Please fill in all required fields (Name, Email, Segment)");
      return;
    }

    const newEntry: Audience = {
      ...newData,
      id: tableData.length > 0 ? tableData[tableData.length - 1].id + 1 : 1,
    };

    setTableData((prevData) => [...prevData, newEntry]);

    setNewData({
      id: 0,
      name: "",
      email: "",
      segment: "",
      fullTerm: "",
      likelihood: "",
      activityScore: 0,
      purchaseCount: 0,
    });

    alert("User added successfully!");
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      setTableData((prevData) => prevData.filter((item) => item.id !== id));
      alert("User deleted successfully!");
    }
  };

  const handleEdit = (item: Audience) => {
    setEditingData(item);
    setNewData(item);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <b>CART SAVER</b>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard-module">Dashboard</Link>
          </li>
          
          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/audience">Audience Overview</Link>
          </li>
          <li>
            <Link to="/performance">Performance</Link>
          </li>
        </ul>
      </nav>

      <h1 className="home-title">Filter Your User Segment</h1>

      <div className="chart-container">
        <Pie
          data={audienceData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
          }}
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Segment</th>
              <th>Full Term</th>
              <th>Likelihood</th>
              <th>Activity Score</th>
              <th>Purchase Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.segment}</td>
                <td>{item.fullTerm}</td>
                <td>{item.likelihood}</td>
                <td>{item.activityScore}</td>
                <td>{item.purchaseCount}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-container">
        <h3>{editingData ? "Edit User" : "Add New User"}</h3>
        <div className="form-inputs">
          <input
            type="text"
            name="name"
            value={newData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-field"
          />
          <input
            type="email"
            name="email"
            value={newData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
          />
          <input
            type="text"
            name="segment"
            value={newData.segment}
            onChange={handleChange}
            placeholder="Segment Name"
            className="input-field"
          />
          <input
            type="text"
            name="fullTerm"
            value={newData.fullTerm}
            onChange={handleChange}
            placeholder="Full Term"
            className="input-field"
          />
          <input
            type="text"
            name="likelihood"
            value={newData.likelihood}
            onChange={handleChange}
            placeholder="Likelihood"
            className="input-field"
          />
          <input
            type="number"
            name="activityScore"
            value={newData.activityScore}
            onChange={handleChange}
            placeholder="Activity Score"
            className="input-field"
          />
          <input
            type="number"
            name="purchaseCount"
            value={newData.purchaseCount}
            onChange={handleChange}
            placeholder="Purchase Count"
            className="input-field"
          />
        </div>
        <button className="btn-add" onClick={handleAdd}>
          {editingData ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default Home;
