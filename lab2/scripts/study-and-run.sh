#!/usr/bin/env bash
# Study the Docker CLI, build lab2-web, and run it. Independent of Lab 1.
set -u

LAB_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$LAB_DIR/evidence/docker-cli.txt"
mkdir -p "$LAB_DIR/evidence"

docker_cmd() {
  if docker info >/dev/null 2>&1; then
    docker "$@"
  else
    sudo docker "$@"
  fi
}

{
  echo "Lab 2 — Docker CLI, build, and run"
  echo "When: $(TZ=Asia/Yerevan date '+%Y-%m-%d %H:%M:%S %Z')"
  echo

  echo "\$ docker version"
  docker_cmd version
  echo
  echo "\$ docker info"
  docker_cmd info
  echo
  echo "\$ docker help"
  docker_cmd help
  echo
  echo "\$ docker pull hello-world"
  docker_cmd pull hello-world
  echo
  echo "\$ docker images"
  docker_cmd images
  echo
  echo "\$ docker run --rm hello-world"
  docker_cmd run --rm hello-world
  echo
  echo "\$ docker ps -a"
  docker_cmd ps -a
  echo

  echo "\$ docker build -t lab2-web ."
  docker_cmd build -t lab2-web "$LAB_DIR"
  echo
  echo "\$ docker rm -f lab2-web"
  docker_cmd rm -f lab2-web >/dev/null 2>&1 || true
  echo "\$ docker run -d --name lab2-web --restart unless-stopped -p 8742:80 lab2-web"
  docker_cmd run -d --name lab2-web --restart unless-stopped -p 8742:80 lab2-web
  echo
  echo "\$ docker ps"
  docker_cmd ps
  echo
  echo "\$ docker logs lab2-web"
  docker_cmd logs lab2-web
  echo
  echo "\$ docker exec lab2-web ls -l /usr/share/nginx/html"
  docker_cmd exec lab2-web ls -l /usr/share/nginx/html
  echo
  echo "\$ curl -fsS http://127.0.0.1:8742"
  curl -fsS http://127.0.0.1:8742
  echo
} > "$OUT"

echo "Wrote $OUT"
echo "Lab 2 page: http://127.0.0.1:8742"
