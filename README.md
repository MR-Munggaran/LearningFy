# Learningfy - E-Learning Platform

Platform e-learning full-stack dengan sistem manajemen kursus, role-based access (Admin, Instructor, Student), integrasi pembayaran Midtrans, dan tracking progres belajar. Siap deploy dengan Docker.

---

## Fitur Utama

- **Autentikasi & Otorisasi** — JWT dengan HTTP-only cookies, 3 role (admin, instructor, student)
- **Manajemen Kursus** — CRUD kursus, modul, dan lesson
- **Kategori & Tags** — Pengelompokan konten
- **Enrollment & Progres** — Siswa dapat mendaftar kursus dan melacak progres belajar
- **Pembayaran** — Integrasi Midtrans (Snap) untuk transaksi
- **Review & Rating** — Ulasan untuk setiap kursus
- **Rich Text Editor** — Quill, CKEditor 5 & Trix untuk konten lesson
- **File Upload** — Gambar dan dokumen PDF
- **Animasi UI** — Framer Motion, GSAP, Swiper, OGL

---

## Tech Stack

### Backend
| Teknologi | Keterangan |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| PostgreSQL | Database |
| `pg` | Database driver |
| JWT (`jsonwebtoken`) | Autentikasi |
| `bcryptjs` | Hashing password |
| `midtrans-client` | Payment gateway |
| `multer` | File upload |
| `cookie-parser` | Parsing cookie JWT |
| `cors` | Whitelist origin via `CLIENT_ORIGIN` |
| `dotenv` | Environment variables |
| `uuid` | Generate ID order Midtrans |

### Frontend
| Teknologi | Keterangan |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool |
| Tailwind CSS v4 | Styling |
| React Router 7 | Routing |
| Axios | HTTP client |
| Framer Motion | Animasi |
| GSAP | Animasi lanjutan |
| Swiper | Carousel/slider |
| Quill / CKEditor 5 / Trix | Rich text editor |
| React Hot Toast | Notifikasi |
| React Icons | Icon set |

---

## Struktur Folder

```
LearningFy/
├── backend/
│   ├── config/            # Koneksi DB & env vars
│   ├── controllers/       # Business logic (auth, course, dll)
│   ├── db/                # schema.sql (DDL) & seed.js (data dummy)
│   ├── middlewares/       # JWT protect & authorization
│   ├── models/            # Query database (raw SQL)
│   ├── routes/            # Route definitions
│   ├── utils/             # JWT helper, Multer config, folder upload
│   ├── Dockerfile         # Image backend (Node alpine, non-root)
│   └── index.js           # Entry point
├── frontend/
│   ├── public/            # Assets statis
│   ├── src/
│   │   ├── components/    # Komponen reusable (+ Dashboard, Home, dll)
│   │   ├── context/       # AuthContext
│   │   ├── hooks/         # Custom hooks (data fetching per resource)
│   │   ├── pages/         # Halaman publik & dashboard
│   │   ├── App.jsx        # Routing utama
│   │   └── main.jsx       # Entry point React
│   ├── Dockerfile         # Multi-stage: build Vite → Nginx
│   ├── nginx.conf         # SPA fallback + proxy /api & /uploads
│   └── vite.config.js     # Proxy dev ke backend
├── .env.example           # Template env production (root, dipakai compose)
├── docker-compose.yml     # Orkestrasi frontend + backend
├── DEPLOY.MD              # Panduan deploy Docker
└── README.md
```

---

## Environment Variables

Salin `.env.example` sesuai mode yang dipakai:

- **Lokal (dev)**: salin `backend/.env.example` menjadi `backend/.env`
- **Docker (produksi)**: salin `.env.example` di root menjadi `.env`

```
PG_URI=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
CLIENT_ORIGIN=http://localhost:5173
```

> `PORT` kosong akan fallback ke `5000`. `CLIENT_ORIGIN` menerima beberapa origin sekaligus, pisahkan dengan koma.

---

## Cara Menjalankan

### Prasyarat
- Node.js >= 18
- PostgreSQL

### Backend
```bash
cd backend
npm install
npm run seed    # opsional: terapkan schema.sql + data dummy demo
npm start       # nodemon
```
Server berjalan di `http://localhost:3000` (sesuaikan `PORT` di `.env`).

Akun demo hasil seed:
| Role | Email | Password |
|---|---|---|
| Admin | admin@learningfy.id | admin123 |
| Instructor | budi@learningfy.id | instructor123 |

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi berjalan di `http://localhost:5173` (proxy `/api` & `/uploads` ke backend via Vite).

---

## Deploy dengan Docker

```bash
cp .env.example .env   # isi kredensial produksi
docker compose up -d --build
```

- Frontend (Nginx): `http://localhost:3010` — reverse proxy `/api` & `/uploads` ke backend, satu origin sehingga bebas masalah CORS
- Backend: `http://localhost:4000`
- Upload user tersimpan di volume `learningfy_uploads`

Panduan lengkap ada di [`DEPLOY.MD`](./DEPLOY.MD).

---

## API Endpoints

| Prefix | Resource |
|---|---|
| `/api/v1/auth` | Registrasi, login, logout, profil |
| `/api/v1/category` | CRUD kategori |
| `/api/v1/course` | CRUD kursus |
| `/api/v1/module` | CRUD modul |
| `/api/v1/lesson` | CRUD lesson |
| `/api/v1/enrollment` | Manajemen pendaftaran |
| `/api/v1/payment` | Pembayaran Midtrans |
| `/api/v1/progress` | Tracking progres siswa |
| `/api/v1/review` | Review & rating kursus |
| `/uploads` | Static file (gambar & dokumen) |

---

## Role & Hak Akses

- **Admin** — Manajemen user, kategori, tags
- **Instructor** — Membuat & mengelola kursus, modul, lesson
- **Student** — Melihat kursus, enroll, belajar, review
