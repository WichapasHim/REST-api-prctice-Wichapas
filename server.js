const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Routes files
const hospitals = require("./routes/hospitals");
const appointments = require("../routes/appointments");
const auth = require("./routes/auth");
const app = express();
//connect to database
connectDB();

//body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.use("/api/v1/auth", auth);

//Mount routers
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/appointments", appointments);

const PORT = process.env.PORT || 6000;

const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, "mode on port ", PORT)
);

//Handle unhandled promise rejections
process.on("unhandleRejection", (err, Promise) => {
  console.log(`Error : ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
