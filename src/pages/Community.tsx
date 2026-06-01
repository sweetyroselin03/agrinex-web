import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  MapPin, 
  Send,
  Loader2,
  Search,
  UserPlus,
  UserMinus,
  CheckCircle2,
  X
} from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Community() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  // Post publisher states
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [showPublisher, setShowPublisher] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // User search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Comment Thread drawer states
  const [activePostForComments, setActivePostForComments] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentVal, setNewCommentVal] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoadingPosts(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (e) {
      console.warn('Failed to load posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || publishing) return;
    setPublishing(true);

    try {
      await api.post('/posts', {
        content: newContent.trim(),
        image_url: newImage.trim() || null,
        location: newLocation.trim() || null
      });
      setNewContent('');
      setNewImage('');
      setNewLocation('');
      setShowPublisher(false);
      fetchFeed();
    } catch (err) {
      alert('Post creation failed.');
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      // Update feed item locally
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, is_liked: res.data.liked, likes_count: res.data.likes_count } 
          : p
      ));
    } catch (err) {}
  };

  const handleSave = async (postId: number) => {
    try {
      const res = await api.post(`/posts/${postId}/save`);
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, is_saved: res.data.saved } 
          : p
      ));
    } catch (err) {}
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this community post?')) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      alert('Delete request failed.');
    }
  };

  // Search Farmers
  const handleUserSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await api.get('/users/search', { params: { q: val } });
      setSearchResults(res.data);
    } catch (e) {
      console.warn('User search failed');
    } finally {
      setSearching(false);
    }
  };

  // Follow / Unfollow
  const handleFollowToggle = async (targetUser: any) => {
    try {
      const res = await api.post(`/users/${targetUser.id}/follow`);
      setSearchResults(prev => prev.map(u => 
        u.id === targetUser.id 
          ? { ...u, is_following: res.data.following, followers_count: res.data.followers_count } 
          : u
      ));
    } catch (err) {}
  };

  // Comments Loading
  const openCommentsDrawer = async (post: any) => {
    setActivePostForComments(post);
    setNewCommentVal('');
    setComments([]);
    setLoadingComments(true);
    try {
      const res = await api.get(`/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (e) {
      console.warn('Failed to load comments thread');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentVal.trim() || !activePostForComments || submittingComment) return;
    setSubmittingComment(true);

    try {
      const res = await api.post(`/posts/${activePostForComments.id}/comments`, {
        content: newCommentVal.trim()
      });
      setComments(prev => [res.data, ...prev]);
      setNewCommentVal('');
      // Update comment count on post locally
      setPosts(prev => prev.map(p => 
        p.id === activePostForComments.id 
          ? { ...p, comments_count: (p.comments_count || 0) + 1 } 
          : p
      ));
    } catch (err) {
      alert('Failed to send comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative font-sans selection:bg-brandLight selection:text-brandDark">
      
      {/* ─── LEFT COLUMN: SOCIAL FEED (8 Cols) ─── */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Feed Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-borderDark shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-brandDark tracking-tight">Community Forum</h1>
            <p className="text-textSec text-xs">Share yield updates, pest outbreaks, and get tips from agronomy peers.</p>
          </div>
          
          <button
            onClick={() => setShowPublisher(!showPublisher)}
            className="px-4 py-2.5 rounded-xl bg-primary text-brandDark hover:bg-emerald-400 font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Share Update
          </button>
        </div>

        {/* Dynamic Post Publisher Card */}
        <AnimatePresence>
          {showPublisher && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-6 border-slate-200 overflow-hidden"
            >
              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  required
                  rows={3}
                  placeholder="Share a farming warning or yield report with your peers..."
                  className="w-full border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 text-xs text-brandDark placeholder-slate-400 outline-none resize-none transition-all leading-normal"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      placeholder="Image URL (optional)"
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-brandDark outline-none transition-all"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-brandDark outline-none transition-all"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPublisher(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-textSec"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brandDark text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
                    disabled={publishing}
                  >
                    {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Publish Post
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed list */}
        {loadingPosts ? (
          <div className="py-24 text-center text-textSec text-sm flex justify-center items-center gap-2 bg-white rounded-2xl border border-borderDark">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            Loading community feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center text-textSec text-sm bg-white rounded-2xl border border-borderDark">
            No updates posted in the community forum yet. Be the first to share!
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const isOwner = post.user_id === user?.id;
              const dateStr = new Date(post.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={post.id} className="glass-card overflow-hidden">
                  {/* Post Header info */}
                  <div className="p-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author_avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author_name || 'farmer'}`}
                        alt="Author Avatar"
                        className="w-10 h-10 rounded-full border border-slate-200 object-cover bg-white"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-bold text-brandDark">{post.author_name || 'Farmer'}</h4>
                          {post.author_verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10" />}
                        </div>
                        <p className="text-[10px] text-textSec font-semibold uppercase tracking-wider flex items-center gap-1">
                          {dateStr}
                          {post.location && (
                            <span className="flex items-center gap-0.5 text-[9px] text-primary lowercase font-bold">
                              • <MapPin className="w-2.5 h-2.5 inline" /> {post.location}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-slate-400 hover:text-rose hover:bg-rose/5 rounded-xl transition-all"
                        title="Delete Update"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content text */}
                  <div className="px-5 pb-4 text-xs text-slate-700 leading-relaxed font-medium">
                    {post.content}
                  </div>

                  {/* Post Image (optional) */}
                  {post.image_url && (
                    <div className="w-full bg-slate-50 border-y border-slate-100 max-h-[400px] overflow-hidden">
                      <img src={post.image_url} alt="Post Attachment" className="w-full h-full object-contain mx-auto" />
                    </div>
                  )}

                  {/* Post Actions footer */}
                  <div className="px-5 py-4 bg-slate-50/50 border-t border-borderDark flex justify-between items-center text-xs font-bold text-textSec">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-all ${
                          post.is_liked ? 'text-rose' : 'hover:text-rose'
                        }`}
                      >
                        <Heart className={`w-4.5 h-4.5 ${post.is_liked ? 'fill-rose text-rose' : ''}`} />
                        <span>{post.likes_count || 0}</span>
                      </button>

                      <button
                        onClick={() => openCommentsDrawer(post)}
                        className="flex items-center gap-1.5 hover:text-primary transition-all"
                      >
                        <MessageCircle className="w-4.5 h-4.5" />
                        <span>{post.comments_count || 0}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleSave(post.id)}
                      className={`hover:text-primary transition-all ${
                        post.is_saved ? 'text-primary' : ''
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4.5 h-4.5 ${post.is_saved ? 'fill-primary' : ''}`} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ─── RIGHT COLUMN: NETWORKING SIDEBAR (4 Cols) ─── */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* User Stats Card */}
        <section className="glass-card p-6 text-center space-y-4">
          <img
            src={user?.profile_picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'farmer'}`}
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-slate-200 mx-auto object-cover bg-white"
          />
          <div>
            <h3 className="font-extrabold text-brandDark text-sm">{user?.full_name || 'Farmer'}</h3>
            <p className="text-[10px] text-textSec font-bold uppercase tracking-wider">{user?.email}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-xs">
            <div>
              <span className="font-black text-brandDark text-sm">{user?.posts_count || 0}</span>
              <span className="text-[9px] text-textSec font-bold uppercase tracking-wider block mt-0.5">Posts</span>
            </div>
            <div>
              <span className="font-black text-brandDark text-sm">{user?.followers_count || 0}</span>
              <span className="text-[9px] text-textSec font-bold uppercase tracking-wider block mt-0.5">Followers</span>
            </div>
            <div>
              <span className="font-black text-brandDark text-sm">{user?.following_count || 0}</span>
              <span className="text-[9px] text-textSec font-bold uppercase tracking-wider block mt-0.5">Following</span>
            </div>
          </div>
        </section>

        {/* Farmer Search & Network Widget */}
        <section className="glass-card p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-brandDark text-sm">Farmer Directory</h3>
            <p className="text-textSec text-[10px]">Follow other growers to synchronize local pest alerts.</p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search farmers name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-brandDark placeholder-slate-400 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => handleUserSearch(e.target.value)}
            />
          </div>

          <div className="space-y-3 pt-2">
            {searching ? (
              <div className="text-center text-textSec text-xs flex justify-center items-center gap-1.5 py-4">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                Searching...
              </div>
            ) : searchResults.length === 0 && searchQuery ? (
              <div className="text-center text-textSec text-xs py-4">
                No farmers found matching query.
              </div>
            ) : (
              searchResults.slice(0, 5).map((foundUser) => (
                <div key={foundUser.id} className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 pb-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={foundUser.profile_picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${foundUser.email}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-brandDark truncate">{foundUser.full_name}</h4>
                      <p className="text-[9px] text-textSec truncate mt-0.5">{foundUser.followers_count} followers</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFollowToggle(foundUser)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                      foundUser.is_following
                        ? 'bg-slate-100 text-textSec hover:bg-slate-200'
                        : 'bg-brandDark text-white hover:bg-slate-800'
                    }`}
                  >
                    {foundUser.is_following ? (
                      <>
                        <UserMinus className="w-3.5 h-3.5" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {/* ─── SLIDING DRAWER OVERLAY: COMMENT THREADS ─── */}
      <AnimatePresence>
        {activePostForComments && (
          <div 
            className="fixed inset-0 z-50 bg-brandDark/40 backdrop-blur-sm flex justify-end"
            onClick={() => setActivePostForComments(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-screen flex flex-col shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6 shrink-0">
                <div>
                  <h3 className="font-extrabold text-brandDark text-md">Comment Thread</h3>
                  <p className="text-textSec text-[10px] mt-0.5">Replies to {activePostForComments.author_name}'s update</p>
                </div>
                <button
                  onClick={() => setActivePostForComments(null)}
                  className="p-2 text-textSec hover:text-brandDark hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Thread list scroll */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {loadingComments ? (
                  <div className="py-12 text-center text-textSec text-xs flex justify-center items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="py-12 text-center text-textSec text-xs">
                    No comments in this thread. Write one below.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 text-xs bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                      <img
                        src={comment.author_avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.author_name}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover shrink-0 bg-white border border-slate-200"
                      />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-extrabold text-brandDark truncate">{comment.author_name}</span>
                          <span className="text-[9px] text-textSec shrink-0">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-normal font-medium">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input form footer */}
              <form onSubmit={handleAddComment} className="border-t border-slate-100 pt-4 mt-4 shrink-0 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Write a supportive reply..."
                  className="flex-1 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-xs text-brandDark placeholder-slate-400 outline-none transition-all"
                  value={newCommentVal}
                  onChange={(e) => setNewCommentVal(e.target.value)}
                  disabled={submittingComment}
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-primary text-brandDark hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center shrink-0"
                  disabled={!newCommentVal.trim() || submittingComment}
                >
                  {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
