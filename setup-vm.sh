#!/bin/bash
# Setup script cho GCP e2-micro (Ubuntu 22.04/24.04)
# Chạy: chmod +x setup-vm.sh && sudo ./setup-vm.sh
set -e

echo "=== [1/5] Cài Docker ==="
if ! command -v docker &> /dev/null; then
  apt-get update -qq
  apt-get install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -qq
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable docker
  systemctl start docker
  echo "Docker installed."
else
  echo "Docker already installed, skipping."
fi

# Thêm user hiện tại vào group docker (không cần sudo khi chạy docker)
CURRENT_USER=${SUDO_USER:-$(whoami)}
if [ "$CURRENT_USER" != "root" ]; then
  usermod -aG docker "$CURRENT_USER"
  echo "Added $CURRENT_USER to docker group. Re-login để có hiệu lực."
fi

echo ""
echo "=== [2/5] Cài Nginx ==="
apt-get install -y nginx
systemctl enable nginx

echo ""
echo "=== [3/5] Cấu hình Nginx reverse proxy ==="
# Lấy IP public của VM
VM_IP=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip 2>/dev/null || hostname -I | awk '{print $1}')
echo "VM external IP: $VM_IP"

cat > /etc/nginx/sites-available/auction-api <<EOF
server {
    listen 80;
    server_name _;

    # Tăng timeout cho WebSocket (Socket.io)
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Giảm buffer để tiết kiệm RAM
        proxy_buffering off;
        proxy_buffer_size 4k;
    }
}
EOF

ln -sf /etc/nginx/sites-available/auction-api /etc/nginx/sites-enabled/auction-api
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "Nginx configured."

echo ""
echo "=== [4/5] Cấu hình UFW firewall ==="
apt-get install -y ufw
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh          # port 22
ufw allow http         # port 80
ufw allow https        # port 443
# KHÔNG mở port 4000 ra ngoài - chỉ nginx proxy vào
ufw --force enable
echo "Firewall configured."

echo ""
echo "=== [5/5] Tối ưu kernel cho RAM thấp ==="
cat >> /etc/sysctl.conf <<EOF

# Tối ưu cho e2-micro 1GB RAM
vm.swappiness=30
vm.vfs_cache_pressure=50
net.core.somaxconn=1024
EOF
sysctl -p > /dev/null
echo "Kernel params tuned."

echo ""
echo "======================================================"
echo " Setup hoàn tất!"
echo " VM IP: $VM_IP"
echo ""
echo " Bước tiếp theo:"
echo " 1. Upload project lên VM:"
echo "    scp -r ./my-auction-system user@$VM_IP:~/"
echo ""
echo " 2. SSH vào VM và chạy:"
echo "    cd ~/my-auction-system"
echo "    docker compose --env-file .env.production up -d --build"
echo ""
echo " 3. Kiểm tra status:"
echo "    docker compose ps"
echo "    docker stats --no-stream"
echo "======================================================"
