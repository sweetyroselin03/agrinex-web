import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const slides = [
  { id: 1, title: "AI Crop Assistance", desc: "Detect diseases instantly and get expert recommendations.", icon: "🔍" },
  { id: 2, title: "Farmer Community", desc: "Connect with farmers, share tips, and grow together.", icon: "🤝" },
  { id: 3, title: "Government Subsidies", desc: "Stay updated with the latest schemes and apply easily.", icon: "🏛️" }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else navigate('/login');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} className="h-full flex flex-col bg-light relative p-6">
      <div className="flex justify-end pt-4">
        <button onClick={() => navigate('/login')} className="text-textSecondary text-sm font-semibold hover:text-primary">Skip</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1, y: -20 }} transition={{ duration: 0.4 }} className="flex flex-col items-center">
            <div className="w-48 h-48 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-glass text-6xl">{slides[step].icon}</div>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-3">{slides[step].title}</h2>
            <p className="text-textSecondary px-4">{slides[step].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={nextStep} className="w-full bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-2xl font-bold shadow-lg shadow-primary/25">
          {step === slides.length - 1 ? "Get Started" : "Next"}
        </motion.button>
      </div>
    </motion.div>
  );
}
