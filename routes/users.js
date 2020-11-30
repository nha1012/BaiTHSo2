const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res) => {
  const userLogin = req.body
  User.findOne({
    email: userLogin.email
  }).then(user => {
    if (!user) {
      req.flash('error_msg', 'Email này chưa được tạo!');
      return res.redirect('/users/login')
      return res.status(201).send({ message: 'Email này chưa được tạo!' })
    }
    // kiem tra mat khau
    bcrypt.compare(userLogin.password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        req.user = user
        return res.render('dashboard', { user: user, message: 'Đăng nhập thành công.' })
        return res.status(200).json({ user: user, message: 'Đăng nhập thành công.' })
      } else {
        req.flash('error_msg', 'Mật khẩu hoặc email không chính xác!');
        return res.redirect('/users/login')
        return res.status(201).send({ message: 'Mật khẩu hoặc email không chính xác!' })
      }
    });
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
