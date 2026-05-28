# Dispatch App

Aplicație web pentru gestionarea curselor și șoferilor unei companii de dispatch.

Proiectul a fost realizat în cadrul practicii tehnologice de specialitate, anul III, grupa PAPP-231, Colegiul Universității Tehnice a Moldovei.

## Tehnologii

- Frontend: React + Vite + TailwindCSS
- Backend: NestJS + TypeORM
- Baza de date: MySQL (XAMPP)
- Autentificare: JWT + bcrypt

## Instalare

### Cerințe

- Node.js 18+
- XAMPP cu MySQL pornit
- Git

### Pași

1. Repository-ul se clonează:
```
git clone https://github.com/veveritadumitru07/dispatch-app.git
cd dispatch-app
```

2. Se creează baza de date în phpMyAdmin: `dispatch_db`

3. Backend:
```
cd backend
copy .env.example .env
npm install
npm run start:dev
```

Backend-ul pornește pe `http://localhost:3000/api`

4. Frontend (în alt terminal):
```
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend-ul pornește pe `http://localhost:5173`

5. (Opțional) Pentru date demo, se rulează `database/seed.sql` în phpMyAdmin.

## Funcționalități

- Autentificare și înregistrare cu JWT
- Gestionare curse (Loads) prin operații CRUD
- Gestionare șoferi (Drivers) cu status automat
- Gestionare brokeri (Brokers)
- Dashboard cu indicatori KPI
- Rapoarte cu grafice

## API

| Endpoint | Metodă |
|---|---|
| /api/auth/register | POST |
| /api/auth/login | POST |
| /api/loads | GET, POST |
| /api/loads/:id | GET, PUT, DELETE |
| /api/drivers | GET, POST |
| /api/drivers/:id | GET, PUT, DELETE |
| /api/brokers | GET, POST |
| /api/brokers/:id | GET, PUT, DELETE |
| /api/reports/summary | GET |

Toate endpoint-urile, cu excepția celor de tip `/auth/*`, necesită header-ul `Authorization: Bearer <token>`.

## Structură

```
dispatch-app/
├── backend/      # NestJS API
├── frontend/     # React app
├── database/     # Scripturi SQL
└── screenshots/  # Capturi din aplicație
```

## Despre proiect

Proiectul a fost dezvoltat de Veverita Dumitru, Iutis Pavel, Frumusache Vlad, Poparcea Nicolae în cadrul stagiului de practică desfășurat la S.R.L. „A8I Dispatch" (Chișinău), o companie care oferă servicii de dispatching pentru transportatori de marfă din Statele Unite ale Americii.

Aplicația răspunde unei nevoi reale a companiei: centralizarea informațiilor despre curse, șoferi și brokeri într-un singur sistem, cu automatizarea calculelor de comisioane și RPM, precum și generarea de rapoarte cu vizualizări grafice.
