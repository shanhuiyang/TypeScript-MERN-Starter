FROM node:10

# Create app directory
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install-server

WORKDIR /app/client
COPY client/package.json .
COPY client/yarn.lock .
RUN yarn install

# Build client first
COPY client .
RUN yarn build

WORKDIR /app
COPY . .
RUN yarn build

ENV NODE_ENV production

EXPOSE 80
CMD ["node", "dist/server/server.js"]