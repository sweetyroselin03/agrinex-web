import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Lock, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Sprout,
  Compass,
  Award
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Profile() {
  const { user, updateProfile, setPassword, isLoading, error, clearError } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Profile edit forms
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [village, setVillage] = useState(user?.village || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [state, setState] = useState(user?.state || '');
  const [farmSize, setFarmSize] = useState(user?.farm_size || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [cropSpecialization, setCropSpecialization] = useState(user?.crop_specialization || '');
  const [profilePic, setProfilePic] = useState(user?.profile_picture || '');

  // Password reset forms
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setLocalErr(null);
    clearError();

    if (!fullName.trim()) {
      setLocalErr('Full name is required.');
      return;
    }

    try {
      await updateProfile({
        full_name: fullName.trim(),
        bio: bio.trim() || undefined,
        village: village.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim() || undefined,
        farm_size: farmSize.trim() || undefined,
        experience: experience.trim() || undefined,
        crop_specialization: cropSpecialization.trim() || undefined,
        profile_picture: profilePic.trim() || undefined
      });
      setSuccessMsg('Profile settings saved successfully!');
    } catch (err) {}
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setLocalErr(null);
    clearError();

    if (!newPassword || !confirmPassword) {
      setLocalErr('Password fields cannot be empty.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalErr('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setLocalErr('Password must be at least 6 characters long.');
      return;
    }

    try {
      await setPassword(user?.email || '', newPassword);
      setSuccessMsg('Security credentials updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {}
  };

  return (
    <div className="space-y-8 font-sans selection:bg-brandLight selection:text-brandDark">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brandDark">Account Dashboard</h1>
        <p className="text-textSec text-sm mt-1">Configure profile details, farm characteristics, and password credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: NAVIGATION TABS (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card overflow-hidden">
            {[
              { id: 'overview', label: 'Farmer Overview', icon: User },
              { id: 'settings', label: 'Edit Farm Settings', icon: Settings },
              { id: 'security', label: 'Security & Access', icon: Lock }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setSuccessMsg(null);
                    setLocalErr(null);
                  }}
                  className={`w-full px-5 py-4 flex items-center gap-3 text-left text-xs font-bold uppercase tracking-wider border-b border-slate-50 last:border-0 transition-all ${
                    activeTab === t.id
                      ? 'bg-brandLight text-brandDark border-l-4 border-primary font-black'
                      : 'hover:bg-slate-50 text-textSec'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === t.id ? 'text-primary' : 'text-slate-400'}`} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: TAB COMPONENT VIEW (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Notifications Success/Error */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-brandDark text-sm flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Success!</span>
                <p className="mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {(localErr || error) && (
            <div className="p-4 rounded-xl bg-rose/5 border border-rose/10 text-rose text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Validation Failed:</span>
                <p className="mt-0.5">{localErr || error}</p>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Card Summary Banner */}
              <div className="glass-card p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-tr from-white to-slate-50">
                <img
                  src={user?.profile_picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'farmer'}`}
                  alt="avatar"
                  className="w-24 h-24 rounded-full border-2 border-slate-200 object-cover bg-white"
                />
                <div className="text-center sm:text-left space-y-2">
                  <h2 className="text-2xl font-black text-brandDark leading-tight">{user?.full_name || 'Farmer partner'}</h2>
                  <p className="text-xs text-textSec font-semibold uppercase tracking-wider">{user?.email}</p>
                  {user?.bio ? (
                    <p className="text-xs text-slate-500 italic max-w-lg">"{user.bio}"</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No user bio provided yet. Add one in farm settings.</p>
                  )}
                </div>
              </div>

              {/* Farm specifications info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Location */}
                <div className="glass-card p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-textSec font-bold uppercase tracking-wider leading-none mb-1">Region Location</h4>
                    <span className="text-sm font-bold text-brandDark mt-1 block">
                      {user?.village ? `${user.village}, ${user.district}, ${user.state}` : 'Not Specified'}
                    </span>
                  </div>
                </div>

                {/* Crop specialization */}
                <div className="glass-card p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-textSec font-bold uppercase tracking-wider leading-none mb-1">Specialization</h4>
                    <span className="text-sm font-bold text-brandDark mt-1 block">
                      {user?.crop_specialization || 'Not Specified'}
                    </span>
                  </div>
                </div>

                {/* Experience */}
                <div className="glass-card p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-textSec font-bold uppercase tracking-wider leading-none mb-1">Years Experience</h4>
                    <span className="text-sm font-bold text-brandDark mt-1 block">
                      {user?.experience ? `${user.experience} Years` : 'Not Specified'}
                    </span>
                  </div>
                </div>

                {/* Farm size */}
                <div className="glass-card p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-textSec font-bold uppercase tracking-wider leading-none mb-1">Farm Land Size</h4>
                    <span className="text-sm font-bold text-brandDark mt-1 block">
                      {user?.farm_size ? `${user.farm_size} Acres` : 'Not Specified'}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8"
            >
              <h3 className="font-extrabold text-brandDark text-md mb-6">Update Profile & Farm Characteristics</h3>
              
              <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
                
                {/* Visual grid fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">Avatar Picture URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={profilePic}
                      onChange={(e) => setProfilePic(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">Bio Note</label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all resize-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">Village</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">District</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">Farm Size (Acres)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">Experience (Years)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brandDark uppercase tracking-wider">Crop Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Cotton, Wheat"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                      value={cropSpecialization}
                      onChange={(e) => setCropSpecialization(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-brandDark font-extrabold text-xs hover:shadow-lg hover:shadow-primary/20 flex items-center gap-1.5 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Save Settings
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8"
            >
              <h3 className="font-extrabold text-brandDark text-md mb-6">Reset Password Credentials</h3>
              
              <form onSubmit={handlePasswordResetSubmit} className="space-y-4 max-w-sm">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brandDark uppercase tracking-wider block">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brandDark uppercase tracking-wider block">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Retype new password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-xs text-brandDark outline-none transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brandDark text-white hover:bg-slate-800 font-extrabold text-xs flex items-center gap-1.5 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
                    Change Password
                  </button>
                </div>

              </form>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
