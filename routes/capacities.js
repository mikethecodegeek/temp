var express = require('express');
var router = express.Router();
var Devices = require('../models/devices');
var Capacities = require('../models/capacities');



router.get('/', (req,res)=> {
    Capacities.find({})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/newcapacity', (req,res)=> {
    console.log('req.body:', req.body);
    Capacities.create(req.body.capacity,(err, listing)=> {
        console.log('req.body:', req.body);
        if (err){
            res.status(400).send(err)
        } else {
            Devices.findOne({devicename: req.body.capacity.devicename}, (err, device) => {
                if(err) {res.send(err)}
                else {
                    listing.refId = device._id;
                    listing.save();
                    device.capacities.push(listing._id);
                    device.save();
                    Capacities.find({})
                        .exec((err, data) => err ? res.send(err) : res.send(data));
                }
            });
        }
    });
});

router.get('/:id', (req,res)=> {
    Capacities.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(data));
});

router.delete('/:id', (req,res)=> {
    Capacities.findByIdAndRemove(req.params.id, (err,data) => err ? res.send(err) : res.send(data));
});

router.put('/:id', (req,res)=> {
    Capacities.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> err ? res.send(err) : res.send(data));
});




module.exports = router;
