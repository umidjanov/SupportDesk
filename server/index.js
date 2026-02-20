import http from 'http'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Server as SocketIOServer } from 'socket.io'
import { DataStore } from './lib/data-store.js'
import { Auth } from './lib/auth.js'

dotenv.config()

const PORT = process.env.PORT || 5050
const ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',')

async function bootstrap() {
  const app = express()
  app.use(cors({ origin: ORIGINS, credentials: true }))
  app.use(express.json())

  const server = http.createServer(app)
  const io = new SocketIOServer(server, {
    cors: { origin: ORIGINS, methods: ['GET', 'POST'] },
  })

  // Initialize auth and data
  const auth = new Auth()
  const store = new DataStore()
  await store.loadFromExcel(process.env.EXCEL_PATH || './data/.xlsx')

  // Health
  app.get('/health', (_req, res) => res.json({ ok: true, records: store.size }))

  // Example protected write (Kurator only)
  app.post('/records', auth.requireKurator, (req, res) => {
    try {
      const rec = store.addRecord(req.body)
      io.emit('records_updated', { type: 'add', record: rec })
      res.status(201).json(rec)
    } catch (e) {
      res.status(400).json({ error: e.message })
    }
  })

  app.put('/records/:id', auth.requireKurator, (req, res) => {
    try {
      const rec = store.updateRecord(req.params.id, req.body)
      io.emit('records_updated', { type: 'update', record: rec })
      res.json(rec)
    } catch (e) {
      res.status(400).json({ error: e.message })
    }
  })

  // Socket channels
  io.on('connection', (socket) => {
    // search_student: payload { name: string }
    socket.on('search_student', ({ name }) => {
      const q = (name || '').trim()
      if (!q) return socket.emit('search_result', { query: q, results: [] })
      const results = store.searchByStudentOrMentorOrGroup(q)
      socket.emit('search_result', { query: q, results })
    })

    // optional: live subscribe to updates
    socket.on('subscribe_records', () => {
      socket.emit('records_snapshot', store.getAll())
    })
  })

  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}

bootstrap().catch((e) => {
  console.error('Fatal error during bootstrap:', e)
  process.exit(1)
})
