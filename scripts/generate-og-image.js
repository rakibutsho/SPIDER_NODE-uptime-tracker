const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const logoBuffer = fs.readFileSync(path.join(__dirname, "../src/assets/logo.png"));
const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .sans { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .mono { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .kicker { font-size: 13px; font-weight: 700; letter-spacing: 0.25em; fill: #EF4444; text-transform: uppercase; }
      .title { font-size: 58px; font-weight: 900; letter-spacing: -0.04em; fill: #FFFFFF; text-transform: uppercase; line-height: 1.05; }
      .desc { font-size: 20px; font-weight: 400; fill: #8E929B; line-height: 1.5; }
      .brand { font-size: 22px; font-weight: 900; letter-spacing: 0.25em; fill: #FFFFFF; text-transform: uppercase; }
      .brand-sub { font-size: 11px; font-weight: 600; letter-spacing: 0.25em; fill: #8E929B; text-transform: uppercase; }
      .metric-label { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; fill: #8E929B; text-transform: uppercase; }
      .metric-val { font-size: 24px; font-weight: 800; fill: #FFFFFF; letter-spacing: -0.02em; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#0C0D0E" />

  <!-- Outer Frame -->
  <rect x="30" y="30" width="1140" height="570" fill="#121316" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1.5" />

  <!-- Accent Corner Mark -->
  <rect x="30" y="30" width="120" height="4" fill="#EF4444" />

  <!-- Grid Guide Lines -->
  <line x1="30" y1="130" x2="1170" y2="130" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
  <line x1="30" y1="470" x2="1170" y2="470" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />

  <!-- Brand Header -->
  <g transform="translate(70, 58)">
    <rect x="0" y="0" width="52" height="52" fill="#0C0D0E" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" />
    <image href="${logoBase64}" x="6" y="6" width="40" height="40" preserveAspectRatio="xMidYMid meet" />
    <text x="68" y="24" class="sans brand">SPIDERNODE</text>
    <text x="68" y="44" class="mono brand-sub">INFRASTRUCTURE TELEMETRY</text>
  </g>

  <!-- Header Right Status Stamp -->
  <g transform="translate(940, 68)">
    <rect x="0" y="0" width="160" height="32" fill="#0C0D0E" stroke="#EF4444" stroke-opacity="0.4" stroke-width="1" />
    <circle cx="16" cy="16" r="4" fill="#EF4444" />
    <text x="28" y="21" class="mono" font-size="11" font-weight="700" letter-spacing="0.15em" fill="#FFFFFF">SYSTEM ONLINE</text>
  </g>

  <!-- Content Section -->
  <g transform="translate(70, 175)">
    <!-- Kicker -->
    <rect x="0" y="0" width="10" height="10" fill="#EF4444" />
    <text x="20" y="9" class="mono kicker">01 // AUTOMATED SYSTEM SURVEILLANCE</text>

    <!-- Main Headline -->
    <text x="0" y="65" class="sans title">REAL-TIME UPTIME &amp;</text>
    <text x="0" y="130" class="sans title">INCIDENT RESPONSE</text>

    <!-- Description -->
    <text x="0" y="185" class="sans desc">Developer-centric infrastructure monitoring with instant multi-channel alerts,</text>
    <text x="0" y="217" class="sans desc">public status boards, and global sub-minute response latency metrics.</text>
  </g>

  <!-- Connected 4-Metric Telemetry Strip -->
  <g transform="translate(30, 470)">
    <!-- Column 1 -->
    <g transform="translate(40, 25)">
      <text x="0" y="15" class="mono metric-label">01 // LATENCY</text>
      <text x="0" y="45" class="mono metric-val">24ms <tspan font-size="14" fill="#8E929B">AVG</tspan></text>
    </g>
    <line x1="285" y1="0" x2="285" y2="100" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />

    <!-- Column 2 -->
    <g transform="translate(325, 25)">
      <text x="0" y="15" class="mono metric-label">02 // AVAILABILITY</text>
      <text x="0" y="45" class="mono metric-val">99.98% <tspan font-size="14" fill="#10B981">SLA</tspan></text>
    </g>
    <line x1="570" y1="0" x2="570" y2="100" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />

    <!-- Column 3 -->
    <g transform="translate(610, 25)">
      <text x="0" y="15" class="mono metric-label">03 // CADENCE</text>
      <text x="0" y="45" class="mono metric-val">30s <tspan font-size="14" fill="#8E929B">INTERVAL</tspan></text>
    </g>
    <line x1="855" y1="0" x2="855" y2="100" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />

    <!-- Column 4 -->
    <g transform="translate(895, 25)">
      <text x="0" y="15" class="mono metric-label">04 // DISPATCH</text>
      <text x="0" y="45" class="mono metric-val">TELEGRAM <tspan font-size="14" fill="#EF4444">BOT</tspan></text>
    </g>
  </g>
</svg>
`;

const outputPath = path.join(__dirname, "../public/og-image.png");

sharp(Buffer.from(svg))
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(outputPath)
  .then(() => console.log(`✓ OpenGraph preview image successfully written to: ${outputPath}`))
  .catch((err) => {
    console.error("Failed to generate OpenGraph image:", err);
    process.exit(1);
  });

