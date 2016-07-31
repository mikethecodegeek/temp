var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var deviceBrandSchema = new mongoose.Schema({
    name: {type: String},
    imgurl: {type: String},
    devicetype: {type: String},
    refId: {type: String},
    models: [{ type: Schema.Types.ObjectId, ref: 'DeviceModels' }]
});


deviceBrandSchema.plugin(deepPopulate);

var Brands = mongoose.model('Brands', deviceBrandSchema);

module.exports = Brands;
