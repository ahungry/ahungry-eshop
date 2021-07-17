/**
 * Run the eshop-to-json.js first, to ensure data.json exists.
 */
const fs = require('fs')

try { fs.unlinkSync('games.db') } catch (_) {}

const p = require('process')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./games.db')

// in nodejs log/info/debug are STDOUT, while error/warn are STDERR
// Diagnostics are supposed to go to STDERR, *not* STDOUT.
const log = console.error

void async function main () {
  log('Importing games, this may take awhile...')
  // Map across and normalize the records, they aren't consistent otherwise
  const res = require('./data.json').map(record => {
    const {
      lastModified, title, description, url, boxard, horizontalHeaderImage, platform,
      releaseDateDisplay, esrbRating, numOfPlayers, genres, publishers, developers,
      generalFilters, playerFilters, priceRange, msrp, salePrice, lowestPrice, availability,
          } = record

    return {
      lastModified, title, description, url, boxard, horizontalHeaderImage, platform,
      releaseDateDisplay, esrbRating, numOfPlayers, genres, publishers, developers,
      generalFilters, playerFilters, priceRange, msrp, salePrice, lowestPrice, availability,
    }
  })
  const fields = Object.keys(res[0])

  db.serialize(function () {
    const fieldSql = fields.join(' TEXT, ') + ' TEXT'

    db.run(`CREATE TABLE games (${fieldSql})`)

    // https://stackoverflow.com/questions/1711631/improve-insert-per-second-performance-of-sqlite
    // Wrapping many inserts in a single transaction changes
    // insert time from 10+ minutes for 5000 records, to less than 10 seconds.
    db.run('PRAGMA synchronous = OFF')
    db.run('PRAGMA journal_mode = MEMORY')
    db.run('BEGIN TRANSACTION')

    const stmtSql = fields.map(_ => '?').join(',')

    var stmt = db.prepare(`INSERT INTO games VALUES (${stmtSql})`)
    let i = 0
    let errs = ['No errors to report so far...']

    res.forEach(rec => {
      stmt.run(Object.values(rec), (err, query_res) => {
        if (err) {
          errs.push(err)
        }

        log('\033[2J')
        log('Importing games, this may take awhile...\r\n')
        log(errs[errs.length - 1])
        log('On record: ' + i++ + '/ ' + res.length)
      })
    })

    stmt.finalize()
    db.run('END TRANSACTION')

  })

  db.close()

  console.log(res)
}()
