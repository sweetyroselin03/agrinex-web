import { motion } from 'framer-motion';

export default function Notifications() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 h-full bg-light">
      <h1 className="text-2xl font-bold text-textPrimary mb-6 mt-4">Notifications</h1>
      <div className="space-y-4">
        <div className="glass-card p-4 flex gap-4 items-center">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">🌦️</div>
          <div><h4 className="font-bold text-sm text-textPrimary">Rain Alert</h4><p className="text-xs text-textSecondary">Expected rainfall tomorrow at 4 PM.</p></div>
        </div>
      </div>
    </motion.div>
  );
}
