const { getGamesAmerica, getGamesEurope, getGamesJapan, getQueriedGamesAmerica } = require('nintendo-switch-eshop');

void async function main () {
  const res = await getGamesAmerica()

  console.log(res)
}()
