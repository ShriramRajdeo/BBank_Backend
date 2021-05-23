const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const bloodBankRoutes = require("./routes/bloodbank")
const cors = require("cors");
app.use(cors());
dotenv.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/auth",authRoutes);
app.use("/user",userRoutes);
app.use("/bloodbank",bloodBankRoutes);

app.listen(process.env.APP_PORT,function() {
    console.log("server started");
});