const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const {requireAuth,checkUser} = require('../middlewares/authMiddleware');


router.get('/',checkUser,controller.homepage);
router.get('/login',controller.login);
router.put('/login_post',controller.login_post);
router.get('/signup',controller.signup);
router.post('/signup_post',controller.signup_post);
router.get('/profile',requireAuth, controller.profile);
router.get('/logout',controller.logout);


module.exports = router;
