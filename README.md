# Indieweb Express Site

Express server-side app, using Markdown for data storage.


![Node.js CI](https://github.com/whalecoiner/indieweb-express-site/workflows/Node.js%20CI/badge.svg) ![CodeQL](https://github.com/whalecoiner/indieweb-express-site/workflows/CodeQL/badge.svg)

## Installation

### Installing and running via Docker

The app is fully Dockerised. To run it this way you will need the Docker service installed on your local machine.

You will need to add the following to your `/etc/hosts` file:

```bash
localhost indieweb.localhost
```

Once done you can start the app:

```bash
docker compose up --detached
```
### Installing directly onto host

You will need node v14.16 installed.

```bash
cd src/
npm install
```

## Run tests

Tests are performed via [Jest](https://www.npmjs.com/package/jest).

```bash
npm test
```

## Running app

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Debugging app

The app can display useful information via [debug](https://www.npmjs.com/package/debug).

Full debugging:

```bash
DEBUG=indieweb-express-site:* npm run dev
```

or limited to only some areas:

```bash
DEBUG=indieweb-express-site:controller:*,indieweb-express-site:error npm run dev
```
