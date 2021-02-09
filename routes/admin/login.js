const express = require("express");
const router = express.Router();
const connectDB = require("../../config/db");
// console.log(connectDB.con)

router.get('/', function (req, res) {
    connectDB.getConnection(function(err, connection) {
        connection.query('SELECT * FROM amt_source', function (error, results) {
          connection.release();
          if (error) throw error;
          console.log(results)
          res.render('pages/login');
        });
      }); 
  
});


module.exports = router;