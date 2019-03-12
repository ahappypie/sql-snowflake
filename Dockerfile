FROM node:11-alpine

RUN mkdir /opt/job

WORKDIR /opt/job

COPY package.json package-lock.json index.js  ./

RUN npm install

CMD npm start