#!/bin/bash
# Bringt die Vorschau-Instanz auf CT999 auf den aktuellen Stand – ohne das Produktiv-HA anzufassen.
# Aufruf: scripts/preview_deploy.sh [--no-build]
set -euo pipefail
cd "$(dirname "$0")/.."

PVE="ssh -F $HOME/.ssh/config pve"
PORT=8123
CT=999
URL="http://192.168.178.138:${PORT}"

VER=$(python3 -c 'import json;print(json.load(open("custom_components/raumklima/manifest.json"))["version"])')
echo "== Vorschau-Deploy $VER nach CT$CT"

if [ "${1:-}" != "--no-build" ]; then
  ( cd frontend && PATH=/workspace/.tools/node/bin:$PATH npm run build >/dev/null )
  echo "   Karte gebaut"
fi

# Komponente + Karte in ein Archiv, damit alles in einem Zug übertragen wird
tar czf /tmp/rk_preview.tgz custom_components/raumklima
base64 -w0 /tmp/rk_preview.tgz | $PVE "cat > /tmp/rk_preview.b64"

$PVE "pct exec $CT -- bash -lc 'base64 -d /tmp/rk_preview.b64 > /tmp/rk_preview.tgz 2>/dev/null || true'"
# Datei im Container ablegen (pct push kann veralten, daher über stdin)
$PVE "cat /tmp/rk_preview.b64 | pct exec $CT -- bash -lc 'base64 -d > /tmp/rk_preview.tgz'"

$PVE "pct exec $CT -- bash -lc '
  set -e
  cd /opt/ha-config
  tar xzf /tmp/rk_preview.tgz -C /tmp
  rm -rf custom_components/raumklima
  cp -a /tmp/custom_components/raumklima custom_components/
  chown -R root:root custom_components/raumklima
  python3 - <<PY
import json, pathlib
p = pathlib.Path(\"/opt/ha-config/.storage/lovelace_resources\")
d = json.loads(p.read_text())
for it in d[\"data\"][\"items\"]:
    if \"raumklima-card.js\" in it.get(\"url\", \"\"):
        it[\"url\"] = \"/raumklima_static/raumklima-card.js?v=$VER\"
p.write_text(json.dumps(d))
PY
  echo \"   Dateien kopiert, Ressource auf v=$VER gesetzt\"
  /opt/ha_start.sh >/dev/null
'"

# Warten bis die Instanz wieder antwortet
for i in $(seq 1 30); do
  C=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$URL/" 2>/dev/null || true)
  [ "$C" = "200" ] && break
  sleep 4
done
echo "   HTTP $C"

SERVED=$(curl -s "$URL/raumklima_static/raumklima-card.js?v=$VER" | grep -o "RK_VERSION = \"[0-9.]*\"" | head -1)
echo "   Karte: ${SERVED:-nicht gefunden}"
echo "== fertig: $URL (Dashboard 'raumklima_test')"
