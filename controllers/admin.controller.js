//Models 
const contactModel = require('../models/contact.model');
const userModel = require('../models/user.model');
const noticeModel = require('../models/notice.model');
const teacherModel = require('../models/teacher.model');

//utilities
const checkFlash = require('../util/flash.util');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { ObjectID, ObjectId } = require('bson');

//Enviroment Variables (Only of development purpose. Not in production)
require('dotenv').config();




// All Controllers => GET

const getAdminHome = (req, res, next) => {
    if (req.user) {
        res.redirect('/admin/dashboard');
    }
    else if (!req.user) {
        res.redirect('/login');
    }
};

const getLogin = (req, res, next) => {
    const flash = checkFlash(req.flash('error'));
    if (!req.user) {
        res.render('admin/login', {
            flash
        })
    }
    else if (req.user) {
        res.redirect('/admin/dashboard');
    }
};

const getContacts = async (req, res, next) => {
    if (req.user) {
        const { page } = req.query;
        const columnNumber = await contactModel.count();
        const size = 20;
        const pageNum = Math.floor(columnNumber / size);
        contactModel.findAll({ limit: 20, offset: (page ? page : 0) * size, order: [['id', 'DESC']], raw: true })
            .then(contacts => {
                const flash = checkFlash(req.flash('notify'));
                res.render('admin/contacts', {
                    title: 'যোগাযোগসমূহ :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
                    path: '/admin/contacts',
                    admin: true,
                    contacts,
                    pageNum,
                    flash
                })
            })
            .catch(err => {
                console.log(err);
            })
        console.log(path.resolve('./'));
    }
    if (!req.user) {
        res.redirect('/login');
    }
};

const getDashboard = (req, res, next) => {
    if (req.user) {
        res.render('admin/dashboard', {
            path: '/admin/dashboard',
            title: 'ড্যাশবোর্ড :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
            admin: true,
            user: req.user
        })
    }
    else if (!req.user) {
        res.redirect('/login');
    }
}

const getNoticeList = async (req, res, next) => {
    if (req.user) {
        const { page } = req.query;
        const columnNumber = await noticeModel.count();
        const size = 20;
        const pageNum = Math.floor(columnNumber / size);
        noticeModel.findAll({ limit: 20, offset: (page ? page : 0) * size, order: [['id', 'DESC']], raw: true })
            .then(notices => {
                const flash = checkFlash(req.flash('notice'));
                res.render('admin/notice-list', {
                    path: '/admin/notice-list',
                    title: 'নোটিশলিস্ট :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
                    notices,
                    pageNum,
                    flash
                })

            })
            .catch(err => {
                console.log(err);
            });
    }
    else if (!req.user) {
        res.redirect('/login');
    }
};

const getTeacherList = (req, res, next) => {
    if (req.user) {
        const flash = checkFlash(req.flash('notify'));
        teacherModel.findAll({ raw: true })
            .then(teachers => {
                res.render('admin/teachers-list', {
                    path: '/admin/teachers-list',
                    title: 'শিক্ষকলিস্ট :: তেঁতুলিয়া সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
                    teachers,
                    flash
                });
            })
    }
    else if (!req.user) {
        res.redirect('/login');
    }
}


// All Routes ==> POST

const postLogin = (req, res, next) => {
    const { user, pass } = req.body;
    userModel.findOne({ where: { user } })
        .then(async user => {
            if (!user || !(await bcrypt.compare(pass, user.pass))) {
                req.flash('error', 'দুঃখীত!! আপনার ইউজারনেইম অথবা পাসওয়ার্ডটি ভুল হয়েছে');
                res.redirect('/login');
            }
            else {
                const { id } = user;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                const cookieOptions = {
                    expires: new Date(Date.now() + 3600000),
                    httpOnly: true
                }
                res.cookie('login', token, cookieOptions);
                res.redirect('/admin/dashboard');
            }
        });

};

const postDeleteContact = (req, res, next) => {
    if (req.user) {
        const id = req.body.id;
        contactModel.destroy({ where: { id } })
            .then(data => {
                req.flash('notify', { message: 'ধন্যবাদ ! যোগাযোগটি ডিলিট করা হয়েছে।', type: 'success' })
                res.redirect('/admin/contacts')
            })
            .catch(err => {
                console.log(err)
            })
    }
    else if (!req.user) {
        res.redirect('/login');
    }
};

