# Deepseek AI - Full Stack AI-Powered Multimodal Chatbot

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-8.18.0-47A248?style=flat-square&logo=mongodb)

A modern, full-stack AI-powered chatbot application built with Next.js 15, React 19, and TypeScript. Features real-time chat functionality, user authentication, and AI integration powered by Google's Generative AI.

## 🚀 Features

- **💬 Real-time Chat Interface**: Smooth, responsive chat experience with message history
- **🔐 Authentication**: Secure user authentication with Clerk
- **🤖 AI Integration**: Powered by Google's Generative AI for intelligent responses
- **📱 Responsive Design**: Mobile-first design with collapsible sidebar
- **🎨 Modern UI**: Beautiful interface with Tailwind CSS and custom animations
- **📊 Chat Management**: Create, rename, and delete chat conversations
- **🔄 Real-time Updates**: Live message updates and chat synchronization
- **🛡️ Type Safety**: Full TypeScript implementation for better development experience
- **🎯 Error Handling**: Comprehensive error boundaries and user-friendly error messages

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Build Tool**: Turbopack (development)
- **Authentication**: Clerk

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **AI**: Google Generative AI (Gemini)
- **Authentication**: Clerk Webhooks

### Key Components
- **Sidebar**: Navigation and chat management
- **PromptBox**: Message input with AI integration
- **Messages**: Message rendering with Markdown support
- **ChatLabel**: Individual chat item management
- **ErrorBoundary**: Application-wide error handling

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|----------|
| Framework | Next.js | 15.5.2 | Full-stack React framework |
| Frontend | React | 19.1.0 | UI component library |
| Language | TypeScript | 5+ | Type-safe development |
| Styling | Tailwind CSS | 4 | Utility-first CSS framework |
| Database | MongoDB | - | NoSQL document database |
| ODM | Mongoose | 8.18.0 | MongoDB object modeling |
| Auth | Clerk | 6.31.6 | Authentication & user management |
| AI | Google GenAI | 1.16.0 | Generative AI integration |
| HTTP Client | Axios | 1.11.0 | Promise-based HTTP client |
| Notifications | React Hot Toast | 2.6.0 | Toast notifications |
| Markdown | React Markdown | 10.1.0 | Markdown rendering |
| Syntax Highlighting | Prism.js | 1.30.0 | Code syntax highlighting |
| Webhooks | Svix | 1.75.0 | Webhook handling |

## 📁 Project Structure

```
deepreek/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Chat-related endpoints
│   │   └── clerk/         # Clerk webhooks
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── prism.css         # Syntax highlighting styles
├── components/            # React components
│   ├── chatlabel.tsx     # Individual chat item
│   ├── ErrorBoundary.tsx # Error boundary component
│   ├── message.tsx       # Message display component
│   ├── promptbox.tsx     # Message input component
│   └── sidebar.tsx       # Navigation sidebar
├── config/               # Configuration files
│   └── db.ts            # Database connection
├── context/              # React contexts
│   └── AppContext.tsx   # Global app state
├── models/               # Database models
│   ├── Chat.ts          # Chat model
│   └── User.ts          # User model
├── types/                # TypeScript type definitions
│   └── index.ts         # Shared types
├── utils/                # Utility functions
│   └── errorHandling.ts # Error handling utilities
└── assets/               # Static assets
    └── assets.js        # Asset exports
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Clerk account for authentication
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deepseek
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables (see Environment Variables section)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/deepseek
# or MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/deepseek

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Google AI
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

## 📝 API Endpoints

### Chat Management
- `POST /api/chat/create` - Create a new chat
- `GET /api/chat/get` - Get user's chats
- `POST /api/chat/rename` - Rename a chat
- `POST /api/chat/delete` - Delete a chat
- `POST /api/chat/ai` - Send message to AI

### Authentication
- `POST /api/clerk` - Clerk webhook handler

## 🎨 Styling Guidelines

### Tailwind CSS Configuration
- Custom color palette for dark theme
- Responsive design breakpoints
- Custom animations and transitions
- Consistent spacing and typography

### Component Styling Patterns
- Use `bg-[#292a2d]` for main background
- Use `bg-[#212327]` for sidebar background
- Use `bg-[#404045]` for input backgrounds
- Implement hover states with opacity transitions
- Use consistent rounded corners (`rounded-lg`, `rounded-xl`)

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add proper error handling
- Write comprehensive documentation
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Clerk](https://clerk.dev/) - Authentication and user management
- [Google AI](https://ai.google.dev/) - Generative AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - Document database

---

Built with ❤️ using Next.js, React, and TypeScript
