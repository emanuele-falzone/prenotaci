FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY index.js index.js
COPY utils.js utils.js
COPY api.js api.js

ENV DEBUG=prenotaci
CMD ["npm", "start"]