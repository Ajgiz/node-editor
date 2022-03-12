const express = require("express");
const app = express();
const Picture = require("./routes/pictires");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());
app.use("/image", express.static(__dirname + "/image/"));
app.use("/api", Picture);

const startServer = () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server starting in ${process.env.PORT} port`);
    });
    mongoose.connect(process.env.CONNECT_URL, () => {
      console.log("connect MongoDB");
    });
  } catch (e) {
    console.log(e.message);
  }
};

startServer();
