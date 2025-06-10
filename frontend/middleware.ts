import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 100; // per hour

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userRateLimit = rateLimitMap.get(ip);
    
    if (!userRateLimit || now - userRateLimit.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      userRateLimit.count++;
      if (userRateLimit.count > RATE_LIMIT_MAX_REQUESTS) {
        return new NextResponse('Rate limit exceeded', { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
          }
        });
      }
    }
    
    // Clean up old entries
    if (rateLimitMap.size > 10000) {
      const cutoff = now - RATE_LIMIT_WINDOW;
      const entriesToDelete: string[] = [];
      rateLimitMap.forEach((value, key) => {
        if (value.lastReset < cutoff) {
          entriesToDelete.push(key);
        }
      });
      entriesToDelete.forEach(key => rateLimitMap.delete(key));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};