'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, UserRole } from './types';

interface AuthContextType {
  user: AppUser;
  setRole: (role: UserRole) => void;
  setUser: (user: AppUser) => void;
  isAcmCore: boolean;
  isClubExec: boolean;
  isMember: boolean;
}

const defaultUser: AppUser = {
  id: 'usr-acm-lead-1',
  name: 'Aarav Sharma (ACM Core Lead)',
  email: 'aarav.sharma@acm.campus.edu',
  role: 'ACM_CORE',
  clubAffiliation: 'ACM Student Chapter',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  setRole: () => {},
  setUser: () => {},
  isAcmCore: true,
  isClubExec: false,
  isMember: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('incursion_user_role');
      if (saved) {
        return getRoleProfile(saved as UserRole);
      }
    }
    return defaultUser;
  });

  const setRole = (role: UserRole) => {
    const profile = getRoleProfile(role);
    setUser(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('incursion_user_role', role);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setRole,
        setUser,
        isAcmCore: user.role === 'ACM_CORE',
        isClubExec: user.role === 'CLUB_EXEC' || user.role === 'ACM_CORE',
        isMember: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

function getRoleProfile(role: UserRole): AppUser {
  switch (role) {
    case 'ACM_CORE':
      return {
        id: 'usr-acm-lead-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@acm.campus.edu',
        role: 'ACM_CORE',
        clubAffiliation: 'ACM Student Chapter',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      };
    case 'CLUB_EXEC':
      return {
        id: 'usr-gdsc-lead-2',
        name: 'Priya Patel (GDSC Lead)',
        email: 'priya.patel@gdsc.campus.edu',
        role: 'CLUB_EXEC',
        clubAffiliation: 'GDSC',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      };
    case 'MEMBER':
    default:
      return {
        id: 'usr-student-3',
        name: 'Rohan Verma (Student)',
        email: 'rohan.verma@campus.edu',
        role: 'MEMBER',
        clubAffiliation: 'Campus Community',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      };
  }
}
