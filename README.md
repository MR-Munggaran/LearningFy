# Learningfy - E-Learning Platform

Platform e-learning full-stack dengan sistem manajemen kursus, role-based access (Admin, Instructor, Student), integrasi pembayaran Midtrans, dan tracking progres belajar.

---

## Fitur Utama

- **Autentikasi & Otorisasi** — JWT dengan HTTP-only cookies, 3 role (admin, instructor, student)
- **Manajemen Kursus** — CRUD kursus, modul, dan lesson
- **Kategori & Tags** — Pengelompokan konten
- **Enrollment & Progres** — Siswa dapat mendaftar kursus dan melacak progres belajar
- **Pembayaran** — Integrasi Midtrans untuk transaksi
- **Review & Rating** — Ulasan untuk setiap kursus
- **Rich Text Editor** — Quill & CKEditor 5 untuk konten lesson
- **File Upload** — Gambar dan dokumen PDF
- **Animasi UI** — Framer Motion, GSAP, Swiper

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
| React Hot Toast | Notifikasi |
| React Icons | Icon set |

---

## Struktur Folder

```
Learningfy/
├── backend/
│   ├── config/            # Koneksi DB & env vars
│   ├── controllers/       # Business logic (auth, course, dll)
│   ├── middlewares/       # JWT protect & authorization
│   ├── models/            # Query database (raw SQL)
│   ├── routes/            # Route definitions
│   ├── utils/             # JWT helper, Multer config
│   └── index.js           # Entry point
├── frontend/
│   ├── public/            # Assets statis
│   ├── src/
│   │   ├── assets/        # Gambar & icon
│   │   ├── components/    # Komponen reusable
│   │   ├── context/       # AuthContext
│   │   ├── hooks/         # Custom hooks (data fetching)
│   │   ├── pages/         # Halaman & dashboard
│   │   ├── App.jsx        # Routing utama
│   │   └── main.jsx       # Entry point React
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Environment Variables

Buat file `.env` di folder `backend/` berdasarkan `.env.example`:

```
PG_URI=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

---

## Cara Menjalankan

### Prasyarat
- Node.js >= 18
- PostgreSQL

### Backend
```bash
cd backend
npm install
npm start
```
Server berjalan di `http://localhost:3000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi berjalan di `http://localhost:5173` (proxy API ke backend)

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