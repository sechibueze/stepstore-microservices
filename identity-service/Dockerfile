FROM node:24-alpine

WORKDIR /stepstore-identity

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY src ./src

RUN npm run build

EXPOSE 4001

CMD ["npm", "start"]
