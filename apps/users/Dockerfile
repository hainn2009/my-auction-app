FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package*.json ../../tsconfig*.json ./
RUN npm install
COPY ../../ .
RUN npm run build users

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/users ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]
