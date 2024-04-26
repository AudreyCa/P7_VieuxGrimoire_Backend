const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sharpFunction = require('../middleware/sharpWithMulter');

const booksControllers = require('../controllers/books');


router.get('/', booksControllers.getAllBooks);
router.get('/bestrating', booksControllers.getBestRating);
router.get('/:id', booksControllers.getOneBook);

router.post('/', auth, sharpFunction, booksControllers.postBook); // auth + multer avec Sharp
router.post('/:id/rating', auth, booksControllers.postRating); // auth

router.put('/:id', auth, sharpFunction, booksControllers.modifyBook); // auth + multer avec Sharp

router.delete('/:id', auth, booksControllers.deleteOneBook); // auth


module.exports = router;