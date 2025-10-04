# ======================
# 1. Base build stage
# ======================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all source files
COPY . .

# Install all deps (including dev)
RUN npm install

# Build the specific NestJS app
RUN npm run build users

# ======================
# 2. Runtime stage
# ======================
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/users ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
