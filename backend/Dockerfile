FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --cache=/tmp/npm-cache \
    && rm -rf /tmp/npm-cache

COPY src ./src

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "src/server.js"]