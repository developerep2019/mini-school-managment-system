//controllers
const adminController = require('../controllers/admin.controller');
// Middlewares
const authMiddleware = require('../middlewares/auth.middleware');

const router = require('express').Router();

// All Routes ==> GET
router.get('/', authMiddleware.checkLoggedIn, adminController.getAdminHome);
router.get('/contacts', authMiddleware.checkLoggedIn, adminController.getContacts);
router.get('/dashboard', authMiddleware.checkLoggedIn, adminController.getDashboard);
router.get('/log-out', adminController.logOut);
router.get('/notice-list', authMiddleware.checkLoggedIn, adminController.getNoticeList);
router.get('/teachers-list', authMiddleware.checkLoggedIn, adminController.getTeacherList);

// All Routes ==> POST
router.post('/login', adminController.postLogin);
router.post('/delete-contact', authMiddleware.checkLoggedIn, adminController.postDeleteContact);
router.post('/add-notice', authMiddleware.checkLoggedIn, adminController.postAddNotice);
router.post('/delete-notice', authMiddleware.checkLoggedIn, adminController.postDeleteNotice);
router.post('/edit-notice', authMiddleware.checkLoggedIn, adminController.postEditNotice);
router.post('/add-teacher', authMiddleware.checkLoggedIn, adminController.postAddTeacher);
router.post('/delete-teacher', authMiddleware.checkLoggedIn, adminController.postDeleteTeacher);
router.post('/edit-teacher', authMiddleware.checkLoggedIn, adminController.postEditTeacher);

module.exports = router;