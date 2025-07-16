const express = require('express');
const { getUserProfile, usersList, editUser, deleteUser } = require('../controller/user.controller.js');
const { verifyUser } = require('../middleware/verifyUser.js');
const router = express.Router();

router.get('/profile', verifyUser, getUserProfile);
router.get('/', verifyUser, usersList);
router.post('/edit/:id', verifyUser, editUser);
router.post('/delete/:id', verifyUser, deleteUser)

module.exports = router;