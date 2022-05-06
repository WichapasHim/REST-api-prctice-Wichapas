const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitizer = require('express-mongo-sanitize');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


//Load env vars
dotenv.config({ path: "./config/config.env" });

//Routes files
const hospitals = require("./routes/hospitals");
const appointments = require("./routes/appointments");
const auth = require("./routes/auth");
const app = express();
//connect to database
connectDB();

const swaggerOptions ={
  swaggerDefinition:{
    openapi:'3.0.0',
    info:{
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express VacQ API'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      }
    ],
  },
  apis:['./routes/*.js'],
};
const swaggerJsDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerJsDocs));

//body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());
//sanitize
app.use(mongoSanitizer());

//srt security header
app.use(helmet());

//prevent xss attacks
app.use(xss());

//Rate Limiting
const limiter =  rateLimit({
  windowsMs : 10*60*1000 ,// 10 mins
  max:100
})
app.use(limiter);

//prevent http param pollutions
app.use(hpp());

//enable CORS
app.use(cors());




//Mount routers
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);
const PORT = process.env.PORT || 5000;

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


