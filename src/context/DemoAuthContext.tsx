/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { DemoSession } from '../types/auth';

/**
 * PROTOTYPE DEMO AUTHENTICATION CONTEXT (ESG Admin, Reviewer, Contributor & Management)
 * 
 * SECURITY NOTICE:
 * Vite environment variables (prefixed with VITE_) are embedded directly into the
 * client-side bundle and are visible to anyone inspecting the network/source code.
 * This client-side credential verification is implemented solely for prototype demonstration
 * and UI evaluation of the ESG Admin, Reviewer / Approver, Data Contributor, and Management portals.
 * 
 * NEVER use client-side authentication or embed real credentials in production.
 * In production, authentication must be verified by a secure backend service using
 * encrypted tokens (e.g. OAuth 2.0 / OIDC / JWT with HttpOnly cookies).
 */

const SESSION_STORAGE_KEY = 'meil_demo_auth_session';
// For backward compatibility with existing session key
const LEGACY_ADMIN_KEY = 'meil_demo_admin_session';

interface DemoAuthContextType {
  session: DemoSession | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isReviewerAuthenticated: boolean;
  isContributorAuthenticated: boolean;
  isManagementAuthenticated: boolean;
  isAuditorAuthenticated: boolean;
  userRole: 'esg_admin' | 'reviewer' | 'contributor' | 'management' | 'auditor' | null;
  isDemoAdminEnabled: boolean;
  isDemoReviewerEnabled: boolean;
  isDemoContributorEnabled: boolean;
  isDemoManagementEnabled: boolean;
  isDemoAuditorEnabled: boolean;
  loginDemoAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoReviewer: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoContributor: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoManagement: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoAuditor: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: (
    email: string,
    password: string,
    preferredRole?: string
  ) => Promise<{
    success: boolean;
    role?: 'esg_admin' | 'reviewer' | 'contributor' | 'management' | 'auditor';
    redirectPath?: string;
    message?: string;
    error?: string;
  }>;

