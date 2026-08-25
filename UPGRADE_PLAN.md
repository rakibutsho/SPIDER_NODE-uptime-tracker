# SpiderNode — Full SaaS Upgrade Plan
## International Payment + Advanced Monitoring

---

## Overview

| Phase | কী হবে | Priority |
|---|---|---|
| **Phase 1** | DB Schema (Billing + Advanced Monitoring — একসাথে) | 🔴 Critical |
| **Phase 2** | Plan Limits Middleware | 🔴 Critical |
| **Phase 3** | Advanced Monitoring Engine (TCP, SSL, Keyword, API) | 🔴 Critical |
| **Phase 4** | LemonSqueezy Payment Integration | 🟠 High |
| **Phase 5** | Billing UI Page | 🟠 High |
| **Phase 6** | Advanced Monitor UI (Add/Edit Modal) | 🟠 High |
| **Phase 7** | Email Alerts (Pro Feature) | 🟡 Medium |
| **Phase 8** | Deploy + .env update on server | 🟡 Medium |

---

## PHASE 1 — Database Schema (সব কিছু একসাথে)

### ফাইল: `prisma/schema.prisma`

#### 1A. User Model — Billing Fields

```prisma
model User {
  // ... existing fields ...

  // ── BILLING (NEW) ──────────────────────────────
  plan               String    @default("FREE")       // "FREE" | "PRO" | "TEAM"
  planExpiresAt      DateTime?                         // null = free forever
  lemonSqueezyId     String?                           // LS Customer ID
  subscriptionId     String?                           // LS Subscription ID
  subscriptionStatus String?   @default("inactive")   // "active" | "cancelled" | "expired"
}
```

#### 1B. Monitor Model — Advanced Monitoring Fields

```prisma
model Monitor {
  // ... existing fields ...

  // ── MONITOR TYPE (NEW) ─────────────────────────
  type           String   @default("HTTP")  // "HTTP" | "TCP"

  // ── HTTP METHOD & VALIDATION (NEW) ────────────
  method         String   @default("GET")   // "GET" | "POST" | "PUT" | "PATCH"
  expectedStatus Int?                       // null = any 2xx/3xx accepted
  keyword        String?                    // if set, response must contain this
  customHeaders  String?  @db.Text          // JSON string: {"Authorization": "Bearer ..."}
  customBody     String?  @db.Text          // POST/PUT request body

  // ── SSL MONITORING (NEW) ──────────────────────
  checkSsl       Boolean  @default(false)   // enable SSL expiry check
  sslExpiryDays  Int?                       // days remaining on cert (stored after check)

  // ── TCP MONITORING (NEW) ──────────────────────
  tcpHost        String?                    // hostname for TCP check
  tcpPort        Int?                       // port number for TCP check
}
```

#### Migration Command (after approval)
```bash
npx prisma db push
```
> ✅ Existing monitors-এ কোনো data loss নেই — সব নতুন field-এ default value আছে।

---

## PHASE 2 — Plan Limits Middleware

### নতুন ফাইল: `src/lib/plan-limits.ts`

```typescript
export const PLAN_LIMITS = {
  FREE: {
    monitors: 10,
    minInterval: 5,           // minimum 5 minutes
    advancedMonitoring: false,
    emailAlerts: false,
    statusPages: 1,
    dataRetentionDays: 7,
  },
  PRO: {
    monitors: 50,
    minInterval: 1,           // minimum 1 minute
    advancedMonitoring: true, // TCP, SSL, Keyword, API
    emailAlerts: true,
    statusPages: 5,
    dataRetentionDays: 30,
  },
  TEAM: {
    monitors: 200,
    minInterval: 1,
    advancedMonitoring: true,
    emailAlerts: true,
    statusPages: 999,
    dataRetentionDays: 90,
  },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as Plan] ?? PLAN_LIMITS.FREE;
}
```

### পরিবর্তন: `src/app/api/monitors/route.ts`
```typescript
// BEFORE (hardcoded):
if (currentMonitorsCount >= 10) { ... }

// AFTER (plan-aware):
const user = await prisma.user.findUnique({ where: { id: session.user.id } });
const limits = getPlanLimits(user.plan);
if (currentMonitorsCount >= limits.monitors) { ... }

// Also: Block advanced features for FREE users
if (body.type === "TCP" && !limits.advancedMonitoring) {
  return 403 // "Upgrade to Pro for TCP monitoring"
}
```

---

## PHASE 3 — Advanced Monitoring Engine

### পরিবর্তন: `src/lib/cron-logic.ts`

#### 3A. TCP Monitoring
```typescript
import net from 'net';

async function checkTCP(host: string, port: number, timeoutMs = 10000): Promise<{
  isUp: boolean;
  responseTime: number;
}> {
  // net.Socket দিয়ে connect করবে
  // connect হলে → UP, timeout/error → DOWN
}
```

#### 3B. SSL Certificate Check
```typescript
import https from 'https';

async function checkSSL(url: string): Promise<{
  valid: boolean;
  daysLeft: number;
  expiryDate: Date;
}> {
  // https.request দিয়ে peer certificate নেবে
  // valid_to date থেকে daysLeft calculate করবে
  // daysLeft < 7 → Telegram + Email warning alert পাঠাবে
}
```

#### 3C. Keyword Matching
```typescript
// response body-তে keyword আছে কিনা check
const body = await response.text();
if (monitor.keyword && !body.includes(monitor.keyword)) {
  isUp = false;
  statusMessage = `Keyword "${monitor.keyword}" not found in response`;
}
```

