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

# Copy the built app: find the "browser" bundle, copy it, and ensure index.html exists
COPY --from=build /app/dist /tmp/dist
RUN set -eux; \
    ROOT=/usr/share/nginx/html; \
    BROWSER_DIR="$(find /tmp/dist -type d -path '*/browser' -print -quit)"; \
    if [ -z "$BROWSER_DIR" ]; then \
      echo 'ERROR: no /browser folder found under /tmp/dist'; ls -laR /tmp/dist; exit 1; \
    fi; \
    echo "Using browser bundle at: $BROWSER_DIR"; \
    cp -r "$BROWSER_DIR"/* "$ROOT/"; \
    # If Angular output is index.csr.html (SSR projects), rename it to index.html
    if [ ! -f "$ROOT/index.html" ]; then \
      if [ -f "$ROOT/index.csr.html" ]; then mv "$ROOT/index.csr.html" "$ROOT/index.html"; \
      else echo 'ERROR: neither index.html nor index.csr.html found'; ls -la "$ROOT"; exit 1; fi; \
    fi; \
    rm -rf /tmp/dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
