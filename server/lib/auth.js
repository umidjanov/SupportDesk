import bcrypt from 'bcrypt'

// Simple in-memory user store for server-side operations (expand as needed)
const users = [
  // password: 'Kurator123' (hashed)
  { id: 'curator', role: 'curator', phone: '90-000-00-00', passwordHash: '$2b$10$4wNF2lFfrg9j5T33hLT2teQd6AzyFYcnsn0sTH6qaTOLnM2fYq9gC' },
]

export class Auth {
  constructor() {}

  // Example login (not wired to routes; usable later if needed)
  async verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash)
  }

  // Middleware: require curator via header
  // Accept either:
  // - X-Role: curator, and optional X-Phone matching curator phone
  // - or X-API-Key: <secret> (if you prefer a key, respect env API_KEY)
  requireKurator = (req, res, next) => {
    const apiKey = req.header('X-API-Key')
    if (process.env.API_KEY && apiKey === process.env.API_KEY) return next()

    const role = (req.header('X-Role') || '').toLowerCase()
    const phone = req.header('X-Phone') || ''
    if (role === 'curator') {
      // Optionally verify known curator phone
      const u = users.find(u => u.role === 'curator')
      if (!u) return res.status(403).json({ error: 'FORBIDDEN' })
      if (phone && phone !== u.phone) return res.status(403).json({ error: 'FORBIDDEN' })
      return next()
    }
    return res.status(403).json({ error: 'FORBIDDEN' })
  }
}
