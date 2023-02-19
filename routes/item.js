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
    console.log("Connected to the mysql server / item");
    var itemTableQuery =
      "CREATE TABLE IF NOT EXISTS items (code VARCHAR(255) PRIMARY KEY, name VARCHAR(255), price DOUBLE, qty INT)";
    connection.query(itemTableQuery, function (err, result) {
      // execute sql query
      if (err) throw err;
      if (result.warningCount === 0) {
        // warningCount-0 = create new table / warningCount-1 = if exist table
        console.log("item table created!");
      }
    });
  }
});

router.get("/", (req, res) => {
  // mysql query
  var query = "SELECT * FROM items";

  // execute query
  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

router.post("/", (req, res) => {
  // catch the values
  const code = req.body.code;
  const name = req.body.name;
  const price = req.body.price;
  const qty = req.body.qty;

  // mysql query
  var query = "INSERT INTO items (code, name, price, qty) VALUES (?, ?, ?, ?)";

  // execute sql query
  connection.query(query, [code, name, price, qty], (err) => {
    if (err) {
      res.send({ message: "duplicate entry" });
    } else {
      res.send({ message: "item added" });
    }
  });
});

router.put("/", (req, res) => {
    // catch body values
    const code = req.body.code;
    const name = req.body.name;
    const price = req.body.price;
    const qty = req.body.qty;
  
    // mysql query
    var query = "UPDATE items SET name=?, price=?, qty=? WHERE code=?";
  
    // execute query
    connection.query(query, [name, price, qty, code], (err, rows) => {
      if (err) console.log(err);
  
      if (rows.affectedRows > 0) {
        res.send({ message: "item updated" });
      } else {
        res.send({ message: "item not found" });
      }
    });
  });

  router.delete("/:code", (req, res) => {
    const code = req.params.code;
  
    // mysql query
    var query = "DELETE FROM items WHERE code=?";
  
    // execute query
    connection.query(query, [code], (err, rows) => {
      if (err) console.log(err);
  
      if (rows.affectedRows > 0) {
        res.send({ message: "item deleted" });
      } else {
        res.send({ message: "item not found" });
      }
    });
  });

  router.get("/:code", (req, res) => {
    // get code in params
    const code = req.params.code;
  
    // mysql query
    var query = "SELECT * FROM items WHERE code=?";
  
    // execute query
    connection.query(query, [code], (err, row) => {
      if (err) console.log(err);
  
      res.send(row);
    });
  });

module.exports = router;
