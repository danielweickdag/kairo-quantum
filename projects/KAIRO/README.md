# KAIRO - Social Trading Platform

A full-stack social trading platform that allows users to copy trade hedge funds, managers, celebrities, and friends. Built with modern technologies and inspired by platforms like dub and TradingView.

## 🚀 Features

- **Copy Trading**: Follow and automatically copy trades from top performers
- **Social Features**: Connect with traders, share insights, and build a community
- **Real-time Analytics**: Advanced charting tools and performance metrics
- **Portfolio Management**: Track and manage multiple portfolios
- **Market Data**: Real-time market data and price feeds
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Redis** - Caching and sessions
- **Winston** - Logging

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Redis (optional, for caching)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd KAIRO
```

### 2. Install dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Environment Setup

#### Frontend
Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

#### Backend
Copy `backend/.env.example` to `backend/.env` and update the values:

```bash
cp backend/.env.example backend/.env
```

Update the database URL and other configuration values in the `.env` file.

### 4. Database Setup

```bash
cd backend

# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# (Optional) Seed the database
npm run seed
```

### 5. Start the development servers

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2)
```bash
npm run dev
```

The application will be available at:
- Frontend: https://www.kairoquantum.com
- Backend API: https://api.kairoquantum.com
- Local Development Frontend: http://localhost:3000
- Local Development Backend API: http://localhost:3001

## 📁 Project Structure

```
KAIRO/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema and migrations
│   └── logs/              # Application logs
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client
- `npm run studio` - Open Prisma Studio
- `npm test` - Run tests

## 🔐 Authentication

The application uses JWT-based authentication with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

## 📊 API Documentation

The API follows RESTful conventions. Main endpoints include:

- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/portfolios/*` - Portfolio operations
- `/api/trades/*` - Trading operations
- `/api/market/*` - Market data
- `/api/social/*` - Social features
- `/api/copy-trade/*` - Copy trading

## 🔄 Real-time Features

The application uses WebSocket connections for real-time updates:

- Live portfolio updates
- Real-time trade notifications
- Market data streaming
- Social activity feeds

## 🛡 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- SQL injection prevention with Prisma

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create a new app on your preferred platform
2. Set environment variables
3. Connect to PostgreSQL database
4. Deploy from GitHub repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [dub](https://www.dubapp.com) for copy trading features
- Inspired by [TradingView](https://www.tradingview.com) for charting and analytics
- Built with modern web technologies and best practices

## 📞 Support

For support, email support@kairo.com or join our Discord community.