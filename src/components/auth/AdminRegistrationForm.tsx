import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, User, Phone, ShieldCheck, KeyRound, AlertCircle, Info } from 'lucide-react';

interface AdminRegistrationFormProps {
  onSubmitSuccess: (message: string) => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  employeeId?: string;
  mobile?: string;
  orgCode?: string;
  password?: string;
  confirmPassword?: string;
  authorizedConfirmed?: string;
}

export const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({
  onSubmitSuccess,
}) => {
  // SECURITY NOTE:
  // Submitting this registration form does not immediately activate admin credentials.
  // In production, multi-tier corporate verification and manual organization vetting
  // must take place before activating any tenant administrator profile.

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    mobile: '',
    orgCode: '',
    password: '',
    confirmPassword: '',
    authorizedConfirmed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Official company email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid company email';
    }

    if (!formData.employeeId.trim()) {
      errs.employeeId = 'Employee ID is required';
    }

    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.mobile.trim())) {
      errs.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.orgCode.trim()) {
      errs.orgCode = 'Organization verification code is required';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.authorizedConfirmed) {
      errs.authorizedConfirmed = 'You must confirm your administrative authorization';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSubmitSuccess('Admin registration submitted for verification. You can sign in using the demo admin credentials.');
    }, 800);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const [isDemoFillActive, setIsDemoFillActive] = useState(false);

  const handleToggleDemoFill = () => {
    if (isDemoFillActive) {
      setIsDemoFillActive(false);
      setFormData({
        fullName: '',
        email: '',
        employeeId: '',
        mobile: '',
        orgCode: '',
        password: '',
        confirmPassword: '',
        authorizedConfirmed: false,
      });
      setErrors({});
      return;
    }

    setIsDemoFillActive(true);
    setFormData({
      fullName: 'Vikramaditya Sharma',
      email: 'vikram.admin@meil.in',
      employeeId: 'MEIL-ADM-9021',
      mobile: '+91 98490 12345',
      orgCode: 'MEIL-CORP-2026',
      password: 'Admin@Secure2026',
      confirmPassword: 'Admin@Secure2026',
      authorizedConfirmed: true,
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-slate-800" noValidate>
      {/* 1-Click Demo Fill Switch */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-slate-50 border border-emerald-300/80 shadow-xs flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Quick Demo Registration Switch</span>
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-200 text-emerald-900 border border-emerald-300">
              Auto-Fill
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Flip switch to pre-fill verified corporate admin details
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDemoFillActive}
          onClick={handleToggleDemoFill}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            isDemoFillActive ? 'bg-emerald-600' : 'bg-slate-300 hover:bg-slate-400'
          }`}
        >
          <span className="sr-only">Toggle demo registration auto-fill</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isDemoFillActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Verification Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/90 border border-amber-200 text-amber-900 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Notice:</strong> Company verification is required before administrator access is activated.
        </span>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="reg-fullname"
            type="text"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="John Doe"
            className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.fullName
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
            }`}
          />
        </div>
        {errors.fullName && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Official Company Email */}
      <div>
        <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Official Company Email <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="reg-email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="admin@company.com"
            className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
            }`}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Two Column Grid: Employee ID & Mobile Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Employee ID */}
        <div>
          <label htmlFor="reg-empid" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Employee ID <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input
              id="reg-empid"
              type="text"
              value={formData.employeeId}
              onChange={(e) => updateField('employeeId', e.target.value)}
              placeholder="EMP-10492"
              className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                errors.employeeId
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
              }`}
            />
          </div>
          {errors.employeeId && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.employeeId}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="reg-mobile" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="reg-mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                errors.mobile
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
              }`}
            />
          </div>
          {errors.mobile && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.mobile}
            </p>
          )}
        </div>
      </div>

      {/* Organization Verification Code */}
      <div>
        <label htmlFor="reg-orgcode" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          Org Verification Code <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <input
            id="reg-orgcode"
            type="text"
            value={formData.orgCode}
            onChange={(e) => updateField('orgCode', e.target.value.toUpperCase())}
            placeholder="MEIL-CORP-2026"
            className={`w-full pl-9 pr-3 py-2 text-sm uppercase bg-slate-50 border rounded-lg tracking-wider transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.orgCode
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
            }`}
          />
        </div>
        {errors.orgCode && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.orgCode}
          </p>
        )}
      </div>

      {/* Two Column Grid: Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Password */}
        <div>
          <label htmlFor="reg-pwd" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-pwd"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reg-confirmpwd" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-confirmpwd"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.authorizedConfirmed}
            onChange={(e) => updateField('authorizedConfirmed', e.target.checked)}
            className="w-4 h-4 mt-0.5 text-[#003B73] border-slate-300 rounded focus:ring-[#003B73]"
          />
          <span className="text-xs text-slate-700 leading-snug">
            I confirm that I am authorized to register as the Company Admin.
          </span>
        </label>
        {errors.authorizedConfirmed && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium pl-6">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.authorizedConfirmed}
          </p>
        )}
      </div>

      {/* Register Admin Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 py-2.5 px-4 bg-[#E31E24] hover:bg-[#C2161B] active:bg-[#A31216] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:ring-offset-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Registration...</span>
          </>
        ) : (
          <span>Register Admin</span>
        )}
      </button>
    </form>
  );
};
