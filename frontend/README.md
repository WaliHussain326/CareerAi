# AI Career Counselling - Frontend

React + TypeScript frontend for the AI-Based Future Counselling Platform.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Shadcn UI Components
- React Context for state management

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Backend API running (see ../backend/README.md)

### Installation

```bash
# Install dependencies
bun install
# or
npm install
```

### Environment Setup

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Development

```bash
# Start development server
bun dev
# or
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
# Build for production
bun run build
# or
npm run build
```

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

## Features

- **Authentication**: Login, Register, JWT token management
- **Onboarding**: Multi-step onboarding process
- **Assessment**: Interactive career quiz
- **Recommendations**: AI-generated career matches
- **Roadmaps**: Personalized learning paths
- **Dashboard**: Progress tracking and overview

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard widgets
│   ├── layout/         # Layout components
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── QuizContext.tsx
├── hooks/              # Custom hooks
├── lib/                # Utilities
├── pages/              # Page components
│   ├── Index.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Onboarding.tsx
│   ├── Assessment.tsx
│   ├── Recommendations.tsx
│   └── CareerDetail.tsx
├── App.tsx
└── main.tsx
```

## Available Routes

- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/onboarding` - Onboarding process
- `/assessment` - Career quiz
- `/recommendations` - Career recommendations
- `/career/:id` - Career details
- `/progress` - Progress tracking
- `/learning` - Learning resources
- `/community` - Community features

## Connecting to Backend

Ensure the backend is running at `http://localhost:8000` before starting the frontend.

The API base URL can be configured in the `.env` file using `VITE_API_URL`.

## Development Tips

- Hot module replacement (HMR) is enabled by default
- TypeScript strict mode is enabled
- ESLint configuration included
- Tailwind CSS configured with custom theme

## License

MIT License
