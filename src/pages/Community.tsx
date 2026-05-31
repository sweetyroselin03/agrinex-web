import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ChatBubbleOvalLeftIcon, ShareIcon, BookmarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://agrinex-backend-c1ig.onrender.com/api/posts');
      setPosts(res.data);
    } catch (_) { }
  };

  const handleCreatePost = async () => {
    if (!newPost) return;
    try {
      await axios.post('https://agrinex-backend-c1ig.onrender.com/api/posts', { content: newPost });
      setNewPost("");
      setShowCreate(false);
      fetchPosts();
    } catch (_) { }
  };

  const handleLike = async (id: number) => {
    try {
      const res = await axios.post(`https://agrinex-backend-c1ig.onrender.com/api/posts/${id}/like`);
      setPosts(posts.map((p: any) => p.id === id ? { ...p, is_liked: res.data.liked, likes_count: res.data.likes_count } : p));
    } catch (_) { }
  };

  const handleSave = async (id: number) => {
    try {
      const res = await axios.post(`https://agrinex-backend-c1ig.onrender.com/api/posts/${id}/save`);
      setPosts(posts.map((p: any) => p.id === id ? { ...p, is_saved: res.data.saved } : p));
    } catch (_) { }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-bgMain relative">
      <div className="pt-8 pb-4 px-6 bg-bgMain/80 backdrop-blur-xl border-b border-borderDark sticky top-0 z-20 flex justify-between items-center">
        <h1 className="text-xl font-bold text-textMain">Community</h1>
      </div>

      {/* Stories */}
      <div className="px-6 py-4 flex gap-4 overflow-x-auto no-scrollbar border-b border-borderDark bg-bgSec">
        <div className="flex flex-col items-center gap-1 min-w-max cursor-pointer" onClick={() => setShowCreate(true)}>
          <div className="w-16 h-16 rounded-full bg-card border border-borderDark flex items-center justify-center text-textSec"><PlusIcon className="w-6 h-6" /></div>
          <span className="text-[10px] font-medium text-textSec">Create</span>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-max">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan to-purple p-[2px]">
              <img src={`https://i.pravatar.cc/150?img=${i + 20}`} className="w-full h-full rounded-full border-2 border-bgMain object-cover" />
            </div>
            <span className="text-[10px] font-medium text-textMain">Farmer {i}</span>
          </div>
        ))}
      </div>

      <div className="pb-32">
        {posts.map((post: any) => (
          <motion.div key={post.id} className="bg-bgSec mb-2 sm:rounded-2xl sm:mx-4 sm:mt-4 sm:border sm:border-borderDark border-y border-borderDark">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.author_avatar || `https://i.pravatar.cc/150?img=${post.user_id + 10}`} className="w-10 h-10 rounded-full object-cover border border-borderDark" />
                <div>
                  <h4 className="font-bold text-sm text-textMain flex items-center gap-1">
                    {post.author_name}
                    {post.author_verified && <span className="text-cyan text-xs">✓</span>}
                  </h4>
                  <p className="text-[10px] text-textSec uppercase">2 hrs ago</p>
                </div>
              </div>
            </div>
            <p className="px-4 pb-3 text-sm text-textMain leading-relaxed">{post.content}</p>
            {post.image_url && <div className="w-full h-72 bg-bgMain"><img src={post.image_url} className="w-full h-full object-cover" /></div>}

            <div className="p-4 flex justify-between border-t border-borderDark">
              <div className="flex gap-6">
                <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 group">
                  <motion.div whileTap={{ scale: 0.8 }}>{post.is_liked ? <HeartSolid className="w-6 h-6 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" /> : <HeartIcon className="w-6 h-6 text-textSec group-hover:text-red-500" />}</motion.div>
                  <span className={`text-xs font-bold ${post.is_liked ? 'text-red-500' : 'text-textSec'}`}>{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-2 group"><ChatBubbleOvalLeftIcon className="w-6 h-6 text-textSec group-hover:text-cyan" /><span className="text-xs font-bold text-textSec">{post.comments_count}</span></button>
                <button className="flex items-center gap-2 group"><ShareIcon className="w-6 h-6 text-textSec group-hover:text-cyan" /></button>
              </div>
              <button onClick={() => handleSave(post.id)}>
                <motion.div whileTap={{ scale: 0.8 }}>{post.is_saved ? <BookmarkSolid className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> : <BookmarkIcon className="w-6 h-6 text-textSec" />}</motion.div>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-50 bg-bgMain/95 backdrop-blur-md flex flex-col p-6">
            <div className="flex justify-between items-center mb-6 pt-4">
              <button onClick={() => setShowCreate(false)} className="text-textSec font-bold">Cancel</button>
              <h2 className="font-bold text-textMain">New Post</h2>
              <button onClick={handleCreatePost} className="text-cyan font-bold">Post</button>
            </div>
            <textarea autoFocus value={newPost} onChange={(e) => setNewPost(e.target.value)} className="flex-1 bg-transparent text-textMain text-xl outline-none resize-none placeholder-textSec/50" placeholder="What's happening on your farm?" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
