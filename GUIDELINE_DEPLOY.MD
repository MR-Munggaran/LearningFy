# Skill: Deploy Docker ke Production Server

Skill ini memastikan aplikasi yang di-deploy sesuai dengan kondisi Docker dan teknologi yang digunakan.

---

## 1. Server Profile

| Komponen | Detail |
|----------|--------|
| OS | Ubuntu 26.04 LTS |
| CPU | AMD Athlon 3000G (2C/4T) |
| RAM | 9.2GB (6.1GB available) |
| Disk | 98GB (50GB free) |
| Docker | 29.6.1 + Compose 5.3.1 |
| Network | `homelab` (bridge) |

---

## 2. Database yang Tersedia

| Database | Container | Port | User | Password |
|----------|-----------|------|------|----------|
| PostgreSQL 17 | `postgres` | 5432 | `admin` | `Luffy-25` |
| MariaDB 12 | `mariadb` | 3306 | `root` | `Admin123` |
| MongoDB 8 | `mongodb` | 27017 | `admin` | `Munggaran-123` |
| Redis 8 | `redis` | 6379 | - | - |

---

## 3. Panduan Koneksi Database

### PostgreSQL

```bash
# Connection string (Prisma/Node.js)
postgresql://admin:Luffy-25@postgres:5432/{db_name}?schema=public

# Laravel (.env)
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE={db_name}
DB_USERNAME=admin
DB_PASSWORD=Luffy-25

# Python (SQLAlchemy)
DATABASE_URL=postgresql://admin:Luffy-25@postgres:5432/{db_name}
```

### MariaDB

```bash
# Connection string (Node.js)
mysql://root:Admin123@mariadb:3306/{db_name}

# Laravel (.env)
DB_CONNECTION=mysql
DB_HOST=mariadb
DB_PORT=3306
DB_DATABASE={db_name}
DB_USERNAME=root
DB_PASSWORD=Admin123

# Python (SQLAlchemy)
DATABASE_URL=mysql+pymysql://root:Admin123@mariadb:3306/{db_name}
```

### MongoDB

```bash
# Connection string (Mongoose/Node.js)
mongodb://admin:Munggaran-123@mongodb:27017/{db_name}?authSource=admin

# Python (PyMongo)
mongodb://admin:Munggaran-123@mongodb:27017/{db_name}?authSource=admin
```

### Redis

```bash
# Connection string
redis://redis:6379

# Laravel (.env)
REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Node.js (ioredis/redis)
REDIS_URL=redis://redis:6379

# Python (redis-py)
REDIS_URL=redis://redis:6379
```

---

## 4. Cara Create Database Baru

### PostgreSQL

```bash
# Create database baru
docker exec postgres psql -U admin -c "CREATE DATABASE myapp;"

# Create database dengan owner specific
docker exec postgres psql -U admin -c "CREATE DATABASE myapp OWNER admin;"

# List semua database
docker exec postgres psql -U admin -c "\l"

# Drop database (hati-hati!)
docker exec postgres psql -U admin -c "DROP DATABASE myapp;"
```

### MariaDB

```bash
# Create database baru
docker exec mariadb mysql -u root -pAdmin123 -e "CREATE DATABASE myapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create database dengan user baru
docker exec mariadb mysql -u root -pAdmin123 -e "
CREATE DATABASE myapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'myapp_user'@'%' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp_user'@'%';
FLUSH PRIVILEGES;
"

# List semua database
docker exec mariadb mysql -u root -pAdmin123 -e "SHOW DATABASES;"

# Drop database
docker exec mariadb mysql -u root -pAdmin123 -e "DROP DATABASE myapp;"
```

### MongoDB

```bash
# Tidak perlu create manual! MongoDB auto-create pada first write
# Cukup gunakan nama database baru di connection string:
# mongodb://admin:Munggaran-123@mongodb:27017/myapp?authSource=admin

# Untuk list semua database setelah ada data:
docker exec mongodb mongosh -u admin -p Munggaran-123 --authenticationDatabase admin --eval "show dbs"

# Drop database
docker exec mongodb mongosh -u admin -p Munggaran-123 --authenticationDatabase admin --eval "db.getSiblingDB('myapp').dropDatabase()"
```

### Redis

```bash
# Redis tidak punya konsep database, langsung pakai
# Connection: redis://redis:6379

# Untuk reset semua data (jika perlu):
docker exec redis redis-cli FLUSHALL
```

---

## 5. Template Docker Compose

```yaml
services:
  app:
    build: .
    container_name: {app-name}
    restart: unless-stopped
    networks:
      - homelab
    ports:
      - "4000:4000"
    env_file:
      - .env
    depends_on:
      - postgres  # atau mariadb/mongodb/redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  homelab:
    external: true
```

