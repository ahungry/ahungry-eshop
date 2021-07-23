const express = require('express')
const pug = require('pug')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./games.db')

const dao = require('./dao')
const log = console.error
const app = express()

app.use(express.static('public'))

function withFilters (daoFn) {
  return async function (req, res) {
    log('Request to /games')
    const limit = Number(req.query.limit || 10)
    const offset = Number(req.query.offset || 0)
    const search_title = req.query.search_title || ''
    const search_publisher = req.query.search_publisher || ''

    const count = await dao.get_count()
    const records = await daoFn({ limit, offset, search_publisher, search_title })

    let gamesHtml = records.reduce((acc, cur) => {
      var html = pug.renderFile('game.pug', cur)

      return acc + html
    }, '')

    var html = pug.renderFile('games.pug', {
      total: count / limit,
      y: gamesHtml,
      gamesHtml,
      offsetPrev: offset - limit,
      offsetNext: offset + limit,
      page: offset / limit,
      search_publisher,
      search_title,
    })

    res.send(html)
  }
}

app.get('/sales', async function (req, res) {
  await withFilters(dao.get_games_on_sale)(req, res)
})

app.get('/', async function (req, res) {
  await withFilters(dao.get_games)(req, res)
})

log('Listening on 3000')
app.listen(3000)
