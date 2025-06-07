FROM node:22-slim as development

RUN apt-get update -y && \
    apt-get install -y openssl

WORKDIR /app

COPY ./docker/server/entrypoint.sh /entrypoint.sh
COPY ./server/package.json ./server/package-lock.json ./

RUN npm install 

COPY ./server /app

RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
