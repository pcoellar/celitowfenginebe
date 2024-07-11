FROM node:16.13 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm install

FROM node:16.13
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD npm run start:prod
