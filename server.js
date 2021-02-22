const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const loginRoutes = require("./routes/login");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/login",loginRoutes);

app.listen(3000,function() {
    console.log("server started");
});

