const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth');


router.post('/signup', authControllers.createUser);
router.post('/login', authControllers.authentificateUser);


module.exports = router;