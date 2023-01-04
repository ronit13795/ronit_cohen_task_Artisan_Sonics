const mysql = require("mysql");

const query = ({ query }) => {
  const { DB_HOST, DB_USER_NAME, DB_PASSWORD, DB_NAME } = process.env;
  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER_NAME,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        return reject("connection error: " + err.message);
      }

      connection.query(query, (err, results, fields) => {
        if (err) {
          return reject("error: " + err.message);
        }
        resolve(results);
      });

      connection.end((err) => {
        if (err) {
          return reject("error: " + err.message);
        }
      });
    });
  });
};

module.exports = { query };
