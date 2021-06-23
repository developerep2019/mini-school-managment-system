//Models
const contactModel = require('../models/contact.model');
const teacherModel = require('../models/teacher.model');
const noticeModel = require('../models/notice.model');

const db = require('../util/db.util');

const checkFlash = require('../util/flash.util');

// All School Controllers ==> GET
const getIndex = (req, res, next) => {
    teacherModel.findAll({ limit: 4, order: [['id', 'DESC']] })
        .then(teachers => {
            res.render('school/index', {
                title: ' তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
                path: '/',
                admin: req.user ? 1 : 0,
                teachers
            });
        })
};

const getContact = (req, res, next) => {
    const flash = checkFlash(req.flash('notify'));
    res.render('school/contact', {
        title: 'যোগাযোগ :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
        path: '/contact',
        flash

    });
};

const getAbout = (req, res, next) => {
    teacherModel.findAll({ limit: 8, order: [['id', 'DESC']] })
        .then(teachers => {
            res.render('school/about', {
                title: 'আমাদের সম্পর্কে :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
                path: '/about',
                teachers
            });
        })
};

const getTeachers = (req, res, next) => {
    teacherModel.findAll()
        .then(teachers => {
            res.render('school/teachers', {
                title: 'শিক্ষকমণ্ডলী :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
                path: '/teachers',
                teachers
            });
        })
        .catch(err => {
            console.log(err)
        })
};

const getNotices = async (req, res, next) => {
    const { page } = req.query;
    const columnNumber = await noticeModel.count();
    const size = 20;
    const pageNum = Math.floor(columnNumber / size);
    const nextNotices = (await noticeModel.findAll({ limit: 20, offset: ((page ? page : 0) * size) + 20, orders: [['id', 'DESC']], raw: true })).length;
    noticeModel.findAll({ limit: 20, offset: (page ? page : 0) * size, order: [['id', 'DESC']] })
        .then(notices => {
            res.render('school/notices', {
                title: 'নোটিশ :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
                path: '/notices',
                notices: notices.length > 0 ? notices : 0,
                pageNum: pageNum <= 4 ? pageNum : 2,
                nextNotices
            })

        })
        .catch(err => {
            console.log(err);
        });
};

// All Controllers ==> POST
const postContact = (req, res, next) => {
    const { name, email, subject, phone, message } = req.body;
    db.models.contact.create({
        name,
        email,
        subject,
        phone,
        message
    })
        .then(result => {
            req.flash('notify', { message: 'ধন্যবাদ আমাদের সাথে যোগাযোগ করার জন্য। আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করবো', type: 'success' });
            res.redirect('/contact');
        })
        .catch(err => {
            req.flash('notify', { message: 'দুঃখিত, ওয়েবসাইট এ কিছু সমস্যা হওয়ার জন্য এখন আপনার যোগাযোগ তথ্য নেওয়া সম্ভব হচ্ছে না। দয়া করে কিছুক্ষন পর আবার চেষ্টা করুন', type: 'error' });
            res.redirect('/contact');
        })
}

exports.getIndex = getIndex;
exports.getContact = getContact;
exports.getAbout = getAbout;
exports.getTeachers = getTeachers;
exports.getNotices = getNotices;

exports.postContact = postContact;