FROM node:12.2.0-alpine as build
WORKDIR /app
COPY package.json .
COPY . /app
ENV REACT_APP_BACKEND_SERVICE=__REACT_APP_BACKEND_SERVICE__
RUN npm install
RUN npm run build




# production environment
FROM nginx:latest
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html
COPY start.sh /app
EXPOSE 80
CMD ["sh","start.sh"]

