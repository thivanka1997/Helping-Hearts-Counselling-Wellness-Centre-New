'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/src/types';
import { initialUsers } from '@/src/data/initialData';

export function useStudentUser(): {
  user: User;
  updateStudentName: (newName: string, extra?: { phone?: string; email?: string }) => Promise<void>;
  resetStudentName: () => void;
} {
  const { data: session, update } = useSession();
  const defaultStudent = initialUsers.find((u) => u.role === 'STUDENT') || initialUsers[0];

  const [name, setName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hh_student_name');
      if (stored) return stored;
    }
    return (session?.user as any)?.name || defaultStudent.name;
  });

  const [phone, setPhone] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hh_student_phone');
      if (stored) return stored;
    }
    return (session?.user as any)?.phone || defaultStudent.phone || '+94 75 123 4567';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hh_student_name');
      if (stored) {
        setName(stored);
      } else if (session?.user?.name) {
        setName(session.user.name);
      }
    }

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ name?: string; phone?: string }>;
      if (customEvent.detail?.name) setName(customEvent.detail.name);
      if (customEvent.detail?.phone) setPhone(customEvent.detail.phone);
    };

    window.addEventListener('student-name-updated', handleCustomEvent);
    return () => window.removeEventListener('student-name-updated', handleCustomEvent);
  }, [session]);

  const updateStudentName = useCallback(
    async (newName: string, extra?: { phone?: string; email?: string }) => {
      const trimmedName = newName.trim();
      if (!trimmedName) return;

      setName(trimmedName);
      if (extra?.phone) setPhone(extra.phone);

      if (typeof window !== 'undefined') {
        localStorage.setItem('hh_student_name', trimmedName);
        if (extra?.phone) localStorage.setItem('hh_student_phone', extra.phone);
        window.dispatchEvent(
          new CustomEvent('student-name-updated', {
            detail: { name: trimmedName, phone: extra?.phone }
          })
        );
      }

      // Update NextAuth session
      try {
        if (update) {
          await update({ name: trimmedName });
        }
      } catch (err) {
        console.warn('Failed to update NextAuth session:', err);
      }

      // Update MongoDB User record
      try {
        const userId = (session?.user as any)?.id || defaultStudent.id;
        await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            ...(extra?.phone ? { phone: extra.phone } : {}),
            ...(extra?.email ? { email: extra.email } : {})
          })
        });
      } catch (err) {
        console.warn('Failed to sync updated user name to database:', err);
      }
    },
    [session, update, defaultStudent.id]
  );

  const resetStudentName = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hh_student_name');
      localStorage.removeItem('hh_student_phone');
      localStorage.removeItem('hh_student_user');
      window.dispatchEvent(
        new CustomEvent('student-name-updated', {
          detail: { name: defaultStudent.name, phone: defaultStudent.phone }
        })
      );
    }
    setName(defaultStudent.name);
    if (defaultStudent.phone) setPhone(defaultStudent.phone);
  }, [defaultStudent]);

  const currentUser: User = {
    ...((session?.user as any) || defaultStudent),
    name: name || (session?.user as any)?.name || defaultStudent.name,
    phone: phone || (session?.user as any)?.phone || defaultStudent.phone,
    role: 'STUDENT'
  };

  return { user: currentUser, updateStudentName, resetStudentName };
}
