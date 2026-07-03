# Karl Jason Ochava — Portfolio

A decoupled portfolio landing page built with **React (Vite)** and a **Node.js/Express** API.

## Structure

```
├── client/     # React SPA (frontend)
├── server/     # Node.js REST API (contact form, optional data routes)
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm run install:all
```

### Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

Or run individually:

```bash
npm run dev:client
npm run dev:server
```

### Environment Variables

Copy the example env files and configure as needed:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

**Client (`client/.env`):**
- `VITE_API_BASE_URL` — Backend API URL (leave empty in dev to use Vite proxy)
- `VITE_RECAPTCHA_SITE_KEY` — Optional reCAPTCHA site key
- `VITE_ANALYTICS_ID` — Optional analytics ID

**Server (`server/.env`):**
- `PORT` — API port (default: 3001)
- `CLIENT_ORIGIN` — Allowed CORS origin
- `SMTP_*` — Email delivery credentials
- `EMAIL_TO` — Recipient for contact form submissions

> Without SMTP configured, contact form submissions are logged to the server console in development.

### Production Build

```bash
npm run build        # Build frontend
npm start            # Start backend
```

Deploy frontend to Vercel/Netlify and backend to Render/Railway.

## Features

- Single-page portfolio with scroll-spy navigation
- Static JSON content (projects, skills, experience, testimonials)
- Contact form with client + server validation, honeypot, and rate limiting
- Email notifications via Nodemailer (when SMTP is configured)
- Responsive design with CSS Modules and design tokens

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, CSS Modules |
| Backend | Node.js, Express |
| Email | Nodemailer |
| Data | Static JSON files |

## License

MIT