const postAddNotice = (req, res, next) => {
    if (req.user) {
        if (req.files) {
            const pdf = req.files.pdf;
            const uniqueName = new ObjectID().toString() + '.pdf';
            const pdfPath = path.join(process.mainModule.path, 'notice', uniqueName);
            if (pdf.mimetype === 'application/pdf') {
                fs.writeFile(pdfPath, pdf.data, err => {
                    if (err) {
                        console.log(err)
                    }
                    else if (!err) {
                        noticeModel.create({
                            title: req.body.title,
                            file: uniqueName
                        })
                            .then(() => {
                                req.flash('notice', { message: 'ধন্যবাদ! নোটিশ অ্যাড করা হয়েছে।', type: 'success' });
                                res.redirect('/admin/notice-list');
                            })
                            .catch(err => {
                                if (err) {
                                    console.log(err, "an error happend from the database");
                                }
                            })
                    }
                })
            }
            else {
                req.flash('notice', { message: 'দুক্ষিত ! আপনি যেই ফাইল টি আপলোড করছেন সেই ফাইল টি ভ্যালিড নয়। দয়া করে একটি ভ্যালিড পিডিএফ ফাইল আপলোড করুন।', type: 'error' });
                res.redirect('/admin/notice-list');
            };
        }
        else if (req.files === null) {
            req.flash('notice', { message: 'নোটিশ এর সাথে একটি ফাইল সংযুক্ত করুন', type: 'error' });
            return res.redirect('/admin/notice-list')
        }
    }
    else if (!req.user) {
        res.redirect('/login');
    }
};

const postDeleteNotice = async (req, res, next) => {
    if (req.user) {
        const id = req.body.noticeId;
        const noticeFile = await noticeModel.findByPk(id);
        const deleteFilePath = path.join(process.mainModule.path, 'notice', noticeFile.file);

        fs.unlink(deleteFilePath, err => {
            if (err) {
                console.log(err, 'from delete notice');
            }
        });
        noticeModel.destroy({ where: { id } })
            .then(result => {
                req.flash('notice', { message: 'ধন্যবাদ! নোটিশ ডিলিট করা হয়েছে।', type: 'success' });
                return res.redirect('/admin/notice-list');
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                }
            });
    }
    else if (!req.user) {
        return res.redirect('/login')
    }
};

