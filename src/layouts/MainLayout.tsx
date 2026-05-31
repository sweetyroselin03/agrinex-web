import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, ViewfinderCircleIcon, ChatBubbleBottomCenterTextIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, UsersIcon as UsersSolid, ViewfinderCircleIcon as ScanSolid, ChatBubbleBottomCenterTextIcon as ChatSolid, UserCircleIcon as UserSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function MainLayout() {
  const location = useLocation();
  const tabs = [
    { path: '/dashboard', label: 'Home', IconOutline: HomeIcon, IconSolid: HomeSolid },
    { path: '/community', label: 'Community', IconOutline: UsersIcon, IconSolid: UsersSolid },
    { path: '/scan', label: 'Scan', IconOutline: ViewfinderCircleIcon, IconSolid: ScanSolid, isCenter: true },
    { path: '/chat', label: 'AI', IconOutline: ChatBubbleBottomCenterTextIcon, IconSolid: ChatSolid },
    { path: '/profile', label: 'Profile', IconOutline: UserCircleIcon, IconSolid: UserSolid },
  ];

  const hideNav = ['/scan'].includes(location.pathname);

  return (
    <div className="h-full w-full flex flex-col relative bg-bgMain">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <Outlet />
      </div>
      
      {!hideNav && (
        <div className="absolute bottom-6 w-full px-6 pointer-events-none z-50">
          <motion.nav 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="glass-card flex justify-around items-center py-4 px-2 pointer-events-auto shadow-[0_10px_40px_rgba(16,185,129,0.15)]"
          >
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path);
              if (tab.isCenter) {
                return (
                  <Link to="/scan" key={tab.path} className="relative -top-8 flex flex-col items-center group">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-tr from-cyan to-primary p-4 rounded-full text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                      <tab.IconOutline className="w-7 h-7" />
                    </motion.div>
                  </Link>
                );
              }
              return (
                <Link to={tab.path} key={tab.path} className="flex flex-col items-center relative group">
                  {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary/20 rounded-xl -z-10 scale-125" />}
                  {isActive ? <tab.IconSolid className="w-6 h-6 text-primary mb-1 transition-colors drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" /> : <tab.IconOutline className="w-6 h-6 text-textSec group-hover:text-primary transition-colors" />}
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-textSec'}`}>{tab.label}</span>
                </Link>
              );
            })}
          </motion.nav>
        </div>
      )}
    </div>
  );
}
