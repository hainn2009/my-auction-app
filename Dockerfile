FROM node:20-alpine AS builder
WORKDIR /app

COPY . .

RUN npm install

ARG APP_NAME
RUN npm run build ${APP_NAME}

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ARG APP_NAME
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
