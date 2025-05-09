import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Helper function to resolve API paths correctly in different environments
function resolveApiPath(path: string): string {
  // If the path already includes the .netlify/functions prefix, return it as is
  if (path.includes('/.netlify/functions/')) {
    return path;
  }
  
  // Check if we're in a Netlify environment by looking at the hostname
  const isNetlify = typeof window !== 'undefined' && (
    window.location.hostname.includes('.netlify.app') || 
    window.location.hostname.includes('.netlify.com') ||
    // Also check for localhost + NETLIFY environment variable which could be present in local dev
    (window.location.hostname === 'localhost' && 
     typeof process !== 'undefined' && 
     process.env && 
     process.env.NETLIFY)
  );
  
  // Handle different path formats
  if (isNetlify) {
    // Check for API specific paths
    if (path.startsWith('/api/')) {
      console.log(`Rewriting API path for Netlify: ${path} → /.netlify/functions/api${path.substring(4)}`);
      return `/.netlify/functions/api${path.substring(4)}`;
    }
    // Special case for root API
    else if (path === '/api') {
      console.log(`Rewriting root API path for Netlify: ${path} → /.netlify/functions/api`);
      return '/.netlify/functions/api';
    }
    // Special case for health check
    else if (path === '/health' || path === '/api/health') {
      console.log(`Rewriting health check path for Netlify: ${path} → /.netlify/functions/api/health`);
      return '/.netlify/functions/api/health';
    }
  }
  
  // In development or other environments, use the path as is
  return path;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const resolvedUrl = resolveApiPath(url);
  const res = await fetch(resolvedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const path = queryKey[0] as string;
    const resolvedPath = resolveApiPath(path);
    const res = await fetch(resolvedPath, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        return failureCount < 2; // Retry failed requests up to 2 times
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});
