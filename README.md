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

- **Framework**: Next.js 15 with React 19
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18+ 
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
