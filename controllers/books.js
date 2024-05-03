const Book = require('../models/Book');
const fs = require('fs'); // 'file systeme' nous donne accès au méthode permettant de modifier un système de fichier.


// GET
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}  // Permet d'afficher tous les livres

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
} // Permet d'afficher le livre sélectionné 

exports.getBestRating = (req, res, next) => {
    // Pour filtrer, on utilise sort()
    Book.find()
        .sort({ averageRating: -1 }) // Trie par ordre décroissant en fonction du champs de la moyenne des notes
        .limit(3) // Limite aux 3 premiers
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
} // Permet d'afficher les 3 livres ayant la note (moyenne de note) la plus élevée


// POST
exports.postBook = (req, res, next) => {
    const booksObject = JSON.parse(req.body.book); // comme multer change le format de la requete, il faut la parser 
    delete booksObject._id; // ici, on retire l'id renvoyé par le front car il ne correspondra pas avec l'id généré automatiquement par mongoDB
    delete booksObject._userId; // Pareil pour _userId pour qu'il soit lié au token et nom a celui retourné par l'utilisateur directement
    const book = new Book({
        ...booksObject,
        userId: req.auth.userId, // le userId du token d'authentification
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.buffer}`
    });

    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
} // Permet d'ajouter un livre avec son image

exports.postRating = (req, res, next) => {
    const bookId = req.params.id; // on récupère l'id du livre
    const userId = req.auth.userId; // On récupère l'ID de l'utilisateur (via l'auth) pour vérifier s'il a déjà noté le livre
    const rating = req.body.rating; // Récupérer la note donné dans le body par l'utilisateur

    // Vérifier si l'utilisateur a déjà noté le livre
    Book.findOne({ _id: bookId})
        // On ajoute la note mais on vérifie que l'utilisateur ne l'a pas déjà noté
        .then(book => {
            //! Changement, nouvelle consigne du mentor : Si l'utilisateur a déjà noté le livre, lui laisser la possibilité de modifier sa note. En front, j'ai ajouté un bouton "modifier ma note"
            const ratingObject = book.ratings.find(rating => rating.userId.toString() === userId); // On cherche si l'utilisateur à déjà noté le livre

            if (ratingObject) { // Si l'utilisateur et sa note a été trouvé, on l'update
                ratingObject.grade = rating;
                return book.save();
            } else { // Sinon on ajoute simplement la note
                book.ratings.push({ userId: userId, grade: rating });
                return book.save();
            }
            
            // Ancien code avant la demande de mon mentor
            /* if(book.ratings.userId == userId){ 
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
            } else{
                return Book.findByIdAndUpdate( // Ajoute la note
                    bookId,
                    { $push: { 
                            ratings: { 
                                userId: userId, 
                                grade: rating 
                            } 
                        }},
                    { new: true } // Book a jour
                );
            } */
        })
        // Puis, on calcule la moyenne
        .then(updatedBookwithRating => { // Mise à jour de la note moyenne du livre
            // On calcule la somme totale des notes avec reduce() :
            const totalRatings = updatedBookwithRating.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            // Puis calcul de la moyenne :
            const averageRating = totalRatings / updatedBookwithRating.ratings.length;
            // Update de la moyenne dans la base de données :
            return Book.findByIdAndUpdate(
                bookId, 
                { averageRating: averageRating }, 
                { new: true }
            );
        })
        .then(updatedBook => res.status(200).json(updatedBook))
        .catch(error => res.status(404).json({ error }));
} // Définit la note pour le user ID fourni + met à jour la moyenne de la note du livre.


// PUT
exports.modifyBook = (req, res, next) => {
    // On vérifie si la modification du livre se fait avec ou sans image (gestion différentes du fichier reçu : parse ou pas)
    const booksObject = req.file ?  
        { ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : 
        { ...req.body }; // on récupère l'object dans le corps de la requete

    delete booksObject._userId; // On supprime le userId de la requete pour éviter que quelqu'un crée un objet à son nom puis le modifie pour le réassigner à quelqu'un d'autre

    Book.findOne({_id: req.params.id}) // on va le cherche en vérifiant que c'est bien le créateur de l'ajout qui modifie le livre
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).send();
            } else {
                Book.updateOne(
                    { _id: req.params.id}, 
                    { ...booksObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
} // Met à jour le livre avec l'_id fourni + gestion de l'image (envoyé ou non)


// DELETE
exports.deleteOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id}) // on s'assure que celui qui supprime est celui qui a ajouté le livre
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(403).send({ message: "Vous n'êtes pas autorisé à supprimer" });
        } else {
            const filename = book.imageUrl.split('/images/')[1]; // On récupère le nom de fichier dans le répertoire 'images' pour s'assurer de supprimer le bon fichier

            fs.unlink(`images/${filename}`, () => { // la méthode 'unlink()' de fs nous permet de supprimer le fichier
                Book.deleteOne({_id: req.params.id}) // (callback) Quand le fichier est supprimé, on supprime le reste de l'objet
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
} // Supprime le livre selectionné avec l’image associée.
