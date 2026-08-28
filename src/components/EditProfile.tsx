import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, User, Mail, Shield, CheckCircle, MapPin, Phone, PartyPopper, Power, AlertCircle } from 'lucide-react';

interface EditProfileProps {
  onClose: () => void;
  isAccountDisabled: boolean;
  onToggleAccountStatus: () => void;
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };
}

export const EditProfile: React.FC<EditProfileProps> = ({ onClose, currentUser, isAccountDisabled, onToggleAccountStatus }) => {
  const [profilePic, setProfilePic] = useState(currentUser.avatar);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState('+1 (555) 012-3456');
  const [province, setProvince] = useState('California');
  const [location, setLocation] = useState('San Francisco');
  const [isSaved, setIsSaved] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsSaved(true);
    // Simulate a brief delay for the congratulatory message before redirecting
    setTimeout(() => {
      onClose();
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
          Returning to account...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300 max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h2 className="text-base font-bold text-slate-900">Edit Profile</h2>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Cover & Profile Picture Section */}
        <div className="relative mb-16">
          {/* Backcover (Syncs with Profile Pic) */}
          <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
            <img 
              src={profilePic} 
              alt="Cover" 
              className="w-full h-full object-cover blur-sm opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white" />
          </div>

          {/* Profile Picture Circle */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg hover:bg-blue-700 transition-all scale-90 group-hover:scale-100"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            hidden 
            accept="image/*" 
          />
        </div>

        {/* Form Sections */}
        <div className="px-6 space-y-6">
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
                  <option value="California">California</option>
                  <option value="New York">New York</option>
                  <option value="Texas">Texas</option>
                  <option value="Remote">Remote</option>
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

          <div>
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

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Account Security</label>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-transparent hover:bg-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Change Password</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180" />
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3 border border-blue-100">
            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-blue-900">Verified Professional</h4>
              <p className="text-[10px] text-blue-700 leading-relaxed mt-0.5">Your profile is verified. Verified accounts have higher visibility in GiGs and Seekers searches.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
