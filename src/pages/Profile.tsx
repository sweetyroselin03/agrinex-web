import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function Profile() {
  const [user, setUser] = useState<any>({});
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    axios.get('https://agrinex-backend-c1ig.onrender.com/api/users/1').then(res => setUser(res.data)).catch(() => { });
    axios.get('https://agrinex-backend-c1ig.onrender.com/api/users/1/posts').then(res => setPosts(res.data)).catch(() => { });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-bgMain overflow-y-auto pb-32">
      <div className="h-40 bg-gradient-to-br from-purple/40 via-cyan/20 to-bgMain relative">
        <div className="absolute top-8 right-6 p-2 glass-card rounded-full cursor-pointer"><Cog6ToothIcon className="w-5 h-5 text-textMain" /></div>
      </div>

      <div className="px-6 relative -mt-16">
        <img src={user.profile_picture || "https://i.pravatar.cc/150?img=11"} className="w-28 h-28 rounded-[2rem] border-4 border-bgMain shadow-xl object-cover bg-bgSec" />

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold text-textMain flex items-center gap-2">{user.name || "Farmer 99"} <CheckBadgeIcon className="w-6 h-6 text-cyan" /></h1>
          <p className="text-xs text-textSec font-medium mt-1 uppercase tracking-wide">{user.district || 'Pune'}, {user.state || 'Maharashtra'} • {user.farm_size || 5} Acres</p>
          <p className="text-sm text-textMain mt-3 leading-relaxed">{user.bio || "Passionate about organic farming and AI-driven insights."}</p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="glass-card flex-1 p-4 text-center"><span className="block text-xl font-bold text-textMain">{user.posts_count || 0}</span><span className="text-[10px] text-textSec uppercase tracking-wider">Posts</span></div>
          <div className="glass-card flex-1 p-4 text-center"><span className="block text-xl font-bold text-textMain">{user.followers_count || 0}</span><span className="text-[10px] text-textSec uppercase tracking-wider">Followers</span></div>
          <div className="glass-card flex-1 p-4 text-center"><span className="block text-xl font-bold text-textMain">{user.following_count || 0}</span><span className="text-[10px] text-textSec uppercase tracking-wider">Following</span></div>
        </div>

        {/* Profile Grid */}
        <div className="flex gap-8 border-b border-borderDark mb-4">
          <button className="pb-2 border-b-2 border-cyan text-cyan text-sm font-bold uppercase tracking-wider">Posts</button>
          <button className="pb-2 text-textSec text-sm font-bold uppercase tracking-wider">Saved</button>
          <button className="pb-2 text-textSec text-sm font-bold uppercase tracking-wider">Scans</button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {posts.map((p: any) => (
            <div key={p.id} className="aspect-square bg-card rounded-xl border border-borderDark flex items-center justify-center p-2 text-center text-xs overflow-hidden relative group">
              {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <p className="text-textSec text-[10px] line-clamp-4">{p.content}</p>}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
