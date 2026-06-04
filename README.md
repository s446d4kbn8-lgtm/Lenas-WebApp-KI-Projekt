# Message Board

Eine produktionsreife Web-App für Besucherformular + Admin-Dashboard.

## Tech-Stack

| Komponente | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Datenbank | PostgreSQL 16 |
| ORM | Prisma |
| Authentifizierung | JWT (jose) + HTTP-only-Cookie |
| Passwort-Hashing | bcryptjs (bcrypt, 12 Runden) |
| Styling | Tailwind CSS |
| Container | Docker + Docker Compose |

## Sicherheitsmerkmale

- **Passwort-Hashing**: bcrypt mit 12 Runden (OWASP-empfohlen)
- **JWT**: HS256, 24h Ablauf, HTTP-only + SameSite=Strict Cookie
- **CSRF-Schutz**: Double-Submit-Cookie-Muster (X-CSRF-Token Header)
- **Spam-Schutz**: Honeypot-Feld + IP-basiertes Rate Limiting (5 Nachrichten/IP/Stunde)
- **Security-Header**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Timing-sicherer Vergleich**: CSRF-Token und Passwort-Prüfung resistent gegen Timing-Angriffe
- **Eingabe-Validierung**: Zod-Schema auf Server-Seite

---

## Voraussetzungen

- Node.js 20+
- npm 10+
- PostgreSQL 14+ **oder** Docker + Docker Compose

---

## Lokale Installation (Entwicklung)

### 1. Repository klonen und Abhängigkeiten installieren

```bash
cd message-board
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env.local
```

Öffne `.env.local` und passe folgende Werte an:

```env
DATABASE_URL="postgresql://postgres:changeme@localhost:5432/messageboard"
JWT_SECRET="$(openssl rand -base64 32)"
CSRF_SECRET="$(openssl rand -base64 32)"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="IhrSicheresPasswort"
```

> **Wichtig**: Verwenden Sie für `JWT_SECRET` und `CSRF_SECRET` echte Zufallswerte.
> Generieren mit: `openssl rand -base64 32`

### 3. PostgreSQL starten (mit Docker)

```bash
docker run -d \
  --name messageboard-db \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=messageboard \
  -p 5432:5432 \
  postgres:16-alpine
```

Oder mit vorhandenem PostgreSQL: Datenbank `messageboard` manuell anlegen.

### 4. Datenbank-Migration und Admin anlegen

```bash
# Prisma-Client generieren
npm run db:generate

# Migration erstellen (nur beim ersten Mal)
npx prisma migrate dev --name init

# Admin-Benutzer erstellen (aus .env.local)
npm run db:seed
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die App ist unter **http://localhost:3000** erreichbar.

- **Besucherformular**: http://localhost:3000
- **Admin-Login**: http://localhost:3000/login
- **Admin-Dashboard**: http://localhost:3000/admin

---

## Docker-Deployment (Empfohlen für Produktion)

### 1. Umgebungsvariablen erstellen

```bash
cp .env.example .env
```

Passe `.env` mit **echten, sicheren Werten** an:

```env
POSTGRES_PASSWORD=<zufaelliges-db-passwort>
JWT_SECRET=<openssl rand -base64 32>
CSRF_SECRET=<openssl rand -base64 32>
ADMIN_EMAIL=admin@ihre-domain.de
ADMIN_PASSWORD=<sicheres-admin-passwort>
APP_PORT=3000
```

### 2. Docker-Image bauen und Container starten

```bash
docker compose up -d --build
```

Was passiert beim Start:
1. PostgreSQL-Container startet
2. App-Container wartet auf DB (healthcheck)
3. Datenbankmigrationen werden angewendet (`prisma migrate deploy`)
4. Admin-Benutzer wird erstellt (falls nicht vorhanden)
5. Next.js Production-Server startet

### 3. Status prüfen

```bash
docker compose ps
docker compose logs -f app
```

Die App ist unter **http://server-ip:3000** erreichbar.

---

## Deployment auf einem öffentlichen Server

### Option A: Reverse Proxy mit Nginx + SSL (Let's Encrypt)

#### 1. Server vorbereiten (Ubuntu/Debian)

```bash
# Docker installieren
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Nginx installieren
sudo apt update && sudo apt install nginx certbot python3-certbot-nginx -y
```

#### 2. Projekt auf den Server übertragen

```bash
# Auf Ihrem lokalen Rechner
scp -r message-board/ user@server-ip:/opt/message-board

# Oder via Git
ssh user@server-ip
git clone https://github.com/ihreuser/message-board.git /opt/message-board
```

#### 3. Nginx konfigurieren

```nginx
# /etc/nginx/sites-available/message-board
server {
    listen 80;
    server_name ihre-domain.de www.ihre-domain.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/message-board /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

#### 4. SSL-Zertifikat (HTTPS) einrichten

```bash
sudo certbot --nginx -d ihre-domain.de -d www.ihre-domain.de
```

#### 5. App starten

```bash
cd /opt/message-board
cp .env.example .env
# .env mit echten Werten befüllen (nano .env)
docker compose up -d --build
```

#### 6. Firewall konfigurieren

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
# Port 3000 nur intern: NICHT für externe Verbindungen öffnen
```

---

### Option B: Coolify / Caprover / Railway

Diese Plattformen unterstützen Docker Compose direkt:

1. Repository verbinden oder Docker Compose hochladen
2. Umgebungsvariablen im Dashboard eintragen
3. Deploy auslösen

---

## Datenbankschema

```sql
-- Tabelle: users (nur Admin-Benutzer)
CREATE TABLE users (
    id           TEXT PRIMARY KEY,
    email        TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW()
);

-- Tabelle: messages (Besuchernachrichten)
CREATE TABLE messages (
    id         TEXT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(200),
    content    TEXT NOT NULL,
    ip         VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Umgebungsvariablen – Referenz

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `DATABASE_URL` | Ja | PostgreSQL-Verbindungs-URL |
| `JWT_SECRET` | Ja | Geheimer Schlüssel für JWT-Token (min. 32 Zeichen) |
| `CSRF_SECRET` | Ja | Geheimer Schlüssel für CSRF-Validierung |
| `ADMIN_EMAIL` | Ja (Seed) | E-Mail-Adresse des Administrators |
| `ADMIN_PASSWORD` | Ja (Seed) | Passwort des Administrators |
| `POSTGRES_PASSWORD` | Docker | PostgreSQL-Passwort (nur für docker-compose) |
| `APP_PORT` | Nein | Externer Port (Standard: 3000) |
| `NODE_ENV` | Nein | `production` für Produktion |

---

## Admin-Passwort ändern

```bash
# Neues Hash berechnen
node -e "const b=require('bcryptjs');b.hash('neuesPasswort',12).then(h=>console.log(h))"

# In der Datenbank aktualisieren
docker compose exec db psql -U postgres messageboard -c \
  "UPDATE users SET password_hash='<neuer-hash>' WHERE email='admin@example.com';"
```

---

## Wichtige Hinweise für Produktion

- Verwenden Sie **nur HTTPS** für den öffentlichen Zugang
- Setzen Sie **NODE_ENV=production** (aktiviert secure-Cookies)
- Erstellen Sie regelmäßige **Datenbank-Backups**:
  ```bash
  docker compose exec db pg_dump -U postgres messageboard > backup.sql
  ```
- Das **Rate Limiting** ist In-Memory – bei mehreren App-Instanzen Redis verwenden
- **Secrets** niemals in Git committen (`.env` ist in `.dockerignore` ausgenommen)
