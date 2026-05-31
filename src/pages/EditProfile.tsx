import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 h-full bg-light">
      <div className="flex justify-between items-center mb-6 mt-4">
        <button onClick={() => navigate(-1)} className="font-semibold text-textSecondary">Cancel</button>
        <h1 className="text-xl font-bold text-textPrimary">Edit Profile</h1>
        <button onClick={() => navigate(-1)} className="font-semibold text-primary">Save</button>
      </div>
      <div className="space-y-4">
        <div><label className="text-xs font-bold text-textSecondary">Name</label><input type="text" defaultValue="Ramesh Kumar" className="w-full p-4 rounded-xl bg-white border border-gray-100 mt-1" /></div>
        <div><label className="text-xs font-bold text-textSecondary">Farm Location</label><input type="text" defaultValue="Pune, Maharashtra" className="w-full p-4 rounded-xl bg-white border border-gray-100 mt-1" /></div>
        <div><label className="text-xs font-bold text-textSecondary">Farm Size (Acres)</label><input type="text" defaultValue="5.2" className="w-full p-4 rounded-xl bg-white border border-gray-100 mt-1" /></div>
      </div>
    </motion.div>
  );
}
