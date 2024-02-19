FROM node:18-alpine

WORKDIR /usr/

COPY . .

RUN apk add --no-cache --virtual .gyp python3 make g++

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 3000