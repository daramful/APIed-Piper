// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true, default: ""},
    email: {type: String, required: true, default: ""},
    pendingTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }],
    dateCreated: { type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);