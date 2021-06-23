// Controllers
const schoolController = require('../controllers/school.controller');
const adminController = require('../controllers/admin.controller');

// Middleware
const authMiddleware = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.get('/', schoolController.getIndex);
router.get('/contact', schoolController.getContact);
router.get('/about', schoolController.getAbout);
router.get('/teachers', schoolController.getTeachers);
router.get('/notices', schoolController.getNotices);
router.get('/login', authMiddleware.checkLoggedIn, adminController.getLogin);


// All Routes ==> POST
router.post('/contact-us', schoolController.postContact);
router.post('/login', adminController.postLogin);


module.exports = router;