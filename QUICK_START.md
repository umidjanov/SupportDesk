# Quick Start Guide

## Backend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` if needed:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Start the Server
```bash
npm run server
```

The server will:
- Initialize the JSON database files in `backend/data/`
- Hash all passwords automatically
- Start on `http://localhost:3001`
- Enable Socket.io on the same port

### 4. Verify Server is Running
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Testing Autofill

### Via REST API:
```bash
curl "http://localhost:3001/api/students/autofill?name=Mahliyo"
```

### Via Socket.io (Node.js example):
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  socket.emit('authenticate', { userId: 'u1', role: 'support' });
  
  socket.emit('student:autofill', { name: 'Mahliyo' }, (response) => {
    console.log('Autofill result:', response);
    // { success: true, data: { group: 'GW112', mentor: '...', status: '...' } }
  });
});
```

## Testing Real-time Updates

### Support Teacher Submits Record:
```javascript
socket.emit('record:submit', {
  date: '19.02.2026',
  time: '10:00',
  group: 'GW112',
  mentor: 'Nozila Yusupova',
  student: 'Mahliyo Xudoyberdiyeva',
  theme: 'JS homework',
  status: 'coworking'
}, (response) => {
  console.log('Submitted:', response);
});
```

### Kurator Receives Update:
```javascript
socket.on('record:new', ({ record, notification }) => {
  console.log('New record received:', record);
  console.log('Notification:', notification);
  // Update UI here
});
```

## Default Login Credentials

**Support Teacher:**
- Phone: `93-111-11-11`
- Password: `Aziza`

**Curator:**
- Phone: `90-000-00-00`
- Password: `Kurator123`

## API Testing with curl

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"93-111-11-11","password":"Aziza"}'
```

### Get Records:
```bash
curl http://localhost:3001/api/records \
  -H "x-user-id: u1"
```

### Create Record:
```bash
curl -X POST http://localhost:3001/api/records \
  -H "Content-Type: application/json" \
  -H "x-user-id: u1" \
  -d '{
    "date": "19.02.2026",
    "time": "10:00",
    "group": "GW112",
    "mentor": "Nozila Yusupova",
    "student": "Mahliyo Xudoyberdiyeva",
    "theme": "JS homework",
    "status": "coworking"
  }'
```

## Troubleshooting

**Port already in use:**
- Change `PORT` in `.env` file
- Or kill the process using port 3001

**Database files not created:**
- Check `backend/data/` directory exists
- Check file permissions
- Check server logs for errors

**Socket.io connection fails:**
- Verify CORS settings in `server.js`
- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Ensure both frontend and backend are running

**Passwords not working:**
- Database is initialized on first run
- Passwords are hashed automatically
- Use default credentials from seed data
