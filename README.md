# AI Q&A Platform

A full-stack AI-powered question and answer platform built with Next.js, Inngest, and OpenAI. When a user submits a question, an event is fired to Inngest which runs a multi-step background workflow to generate an AI answer and relevant tags using OpenAI, then saves everything back to the database.

## Tech Stack

- Next.js 14 (App Router) with TypeScript
- Inngest for event-driven background workflows
- OpenAI GPT-4o for answer generation
- OpenAI GPT-4o-mini for tag generation
- Prisma ORM with Neon (PostgreSQL) for the database
- Tailwind CSS for styling
- Vercel for deployment

## How It Works

1. User submits a question via the form
2. Question is saved to the database with a PENDING status
3. A question.created event is sent to Inngest
4. Inngest runs a multi-step background function:
   - Fetches the question from the database
   - Marks the question as PROCESSING
   - Calls OpenAI GPT-4o to generate a detailed answer
   - Calls OpenAI GPT-4o-mini to generate relevant tags
   - Saves the answer and tags back to the database with ANSWERED status
5. User can refresh the question page to see the generated answer

## Project Structure
```
ai-qa-platform/
├── app/
│   ├── api/
│   │   ├── inngest/route.ts
│   │   └── questions/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── questions/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── globals.css
│   └── page.tsx
├── inngest/
│   ├── client.ts
│   └── functions/
│       └── answer-question.ts
├── lib/
│   └── prisma.ts
└── prisma/
    └── schema.prisma
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Neon account (neon.tech)
- An OpenAI account (platform.openai.com)
- An Inngest account (app.inngest.com)

### Installation

1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-qa-platform.git
cd ai-qa-platform
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root of the project:

```
DATABASE_URL=your_neon_postgres_connection_string
OPENAI_API_KEY=your_openai_api_key
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_DEV=1
```

4. Push the database schema

```bash
npx prisma db push
```

5. Run the development servers

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

6. Open http://localhost:3000 in your browser

## Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | Neon PostgreSQL connection string |
| OPENAI_API_KEY | OpenAI API key from platform.openai.com |
| INNGEST_EVENT_KEY | Inngest event key from app.inngest.com |
| INNGEST_SIGNING_KEY | Inngest signing key from app.inngest.com |
| INNGEST_DEV | Set to 1 for local development |

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the project on vercel.com
3. Add all environment variables in the Vercel dashboard (remove INNGEST_DEV for production)
4. Deploy
5. Go to app.inngest.com and add your Vercel deployment URL as a synced app:
   https://your-app.vercel.app/api/inngest