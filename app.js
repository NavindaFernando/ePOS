const express = require("express");

const user = require("./routes/user");
const item = require("./routes/item");
const order = require("./routes/order");
const order_detail = require("./routes/orderDetail");

const app = express();
const port = 4000;

app.use(express.json());

app.use('/users', user);
app.use('/items', item)
app.use('/orders', order)
app.use('/order_details', order_detail)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
