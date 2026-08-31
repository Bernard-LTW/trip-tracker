# Trip Tracker

A web application to help UK Non-PR holders track their time spent in and out of the UK. This tool helps you monitor your continuous residence requirements and stay compliant with UK immigration rules(Note: this is subject to change at any moment for different types of visas).

## Features

- **Trip Management**: Add, edit, and delete trips outside the UK with dates, destinations, and descriptions
- **Days Calculation**: Automatically calculates:
  - Days since visa approval
  - Days since first entry to UK
  - Total days spent on trips
  - Days actually in the UK
- **Progress Tracking**: Visual progress bars showing your residence status
- **Upcoming Trips**: View and manage your planned future trips
- **Residence Compliance Check**: Monitor your compliance with UK PR requirements
- **PWA Support**: Install as a Progressive Web App for offline access
- **Google Authentication**: Secure sign-in with Google

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **PWA**: next-pwa
- **Hosting**: Railway (Next.js standalone output)

## Getting Started

### Prerequisites

- Node.js 20.9+ 
- npm, pnpm, or yarn
- Firebase project with Firestore, Auth, and Storage enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trip-tracker
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
ALLOWED_EMAILS=email1@example.com,email2@example.com
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:5678](http://localhost:5678) in your browser


## Deployment (Railway)

The app is configured for [Railway](https://docs.railway.com/guides/nextjs) using
Next.js `standalone` output. Railway's Railpack builder auto-detects pnpm + Next.js and
runs `pnpm build` then `pnpm start` (`node .next/standalone/server.js`) with no extra
config. The `build` script also copies `public/` and `.next/static` into
`.next/standalone` so assets are served in production.

1. Create a Railway project and either connect this GitHub repo ("Deploy from GitHub
   repo") or run `railway init` + `railway up` from the repo root.
2. On the Railway **service**, set these variables. The `NEXT_PUBLIC_FIREBASE_*` values
   are inlined into the client bundle at **build** time, so they must exist before the
   first deploy — not just at runtime:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `ALLOWED_EMAILS`
3. After the deploy succeeds, generate a public domain under **Settings → Networking**
   (or `railway domain`). Railway injects `PORT` automatically; no port config needed.
4. Add the generated domain to **Firebase Console → Authentication → Settings →
   Authorized domains** so Google Sign-In works.

To reproduce the Railway build locally:
```bash
pnpm build
PORT=3000 pnpm start
```


## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── context/          # React context providers (Auth, Theme)
├── lib/              # Utility functions and Firebase config
├── services/         # Business logic services
└── types/            # TypeScript type definitions
```
