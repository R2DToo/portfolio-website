FROM node:14.17-alpine

RUN mkdir /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm cache clean --force --loglevel-error

COPY --chown=node:node server.js .
COPY --chown=node:node .env .

ENV NODE_ENV=production

CMD [ "node", "server.js" ]