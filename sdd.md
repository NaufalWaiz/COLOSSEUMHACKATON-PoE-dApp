# TECH SPECIFICATION DOCUMENT

## Proof of Effort (PoE) — Web3 Reputation System

---

## 1. Overview

### 1.1 Background

Sistem penilaian individu saat ini seperti CV, sertifikat, dan portofolio berfokus pada hasil akhir, bukan proses. Hal ini menyebabkan beberapa permasalahan utama, seperti mudah dimanipulasi, tidak mencerminkan usaha sebenarnya, serta bergantung pada pihak terpusat sebagai validator.

### 1.2 Objective

Tujuan dari sistem ini adalah membangun sebuah platform yang mampu merekam aktivitas dan usaha pengguna, menghitung skor effort secara objektif, serta menyimpan bukti aktivitas secara transparan dan dapat diverifikasi secara publik melalui blockchain.

---

## 2. Scope

### 2.1 In Scope (MVP Hackathon)

* Autentikasi berbasis wallet
* Submit aktivitas (effort)
* Perhitungan skor effort
* Penyimpanan hash dan skor ke blockchain
* Halaman profil pengguna

### 2.2 Out of Scope

* AI validation kompleks
* Mobile application
* Sistem governance DAO
* Anti-cheat tingkat lanjut

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
Frontend (Next.js)
   ↓
API Layer (Next.js API Routes)
   ↓
Database (PostgreSQL / Supabase)
   ↓
Storage (IPFS)
   ↓
Blockchain (Solana Program)
```

### 3.2 Component Description

Frontend dibangun menggunakan Next.js yang bertanggung jawab untuk menampilkan antarmuka pengguna seperti dashboard, form input aktivitas, dan visualisasi data.

API Layer menggunakan Next.js API Routes yang berfungsi sebagai penghubung antara frontend, database, dan blockchain. Layer ini juga bertanggung jawab untuk menghitung skor effort.

Database digunakan untuk menyimpan data aktivitas mentah, histori pengguna, serta data analitik yang tidak disimpan di blockchain.

Storage menggunakan IPFS untuk menyimpan bukti aktivitas seperti file, gambar, atau video agar tetap terdesentralisasi.

Blockchain digunakan untuk menyimpan hash aktivitas dan skor effort agar bersifat immutable dan dapat diverifikasi.

---

## 4. Tech Stack

Frontend menggunakan Next.js (App Router), Tailwind CSS untuk styling, shadcn/ui untuk komponen UI, dan Zustand untuk state management.

Backend menggunakan Next.js API Routes untuk menangani request dan business logic.

Blockchain menggunakan Solana dengan bantuan Anchor Framework serta library @solana/web3.js untuk interaksi.

Database menggunakan PostgreSQL atau Supabase sebagai managed service.

Storage menggunakan IPFS melalui layanan seperti Pinata atau Web3.storage.

---

## 5. Authentication

Autentikasi dilakukan menggunakan wallet (misalnya Phantom).

Alur autentikasi:

1. User menghubungkan wallet ke aplikasi
2. User menandatangani pesan (sign message)
3. Backend memverifikasi signature tersebut
4. Session pengguna dibuat

---

## 6. Core Features

### 6.1 Submit Effort

Input aktivitas dikirim dalam bentuk berikut:

```json
{
  "activity_type": "coding",
  "duration": 120,
  "description": "Build API endpoint",
  "proof_file": "ipfs_hash"
}
```

Proses yang terjadi:

1. Validasi input dilakukan di server
2. File bukti diunggah ke IPFS
3. Sistem menghasilkan hash aktivitas
4. Skor effort dihitung
5. Data disimpan ke database
6. Hash dan skor dikirim ke blockchain

---

### 6.2 Effort Scoring Engine

Sistem menggunakan pendekatan rule-based untuk MVP dengan pembobotan aktivitas sebagai berikut:

| Activity Type | Weight |
| ------------- | ------ |
| Coding        | 1.0    |
| Learning      | 0.7    |
| Watching      | 0.4    |

Formula perhitungan:

```
Effort Score = Duration × Activity Weight × Consistency Multiplier
```

---

### 6.3 Blockchain Recording

Data yang disimpan di blockchain:

```json
{
  "user_wallet": "address",
  "effort_hash": "hash",
  "score": 85,
  "timestamp": 171000000
}
```

---

### 6.4 User Profile

Halaman profil pengguna menampilkan total skor effort, riwayat aktivitas, breakdown skill berdasarkan aktivitas, serta konsistensi atau streak pengguna.

---

### 6.5 Leaderboard (Optional)

Leaderboard menampilkan ranking pengguna berdasarkan skor effort, dengan opsi filter harian atau mingguan.

---

## 7. Database Design

Tabel users digunakan untuk menyimpan informasi wallet pengguna:

```sql
users (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE,
  created_at TIMESTAMP
)
```

Tabel activities digunakan untuk menyimpan aktivitas pengguna:

```sql
activities (
  id SERIAL PRIMARY KEY,
  user_id INT,
  activity_type TEXT,
  duration INT,
  description TEXT,
  proof_ipfs TEXT,
  score INT,
  created_at TIMESTAMP
)
```

Tabel scores digunakan untuk menyimpan total skor:

```sql
scores (
  id SERIAL PRIMARY KEY,
  user_id INT,
  total_score INT,
  updated_at TIMESTAMP
)
```

---

## 8. Smart Contract Design

Fungsi utama pada program:

```rust
pub fn submit_effort(
    ctx: Context<SubmitEffort>,
    effort_hash: String,
    score: u64
)
```

Struktur akun:

```rust
pub struct EffortRecord {
    pub user: Pubkey,
    pub effort_hash: String,
    pub score: u64,
    pub timestamp: i64,
}
```

---

## 9. API Design

Endpoint utama yang disediakan:

* POST /api/effort untuk mengirim data effort
* GET /api/profile untuk mengambil data profil pengguna
* GET /api/leaderboard untuk mengambil data ranking

---

## 10. Validation and Anti-Cheat

Validasi dasar meliputi:

* Minimum durasi aktivitas
* Deteksi duplikasi data
* Validasi input sederhana

Pengembangan lanjutan dapat mencakup:

* Analisis pola aktivitas pengguna
* Deteksi perilaku tidak wajar
* Integrasi dengan sistem AI

---

## 11. UI/UX Design

Halaman utama dalam sistem meliputi landing page, dashboard, halaman submit effort, dan halaman profil.

Komponen utama meliputi progress bar, grafik aktivitas, dan activity feed untuk menampilkan histori pengguna.

---

## 12. Deployment

Frontend dan backend dapat di-deploy menggunakan Vercel.

Blockchain menggunakan Solana Devnet untuk tahap pengembangan.

Database menggunakan Supabase sebagai managed PostgreSQL.

Storage menggunakan IPFS.

---

## 13. Future Enhancements

Pengembangan selanjutnya dapat mencakup sistem AI validation, NFT berbasis effort, skill graph, serta integrasi dengan platform eksternal.

---

## 14. MVP Checklist

* Wallet connection
* Submit effort
* Perhitungan skor
* Penyimpanan ke blockchain
* Halaman profil