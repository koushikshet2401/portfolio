# 🚀 Portfolio Backend API

RESTful API built with Node.js, Express, and MongoDB for managing portfolio content, contact messages, and visitor tracking.

## ✨ Features

- **Projects API**: CRUD operations for portfolio projects
- **Contact Messages**: Store and manage contact form submissions
- **Profile Management**: Update portfolio information
- **Visitor Tracking**: Track unique visitors and page views
- **JWT Authentication**: Secure admin routes
- **MongoDB Database**: Persistent data storage

## 📁 Project Structure

```
portfolio-backend/
├── src/
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── messageController.js
│   │   ├── profileController.js
│   │   └── visitorController.js
│   ├── models/           # MongoDB schemas
│   │   ├── Project.js
│   │   ├── Message.js
│   │   ├── Profile.js
│   │   └── Visitor.js
│   ├── routes/           # API endpoints
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── messages.js
│   │   ├── profile.js
│   │   └── visitors.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   └── server.js         # Main server file
├── scripts/
│   └── seedData.js       # Database seeding
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your configuration
   ```

3. **Generate Admin Password Hash**
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword', 10));"
   ```
   
   Copy the output and paste it as `ADMIN_PASSWORD_HASH` in your `.env` file.

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Seed Database** (Optional - adds sample data)
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Server Running!**
   ```
   API: http://localhost:5000/api
   Health Check: http://localhost:5000/api/health
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_super_secret_jwt_key
ADMIN_EMAIL=admin@youremail.com
ADMIN_PASSWORD_HASH=<bcrypt_hash>
FRONTEND_URL=http://localhost:3000
```

### MongoDB Atlas Setup

If using MongoDB Atlas:
1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Get your connection string
5. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | No |
| POST | `/api/auth/logout` | Admin logout | No |
| GET | `/api/auth/verify` | Verify token | Yes |

**Login Request:**
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all projects | No |
| GET | `/api/projects/:id` | Get single project | No |
| POST | `/api/projects` | Create project | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |

**Create Project:**
```json
{
  "title": "My Project",
  "description": "Project description",
  "image": "https://example.com/image.jpg",
  "githubLink": "https://github.com/username/repo",
  "liveLink": "https://project.com",
  "technologies": ["React", "Node.js", "MongoDB"],
  "order": 1
}
```

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/messages` | Submit contact form | No |
| GET | `/api/messages` | Get all messages | Yes |
| GET | `/api/messages/:id` | Get single message | Yes |
| PUT | `/api/messages/:id/read` | Mark as read | Yes |
| DELETE | `/api/messages/:id` | Delete message | Yes |

**Submit Contact Form:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}
```

### Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/profile` | Get profile | No |
| PUT | `/api/profile` | Update profile | Yes |

**Update Profile:**
```json
{
  "name": "Koushik Shet",
  "title": "Full Stack Developer",
  "bio": "I'm a dedicated web developer...",
  "email": "koushikshet2401@gmail.com",
  "skills": {
    "frontend": ["HTML", "CSS", "React"],
    "backend": ["Node.js", "Express", "MongoDB"],
    "tools": ["Git", "VS Code"]
  },
  "social": {
    "linkedin": "https://linkedin.com/in/koushik-shet",
    "github": "https://github.com/koushikshet2401"
  }
}
```

### Visitors

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/visitors/track` | Track visitor | No |
| GET | `/api/visitors/stats` | Get visitor stats | Yes |
| GET | `/api/visitors` | Get all visitors | Yes |

**Track Visitor:**
```json
{
  "visitorId": "uuid-here",
  "page": "/",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

**Stats Response:**
```json
{
  "success": true,
  "total": 1250,
  "today": 45,
  "week": 320,
  "month": 890,
  "totalPageViews": 5430
}
```

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Or the token can be sent in cookies (set automatically on login).

## 📊 Database Models

### Project
```javascript
{
  title: String,
  description: String,
  image: String,
  githubLink: String,
  liveLink: String,
  technologies: [String],
  featured: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  read: Boolean,
  replied: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Profile
```javascript
{
  name: String,
  title: String,
  bio: String,
  email: String,
  skills: {
    frontend: [String],
    backend: [String],
    tools: [String]
  },
  social: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String
  }
}
```

### Visitor
```javascript
{
  visitorId: String,
  visits: [{
    page: String,
    timestamp: Date
  }],
  totalVisits: Number,
  firstVisit: Date,
  lastVisit: Date,
  userAgent: String,
  referrer: String
}
```

## 🧪 Testing API

### Using cURL

```bash
# Get all projects
curl http://localhost:5000/api/projects

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'

# Create project (with token)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"New Project","description":"...", ...}'
```

### Using Postman

1. Import the API endpoints
2. For protected routes, add Authorization header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`

## 🚀 Deployment

### Deploy to Render

1. **Create Account** at [render.com](https://render.com)
2. **Create Web Service**
   - Connect GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Add Environment Variables**
   - Add all variables from `.env`
4. **Deploy!**

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up

# Add environment variables
railway variables set MONGODB_URI="your_connection_string"
railway variables set JWT_SECRET="your_secret"
# ... add all other variables
```

## 📝 Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run seed    # Seed database with sample data
```

## 🔍 Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`
- For Atlas: Check IP whitelist and credentials

### CORS Errors
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS configuration in `server.js`

### Authentication Errors
- Verify `JWT_SECRET` is set in `.env`
- Check `ADMIN_PASSWORD_HASH` is correct
- Ensure token is sent in Authorization header

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process: `lsof -ti:5000 | xargs kill`

## 🛡️ Security

- JWT tokens expire in 7 days
- Passwords hashed with bcrypt
- Protected routes require authentication
- CORS configured for specific origins
- Environment variables for sensitive data

## 📚 Learn More

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify environment variables
3. Check MongoDB connection
4. Review API endpoint documentation

## 📄 License

This project is for personal portfolio use.

---

**Built with ❤️ using Node.js, Express, and MongoDB**
