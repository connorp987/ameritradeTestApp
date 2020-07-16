var express = require('express');
var router = express.Router();
var app = express();
var url = require('url');

const https = require('https');
const fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
})

router.get('/testt', function (req, res) {
  console.log('this worked!')
})


module.exports = router;
