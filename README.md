# 🕸️ SpiderNode - Modern Uptime Monitoring

**SpiderNode** is a premium, high-performance uptime tracking and status page application built for modern teams. It allows you to monitor your HTTP/HTTPS endpoints, track response times, manage incidents, and provide transparent public status pages to your users. 

**Positioning:** The free uptime monitor with Telegram alerts — built by a developer, for developers.

![SpiderNode Dashboard](public/window.svg) *(Replace with actual dashboard screenshot)*

---

## ✨ Features

- **🌐 Real-time HTTP/HTTPS Monitoring**: Add endpoints and configure custom check intervals.
- **⚡ Automated Health Checks**: Built-in secure cron endpoint (`/api/cron/check`) to trigger automated polling.
- **📊 Detailed Dashboards**: View historical response times, latency averages, and precise uptime percentages.
- **🚨 Incident Management**: Automatically track outages and resolve incidents when services recover.
- **📣 Public Status Pages**: Generate shareable, read-only status pages for your customers (`/status/[id]`).
- **📱 Telegram Alerts**: Connect a Telegram bot to receive instant push notifications when a monitor goes down.
- **🔐 Secure Authentication & Email Verification**: Integrated NextAuth.js supporting Credentials, Google, and GitHub logins. Includes complete email verification and password reset flows using Hostinger SMTP.
- **🛡️ Production-Ready Security**: Built-in API rate limiting, strict monitor limits (10 monitors per free tier user), robust error boundaries, and environment-secured endpoints.
- **🎨 Premium UI/UX**: Designed with a sleek, dark-mode glassmorphism aesthetic using Tailwind CSS v4, Motion animations, and Sonner toasts.

---

## 🏗️ System Architecture

*Note: The complete system architecture design is available in the provided `draw.io` file.*

At a high level, the architecture consists of:
1. **Next.js 16 (App Router)** serving as both the React frontend and the API backend.
2. **Prisma ORM** interacting with a **PostgreSQL (Neon serverless)** database to store users, monitors, pings, incidents, and security tokens.
3. **Cron Job Service** (e.g., Vercel Cron or GitHub Actions) triggering the secure `/api/cron/check` endpoint.
4. **Telegram Bot API & Nodemailer** integrated directly into the checking and auth logic to dispatch instant alerts and transactional emails.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.1](https://nextjs.org/) (App Router + Turbopack)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Neon compatible)
- **ORM:** [Prisma ORM v7](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) + Redux Persist
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & UI:** [Hugeicons](https://hugeicons.com/), [Sonner](https://sonner.emilkowal.ski/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://motion.dev/)
- **Transactional Email:** [Nodemailer](https://nodemailer.com/) via Hostinger SMTP

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (Local, Supabase, Neon, etc.)
- Telegram Bot Token (Optional, for notifications)
- SMTP Provider Credentials (e.g., Hostinger, SendGrid, Mailgun)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/spidernode.git
cd spidernode
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and configure the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spidernode?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your_super_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GITHUB_ID="your_github_oauth_id"
GITHUB_SECRET="your_github_oauth_secret"
GOOGLE_CLIENT_ID="your_google_oauth_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_secret"

# Automated Checks
CRON_SECRET="your_super_secret_cron_key_123"

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="your_telegram_bot_username"

# Email Verification & Password Reset (Hostinger SMTP Example)
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="support@spidernode.site"
SMTP_PASS="your_secure_email_password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Database Setup
Push the Prisma schema to your PostgreSQL database to generate the tables:
```bash
npx prisma db push
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Setting up Automated Checks (Cron)

To automate the monitoring, you need an external service to ping your application. 

You can use a service like **Vercel Cron**, **cron-job.org**, or **GitHub Actions** to make a `GET` request to your secure endpoint every X minutes:

```text
GET https://your-domain.com/api/cron/check
Headers:
  Authorization: Bearer your_super_secret_cron_key_123
```
*(Note: CRON_SECRET is strictly enforced in production to prevent unauthorized monitoring checks.)*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
