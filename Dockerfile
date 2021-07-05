# Taken from https://web.archive.org/web/20210429120841/https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:14

# TODO: remove
# RUN apt-get install dumb-init
RUN apt update
RUN apt install libvips libvips-dev -y

# Expose the port
EXPOSE 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./package.json .
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Why the above? See http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/

# Switch to a more secure user
# COPY --chown=node:node ./src .
# USER node

COPY . .

# Start the app
# CMD ["npm", "run", "css"]
# CMD ["npm", "run", "js"]
# CMD ["npm", "run", "sprites"]
# CMD ["npm", "start"]

CMD "npm run dev"
