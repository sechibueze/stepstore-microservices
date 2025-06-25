FROM node:24-alpine

WORKDIR /stepstore-template

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY src ./src

RUN npm run build

EXPOSE 4009

CMD ["npm", "start"]
