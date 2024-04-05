const express = require('express')
require("dotenv").config();

const app = express();

const User = require('./models/User');
const Book = require('./models/Book');

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

// routes du projet
app.post('/api/auth/signup', (req, res, next) => {

    console.log(req.body);
    const user = new User({
        email: req.body.email,
        password: req.body.password //! Attention, hashage du mot de passe
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée avec succès !' }))
        .catch(error => res.status(400).json({ error }));

    next();
}); // création d'un user

app.post('/api/auth/login', (req, res, next) => {
    console.log(req.body);
    // Corps de la requete : { email: string, password: string }
    // Type de réponse attendue : { userId: string, token: string }

}); // permet à un user de s'authentifier. Renvoie un userId et un token

app.get('/api/books', (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}); // Permet d'afficher tous les livres

app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
}); // Permet d'afficher le livre sélectionné

app.get('/api/books/bestrating', (req, res, next) => {
    //retourne un tableau de trois livres
}); // Permet d'afficher les 3 livres ayant la note (moyenne de note) la plus élevée

app.post('/api/books', (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Corps de la requete : { book: string, image: file }
    // Type de réponse attendue : { message: String } Verb
}); // Capture et enregistre l'image, analyse le livre transformé en chaîne de caractères, et l'enregistre dans la base de données en définissant correctement son ImageUrl.Initialise la note moyenne du livre à 0 et le rating avec un tableau vide. Remarquez que le corps de la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne pour le corps de la demande en fonction des données soumises avec le fichier.

app.put('/api/books/:id', (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Corps de la requete : EITHER Book as JSON OR { book: string, image: file }
    // Type de réponse attendue : { message: string }
}); // Met à jour le livre avec l'_id fourni. Si une image est téléchargée, elle est capturée, et l’ImageUrl du livre est mise à jour. Si aucun fichier n'est fourni, les informations sur le livre se trouvent directement dans le corps de la requête (req.body.title, req.body.author, etc.). Si un fichier est fourni, le livre transformé en chaîne de caractères se trouve dans req.body.book. Notez que le corps de la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier

app.delete('/api/books/:id', (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Type de réponse attendue : { message: string }
}); // Supprime le livre selectionné avec l’image associée.

app.post('/api/books/:id/rating', (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Corps de la requete : { userId: String, rating: Number }
    // Type de réponse attendue : } Single book
}); // Définit la note pour le user ID fourni. La note doit être comprise entre 0 et 5. L'ID de l'utilisateur et la note doivent être ajoutés au tableau "rating" afin de ne pas laisser un utilisateur noter deux fois le même livre. Il n’est pas possible de modifier une note. La note moyenne "averageRating" doit être tenue à jour, et le livre renvoyé en réponse de la requête.


module.exports = app;