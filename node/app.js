const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL
    );`;

const newUser = `INSERT INTO people(username) values('Wellinton');`;

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }

  console.log("Connected to the database.");

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table: ", err);
    }

    connection.query(newUser, (err) => {
      if (err) {
        console.error("Error inserting new user: ", err);
      }

      connection.query("SELECT * FROM people;", (err, rows) => {
        if (err) {
          console.error("Error selecting data: ", err);
        } else {
          console.log("Data selected: ", rows);
        }
        connection.end();

        app.get("/", (req, res) => {
          let peopleList = "<h1>Full Cycle Rocks!<h1><ul>";

          for (const person of rows) {
            peopleList += `<li>${person.username} - ${person.id}</li>`;
          }

          peopleList += "</ul>";

          res.send(peopleList);
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
