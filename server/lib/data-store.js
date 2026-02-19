import fs from 'fs/promises'
import path from 'path'
import XLSX from 'xlsx'

function normalizeHeader(h) {
  const map = {
    date: ['date', 'Дата', 'Date'],
    time: ['time', 'Время', 'Time'],
    mentor: ['mentor', 'Ментор', 'Mentor'],
    group: ['group', 'Группа', 'Group', 'Guruh', 'GURUH'],
    student: ['student', 'Студент', 'Student'],
    theme: ['theme', 'Тема', 'Theme'],
    status: ['status', 'Статус', 'Status', 'Place'],
  }
  const key = String(h || '').trim()
  for (const [norm, variants] of Object.entries(map)) {
    if (variants.some(v => v.toLowerCase() === key.toLowerCase())) return norm
  }
  return key.toLowerCase()
}

function normalizeRow(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    out[normalizeHeader(k)] = typeof v === 'string' ? v.trim() : v
  }
  return out
}

export class DataStore {
  constructor() {
    this.records = []
    this.nextId = 1
  }

  get size() { return this.records.length }
  getAll() { return [...this.records] }

  async loadFromExcel(excelPath) {
    const full = path.resolve(process.cwd(), 'server', excelPath.startsWith('.') ? excelPath : `./${excelPath}`)
    const buf = await fs.readFile(full)
    const wb = XLSX.read(buf, { type: 'buffer' })

    const all = []
    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
      for (const r of rows) {
        const n = normalizeRow(r)
        // keep only known keys; ignore empty student rows
        if (!n.student) continue
        all.push({
          id: String(this.nextId++),
          date: n.date || '',
          time: n.time || '',
          mentor: n.mentor || '',
          group: n.group || '',
          student: n.student || '',
          theme: n.theme || '',
          status: n.status || '',
        })
      }
    }
    this.records = all
    return this.records
  }

  searchByStudentOrMentorOrGroup(query) {
    const q = String(query || '').toLowerCase()
    const pick = (r) => ({
      id: r.id,
      student: r.student,
      mentor: r.mentor,
      group: r.group,
      status: r.status,
      date: r.date,
      time: r.time,
      theme: r.theme,
    })
    return this.records.filter(r =>
      r.student.toLowerCase().includes(q) ||
      r.mentor.toLowerCase().includes(q) ||
      r.group.toLowerCase().includes(q)
    ).map(pick).slice(0, 50)
  }

  addRecord(data) {
    const rec = {
      id: String(this.nextId++),
      date: data.date || '',
      time: data.time || '',
      mentor: data.mentor || '',
      group: data.group || '',
      student: data.student || '',
      theme: data.theme || '',
      status: data.status || '',
    }
    this.records.push(rec)
    return rec
  }

  updateRecord(id, patch) {
    const idx = this.records.findIndex(r => r.id === String(id))
    if (idx === -1) throw new Error('Record not found')
    this.records[idx] = { ...this.records[idx], ...patch }
    return this.records[idx]
  }
}
