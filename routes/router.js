var express = require('express');
var router = express.Router();
var account = require('../api/account');

router.post('/login', account.auth);

router.post('/register', account.addUser);

router.post('/profileEdit', function (req, res) {
    
});

module.exports = router;