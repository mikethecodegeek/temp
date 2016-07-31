var mongoose = require('mongoose');

var quoteSchema = new mongoose.Schema({
    username: {type: String},
    amount: { type: Number, required: true },
    device: { type: String, required: true },
    status: { type: String, default: 'Kit Not Ordered'},
    kitordered: {type: Boolean, default: false},
    adminviewed: {type: Boolean, default: false},
    name: {type: String},
    shippingaddress: {type: Object},
    capacity: {type: String},
    condition: {type: String},
    date: { type: String},
    paymentmethod: {type: String}
});


var Quotes = mongoose.model('Quotes', quoteSchema);

module.exports = Quotes;
