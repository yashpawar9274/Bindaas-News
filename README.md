# BindaasNews - College Life Unleashed

BindaasNews is an anonymous news sharing platform designed specifically for Theem College students to share funny moments, pranks, and college life stories.

## Features

- 🔒 Anonymous posting
- 📱 Progressive Web App (PWA) support
- 🎨 Modern UI with shadcn-ui components
- 🌙 Responsive design
- 🔄 Real-time updates
- 👥 User authentication
- 💾 Supabase backend integration

## Tech Stack

- **Frontend**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn-ui

- **Backend & Database**
  - Supabase
  - PostgreSQL

- **Authentication**
  - Supabase Auth

## Getting Started

1. **Clone the repository**
```sh
git clone https://github.com/yashpawar9274/Bindaas-News.git

cd theem-bindaas-news
```

2. **Set up environment variables**

Create a `.env` file in the root of the project and add your Supabase URL and Anon Key:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Directory Structure

The project is organized into the following main directories:

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── integrations/  # Third-party integrations
├── lib/          # Utility functions
└── pages/        # Page components
```