const connection = require('./dbService');

// Query the database to ensure the connection works
connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
  if (err) {
    console.error('Error executing query:', err.message);
    return;
  }
  console.log('Query result:', results[0].solution);
});
