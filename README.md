# 🕸️ SpiderNode - Modern Uptime Monitoring

SpiderNode is a premium, high-performance uptime tracking and status page application built for modern teams. It allows you to monitor your HTTP/HTTPS endpoints, track response times, manage incidents, and provide transparent public status pages to your users.

![SpiderNode Dashboard](public/window.svg) *(Replace with actual dashboard screenshot)*

---

## ✨ Features

- **🌐 Real-time HTTP/HTTPS Monitoring**: Add endpoints and configure custom check intervals (1m, 5m, 10m, etc.).
- **⚡ Automated Health Checks**: Built-in secure cron endpoint (`/api/cron/check`) to trigger automated polling.
- **📊 Detailed Dashboards**: View historical response times, latency averages, and precise uptime percentages.
- **🚨 Incident Management**: Automatically track outages and resolve incidents when services recover.
- **📣 Public Status Pages**: Generate shareable, read-only status pages for your customers (`/status/[id]`).
- **📱 Telegram Alerts**: Connect a Telegram bot to receive instant push notifications when a monitor goes down.
- **🔐 Secure Authentication**: Integrated NextAuth.js supporting Email/Password, Google, and GitHub logins.
- **🎨 Premium UI/UX**: Designed with a sleek, dark-mode glassmorphism aesthetic (Tailwind CSS).

---

## 🏗️ System Architecture

*Note: The complete system architecture design is available in the provided `draw.io` file.*

At a high level, the architecture consists of:
1. **Next.js 15 (App Router)** serving as both the React frontend and the API backend.
2. **Prisma ORM** interacting with a **PostgreSQL** database to store users, monitors, pings, and incidents.
3. **Cron Job Service** (e.g., Vercel Cron or GitHub Actions) triggering the secure `/api/cron/check` endpoint.
4. **Telegram Bot API** integrated directly into the checking logic to dispatch alerts on status changes.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) + React 19
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & UI:** [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) (Toasts)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (Local, Supabase, Neon, etc.)
- Telegram Bot Token (Optional, for notifications)

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
NEXT_PUBLIC_CRON_SECRET="your_super_secret_cron_key_123"

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="your_telegram_bot_username"
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
GET https://your-domain.com/api/cron/check?secret=your_super_secret_cron_key_123
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
