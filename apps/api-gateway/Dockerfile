FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package*.json ../../tsconfig*.json ./
RUN npm ci --no-audit --no-fund
COPY ../../ .
RUN npm run build api-gateway

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=builder /app/dist/apps/api-gateway ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
