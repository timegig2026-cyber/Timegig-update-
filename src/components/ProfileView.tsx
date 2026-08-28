import React, { useState } from 'react';
import { ArrowLeft, Mail, MapPin, Phone, CheckCircle, Shield, UserPlus, Users, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  onClose: () => void;
  user: UserProfile;
  onFollow?: () => void;
  onAddFriend?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose, user, onFollow, onAddFriend }) => {
  const [showFullFollowers, setShowFullFollowers] = useState(false);

  const mockFollowersList = [
    { name: 'Lerato M.', avatar: 'https://i.pravatar.cc/150?u=1', bio: 'Creative Designer' },
    { name: 'John D.', avatar: 'https://i.pravatar.cc/150?u=2', bio: 'Software Engineer' },
    { name: 'Sarah K.', avatar: 'https://i.pravatar.cc/150?u=3', bio: 'Project Manager' },
    { name: 'Thabo N.', avatar: 'https://i.pravatar.cc/150?u=4', bio: 'Marketing Specialist' },
    { name: 'Emma W.', avatar: 'https://i.pravatar.cc/150?u=5', bio: 'Freelance Writer' },
  ];

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
          <h2 className="text-base font-bold text-slate-900">Profile</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Cover & Profile Picture Section */}
        <div className="relative mb-16">
          {/* Backcover */}
          <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
            <img 
              src={user.avatar} 
              alt="Cover" 
              className="w-full h-full object-cover blur-sm opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white" />
          </div>

          {/* Profile Picture Circle */}
          <div className="absolute -bottom-12 left-6 flex items-end justify-between w-[calc(100%-3rem)]">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {user.isOnline && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
              )}
            </div>

            <div className="flex gap-2 mb-2">
              <button 
                onClick={onFollow}
                className={`p-2.5 rounded-2xl transition-all shadow-sm ${user.isFollowing ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-white active:scale-95'}`}
              >
                {user.isFollowing ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </button>
              <button 
                onClick={onAddFriend}
                className={`p-2.5 rounded-2xl transition-all shadow-sm ${user.isFriend ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-600 text-white active:scale-95'}`}
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* User Info Sections */}
        <div className="px-6 space-y-6 mt-4">
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

          <div className="pt-4 border-t border-slate-100">
             <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all">
               Message {user.name.split(' ')[0]}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
