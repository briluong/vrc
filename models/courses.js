const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// COURSES SCHEMA

var courseSchema = mongoose.Schema({
    ownerId: {
        type: String,
        label: 'Owner ID',
    },
    instructors: [{email: String, instructorName: String}],
    title: {
        type: String,
        minlength: 1
    },
    code: {
        type: String,
        unique: true,
        minlength: 1
    },
    active: {
        type: Boolean,
        default: true,
    },
    description: String,
    students: [String],
    instructorName: String,
    lectures: [{lectureID: String, lectureTitle: String, active: Boolean, createdOn: Date}],
    groups: {}
});

// Export the coin model.
module.exports = mongoose.model('vrc-course', courseSchema);
