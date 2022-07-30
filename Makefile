all: refresh-from-api games.db

node_modules:
	npm install

refresh-from-api: node_modules
	node ./eshop-to-json.js

games.db: node_modules
	node ./index.js

.PHONY: all refresh-from-api
