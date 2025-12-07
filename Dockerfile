# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine AS server_deps
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server ./server
RUN mkdir -p server/storage/searches

FROM node:${NODE_VERSION}-alpine AS server
ENV NODE_ENV=production
WORKDIR /app/server
COPY --from=server_deps /app/server ./
RUN chown -R node:node /app/server
USER node
EXPOSE 5000
CMD ["node", "index.js"]

FROM node:${NODE_VERSION}-alpine AS web_build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=http://localhost:5000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginx:1.27-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web_build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
