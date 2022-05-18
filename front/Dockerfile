FROM node:12.2.0-alpine as build
WORKDIR /app
COPY package.json .
COPY . /app
RUN npm install
RUN npm run build


# production environment
FROM nginx:latest
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

