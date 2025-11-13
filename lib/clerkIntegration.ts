/**
 * Clerk Integration Helper
 * 
 * This file provides utilities to integrate Clerk authentication
 * with the existing company/user system.
 */

import { useUser, useAuth } from '@clerk/clerk-react';
import type { User as ClerkUser } from '@clerk/clerk-react';
import type { User } from '../types';

/**
 * Maps Clerk user to internal User type
 */
export const mapClerkUserToInternalUser = (clerkUser: ClerkUser | null | undefined, companyId: string, role: User['role'] = 'Employee'): User | null => {
  if (!clerkUser) return null;

  return {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    role: role, // This should be fetched from your database based on Clerk user ID
    isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
    mfaEnabled: clerkUser.twoFactorEnabled || false,
  };
};

/**
 * Hook to get current user with company context
 */
export const useClerkUserWithCompany = (companyId: string | null) => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { isSignedIn } = useAuth();

  // In a real implementation, you would fetch the user's role from your database
  // For now, we'll use a default role or fetch from localStorage/Supabase
  const getInternalUser = (): User | null => {
    if (!isSignedIn || !clerkUser || !companyId) return null;
    
    // Try to get role from localStorage or database
    // This is a placeholder - you should fetch from your backend
    const storedUserData = localStorage.getItem(`clerk_user_${clerkUser.id}_company_${companyId}`);
    const userData = storedUserData ? JSON.parse(storedUserData) : null;
    const role = userData?.role || 'Employee';

    return mapClerkUserToInternalUser(clerkUser, companyId, role);
  };

  return {
    clerkUser,
    internalUser: getInternalUser(),
    isLoaded: isClerkLoaded,
    isSignedIn: isSignedIn || false,
  };
};

/**
 * Check if Clerk is configured
 */
export const isClerkConfigured = (): boolean => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return !!(key && key !== 'pk_test_your_publishable_key_here' && key.startsWith('pk_'));
};

