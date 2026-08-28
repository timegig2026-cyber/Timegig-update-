import React from 'react';
import { Users, Plus, ChevronRight, MessageSquare, Megaphone } from 'lucide-react';
import { CommunityItem } from '../types';

interface CommunitiesScreenProps {
  communities: CommunityItem[];
}

export const CommunitiesScreen: React.FC<CommunitiesScreenProps> = ({
  communities,
}) => {
  return (
    <div id="communities-screen" className="min-h-screen bg-white text-gray-900 pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Title Header with clean typography - No top menu bar */}
      <div className="flex items-center justify-between pt-2 pb-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Network</h1>
      </div>

      {/* New Community action card */}
      <div
        id="new-community-button"
        onClick={() => alert('Add connection')}
        className="flex items-center gap-3 py-3 px-1 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-colors border-b border-gray-100 mb-4"
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
            <Users className="w-6 h-6 text-gray-500" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center border-2 border-white">
            <Plus className="w-3 h-3 stroke-[3]" />
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Connect with Professionals</p>
        </div>
      </div>

      {/* Communities list */}
      <div className="space-y-6">
        {communities.map((comm) => (
          <div key={comm.id} className="border border-gray-100 rounded-2xl p-4 shadow-xs bg-white">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={comm.avatar}
                alt={comm.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">{comm.name}</h3>
                <p className="text-xs text-gray-500">{comm.membersCount} members • {comm.subgroupsCount} groups</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {comm.description}
            </p>

            {/* Announcements Channel */}
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900">Announcements</p>
                    <p className="text-[11px] text-gray-500 truncate">{comm.announcement}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900">General Discussion</p>
                    <p className="text-[11px] text-gray-500 truncate">Welcome new members!</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
