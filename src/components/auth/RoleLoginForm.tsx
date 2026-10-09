import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, Info, ShieldCheck, Sparkles, UserCheck, FileText, BarChart3 } from 'lucide-react';
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
   * Selecting a portal from the UI does not grant authorization.
   * Client-side credential checking is enabled exclusively for prototype demonstration of the
   * ESG Admin and Reviewer / Approver roles via environment variables. In production, the backend
   * authentication service must verify cryptographically signed tokens and enforce tenant boundaries.
   */
  const {
    isDemoAdminEnabled,
    isDemoReviewerEnabled,
    isDemoContributorEnabled,
    isDemoManagementEnabled,
    isDemoAuditorEnabled,
    loginDemoAdmin,
    loginDemoReviewer,
    loginDemoContributor,
    loginDemoManagement,
    fillDemoAdminCredentials,
    fillDemoReviewerCredentials,
    fillDemoContributorCredentials,
    fillDemoManagementCredentials,
    fillDemoAuditorCredentials,
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

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const isEsgAdmin = roleId === 'esg-admin';
  const isReviewer = roleId === 'reviewer-approver';
  const isContributor = roleId === 'data-contributor';
  const isManagement = roleId === 'management';

  const handleUseDemoAdmin = () => {
    const creds = fillDemoAdminCredentials();
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setErrors({});
    }
  };

  const handleUseDemoReviewer = () => {
    const creds = fillDemoReviewerCredentials();
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setErrors({});
    }
  };

  const handleUseDemoContributor = () => {
    const creds = fillDemoContributorCredentials();
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setErrors({});
    }
  };

  const handleUseDemoManagement = () => {
    const creds = fillDemoManagementCredentials();
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setErrors({});
    }
  };

  const handleUseDemoAuditor = () => {
    const creds = fillDemoAuditorCredentials();
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setErrors({});
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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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

    // Handle remember email safely (passwords are NEVER saved in localStorage)
    if (rememberEmail) {
      localStorage.setItem(storageKey, email.trim());
    } else {
      localStorage.removeItem(storageKey);
    }

    // ESG Admin Demo Login
    if (isEsgAdmin && isDemoAdminEnabled) {
      const result = await loginDemoAdmin(email, password);
      setIsLoading(false);

      if (result.success) {
        onSubmitSuccess('ESG Admin demo session initialized.');
        navigate('/admin/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid ESG Admin credentials.',
        }));
      }
      return;
    }

    // Reviewer / Approver Demo Login
    if (isReviewer && isDemoReviewerEnabled) {
      const result = await loginDemoReviewer(email, password);
      setIsLoading(false);

      if (result.success) {
        onSubmitSuccess('Reviewer demo session initialized.');
        navigate('/reviewer/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid Reviewer credentials.',
        }));
      }
      return;
    }

    // Data Contributor Demo Login
    if (isContributor && isDemoContributorEnabled) {
      const result = await loginDemoContributor(email, password);
      setIsLoading(false);

      if (result.success) {
        onSubmitSuccess('Data Contributor demo session initialized.');
        navigate('/contributor/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid Data Contributor credentials.',
        }));
      }
      return;
    }

    // Executive Management Demo Login
    if (isManagement && isDemoManagementEnabled) {
      const result = await loginDemoManagement(email, password);
      setIsLoading(false);

      if (result.success) {
        onSubmitSuccess('Executive Management demo session initialized.');
        navigate('/management/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid Management credentials.',
        }));
      }
      return;
    }

    // For other roles or when demo auth is disabled:
    setTimeout(() => {
      setIsLoading(false);
      onSubmitSuccess('Authentication service will be connected in subsequent phases.');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-800" noValidate>
      {/* Demo Access Box for ESG Admin */}
      {isEsgAdmin && isDemoAdminEnabled && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold block text-emerald-950">
                  Demo Admin Access Enabled
                </span>
                <span className="text-[11px] text-emerald-700">
                  Click to auto-populate test ESG Admin credentials
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoAdmin}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Demo Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Demo Access Box for Reviewer / Approver */}
      {isReviewer && isDemoReviewerEnabled && (
        <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="font-semibold block text-sky-950">
                  Demo Reviewer Access Enabled
                </span>
                <span className="text-[11px] text-sky-700">
                  Click to auto-populate test Reviewer credentials
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoReviewer}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#003B73] hover:bg-[#002B54] active:bg-[#002244] text-white font-semibold text-xs rounded-md shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Demo Reviewer</span>
            </button>
          </div>
        </div>
      )}

      {/* Demo Access Box for Data Contributor */}
      {isContributor && isDemoContributorEnabled && (
        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-950 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="font-semibold block text-teal-950">
                  Demo Contributor Access Enabled
                </span>
                <span className="text-[11px] text-teal-700">
                  Click to auto-populate test Data Contributor credentials
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoContributor}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-xs rounded-md shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Demo Contributor</span>
            </button>
          </div>
        </div>
      )}

      {/* Demo Access Box for Executive Management */}
      {isManagement && isDemoManagementEnabled && (
        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-semibold block text-indigo-950">
                  Demo Management Access Enabled
                </span>
                <span className="text-[11px] text-indigo-700">
                  Click to auto-populate test Management credentials
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoManagement}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white font-semibold text-xs rounded-md shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Demo Management Login</span>
            </button>
          </div>
        </div>
      )}

      {!isEsgAdmin && !isReviewer && !isContributor && !isManagement && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-sky-50/80 border border-sky-200 text-sky-900 text-xs leading-relaxed">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <span>
            Logging in to <strong className="font-semibold">{roleTitle}</strong>. Your account must be created and authorized by the Company Admin.
          </span>
        </div>
      )}

      {/* Demo Access Box for Auditor */}
      {isDemoAuditorEnabled && (
        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-950 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="font-semibold block text-purple-950">
                  Demo Auditor Access Enabled
                </span>
                <span className="text-[11px] text-purple-700">
                  Click to auto-populate test Auditor credentials
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoAuditor}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Demo Auditor</span>
            </button>
          </div>
        </div>
      )}
      {/* General Form Error */}
      {errors.general && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Work Email Field */}
      <div>
        <label htmlFor="work-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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
          <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
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
