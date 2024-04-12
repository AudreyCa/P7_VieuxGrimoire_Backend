const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    }
},
{
    collection: 'user',
    versionKey: false
});

module.exports = mongoose.model('user', userSchema);