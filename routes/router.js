var express = require('express');
var router = express.Router();
var account = require('../api/account');
var projects = require('../api/projects');
var bids = require('../api/bids');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


router.post('/login', account.auth);

router.post('/register', account.addUser);

router.post('/profileEdit', account.updateUser);

router.post('/postproject', projects.postproject);

router.post('/projects', projects.getAllProjects);

router.post('/bid', bids.bidOnProject);

// router.post('/getbidlist', bids.getBidList);

module.exports = router;