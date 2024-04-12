const User = require('../models/User');


// POST : créeation d'un user
exports.createUser = (req, res) => {
    console.log(req.body);
    const user = new User({
        email: req.body.email,
        password: req.body.password //! Attention, hashage du mot de passe
    });
    user.save()
        .then(() => {
            console.log("Utilisateur ajoutée en BDD");
            res.status(201).json({ message: 'Utilisateur crée avec succès !' })
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ error: error.message });
        });
}

// POST : Login (Renvoie un userId et un token)
exports.authentificateUser = (req, res, next) => {
    console.log(req.body);
    // Corps de la requete : { email: string, password: string }
    // Type de réponse attendue : { userId: string, token: string }
}