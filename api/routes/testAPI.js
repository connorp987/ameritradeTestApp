var express = require("express");
var router = express.Router();
var https = require('https')
const fetch = require("node-fetch");
var qs = require('qs')
const fs = require('fs');
var keys = require('../keys.json')

router.get("/accessToken", function (req, res) {
  let data = {
    grant_type: 'refresh_token',
    refresh_token: keys.refresh_token,
    client_id: ''
  }
  try {
    fetch('https://api.tdameritrade.com/v1/oauth2/token', {
      method: "post",
      headers: {
        //'Content-Type': 'application/json'
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: qs.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        keys.access_token = json.access_token
        res.send(json.access_token)
        let tempD = JSON.stringify(keys)
        fs.writeFileSync('keys.json', tempD)
      })
  } catch (e) {
    console.error(e)
  }
})
  .get("/accountPositions", function (req, res) {
    try {
      fetch('https://api.tdameritrade.com/v1/accounts?fields=positions', {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + keys.access_token
        },
      })
        .then(res => res.json())
        .then(json => res.send(json))
    } catch (e) {
      console.error(e)
    }

  })

module.exports = router;