import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { connectToDatabase } from './mongodb';
import User from '../models/User';
import { initialUsers } from '../src/data/initialData';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        role: { label: 'Role', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;
        const identifier = (credentials.username as string).toLowerCase().trim();
        const inputRole = ((credentials.role as string) || 'STUDENT').toUpperCase();

        // 1. Direct match for quick demo / standard role aliases
        if (identifier === 'admin' || identifier === 'admin_user' || identifier === 'admin@helpinghearts.lk' || inputRole === 'ADMIN') {
          const adminUser = initialUsers.find(u => u.role === 'ADMIN');
          if (adminUser) {
            return {
              id: adminUser.id,
              name: adminUser.name,
              email: adminUser.email,
              role: 'ADMIN'
            };
          }
        }

        if (identifier === 'lecturer' || identifier === 'lecturer_user' || identifier === 'lecturer@helpinghearts.lk') {
          const lecUser = initialUsers.find(u => u.role === 'LECTURER');
          if (lecUser) {
            return {
              id: lecUser.id,
              name: lecUser.name,
              email: lecUser.email,
              role: 'LECTURER'
            };
          }
        }

        if (identifier === 'counselling' || identifier === 'counselling_user' || identifier === 'counselling@helpinghearts.lk') {
          const counUser = initialUsers.find(u => u.role === 'COUNSELLING_ADMIN');
          if (counUser) {
            return {
              id: counUser.id,
              name: counUser.name,
              email: counUser.email,
              role: 'COUNSELLING_ADMIN'
            };
          }
        }

        if (identifier === 'student' || identifier === 'student_user' || identifier === 'student@helpinghearts.lk') {
          const stdUser = initialUsers.find(u => u.role === 'STUDENT');
          if (stdUser) {
            return {
              id: stdUser.id,
              name: stdUser.name,
              email: stdUser.email,
              role: 'STUDENT'
            };
          }
        }

        // 2. Check Database by username, email, or id
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({
            $or: [
              { username: identifier },
              { email: identifier },
              { id: identifier }
            ]
          }).lean();

          if (dbUser) {
            const rawRole = (dbUser as any).role || inputRole;
            const normalizedRole = String(rawRole).toUpperCase();
            return {
              id: (dbUser as any).id || (dbUser as any)._id?.toString() || `usr_${Date.now()}`,
              name: (dbUser as any).name || 'Authenticated User',
              email: (dbUser as any).email || (identifier.includes('@') ? identifier : `${identifier}@helpinghearts.lk`),
              role: normalizedRole
            };
          }
        } catch (e) {
          console.warn('DB lookup failed in auth, checking initialData fallback', e);
        }

        // 3. Fallback: match against initialUsers by email, username, or id
        const foundUser = initialUsers.find(
          u => u.email.toLowerCase() === identifier ||
               u.id.toLowerCase() === identifier ||
               (u as any).username?.toLowerCase() === identifier
        );
        if (foundUser) {
          return {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: String(foundUser.role).toUpperCase()
          };
        }

        // 4. Fallback: Role-based fallback
        const foundByRole = initialUsers.find(u => String(u.role).toUpperCase() === inputRole);
        if (foundByRole) {
          return {
            id: foundByRole.id,
            name: foundByRole.name,
            email: foundByRole.email,
            role: String(foundByRole.role).toUpperCase()
          };
        }

        // 5. Default fallback
        const mockName = inputRole === 'ADMIN' ? 'Chief Administrator' :
                         inputRole === 'LECTURER' ? 'Miss Ramsina Farvin Jelaldeen' :
                         inputRole === 'COUNSELLING_ADMIN' ? 'Counselling Desk Manager' : 'Saman Kumara';

        return {
          id: 'usr_' + Date.now(),
          name: mockName,
          email: identifier.includes('@') ? identifier : `${identifier}@helpinghearts.lk`,
          role: inputRole
        };
      }
    })
  ]
});
