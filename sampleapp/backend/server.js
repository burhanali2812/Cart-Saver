const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config(); // Load .env file

// Allow cross-origin requests (for development purposes)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// MySQL Database Connection Setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// GET all audience data
app.get('/api/audience', (req, res) => {
  connection.query('SELECT * FROM audience', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching data' });
    }
    res.json(results);
  });
});

// POST a new audience
app.post('/api/audience', (req, res) => {
  const newAudience = req.body;

  if (!newAudience.name || !newAudience.email || !newAudience.segment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO audience (name, email, segment, fullTerm, likelihood, activityScore, purchaseCount) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [
    newAudience.name,
    newAudience.email,
    newAudience.segment,
    newAudience.fullTerm,
    newAudience.likelihood,
    newAudience.activityScore,
    newAudience.purchaseCount,
  ];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error inserting data' });
    }

    newAudience.id = results.insertId;  // MySQL will give you the ID of the new record
    res.json(newAudience);
  });
});

// PUT (Update) an audience
app.put('/api/audience/:id', (req, res) => {
  const { id } = req.params;
  const updatedAudience = req.body;

  if (!updatedAudience.name || !updatedAudience.email || !updatedAudience.segment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    UPDATE audience 
    SET 
      name = ?, 
      email = ?, 
      segment = ?, 
      fullTerm = ?, 
      likelihood = ?, 
      activityScore = ?, 
      purchaseCount = ? 
    WHERE id = ?`;

  const values = [
    updatedAudience.name,
    updatedAudience.email,
    updatedAudience.segment,
    updatedAudience.fullTerm,
    updatedAudience.likelihood,
    updatedAudience.activityScore,
    updatedAudience.purchaseCount,
    id
  ];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ error: 'Error updating data' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Audience not found' });
    }

    res.json({ ...updatedAudience, id });
  });
});

// DELETE an audience
app.delete('/api/audience/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM audience WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ error: 'Error deleting data' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  });
});

// Activity Log Routes

// GET all activity logs
app.get('/api/activity-log', (req, res) => {
  connection.query('SELECT * FROM activity_log ORDER BY timestamp DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching activity logs' });
    }
    res.json(results);
  });
});

// POST a new activity log
app.post('/api/activity-log', (req, res) => {
  const { timestamp, activity, user_name } = req.body;

  if (!timestamp || !activity || !user_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO activity_log (timestamp, activity, user_name) VALUES (?, ?, ?)';
  const values = [timestamp, activity, user_name];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting activity log:', err);
      return res.status(500).json({ error: 'Error inserting activity log' });
    }
    res.status(201).json({ timestamp, activity, user_name });
  });
});

// DELETE an activity log
app.delete('/api/activity-log/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM activity_log WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting activity log:', err);
      return res.status(500).json({ error: 'Error deleting activity log' });
    }
    res.status(200).json({ message: 'Activity log deleted successfully' });
  });
});

// Dashboard Stats Routes

// GET dashboard stats
app.get('/api/stats', (req, res) => {
  // Query for dashboard stats such as users, sessions, and active carts
  connection.query('SELECT COUNT(id) AS users FROM audience', (err, userResults) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching stats' });
    }
    connection.query('SELECT COUNT(session_id) AS sessions FROM sessions', (err, sessionResults) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching stats' });
      }
      connection.query('SELECT COUNT(id) AS active_carts FROM carts WHERE status = "active"', (err, cartResults) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching stats' });
        }
        res.json({
          users: userResults[0].users,
          sessions: sessionResults[0].sessions,
          active_carts: cartResults[0].active_carts,
        });
      });
    });
  });
});

// PUT (Update) dashboard stats and calculate percentage changes
app.put('/api/stats', (req, res) => {
  const { users, sessions, active_carts } = req.body;

  // Get the current stats from the database to calculate the percentage changes
  connection.query('SELECT * FROM dashboard_stats WHERE id = 1', (err, results) => {
    if (err) {
      console.error('Error fetching stats:', err);
      return res.status(500).json({ error: 'Error fetching current stats' });
    }

    // If there's no row yet, insert the first set of stats
    if (results.length === 0) {
      const query = `
        INSERT INTO dashboard_stats (users, sessions, active_carts, users_percentage_change, sessions_percentage_change, carts_percentage_change)
        VALUES (?, ?, ?, 0, 0, 0)
      `;
      const values = [users, sessions, active_carts];
      connection.query(query, values, (err, results) => {
        if (err) {
          console.error('Error inserting new stats:', err);
          return res.status(500).json({ error: 'Error inserting new stats' });
        }
        res.json({ message: 'Stats inserted successfully', stats: { users, sessions, active_carts } });
      });
    } else {
      // Calculate percentage change from previous values
      const previousStats = results[0];

      const usersPercentageChange = calculatePercentageChange(previousStats.users, users);
      const sessionsPercentageChange = calculatePercentageChange(previousStats.sessions, sessions);
      const cartsPercentageChange = calculatePercentageChange(previousStats.active_carts, active_carts);

      // Update the existing stats
      const query = `
        UPDATE dashboard_stats
        SET users = ?, sessions = ?, active_carts = ?, users_percentage_change = ?, sessions_percentage_change = ?, carts_percentage_change = ?
        WHERE id = 1
      `;
      const values = [
        users,
        sessions,
        active_carts,
        usersPercentageChange,
        sessionsPercentageChange,
        cartsPercentageChange
      ];

      connection.query(query, values, (err, results) => {
        if (err) {
          console.error('Error updating stats:', err);
          return res.status(500).json({ error: 'Error updating stats' });
        }
        res.json({ message: 'Stats updated successfully', stats: { users, sessions, active_carts, usersPercentageChange, sessionsPercentageChange, cartsPercentageChange } });
      });
    }
  });
});

// Function to calculate percentage change
function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) return newValue === 0 ? 0 : 100; // Handle division by zero
  return ((newValue - oldValue) / oldValue) * 100;
}

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
