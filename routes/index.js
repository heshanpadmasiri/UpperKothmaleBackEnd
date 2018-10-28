var express = require('express');
var router = express.Router();
const sql = require('mssql/msnodesqlv8')

const pool = new sql.ConnectionPool({
  database: 'UkhpDB',
  server: "DESKTOP-MT3R6TF",
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function test(callback){
  pool.request().query('SELECT TOP (1000) * FROM dbo.tbl_rain_fall_10m').then((err,result) => {
    if(err){
      console.error(err);
      callback(err,null);
    } else {
      console.log(result);
      callback(null,result)
    }
  });
}

router.get('/test', function (req, res) {
  if(pool.connected){
    test((err,data)=>{
      if(err){
        res.json({
          sucess:false,
          msg:err
        })
      } else {
        res.json({
          sucess:true,
          msg:data
        })
      }
    })
  } else {
    pool.connect().then(()=>{
      test((err,data)=>{
        if(err){
          res.json({
            sucess:false,
            msg:err
          })
        } else {
          res.json({
            sucess:true,
            msg:data
          })
        }
      })
    })    
  } 
})

module.exports = router;
