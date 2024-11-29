import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const data = [
  { name: 'Age 18-24', value: 30 },
  { name: 'Age 25-34', value: 40 },
  { name: 'Age 35-44', value: 20 },
  { name: 'Age 45+', value: 10 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const UserSegmentDistribution: React.FC = () => {
  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        label
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
  );
};

export default UserSegmentDistribution;
