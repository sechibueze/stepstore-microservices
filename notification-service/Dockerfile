FROM node:24-alpine

WORKDIR /stepstore-notification

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY src ./src

RUN npm run build

EXPOSE 4002

CMD ["npm", "start"]
