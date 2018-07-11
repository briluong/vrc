const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// CURRENCY SCHEMA

var courseSchema = mongoose.Schema({
    ownerId: {
        type: String,
        label: 'Owner ID',
    },
    instructors: [],
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
    instructorName: String
});

// Export the coin model.
module.exports = mongoose.model('vrc-course', courseSchema);
