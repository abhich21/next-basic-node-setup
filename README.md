# Scalable Node.js Backend

A production-ready Node.js backend with Firebase authentication, MongoDB integration, and facade architecture pattern.

## Features

- 🔐 Firebase Authentication with email/password
- 🗄️ MongoDB integration with Mongoose
- 🏗️ Facade architecture pattern for scalability
- 🧪 Comprehensive testing with Jest
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📝 Input validation with Joi
- 🚀 Production-ready configuration

## Quick Start

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Run tests**
   \`\`\`bash
   npm test
   \`\`\`

## Architecture

This project follows a facade pattern architecture:

\`\`\`
src/
├── config/          # Configuration files
├── modules/         # API Modules
├── models/          # Response models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── services/        # External service integrations
├── utils/           # Utility functions
└── tests/           # Test files
\`\`\`

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile

## Environment Variables

See `.env.example` for required environment variables.

## Testing

Run the test suite:
\`\`\`bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
