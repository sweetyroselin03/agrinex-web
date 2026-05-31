import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full bg-bgMain relative overflow-hidden">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute w-[500px] h-[500px] bg-cyan rounded-full blur-[120px] -top-32 -left-32" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute w-[400px] h-[400px] bg-purple rounded-full blur-[100px] bottom-0 right-0" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center z-10 flex flex-col items-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }} className="w-28 h-28 mb-6 rounded-3xl bg-card border border-borderDark flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] backdrop-blur-md">
          <span className="text-6xl drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">🌱</span>
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight text-textMain mb-2">AgriNex <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan">AI</span></h1>
        <p className="text-textSec font-medium tracking-wide uppercase text-xs">Enterprise OS for Smart Farming</p>
      </motion.div>
    </motion.div>
  );
}
