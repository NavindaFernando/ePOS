const express = require("express");
const mysql = require("mysql"); // import mysql
const db = require("../configs/db.configs"); // import db.configs.js file
const router = express.Router();

const connection = mysql.createConnection(db.database); // create connection

// checking whether it mysql connect or not
connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the mysql server / user");
    var userTableQuery =
      "CREATE TABLE IF NOT EXISTS users (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), username VARCHAR(255))";
    connection.query(userTableQuery, function (err, result) {
      // execute sql query
      if (err) throw err;
      if (result.warningCount === 0) {
        // warningCount-0 = create new table / warningCount-1 = if exist table
        console.log("user table created!");
      }
    });
  }
});

router.get("/", (req, res) => {
  // mysql query
  var query = "SELECT * FROM users";

  // execute query
  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

router.post("/", (req, res) => {
  // catch the values
  const id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;

  // mysql query
  var query = "INSERT INTO users (id, name, username) VALUES (?, ?, ?)";

  // execute sql query
  connection.query(query, [id, name, username], (err) => {
    if (err) {
      res.send({ message: "duplicate entry" });
    } else {
      res.send({ message: "user created" });
    }
  });
});

router.put("/", (req, res) => {
  // catch body values
  const id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;

  // mysql query
  var query = "UPDATE users SET name=?, username=? WHERE id=?";

  // execute query
  connection.query(query, [name, username, id], (err, rows) => {
    if (err) console.log(err);

    if (rows.affectedRows > 0) {
      res.send({ message: "user updated" });
    } else {
      res.send({ message: "user not found" });
    }
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  // mysql query
  var query = "DELETE FROM users WHERE id=?";

  // execute query
  connection.query(query, [id], (err, rows) => {
    if (err) console.log(err);

    // affectedRows > 0 = There has been an delete
    // affectedRows == 0 = There has not been an delete
    if (rows.affectedRows > 0) {
      res.send({ message: "user deleted" });
    } else {
      res.send({ message: "user not found" });
    }
  });
});

router.get("/:id", (req, res) => {
  // get id in params
  const id = req.params.id;

  // mysql query
  var query = "SELECT * FROM users WHERE id=?";

  // execute query
  connection.query(query, [id], (err, row) => {
    if (err) console.log(err);

    res.send(row);
  });
});

module.exports = router;
