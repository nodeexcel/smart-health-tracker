# docker/Dockerfile

FROM node:14 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# docker/docker-compose.yml

version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:

# docker/.env

MONGO_URI=mongodb://mongo:27017/mydatabase
NODE_ENV=production

# docker/entrypoint.sh

#!/bin/sh

set -e

# Wait for MongoDB to be ready
until nc -z mongo 27017; do
  echo "Waiting for MongoDB..."
  sleep 2
done

# Start the Node.js application
npm start

# docker/Dockerfile.mobile

FROM reactnativecommunity/react-native-android:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "android"]

# docker/docker-compose.mobile.yml

version: '3.8'

services:
  mobile:
    build:
      context: .
      dockerfile: Dockerfile.mobile
    ports:
      - "8081:8081"
    environment:
      - NODE_ENV=development

# docker/README.md

# Docker Deployment Setup

This directory contains the Docker setup for both web and mobile applications. 

To build and run the web application, use:
docker-compose up --build
To build and run the mobile application, use:
docker-compose -f docker-compose.mobile.yml up --build