  fillDemoAdminCredentials: () => { email: string; password: string } | null;
  fillDemoReviewerCredentials: () => { email: string; password: string } | null;
  fillDemoContributorCredentials: () => { email: string; password: string } | null;
  fillDemoManagementCredentials: () => { email: string; password: string } | null;
  fillDemoAuditorCredentials: () => { email: string; password: string } | null;
  demoCredentials: {
    admin: { email: string; password: string };
    reviewer: { email: string; password: string };
    contributor: { email: string; password: string };
    management: { email: string; password: string };
    auditor: { email: string; password: string };
  };
  logout: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<DemoSession | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(LEGACY_ADMIN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed?.authenticated === true &&
          (parsed?.role === 'esg_admin' || parsed?.role === 'reviewer' || parsed?.role === 'contributor' || parsed?.role === 'management' || parsed?.role === 'auditor')
        ) {
          return parsed as DemoSession;
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
    return null;
  });

  // Read environment variables with robust defaults for each portal
  const isDemoAdminEnabled = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false';
  const configuredAdminEmail = (import.meta.env.VITE_DEMO_ADMIN_EMAIL as string) || 'admin@demo.com';
  const configuredAdminPassword = (import.meta.env.VITE_DEMO_ADMIN_PASSWORD as string) || 'Admin@123';

  // Reviewer demo flags & credentials
  const isDemoReviewerEnabled = import.meta.env.VITE_ENABLE_DEMO_REVIEWER_AUTH !== 'false';
  const configuredReviewerEmail = (import.meta.env.VITE_DEMO_REVIEWER_EMAIL as string) || 'reviewer@demo.com';
  const configuredReviewerPassword = (import.meta.env.VITE_DEMO_REVIEWER_PASSWORD as string) || 'Reviewer@123';

  // Contributor demo flags & credentials
  const isDemoContributorEnabled = import.meta.env.VITE_ENABLE_DEMO_CONTRIBUTOR_AUTH !== 'false';
  const configuredContributorEmail = (import.meta.env.VITE_DEMO_CONTRIBUTOR_EMAIL as string) || 'contributor@demo.com';
  const configuredContributorPassword = (import.meta.env.VITE_DEMO_CONTRIBUTOR_PASSWORD as string) || 'Contributor@123';

  // Management demo flags & credentials
  const isDemoManagementEnabled = import.meta.env.VITE_ENABLE_DEMO_MANAGEMENT_AUTH !== 'false';
  const configuredManagementEmail = (import.meta.env.VITE_DEMO_MANAGEMENT_EMAIL as string) || 'management@demo.com';
  const configuredManagementPassword = (import.meta.env.VITE_DEMO_MANAGEMENT_PASSWORD as string) || 'Management@123';

  // Auditor demo flags & credentials
  const isDemoAuditorEnabled = import.meta.env.VITE_ENABLE_DEMO_AUDITOR_AUTH !== 'false';
  const configuredAuditorEmail = (import.meta.env.VITE_DEMO_AUDITOR_EMAIL as string) || 'auditor@demo.com';
  const configuredAuditorPassword = (import.meta.env.VITE_DEMO_AUDITOR_PASSWORD as string) || 'Auditor@123';

  const demoCredentials = {
    admin: { email: configuredAdminEmail, password: configuredAdminPassword },
    reviewer: { email: configuredReviewerEmail, password: configuredReviewerPassword },
    contributor: { email: configuredContributorEmail, password: configuredContributorPassword },
    management: { email: configuredManagementEmail, password: configuredManagementPassword },
    auditor: { email: configuredAuditorEmail, password: configuredAuditorPassword },
  };

  const fillDemoAdminCredentials = () => {
    if (!isDemoAdminEnabled) return null;
    return {
      email: configuredAdminEmail,
      password: configuredAdminPassword,
    };
  };

  const fillDemoReviewerCredentials = () => {
    if (!isDemoReviewerEnabled) return null;
    return {
      email: configuredReviewerEmail,
      password: configuredReviewerPassword,
    };
  };

  const fillDemoContributorCredentials = () => {
    if (!isDemoContributorEnabled) return null;
    return {
      email: configuredContributorEmail,
      password: configuredContributorPassword,
    };
  };

  const fillDemoManagementCredentials = () => {
    if (!isDemoManagementEnabled) return null;
    return {
      email: configuredManagementEmail,
      password: configuredManagementPassword,
    };
  };

  const fillDemoAuditorCredentials = () => {
    if (!isDemoAuditorEnabled) return null;
    return {
      email: configuredAuditorEmail,
      password: configuredAuditorPassword,
    };
  };
  const loginDemo = async (
    email: string,
    password: string,
    preferredRole?: string
  ): Promise<{
    success: boolean;
    role?: 'esg_admin' | 'reviewer' | 'contributor' | 'management' | 'auditor';
    redirectPath?: string;
    message?: string;
    error?: string;
  }> => {
    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    const isPassMatch = (configured: string, ...allowed: string[]) => {
      const candidates = [configured, ...allowed].map((s) => s.trim().toLowerCase());
      return candidates.includes(inputPass.toLowerCase());
    };

    const isEmailMatch = (configured: string, ...aliases: string[]) => {
      const candidates = [configured, ...aliases].map((s) => s.trim().toLowerCase());
      return candidates.includes(inputEmail);
    };

    // ESG Admin
    if (
      (isEmailMatch(configuredAdminEmail, 'admin@demo.com', 'admin@example.com', 'admin@meil.in', 'admin', 'admin@nexus.meil.in', 'esg.admin@meil.in', 'esg-admin@meil.in') &&
      isPassMatch(configuredAdminPassword, 'Admin@123', 'admin123', 'Admin123', 'admin@123', 'admin', 'password', 'Admin@1234')) ||
      (preferredRole === 'esg-admin' && (inputEmail.includes('admin') || isPassMatch('Admin@123', 'admin123', 'admin')))
    ) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'esg_admin',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo ESG Administrator',
          email: inputEmail || configuredAdminEmail,
        },
      };
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.setItem(LEGACY_ADMIN_KEY, JSON.stringify(demoSessionData));
      } catch (e) {
        console.error('Failed to write session:', e);
      }
      setSession(demoSessionData);
      return {
        success: true,
        role: 'esg_admin',
        redirectPath: '/admin/dashboard',
        message: 'ESG Admin demo session initialized.',
      };
    }

    // Reviewer
    if (
      (isEmailMatch(configuredReviewerEmail, 'reviewer@demo.com', 'reviewer@example.com', 'reviewer@meil.in', 'reviewer', 'reviewer@nexus.meil.in') &&
      isPassMatch(configuredReviewerPassword, 'Reviewer@123', 'reviewer123', 'Reviewer123', 'reviewer@123', 'reviewer', 'password')) ||
      (preferredRole === 'reviewer-approver' && (inputEmail.includes('reviewer') || isPassMatch('Reviewer@123', 'reviewer123', 'reviewer')))
    ) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'reviewer',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo Reviewer',
          email: inputEmail || configuredReviewerEmail,
        },
      };
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session:', e);
      }
      setSession(demoSessionData);
      return {
        success: true,
        role: 'reviewer',
        redirectPath: '/reviewer/dashboard',
        message: 'Reviewer demo session initialized.',
      };
    }

    // Data Contributor
    if (
      (isEmailMatch(configuredContributorEmail, 'contributor@demo.com', 'contributor@example.com', 'contributor@meil.in', 'contributor') &&
      isPassMatch(configuredContributorPassword, 'Contributor@123', 'contributor123', 'Contributor123', 'contributor@123', 'contributor', 'password')) ||
      (preferredRole === 'data-contributor' && (inputEmail.includes('contributor') || isPassMatch('Contributor@123', 'contributor123', 'contributor')))
    ) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'contributor',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo Contributor',
          email: inputEmail || configuredContributorEmail,
        },
      };
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session:', e);
      }
      setSession(demoSessionData);
      return {
        success: true,
        role: 'contributor',
        redirectPath: '/contributor/dashboard',
        message: 'Data Contributor demo session initialized.',
      };
    }

    // Executive Management
    if (
      (isEmailMatch(configuredManagementEmail, 'management@demo.com', 'management@example.com', 'management@meil.in', 'director@meil.in', 'management') &&
      isPassMatch(configuredManagementPassword, 'Management@123', 'management123', 'Management123', 'management@123', 'management', 'password')) ||
      (preferredRole === 'management' && (inputEmail.includes('management') || inputEmail.includes('director') || isPassMatch('Management@123', 'management123', 'management')))
    ) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'management',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo Management User',
          email: inputEmail || configuredManagementEmail,
        },
      };
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session:', e);
      }
      setSession(demoSessionData);
      return {
        success: true,
        role: 'management',
        redirectPath: '/management/dashboard',
        message: 'Executive Management demo session initialized.',
      };
    }

    // Auditor
    if (
      (isEmailMatch(configuredAuditorEmail, 'auditor@demo.com', 'auditor@example.com', 'auditor@meil.in', 'assurance@meil.in', 'auditor') &&
      isPassMatch(configuredAuditorPassword, 'Auditor@123', 'auditor123', 'Auditor123', 'auditor@123', 'auditor', 'password')) ||
      (preferredRole === 'auditor-assurer' && (inputEmail.includes('auditor') || isPassMatch('Auditor@123', 'auditor123', 'auditor')))
    ) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'auditor',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo Auditor',
          email: inputEmail || configuredAuditorEmail,
        },
      };
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session:', e);
      }
      setSession(demoSessionData);
      return {
        success: true,
        role: 'auditor',
        redirectPath: '/reviewer/evidence-review',
        message: 'Auditor demo session initialized.',
      };
    }

    // Seamless Demo Mode Fallback:
    // If user enters any email with '@' and password length >= 6 for the selected portal:
    if (inputEmail.includes('@') && inputPass.length >= 6) {
      let resolvedRole: 'esg_admin' | 'reviewer' | 'contributor' | 'management' | 'auditor' = 'esg_admin';
      let redirectPath = '/admin/dashboard';
      let roleTitle = 'ESG Admin';

      if (preferredRole === 'reviewer-approver') {
        resolvedRole = 'reviewer';
        redirectPath = '/reviewer/dashboard';
        roleTitle = 'Reviewer';
      } else if (preferredRole === 'data-contributor') {
        resolvedRole = 'contributor';
        redirectPath = '/contributor/dashboard';
        roleTitle = 'Data Contributor';
      } else if (preferredRole === 'management') {
        resolvedRole = 'management';
        redirectPath = '/management/dashboard';
        roleTitle = 'Executive Management';
      } else if (preferredRole === 'auditor-assurer') {
        resolvedRole = 'auditor';
        redirectPath = '/reviewer/evidence-review';
        roleTitle = 'Auditor';
      }

      const demoSessionData: DemoSession = {
        authenticated: true,
        role: resolvedRole,
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: inputEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || `Demo ${roleTitle}`,
          email: inputEmail,
        },
      };

      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        if (resolvedRole === 'esg_admin') {
          sessionStorage.setItem(LEGACY_ADMIN_KEY, JSON.stringify(demoSessionData));
        } else {
          sessionStorage.removeItem(LEGACY_ADMIN_KEY);
        }
      } catch (e) {
        console.error('Failed to write session:', e);
      }

      setSession(demoSessionData);
      return {
        success: true,
        role: resolvedRole,
        redirectPath,
        message: `Signed in as ${roleTitle} (${inputEmail}).`,
      };
    }

    let roleName = 'account';
    if (preferredRole === 'esg-admin') roleName = 'ESG Admin';
    else if (preferredRole === 'reviewer-approver') roleName = 'Reviewer';
    else if (preferredRole === 'data-contributor') roleName = 'Data Contributor';
    else if (preferredRole === 'management') roleName = 'Executive Management';
    else if (preferredRole === 'auditor-assurer') roleName = 'Auditor';

    return {
      success: false,
      error: `Please enter valid credentials for ${roleName} or flip the Quick Demo switch above for 1-click access.`,
    };
  };

  const loginDemoAdmin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await loginDemo(email, password, 'esg-admin');
    if (res.success && res.role === 'esg_admin') return { success: true };
    return { success: false, error: res.error || 'Invalid ESG Admin credentials.' };
  };

  const loginDemoReviewer = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await loginDemo(email, password, 'reviewer-approver');
    if (res.success && res.role === 'reviewer') return { success: true };
    return { success: false, error: res.error || 'Invalid Reviewer credentials.' };
  };

  const loginDemoContributor = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await loginDemo(email, password, 'data-contributor');
    if (res.success && res.role === 'contributor') return { success: true };
    return { success: false, error: res.error || 'Invalid Data Contributor credentials.' };
  };

  const loginDemoManagement = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await loginDemo(email, password, 'management');
    if (res.success && res.role === 'management') return { success: true };
    return { success: false, error: res.error || 'Invalid Management credentials.' };
  };

  const loginDemoAuditor = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await loginDemo(email, password, 'auditor-assurer');
    if (res.success && res.role === 'auditor') return { success: true };
    return { success: false, error: res.error || 'Invalid Auditor credentials.' };
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_ADMIN_KEY);
    } catch {
      // Ignore
    }
    setSession(null);
  };

  return (
    <DemoAuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session?.authenticated),
        isAdminAuthenticated: Boolean(session?.authenticated && session?.role === 'esg_admin'),
        isReviewerAuthenticated: Boolean(session?.authenticated && session?.role === 'reviewer'),
        isContributorAuthenticated: Boolean(session?.authenticated && session?.role === 'contributor'),
        isManagementAuthenticated: Boolean(session?.authenticated && session?.role === 'management'),
        isAuditorAuthenticated: Boolean(session?.authenticated && session?.role === 'auditor'),
        userRole: session?.role || null,
        isDemoAdminEnabled,
        isDemoReviewerEnabled,
        isDemoContributorEnabled,
        isDemoManagementEnabled,
        isDemoAuditorEnabled,
        loginDemoAdmin,
        loginDemoReviewer,
        loginDemoContributor,
        loginDemoManagement,
        loginDemoAuditor,
        loginDemo,
        fillDemoAdminCredentials,
        fillDemoReviewerCredentials,
        fillDemoContributorCredentials,
        fillDemoManagementCredentials,
        fillDemoAuditorCredentials,
        demoCredentials,
        logout,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = (): DemoAuthContextType => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};

