var mongoose = require('mongoose');

var capacitySchema = new mongoose.Schema({
    size: {type: String},
    imgurl: {type: String},
    devicetype: {type: String},
    brand: {type: String},
    version: {type: String},
    model: {type: String},
    refId: {type: String},
    new: {type: Number},
    used: {type: Number},
    broken: {type: Number}
});


var Capacities = mongoose.model('Capacities', capacitySchema);

module.exports = Capacities;
