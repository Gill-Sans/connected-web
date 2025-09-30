# Stage 1: Build the Angular application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build:${BUILD_ENV}

# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /app/dist/connected-web/browser/. .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
