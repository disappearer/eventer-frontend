FROM node:carbon-alpine

# Create app dir
WORKDIR /usr/src/eventer-frontend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY server ./
COPY build ./build

RUN npm install

ENV PORT 3000
EXPOSE $PORT
CMD [ "npm", "start" ]