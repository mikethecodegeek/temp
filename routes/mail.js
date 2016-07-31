var express = require('express');
var path = require('path');
var router = express.Router();
var request = require('request');
var http = require('http');
var sendgrid = require('sendgrid')('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');
var User = require('../models/user');
var Email = require('../models/emails');
var alertAdmin = require('../config/mail')
var app = express();

router.post('/inquiry/', function(req,res) {
    User.find({superadmin:true})
        .exec((err, admin) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {

                var data = {
                    from: req.body.message.useremail,
                    to: admin[0].email,
                    subject: "Customer Inquiry",
                    html: req.body.message.emailbody
                }
                sendgrid.send(data, (err, body) => err ? res.send(err) : res.send(body));
            }
        });
});

router.post('/newtestimonial/', function(req,res) {
    User.find({superadmin:true})
        .exec((err, admin) => {
            if (err) {
                res.send(err);
            }
            else {
                var data = {
                    from: req.body.message.email,
                    to: admin[0].email,
                    subject: "Your have a new testimonial!!",
                    html: `From: ${req.body.message.name} <br> Testimonial: <br> ${req.body.message.content}`
                }

                sendgrid.send(data, (err, body) => err ? res.send(err) : res.send(body));
            }
        });
});

router.post('/newbusinesscontact/', function(req,res) {
//console.log(req.body)
    User.find({superadmin:true})
        .exec((err, admin) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {

                var data = {
                    from: req.body.message.email,
                    to: admin[0].email,
                    subject: 'You have a new inquiry from your business/wholesale form!',
                    html: `Name: ${req.body.message.name} <br> 
                        Phone: ${req.body.message.phone} <br> 
                        Subject: ${req.body.message.subject} <br>
                        ${req.body.message.content}`
                }

                sendgrid.send(data, (err, body) => err ? res.send(err) : res.send(body));
            }
        });
});

router.post('/newcontact/', function(req,res) {
    User.find({superadmin:true})
        .exec((err, admin) => {
            if (err) {
                res.send(err);
            }
            else {
                var data = {
                    from: req.body.message.email,
                    to: admin[0].email,
                    subject: 'You have a new inquiry from your Contact Us form!',
                    html: `Name: ${req.body.message.name} <br> 
                        Subject: ${req.body.message.subject} <br>
                        ${req.body.message.content}`
                }
                sendgrid.send(data, (err, body) => err ? res.send(err) : res.send(data));
            }
        });
});

router.get('/firsttemplate', (req,res) => {
    Email.findOne({status: 'confirm'})
        .exec((err,data) => err ? res.status(400).send(err) : res.status(200).send(data));
})

router.post('/sendmail/', function(req,res) {
 console.log(req.body)
    Email.findOne({status:"confirm"})
        .exec((err, admin) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                var data = {
                    from: admin.sentfrom,
                    to: req.body.user.email,
                    subject: admin.subject,
                    html: admin.body
                }

                sendgrid.send(data, function (err, body) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        User.findOne({superadmin:true})
                            .exec((err, admin) => {
                                if (err) {
                                    res.send(err);
                                }
                                else {
                                    alertAdmin(admin.email, function (err, body) {
                                        if (err) {
                                            console.log(err)
                                            res.send(err);
                                        }
                                        else {
                                            res.send('submitted');
                                        }
                                    });



                                }

                            });
                    }
                });
             }
        });
});

router.post('/adminalert/', function(req,res) {

    User.findOne({superadmin:true})
        .exec((err, admin) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                alertAdmin(admin.email,(err, body) => err ? res.send(err) : res.send(body));
            }
        });
});

router.post('/savetemplate', (req,res)=> {
    Email.create(req.body.message,(err, email)=> err ? res.send(err) : res.send(email));
});


router.put('/:id', (req,res)=> {
    Email.findByIdAndUpdate({status: 'confirm'},{$set: req.body.item}, {new:true}, (err,data)=> {
        if (err){
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});



module.exports = router;
