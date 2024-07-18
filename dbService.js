const mysql=require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sahil@sql2003',
    database: 'Portal'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }
    console.log('Connected to MySQL database');
  });
  
  module.exports = connection;