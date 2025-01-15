const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const researchController = require('../controllers/researchController');
const { requireAuth,checkUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
router.get('/',checkUser,researchController.get_home);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
// router.post('/forgot-password', authController.forgot_password);
// router.get('/reset-password/:token', authController.reset_password_get);
// router.post('/reset-password/:token', authController.reset_password_post);



router.get('/post', requireAuth, researchController.post_get);
router.post('/post', requireAuth, upload.single('pdf'), researchController.post_paper);
router.get('/view/:id', researchController.view_paper);
router.post('/appreciate',requireAuth, researchController.toggleAppreciation);
// router.get('/download/:id', researchController.download_paper);

module.exports = router;