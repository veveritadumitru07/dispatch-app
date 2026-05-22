# A8I Dispatch — TMS (Transport Management System)

> Aplicație web full-stack pentru gestionarea curselor, șoferilor și brokerilor pentru o companie de dispatching.
>
> Practica de specialitate tehnologică — **Veverița Dumitru & Frumusache Vlad & Iutis Pavel & Poparcea Nicolae, PAPP-231, anul III, CUTM 2026**

---

## 🛠 Stack tehnologic

| Componentă | Tehnologie |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | NestJS 10 (Node.js) + TypeORM |
| Bază de date | **MySQL** (via XAMPP) |
| Autentificare | JWT + bcrypt |
| Grafice | Recharts |

---

## ⚙️ Cerințe sistem

- **Node.js** 18+ — [descarcă](https://nodejs.org)
- **XAMPP** (include MySQL + phpMyAdmin) — [descarcă](https://www.apachefriends.org/)
- **Git** — [descarcă](https://git-scm.com/)

---

## 🚀 Instalare și rulare

### 1. Pornește XAMPP

1. Deschide **XAMPP Control Panel**
2. Click **Start** lângă **Apache**
3. Click **Start** lângă **MySQL**

Ambele trebuie să fie verzi.

### 2. Creează baza de date

1. În browser, mergi la **http://localhost/phpmyadmin**
2. Click **Databases** (sus)
3. La „Create database" scrie: `dispatch_db`
4. Collation: `utf8mb4_general_ci`
5. Click **Create**

### 3. Configurează backend-ul

Deschide Command Prompt și navighează în folderul backend:

```cmd
cd C:\Users\veved\Desktop\dispatch-app\backend
copy .env.example .env
npm install
```

Editează `.env` cu Notepad:
```cmd
notepad .env
```

Verifică că ai aceste valori (XAMPP default — `root` fără parolă):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=dispatch_db
```

Salvează și închide.

### 4. Pornește backend-ul

```cmd
npm run start:dev
```

TypeORM va crea automat tabelele. Vei vedea:
```
🚀 Backend running on http://localhost:3000/api
```

**Lasă terminalul deschis!**

### 5. (Opțional) Adaugă date de test

În phpMyAdmin:
1. Click pe `dispatch_db` (stânga)
2. Click pe tab-ul **SQL** (sus)
3. Deschide fișierul `database/seed.sql` din folderul proiectului, copiază tot conținutul
4. Lipește în phpMyAdmin
5. Click **Go**

### 6. Pornește frontend-ul

Deschide un al doilea Command Prompt:

```cmd
cd C:\Users\veved\Desktop\dispatch-app\frontend
copy .env.example .env
npm install
npm run dev
```

### 7. Deschide aplicația

Mergi în browser la: **http://localhost:5173**

Click pe „Înregistrează-te" și creează-ți un cont.

---

## 🔌 API Endpoints

Toate (exceptând `/auth/*`) necesită header `Authorization: Bearer <token>`.

| Endpoint | Method | Descriere |
|---|---|---|
| `/api/auth/register` | POST | Înregistrare |
| `/api/auth/login` | POST | Login → token JWT |
| `/api/loads` | GET, POST | Listă / creare cursă |
| `/api/loads/:id` | GET, PUT, DELETE | CRUD cursă |
| `/api/drivers` | GET, POST | Listă / creare șofer |
| `/api/drivers/:id` | GET, PUT, DELETE | CRUD șofer |
| `/api/brokers` | GET, POST | Listă / creare broker |
| `/api/brokers/:id` | GET, PUT, DELETE | CRUD broker |
| `/api/reports/summary` | GET | KPI globali |
| `/api/reports/loads-by-status` | GET | Curse pe status |
| `/api/reports/top-brokers` | GET | Top 5 brokeri |

---

## 🚨 Probleme frecvente

| Eroare | Soluție |
|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL nu pornit în XAMPP |
| `Access denied for user 'root'` | Ai parolă setată în MySQL — pune-o în `.env` |
| `Unknown database 'dispatch_db'` | N-ai creat baza în phpMyAdmin |
| `Port 3000 already in use` | Skype/altă aplicație folosește 3000 — schimbă `PORT` în `.env` |

---

## 👨‍🎓 Autori

Veverița Dumitru & Frumusache Vlad & Poparcea Nicolae & Iutis Pavel  — PAPP-231, anul III, CUTM 2026
Mentor companie: dl. Anton — S.R.L. „A8I Dispatch"
