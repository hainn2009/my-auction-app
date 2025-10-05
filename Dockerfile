FROM node:20-alpine AS builder
WORKDIR /app

# Copy toàn bộ repo (Render sẽ gửi root repo)
COPY . .

RUN npm install

# Cho phép truyền APP_NAME từ render.yaml
ARG APP_NAME
RUN npm run build ${APP_NAME}

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
