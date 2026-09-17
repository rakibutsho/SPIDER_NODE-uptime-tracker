import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "SpiderNode | Real-Time Uptime & Infrastructure Monitoring";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0C0D0E",
        padding: "48px 56px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Inner Card Frame */}
      <div
        style={{
          position: "absolute",
          inset: "24px",
          border: "1.5px solid rgba(255, 255, 255, 0.15)",
          backgroundColor: "#121316",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "44px 52px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Red Accent Mark */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "140px",
            height: "4px",
            backgroundColor: "#EF4444",
          }}
        />

        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            paddingBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                backgroundColor: "#0C0D0E",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#EF4444",
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "0.05em",
              }}
            >
              SN
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                SPIDERNODE
              </span>
              <span
                style={{
                  color: "#8E929B",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  marginTop: "2px",
                }}
              >
                INFRASTRUCTURE TELEMETRY
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              padding: "6px 14px",
              backgroundColor: "#0C0D0E",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#EF4444",
              }}
            />
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            margin: "24px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#EF4444",
              }}
            />
            <span
              style={{
                color: "#EF4444",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              01 // AUTOMATED SYSTEM SURVEILLANCE
            </span>
          </div>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "52px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            REAL-TIME UPTIME &amp; INCIDENT RESPONSE
          </h1>
          <p
            style={{
              color: "#8E929B",
              fontSize: "18px",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: "920px",
            }}
          >
            Developer-centric infrastructure monitoring with instant
            multi-channel alerts, public status boards, and global sub-minute
            response latency metrics.
          </p>
        </div>

        {/* Connected 4-Metric Strip */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "22px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{
                color: "#8E929B",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
              }}
            >
              01 // LATENCY
            </span>
            <span
              style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}
            >
              24ms{" "}
              <span style={{ fontSize: "12px", color: "#8E929B" }}>AVG</span>
            </span>
          </div>

          <div
            style={{
              width: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            }}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingLeft: "24px",
            }}
          >
            <span
              style={{
                color: "#8E929B",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
              }}
            >
              02 // AVAILABILITY
            </span>
            <span
              style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}
            >
              99.98%{" "}
              <span style={{ fontSize: "12px", color: "#10B981" }}>SLA</span>
            </span>
          </div>

          <div
            style={{
              width: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            }}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingLeft: "24px",
            }}
          >
            <span
              style={{
                color: "#8E929B",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
              }}
            >
              03 // CADENCE
            </span>
            <span
              style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}
            >
              30s{" "}
              <span style={{ fontSize: "12px", color: "#8E929B" }}>
                INTERVAL
              </span>
            </span>
          </div>

          <div
            style={{
              width: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            }}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingLeft: "24px",
            }}
          >
            <span
              style={{
                color: "#8E929B",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
              }}
            >
              04 // DISPATCH
            </span>
            <span
              style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}
            >
              TELEGRAM{" "}
              <span style={{ fontSize: "12px", color: "#EF4444" }}>BOT</span>
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
