const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 4000;
const app = express();

mongoose.connect(
  process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true
  }
);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
  console.log("we're connected!");
});


app.use(express.json());


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
