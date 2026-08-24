# Learningfy - Panduan Deploy Docker

Panduan deploy Learningfy ke server pribadi dengan Docker. Mengacu pada `GUIDELINE_DEPLOY.MD` (server rafi-server).

---

## Arsitektur

| Service | Container | Port | Keterangan |
|---|---|---|---|
| Frontend | `learningfy-frontend` | **3010** → 80 | Nginx: serve static build Vite + reverse proxy |
| Backend | `learningfy-backend` | **4000** → 4000 | Express API |
| PostgreSQL | `postgres` (eksternal) | 5432 | Sudah ada di network `homelab` |

```
Browser ──> :3010 (nginx)
              ├── /           -> static files (React SPA)
              ├── /api/*      -> learningfy-backend:4000
              └── /uploads/*  -> learningfy-backend:4000
```

Semua request API lewat satu origin (nginx), jadi tidak ada masalah CORS dan cookie JWT aman.

### File Docker

```
LearningFy/
├── docker-compose.yml        # Orkestrasi 2 service
├── .env                      # Environment production (root)
├── backend/
│   ├── Dockerfile            # Node 22 alpine, non-root
│   └── db/
│       ├── schema.sql        # DDL semua tabel
│       └── seed.js           # Data dummy untuk demo/portfolio
└── frontend/
    ├── Dockerfile            # Multi-stage: build Vite -> nginx
    ├── nginx.conf            # SPA fallback + proxy /api & /uploads
    └── ...
```

Fitur compose yang sudah termasuk: network eksternal `homelab`, healthcheck, resource limit (backend 512M / frontend 128M), log rotation (`json-file`, max 3x10MB), volume `learningfy_uploads` agar file upload user tidak hilang saat container di-recreate.

---

## Langkah Deploy

### 1. Clone / update kode di server

```bash
git clone <url-repo> && cd LearningFy
# atau kalau sudah pernah clone:
git pull
```

### 2. Buat database (sekali saja)

```bash
docker exec postgres psql -U admin -d postgres -c "CREATE DATABASE learningfy OWNER admin;"
```

> `-d postgres` wajib — tanpa itu `psql` mencoba konek ke database bernama `admin` yang tidak ada.

Lewati langkah ini jika database sudah dibuat sebelumnya.

### 3. Lengkapi `.env`

File `.env` sudah tersedia di root. Yang wajib dicek:

```env
PG_URI=postgresql://admin:Luffy-25@postgres:5432/learningfy   # sudah terisi
JWT_SECRET=...                                                # sudah digenerate
MIDTRANS_SERVER_KEY=<isi key sandbox Midtrans>
MIDTRANS_CLIENT_KEY=<isi key sandbox Midtrans>
CLIENT_ORIGIN=http://localhost:5173,http://localhost:3010     # tambah domain/IP jika akses via domain
```

> Key sandbox Midtrans cukup untuk demo/portfolio (`isProduction: false` di kode).

### 4. Build & jalankan

```bash
docker compose up -d --build
```

### 5. Isi data awal (seed)

```bash
docker exec learningfy-backend node db/seed.js
```

Seeder bersifat idempotent — bisa dijalankan ulang kapan saja (data lama akan dibersihkan lalu diisi ulang). Termasuk membuat semua tabel via `db/schema.sql`.

**Akun demo hasil seeding:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@learningfy.id` | `admin123` |
| Instructor | `budi@learningfy.id` | `instructor123` |
| Instructor | `sari@learningfy.id` | `instructor123` |
| Student | `andi@mail.com` | `student123` |
| Student | `rina@mail.com` | `student123` |
| Student | `dimas@mail.com` | `student123` |

### 6. Verifikasi

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
# learningfy-backend    Up ... (healthy)
# learningfy-frontend   Up ... (healthy)

curl http://localhost:4000     # => Server is Ready
curl -I http://localhost:3010  # => HTTP/1.1 200 OK
```

Buka aplikasi di `http://<ip-server>:3010`.

---

## Perintah Sehari-hari

```bash
# Log
docker logs learningfy-backend --tail 100 -f
docker logs learningfy-frontend --tail 100 -f

# Rebuild setelah ada update kode
git pull && docker compose up -d --build

# Restart
docker compose restart

# Stop / start semua
docker compose down
docker compose up -d

# Reset data + seed ulang
docker exec learningfy-backend node db/seed.js
```

## Update Aplikasi

```bash
cd LearningFy
git pull
docker compose up -d --build      # rebuild hanya layer yang berubah
docker exec learningfy-backend node db/seed.js   # opsional, jika ingin reset data demo
```

Upload user (gambar/PDF) aman karena disimpan di volume `learningfy_uploads`.

---

## Monitoring (opsional)

Sesuai guideline server:

- **Uptime Kuma** (`:3001`) — tambah monitor HTTP: `http://learningfy-backend:4000/`
- **Grafana/cAdvisor** — otomatis mendeteksi container baru di network `homelab`

## Backup Database

```bash
docker exec postgres pg_dump -U admin learningfy > learningfy_backup_$(date +%F).sql
```

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| `FATAL: database "admin" does not exist` saat create DB | Tambahkan `-d postgres` pada perintah `psql` |
| `network homelab not found` | Buat dulu: `docker network create homelab` |
| Backend gagal connect DB | Pastikan DB sudah dibuat (langkah 2) & cek `PG_URI` di `.env` |
| Gambar/PDF lesson tidak muncul | Seed memakai URL publik; cek koneksi internet server |
| Login gagal setelah deploy fresh | Jalankan seeder (langkah 5) |
| Port bentrok | Frontend pakai 3010, backend 4000 — cek `docker ps` jika ada konflik |
| Error CORS | Tambahkan origin akses ke `CLIENT_ORIGIN` di `.env`, lalu `docker compose up -d` |

---

Dibuat: Agustus 2026 · Stack: React 19 + Vite 7 / Express 5 / PostgreSQL
