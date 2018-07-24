const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var QuestionsSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        label: 'Uploaded time',
        default: new Date()
    },
    questionType: {
        type: String,
        defaultValue: 'audio',
        allowedValues: ['audio','text']
    },
    lectureID: String,
    size: {
        type: Number
    },
    name: {
        type: String
    },
    data: {
        type: Buffer
    },
    text:{
        type: String
    },
    sentBy: String,
    confidence: Number
});

// Export the audio model.
module.exports = mongoose.model('vr-questions', QuestionsSchema);
