FROM node:10

ENV NODE_ENV production

# Create app directory
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install-server

WORKDIR /app/client/core
COPY client/core/package.json .
COPY client/core/yarn.lock .
RUN yarn install

# Build client first
COPY client/core .
RUN yarn build

# Then build server
WORKDIR /app
COPY . .
RUN yarn build-server

EXPOSE 80
CMD ["node", "dist/server/server.js"]