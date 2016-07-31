var express = require('express');
var router = express.Router();
var Quotes = require('../models/quotes');


router.get('/', (req,res)=> {
    Quotes.find({kitordered:true, adminviewed:false})
        .exec((err, data) => err ? res.send(err) : res.send(data));
});

router.post('/newquote', (req,res)=> {
    console.log(req.body);
    var newQuote = {
        username: req.body.user.data.username,
        email: req.body.user.data.email,
        amount: req.body.transaction.quote,
        device: req.body.transaction.device,
        condition: req.body.transaction.condition,
        date: req.body.transaction.date,
        paymentmethod: req.body.transaction.paymentmethod
    }

    Quotes.create(newQuote,(err, data)=> {
        if (err){console.log(err)}
            else {
            console.log(data)
            res.status(200).send(data);
        }

    });
});

router.post('/order/:id', (req,res)=> {
    Quotes.findById(req.params.id, (err,data) => {
        if (err) {
            res.send(err);
        }
        else {
            data.name = req.body.user;
            data.shippingaddress = req.body.shippingaddress;
            data.status = 'Kit Ordered!';
            data.kitordered = true;
            data.save();
            res.send(data);
       }
   });
});
router.delete('/admin/:id', (req,res)=> {
    Quotes.findById(req.params.id, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            data.adminviewed = true;
            data.save((err,quotes) => {
                Quotes.find({kitordered:true, adminviewed: false})
                    .exec((err, quotes) => err ? res.send(err) : res.send(quotes));
            });

        }
    });
});

router.get('/:id', (req,res)=> {
    Quotes.findById(req.params.id, (err,data) => err ? res.send(err) : res.send(data));
});


router.delete('/:id', (req,res)=> {
    Quotes.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            Quotes.find({})
                .exec((err, data) => err ? res.send(err) : res.send(data));
        }
    });
});

router.put('/:id', (req,res)=> {
    Quotes.findByIdAndUpdate(req.params.id,{$set: req.body.item}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;

