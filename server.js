const express = require("express");
// const connectDB = require("./config/db");

const app = express();

// Setting View Enginer
app.set("view engine", "ejs");

// Define Routes
app.use("/admin/login", require("./routes/admin/login"));
app.use("/", require("./routes/client/index"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
