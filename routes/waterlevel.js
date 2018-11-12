var express = require('express');
var router = express.Router();

const waterLevelModel = require('../models/waterlevel');

router.get('/daily', function (req, res) {
    var number_of_units = 30;    
    if(req.query && req.query.number_of_units){
        number_of_units = req.query.number_of_units
    }
    waterLevelModel.get_data(number_of_units,'day',(err,data) => {
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
    })
});

router.get('/hourly', function (req, res) {
    var number_of_units = 24;    
    if(req.query && req.query.number_of_units){
        number_of_units = req.query.number_of_units
    }
    waterLevelModel.get_data(number_of_units,'hour',(err,data) => {
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
    })
});

router.get('/monthly', function (req, res) {
    var number_of_units = 30;    
    if(req.query && req.query.number_of_units){
        number_of_units = req.query.number_of_units
    }
    waterLevelModel.get_data(number_of_units,'month',(err,data) => {
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
    })
});

module.exports = router;