# SupportDesk Backend API

Full-stack backend implementation for the Support Assistant Dashboard with Node.js, Express, and Socket.io.

## Features

- ✅ **RESTful API** for authentication, records, students, and notifications
- ✅ **WebSocket (Socket.io)** for real-time updates
- ✅ **Autofill Logic** - Search students by name to auto-fill Group, Mentor, and Status
- ✅ **Bcrypt Password Hashing** for secure authentication
- ✅ **Concurrency Protection** - Prevents race conditions with locking mechanism
- ✅ **Error Handling** - Robust error handling for WebSocket streams
- ✅ **JSON-based Database** - File-based storage (easily replaceable with real DB)

## Project Structure

```
backend/
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── records.js       # Record CRUD operations
│   ├── students.js      # Student management (curator only)
│   └── notifications.js # Notification endpoints (curator only)
├── sockets/
│   └── index.js         # Socket.io event handlers
├── utils/
│   ├── database.js      # JSON database operations
│   ├── auth.js          # Authentication utilities
│   ├── autofill.js      # Student autofill logic
│   └── concurrency.js   # Lock mechanism for race condition prevention
└── data/                # JSON database files (auto-created)
    ├── users.json
    ├── students.json
    ├── records.json
    └── notifications.json
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Start the server:**
   ```bash
   npm run server
   # Or with auto-reload:
   npm run dev:server
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with phone and password
- `POST /api/auth/register` - Register new support teacher

### Records

- `GET /api/records` - Get all records (with filters: `?supportId=`, `?date=`, `?group=`, `?search=`)
- `POST /api/records` - Create new record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### Students (Curator Only)

- `GET /api/students/autofill?name=...` - Search student for autofill data
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Notifications (Curator Only)

- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/seen` - Mark all as seen

## WebSocket Events

### Client → Server

#### `authenticate`
Authenticate user connection:
```javascript
socket.emit('authenticate', { userId: 'u1', role: 'support' });
```

#### `student:autofill`
Search for student autofill data:
```javascript
socket.emit('student:autofill', { name: 'Mahliyo' }, (response) => {
  // response: { success: true, data: { group: 'GW112', mentor: '...', status: '...' } }
});
```

#### `record:submit`
Submit a new record:
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
  // response: { success: true, data: { ...record } }
});
```

#### `record:update`
Update an existing record:
```javascript
socket.emit('record:update', { id: 'r1', theme: 'React basics' }, callback);
```

#### `record:delete`
Delete a record:
```javascript
socket.emit('record:delete', { id: 'r1' }, callback);
```

### Server → Client

#### `record:new`
Emitted to curators when a new record is submitted:
```javascript
socket.on('record:new', ({ record, notification }) => {
  // Update UI in real-time
});
```

#### `record:updated`
Emitted to curators when a record is updated:
```javascript
socket.on('record:updated', ({ record }) => {
  // Update UI
});
```

#### `record:deleted`
Emitted to curators when a record is deleted:
```javascript
socket.on('record:deleted', ({ id }) => {
  // Remove from UI
});
```

#### `error`
Error events:
```javascript
socket.on('error', ({ message }) => {
  // Handle error
});
```

## Autofill Logic

When a Support Teacher types a student's name:

1. **Minimum 2 characters** required for search
2. **Exact match** is checked first
3. **Partial match** is checked if no exact match
4. Returns: `{ group, mentor, status }` or `null`

**Example:**
- Input: "Mahliyo" → Returns: `{ group: "GW112", mentor: "Nozila Yusupova", status: "coworking" }`
- Input: "Unknown" → Returns: `null`

## Security Features

- **Bcrypt Password Hashing** - All passwords are hashed with salt rounds of 10
- **Role-based Access Control** - Curator-only endpoints for student management
- **Authentication Middleware** - Protected routes require user authentication
- **Input Validation** - All inputs are validated before processing

## Concurrency & Stability

- **Lock Mechanism** - Prevents race conditions when multiple users submit simultaneously
- **Error Handling** - Malformed packets are handled gracefully without crashing
- **Connection Management** - User connections are tracked and cleaned up on disconnect
- **Retry Logic** - Lock acquisition includes retry mechanism with exponential backoff

## Database Schema

### Users
```json
{
  "id": "u1",
  "name": "Aziza Karimova",
  "phone": "93-111-11-11",
  "password": "$2b$10$...", // hashed
  "role": "support" | "curator",
  "avatar": "AK",
  "color": "#3d5eff",
  "joinDate": "01.01.2026"
}
```

### Students
```json
{
  "id": "s1",
  "name": "Mahliyo Xudoyberdiyeva",
  "group": "GW112",
  "mentor": "Nozila Yusupova",
  "status": "coworking" | "group"
}
```

### Records
```json
{
  "id": "r1",
  "supportId": "u1",
  "supportName": "Aziza Karimova",
  "date": "17.02.2026",
  "time": "10:00",
  "group": "GW112",
  "mentor": "Nozila Yusupova",
  "student": "Mahliyo Xudoyberdiyeva",
  "theme": "JS homework",
  "status": "coworking",
  "createdAt": 1737129600000
}
```

## Default Credentials

**Support Teachers:**
- Phone: `93-111-11-11`, Password: `Aziza`
- Phone: `93-222-22-22`, Password: `Bobur`
- Phone: `93-333-33-33`, Password: `Charos`
- Phone: `93-444-44-44`, Password: `Davron`
- Phone: `93-555-55-55`, Password: `Ezgulik`

**Curator:**
- Phone: `90-000-00-00`, Password: `Kurator123`

## Notes

- The database is JSON-based and stored in `backend/data/`
- All passwords are automatically hashed on first initialization
- Socket.io rooms are used to separate curators from support teachers
- The server handles multiple simultaneous connections without conflicts
- Error messages are in Uzbek for user-facing responses
