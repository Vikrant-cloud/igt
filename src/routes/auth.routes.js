const express = require('express');
const { loginUser, createUser, logoutUser, forgotPassword, resetPassword } = require('../controller/auth.controller');
const { verifyUser } = require('../middleware/verifyUser');
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', createUser);
router.post('/logout', verifyUser, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;