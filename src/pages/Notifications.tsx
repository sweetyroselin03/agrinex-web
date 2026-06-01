import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Loader2, 
  Heart, 
  MessageSquare, 
  AlertTriangle, 
  Info,
  Clock,
  MailOpen
} from 'lucide-react';
import api from '../api/client';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      console.warn('Failed to load notifications feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (e) {
      console.warn('Failed to fetch unread count');
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await api.post('/notifications/read-all');
      // Mark all read locally
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      alert('Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkOneRead = async (notifId: number) => {
    try {
      await api.post(`/notifications/${notifId}/read`);
      // Update locally
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all notification history?')) return;
    setActionLoading(true);
    try {
      await api.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (e) {
      alert('Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className="w-4 h-4 text-rose fill-rose/10" />;
      case 'COMMENT':
        return <MessageSquare className="w-4 h-4 text-primary" />;
      case 'OUTBREAK':
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans selection:bg-brandLight selection:text-brandDark">
      
      {/* Header controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-borderDark shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-brandDark tracking-tight flex items-center gap-2">
            Notification Center
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose text-white text-[10px] font-black leading-none animate-pulse">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-textSec text-xs">Monitor recent interactions, likes, comments, and AI weather risk alerts.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleMarkAllRead}
              disabled={actionLoading || unreadCount === 0}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-textSec flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              Mark Read
            </button>
            <button
              onClick={handleClearAll}
              disabled={actionLoading}
              className="px-3.5 py-2 rounded-xl border border-rose/20 text-rose hover:bg-rose/5 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Notifications list feed */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-textSec text-xs flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-24 text-center text-textSec text-xs space-y-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <MailOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-brandDark text-sm">All Caught Up!</h3>
              <p className="text-textSec text-[11px] mt-1">No alerts or network notification logs present currently.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const dateStr = new Date(n.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkOneRead(n.id)}
                  className={`p-5 flex items-start gap-4 transition-all cursor-pointer ${
                    n.is_read ? 'bg-white opacity-70 hover:opacity-90' : 'bg-brandLight/20 hover:bg-brandLight/35 border-l-4 border-l-primary'
                  }`}
                >
                  {/* Actor Avatar / Icon badge */}
                  <div className="relative shrink-0">
                    <img
                      src={n.actor_avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${n.actor_name || 'farmer'}`}
                      alt="actor avatar"
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover bg-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                      {getNotifIcon(n.type)}
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="flex-1 space-y-1 min-w-0 text-xs">
                    <p className="text-brandDark font-medium leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-textSec font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-350" />
                      {dateStr}
                    </span>
                  </div>

                  {/* Unread circle */}
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
