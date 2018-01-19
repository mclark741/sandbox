var mongoose = require('mongoose');

// create the user schema for the user objects in the database
var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {
        type: Date,
        default: Date.now
    }
});

var postSchema = new mongoose.Schema({
    text: String,
    created_by: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

// declare the models for use with mongoose
mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);