#### 3D. API Validation (Custom Headers/Body/Status)
```typescript
const fetchOptions = {
  method: monitor.method ?? "GET",
  headers: {
    "User-Agent": "SpiderNode/1.0",
    ...(monitor.customHeaders ? JSON.parse(monitor.customHeaders) : {}),
  },
  body: monitor.method !== "GET" && monitor.customBody
        ? monitor.customBody
        : undefined,
};

// Expected status check:
if (monitor.expectedStatus && statusCode !== monitor.expectedStatus) {
  isUp = false;
  statusMessage = `Expected ${monitor.expectedStatus}, got ${statusCode}`;
}
```

#### Engine Flow (Updated)
```
Monitor type?
  ├── TCP  → checkTCP(host, port)
  └── HTTP → fetch(url, options)
               ├── Keyword check (if set)
               ├── Expected status check (if set)
               ├── SSL check (if enabled) → store sslExpiryDays
               └── Normal 2xx/3xx check
```

---

## PHASE 4 — LemonSqueezy Payment Integration

### নতুন ফাইলসমূহ:
- `src/lib/lemonsqueezy.ts` — SDK wrapper
- `src/app/api/billing/checkout/route.ts` — Checkout URL generate
- `src/app/api/billing/webhook/route.ts` — Webhook handler
- `src/app/api/billing/portal/route.ts` — Customer portal URL

### Webhook Events Handle করবে:

| Event | Action |
|---|---|
| `subscription_created` | User plan → "PRO" বা "TEAM", save subscriptionId |
| `subscription_payment_success` | planExpiresAt extend |
| `subscription_cancelled` | subscriptionStatus → "cancelled" |
| `subscription_expired` | Plan → "FREE", limits enforce |

### .env-এ যোগ হবে:
```env
LEMONSQUEEZY_API_KEY="lmsqzy_..."
LEMONSQUEEZY_STORE_ID="12345"
LEMONSQUEEZY_WEBHOOK_SECRET="whs_..."
LEMONSQUEEZY_PRO_VARIANT_ID="11111"
LEMONSQUEEZY_TEAM_VARIANT_ID="22222"
```

---

## PHASE 5 — Billing UI Page

### নতুন ফাইল: `src/app/(dashboardLayout)/dashboard/billing/page.tsx`

**UI Elements:**
- Current plan badge (FREE / PRO / TEAM)
- Monitor usage: `8 / 10 used`
- Next billing date
- Feature comparison card (what's included)
- **"Upgrade to Pro"** CTA button → LemonSqueezy checkout
- Cancel subscription button (Pro/Team users)
- Customer Portal link

---

## PHASE 6 — Advanced Monitor UI

### পরিবর্তন: Dashboard "Add Monitor" / "Edit Monitor" Modal

```
[ Monitor Name ]
[ URL / Hostname ]

Monitor Type: ○ Website (HTTP)  ● TCP Port

── If TCP: ─────────────────────────────────────────
[ Hostname ]    [ Port ]

── If HTTP (Advanced Settings accordion): ──────────
▼ Advanced Settings  🔒 Pro
  HTTP Method:            [ GET ▼ ]
  Expected Status Code:   [ 200 ]
  Keyword to Match:       [ e.g. "Welcome" ]
  ☑ Enable SSL Expiry Check
  Custom Headers (JSON):  [ textarea ]
  Custom Body:            [ textarea ]
────────────────────────────────────────────────────

🔒 = Free users দেখবে কিন্তু click করলে "Upgrade to Pro" modal দেখাবে
```

### Monitor Table-এ নতুন columns:
- **Type badge**: `HTTP` / `TCP` / `API`
- **SSL**: 🟢 45d / 🔴 3d / — (if not enabled)

---

## PHASE 7 — Email Alerts (Pro)

### পরিবর্তন: `src/lib/mail.ts` — নতুন functions

```typescript
// Monitor DOWN হলে email
sendDowntimeAlert(email, monitorName, url, statusCode, time)

// SSL expiry warning
sendSSLExpiryWarning(email, monitorName, domain, daysLeft)

// Monitor UP হলে recovery email
sendRecoveryAlert(email, monitorName, url, downtime)
```

### Alert Matrix:

| Event | Free User | Pro/Team User |
|---|---|---|
| Monitor DOWN | Telegram only | Telegram + Email |
| Monitor UP (recovery) | Telegram only | Telegram + Email |
| SSL Expiry < 7 days | ❌ | Telegram + Email |

---

## PHASE 8 — Deploy

1. `npx prisma db push` — live DB-তে schema migrate
2. `.env` update করো server-এ (LemonSqueezy keys)
3. LemonSqueezy dashboard-এ webhook URL set করো:
   ```
   https://spidernode.site/api/billing/webhook
   ```
4. Build + restart:
   ```bash
   npm run build && pm2 restart all
   ```

---

## Open Questions (Decisions Needed)

> **Q1: Pricing ঠিক আছে?**
> Free (10 monitors) / Pro $5/mo (50 monitors) / Team $15/mo (200 monitors)

> **Q2: SSL Alert কীভাবে চাও?**
> - Option A: SSL expiry < 7 days হলে monitor **UP রেখে** শুধু warning alert *(Recommended)*
> - Option B: SSL expiry < 7 days হলে monitor **DOWN mark** করা

> **Q3: LemonSqueezy account কি create করা হয়েছে?**
> না হলে: [app.lemonsqueezy.com](https://app.lemonsqueezy.com) — আগে এটা করতে হবে
