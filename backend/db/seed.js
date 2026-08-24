import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcryptjs from "bcryptjs";
import pool from "../config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hash = (plain) => bcryptjs.hashSync(plain, bcryptjs.genSaltSync(10));

const insert = async (sql, values) => {
  const res = await pool.query(sql + " RETURNING id", values);
  return res.rows[0].id;
};

async function seed() {
  console.log("Menerapkan schema...");
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);

  console.log("Membersihkan data lama...");
  await pool.query(`TRUNCATE TABLE
    progress, reviews, payments, enrollments,
    lessons, modules, course_tags, courses,
    tags, categories, users
    RESTART IDENTITY CASCADE`);

  // ===== Users =====
  console.log("Seed users...");
  const adminId = await insert(
    `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)`,
    ["Admin Learningfy", "admin@learningfy.id", hash("admin123"), "admin"]
  );
  const budiId = await insert(
    `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)`,
    ["Budi Santoso", "budi@learningfy.id", hash("instructor123"), "instructor"]
  );
  const sariId = await insert(
    `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)`,
    ["Sari Rahma", "sari@learningfy.id", hash("instructor123"), "instructor"]
  );
  const andiId = await insert(
    `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)`,
    ["Andi Pratama", "andi@mail.com", hash("student123"), "student"]
  );
  const rinaId = await insert(
    `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)`,
    ["Rina Melati", "rina@mail.com", hash("student123"), "student"]
  );
  const dimasId = await insert(
    `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)`,
    ["Dimas Anggara", "dimas@mail.com", hash("student123"), "student"]
  );

  // ===== Categories =====
  console.log("Seed categories...");
  const catWeb = await insert(
    `INSERT INTO categories (name, description) VALUES ($1,$2)`,
    ["Web Development", "Pengembangan website front-end dan back-end"]
  );
  const catData = await insert(
    `INSERT INTO categories (name, description) VALUES ($1,$2)`,
    ["Data Science", "Analisis data, machine learning, dan visualisasi"]
  );
  const catDesign = await insert(
    `INSERT INTO categories (name, description) VALUES ($1,$2)`,
    ["UI/UX Design", "Desain antarmuka dan pengalaman pengguna"]
  );
  const catMarketing = await insert(
    `INSERT INTO categories (name, description) VALUES ($1,$2)`,
    ["Digital Marketing", "SEO, iklan digital, dan content marketing"]
  );

  // ===== Tags =====
  console.log("Seed tags...");
  const tagNames = [
    "HTML/CSS", "JavaScript", "React", "TailwindCSS", "Node.js",
    "Express", "PostgreSQL", "Python", "Machine Learning", "Figma",
    "Prototyping", "SEO", "Content Marketing",
  ];
  const tagIds = {};
  for (const name of tagNames) {
    tagIds[name] = await insert(`INSERT INTO tags (name) VALUES ($1)`, [name]);
  }

  // ===== Courses =====
  console.log("Seed courses...");
  const courses = [
    {
      key: "webdasar",
      title: "Belajar Web Development dari Nol",
      description:
        "<p>Kelas pemula untuk menguasai dasar web development. Kamu akan belajar <strong>HTML</strong>, <strong>CSS</strong>, dan <strong>JavaScript</strong> dari awal hingga bisa membangun website statis pertamamu.</p><ul><li>Tidak perlu pengalaman coding</li><li>Lebih dari 20 studi kasus</li><li>Sertifikat penyelesaian</li></ul>",
      category_id: catWeb,
      instructor_id: budiId,
      price: 0,
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80&auto=format&fit=crop",
      tags: ["HTML/CSS", "JavaScript"],
      modules: [
        {
          title: "Pengenalan HTML",
          description: "Struktur dasar dokumen HTML dan elemen penting",
          lessons: [
            {
              title: "Apa itu HTML?",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
            },
            {
              title: "Struktur Dasar Dokumen HTML",
              content_type: "text",
              content:
                "<h3>Struktur Dasar HTML</h3><p>Setiap dokumen HTML memiliki struktur dasar yang terdiri dari <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, dan <code>&lt;body&gt;</code>.</p><pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;&lt;title&gt;Halo&lt;/title&gt;&lt;/head&gt;\n  &lt;body&gt;&lt;h1&gt;Hello World!&lt;/h1&gt;&lt;/body&gt;\n&lt;/html&gt;</code></pre><p>Elemen <code>&lt;head&gt;</code> berisi metadata, sedangkan <code>&lt;body&gt;</code> berisi konten yang tampil di browser.</p>",
            },
            {
              title: "Ringkasan Elemen HTML (PDF)",
              content_type: "pdf",
              resource_url: "https://pdfobject.com/pdf/sample.pdf",
            },
          ],
        },
        {
          title: "Dasar CSS",
          description: "Styling, box model, dan layouting pertamamu",
          lessons: [
            {
              title: "Selector & Box Model",
              content_type: "text",
              content:
                "<h3>Selector CSS</h3><p>Selector digunakan untuk memilih elemen yang akan diberi style: selector tag (<code>p</code>), class (<code>.card</code>), dan id (<code>#header</code>).</p><p>Box model terdiri dari <strong>margin, border, padding,</strong> dan <strong>content</strong>.</p>",
            },
            {
              title: "Flexbox dalam 15 Menit",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
            },
          ],
        },
      ],
    },
    {
      key: "react",
      title: "Mastering React & Tailwind CSS",
      description:
        "<p>Bangun aplikasi modern dengan <strong>React 19</strong> dan <strong>Tailwind CSS v4</strong>. Mulai dari component, hooks, state management, sampai deploy ke production.</p><ul><li>Project: dashboard e-learning mini</li><li>Best practice folder structure</li></ul>",
      category_id: catWeb,
      instructor_id: budiId,
      price: 249000,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80&auto=format&fit=crop",
      tags: ["React", "TailwindCSS", "JavaScript"],
      modules: [
        {
          title: "Fundamental React",
          description: "Component, JSX, props, dan state",
          lessons: [
            {
              title: "Thinking in Components",
              content_type: "text",
              content:
                "<h3>Component-Based UI</h3><p>React memecah UI menjadi komponen kecil yang reusable. Setiap komponen adalah fungsi JavaScript yang mengembalikan JSX.</p><pre><code>function Card({ title }) {\n  return &lt;div className=&quot;card&quot;&gt;{title}&lt;/div&gt;;\n}</code></pre>",
            },
            {
              title: "React Crash Course",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
            },
          ],
        },
        {
          title: "Hooks & Tailwind CSS",
          description: "useState, useEffect, dan utility-first styling",
          lessons: [
            {
              title: "useEffect & Data Fetching",
              content_type: "text",
              content:
                "<h3>Data Fetching dengan useEffect</h3><p>Gunakan <code>useEffect</code> untuk side effect seperti fetch data dari API. Jangan lupa dependency array agar tidak infinite loop.</p>",
            },
            {
              title: "Utility-First CSS dengan Tailwind",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=ft30zcMlFao",
            },
          ],
        },
      ],
    },
    {
      key: "nodeapi",
      title: "Node.js REST API dari Dasar hingga Deploy",
      description:
        "<p>Pelajari cara membangun REST API yang production-ready menggunakan <strong>Node.js</strong>, <strong>Express</strong>, dan <strong>PostgreSQL</strong>: autentikasi JWT, upload file, hingga deployment dengan Docker.</p>",
      category_id: catWeb,
      instructor_id: sariId,
      price: 299000,
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop",
      tags: ["Node.js", "Express", "PostgreSQL"],
      modules: [
        {
          title: "Intro Node.js & Express",
          description: "Setup project dan routing dasar",
          lessons: [
            {
              title: "Hello Express",
              content_type: "text",
              content:
                "<h3>Server Pertamamu</h3><p>Express adalah framework minimalis untuk Node.js. Cukup beberapa baris untuk menjalankan HTTP server:</p><pre><code>const app = express();\napp.get('/', (req, res) =&gt; res.send('Hello'));\napp.listen(3000);</code></pre>",
            },
          ],
        },
        {
          title: "Autentikasi & Database",
          description: "JWT, bcrypt, dan PostgreSQL",
          lessons: [
            {
              title: "Node.js Full Course",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=f2EqECiTBL8",
            },
            {
              title: "Hashing Password dengan bcrypt",
              content_type: "text",
              content:
                "<p>Jangan pernah simpan password asli di database! Gunakan <strong>bcrypt</strong> untuk hashing: <code>bcrypt.hash(password, 10)</code> saat register dan <code>bcrypt.compare()</code> saat login.</p>",
            },
            {
              title: "Checklist API Production (PDF)",
              content_type: "pdf",
              resource_url: "https://pdfobject.com/pdf/sample.pdf",
            },
          ],
        },
      ],
    },
    {
      key: "python",
      title: "Python untuk Data Science",
      description:
        "<p>Kuasai <strong>Python</strong> untuk analisis data: NumPy, Pandas, Matplotlib, hingga dasar <strong>machine learning</strong> dengan scikit-learn.</p>",
      category_id: catData,
      instructor_id: sariId,
      price: 349000,
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop",
      tags: ["Python", "Machine Learning"],
      modules: [
        {
          title: "Python Fundamental",
          description: "Syntax, tipe data, dan fungsi",
          lessons: [
            {
              title: "Python untuk Pemula",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            },
            {
              title: "List, Dict & Comprehension",
              content_type: "text",
              content:
                "<h3>Struktur Data Python</h3><p><code>list</code> untuk koleksi terurut, <code>dict</code> untuk key-value. List comprehension membuat kode lebih ringkas:</p><pre><code>kuartadrat = [x**2 for x in range(10)]</code></pre>",
            },
          ],
        },
        {
          title: "Analisis Data dengan Pandas",
          description: "DataFrame, cleaning, dan visualisasi",
          lessons: [
            {
              title: "Pengenalan Pandas DataFrame",
              content_type: "text",
              content:
                "<p><strong>Pandas</strong> adalah library utama untuk manipulasi data tabular. Fungsi paling sering dipakai: <code>read_csv()</code>, <code>groupby()</code>, <code>merge()</code>, dan <code>describe()</code>.</p>",
            },
          ],
        },
      ],
    },
    {
      key: "figma",
      title: "Figma untuk UI/UX Designer",
      description:
        "<p>Dari wireframe hingga high-fidelity prototype dengan <strong>Figma</strong>. Cocok untuk kamu yang ingin mulai karier sebagai UI/UX designer.</p>",
      category_id: catDesign,
      instructor_id: budiId,
      price: 199000,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&auto=format&fit=crop",
      tags: ["Figma", "Prototyping"],
      modules: [
        {
          title: "Mengenal Figma",
          description: "Interface, frame, dan auto layout",
          lessons: [
            {
              title: "Figma Tutorial Lengkap",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc",
            },
            {
              title: "Auto Layout vs Constraint",
              content_type: "text",
              content:
                "<p><strong>Auto Layout</strong> membuat frame adaptif terhadap konten — konsepnya mirip flexbox di CSS. Gunakan auto layout untuk komponen yang kontennya dinamis seperti tombol dan kartu produk.</p>",
            },
          ],
        },
      ],
    },
    {
      key: "seo",
      title: "SEO & Content Marketing",
      description:
        "<p>Strategi meningkatkan trafik organik: riset keyword, on-page SEO, technical SEO, sampai strategi konten yang konsisten.</p>",
      category_id: catMarketing,
      instructor_id: sariId,
      price: 149000,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
      tags: ["SEO", "Content Marketing"],
      modules: [
        {
          title: "Dasar-Dasar SEO",
          description: "Keyword research dan on-page optimization",
          lessons: [
            {
              title: "SEO Course untuk Pemula",
              content_type: "video",
              resource_url: "https://www.youtube.com/watch?v=xsSTXO6ISzM",
            },
            {
              title: "Riset Keyword Gratis",
              content_type: "text",
              content:
                "<h3>Cara Riset Keyword</h3><ol><li>Brainstorm topik utama bisnismu</li><li>Gunakan Google Keyword Planner / Ubersuggest</li><li>Pilih keyword dengan volume tinggi & kompetisi rendah</li><li>Prioritaskan long-tail keyword</li></ol>",
            },
          ],
        },
      ],
    },
  ];

  const courseIds = {};
  for (const c of courses) {
    const id = await insert(
      `INSERT INTO courses (title, description, category_id, instructor_id, price, image)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [c.title, c.description, c.category_id, c.instructor_id, c.price, c.image]
    );
    courseIds[c.key] = id;

    for (const tagName of c.tags) {
      await pool.query(
        `INSERT INTO course_tags (course_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [id, tagIds[tagName]]
      );
    }

    let modulePos = 1;
    for (const m of c.modules) {
      const moduleId = await insert(
        `INSERT INTO modules (course_id, title, description, position) VALUES ($1,$2,$3,$4)`,
        [id, m.title, m.description, modulePos++]
      );
      let lessonPos = 1;
      for (const l of m.lessons) {
        await pool.query(
          `INSERT INTO lessons (module_id, title, content, content_type, resource_url, position)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            moduleId,
            l.title,
            l.content ?? null,
            l.content_type,
            l.resource_url ?? null,
            lessonPos++,
          ]
        );
      }
    }
  }

  // ===== Enrollments & Payments =====
  console.log("Seed enrollments & payments...");
  const enrollments = [
    { user: andiId, course: courseIds.webdasar, status: "active" },   // gratis -> langsung aktif
    { user: andiId, course: courseIds.react,    status: "active" },   // sudah bayar
    { user: andiId, course: courseIds.nodeapi,  status: "pending" },  // belum bayar
    { user: rinaId, course: courseIds.webdasar, status: "active" },
    { user: rinaId, course: courseIds.figma,    status: "active" },
    { user: dimasId, course: courseIds.python,  status: "active" },
    { user: dimasId, course: courseIds.seo,     status: "pending" },
  ];
  const enrollmentIds = {};
  for (const e of enrollments) {
    const key = `${e.user}-${e.course}`;
    enrollmentIds[key] = await insert(
      `INSERT INTO enrollments (user_id, course_id, status) VALUES ($1,$2,$3)`,
      [e.user, e.course, e.status]
    );
  }

  const priceOf = Object.fromEntries(courses.map((c) => [courseIds[c.key], c.price]));
  await pool.query(
    `INSERT INTO payments (enrollment_id, order_id, amount, status, payment_type, transaction_time)
     VALUES ($1,$2,$3,$4,$5,NOW())`,
    [
      enrollmentIds[`${andiId}-${courseIds.react}`],
      "ORDER-SEED-REACT-001",
      priceOf[courseIds.react],
      "success",
      "qris",
    ]
  );
  await pool.query(
    `INSERT INTO payments (enrollment_id, order_id, amount, status, payment_type, transaction_time)
     VALUES ($1,$2,$3,$4,$5,NOW())`,
    [
      enrollmentIds[`${rinaId}-${courseIds.figma}`],
      "ORDER-SEED-FIGMA-002",
      priceOf[courseIds.figma],
      "success",
      "bank_transfer",
    ]
  );
  await pool.query(
    `INSERT INTO payments (enrollment_id, order_id, amount, status)
     VALUES ($1,$2,$3,'pending')`,
    [
      enrollmentIds[`${andiId}-${courseIds.nodeapi}`],
      "ORDER-SEED-NODE-003",
      priceOf[courseIds.nodeapi],
    ]
  );

  // ===== Reviews =====
  console.log("Seed reviews...");
  const reviews = [
    [andiId, courseIds.webdasar, 5, "Materinya runtut dan mudah diikuti buat pemula. Recommended!"],
    [rinaId, courseIds.webdasar, 4, "Penjelasan bagus, tapi pengen ada latihan tambahan."],
    [andiId, courseIds.react, 5, "Project-nya relevan dengan dunia kerja. Mantap!"],
    [rinaId, courseIds.figma, 5, "Akhirnya bisa bikin prototype sendiri, thanks bang Budi!"],
    [dimasId, courseIds.python, 4, "Materi padat, video pendukung membantu sekali."],
  ];
  for (const [userId, courseId, rating, comment] of reviews) {
    await pool.query(
      `INSERT INTO reviews (user_id, course_id, rating, comment) VALUES ($1,$2,$3,$4)`,
      [userId, courseId, rating, comment]
    );
  }

  // ===== Progress =====
  console.log("Seed progress...");
  const applyProgress = async (enrollmentId, moduleIndex, status) => {
    const mods = await pool.query(
      `SELECT id FROM modules WHERE course_id = (SELECT course_id FROM enrollments WHERE id = $1)
       ORDER BY position ASC OFFSET $2 LIMIT 1`,
      [enrollmentId, moduleIndex]
    );
    if (mods.rowCount === 0) return;
    await pool.query(
      `INSERT INTO progress (enrollment_id, module_id, status, completed_at)
       VALUES ($1,$2,$3, CASE WHEN $3 = 'completed' THEN NOW() ELSE NULL END)
       ON CONFLICT DO NOTHING`,
      [enrollmentId, mods.rows[0].id, status]
    );
  };

  // Andi menyelesaikan modul 1 & 2, lanjut modul 3 pada kursus web dasar
  const andiEnroll = enrollmentIds[`${andiId}-${courseIds.webdasar}`];
  await applyProgress(andiEnroll, 0, "completed");
  await applyProgress(andiEnroll, 1, "completed");
  await applyProgress(andiEnroll, 2, "in_progress");
  // Andi mulai kursus React
  const andiReactEnroll = enrollmentIds[`${andiId}-${courseIds.react}`];
  await applyProgress(andiReactEnroll, 0, "completed");
  await applyProgress(andiReactEnroll, 1, "in_progress");

  // ===== Ringkasan =====
  const counts = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM categories) AS categories,
      (SELECT COUNT(*) FROM tags) AS tags,
      (SELECT COUNT(*) FROM courses) AS courses,
      (SELECT COUNT(*) FROM modules) AS modules,
      (SELECT COUNT(*) FROM lessons) AS lessons,
      (SELECT COUNT(*) FROM enrollments) AS enrollments,
      (SELECT COUNT(*) FROM payments) AS payments,
      (SELECT COUNT(*) FROM reviews) AS reviews,
      (SELECT COUNT(*) FROM progress) AS progress
  `);
  console.log("\nSeeding selesai!");
  console.table(counts.rows[0]);
  console.log("\nAkun demo:");
  console.log("  Admin      : admin@learningfy.id / admin123");
  console.log("  Instructor : budi@learningfy.id / instructor123");
  console.log("               sari@learningfy.id / instructor123");
  console.log("  Student    : andi@mail.com / student123");
  console.log("               rina@mail.com / student123");
  console.log("               dimas@mail.com / student123");
}

seed()
  .catch((err) => {
    console.error("Seed gagal:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
