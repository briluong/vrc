const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt   = require('bcrypt-nodejs');

// USER SCHEMA

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    accountType: String,
    email: String,
    studentID: String,
    password: String,
    online: Boolean
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
const User = mongoose.model('vrc-user', userSchema);
module.exports = User
