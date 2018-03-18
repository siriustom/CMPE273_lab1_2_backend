var express = require('express');
var router = express.Router();
var account = require('../api/account');
var projects = require('../api/projects');

router.post('/login', account.auth);

router.post('/register', account.addUser);

router.post('/profileEdit', account.updateUser);

router.post('/postproject', projects.postproject);

module.exports = router;