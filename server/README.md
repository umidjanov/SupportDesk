SupportDesk Realtime Backend (server/)

Overview
- Express server with Socket.IO for realtime search bridging the SPA.
- Loads Excel (TA-otchet.xlsx) into memory and exposes:
  - Socket event: search_student -> search_result
  - HTTP: POST /records (curator only), PUT /records/:id (curator only)
- Bcrypt included for secure password hashing and example curator user.

Getting started
1) Place your Excel at server/data/TA-otchet.xlsx (create the data/ folder).
2) Install deps:
   - cd server && npm install
3) Run:
   - npm run dev
   - Server on http://localhost:5050
Configuration (optional .env)
- PORT=5050
- CORS_ORIGINS=http://localhost:5173
- EXCEL_PATH=./data/TA-otchet.xlsx
- API_KEY=your-shared-admin-key  # alternative to X-Role: curator header

Socket contracts
- Client -> server: search_student { name: string }
- Server -> client: search_result { query: string, results: Array<{student, mentor, group, status, date, time, theme, id}> }

HTTP contracts (Kurator only)
- Headers: X-Role: curator (and optionally X-Phone: 90-000-00-00) OR X-API-Key: <secret>
- POST /records { date, time, mentor, group, student, theme, status }
- PUT /records/:id { ...patch }
- Broadcasts records_updated with payload { type: 'add'|'update', record }

Notes on concurrency
- All data is in-memory; operations are synchronous and fast.
- Socket.IO is event-driven; multiple Support teachers can search concurrently.
- Updates from curator are broadcast to all subscribers to keep views fresh.

Frontend integration (without editing now)
- Add socket.io-client to the SPA and connect to ws://localhost:5050.
- Emit search_student when user types/selects student name.
- On search_result, call form.setValues({ mentor, group, status }) for the selected student.
