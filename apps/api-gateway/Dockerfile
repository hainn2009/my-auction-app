# apps/users/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Copy root package
COPY ../../package*.json ./
RUN npm install --only=production

# Copy source của riêng service
COPY . .
RUN npm run build

# Expose TCP port
EXPOSE 3000

# Run compiled code
CMD ["node", "dist/apps/api-gateway/main.js"]
