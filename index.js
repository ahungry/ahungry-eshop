/**
 * Run the eshop-to-json.js first, to ensure data.json exists.
 */
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./games.db')
const fs = require('fs')
const p = require('process')

// in nodejs log/info/debug are STDOUT, while error/warn are STDERR
// Diagnostics are supposed to go to STDERR, *not* STDOUT.
const log = console.error

void async function main () {
  log('Importing games, this may take awhile...')
  // fs.deleteSync('games.db')
  const res = require('./data.json')
  const fields = Object.keys(res[0])

  db.serialize(function () {
    const fieldSql = fields.join(' TEXT, ') + ' TEXT'

    db.run(`CREATE TABLE games (${fieldSql})`)

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

  })

  db.close()

  console.log(res)
}()
