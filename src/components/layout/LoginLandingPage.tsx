import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import heroBackground from '../../assets/meil-infrastructure-hero.png';
import { Header } from './Header';
import { HeroContent } from './HeroContent';
import { SectorStrip } from './SectorStrip';
import { AuthModal } from '../auth/AuthModal';
import { ForgotPasswordModal } from '../auth/ForgotPasswordModal';
import { ToastContainer } from '../ui/Toast';
import type { PortalRole, ToastMessage } from '../../types/auth';
import { Page2AboutEsg } from '../public/Page2AboutEsg';
import { Page3NexusPlatform } from '../public/Page3NexusPlatform';
import { PageNavIndicator } from '../public/PageNavIndicator';

export const LoginLandingPage: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<PortalRole | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectRole = (role: PortalRole) => {
    setSelectedRole(role);
    setIsAuthModalOpen(true);
  };

  const handleForgotPassword = () => {
    setIsAuthModalOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPasswordOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleOpenLogin = (role?: PortalRole) => {
    if (role) {
      handleSelectRole(role);
    } else {
      setSelectedRole('esg-admin');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-[#07111e] scroll-smooth">
      {/* Floating unobtrusive slide navigation indicator on the right edge */}
      <PageNavIndicator totalPages={3} />

      {/* =========================================================
          PAGE 1: EXISTING HERO / LANDING PAGE
          100% PRESERVED EXACTLY AS IT WAS
          ========================================================= */}
      <section id="page-1" className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#07111e]">
        {/* 
          HERO BACKGROUND IMAGE SLOT:
          Replaceable asset configured at src/assets/meil-infrastructure-hero.png
        */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center sm:bg-right-top bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          {/* Dark Navy Gradient Overlay: Deep left for typography readability, gentle fade to preserve infrastructure on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060c18]/95 via-[#060c18]/65 to-[#060c18]/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060c18]/40 via-transparent to-[#060c18]/70" />
        </div>

        {/* Top Header */}
        <Header
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onSelectRole={handleSelectRole}
        />

        {/* Main Center/Hero Content */}
        <main className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-24 sm:py-28 lg:py-32">
          <HeroContent />

          {/* Option A: Subtle 'Explore ESG & MEIL ↓' prompt */}
          <div className="mt-8 pt-2">
            <button
              type="button"
              onClick={() => {
                const p2 = document.getElementById('page-2');
                if (p2) p2.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
              aria-label="Scroll to explore ESG and MEIL details"
            >
              <span>Explore ESG &amp; MEIL</span>
              <ChevronDown className="w-4 h-4 text-[#E31E24] group-hover:translate-y-0.5 transition-transform animate-bounce" />
            </button>
          </div>
        </main>

        {/* Bottom Sector Strip (Option B: Clicking moves smoothly to Page 2 sectors) */}
        <footer
          className="relative z-10 w-full cursor-pointer"
          onClick={() => {
            const p2 = document.getElementById('page-2');
            if (p2) p2.scrollIntoView({ behavior: 'smooth' });
          }}
          title="Click to explore critical sectors in detail"
        >
          <SectorStrip />
        </footer>
      </section>

      {/* =========================================================
          PAGE 2: ABOUT MEIL + ESG + BRSR
          ========================================================= */}
      <section id="page-2" className="relative min-h-screen w-full bg-[#07111e] overflow-x-hidden">
        <Page2AboutEsg />
      </section>

      {/* =========================================================
          PAGE 3: MEIL ESG NEXUS + WORKFLOW + CONTACT
          ========================================================= */}
      <section id="page-3" className="relative min-h-screen w-full bg-[#060e1a] overflow-x-hidden">
        <Page3NexusPlatform onOpenLogin={handleOpenLogin} />
      </section>

      {/* Authentication Modal */}
      <AuthModal
        selectedRole={selectedRole}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onForgotPassword={handleForgotPassword}
        onSubmitSuccess={(msg) => addToast(msg, 'info')}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onBackToLogin={handleBackToLogin}
        onSubmitSuccess={(msg) => addToast(msg, 'info')}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
