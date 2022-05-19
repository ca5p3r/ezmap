FROM node:latest as build

WORKDIR /app/server
COPY . /app/server

ENV CLIENT_ID=QGIS
ENV CLIENT_SECRET=af400cda-32f4-45d7-9fd9-8139e101a020
ENV KEYCLOAKURL=https://ec2-108-129-23-43.eu-west-1.compute.amazonaws.com:8443/auth
ENV SALT=f387d4f7781b57ac232c227fcef831d0
ENV DATABASE_ADDR=10.0.0.145
ENV DATABASE_PORT=5432
ENV DATABASE_USER=postgres
ENV DATABASE_PASS=postgres
ENV DATABASE_NAME=ezmap

RUN npm install
EXPOSE 9090

CMD ["node","/app/server/app.js"]