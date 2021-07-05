# Indieweb Express Site

Express server-side app, using Markdown for data storage.


![Node.js CI](https://github.com/whalecoiner/indieweb-express-site/workflows/Node.js%20CI/badge.svg) ![CodeQL](https://github.com/whalecoiner/indieweb-express-site/workflows/CodeQL/badge.svg)

## Installing a development environment via Docker

The app is fully Dockerised. To run it this way you will need the Docker service installed on your local machine.

You will need to add the following to your `/etc/hosts` file:

```bash
localhost whalecoiner.localhost
```

Once done you can start the app:

```bash
./start-development.sh
```

The app can then be found at `http://whalecoiner.localhost`

## Installing a development environment directly onto the host

You will need node v14.16 installed.

```bash
npm install
```

Run app via:

```bash
npm run dev
```

## Run tests

Tests are performed via [Jest](https://www.npmjs.com/package/jest).

```bash
npm test
```

## Running for production

The site is deployed to a server via Github Actions. The following Docker command is run on the server once deployed:

```bash
./start-production.sh
```

## Debugging app

The app can display useful information via [debug](https://www.npmjs.com/package/debug).

Full debugging:

```bash
DEBUG=indieweb-express-site:* npm run dev
```

or debugging limited to only some areas:

```bash
DEBUG=indieweb-express-site:controller:*,indieweb-express-site:error npm run dev
```
