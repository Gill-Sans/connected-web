# ===== Stage 1: Build Angular app =====
FROM node:20-alpine AS build
WORKDIR /app

# Better caching
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build -- --configuration production

# ===== Stage 2: Serve with Nginx =====
FROM nginx:alpine

# Use our SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean default site
RUN rm -rf /usr/share/nginx/html/*

# Copy dist and then move the *browser* bundle into place
COPY --from=build /app/dist /tmp/dist
RUN set -eux; \
    browser_dir="$(find /tmp/dist -type d -path '*/browser' -print -quit)"; \
    if [ -z "$browser_dir" ]; then echo 'No /browser build folder under /tmp/dist'; ls -laR /tmp/dist; exit 1; fi; \
    cp -r "$browser_dir"/* /usr/share/nginx/html/; \
    rm -rf /tmp/dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
