# whalecoiner

Express server-side app, using Markdown for data storage.  

![Node.js CI](https://github.com/whalecoiner/indieweb-express-site/workflows/Node.js%20CI/badge.svg) ![CodeQL](https://github.com/whalecoiner/indieweb-express-site/workflows/CodeQL/badge.svg)

## Installation

```
npm i
```

## Run tests

Tests are done via [Jest](https://www.npmjs.com/package/jest).

```
npm test
```

## Running app

```
npm run start:dev
```

This is an alias in `package.json` for:

```
npx nodemon app.js
```

## Debugging app

The app can be debugged using [debug](https://www.npmjs.com/package/debug).

```
DEBUG=indieweb-express-site:controller:*,indieweb-express-site:error npx nodemon app.js
```
