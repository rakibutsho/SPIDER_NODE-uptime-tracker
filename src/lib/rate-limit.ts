export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(identifier: string, options: RateLimitOptions) {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up expired records occasionally to prevent memory leaks
  if (Math.random() < 0.05) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.expiresAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record) {
    rateLimitMap.set(identifier, {
      count: 1,
      expiresAt: now + options.windowMs,
    });
    return { success: true, remaining: options.limit - 1 };
  }

  if (record.expiresAt < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      expiresAt: now + options.windowMs,
    });
    return { success: true, remaining: options.limit - 1 };
  }

  if (record.count >= options.limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: options.limit - record.count };
}

// Utility to get IP from NextRequest
export function getIP(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
