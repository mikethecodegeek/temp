var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceModelSchema = new mongoose.Schema({
    name: {type: String},
    imgurl: {type: String},
    devicetype: {type: String},
    brand: {type: String},
    size: {type: String},
    refId: {type: String},
    version: {type: String},
    model: {type: String},
    devices: [{ type: Schema.Types.ObjectId, ref: 'Devices' }]
});


var DeviceModels = mongoose.model('DeviceModels', deviceModelSchema);

module.exports = DeviceModels;
