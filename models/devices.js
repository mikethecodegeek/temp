var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceSchema = new mongoose.Schema({
    devicename: {type: String},
    description: { type: String },
    imgurl: {type: String},
    refId: {type: String},
    type: {type: String},
    brand: {type: String},
    model: {type: String},
    capacities: [{ type: Schema.Types.ObjectId, ref: 'Capacities' }]
});


var Devices = mongoose.model('Devices', deviceSchema);

module.exports = Devices;
