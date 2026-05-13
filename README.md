# MentorHub Backend API

AI-powered mentorship platform backend built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Neon recommended) |
| Cache | Upstash Redis (serverless HTTP) |
| Queue | Upstash QStash |
| Auth | JWT (access + refresh tokens) |
| AI | OpenAI GPT-3.5-turbo |
| Upload | Cloudinary |
| Real-time | Socket.IO |
| Logging | Winston |

## Quick Start

### 1. Clone & Install
```bash
git clone <repo>
cd mentorhub-backend
npm install        # also runs prisma generate via postinstall
```

### 2. Environment
```bash
cp .env.example .env
# Edit .env with your credentials (see .env.example for instructions)
```

### 3. Database
```bash
npx prisma migrate dev --name init   # Creates tables
npm run db:seed                      # Seeds demo data
```

### 4. Run
```bash
npm run dev        # Development with hot reload
npm run build && npm start  # Production
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| POST | /api/auth/refresh | — | Refresh access token |
| GET | /api/auth/me | ✓ | Current user profile |
| GET | /api/mentors | — | List/search mentors |
| GET | /api/mentors/:id | — | Mentor detail |
| POST | /api/mentors | ✓ | Create mentor profile |
| GET | /api/bookings | ✓ | User's bookings |
| POST | /api/bookings | ✓ | Create booking |
| GET | /api/reviews/:mentorId | — | Mentor reviews |
| POST | /api/reviews | ✓ | Create review |
| POST | /api/ai/recommend | ✓ | AI mentor recommendations |
| POST | /api/ai/chat | ✓ | AI chat assistant |
| POST | /api/ai/match | ✓ | AI smart matching |
| GET | /api/ai/insights | ✓ | Market insights |
| GET | /api/notifications | ✓ | User notifications |
| GET | /api/analytics | ADMIN | Platform analytics |
| POST | /api/uploads | ✓ | Upload image |

## Deploy to Render

### Prerequisites
- GitHub repo with this code
- [Neon](https://neon.tech) PostgreSQL database (free tier)
- [Upstash](https://upstash.com) Redis (free tier)
- [Upstash QStash](https://upstash.com) (optional, for email queue)
- [Cloudinary](https://cloudinary.com) (optional, for image uploads)

### Steps

1. **Create Render Web Service**
   - New → Web Service → Connect GitHub repo
   - Runtime: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

2. **Create Render PostgreSQL** (or use Neon external DB)
   - New → PostgreSQL → Starter plan

3. **Set Environment Variables** in Render dashboard:

   | Variable | Value / Source |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DATABASE_URL` | From Render DB or Neon connection string |
   | `JWT_SECRET` | Random 64-char string |
   | `JWT_REFRESH_SECRET` | Random 64-char string |
   | `UPSTASH_REDIS_REST_URL` | From Upstash dashboard |
   | `UPSTASH_REDIS_REST_TOKEN` | From Upstash dashboard |
   | `OPENAI_API_KEY` | From OpenAI platform |
   | `FRONTEND_URL` | Your frontend URL (e.g. https://yourapp.vercel.app) |
   | `ALLOWED_ORIGINS` | Same as FRONTEND_URL |
   | `CLOUDINARY_CLOUD_NAME` | From Cloudinary |
   | `CLOUDINARY_API_KEY` | From Cloudinary |
   | `CLOUDINARY_API_SECRET` | From Cloudinary |
   | `SMTP_HOST` | smtp.gmail.com |
   | `SMTP_USER` | your@gmail.com |
   | `SMTP_PASS` | Gmail App Password |
   | `ENABLE_AI` | `true` |

4. **Run Migrations** after first deploy (via Render Shell):
   ```bash
   npx prisma migrate deploy
   ```

5. **Health Check**: `GET https://your-service.onrender.com/health`

### Generate Secret Keys
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run twice — one for `JWT_SECRET`, one for `JWT_REFRESH_SECRET`.

## AI Features

1. **Mentor Recommendations** — Analyzes user history to suggest best-fit mentors
2. **AI Chat Assistant** — Context-aware assistant for platform help and career advice
3. **Smart Matching** — Goal-based mentor matching with scoring
4. **Market Insights** — Platform analytics with AI-generated trend analysis
5. **Session Summary** — Auto-generates post-session summaries

## WebSocket Events

| Event | Direction | Payload |
|---|---|---|
| `send_message` | Client → Server | `{ conversationId, receiverId, content }` |
| `new_message` | Server → Client | Message object |
| `typing` | Client → Server | `{ receiverId }` |
| `user_typing` | Server → Client | `{ userId, name }` |

## Demo Credentials

After seeding:
- **Admin**: admin@mentorhub.com / Admin1234!
- **Mentor**: mentor@mentorhub.com / Mentor1234!
- **User**: user@mentorhub.com / User1234!
