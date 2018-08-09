/**
 * Created by MichaelWang on 2018-08-08.
 */
/**
 * Created by MichaelWang on 2018-08-08.
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var InstructorFileSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        label: 'Uploaded time',
        default: new Date()
    },
    lectureID: {
        type: String,
        unique: true
    },
    data:{
        type: Buffer,
    },
    fileType: String
});

// Export the audio model.
module.exports = mongoose.model('vr-instructor-file', InstructorFileSchema);
