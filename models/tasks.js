// Load required packages
var mongoose = require('mongoose');

// Define schema
var TaskSchema   = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  deadline: {type: Date, required: true},
  completed:{type:Boolean, enum: [true, false], default: false},                //set it to be false in default, so that it won't be empty value  
  assignedUser: {type: String, default: ""},                                    //The _id field of the user this task is assigned to - default ""
  assignedUserName: {type: String, default: "unassigned"},                      //The name field of the user this task is assigned to - default "unassigned"
  dateCreated: { type: Date, default: Date.now }                                //should be set automatically by server to present date
});

// Export the Mongoose model
module.exports = mongoose.model('Tasks', TaskSchema);