---

## 6. Template .env per Teknologi

### Laravel (MariaDB + Redis)

```env
DB_CONNECTION=mysql
DB_HOST=mariadb
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=Admin123

REDIS_HOST=redis
REDIS_PORT=6379
```

### Next.js/Node.js (PostgreSQL + Prisma)

```env
DATABASE_URL=postgresql://admin:Luffy-25@postgres:5432/myapp?schema=public
```

### Next.js/Node.js (PostgreSQL + Drizzle)

```env
DATABASE_URL=postgresql://admin:Luffy-25@postgres:5432/myapp
```

### Node.js/Express (MongoDB)

```env
MONGO_URI=mongodb://admin:Munggaran-123@mongodb:27017/myapp?authSource=admin
```

### Python/FastAPI (PostgreSQL)

```env
DATABASE_URL=postgresql://admin:Luffy-25@postgres:5432/myapp
```

### Python/Django (MariaDB)

```env
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=myapp
DB_USER=root
DB_PASSWORD=Admin123
```

---

## 7. Drizzle Config Template

### `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // atau "mysql"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### `drizzle.config.ts` (MariaDB/MySQL)

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## 8. Monitoring Setup

### Komponen Monitoring

| Komponen | Port | Fungsi |
|----------|------|--------|
| Prometheus | 9090 | Metrics collection |
| Grafana | 3002 | Dashboard visualization |
| cAdvisor | 8080 | Container metrics (auto-discovery) |
| Node Exporter | 9100 | Host metrics |
| Uptime Kuma | 3001 | Health check monitoring |

### Auto-Discovery (otomatis bekerja)

- **cAdvisor** otomatis monitor semua container tanpa konfigurasi tambahan
- **Node Exporter** otomatis monitor host (CPU, memory, disk)

### Menambahkan App ke Monitoring

**Langkah 1: Tambahkan ke Prometheus (jika app expose /metrics)**

```yaml
# /home/rafi/docker/infrastructure/prometheus/prometheus.yml
scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['myapp:4000']
    metrics_path: '/metrics'
```

**Langkah 2: Tambahkan Health Check ke Uptime Kuma**

1. Buka Uptime Kuma di `http://localhost:3001`
2. Tambahkan monitor baru:
   - Type: HTTP(s) or Docker
   - URL: `http://app-container-name:port/health`
   - Interval: 60 detik

**Langkah 3: Buat Grafana Dashboard**

1. Buka Grafana di `http://localhost:3002`
2. Login: admin / admin (default, ganti setelah login)
3. Tambah Prometheus data source: `http://prometheus:9090`
4. Buat dashboard baru dengan query:

```promql
# CPU usage
rate(container_cpu_usage_seconds_total{container_label_com_docker_compose_service="myapp"}[5m]) * 100

# Memory usage
container_memory_working_set_bytes{container_label_com_docker_compose_service="myapp"}

# Network receive
rate(container_network_receive_bytes_total{container_label_com_docker_compose_service="myapp"}[5m])

# Network transmit
rate(container_network_transmit_bytes_total{container_label_com_docker_compose_service="myapp"}[5m])
```

---

## 9. Port Allocation

| Range | Purpose |
|-------|---------|
| 3000-3099 | Frontend apps |
| 4000-4099 | Backend APIs |
| 5000-5099 | Internal services |
| 8080-8099 | Monitoring |

### Ports yang Sudah Terpakai

| Port | Service |
|------|---------|
| 3000 | Gitea |
| 3001 | Uptime Kuma |
| 3002 | Grafana |
| 3003 | Ticketing Frontend |
| 3005 | Kuliah Fitri App |
| 5000 | Ticketing Backend |
| 5678 | n8n |
| 8000 | Portainer |
| 8080 | cAdvisor |
| 9090 | Prometheus |
| 9100 | Node Exporter |

---

## 10. Checklist Deployment

### Pre-Deployment

- [ ] Dockerfile ada dan valid
- [ ] `.env` berisi credentials (bukan hardcoded di compose)
- [ ] Database sudah di-create (PostgreSQL/MariaDB)
- [ ] Port tidak bentrok dengan service lain

### Docker Compose

- [ ] Terhubung ke `homelab` network
- [ ] `depends_on` benar (db start sebelum app)
- [ ] `restart: unless-stopped` ditambahkan
- [ ] Health check ditambahkan
- [ ] Resource limits (mem_limit, cpus)
- [ ] Log management (json-file driver)

### Post-Deployment

