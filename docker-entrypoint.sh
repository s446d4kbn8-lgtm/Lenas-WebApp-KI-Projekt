#!/bin/sh
set -e

echo ">>> [1/3] Datenbankmigrationen anwenden..."
npx prisma migrate deploy

echo ">>> [2/3] Admin-Benutzer einrichten..."
npx tsx prisma/seed.ts

echo ">>> [3/3] Next.js starten..."
exec npx next start -p "${PORT:-3000}"
