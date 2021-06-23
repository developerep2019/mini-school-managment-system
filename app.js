const express = require('express');
const app = express();
const db = require('./util/db.util');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', './views')

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cookieParser());
app.use(session({
    secret: 'iDonTKnoW',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('./images/teachers'));
app.use('/notice', express.static('notice'));

//Routes and Initialization
const schoolRoutes = require('./routes/school.route');
const adminRoutes = require('./routes/admin.route');


app.use(schoolRoutes);
app.use('/admin', adminRoutes);
app.use('*', (req, res, next) => {
    res.status(404).render('school/404', {
        title: "Page Not Found",
        path: '',
        admin: false
    });
})



const port = process.env.PORT || 3000;
db.sync()
app.listen(port, () => console.log(`listening on port ${port}`));