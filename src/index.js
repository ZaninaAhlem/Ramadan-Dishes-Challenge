const express = require("express");
require("./db/mongoose");
const cors = require("cors");
const dishRouter = require("./routers/dish");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(dishRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
