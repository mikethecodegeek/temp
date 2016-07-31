var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceTypeSchema = new mongoose.Schema({
    devicetype: {type: String},
    imgurl: {type: String},
    brands: [{ type: Schema.Types.ObjectId, ref: 'Brands' }]
});


var deepPopulate = require('mongoose-deep-populate')(mongoose);
deviceTypeSchema.plugin(deepPopulate);

var DeviceTypes = mongoose.model('DeviceTypes', deviceTypeSchema);

module.exports = DeviceTypes;
