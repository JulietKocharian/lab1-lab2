#!/usr/bin/env bash
# Run basic Linux commands and save the transcript under lab1/evidence.
set -u

LAB_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$LAB_DIR/evidence/linux-commands.txt"
SANDBOX="$(mktemp -d /tmp/lab1-practice.XXXXXX)"
mkdir -p "$LAB_DIR/evidence"

{
  echo "Lab 1 — basic Linux commands"
  echo "When: $(TZ=Asia/Yerevan date '+%Y-%m-%d %H:%M:%S %Z')"
  echo

  run() {
    echo "\$ $*"
    "$@"
    echo
  }

  run whoami
  run pwd
  run hostname
  run uname -a
  echo "\$ cat /etc/os-release"
  cat /etc/os-release
  echo
  echo "\$ systemd-detect-virt || true"
  systemd-detect-virt || true
  echo

  echo "\$ mkdir -p sandbox && cd sandbox"
  mkdir -p "$SANDBOX/docs"
  cd "$SANDBOX"
  pwd
  echo

  echo "\$ printf '%s\n' 'hello from lab 1' > note.txt"
  printf '%s\n' 'hello from lab 1' > note.txt
  echo "\$ cat note.txt"
  cat note.txt
  echo
  echo "\$ cp note.txt note-copy.txt"
  cp note.txt note-copy.txt
  echo "\$ mv note-copy.txt renamed.txt"
  mv note-copy.txt renamed.txt
  echo "\$ chmod 644 note.txt"
  chmod 644 note.txt
  echo "\$ ls -la"
  ls -la
  echo

  echo "\$ df -h /"
  df -h /
  echo
  echo "\$ free -h"
  free -h
  echo
  echo "\$ ip -br addr"
  ip -br addr || true
  echo
  echo "\$ ps -eo pid,comm --sort=pid | head -n 8"
  ps -eo pid,comm --sort=pid | head -n 8
  echo
} > "$OUT"

rm -rf "$SANDBOX"
echo "Wrote $OUT"
