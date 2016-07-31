var request = require('request');
var sendgrid = require('sendgrid')('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');

var alertAdmin = function (adminemail, cb) {
    console.log(adminemail);
    var data = {
        from: 'TechNation',
        to: adminemail,
        subject: 'You have a new order!',
        html: 'Please login to your quotes page to view the order and send out a kit'
    }

    sendgrid.send(data, (err, body) => err ? cb(err) : cb(null,body));
}

module.exports = alertAdmin;
