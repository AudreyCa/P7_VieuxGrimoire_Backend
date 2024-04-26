const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { 
        type: String
    },
    title: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String
    },
    imageUrl : { 
        type: String
    },
    year: { 
        type: Number
    },
    genre: { 
        type: String
    },
    ratings : [
        { 
            userId : String ,
            grade: Number,
        }
    ],
    averageRating : { 
        type: Number
    }
},
{
    collection: 'book',
    versionKey: false
});

module.exports = mongoose.model('book', bookSchema);