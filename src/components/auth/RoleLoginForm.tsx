import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  AlertCircle,
  Info,
  ShieldCheck,
  Sparkles,
  UserCheck,
  FileText,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import type { PortalRole } from '../../types/auth';
import { useDemoAuth } from '../../context/DemoAuthContext';

interface RoleLoginFormProps {
  roleId: PortalRole;
  roleTitle: string;
  onForgotPassword: () => void;
  onSubmitSuccess: (message: string) => void;
}

export const RoleLoginForm: React.FC<RoleLoginFormProps> = ({
  roleId,
  roleTitle,
  onForgotPassword,
  onSubmitSuccess,
}) => {
  /**
   * SECURITY ARCHITECTURE NOTE:
   * Client-side credential verification is provided for prototype demonstration
   * of the 5 authorized roles. In production, authentication is handled via
   * secure backend OAuth/OIDC tokens with cryptographic validation.
   */
  const {
    loginDemo,
    demoCredentials,
  } = useDemoAuth();

  const navigate = useNavigate();

  const storageKey = `meil_saved_email_${roleId}`;

  const [email, setEmail] = useState(() => {
    return localStorage.getItem(storageKey) || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(() => {
    return Boolean(localStorage.getItem(storageKey));
  });

  const [isAutoSwitchActive, setIsAutoSwitchActive] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const isEsgAdmin = roleId === 'esg-admin';
  const isReviewer = roleId === 'reviewer-approver';
  const isContributor = roleId === 'data-contributor';
  const isManagement = roleId === 'management';
  const isAuditor = roleId === 'auditor-assurer';

  // Get credentials for current role
  const getDemoCredentialsForRole = () => {
    switch (roleId) {
      case 'esg-admin':
        return demoCredentials.admin;
      case 'reviewer-approver':
        return demoCredentials.reviewer;
      case 'data-contributor':
        return demoCredentials.contributor;
      case 'management':
        return demoCredentials.management;
      case 'auditor-assurer':
        return demoCredentials.auditor;
      default:
        return demoCredentials.admin;
    }
  };

  const roleCreds = getDemoCredentialsForRole();

  // Role icon helper
  const renderRoleIcon = () => {
    if (isEsgAdmin) return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    if (isReviewer) return <UserCheck className="w-4 h-4 text-sky-600" />;
    if (isContributor) return <FileText className="w-4 h-4 text-teal-600" />;
    if (isManagement) return <BarChart3 className="w-4 h-4 text-indigo-600" />;
    if (isAuditor) return <ShieldCheck className="w-4 h-4 text-purple-600" />;
    return <Info className="w-4 h-4 text-blue-600" />;
  };

  // Switch Toggle Handler: Fills demo mail and password automatically and then signs in
  const handleToggleDemoSwitch = async () => {
    if (isLoading) return;

    if (isAutoSwitchActive) {
      // Toggle off: clear inputs
      setIsAutoSwitchActive(false);
      setEmail('');
      setPassword('');
      setStatusNotice(null);
      setErrors({});
      return;
    }

    // Toggle on: Fill email & password and automatically sign in!
    setIsAutoSwitchActive(true);
    setErrors({});
    setEmail(roleCreds.email);
    setPassword(roleCreds.password);
    setStatusNotice(`Demo credentials auto-filled. Signing in as ${roleTitle}...`);
    setIsLoading(true);

    try {
      // Smooth realistic transition so user observes the autofill and submission
      await new Promise((resolve) => setTimeout(resolve, 400));
      const result = await loginDemo(roleCreds.email, roleCreds.password, roleId);
      setIsLoading(false);

      if (result.success && result.redirectPath) {
        setStatusNotice(`Signed in successfully! Redirecting to ${roleTitle} portal...`);
        onSubmitSuccess(result.message || `Signed in as ${roleTitle} (Demo Mode)`);
        navigate(result.redirectPath);
      } else {
        setIsAutoSwitchActive(false);
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Authentication failed. Please verify credentials.',
        }));
      }
    } catch {
      setIsLoading(false);
      setIsAutoSwitchActive(false);
      setErrors((prev) => ({ ...prev, general: 'An error occurred during authentication.' }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Work email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid work email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));
    setStatusNotice(`Authenticating credentials for ${roleTitle}...`);

    // Handle remember email safely
    if (rememberEmail) {
      localStorage.setItem(storageKey, email.trim());
    } else {
      localStorage.removeItem(storageKey);
    }

    try {
      const result = await loginDemo(email, password, roleId);
      setIsLoading(false);

      if (result.success && result.redirectPath) {
        setStatusNotice(`Authenticated! Initializing ${roleTitle} session...`);
        onSubmitSuccess(result.message || `Signed in successfully as ${roleTitle}!`);
        navigate(result.redirectPath);
        return;
      }

      setStatusNotice(null);
      setErrors((prev) => ({
        ...prev,
        general: result.error || 'Authentication failed. Flip the Quick Demo switch above for 1-click access.',
      }));
    } catch {
      setIsLoading(false);
      setStatusNotice(null);
      setErrors((prev) => ({ ...prev, general: 'An error occurred while signing in.' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-800" noValidate>
      {/* 
        ========================================================================
        DEMO AUTO-FILL & SIGN-IN SWITCH
        When the user clicks the switch, demo email & password auto-populate 
        and the user is automatically signed into the portal.
        ========================================================================
      */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-sky-50/80 border border-emerald-300/80 shadow-xs transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg transition-colors ${
                isAutoSwitchActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isAutoSwitchActive ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  Demo Auto-Fill &amp; Sign In
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-200/90 text-emerald-900 border border-emerald-300">
                  1-Click Switch
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                Click switch to auto-fill {roleTitle} demo credentials &amp; sign in
              </p>
            </div>
          </div>

          {/* Interactive Switch Component */}
          <button
            type="button"
            role="switch"
            aria-checked={isAutoSwitchActive}
            disabled={isLoading}
            onClick={handleToggleDemoSwitch}
            title={
              isAutoSwitchActive
                ? 'Turn off demo auto-sign in'
                : 'Turn on: Auto-fill demo credentials and sign in immediately'
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              isAutoSwitchActive ? 'bg-emerald-600' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          >
            <span className="sr-only">Toggle demo credentials auto-fill and sign in</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isAutoSwitchActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Dynamic Live Status Notice */}
        {statusNotice ? (
          <div className="mt-2.5 pt-2 border-t border-emerald-200/90 flex items-center justify-between text-xs text-emerald-900 font-medium bg-emerald-100/70 px-2.5 py-1.5 rounded-lg animate-fadeIn">
            <span className="inline-flex items-center gap-1.5">
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{statusNotice}</span>
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-900 select-all">
              {roleCreds.email}
            </span>
          </div>
        ) : (
          /* Preset Credentials Summary */
          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              {renderRoleIcon()}
              <span>Demo Account:</span>
              <code className="font-mono font-semibold text-slate-800 bg-white/70 px-1 py-0.5 rounded border border-emerald-200/50">
                {roleCreds.email}
              </code>
            </div>
            <div className="flex items-center gap-1">
              <span>Password:</span>
              <code className="font-mono font-semibold text-slate-800 bg-white/70 px-1 py-0.5 rounded border border-emerald-200/50">
                {roleCreds.password}
              </code>
            </div>
          </div>
        )}
      </div>

      {/* General Form Error */}
      {errors.general && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Work Email Field */}
      <div>
        <label
          htmlFor="work-email"
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Work Email <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="work-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
            placeholder="name@company.com"
            className={`w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
            }`}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Password <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-medium text-[#003B73] hover:text-[#00264D] hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-[#003B73] rounded"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
            placeholder="••••••••"
            className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.password
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Email Checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
            className="w-4 h-4 text-[#003B73] border-slate-300 rounded focus:ring-[#003B73]"
          />
          <span className="text-xs text-slate-600 font-medium">Remember email</span>
        </label>
        <span className="text-[11px] text-slate-400">
          Or use switch above for 1-click login
        </span>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-2.5 px-4 bg-[#003B73] hover:bg-[#002B54] active:bg-[#002244] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003B73] focus:ring-offset-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </form>
  );
};
