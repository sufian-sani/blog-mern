const express = require('express');
const authController = require('../controllers/authController');
const {authenticateUser} = require("../middlewares/authenticate.middleware");
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch('/updatepassword', authenticateUser, authController.updatePassword);
router.get('/author/:id', authController.getUserById)
router.get('/profile', authController.authProfile)
router.put('/update-profile',authenticateUser, authController.updateProfile)
// router.patch('/updatepassword', (req, res) => {
//     console.log('test')
// });

module.exports = router;