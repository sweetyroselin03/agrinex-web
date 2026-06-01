import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Splash() {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const runFlow = async () => {
      try {
        await checkAuth();
      } catch (_) {}

      setTimeout(() => {
        const onboardingCompleted = localStorage.getItem('agrinex_onboarding_completed') === 'true';
        if (onboardingCompleted) {
          // Returning user: go to dashboard if authenticated, welcome/landing if not
          const isAuthed = useAuthStore.getState().isAuthenticated;
          if (isAuthed) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/welcome', { replace: true });
          }
        } else {
          // New user
          navigate('/onboarding', { replace: true });
        }
      }, 2800); // 2.8s duration
    };

    runFlow();
  }, [navigate, checkAuth]);

  // Set the document background to prevent flash
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = isDark ? '#06131D' : '#F8FAFC';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, [isDark]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 w-full h-full flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden ${
        isDark ? 'bg-[#06131D] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Premium background glow blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: isDark ? [0.08, 0.12, 0.08] : [0.04, 0.06, 0.04],
        }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] bg-emerald-500 rounded-full blur-[100px] sm:blur-[140px] -top-32 -left-32 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: isDark ? [0.05, 0.09, 0.05] : [0.03, 0.05, 0.03],
        }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
        className="absolute w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-blue-500 rounded-full blur-[90px] sm:blur-[120px] -bottom-20 -right-20 pointer-events-none"
      />

      <div className="text-center z-10 flex flex-col items-center px-4 max-w-md w-full">
        {/* Animated logo container */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
          className={`w-28 h-28 sm:w-32 sm:h-32 mb-6 rounded-[2rem] flex items-center justify-center shadow-lg transition-all duration-300 relative border ${
            isDark
              ? 'bg-[#102235]/65 border-emerald-500/25 shadow-emerald-500/20'
              : 'bg-white border-slate-200/80 shadow-emerald-500/10'
          }`}
        >
          {/* Subtle pulse ring */}
          <div className="absolute inset-0 rounded-[2rem] border border-emerald-400/30 animate-ping opacity-25 pointer-events-none" />
          <span className="text-5xl sm:text-6xl drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)]">🌱</span>
        </motion.div>

        {/* Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
          className="text-4xl sm:text-5xl font-black tracking-tight mb-2 select-none"
        >
          AgriNex{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            AI
          </span>
        </motion.h1>

        {/* Animated Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.7 }}
          className={`text-sm sm:text-base font-semibold tracking-wide ${
            isDark ? 'text-emerald-300/80' : 'text-emerald-600'
          }`}
        >
          Smart Farming Powered by AI
        </motion.p>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 flex items-center justify-center gap-1.5"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </motion.div>
      </div>

      {/* Version */}
      <div className="absolute bottom-8 left-0 right-0 text-center select-none opacity-40">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase">Version 1.0.0</p>
      </div>
    </motion.div>
  );
}
