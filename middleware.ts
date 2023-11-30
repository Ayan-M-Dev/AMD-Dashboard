import NextAuth from 'next-auth'; // Import NextAuth for authentication
import { authConfig } from './auth.config'; // Import the authConfig for the application

export default NextAuth(authConfig).auth; // Export the NextAuth function with the authConfig applied

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], // Matcher is a list of strings where each string represents a route pattern. It uses regex to match the route pattern. Here, it's configured to match all routes except 'api', '_next/static', '_next/image', and '*.png' routes.
};