const express = require('express')
const pug = require('pug')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./games.db')

const log = console.error
const app = express()

app.use(express.static('public'))

app.get('/games', function (req, res) {
  log('Request to /games')
  const limit = Number(req.query.limit || 10)
  const offset = Number(req.query.offset || 0)
  const records = []

  db.all('select count(*) as count from games', (e, countRecords) => {
    db.each("SELECT * FROM games ORDER BY cast(msrp as float) DESC LIMIT ? OFFSET ?",
            [limit, offset],
            function (err, row) {
              records.push(row)
            }, (e, r) => {
              let gamesHtml = records.reduce((acc, cur) => {
                var html = pug.renderFile('game.pug', cur)

                return acc + html
              }, '')

              var html = pug.renderFile('games.pug', {
                x: JSON.stringify(countRecords),
                total: countRecords[0].count / limit,
                y: gamesHtml,
                gamesHtml,
                offsetPrev: offset - limit,
                offsetNext: offset + limit,
                page: offset / limit,
              })

              res.send(html)
            })
  })
})

app.get('/game', function (req, res) {
  log('Request to /game')
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
  log('Request to /')
  // var game = pug.renderFile('game.pug')
  var html = pug.renderFile(
    'home.pug',
    {
      foo: '<b>woot</b>',
      youAreUsingPug: true,
    });
  res.send(html)
})

log('Listening on 3000')
app.listen(3000)
