<div align="center">

# 🕸️ SpiderNode

### Modern, Developer-First Uptime Monitoring & Incident Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>SpiderNode</b> is a full-stack, production-ready uptime monitoring SaaS designed for modern engineering teams and independent developers. Monitor HTTP/HTTPS endpoints, capture real-time latency metrics, orchestrate automated incident responses, and dispatch instant Telegram alerts — all backed by an intelligent in-memory write-batching engine designed to drastically minimize database compute.
</p>

[Key Features](#-key-features) • [System Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Cron & Polling Engine](#-cron--polling-engine) • [Deployment](#-production-deployment) • [API Reference](#-api-reference)

</div>

---

## 📸 Product Previews

### Real-Time Telemetry Dashboard
![SpiderNode Dashboard](root_images/1.png)

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <h4 align="center">📱 Instant Telegram Alerts</h4>
        <img src="root_images/Screenshot_1.png" alt="Telegram Alerts" />
      </td>
      <td width="50%">
        <h4 align="center">🚨 Automated Incident Log</h4>
        <img src="root_images/Screenshot_2.png" alt="Incident Management" />
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <h4 align="center">📣 Public Read-Only Status Page</h4>
        <img src="root_images/Screenshot_3.png" alt="Public Status Page" />
      </td>
    </tr>
  </table>
</div>

---

## ✨ Key Features

- **🌐 Precision HTTP/HTTPS Health Checks**:
  - Configurable polling intervals (1m, 5m, 15m, 30m, 60m).
  - High-precision latency profiling (`performance.now()`), response status code tracking (2xx/3xx/4xx/5xx), and automatic HTTP-to-HTTPS redirect traversal.
  - Fail-safe 10-second request timeout controller (`AbortController`) to eliminate zombie worker threads.

- **⚡ High-Efficiency In-Memory Write Batcher**:
  - Up to **~93% reduction in database write compute** by buffering routine `UP` state checks in an in-memory queue (`db-batcher.ts`) and flushing to PostgreSQL in bulk every 15 minutes.
  - **Immediate Low-Latency Slow Path**: State transitions (`UP ⇄ DOWN` or first ping) bypass the memory buffer and commit immediately to the database to ensure zero incident-delay.
  - Graceful process termination handlers (`SIGTERM`, `SIGINT`) guarantee that buffered memory snapshots are flushed prior to shutdown.

- **🚨 Automated Incident Management Lifecycle**:
  - Automatically provisions an `ONGOING` incident with detailed diagnostic metadata (status code, timeout message, timestamp) upon downtime.
  - Automatically transitions incidents to `RESOLVED` when the target endpoint recovers.

- **📱 Instant 1-Click Telegram Alerts**:
  - Zero-friction bot linking using deep-link start parameters (`/start <userId>`).
  - Formatted HTML push notifications dispatched on:
    - Initial monitor activation (`PENDING ➔ UP`)
    - Service outages (`UP ➔ DOWN`)
    - Service recoveries (`DOWN ➔ UP`)
  - Integrated dashboard test button to immediately verify alert delivery.

- **📣 Shareable Public Status Pages (`/status/[userId]`)**:
  - Read-only, unauthenticated public status portal for your end users and stakeholders.
  - Computes 30-day uptime SLA percentages, average latency metrics, and displays ongoing incidents.

- **🔐 Enterprise-Grade Security & Authentication**:
  - NextAuth.js v4 integration supporting **Credentials** (bcrypt salted hashing), **Google OAuth**, and **GitHub OAuth**.
  - Complete email verification and password reset workflows via Hostinger SMTP / Nodemailer.
  - In-memory sliding-window rate limiters protecting authentication, registration, and monitor endpoints.
  - Free-tier quota enforcement (maximum 10 active monitors per account).

- **🎨 Modern Dark Glassmorphism UI**:
  - Built with Tailwind CSS v4, Radix UI primitives, Motion animations, and Sonner toast notifications.

---

## 🏗️ System Architecture

SpiderNode is engineered with a separation of concerns between client rendering, cron orchestration, edge execution, and buffered database transactions.

```
                  ┌─────────────────────────────────────────┐
                  │          Monitoring Scheduler           │
                  │  (Internal node-cron / Vercel Cron)     │
                  └────────────────────┬────────────────────┘
                                       │ Pings every minute
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            cron-logic.ts                │
                  │   Fetches active monitors from Prisma   │
                  │   Concurrent fetch() with 10s timeout   │
                  └────────────────────┬────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ Status Changed? (UP ⇄ DOWN)          │
                    ├─── YES ─────────────┬─── NO ────────┘
                    ▼                     ▼
          [Slow Immediate Path]   [Fast In-Memory Buffer]
                    │                     │
                    │                     │ Queue routine check
                    ├────────────────┐    │ (Pings & stats Map)
                    │                │    ▼
                    ▼                │ ┌──────────────────────┐
       ┌──────────────────────┐      │ │   db-batcher.ts      │
       │   Telegram Bot API   │      │ │ (Flushes every 15m)  │
       │   Instant Alerts     │      │ └──────────┬───────────┘
       └──────────────────────┘      │            │ Bulk createMany /
                                     │            │ concurrent updates
                                     ▼            ▼
                           ┌──────────────────────────────┐
                           │    PostgreSQL (Neon DB)      │
                           │ Prisma ORM v7 (Driver Adap.) │
                           └──────────────────────────────┘
```

### 1. High-Level Architecture
![System Architecture Diagram](root_images/system-arc.png)

### 2. In-Memory Write Batching Pipeline
![In-Memory Batching Flow](root_images/system.png)

---

## 🛠️ Tech Stack

| Domain | Technology | Details |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Components, Turbopack |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Serverless-ready (Neon, Supabase, AWS RDS) |
| **ORM** | [Prisma ORM v7](https://www.prisma.io/) | `@prisma/adapter-pg` driver adapters |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) | Credentials, Google & GitHub OAuth |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) | RTK Query + Redux Persist |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Dark glassmorphism, responsive grid |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) | Dialogs, Dropdowns, Sheets, Tooltips |
| **Icons & Motion** | [Hugeicons](https://hugeicons.com/), [Motion](https://motion.dev/) | Smooth transitions & lightweight iconography |
| **Email Services** | [Nodemailer](https://nodemailer.com/) | Transactional HTML verification & reset templates |
| **Alerts & Push** | [Telegram Bot API](https://core.telegram.org/bots/api) | HTML-formatted instant outage alerts |
| **Process Manager** | [PM2](https://pm2.keymetrics.io/) | Cluster & daemon management (`ecosystem.config.js`) |
| **Liveness Monitoring**| [Healthchecks.io](https://healthchecks.io/) | Dead Man's Switch heartbeat pinging |

---

## 📁 Repository Structure

```text
uptime-tracker/
├── prisma/
│   ├── schema.prisma              # Database schema (User, Monitor, Ping, Incident, Token)
│   └── migrations/                # Version-controlled SQL migrations
├── public/                        # Static assets & public icons
├── root_images/                   # Documentation screenshots & architecture diagrams
├── src/
│   ├── app/                       # Next.js 16 App Router
│   │   ├── (authLayout)/          # Login, Register, Verify Email, Reset Password
│   │   ├── (commonLayout)/        # Marketing pages, Docs, SLA, Terms, Privacy
│   │   ├── (dashboardLayout)/     # Authenticated dashboard, monitors, incidents, profile
│   │   ├── status/[id]/           # Dynamic public status page
│   │   └── api/                   # RESTful API Route Handlers
│   │       ├── auth/              # NextAuth route handler & auth workflows
│   │       ├── cron/              # Cron check & retention cleanup endpoints
│   │       ├── feedback/          # User feedback submission & retrieval
│   │       ├── incidents/         # User incidents history API
│   │       ├── monitors/          # Monitor CRUD, manual ping, and latency telemetry
│   │       ├── status/            # Public status data endpoint
│   │       ├── telegram/          # Webhook handler, connect deep-link, and test alert
│   │       └── user/              # Profile updates, password reset, account deletion
│   ├── components/                # Modular React components
│   │   ├── Auth/                  # Login, registration, and reset form components
│   │   ├── Dashboard/             # Monitor management, incident list, telemetry views
│   │   ├── Status/                # Public status layout and SLA meters
│   │   ├── dashboardLayout/       # App sidebar, navigation, and user menu
│   │   └── ui/                    # Reusable Radix UI & design primitives
│   ├── lib/                       # Core system logic & utilities
│   │   ├── auth.ts                # NextAuth provider & session callbacks
│   │   ├── cleanup-logic.ts       # Automated database retention policy runner
│   │   ├── cron-logic.ts          # Core endpoint polling engine & Telegram dispatcher
│   │   ├── db-batcher.ts          # In-memory buffer & bulk-flush pipeline
│   │   ├── mail.ts                # Nodemailer SMTP transporter & email templates
│   │   ├── prisma.ts              # PrismaClient singleton with connection pooling
│   │   ├── rate-limit.ts          # Sliding-window in-memory rate limiter
│   │   └── telegram.ts            # Telegram Bot API client
│   ├── redux/                     # Redux Toolkit store, auth slice, and RTK Query
│   ├── instrumentation.ts         # Server bootstrap hook for node-cron daemon
│   └── proxy.ts                   # Development proxy helpers
├── ecosystem.config.js            # PM2 configuration for VPS deployments
├── package.json                   # Project dependencies and operational scripts
└── tsconfig.json                  # Strict TypeScript configuration
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **PostgreSQL**: PostgreSQL database (Neon, Supabase, Local, etc.)
- **Package Manager**: `npm`, `yarn`, or `pnpm`

### 2. Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/rakibutsho/uptime-tracker.git
cd uptime-tracker

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# ==============================================================================
# DATABASE CONFIGURATION
# ==============================================================================
DATABASE_URL="postgresql://user:password@localhost:5432/spidernode?schema=public"

# ==============================================================================
# NEXTAUTH AUTHENTICATION
# ==============================================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generate_secret_openssl_rand_base64_32"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# ==============================================================================
# CRON & MONITORING ORCHESTRATION
# ==============================================================================
# "internal" (runs internal node-cron on VPS) or "vercel" (relies on external runner)
CRON_MODE="internal"
CRON_SECRET="your_custom_secure_cron_secret"

# Healthchecks.io Dead Man's Switch URL (Optional)
HC_PING_URL="https://hc-ping.com/your-uuid-here"

# ==============================================================================
# TELEGRAM ALERTS
# ==============================================================================
TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="SpiderNodeAlertsBot"

# ==============================================================================
# TRANSACTIONAL SMTP EMAIL (Email Verification & Password Reset)
# ==============================================================================
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT=465
SMTP_USER="support@yourdomain.com"
SMTP_PASS="your_secure_smtp_password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==============================================================================
# CLOUDINARY (Profile Avatars)
# ==============================================================================
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 4. Database Setup & Client Generation

Push the schema to your PostgreSQL database and generate the Prisma Client:

```bash
# Generate Prisma Client
npx prisma generate

# Sync schema with PostgreSQL
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3007](http://localhost:3007) in your browser.

---

## 🕒 Cron & Polling Engine

SpiderNode features a **Dual-Cron Strategy** to support both self-hosted VPS deployments and serverless platforms like Vercel.

### Strategy 1: Internal Daemon (VPS / Dedicated Server)
When `CRON_MODE="internal"`, Next.js initializes background scheduled tasks via [`src/instrumentation.ts`](file:///home/rakibutsho/Desktop/coding/uptime-tracker/src/instrumentation.ts):
- **Every minute (`* * * * *`)**: Executes `runCronChecks()`, pings due monitors, logs state changes, and sends Telegram alerts.
- **Every 15 minutes (`*/15 * * * *`)**: Invokes `flushBatches()`, bulk-inserting queued pings and updating cumulative statistics.
- **Daily at midnight (`0 0 * * *`)**: Executes `runCleanup()`, purging pings older than 30 days and resolved incidents older than 90 days.
- **Dead Man's Switch**: Automatically pings `HC_PING_URL` upon successful check, or sends `${HC_PING_URL}/fail` if an unhandled error occurs.

### Strategy 2: External HTTP Trigger (Serverless / Vercel Cron)
When hosted in serverless environments where persistent background processes cannot run continuously:
1. Set `CRON_MODE="vercel"` in your environment variables.
2. Trigger the secure HTTP endpoint every minute using Vercel Cron, GitHub Actions, or cron-job.org:

```http
GET /api/cron/check HTTP/1.1
Host: yourdomain.com
Authorization: Bearer <YOUR_CRON_SECRET>
```

---

## 🤖 Telegram Bot Configuration

1. Open Telegram and start a chat with [@BotFather](https://t.me/BotFather).
2. Send `/newbot`, choose a name and a username (e.g., `SpiderNodeAlertsBot`).
3. Copy the HTTP API token to `TELEGRAM_BOT_TOKEN` in your `.env`.
4. Set `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` to your bot's username (without `@`).
5. Configure your webhook URL so incoming deep links route to SpiderNode:

```bash
curl -F "url=https://yourdomain.com/api/telegram/webhook" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

Once configured, users can navigate to **Dashboard ➔ Settings ➔ Telegram** and click **Connect Telegram Account** to link alerts in 1 click!

---

## 🚢 Production Deployment

### VPS Deployment (Ubuntu / Debian + PM2)

SpiderNode includes a pre-configured [`ecosystem.config.js`](file:///home/rakibutsho/Desktop/coding/uptime-tracker/ecosystem.config.js) tailored for production deployments.

```bash
# 1. Clone repository
git clone https://github.com/rakibutsho/uptime-tracker.git /var/www/uptime-tracker
cd /var/www/uptime-tracker

# 2. Install dependencies & build
npm install
npm run build

# 3. Launch with PM2
pm2 start ecosystem.config.js

# 4. Save process list & configure startup on system boot
pm2 save
pm2 startup
```

To manage your production instance:
```bash
# View live application logs
pm2 logs uptime-tracker

# Monitor CPU, Memory, and Event Loop latency
pm2 monit

# Zero-downtime reload
pm2 reload uptime-tracker
```

---

## 📡 API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/monitors` | Protected | Lists all monitors for authenticated user |
| `POST` | `/api/monitors` | Protected | Provisions a new endpoint monitor (max 10) |
| `GET` | `/api/monitors/:id` | Protected | Fetches configuration for a specific monitor |
| `PATCH` | `/api/monitors/:id` | Protected | Updates monitor properties (name, url, interval, active) |
| `DELETE` | `/api/monitors/:id` | Protected | Deletes a monitor and cascades child records |
| `POST` | `/api/monitors/:id/check` | Protected | Immediately triggers a manual on-demand ping |
| `GET` | `/api/monitors/:id/details`| Protected | Fetches latency telemetry history and incident logs |
| `GET` | `/api/incidents` | Protected | Retrieves active and historical incident records |
| `GET` | `/api/status/:userId` | **Public** | Returns public status data for customer-facing status pages |
| `POST` | `/api/telegram/webhook` | **Public** | Handles Telegram bot deep-links (`/start <userId>`) |
| `POST` | `/api/telegram/test` | Protected | Dispatches a test alert to verify Telegram integration |
| `GET` | `/api/cron/check` | Bearer Token | External trigger endpoint for automated checks |
| `GET` | `/api/cron/cleanup` | Bearer Token | Manual trigger for automated 30-day retention cleanup |
| `GET` | `/api/user/profile` | Protected | Fetches user profile, credentials flag, and preferences |
| `PATCH` | `/api/user/profile` | Protected | Updates name, avatar (Cloudinary), password, or timezone |
| `DELETE` | `/api/user/profile` | Protected | Permanently removes user account and associated data |

---

## 🔒 Security Best Practices

- **Zero Client-Side Credentials**: Database credentials, secret keys, and SMTP credentials are strictly accessed within server components or API routes.
- **Adaptive Rate Limiting**: In-memory sliding-window throttling prevents brute-force attempts on registration and monitor creation.
- **Strict Isolation**: All queries enforce user ID foreign-key checks (`where: { id: monitorId, userId: session.user.id }`), preventing horizontal privilege escalation.
- **Data Pruning**: Automated retention cleans up routine historical pings beyond 30 days to avoid unmetered storage usage.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/rakibutsho">Md. Rakibul Islam</a>. Released under the MIT License.</sub>
</div>
