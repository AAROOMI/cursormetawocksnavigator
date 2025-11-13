import React, { useEffect, useState } from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignIn, 
  SignUp,
  useUser,
  useAuth,
  UserButton
} from '@clerk/clerk-react';
import { useClerkUserWithCompany, isClerkConfigured } from '../lib/clerkIntegration';
import type { User, CompanyProfile } from '../types';

interface ClerkAuthWrapperProps {
  children: React.ReactNode;
  onUserChange?: (user: User | null, companyId: string | null) => void;
  companies: CompanyProfile[];
  currentCompanyId: string | null;
  setCurrentCompanyId: (id: string | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

/**
 * Clerk Authentication Wrapper Component
 * 
 * This component handles Clerk authentication and integrates it with
 * the existing company/user system.
 */
export const ClerkAuthWrapper: React.FC<ClerkAuthWrapperProps> = ({
  children,
  onUserChange,
  companies,
  currentCompanyId,
  setCurrentCompanyId,
  theme,
  toggleTheme
}) => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(currentCompanyId);

  // Check if Clerk is configured
  const clerkConfigured = isClerkConfigured();

  useEffect(() => {
    if (!clerkConfigured) {
      // Clerk not configured, let the app use custom auth
      return;
    }

    if (isClerkLoaded && isSignedIn && clerkUser) {
      // User is signed in with Clerk
      // Try to find or assign a company for this user
      if (!selectedCompanyId && companies.length > 0) {
        // For now, assign the first company or let user select
        // In production, you'd fetch this from your database
        const userCompanyId = localStorage.getItem(`clerk_user_${clerkUser.id}_company`);
        if (userCompanyId && companies.find(c => c.id === userCompanyId)) {
          setSelectedCompanyId(userCompanyId);
          setCurrentCompanyId(userCompanyId);
        } else if (companies.length === 1) {
          setSelectedCompanyId(companies[0].id);
          setCurrentCompanyId(companies[0].id);
        }
      }

      // Get user role from database/localStorage
      const storedUserData = localStorage.getItem(`clerk_user_${clerkUser.id}_company_${selectedCompanyId}`);
      const userData = storedUserData ? JSON.parse(storedUserData) : null;
      const role = userData?.role || 'Employee';

      const internalUser: User = {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        role: role,
        isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        mfaEnabled: clerkUser.twoFactorEnabled || false,
      };

      if (onUserChange) {
        onUserChange(internalUser, selectedCompanyId);
      }
    } else if (isClerkLoaded && !isSignedIn) {
      // User is signed out
      if (onUserChange) {
        onUserChange(null, null);
      }
      setSelectedCompanyId(null);
      setCurrentCompanyId(null);
    }
  }, [isClerkLoaded, isSignedIn, clerkUser, selectedCompanyId, companies, clerkConfigured, onUserChange, setCurrentCompanyId]);

  // If Clerk is not configured, render children directly (use custom auth)
  if (!clerkConfigured) {
    return <>{children}</>;
  }

  // Show loading state while Clerk is initializing
  if (!isClerkLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''}`}>
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Cybersecurity Controls Navigator
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Sign in to your account to continue
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
              <SignIn 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none",
                  }
                }}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    // Switch to sign up - Clerk handles this
                    window.location.hash = '#/sign-up';
                  }}
                  className="text-teal-600 hover:text-teal-500 dark:text-teal-400"
                >
                  Sign up
                </button>
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Add company selector if user has access to multiple companies */}
        {companies.length > 1 && !selectedCompanyId && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-4">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please select a company to continue.
              </p>
              <select
                value={selectedCompanyId || ''}
                onChange={(e) => {
                  const companyId = e.target.value;
                  setSelectedCompanyId(companyId);
                  setCurrentCompanyId(companyId);
                  localStorage.setItem(`clerk_user_${clerkUser?.id}_company`, companyId);
                }}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="">Select a company...</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Render the main app */}
        {children}
      </SignedIn>
    </>
  );
};

