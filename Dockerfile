# Taken from https://web.archive.org/web/20210429120841/https://nodejs.org/en/docs/guides/nodejs-docker-webapp/


FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/src/app

# Expose the used port
EXPOSE 3000

# RUN apt-get install dumb-init

RUN npm install --only=development
# If you are building your code for production
RUN npm ci --only=production


# Why the above? See http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/

# Switch to a more secure user
COPY --chown=node:node . /usr/src/app
USER node



CMD ["node", "app.js"]


