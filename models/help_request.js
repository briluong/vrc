const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var HelpSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        label: 'Uploaded time',
        default: new Date()
    },
    lectureID: String,
    groupName:{
        type: String
    },
    value:{
        type: Boolean,
        default: false
    },
});

// Export the audio model.
module.exports = mongoose.model('vr-help', HelpSchema);
