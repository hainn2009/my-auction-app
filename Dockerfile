FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY . .

ARG APP_NAME
RUN npm run build ${APP_NAME}

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

ARG APP_NAME
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
