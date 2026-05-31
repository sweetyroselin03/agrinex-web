import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone) return;
    try { await axios.post('https://agrinex-backend-c1ig.onrender.com/api/auth/otp/generate', { phone }); } catch (e) { }
    setStep(2);
  };

  const handleVerify = async () => {
    if (!otp) return;
    try { await axios.post('https://agrinex-backend-c1ig.onrender.com/api/auth/otp/verify', { phone, otp }); } catch (e) { }
    onLogin();
    navigate('/dashboard');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 h-full flex flex-col justify-center bg-bgMain relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan/20 rounded-full blur-[100px]" />

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-8 relative z-10 w-full">
        <h2 className="text-3xl font-bold text-textMain mb-2">Welcome Back</h2>
        <p className="text-textSec text-sm mb-8">Access your enterprise dashboard.</p>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-textSec uppercase tracking-wider mb-2 block">Mobile Number</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full p-4 rounded-xl bg-bgSec border border-borderDark focus:border-cyan text-textMain outline-none transition-all" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSendOTP} className="w-full bg-gradient-to-r from-cyan to-primary text-bgMain p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)]">Send Secure OTP</motion.button>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-textSec uppercase tracking-wider mb-2 block">Enter OTP</label>
                <input type="text" placeholder="• • • •" className="w-full p-4 rounded-xl bg-bgSec border border-borderDark focus:border-cyan text-textMain outline-none transition-all tracking-[0.5em] text-center text-xl font-bold" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleVerify} className="w-full bg-gradient-to-r from-cyan to-primary text-bgMain p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)]">Verify Identity</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
