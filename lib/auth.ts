import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { connectToDatabase } from './mongodb';
import User from '../models/User';
import Registration from '../models/Registration';
import Lecturer from '../models/Lecturer';
import { initialUsers, initialRegistrations, initialLecturers } from '../src/data/initialData';

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

        // Quick demo student alias: check DB first in case student name was updated
        if (identifier === 'student' || identifier === 'student_user' || identifier === 'student@helpinghearts.lk') {
          try {
            await connectToDatabase();
            const dbStudent = await User.findOne({
              $or: [{ id: 'usr-student-1' }, { role: 'STUDENT' }, { email: 'student@helpinghearts.lk' }]
            }).lean();
            if (dbStudent && (dbStudent as any).name) {
              return {
                id: (dbStudent as any).id || (dbStudent as any)._id?.toString() || 'usr-student-1',
                name: (dbStudent as any).name,
                email: (dbStudent as any).email || 'student@helpinghearts.lk',
                role: 'STUDENT'
              };
            }
          } catch {}

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

        // 2. Check MongoDB User collection (case-insensitive for username/email/name)
        try {
          await connectToDatabase();
          const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const ciRegex = { $regex: new RegExp(`^${escaped}$`, 'i') };

          const dbUser = await User.findOne({
            $or: [
              { username: ciRegex },
              { email: ciRegex },
              { id: identifier },
              { name: ciRegex }
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
          console.warn('DB lookup in User failed, trying Lecturer/Registration collection:', e);
        }

        // 2b. Check MongoDB Lecturer collection (case-insensitive for username/email/name)
        try {
          await connectToDatabase();
          const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const ciRegex = { $regex: new RegExp(`^${escaped}$`, 'i') };

          const dbLecturer = await Lecturer.findOne({
            $or: [
              { username: ciRegex },
              { email: ciRegex },
              { id: identifier },
              { name: ciRegex }
            ]
          }).lean();

          if (dbLecturer) {
            const lecUserId = (dbLecturer as any).userId || (dbLecturer as any).id;
            const lecName = (dbLecturer as any).name || 'Faculty Member';
            const lecEmail = (dbLecturer as any).email || (identifier.includes('@') ? identifier : `${identifier}@helpinghearts.lk`);
            const lecUsername = (dbLecturer as any).username || identifier;
            const lecPassword = (dbLecturer as any).password;

            // Sync to User collection
            try {
              await User.findOneAndUpdate(
                { $or: [{ id: lecUserId }, { email: ciRegex }, { username: ciRegex }] },
                {
                  id: lecUserId,
                  name: lecName,
                  email: lecEmail,
                  role: 'LECTURER',
                  phone: (dbLecturer as any).phone,
                  avatar: (dbLecturer as any).photo,
                  username: lecUsername,
                  password: lecPassword,
                  assignedPassword: lecPassword,
                  status: 'ACTIVE'
                },
                { upsert: true, new: true }
              );
            } catch {}

            return {
              id: lecUserId,
              name: lecName,
              email: lecEmail,
              role: 'LECTURER'
            };
          }
        } catch (e) {
          console.warn('Lecturer lookup in auth failed:', e);
        }

        // 3. Check MongoDB Registration collection (case-insensitive for username/email/name)
        try {
          await connectToDatabase();
          const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const ciRegex = { $regex: new RegExp(`^${escaped}$`, 'i') };

          const dbReg = await Registration.findOne({
            $or: [
              { assignedUsername: ciRegex },
              { email: ciRegex },
              { studentId: identifier },
              { id: identifier },
              { fullName: ciRegex }
            ]
          }).lean();

          if (dbReg) {
            const studentId = (dbReg as any).studentId || `usr_${(dbReg as any).id}`;
            const studentName = (dbReg as any).fullName || 'Student Learner';
            const studentEmail = (dbReg as any).email || (identifier.includes('@') ? identifier : `${identifier}@helpinghearts.lk`);

            // Sync to User collection
            try {
              await User.findOneAndUpdate(
                { $or: [{ id: studentId }, { email: ciRegex }, { username: ciRegex }] },
                {
                  id: studentId,
                  name: studentName,
                  email: studentEmail,
                  role: 'STUDENT',
                  phone: (dbReg as any).phone,
                  username: (dbReg as any).assignedUsername || identifier,
                  status: 'ACTIVE'
                },
                { upsert: true, new: true }
              );
            } catch {}

            return {
              id: studentId,
              name: studentName,
              email: studentEmail,
              role: 'STUDENT'
            };
          }
        } catch (e) {
          console.warn('Registration lookup in auth failed:', e);
        }

        // 4. Fallback: Check initialRegistrations (case-insensitive)
        const foundReg = initialRegistrations.find(
          r => r.assignedUsername?.toLowerCase() === identifier ||
               r.email.toLowerCase() === identifier ||
               r.fullName.toLowerCase() === identifier ||
               r.studentId?.toLowerCase() === identifier ||
               r.id.toLowerCase() === identifier
        );
        if (foundReg) {
          return {
            id: foundReg.studentId || `usr_${foundReg.id}`,
            name: foundReg.fullName,
            email: foundReg.email,
            role: 'STUDENT'
          };
        }

        // 4b. Fallback: match against initialLecturers
        const foundLecturer = initialLecturers.find(
          l => (l as any).username?.toLowerCase() === identifier ||
               l.email.toLowerCase() === identifier ||
               l.id.toLowerCase() === identifier ||
               l.name.toLowerCase() === identifier
        );
        if (foundLecturer) {
          return {
            id: foundLecturer.id,
            name: foundLecturer.name,
            email: foundLecturer.email,
            role: 'LECTURER'
          };
        }

        // 5. Fallback: match against initialUsers by email, username, or id
        const foundUser = initialUsers.find(
          u => u.email.toLowerCase() === identifier ||
               u.id.toLowerCase() === identifier ||
               (u as any).username?.toLowerCase() === identifier ||
               u.name.toLowerCase() === identifier
        );
        if (foundUser) {
          return {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: String(foundUser.role).toUpperCase()
          };
        }

        // 6. User entered a custom student username / email: derive clean display name
        const namePart = identifier.includes('@') ? identifier.split('@')[0] : identifier;
        const cleanName = namePart
          .replace(/[@._-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
        const studentName = cleanName || (inputRole === 'ADMIN' ? 'Chief Administrator' :
                             inputRole === 'LECTURER' ? 'Miss Ramsina Farvin Jelaldeen' :
                             inputRole === 'COUNSELLING_ADMIN' ? 'Counselling Desk Manager' : 'Student Learner');
        const studentUserId = `usr_${Date.now()}`;
        const studentEmail = identifier.includes('@') ? identifier : `${identifier}@helpinghearts.lk`;

        // Upsert to User collection so changes made later will persist
        try {
          await connectToDatabase();
          await User.findOneAndUpdate(
            { $or: [{ username: identifier }, { email: studentEmail }] },
            {
              id: studentUserId,
              name: studentName,
              email: studentEmail,
              role: inputRole,
              username: identifier,
              status: 'ACTIVE'
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch {}

        return {
          id: studentUserId,
          name: studentName,
          email: studentEmail,
          role: inputRole
        };
      }
    })
  ]
});
