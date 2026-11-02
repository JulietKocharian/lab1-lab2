#!/usr/bin/env bash
# Serve lab1/web with Nginx. Independent of Lab 2.
set -euo pipefail

LAB_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONF="/etc/nginx/sites-available/lab1.conf"
LINK="/etc/nginx/sites-enabled/lab1.conf"

sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 8741;
    listen [::]:8741;
    server_name _;
    root $LAB_DIR/web;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

sudo ln -sfn "$CONF" "$LINK"
sudo rm -f /etc/nginx/sites-enabled/default

if pgrep -x nginx >/dev/null; then
  sudo nginx -t
  sudo nginx -s reload
else
  sudo nginx -t
  sudo nginx
fi

echo "Lab 1 page: http://127.0.0.1:8741"