const postEditNotice = async (req, res, next) => {
    if (req.user) {
        const { id, title } = req.body;
        const file = req.files;
        try {
            const notice = await noticeModel.findByPk(id);
            notice.title = title;
            if (file) {
                if (file.pdf.mimetype === 'application/pdf') {
                    const filePath = path.join(process.mainModule.path, 'notice', notice.file);
                    fs.writeFile(filePath, file.pdf.data, err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
                else {
                    req.flash('notice', { message: 'দুক্ষিত ! আপনি যেই ফাইল টি আপলোড করছেন সেই ফাইল টি ভ্যালিড নয়। দয়া করে একটি ভ্যালিড পিডিএফ ফাইল আপলোড করুন।', type: 'error' });
                    return res.redirect('/admin/notice-list');
                }
            }
            await notice.save();
            req.flash('notice', { message: 'ধন্যবাদ, নোটিশটি আপডেট করা হয়েছে', type: 'success' })
            return res.redirect('/admin/notice-list');

        } catch (err) {
            console.log(err);
        }
    }
    else if (!req.user) {
        res.redirect('/login');
    }
};

const postAddTeacher = (req, res, next) => {
    if (req.user) {
        const files = req.files;
        if (!files) {
            req.flash('notify', { message: 'দুঃখিত, আপনি কোন ছবি আপলোড করেননি। দয়া করে একটি ছবি আপলোড করুন', type: 'error' });
            res.redirect('/admin/teachers-list');
        }
        else if (files) {
            let { image } = files;
            if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') {
                // 2097152 means 2MB
                if (image.size > 2097152) {
                    req.flash('notify', { message: 'দুঃখিত ! ছবির সাইজ ২ মেগাবাইট এর চেয়ে বেশি হওয়া যাবে না। দয়া করে ২ মেগাবাইট এর চেয়ে কম বা সমান সাইজ এর ছবি আপলোড করুন', type: 'error' });
                    return res.redirect('/admin/teachers-list');
                }
                else if (image.size <= 2097152) {
                    const { name, title } = req.body;
                    const imageName = `${new ObjectID().toString()}_${image.name}`;
                    const imagePath = path.join(process.mainModule.path, 'images', 'teachers', imageName);
                    teacherModel.create({
                        name,
                        title,
                        image: imageName
                    })
                        .then(result => {
                            req.flash('notify', { message: 'ধন্যবাদ! ওয়েবসাইট এ শিক্ষক অ্যাড করা হয়েছে', type: 'success' });
                            fs.writeFile(imagePath, image.data, err => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return res.redirect('/admin/teachers-list');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                };
            }
            else if (image.mimetype !== 'image/jpeg' || image.mimetype !== 'image/png') {
                req.flash('notify', { message: 'দুঃখিত! আপনার আপলোডকৃত ছবিটি সঠিক নয়। দয়া করে একটি ভ্যালিড ছবি আপলোড করুন', type: 'error' });
                res.redirect('/admin/teachers-list');
            }
        }
    }
    else if (!req.user) {
        res.redirect('/login')
    }
};

const postDeleteTeacher = async (req, res, next) => {
    if (req.user) {
        const { id } = req.body;
        const teacher = await teacherModel.findByPk(id);
        await teacherModel.destroy({ where: { id } })
            .then(() => {
                const filePath = path.join(process.mainModule.path, 'images', 'teachers', teacher.image);
                fs.unlink(filePath, err => { });
                req.flash('notify', { message: 'ধন্যবাদ ! শিক্ষক ডিলেট করা হয়েছে।', type: 'success' });
                return res.redirect('/admin/teachers-list');
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                }
            });
    }
    else if (!req.user) {
        return res.redirect('/login');
    }
};

const postEditTeacher = async (req, res, next) => {
    if (req.user) {
        try {
            const { id, name, title } = req.body;
            const file = req.files;
            const teacher = await teacherModel.findByPk(id);
            teacher.name = name;
            teacher.title = title;
            if (file) {
                //First, we have to delete the previous file
                const deletePath = path.join(path.resolve('./'), 'images', 'teachers', teacher.image);
                fs.exists(deletePath, check => {
                    if (check) {
                        fs.unlink(deletePath, err => { });
                    } else {
                        return;
                    }
                })
                if (file.image.mimetype === 'image/jpeg' || file.image.mimetype === 'image/png') {
                    const newImageName = `${new ObjectId().toString()}_${file.image.name}`;
                    const newImagePath = path.join(path.resolve('./'), 'images', 'teachers', newImageName);
                    console.log(newImageName);
                    fs.writeFile(newImagePath, file.image.data, err => {
                        console.log('File upload done');
                    });
                    teacher.image = newImageName;
                }
            }
            await teacher.save();
            req.flash('notify', { message: 'ধন্যবাদ! শিক্ষক এর তথ্য আপডেট করা হয়েছে।', type: 'success' });
            return res.redirect('/admin/teachers-list');
        } catch (err) {
            console.log(err);
        }
    }
    else if (!req.user) {
        return res.redirect('/login');
    }
};



const logOut = (req, res, next) => {
    res.cookie('login', 'logout', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
    })
    res.status(200).redirect('/');
};

// Controller exports ==> GET

exports.getLogin = getLogin;
exports.getContacts = getContacts;
exports.getDashboard = getDashboard;
exports.getNoticeList = getNoticeList;
exports.getAdminHome = getAdminHome;
exports.getTeacherList = getTeacherList;

//Controller exports ==> POST
exports.postLogin = postLogin;
exports.postDeleteContact = postDeleteContact;
exports.logOut = logOut;
exports.postAddNotice = postAddNotice;
exports.postDeleteNotice = postDeleteNotice;
exports.postEditNotice = postEditNotice;
exports.postAddTeacher = postAddTeacher;
exports.postDeleteTeacher = postDeleteTeacher;
exports.postEditTeacher = postEditTeacher;