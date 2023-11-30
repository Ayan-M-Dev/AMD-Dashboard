// Importing NextAuth and required dependencies
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';

/**
 * Retrieves a user by email from the database.
 * @param email - The email address of the user to retrieve.
 * @returns A Promise resolving to the retrieved user, or undefined if the user is not found.
 */
async function getUser(email: string): Promise<User | undefined> {
 try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
 } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
 }
}

/**
 * Exporting the NextAuth instance with the required configurations and custom providers.
 */
export const { auth, signIn, signOut } = NextAuth({
 ...authConfig,
 providers: [
    Credentials({
      /**
       * Custom authorization function for the credentials provider.
       * @param credentials - The credentials object containing email and password.
       * @returns A Promise resolving to the authenticated user, or null if the credentials are invalid.
       */
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
 ],
});