- [ ] App bisa connect ke database
- [ ] App bisa diakses via Nginx Proxy Manager
- [ ] App muncul di cAdvisor (otomatis)
- [ ] Health check di Uptime Kuma (manual)
- [ ] Dashboard di Grafana (manual)

---

## 11. Quick Commands Reference

```bash
# Create database baru
docker exec postgres psql -U admin -c "CREATE DATABASE myapp;"
docker exec mariadb mysql -u root -pAdmin123 -e "CREATE DATABASE myapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
docker exec app-container npx prisma migrate deploy          # Prisma
docker exec app-container npx drizzle-kit push               # Drizzle (push schema)
docker exec app-container npx drizzle-kit migrate            # Drizzle (run migrations)
docker exec app-container npx drizzle-kit generate           # Drizzle (generate migration files)
docker exec app-container php artisan migrate                # Laravel
docker exec app-container alembic upgrade head               # Python/Alembic
docker exec app-container python manage.py migrate           # Python/Django

# Check container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check logs
docker logs {container-name} --tail 100 -f

# Restart container
docker restart {container-name}

# Check network
docker network inspect homelab

# Backup database
docker exec postgres pg_dump -U admin myapp > myapp_backup.sql
docker exec mariadb mysqldump -u root -pAdmin123 myapp > myapp_backup.sql
docker exec mongodb mongodump -u admin -p Munggaran-123 --authenticationDatabase admin -d myapp -o /backup/
```

---

## 12. Perbandingan Migration per ORM

| ORM | Command | Keterangan |
|-----|---------|------------|
| Prisma | `npx prisma migrate deploy` | Jalankan migrations yang sudah ada |
| Prisma | `npx prisma migrate dev` | Buat & jalankan migrations (dev) |
| Drizzle | `npx drizzle-kit push` | Push schema langsung ke DB |
| Drizzle | `npx drizzle-kit generate` | Generate migration files |
| Drizzle | `npx drizzle-kit migrate` | Jalankan generated migrations |
| Laravel | `php artisan migrate` | Jalankan semua pending migrations |
| Alembic | `alembic upgrade head` | Upgrade ke latest migration |
| Django | `python manage.py migrate` | Jalankan semua pending migrations |

---

## 13. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| App tidak bisa connect DB | Pastikan container di `homelab` network |
| Authentication failed | Cek credentials di `.env` vs db server |
| Connection refused | Pastikan `depends_on` benar |
| Host `localhost` tidak work | Ganti ke nama container (`postgres`, `mariadb`, dll) |
| Database tidak ada | Create manual (PostgreSQL/MariaDB) atau auto-create (MongoDB) |
| Metrics tidak muncul di Grafana | Pastikan app expose `/metrics` endpoint |
| Container restart loop | Cek logs: `docker logs {container-name}` |

---

## 14. Teknologi yang Didukung

### Python

- **Flask**: WSGI app, port default 5000
- **FastAPI**: ASGI app, port default 8000, gunakan uvicorn
- **Django**: WSGI app, port default 8000

### PHP

- **Laravel**: FPM app, port default 9000, butuh nginx/reverse proxy

### Node.js

- **Express**: HTTP app, port default 3000
- **Nest**: HTTP app, port default 3000
- **Hono**: HTTP app, port default 3000
- **Next.js**: SSR app, port default 3000, gunakan standalone output
- **React/Vue**: SPA app, build static files, serve dengan nginx

### Database Drivers

| Teknologi | PostgreSQL | MariaDB | MongoDB | Redis |
|-----------|-----------|---------|---------|-------|
| Node.js | pg, prisma, drizzle | mysql2, prisma, drizzle | mongoose | ioredis, redis |
| Python | psycopg2, asyncpg | pymysql, sqlalchemy | pymongo | redis-py |
| PHP | pdo_pgsql | pdo_mysql | mongodb/mongodb | phpredis |
| Laravel | pgsql | mysql | mongodb | redis |

---

## 15. Best Practices

### Security

- Jangan hardcode credentials di docker-compose
- Gunakan Docker secrets atau `.env` file
- Network segmentation: database hanya internal
- Non-root user di container
- Read-only filesystem where possible

### Performance

- Gunakan multi-stage build untuk Dockerfile
- Limit resource usage (memory, CPU)
- Gunakan `.dockerignore` untuk exclude unnecessary files
- Manfaatkan Docker layer caching

### Logging

- Gunakan `json-file` logging driver
- Set max-size dan max-file untuk rotasi log
- Centralize logs dengan Loki atau ELK stack (opsional)

### Backup

- Backup database secara berkala
- Test restore procedure
- Simpan backup di luar server (offsite)

---

Dibuat: 22 Agustus 2026
Server: rafi-server (Ubuntu 26.04 LTS)
