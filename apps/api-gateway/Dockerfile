FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package*.json ../../tsconfig*.json ./
RUN npm install
COPY ../../ .
RUN npm run build api-gateway

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/api-gateway ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
