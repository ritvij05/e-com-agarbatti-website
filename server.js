const express = require("express");

const app = express();
const path = require('path');

// Express Middleware
const bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash-messages');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());

app.use(cookieParser());
app.use(session({secret: "its a secret!" ,
        resave: false,
        saveUninitialized: true,
      }));

// Setting View Enginer
app.set("view engine", "ejs");

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// Define Routes
app.use("/admin/", require("./routes/adminRoutes"));
app.use("/", require("./routes/userRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
