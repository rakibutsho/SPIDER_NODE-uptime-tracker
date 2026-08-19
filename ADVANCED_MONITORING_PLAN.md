# Implementation Plan: Advanced Uptime Monitoring

You selected all four advanced monitoring features! To support this, we need to significantly upgrade the database, the backend checker logic, and the dashboard UI.

## 1. Database Schema Updates (`schema.prisma`)
We will add new fields to the `Monitor` model to store advanced configurations:
- `type` (String, default "HTTP") - To distinguish between HTTP/HTTPS and TCP/Port monitoring.
- `method` (String, default "GET") - Support for API POST/PUT requests.
- `body` (Text) & `headers` (JSON) - To send custom payloads and headers for API Validation.
- `expectedStatus` (Int) - If set, the monitor will only be considered UP if it returns this exact status code (e.g., 200).
- `keyword` (String) - If set, the website HTML/JSON must contain this word. If it doesn't, it will be marked as DOWN.
- `checkSsl` (Boolean) - Whether to extract and validate the SSL certificate.
- `sslExpiryDays` (Int) - To store how many days are left on the certificate so we can alert when it drops below a threshold (e.g., 7 days).

## 2. Backend Engine Updates (`cron-logic.ts`)
We will refactor the checking engine to support the new types:
- **TCP Monitoring**: We will use Node.js's `net.Socket` to ping specific IP/Ports without requiring HTTP.
- **SSL Monitoring**: We will use Node.js's `https` module to extract the peer certificate and calculate its expiry date. If it expires in < 7 days, we'll send a Telegram alert.
- **Keyword Matching**: We will read the response text and use `.includes(keyword)`. If missing, we'll throw a specific error ("Keyword not found").
- **API Validation**: We will pass the custom `headers` and `body` in the `fetch` request, and validate the `expectedStatus`.

## 3. UI Dashboard Updates
We will revamp the "Add Monitor" and "Edit Monitor" modals in the Dashboard:
- Add a "Monitor Type" toggle (Website/API vs. TCP Port).
- If TCP is selected, ask for Hostname and Port.
- Add an "Advanced Settings" section (expandable accordion) for HTTP monitors containing:
  - HTTP Method selector (GET, POST, PUT, etc.)
  - Expected Status Code input
  - Keyword Match input
  - Enable SSL Expiry Check toggle
  - Custom Headers (JSON text area)
  - Custom Body (Text area)
- The main table will be updated to display the Monitor Type (e.g., a small "TCP" or "API" badge) and SSL status if enabled.

## Open Questions & Review
> [!IMPORTANT]
> This is a large update that will require a database migration (`npx prisma db push`). Existing monitors will default to standard "HTTP GET" checks and will continue working perfectly.
> 
> **Question for you**: For the SSL Certificate Monitoring, do you want the system to send a separate Telegram alert when the certificate is expiring soon (e.g., 7 days left), or should it just mark the monitor as DOWN? (My recommendation is to keep the monitor UP but send a separate warning alert).

Please approve this plan if you're ready for me to start building this massive upgrade!
