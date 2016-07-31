var express = require('express');
var router = express.Router();
var Listing = require('../models/listings');
var request = require('request');


router.get('/', (req,res)=> {
    Listing.find({})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/newlisting', (req,res)=> {
    Listing.createListing(req.body,(err, listing)=> err ? res.send(err) : res.send(listing));
});

router.get('/:id', (req,res)=> {
    Listing.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(listing));
});


router.delete('/:id', (req,res)=> {
    Listing.findByIdAndRemove(req.params.id, (err,data)=> err ? res.send(err) : res.send(data));
});

router.put('/:id', (req,res)=> {
    Listing.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;

