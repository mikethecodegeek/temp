var express = require('express');
var router = express.Router();
var Devices = require('../models/devices');
var request = require('request');
var Model = require('../models/devicemodels');

router.get('/', (req,res)=> {
    Devices.find({})
        .populate('capacities')
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/type', (req,res)=> {
    Devices.find({type:req.body.type.devicetype})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/newdevice', (req,res)=> {
    console.log(req.body);
    Devices.findOne({devicename: req.body.device.devicename},(err, device) => {
        if (err) {
            console.log('err2', err)
            res.status(400).send(err);
        }
        if (!device) {
            Devices.create(req.body.device, (err, listing)=> {
                if (err) {
                    console.log(err);
                    res.status(400).send(err)
                } else {
                    Model.findOne({name: req.body.device.model}, (err, model)=> {
                        if (err) {
                            console.log('err', err);
                            res.send(err);
                        }
                        else {
                            console.log('model: ', model);
                            listing.refId = model._id;
                            
                            console.log('listing: ',listing);
                            model.devices.push(listing._id);
                            model.save()
                            listing.save( (err, savedlisting) => {
                                if (err) {res.status(400).send(err)}
                                else {res.status(200).send(savedlisting)}
                            } );
                        }
                    });
                }
            });
        }
        else if(device) {
           res.status(200).send(device);
        }
    })
});

router.get('/:id', (req,res)=> {
    Devices.findById(req.params.id, (err,data) => {
        if (err){res.send(err);}
        else {
            Devices.find({})
                .populate('capacities')
                .exec((err, data) => err ? res.send(err) : res.send(data));
        }
    });


});


router.delete('/:id', (req,res)=> {
    Devices.findByIdAndRemove(req.params.id, (err, data)=> {
        if (err) {
            res.status(400).send(err);
        }
        else {
            Devices.find({})
                .exec((err, data) => err ? res.status(400).send(err) : res.status(200).send(data));

        }
    });
});

router.put('/:id', (req,res)=> {
    Devices.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;
