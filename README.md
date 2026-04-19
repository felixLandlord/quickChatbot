# quickChatbot

This is a free, chatbot app built with Next.js and Vercel AI SDK.

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RFCs) and Server Actions for server-side rendering and increased performance
- [Vercel AI SDK](https://sdk.vercel.ai) with [Groq](https://groq.com)
  - Direct Groq API integration for generating text, structured objects, and tool calls
  - Built-in streaming and UI components
  - High-performance inference with Groq's LPU inference engine
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Neon Serverless Postgres](https://neon.tech) for saving chat history and user data
  - [Redis Cloud](https://redis.cloud) for rate limiting and caching
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage (optional)
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

- **Manual Chat Renaming**
  - Click the "..." menu next to any chat in the sidebar
  - Select "Rename" to edit the chat title
  - Press Enter to save, Escape to cancel


- **AI-Powered Chat Title Generation**
  - New chats automatically generate descriptive titles based on your first message

## Prerequisites

Before running this project, you'll need to set up the following services:

1. **Groq API Key**
   - Sign up at [console.groq.com](https://console.groq.com)
   - Create an API key from the dashboard
   - Groq provides free tier with generous rate limits

2. **Neon Postgres Database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy your connection string (format: `postgresql://user:password@host/database?sslmode=require`)

3. **Redis Cloud**
   - Sign up at [redis.cloud](https://redis.cloud)
   - Create a new database
   - Copy your connection string (format: `redis://default:password@host:port`)

4. **Vercel Blob** (Optional, for file uploads)
   - Sign up at [vercel.com](https://vercel.com)
   - Create a storage bucket
   - Get your read/write token

5. **Auth.js Secret**
   - Generate a random secret using: `openssl rand -base64 32`

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:
   ```
   AUTH_SECRET=your_generated_secret
   GROQ_API_KEY=your_groq_api_key
   POSTGRES_URL=your_neon_postgres_connection_string
   REDIS_URL=your_redis_cloud_connection_string
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token  # Optional
   ```

## Running locally

```bash
pnpm install
pnpm db:migrate  # Setup database or apply latest database changes
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000).

## Deployment

This app can be deployed to any platform that supports Next.js, including:

- **Vercel** (recommended for easy setup)
- **Railway**
- **Render**
- **Fly.io**
- Any other Node.js-compatible hosting

### Deploying to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Pull environment variables: `vercel env pull`
4. Deploy: `vercel`

## Available Models

The app is configured to use Groq models which support tool calling:

- **GPT OSS 120B** - Open-source 120B parameter model with tool use
- **GPT OSS 20B** - Compact reasoning model (used for fast title generation)

All models are available through Groq's free tier with rate limits.

## Database Migrations

To manage database schema changes:

```bash
pnpm db:generate   # Generate migration files
pnpm db:migrate    # Apply migrations
pnpm db:push       # Push schema to database
pnpm db:studio     # Open Drizzle Studio
```

## License

MIT
