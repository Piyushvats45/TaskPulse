const express = require('express');
const { userRegister, userLogin, userLogout } = require('../controllers/authController');

const router = express.Router()

/* POST /api/auth/register */
router.post("/register",userRegister)

/* POST /api/auth/register */
router.post('/login', userLogin)

/* POST /api/auth/logout */
router.post("/logout", userLogout)

module.exports = router