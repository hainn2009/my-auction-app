#!/bin/bash
set -e

DOMAIN="auctions-app-backend-nestjs.duckdns.org"
EMAIL="hainn2009@gmail.com"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "==> Cài đặt Nginx và Certbot..."
sudo apt update -y
sudo apt install -y nginx certbot python3-certbot-nginx

echo "==> Copy Nginx config..."
sudo cp "$PROJECT_DIR/nginx/auctions-app.conf" /etc/nginx/sites-available/auctions-app
sudo ln -sf /etc/nginx/sites-available/auctions-app /etc/nginx/sites-enabled/auctions-app

# Xóa default site nếu còn
sudo rm -f /etc/nginx/sites-enabled/default

echo "==> Kiểm tra Nginx config..."
sudo nginx -t

echo "==> Khởi động Nginx..."
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "==> Cấp SSL certificate cho $DOMAIN..."
sudo certbot --nginx -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive --redirect

echo "==> Kiểm tra tự động renew cert..."
sudo certbot renew --dry-run

echo ""
echo "Done! Truy cập: https://$DOMAIN"
