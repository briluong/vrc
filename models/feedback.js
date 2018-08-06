const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var FeedbackSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        label: 'Uploaded time',
        default: new Date()
    },
    lectureID: String,
    value:{
        type: String
    },
    sentBy: String
});

// Export the audio model.
module.exports = mongoose.model('vr-feedback', FeedbackSchema);
