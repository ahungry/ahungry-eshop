/**
 * Fetch games from eshop and write to a JSON file
 */
const { getGamesAmerica,
        getGamesEurope,
        getGamesJapan,
        getQueriedGamesAmerica } = require('nintendo-switch-eshop')
const fs = require('fs')

void async function main () {
  console.error('Fetching files')
  const res = await getGamesAmerica()
  console.error('Done fetching files')

  fs.writeFileSync('data.json', JSON.stringify(res, null, 2))
}()
