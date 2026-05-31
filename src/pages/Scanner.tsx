import { useState } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, ArrowLeftIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult({ disease: 'Late Blight', confidence: 97.4, severity: 'CRITICAL', treatment: 'Immediate application of copper oxychloride recommended.' });
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-black flex flex-col relative">
      <div className="absolute top-8 left-6 z-10 glass-card p-3 rounded-full cursor-pointer" onClick={() => navigate(-1)}><ArrowLeftIcon className="w-5 h-5 text-white" /></div>
      
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        {!result ? (
          <>
            <div className="w-[80vw] h-[60vh] border border-cyan/30 rounded-[3rem] relative overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.1)]">
              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan rounded-tl-3xl"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan rounded-tr-3xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan rounded-bl-3xl"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan rounded-br-3xl"></div>
              
              {scanning && <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute w-full h-[2px] bg-cyan shadow-[0_0_20px_#22D3EE] z-20" />}
              <p className="text-cyan/50 text-xs tracking-widest font-mono uppercase">{scanning ? "Analyzing Cellular Structure..." : "Align Crop Leaf in Frame"}</p>
            </div>
            
            <div className="absolute bottom-12 flex gap-8 items-center">
              <button className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center"><ArrowUpTrayIcon className="w-6 h-6 text-white" /></button>
              <button onClick={handleScan} className={`w-24 h-24 rounded-full border-2 border-cyan flex items-center justify-center p-2 ${scanning ? 'bg-cyan/20' : ''}`}>
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)]"></div>
              </button>
              <button className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center"><CameraIcon className="w-6 h-6 text-white" /></button>
            </div>
          </>
        ) : (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-0 w-full glass-card border-b-0 rounded-b-none rounded-t-[3rem] p-8 pb-12 z-30 bg-bgMain/90 backdrop-blur-2xl">
            <div className="flex justify-between items-start mb-6">
               <div>
                 <h3 className="text-xs text-textSec font-bold uppercase tracking-widest mb-1">AI Diagnosis</h3>
                 <h2 className="text-2xl font-bold text-textMain">{result.disease}</h2>
               </div>
               <div className="text-right">
                 <h3 className="text-xs text-textSec font-bold uppercase tracking-widest mb-1">Confidence</h3>
                 <h2 className="text-2xl font-bold text-cyan">{result.confidence}%</h2>
               </div>
            </div>
            
            <div className="bg-red-900/20 rounded-2xl p-5 border border-red-500/30 mb-6">
              <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span><span className="text-xs font-bold text-red-500 uppercase tracking-wider">Severity: {result.severity}</span></div>
              <p className="text-sm text-textMain leading-relaxed">{result.treatment}</p>
            </div>
            
            <div className="flex gap-4">
               <button onClick={() => setResult(null)} className="flex-1 bg-card border border-borderDark text-textMain p-4 rounded-2xl font-bold text-sm">Rescan</button>
               <button className="flex-1 bg-gradient-to-r from-cyan to-purple text-white p-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm">Save Report</button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
