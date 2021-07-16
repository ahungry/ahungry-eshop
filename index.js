const { getGamesAmerica, getGamesEurope, getGamesJapan, getQueriedGamesAmerica } = require('nintendo-switch-eshop');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blub.db');

// {
//       lastModified: 1624347128869,
// 	      title: 'Aery - Little Bird Adventure',
// 	      description: 'Aery is a peaceful exploration game from the perspective of a little bird who decided to discover the world. Calm down from the hassle of your daily life, experience the feeling of flying and immerse into beautiful and atmospheric landscapes. It is a great game for relaxing and calming down after an exhausting day full of hassle.',
// 	      url: '/games/detail/aery-little-bird-adventure-switch/',
// 	      nsuid: '70010000031091',
// 	      slug: 'aery-little-bird-adventure-switch',
// 	      boxart: 'https://assets.nintendo.com/image/upload/ncom/en_US/games/switch/a/aery-little-bird-adventure-switch/boxart',
// 	      horizontalHeaderImage: 'https://assets.nintendo.com/image/upload/ncom/en_US/games/switch/a/aery-little-bird-adventure-switch/hero',
// 	      platform: 'Nintendo Switch',
// 	      releaseDateDisplay: '2020-06-18T07:00:00.000Z',
// 	      esrbRating: 'Everyone',
// 	      numOfPlayers: '1 player',
// 	      featured: false,
// 	      freeToStart: false,
// 	      esrbDescriptors: [],
// 	      franchises: [],
// 	      genres: [ 'Adventure', 'Simulation', 'Racing', 'Puzzle' ],
// 	      publishers: [ 'EpiXR' ],
// 	      developers: [ 'EpiXR Games' ],
// 	      generalFilters: [ 'Nintendo Switch Online compatible' ],
// 	      howToShop: [ 'On Nintendo.com' ],
// 	      playerFilters: [ '1+' ],
// 	      priceRange: '$5 - $9.99',
// 	      msrp: 6.99,
// 	      salePrice: null,
// 	      lowestPrice: 6.99,
// 	      availability: [ 'Available now' ],
// 	      objectID: '60d762ec-2c16-4548-930d-f6962d6a3e62',
// 	      _highlightResult: { title: [Object], nsuid: [Object] }
//     },

void async function main () {
  const res = await getGamesAmerica()

  db.serialize(function () {
    db.run("CREATE TABLE lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
      console.log(row.id + ": " + row.info);
    });
  });

  db.close();

  console.log(res)
}()
