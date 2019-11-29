var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
var passport = require('passport');
var auth = require('../authenticate');

router.get('/private', auth.authenticate, (req, res) => {
  res.send('Secret data');
});

router.get('/logout', auth.authenticate, (req, res) => {
  req.logout();
  return res.status(200).json({status: 'user logged out successfully'});
});

router.get('/private/userdata', auth.authenticate, (req, res, next) => {
  return res.status(200).json(req.user);
});






router.get('/:id', async(req, res) => {
  try {
    var foundUser = await User.findById(req.params.id);
    if(!foundUser) {
      res.status(400).send('User not found in DB');
    }
    res.status(200).json(foundUser); 
  } catch(err) {
    res.status(400).json(err);
  }
 
})

router.post('/register', async(req, res) => {
  var salt = await bcrypt.genSalt(10);
  var hash = await bcrypt.hash(req.body.password, salt);
  
  var user = new User({
      _id: req.body._id,
      name: req.body.name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hash,
      admin: req.body.admin,
      city: req.body.city,
      street: req.body.street
  });
  
  try {
    var createdUser = await user.save();
    res.status(200).json(createdUser);
  } catch(err) {
      res.status(400).send(err)
  }
});

router.post('/login', async(req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) return next(err);
    if(!user) return next(info);
    req.logIn(user, function(err) {
      if(err) return next(err);
      return res.status(200).send(req.user);
    });
  })(req, res, next);
});















module.exports = router;