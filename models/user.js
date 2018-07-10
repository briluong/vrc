const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt   = require('bcrypt');

// USER SCHEMA

var userSchema = mongoose.Schema({

    firstName: String,
    lastName: String,
    accountType: String,
    email: String,
    studentID: String,
    password: String,
});


// USER METHODS

// Generate a hash for the password.
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Check if the password is valid.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Export the user model.
module.exports = mongoose.model('vrc-user', userSchema);
