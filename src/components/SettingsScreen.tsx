import React, { useState } from 'react';
import {
  QrCode,
  KeyRound,
  Lock,
  Smile,
  MessageSquare,
  Bell,
  Database,
  Globe,
  HelpCircle,
  Users,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [readReceipts, setReadReceipts] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const settingGroups = [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Security notifications, change number',
      icon: KeyRound,
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Block contacts, disappearing messages',
      icon: Lock,
    },
    {
      id: 'avatar',
      title: 'Avatar',
      subtitle: 'Create, edit, profile photo',
      icon: Smile,
    },
    {
      id: 'chats',
      title: 'Chats',
      subtitle: 'Theme, wallpapers, chat history',
      icon: MessageSquare,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Message, group & call tones',
      icon: Bell,
    },
    {
      id: 'storage',
      title: 'Storage and data',
      subtitle: 'Network usage, auto-download',
      icon: Database,
    },
    {
      id: 'language',
      title: 'App language',
      subtitle: "English (device's language)",
      icon: Globe,
    },
    {
      id: 'help',
      title: 'Help',
      subtitle: 'Help center, contact us, privacy policy',
      icon: HelpCircle,
    },
    {
      id: 'invite',
      title: 'Invite a friend',
      subtitle: 'Share WhatsApp with friends',
      icon: Users,
    },
  ];

  return (
    <div id="settings-screen" className="min-h-screen bg-white text-gray-900 pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Title Header with clean typography - No top menu bar */}
      <div className="flex items-center justify-between pt-2 pb-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
      </div>

      {/* User Profile Card */}
      <div className="flex items-center justify-between py-3 px-1 border-b border-gray-100 mb-4 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            alt="My Profile"
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h2 className="text-base font-bold text-gray-900">Alex Mercer</h2>
            <p className="text-xs text-gray-500">Available • In a meeting</p>
          </div>
        </div>
        <button
          id="qr-code-button"
          onClick={() => alert('Your personal QR code for instant connect')}
          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
          title="QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Toggles on White Canvas */}
      <div className="mb-4 bg-gray-50/80 rounded-2xl p-3 border border-gray-100 space-y-2">
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-semibold text-gray-900">Read Receipts</p>
            <p className="text-[11px] text-gray-500">Show blue checkmarks when read</p>
          </div>
          <button
            onClick={() => setReadReceipts(!readReceipts)}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              readReceipts ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                readReceipts ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-gray-200/60 pt-2">
          <div>
            <p className="text-xs font-semibold text-gray-900">Notifications</p>
            <p className="text-[11px] text-gray-500">Preview banners & alerts</p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              notificationsEnabled ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Settings Options List */}
      <div className="divide-y divide-gray-100">
        {settingGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.id}
              id={`setting-${group.id}`}
              onClick={() => alert(`${group.title} settings opened`)}
              className="flex items-center justify-between py-3 px-1 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{group.title}</p>
                  <p className="text-xs text-gray-500 truncate">{group.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Meta Footer on pure white background */}
      <div className="mt-8 text-center pb-4">
        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
        <p className="text-[11px] font-semibold text-gray-400 tracking-wider">from Meta</p>
      </div>
    </div>
  );
};
