var express = require('express');
var router = express.Router();

const stationModel = require('../models/station');

router.get('/readings', (req,res)=> {
    console.log('station get started')
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

router.get('/report', (req,res) => {
    stationModel.get_report((err,data) => {
        if(err){
            res.json({
                sucess:false,
                msg:err
            })
        } else {
            res.json({
                sucess:true,
                data:data
            })
        }
    });
})

router.get('/names', (req,res)=> {
    stationModel.get_names((err,data)=>{
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

router.get('/report', (req,res)=>{

})

module.exports = router;