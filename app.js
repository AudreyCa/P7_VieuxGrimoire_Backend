const express = require('express')
require("dotenv").config();

const app = express();

const authRouter = require("./routes/auth");
const booksRouter = require("./routes/books");


// Connexion à la BDD
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Nos routes
app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);


module.exports = app;