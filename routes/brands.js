var express = require('express');
var router = express.Router();
var DeviceTypes = require('../models/deviceTypes');
var Brands = require('../models/devicebrands');


router.get('/', (req,res)=> {
    Brands.find({})
        .exec((err, data) => err ? res.status(400).send(err) : res.status(200).send(data));
});

router.post('/type', (req,res)=> {
    console.log('req.body', req.body);
    Brands.find({devicetype:req.body.type})
        .deepPopulate('models models.devices models.devices.capacities')
        .exec((err, data) => err ? res.status(400).send(err) : res.status(200).send(data));
});

router.post('/newbrand', (req,res)=> {
    console.log(req.body.devicetype)
    Brands.create(req.body.brand,(err, listing)=> {
        if (err){
            res.status(400).send(err);
        } else {
            DeviceTypes.findOne({devicetype: req.body.brand.devicetype}, (err, device) => {
                if(err) {
                    res.send(err);
                }
                else {
                    listing.refId = device._id;
                   // listing.save();
                    console.log(listing);
                    device.brands.push(listing._id);
                    device.save();
                    listing.save((err,saveddevice) => {
                        console.log(saveddevice)
                        if (err){res.status(400).send(err)}
                        else {res.status(200).send(saveddevice)}
                    });

                    // Brands.find({})
                    //     .exec((err, data) => err ? res.send(err) : res.send(data));
                }

            });

        }
    });
});

router.get('/:id', (req,res)=> {
    Brands.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(data));
});

router.delete('/:id', (req,res)=> {
    Brands.findByIdAndRemove(req.params.id, (err, data)=> {
        if (err) {
            res.status(400).send(err);
        }
        else {
            Brands.find({})
                .exec((err, data) => err ? res.status(400).send(err) : res.status(200).send(data));

        }
    });
});

router.put('/:id', (req,res)=> {
    Brands.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> err ? res.send(err) : res.send(data));
});

module.exports = router;
