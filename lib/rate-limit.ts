const buckets = new Map<string, number[]>();

// Wipe stale keys periodically so the map doesn't grow unbounded.
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [key, hits] of buckets) {
    const kept = hits.filter((t) => t > cutoff);
    if (kept.length === 0) buckets.delete(key);
    else buckets.set(key, kept);
  }
}, 60 * 60 * 1000).unref();

/**
 * Sliding-window limiter. Returns true if `key` is still within `max` hits
 * inside the last `windowMs`, and records this hit.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}

export function getClientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
