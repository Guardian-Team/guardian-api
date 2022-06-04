const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { authenticated } = require('../middleware/auth');
const { register, login } = require('../controller/auth');
const { getUserById, updateUser } = require('../controller/user');
const {
  getContactsByUserId,
  addContact,
  updateContact,
  deleteContact,
} = require('../controller/contact');

const router = Router();

// Auth
router.post('/register', register);
router.post('/login', login);

// User
router.get('/user/:id', authenticated, getUserById);
router.put('/user/:id', authenticated, fileUpload(), updateUser);

// Contact
router.get('/contact/:userId', authenticated, getContactsByUserId);
router.post('/contact/:userId', authenticated, addContact);
router.put('/contact/:userId/:contactId', authenticated, updateContact);
router.delete('/contact/:userId/:contactId', authenticated, deleteContact);

module.exports = router;
