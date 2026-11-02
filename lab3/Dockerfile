FROM node:22-alpine AS client
WORKDIR /src
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:22-alpine AS server
WORKDIR /src
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ ./
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=server /src/package.json ./package.json
COPY --from=server /src/node_modules ./node_modules
COPY --from=server /src/dist ./dist
COPY --from=client /src/dist ./public
EXPOSE 8000
CMD ["node", "dist/main.js"]
