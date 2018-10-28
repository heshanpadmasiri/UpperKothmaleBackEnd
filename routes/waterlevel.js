var express = require('express');
var router = express.Router();

const waterLevelModel = require('../models/waterlevel');

router.get('/daily', function (req, res) {
    const number_of_units = req.query.number_of_units;
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
                msg:data
            });
        }
    })
});

router.get('/hourly', function (req, res) {
    const number_of_days = req.query.number_of_units;
    waterLevelModel.get_data(number_of_days,'hour',(err,data) => {
        if(err){
            console.log(err);
            res.json({
                sucess:false,
                msg:err
            });
        } else {
            res.json({
                sucess:true,
                msg:data
            });
        }
    })
});

router.get('/monthly', function (req, res) {
    const number_of_days = req.query.number_of_units;
    waterLevelModel.get_data(number_of_days,'month',(err,data) => {
        if(err){
            console.log(err);
            res.json({
                sucess:false,
                msg:err
            });
        } else {
            res.json({
                sucess:true,
                msg:data
            });
        }
    })
});

module.exports = router;