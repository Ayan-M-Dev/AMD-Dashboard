import type { NextAuthConfig } from 'next-auth';

// authConfig object satisfies NextAuthConfig type.
// This configuration includes:
// 1. Pages: to define custom login page.
// 2. Callbacks: to define custom authorization logic.
// 3. Providers: an empty array to indicate no social login providers.
export const authConfig = {
 pages: {
    signIn: '/login', // Custom login page
 },
 callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // Check if user is logged in
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // Check if user is trying to access the dashboard
      if (isOnDashboard) {
        if (isLoggedIn) return true; // If user is logged in and trying to access dashboard, allow access
        return false; // If user is not logged in and trying to access dashboard, deny access
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl)); // If user is logged in and not trying to access dashboard, redirect to dashboard
      }
      return true; // If user is not logged in and not trying to access dashboard, allow access
    },
 },
 providers: [], // No social login providers
} as NextAuthConfig;