import React, { useEffect, useState } from 'react';

interface PageNavIndicatorProps {
  totalPages?: number;
}

export const PageNavIndicator: React.FC<PageNavIndicatorProps> = ({ totalPages = 3 }) => {
  const [activePageIndex, setActivePageIndex] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentIndex = Math.min(
        totalPages,
        Math.max(1, Math.round(scrollY / windowHeight) + 1)
      );
      setActivePageIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalPages]);

  const scrollToPage = (pageNumber: number) => {
    const targetElement = document.getElementById(`page-${pageNumber}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Presentation slide navigation"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3 bg-slate-950/40 backdrop-blur-md px-2 py-3.5 rounded-full border border-slate-700/50 shadow-lg pointer-events-auto"
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isActive = activePageIndex === page;
        return (
          <button
            key={page}
            type="button"
            onClick={() => scrollToPage(page)}
            title={`Jump to Page ${page}`}
            className="group relative flex items-center justify-center p-1 focus:outline-none"
            aria-label={`Navigate to slide 0${page}`}
          >
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-2.5 h-6 bg-[#E31E24] shadow-[0_0_10px_rgba(227,30,36,0.6)]'
                  : 'w-2 h-2 bg-slate-500 hover:bg-slate-300 group-hover:scale-125'
              }`}
            />
            {/* Hover Tooltip */}
            <span className="absolute right-7 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase bg-slate-900/90 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              0{page}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
