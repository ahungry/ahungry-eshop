# ahungry-eshop

The nintendo eshop UI is...not the best.

There are some existing phone apps to find "best deals", but again,
I'm not a huge fan of the UI, so this is an attempt to implement a
more friendly/usable thing for myself (at the least, using sqlite as a
query engine to grab out useful results).

Maybe I'll extend it to a UI with updated thumbnails...

## Usage

First off, install deps, then run the imports:

```sh
npm install
node ./eshop-to-json.js # Grab the results from the API
node ./index.js # Import the newly created data.json to sqlite3

sqlite3 games.db # Start querying!
```

Useful query stuff:

See a random sample:

```sh
.mode line
select * from games limit 3;
```

Get the most recently updated games in a pretty box:
```sh
select title, msrp, salePrice, availability, datetime(substr(lastModified, 0, 11), 'unixepoch', 'localtime') from games WHERE lastModified ORDER BY lastModified DESC LIMIT 30;
```

Get the best deals on games:
```sh
select title, msrp, salePrice, 1 - (cast(salePrice as float)/cast(msrp as float)) AS percent_off, 'https://nintendo.com' || url FROM games WHERE salePrice > 0 ORDER BY 1-(cast(salePrice as float) / cast(msrp as float)) desc LIMIT 30;
```
