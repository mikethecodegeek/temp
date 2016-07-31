var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    message: {type: String},
    user: {type: Object}
});


var Messages = mongoose.model('Messages', messageSchema);

module.exports = Messages;
