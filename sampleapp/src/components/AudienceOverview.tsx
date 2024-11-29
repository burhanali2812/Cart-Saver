import React from 'react';
import { Audience } from '../types/Audience';

interface AudienceOverviewProps {
  tableData: Audience[];
}

const AudienceOverview: React.FC<AudienceOverviewProps> = ({ tableData }) => {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title text-center mb-0">Audience Overview</h2>
        </div>
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Segment</th>
                  <th>Activity Score</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((audience) => (
                    <tr key={audience.id}>
                      <td>{audience.name}</td>
                      <td>{audience.email}</td>
                      <td>{audience.segment}</td>
                      <td>{audience.activityScore}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      Loading data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceOverview;
