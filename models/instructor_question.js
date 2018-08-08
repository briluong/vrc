/**
 * Created by MichaelWang on 2018-08-08.
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var InstructorQuestionSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        label: 'Uploaded time',
        default: new Date()
    },
    lectureID: {
        type:String,
        unique: true
    },
    question:{
        type: String,
        default: false
    }
});

// Export the audio model.
module.exports = mongoose.model('vr-instructor-question', InstructorQuestionSchema);
