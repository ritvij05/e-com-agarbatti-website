const express = require("express");
const router = express.Router();
const connectDB = require("../../config/db");
// console.log(connectDB.con)

router.get('/', function (req, res) {
    connectDB.getConnection(function(err, connection) {
        connection.query('SELECT * FROM login', function (error, results) {
          connection.release();
          if (error) throw error;
          console.log(results)
          res.render('pages/index');
        });
      }); 
  
});


module.exports = router;