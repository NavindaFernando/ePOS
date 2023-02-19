const express = require("express");
const mysql = require("mysql");
const db = require("../configs/db.configs");
const router = express.Router();

const connection = mysql.createConnection(db.database);

// checking whether it mysql connect or not
connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the mysql server / order");
    var orderTableQuery =
      "CREATE TABLE IF NOT EXISTS orders (orderid VARCHAR(255) PRIMARY KEY, date DATE, userid VARCHAR(255))";
    connection.query(orderTableQuery, function (err, result) {
      // execute sql query
      if (err) throw err;
      if (result.warningCount === 0) {
        // warningCount-0 = create new table / warningCount-1 = if exist table
        console.log("order table created!");
      }
    });
  }
});

router.get("/", (req, res) => {
  var query = "SELECT * FROM orders";
  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

router.post("/", (req, res) => {
  // catch the values
  const orderid = req.body.orderid;
  const date = req.body.date;
  const userid = req.body.userid;

  // mysql query
  var query = "INSERT INTO orders (orderid, date, userid) VALUES (?, ?, ?)";

  // execute sql query
  connection.query(query, [orderid, date, userid], (err) => {
    if (err) {
      res.send({ message: "duplicate entry" });
    } else {
      res.send({ message: "order added" });
    }
  });
});

router.put("/", (req, res) => {
  const orderid = req.body.orderid;
  const date = req.body.date;
  const userid = req.body.userid;

  var query = "UPDATE orders SET date=?, userid=? WHERE orderid=?";

  // execute query
  connection.query(query, [date, userid, orderid], (err, rows) => {
    if (err) console.log(err);

    if (rows.affectedRows > 0) {
      res.send({ message: "order updated" });
    } else {
      res.send({ message: "order not found" });
    }
  });
});

router.delete("/:orderid", (req, res) => {
  const orderid = req.params.orderid;

  // mysql query
  var query = "DELETE FROM orders WHERE orderid=?";

  // execute query
  connection.query(query, [orderid], (err, rows) => {
    if (err) console.log(err);

    if (rows.affectedRows > 0) {
      res.send({ message: "order deleted" });
    } else {
      res.send({ message: "order not found" });
    }
  });
});

router.get("/:orderid", (req, res) => {  
    const orderid = req.params.orderid;
  
    var query = "SELECT * FROM orders WHERE orderid=?";
  
    // execute query
    connection.query(query, [orderid], (err, row) => {
      if (err) console.log(err);
  
      res.send(row);
    });
  });

module.exports = router;
