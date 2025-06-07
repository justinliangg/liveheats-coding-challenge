
FROM node:22-slim as development

WORKDIR /app

COPY ./client/package.json ./client/package-lock.json ./

RUN npm install

COPY ./client /app

CMD npm run dev