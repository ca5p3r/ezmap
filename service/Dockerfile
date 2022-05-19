FROM node:latest as build

WORKDIR /app/server
COPY . /app/server

RUN npm install
RUN node /app/server/app.js

EXPOSE 9090