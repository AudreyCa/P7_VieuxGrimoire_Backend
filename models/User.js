const mongoose = require('mongoose');
const validator = require('validator'); // pour valider que l'email soit bien au format email (validate)
const uniqueValidator = require('mongoose-unique-validator'); // pour que l'email soit unique (unique:true)

const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: [true, 'Email requit'],
        validate: {
            validator: validator.isEmail,
            message: 'Merci de remplir une adresse email valide',
        },
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

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);