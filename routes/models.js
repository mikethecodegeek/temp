var express = require('express');
var router = express.Router();
var DeviceModels = require('../models/devicemodels');
var Brands = require('../models/devicebrands');

router.get('/', (req,res)=> {
    DeviceModels.find({})
    .populate("capacities")
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/newmodel', (req,res)=> {
    console.log('this model',req.body.model.name)
    DeviceModels.findOne({name:req.body.model.name}, (err,devmodel) => {
        if (err){console.log('eror:', err)}
        console.log('devmodel: ',devmodel);
        if(devmodel) {res.status(400).send("Error: model already exists")}
        else {
            DeviceModels.create(req.body.model,(err, listing)=> {
                if (err){
                    res.status(400).send(err)
                } else {
                    Brands.findOne({name: req.body.model.brand, devicetype: req.body.model.devicetype}, (err, brandname) => {
                        //console.log(brandname)
                        if(err){res.send(err)}
                        else {
                            listing.refId = brandname._id;
                            brandname.models.push(listing._id);
                            brandname.save();
                            listing.save((err,model) => {
                                if (err) {res.status(400).send(err)}
                                else {res.status(200).send(model)}
                            } );

                        }
                    });
                }
            });
        }
    })

});

router.get('/:id', (req,res)=> {
    DeviceModels.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(data));
});


router.delete('/:id', (req,res)=> {
    DeviceModels.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err) {res.status(400).send(err);}
        else {
            DeviceModels.find({})
                .populate("capacities")
                .exec((err, data) => err ? res.send(err) : res.send(data));
        }
    });
});

router.put('/:id', (req,res)=> {
    DeviceModels.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> err ? res.send(err) : res.send(data));
});




module.exports = router;
