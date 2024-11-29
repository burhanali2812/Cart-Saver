import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import AudienceOverview from './components/AudienceOverview';
import Performance from './pages/Performance';
import { Audience } from './types/Audience';
import axios from 'axios';
import DashboardModule from './components/DashboardModule';

const App: React.FC = () => {
  const [tableData, setTableData] = useState<Audience[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Audience[]>('https://cartsaver.wckd.pk/api/audience');
        setTableData(response.data);
      } catch (error) {
        console.error('Error fetching audience data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home tableData={tableData} setTableData={setTableData} />} />
        <Route path="/analytics" element={<Analytics tableData={tableData} />} />
        <Route path="/audience" element={<AudienceOverview tableData={tableData} />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/dashboard-module" element={<DashboardModule />} />
      </Routes>
    </>
  );
};

export default App;
