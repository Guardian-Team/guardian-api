const { Router } = require('express');
const { authenticated } = require('./middleware/auth');
const { register, login } = require('./controller/auth');
const { getUserById, updateUser } = require('./controller/user');

const router = Router();

// Auth
router.post('/register', register);
router.post('/login', login);

// User
router.get('/user/:id', authenticated, getUserById);
router.put('/user/:id', authenticated, updateUser);

module.exports = router;
