const express = require('express')
const pug = require('pug')

const app = express()

app.get('/', function (req, res) {
  var html = pug.renderFile('home.pug', {});
  res.send(html)
})

console.log('Listening on 3000')
app.listen(3000)
