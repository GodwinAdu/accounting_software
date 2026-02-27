# User Caching Strategy

## Current Implementation ✅

Your `session.ts` already implements caching using:

1. **React's `cache()` function** - Request-level caching
2. **In-memory cache** - 15-minute TTL for user data
3. **JWT verification** - Token-based authentication

## How It Works

```typescript
// Request-level cache (per-request deduplication)
export const currentUser = cache(async () => {
  const user = await getAuthenticatedUser();
  return user;
});

// In-memory cache (cross-request, 15 min TTL)
const sessionCache: { [key: string]: { user: User; timestamp: number } } = {};
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
```

### Cache Layers

1. **Request Cache** (React `cache()`)
   - Deduplicates calls within same request
   - Automatically cleared after request completes
   - Perfect for multiple components calling `currentUser()`

2. **In-Memory Cache** (sessionCache)
   - Persists across requests (same serverless instance)
   - 15-minute TTL
   - Reduces database queries

3. **JWT Token**
   - Stored in httpOnly cookie
   - Contains basic user info
   - Verified on each request

## Professional Improvements

### 1. Add Redis Cache (Production)

For multi-instance deployments:

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

async function getCachedUser(userId: string): Promise<User | null> {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return cached as User;
  
  const user = await fetchUserById(userId);
  if (user) {
    await redis.setex(`user:${userId}`, 900, user); // 15 min
  }
  return user;
}
```

### 2. Cache Invalidation

```typescript
// Clear cache when user data changes
export async function invalidateUserCache(userId: string) {
  // Clear in-memory cache
  delete sessionCache[userId];
  
  // Clear Redis cache (if using)
  await redis.del(`user:${userId}`);
}

// Use in update actions
async function updateUser(userId: string, data: any) {
  await User.findByIdAndUpdate(userId, data);
  await invalidateUserCache(userId); // Clear cache
}
```

### 3. Optimized Session Helper

```typescript
// lib/helpers/optimized-session.ts
import { cache } from "react";
import { unstable_cache } from "next/cache";

// Request-level cache
export const currentUser = cache(async () => {
  return await getCachedUser();
});

// Next.js Data Cache (persists across requests)
const getCachedUser = unstable_cache(
  async () => {
    const user = await getAuthenticatedUser();
    return user;
  },
  ['current-user'],
  {
    revalidate: 900, // 15 minutes
    tags: ['user-session']
  }
);

// Invalidate when needed
export async function revalidateUserSession() {
  revalidateTag('user-session');
}
```

## Best Practices ✅

### 1. Use in Server Actions

```typescript
// lib/actions/example.action.ts
import { currentUser } from "@/lib/helpers/session";

export async function myAction() {
  const user = await currentUser(); // Cached!
  
  if (!user) {
    return { error: "Unauthorized" };
  }
  
  // Use user data
  const data = await fetchData(user.organizationId);
  return { success: true, data };
}
```

### 2. Use in Server Components

```typescript
// app/dashboard/page.tsx
import { currentUser } from "@/lib/helpers/session";

export default async function DashboardPage() {
  const user = await currentUser(); // Cached!
  
  if (!user) redirect('/login');
  
  return <div>Welcome {user.fullName}</div>;
}
```

### 3. Multiple Calls = Single Query

```typescript
// All these calls use the same cached result
const user1 = await currentUser(); // DB query
const user2 = await currentUser(); // From cache
const user3 = await currentUser(); // From cache
```

## Cache Invalidation Triggers

Invalidate cache when:
- User updates profile
- User changes password
- User permissions change
- User role changes
- User logs out

```typescript
// Example: Update profile action
export async function updateProfile(data: ProfileData) {
  const user = await currentUser();
  
  await User.findByIdAndUpdate(user.id, data);
  
  // Clear cache
  await clearUserCache(user.id);
  
  return { success: true };
}
```

## Performance Metrics

### Without Caching
- 50-100ms per database query
- 10 components = 10 queries = 500-1000ms

### With Request Cache
- 50-100ms first query
- 0ms subsequent queries
- 10 components = 1 query = 50-100ms

### With In-Memory Cache
- 0ms if cached (within 15 min)
- 50-100ms if expired

## Monitoring

```typescript
// Add cache hit/miss tracking
let cacheHits = 0;
let cacheMisses = 0;

async function getAuthenticatedUser(): Promise<User | null> {
  const cachedData = sessionCache[id];
  
  if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
    cacheHits++;
    console.log(`Cache hit rate: ${(cacheHits/(cacheHits+cacheMisses)*100).toFixed(2)}%`);
    return cachedData.user;
  }
  
  cacheMisses++;
  // Fetch from DB...
}
```

## Recommendations

✅ **Current setup is good for:**
- Single-instance deployments
- Development
- Small to medium traffic

🚀 **Upgrade to Redis when:**
- Multiple server instances
- High traffic (1000+ req/min)
- Need cache sharing across instances
- Production environment

## Summary

Your current caching implementation is **professional and production-ready** for most use cases. The combination of React's `cache()` and in-memory caching provides excellent performance with minimal complexity.

Consider Redis only when scaling to multiple instances or experiencing cache-related performance issues.
