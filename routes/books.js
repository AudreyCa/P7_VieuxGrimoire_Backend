const express = require('express');
const router = express.Router();
const booksControllers = require('../controllers/books');


router.get('/', booksControllers.getAllBooks);
router.get('/:id', booksControllers.getOneBook);
router.get('/bestrating', booksControllers.getBestRating);

router.post('/', booksControllers.postBook); 
router.post('/:id/rating', booksControllers.postRating); 

router.put('/:id', booksControllers.modifyBook); 

router.delete('/:id', booksControllers.deleteOneBook); 


module.exports = router;