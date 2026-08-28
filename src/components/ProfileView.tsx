import React, { useState, useRef } from 'react';
import { ArrowLeft, Mail, MapPin, Phone, CheckCircle, Shield, Plus, User, Edit2, Camera, Power, AlertCircle, PartyPopper, UserMinus, Minus } from 'lucide-react';
import { UserProfile } from '../types';
import { getTranslation, TranslationKey } from '../lib/i18n';

interface ProfileViewProps {
  onClose: () => void;
  user: UserProfile;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onAddFriend?: () => void;
  onUnfriend?: () => void;
  isEditable?: boolean;
  isAccountDisabled?: boolean;
  onToggleAccountStatus?: () => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  onSaveSuccess?: () => void;
  language?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  onClose, 
  user, 
  onFollow, 
  onUnfollow,
  onAddFriend, 
  onUnfriend,
  isEditable,
  isAccountDisabled,
  onToggleAccountStatus,
  onUpdateProfile,
  onSaveSuccess,
  language = 'en'
}) => {
  const t = (key: TranslationKey) => getTranslation(language, key);
  const [showFullFollowers, setShowFullFollowers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Edit State
  const [profilePic, setProfilePic] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+27 71 234 5678');
  const [province, setProvince] = useState(user.province || 'Western Cape');
  const [location, setLocation] = useState(user.location || 'Cape Town');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockFollowersList = [
    { name: 'Lerato M.', avatar: 'https://i.pravatar.cc/150?u=1', bio: 'Creative Designer' },
    { name: 'John D.', avatar: 'https://i.pravatar.cc/150?u=2', bio: 'Software Engineer' },
    { name: 'Sarah K.', avatar: 'https://i.pravatar.cc/150?u=3', bio: 'Project Manager' },
    { name: 'Thabo N.', avatar: 'https://i.pravatar.cc/150?u=4', bio: 'Marketing Specialist' },
    { name: 'Emma W.', avatar: 'https://i.pravatar.cc/150?u=5', bio: 'Freelance Writer' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile?.({
      name,
      email,
      avatar: profilePic,
      phone,
      province,
      location
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsEditing(false);
      onSaveSuccess?.();
    }, 2000);
  };

  if (isSaved) {
    return (
      <div className="fixed inset-0 z-[110] bg-white flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <PartyPopper className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Congratulations!</h2>
        <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
          Your profile has been successfully updated. Your information is now visible to the community.
        </p>
        <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
          <CheckCircle className="w-4 h-4" />
          Returning to profile...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300 max-w-md mx-auto">
      {/* Followers Full Screen Modal */}
      {showFullFollowers && (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white sticky top-0">
            <button onClick={() => setShowFullFollowers(false)} className="p-1 hover:bg-slate-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h2 className="text-base font-bold text-slate-900">Followers ({user.followers})</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockFollowersList.map((follower, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img src={follower.avatar} className="w-10 h-10 rounded-full object-cover border border-white" alt="" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{follower.name}</p>
                    <p className="text-[10px] text-slate-500">{follower.bio}</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h2 className="text-base font-bold text-slate-900">{isEditing ? 'Edit Profile' : 'Profile'}</h2>
        </div>
        {isEditable && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all shadow-sm ${isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Cover & Profile Picture Section */}
        <div className="relative mb-16">
          {/* Backcover */}
          <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
            <img 
              src={isEditing ? profilePic : user.avatar} 
              alt="Cover" 
              className="w-full h-full object-cover blur-sm opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white" />
          </div>

          {/* Profile Picture Circle */}
          <div className="absolute -bottom-12 left-6 flex items-end justify-between w-[calc(100%-3rem)]">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                <img 
                  src={isEditing ? profilePic : user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {!isEditing && user.isOnline && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
              )}
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg hover:bg-blue-700 transition-all scale-90 group-hover:scale-100"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {!isEditing && !isEditable && (
              <div className="flex gap-2 mb-2">
                <button 
                  onClick={user.isFollowing ? onUnfollow : onFollow}
                  title={user.isFollowing ? 'Unfollow' : 'Follow'}
                  className={`p-2.5 rounded-2xl transition-all shadow-sm ${user.isFollowing ? 'bg-slate-100 text-slate-400 hover:text-red-500' : 'bg-slate-900 text-white active:scale-95'}`}
                >
                  {user.isFollowing ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
                <button 
                  onClick={user.isFriend ? onUnfriend : onAddFriend}
                  title={user.isFriend ? 'Unfriend' : 'Add Friend'}
                  className={`p-2.5 rounded-2xl transition-all shadow-sm ${user.isFriend ? 'bg-emerald-100 text-emerald-600 hover:bg-red-50 hover:text-red-600' : 'bg-blue-600 text-white active:scale-95'}`}
                >
                  {user.isFriend ? <UserMinus className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            hidden 
            accept="image/*" 
          />
        </div>

        {/* User Info Sections */}
        <div className="px-6 space-y-6 mt-4">
          {!isEditing ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Verified</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>

              {/* Stats Bar */}
              <div className="flex bg-slate-50 rounded-2xl p-4 divide-x divide-slate-200">
                <div className="flex-1 text-center px-2">
                  <p className="text-lg font-bold text-slate-900">{user.friends}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Friends</p>
                </div>
                <button 
                  onClick={() => setShowFullFollowers(true)}
                  className="flex-1 text-center px-2 active:bg-slate-100 transition-colors rounded-lg"
                >
                  <p className="text-lg font-bold text-slate-900">{user.followers}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest underline decoration-blue-500/30">Followers</p>
                </button>
                <div className="flex-1 text-center px-2">
                  <p className="text-lg font-bold text-slate-900">{user.following}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Following</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-semibold text-slate-900">{user.phone || '+27 12 345 6789'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.location || 'Johannesburg'}, {user.province || 'Gauteng'}
                    </p>
                  </div>
                </div>
              </div>

              {isEditable && onToggleAccountStatus && (
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Account Status</label>
                  <div className={`p-4 rounded-2xl border transition-all ${isAccountDisabled ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-transparent'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isAccountDisabled ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          <Power className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{isAccountDisabled ? 'Account Disabled' : 'Account Active'}</p>
                          <p className="text-[10px] text-slate-500">Your profile is {isAccountDisabled ? 'hidden from others' : 'visible to everyone'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={onToggleAccountStatus}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm ${
                          isAccountDisabled 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                        }`}
                      >
                        {isAccountDisabled ? 'Enable Account' : 'Disable Account'}
                      </button>
                    </div>
                    {isAccountDisabled && (
                      <div className="flex items-start gap-2 mt-2 pt-2 border-t border-amber-100">
                        <AlertCircle className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[9px] text-amber-700 leading-relaxed">While disabled, you won't appear in GiGs or Seekers searches and cannot be contacted by new users.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isEditable && (
                <div className="pt-4 border-t border-slate-100">
                   <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all">
                     Message {user.name.split(' ')[0]}
                   </button>
                </div>
              )}
            </>
          ) : (
            /* Editing Mode Form */
            <div className="space-y-6 pb-12">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Full Name</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <User className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none flex-1"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none flex-1"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Contact Phone</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none flex-1"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Province</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <select 
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none flex-1 appearance-none"
                    >
                      <option value="Western Cape">Western Cape</option>
                      <option value="Gauteng">Gauteng</option>
                      <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                      <option value="Eastern Cape">Eastern Cape</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Location</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none flex-1"
                      placeholder="City"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button 
                  onClick={handleSave}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all"
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
