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
    console.log("Connected to the mysql server / order detail");
    var orderDetailTableQuery =
      "CREATE TABLE IF NOT EXISTS order_details (orderdetailid VARCHAR(255) PRIMARY KEY, orderid VARCHAR(255), userid VARCHAR(255), code VARCHAR(255), qty INT)";
    connection.query(orderDetailTableQuery, function (err, result) {
      // execute sql query
      if (err) throw err;
      if (result.warningCount === 0) {
        // warningCount-0 = create new table / warningCount-1 = if exist table
        console.log("order_detail table created!");
      }
    });
  }
});

router.get("/", (req, res) => {
  // mysql query
  var query = "SELECT * FROM order_details";

  // execute query
  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

router.post("/", (req, res) => {
  // catch the values
  const orderdetailid = req.body.orderdetailid;
  const orderid = req.body.orderid;
  const userid = req.body.userid;
  const code = req.body.code;
  const qty = req.body.qty;

  // mysql query
  var query =
    "INSERT INTO order_details (orderdetailid, orderid, userid, code, qty) VALUES (?, ?, ?, ?, ?)";

  // execute sql query
  connection.query(
    query,
    [orderdetailid, orderid, userid, code, qty],
    (err) => {
      if (err) {
        res.send({ message: "duplicate entry" });
      } else {
        res.send({ message: "order_detail added" });
      }
    }
  );
});

router.put("/", (req, res) => {
  // catch body values
  const orderdetailid = req.body.orderdetailid;
  const orderid = req.body.orderid;
  const userid = req.body.userid;
  const code = req.body.code;
  const qty = req.body.qty;

  // mysql query
  var query =
    "UPDATE order_details SET orderid=?, userid=?, code=?, qty=? WHERE orderdetailid=?";

  // execute query
  connection.query(
    query,
    [orderid, userid, code, qty, orderdetailid],
    (err, rows) => {
      if (err) console.log(err);

      if (rows.affectedRows > 0) {
        res.send({ message: "order_detail updated" });
      } else {
        res.send({ message: "order_detail not found" });
      }
    }
  );
});

router.delete("/:orderdetailid", (req, res) => {
  const orderdetailid = req.params.orderdetailid;

  // mysql query
  var query = "DELETE FROM order_details WHERE orderdetailid=?";

  // execute query
  connection.query(query, [orderdetailid], (err, rows) => {
    if (err) console.log(err);

    if (rows.affectedRows > 0) {
      res.send({ message: "order detail deleted" });
    } else {
      res.send({ message: "order detail not found" });
    }
  });
});

router.get("/:orderdetailid", (req, res) => {
  const orderdetailid = req.params.orderdetailid;

  // mysql query
  var query = "SELECT * FROM order_details WHERE orderdetailid=?";

  // execute query
  connection.query(query, [orderdetailid], (err, row) => {
    if (err) console.log(err);

    res.send(row);
  });
});

module.exports = router;