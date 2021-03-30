const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");

const authRoutes = require("./routes/auth")

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/auth",authRoutes);

app.listen(3000,function() {
    console.log("server started");
});
