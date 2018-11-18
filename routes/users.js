var express = require('express');
var router = express.Router();
const userModal = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create-user',(req,res)=>{
  const r = req.body;

  userModal.createUser(r,(err,data)=>{
    if(err){
      console.log(err);
      res.json({
        sucess:false,
        msg:err
      });
    } else {
      res.json({
        sucess:true,
        data:data
      });
    }
  });
})

router.get('/hash',(req,res)=>{
  const r = req.query;
  console.log('params:',req.query)
  userModal.getPassword(r,(err,data)=>{
    if(err){
      console.log(err);
      res.json({
        sucess:false,
        msg:err
      });
    } else {
      res.json({
        sucess:true,
        data:data
      });
    }
  });
})
module.exports = router;
