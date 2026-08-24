FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# curl untuk healthcheck
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Folder upload (dipakai multer, dipersist via volume di compose)
RUN mkdir -p utils/upload/images utils/upload/docs \
    && chown -R node:node /app

USER node

EXPOSE 4000

CMD ["node", "index.js"]
