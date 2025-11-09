#!/data/data/com.termux/files/usr/bin/bash
# Auto-push script for LocalLinkAi (manual activation)
# -------------------------------------------

BRANCH="main"
INTERVAL=120  # tiempo en segundos entre cada push (2 minutos)
RUNNING_FILE=".autopush-running"

start_auto_push() {
  if [ -f "$RUNNING_FILE" ]; then
    echo "⚠️  Auto-push ya está corriendo."
    exit 1
  fi
  echo $$ > "$RUNNING_FILE"
  echo "🚀 Auto-push activado. Subirá cada $INTERVAL segundos."
  while true; do
    git add .
    git commit -m "Auto-save $(date '+%Y-%m-%d %H:%M:%S')" >/dev/null 2>&1
    git push origin $BRANCH >/dev/null 2>&1
    sleep $INTERVAL
  done
}

stop_auto_push() {
  if [ ! -f "$RUNNING_FILE" ]; then
    echo "🛑 Auto-push no está activo."
    exit 1
  fi
  kill "$(cat $RUNNING_FILE)" 2>/dev/null
  rm -f "$RUNNING_FILE"
  echo "🛑 Auto-push detenido."
}

case "$1" in
  start) start_auto_push ;;
  stop) stop_auto_push ;;
  *) echo "Uso: bash auto-push.sh {start|stop}" ;;
esac
