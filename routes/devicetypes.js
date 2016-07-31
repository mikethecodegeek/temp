var express = require('express');
var router = express.Router();
var DeviceTypes = require('../models/deviceTypes');
var request = require('request');

router.get('/', (req,res)=> {
    DeviceTypes.find()
        .deepPopulate('brands brands.models brands.models.devices')
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/newdevice', (req,res)=> {
    DeviceTypes.create(req.body.device,(err, device)=> {
        // if (err){
        //     console.log(err);
        //     res.status(400).send(err)
        // } else {
        //     DeviceTypes.find({})
        //         .exec((err, data) => err ? res.send(err) : res.send(data));
        // }
       err ? res.status(400).send(err) : res.status(200).send(device)
    });
});

router.get('/:id', (req,res)=> {
    DeviceTypes.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(data));
});


router.delete('/:id', (req,res)=> {
    DeviceTypes.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err){res.status(400).send(err);}
       else {
            DeviceTypes.find({})
                .deepPopulate('brands brands.models brands.models.versions')
                .exec((err, data) => err ? res.send(err) : res.send(data));
        }

    });
});

router.put('/:id', (req,res)=> {
    DeviceTypes.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;
