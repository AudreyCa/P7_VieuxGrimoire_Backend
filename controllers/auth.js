const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


// POST : création d'un user (signup)
exports.createUser = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
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
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error })
        });
}

// POST : Login
exports.authentificateUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.TOKEN_SECRET,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}