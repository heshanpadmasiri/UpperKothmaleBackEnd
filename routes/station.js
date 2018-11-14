var express = require('express');
var router = express.Router();

const stationModel = require('../models/station');

router.get('/readings', (req,res)=> {
    stationModel.get_data((err,data)=>{
        if(err){
            res.json({
                sucess:false,
                msg:err
            })
        } else {
            res.json({
                sucess:true,
                data:data
            });
        }
    })
});

module.exports = router;