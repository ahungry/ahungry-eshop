const express = require('express')
const pug = require('pug')

const app = express()

app.get('/', function (req, res) {
  // var game = pug.renderFile('game.pug')
  var html = pug.renderFile(
    'home.pug',
    {
      foo: '<b>woot</b>',
      youAreUsingPug: true,
    });
  res.send(html)
})

console.log('Listening on 3000')
app.listen(3000)
