# sonniesedge node site

Based on Express, and using Markdown for data storage.  Powers [charlie.sonniesedge.net](https://charlie.sonniesedge.net).

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
npx nodemon app.js
```

## Debugging app

The app can be debugged using [debug](https://www.npmjs.com/package/debug).

```
DEBUG=sonniesedge:controller:*,sonniesedge:error npx nodemon app.js
```
