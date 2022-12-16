FROM node:14.21-alpine

RUN mkdir /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm cache clean --force --loglevel-error

COPY --chown=node:node . .

ENV NODE_ENV=production

EXPOSE 3003

CMD [ "node", "server.js" ]