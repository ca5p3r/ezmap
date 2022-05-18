FROM node:16.8.0-alpine as build

WORKDIR /app/server
COPY . /app/server

RUN npm install
RUN node /app/server/app.js

EXPOSE 9090