const Book = require('../models/Book');


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
    //retourne un tableau de trois livres
} // Permet d'afficher les 3 livres ayant la note (moyenne de note) la plus élevée

// POST
exports.postBook = (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Corps de la requete : { book: string, image: file }
    // Type de réponse attendue : { message: String } Verb
} // Capture et enregistre l'image, analyse le livre transformé en chaîne de caractères, et l'enregistre dans la base de données en définissant correctement son ImageUrl.Initialise la note moyenne du livre à 0 et le rating avec un tableau vide. Remarquez que le corps de la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne pour le corps de la demande en fonction des données soumises avec le fichier.
exports.postRating = (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Corps de la requete : { userId: String, rating: Number }
    // Type de réponse attendue :  Single book
} // Définit la note pour le user ID fourni. La note doit être comprise entre 0 et 5. L'ID de l'utilisateur et la note doivent être ajoutés au tableau "rating" afin de ne pas laisser un utilisateur noter deux fois le même livre. Il n’est pas possible de modifier une note. La note moyenne "averageRating" doit être tenue à jour, et le livre renvoyé en réponse de la requête.


// PUT
exports.modifyBook = (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Corps de la requete : EITHER Book as JSON OR { book: string, image: file }
    // Type de réponse attendue : { message: string }
} // Met à jour le livre avec l'_id fourni. Si une image est téléchargée, elle est capturée, et l’ImageUrl du livre est mise à jour. Si aucun fichier n'est fourni, les informations sur le livre se trouvent directement dans le corps de la requête (req.body.title, req.body.author, etc.). Si un fichier est fourni, le livre transformé en chaîne de caractères se trouve dans req.body.book. Notez que le corps de la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier

// DELETE
exports.deleteOneBook = (req, res, next) => {
    console.log(req.body);
    // Authentification requise
    // Type de réponse attendue : { message: string }
} // Supprime le livre selectionné avec l’image associée.
