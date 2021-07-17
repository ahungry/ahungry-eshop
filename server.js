const express = require('express')
const pug = require('pug')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./games.db')

const app = express()

app.get('/games', function (req, res) {
  const records = []

  db.each("SELECT * FROM games ORDER BY msrp DESC LIMIT 5", function (err, row) {
    records.push(row)
  }, (e, r) => {
    console.warn('The rows are done')
    console.warn('records: ', { records })

    let gamesHtml = records.reduce((acc, cur) => {
      var html = pug.renderFile('game.pug', cur)
      console.warn('record/html: ', { cur, html })

      return acc + html
    }, '')

    console.warn('Game html: ', gamesHtml)

    var html = pug.renderFile('games.pug', { x: 1, y: gamesHtml, gamesHtml })

    res.send(html)
  })
})

app.get('/game', function (req, res) {
  const records = []

  db.each("SELECT * FROM games LIMIT 1", function (err, row) {
    records.push(row)
  }, (e, r) => {
    var html = pug.renderFile(
      'game.pug',
      {
        ...records[0],
        foo: JSON.stringify(records),
      })

    res.send(html)
  })
})

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
