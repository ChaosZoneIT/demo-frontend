FROM node:23 AS builder

ARG BUILD_CONFIG=production
ENV BUILD_CONFIG=${BUILD_CONFIG}

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx ng build --configuration=${BUILD_CONFIG} 

FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80