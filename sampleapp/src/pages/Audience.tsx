import React, { useEffect, useState } from 'react';
import { fetchAudienceData } from '../services/api'; // Assuming you have this function to fetch data
import { Audience } from '../types/Audience'; // Import the correct Audience type

const AudiencePage: React.FC = () => {
  const [audienceData, setAudienceData] = useState<Audience[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const getAudienceData = async () => {
      const data = await fetchAudienceData(); // Fetch audience data from the API
      setAudienceData(data); // Set the data in the state
    };

    getAudienceData();
  }, []); // Empty dependency array to run once when component mounts

  return (
    <div className="audience-container">
      <h1>Audience Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Segment</th>
            <th>Full Term</th>
            <th>Likelihood</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {audienceData.length > 0 ? (
            audienceData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.segment}</td>
                <td>{item.fullTerm}</td>
                <td>{item.likelihood}</td>
                <td>{item.activityScore ?? 'N/A'}</td> {/* If activityScore is undefined, show 'N/A' */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Loading data...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AudiencePage;
