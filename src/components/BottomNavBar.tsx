import React from 'react';
import { Zap, UserSearch, ShoppingBag, MessageCircle, Bell } from 'lucide-react';
import { TabType } from '../types';
import { getTranslation, TranslationKey } from '../lib/i18n';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadChatsCount?: number;
  unreadNotificationsCount?: number;
  language?: string;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  unreadChatsCount = 0,
  unreadNotificationsCount = 2,
  language = 'en',
}) => {
  const t = (key: TranslationKey) => getTranslation(language, key);

  const navItems = [
    {
      id: 'gigs' as TabType,
      icon: Zap,
      label: t('gigs'),
    },
    {
      id: 'seekers' as TabType,
      icon: UserSearch,
      label: t('seekers'),
    },
    {
      id: 'market' as TabType,
      icon: ShoppingBag,
      label: t('market'),
    },
    {
      id: 'chats' as TabType,
      icon: MessageCircle,
      label: t('chats'),
      badge: unreadChatsCount > 0 ? unreadChatsCount : undefined,
    },
    {
      id: 'notifications' as TabType,
      icon: Bell,
      label: t('notifications'),
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
  ];

  return (
    <nav
      id="bottom-menu-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/80 backdrop-blur-md border-t border-slate-100 select-none pb-safe"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              id={`tab-button-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center justify-center w-full h-full group cursor-pointer focus:outline-none"
            >
              <div className="relative flex items-center justify-center mb-0.5">
                <Icon 
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive 
                      ? 'text-slate-900 stroke-[2.25] scale-105' 
                      : 'text-slate-400 stroke-[1.75] group-hover:text-slate-600'
                  }`} 
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    id={`badge-${item.id}`}
                    className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-1 flex items-center justify-center text-[8px] font-bold rounded-full border-2 bg-rose-500 text-white border-white shadow-xs"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-medium transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


