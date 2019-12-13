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
const testRouter = require("./routes/test")
const indexRouter = require("./routes/index")
const userRouter = require("./routes/user")

app.use(express.json());
app.use('/',indexRouter)
app.use('/test',testRouter)
app.use('/user',userRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
