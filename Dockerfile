FROM node:20-alpine

WORKDIR /app

# Server
COPY server/package*.json server/
RUN cd server && npm ci --only=production

# Client build
COPY client/package*.json client/
RUN cd client && npm ci
COPY client/ client/
RUN cd client && npm run build

# Server source
COPY server/ server/

# Data directory for SQLite
RUN mkdir -p /app/data
VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/src/index.js"]
