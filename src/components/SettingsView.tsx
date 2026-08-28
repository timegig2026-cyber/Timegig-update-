import React, { useState } from 'react';
import { ArrowLeft, Bell, MessageSquare, Shield, Lock, Eye, BellRing, Volume2, Globe, MapPin, Coins, Check } from 'lucide-react';
import { Settings } from '../types';
import { LANGUAGES, COUNTRIES, getTranslation } from '../lib/i18n';

interface SettingsViewProps {
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (updates: Partial<Settings>) => void;
}

const SOUND_OPTIONS = [
  { id: 'classic', name: 'Classic Ping', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c976936357-classic.mp3' },
  { id: 'modern', name: 'Modern Ping', url: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3' },
  { id: 'success', name: 'Digital Success', url: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3' },
  { id: 'pop', name: 'Soft Pop', url: 'https://assets.mixkit.co/active_storage/sfx/2359/2359-preview.mp3' },
  { id: 'blip', name: 'Tech Blip', url: 'https://assets.mixkit.co/active_storage/sfx/2360/2360-preview.mp3' },
  { id: 'chime', name: 'Crystal Chime', url: 'https://assets.mixkit.co/active_storage/sfx/2361/2361-preview.mp3' },
  { id: 'ding', name: 'Clean Ding', url: 'https://assets.mixkit.co/active_storage/sfx/2362/2362-preview.mp3' },
  { id: 'swoosh', name: 'Rapid Swoosh', url: 'https://assets.mixkit.co/active_storage/sfx/2363/2363-preview.mp3' },
  { id: 'bubble', name: 'Water Bubble', url: 'https://assets.mixkit.co/active_storage/sfx/2364/2364-preview.mp3' },
  { id: 'clink', name: 'Metal Clink', url: 'https://assets.mixkit.co/active_storage/sfx/2365/2365-preview.mp3' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose, settings, onUpdateSettings }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'sounds' | 'privacy' | 'localization'>('general');

  const t = (key: any) => getTranslation(settings.language, key);

  const playPreview = (url: string) => {
    try {
      const audio = new Audio(url);
      audio.volume = 0.5;
      audio.play().catch(err => {
        console.warn('Audio play failed (this is normal if user has not interacted yet):', err);
      });
    } catch (err) {
      console.error('Audio initialization error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300 max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white sticky top-0 z-10">
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Settings</h2>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 border-b border-slate-50 overflow-x-auto gap-2">
        <button 
          onClick={() => setActiveSection('general')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeSection === 'general' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
        >
          General
        </button>
        <button 
          onClick={() => setActiveSection('sounds')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeSection === 'sounds' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
        >
          Sounds
        </button>
        <button 
          onClick={() => setActiveSection('privacy')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeSection === 'privacy' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
        >
          {t('privacy')}
        </button>
        <button 
          onClick={() => setActiveSection('localization')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeSection === 'localization' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
        >
          {t('localization')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeSection === 'general' && (
          <div className="space-y-6">
             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">App Preferences</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">App Sounds</p>
                        <p className="text-[10px] text-slate-500">Play sounds for messages & alerts</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onUpdateSettings({ isSoundEnabled: !settings.isSoundEnabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.isSoundEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isSoundEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeSection === 'sounds' && (
          <div className="space-y-8">
             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <BellRing className="w-3 h-3" /> Notification Sound
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {SOUND_OPTIONS.map((sound) => (
                    <button 
                      key={`notif-${sound.id}`}
                      onClick={() => {
                        onUpdateSettings({ notificationSound: sound.url });
                        playPreview(sound.url);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${settings.notificationSound === sound.url ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                    >
                      <span className="text-xs font-bold text-slate-700">{sound.name}</span>
                      {settings.notificationSound === sound.url && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                  ))}
                </div>
             </div>

             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> Chat Message Sound
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {SOUND_OPTIONS.map((sound) => (
                    <button 
                      key={`chat-${sound.id}`}
                      onClick={() => {
                        onUpdateSettings({ chatSound: sound.url });
                        playPreview(sound.url);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${settings.chatSound === sound.url ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                    >
                      <span className="text-xs font-bold text-slate-700">{sound.name}</span>
                      {settings.chatSound === sound.url && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-6">
             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Profile Privacy</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Private Profile</p>
                        <p className="text-[10px] text-slate-500">Only contacts can see your profile</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onUpdateSettings({ isPrivate: !settings.isPrivate })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.isPrivate ? 'bg-purple-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isPrivate ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Online Status</p>
                        <p className="text-[10px] text-slate-500">Show when you are active</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onUpdateSettings({ showOnlineStatus: !settings.showOnlineStatus })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.showOnlineStatus ? 'bg-emerald-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showOnlineStatus ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeSection === 'localization' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                <Globe className="w-3 h-3" /> {t('language')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => onUpdateSettings({ language: lang.code })}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${settings.language === lang.code ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                  >
                    <span className="text-xs font-bold text-slate-700">{lang.name}</span>
                    {settings.language === lang.code && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                <MapPin className="w-3 h-3" /> {t('country')}
              </label>
              <div className="space-y-2">
                {COUNTRIES.map((country) => (
                  <button 
                    key={country.code}
                    onClick={() => onUpdateSettings({ 
                      country: country.code,
                      currency: country.currency
                    })}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${settings.country === country.code ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">{country.currency}</span>
                      {settings.country === country.code && <Check className="w-3 h-3 text-emerald-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
