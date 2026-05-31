import { motion } from 'framer-motion';
import { BellIcon, ChartBarIcon, ArrowTrendingUpIcon, ViewfinderCircleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div className="flex items-center gap-3">
          <Link to="/profile"><img src="https://i.pravatar.cc/150?img=11" alt="profile" className="w-12 h-12 rounded-full border-2 border-borderDark shadow-sm" /></Link>
          <div>
            <p className="text-xs font-semibold text-textSec uppercase tracking-wider">Welcome back,</p>
            <h1 className="text-xl font-bold text-textMain leading-tight">Farmer 99</h1>
          </div>
        </div>
        <div className="w-10 h-10 glass-card flex items-center justify-center relative cursor-pointer">
          <BellIcon className="w-5 h-5 text-textMain" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple rounded-full border border-bgMain shadow-[0_0_10px_#7C3AED]"></span>
        </div>
      </header>

      {/* AI Weather & Insights Card */}
      <div className="glass-card p-6 mb-8 relative overflow-hidden bg-gradient-to-br from-card to-transparent border border-borderDark/50">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan/10 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#10B981]"></span>
              <h3 className="text-textSec font-medium text-xs uppercase tracking-wider">AI Crop Intelligence</h3>
            </div>
            <div className="flex items-end gap-2 mb-2"><span className="text-5xl font-bold text-textMain tracking-tighter">28°</span><span className="text-xl mb-1 text-textSec">C</span></div>
            <p className="text-textMain text-sm font-medium">Optimal conditions for Wheat harvest.</p>
          </div>
          <div className="text-4xl drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">🌤️</div>
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-borderDark relative z-10">
          <div className="bg-bgSec/50 rounded-lg p-2 px-3 flex items-center gap-2 border border-borderDark/50">
            <span className="text-cyan text-xs font-bold">98%</span>
            <span className="text-textSec text-[10px] uppercase">Soil Moisture</span>
          </div>
          <div className="bg-bgSec/50 rounded-lg p-2 px-3 flex items-center gap-2 border border-borderDark/50">
            <span className="text-purple text-xs font-bold">Low</span>
            <span className="text-textSec text-[10px] uppercase">Pest Risk</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-textSec uppercase tracking-wider mb-4">Enterprise Hub</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/scan" className="glass-card p-5 group block relative overflow-hidden">
            <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/30">
              <ViewfinderCircleIcon className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-textMain text-sm mb-1">AI Scan</h4>
            <p className="text-[10px] text-textSec font-medium uppercase">Disease Detection</p>
          </Link>
          <Link to="/chat" className="glass-card p-5 group block relative overflow-hidden">
            <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-cyan/10 rounded-full blur-xl group-hover:bg-cyan/20 transition-all"></div>
            <div className="w-10 h-10 bg-cyan/20 rounded-xl flex items-center justify-center mb-4 border border-cyan/30">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-cyan" />
            </div>
            <h4 className="font-bold text-textMain text-sm mb-1">AgriGPT</h4>
            <p className="text-[10px] text-textSec font-medium uppercase">Smart Advisor</p>
          </Link>
          <div className="glass-card p-5 group block relative overflow-hidden">
             <div className="w-10 h-10 bg-purple/20 rounded-xl flex items-center justify-center mb-4 border border-purple/30">
              <ChartBarIcon className="w-6 h-6 text-purple" />
            </div>
            <h4 className="font-bold text-textMain text-sm mb-1">Market Intel</h4>
            <p className="text-[10px] text-textSec font-medium uppercase">Live Prices</p>
          </div>
          <div className="glass-card p-5 group block relative overflow-hidden">
             <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/30">
              <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="font-bold text-textMain text-sm mb-1">Subsidies</h4>
            <p className="text-[10px] text-textSec font-medium uppercase">Gov Schemes</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
