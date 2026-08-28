import React, { useState } from 'react';
import { Plus, Camera, Pencil, Search, Check, ChevronRight } from 'lucide-react';
import { StatusItem } from '../types';

interface UpdatesScreenProps {
  statuses: StatusItem[];
  onAddStatus: (text: string) => void;
}

export const UpdatesScreen: React.FC<UpdatesScreenProps> = ({
  statuses,
  onAddStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<StatusItem | null>(null);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');

  const myStatus = statuses.find((s) => s.isMine) || statuses[0];
  const recentStatuses = statuses.filter((s) => !s.isMine && !s.isViewed);
  const viewedStatuses = statuses.filter((s) => !s.isMine && s.isViewed);

  const channels = [
    {
      id: 'ch1',
      name: 'WhatsApp Official',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      followers: '142M followers',
      latest: 'Stay connected with the new simplified white theme interface.',
      time: '11:00 AM',
      isVerified: true,
    },
    {
      id: 'ch2',
      name: 'Tech & AI Insights',
      avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
      followers: '8.4M followers',
      latest: 'New release updates and developer previews are rolling out today.',
      time: 'Yesterday',
      isVerified: true,
    }
  ];

  const handlePostStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusText.trim()) return;
    onAddStatus(newStatusText.trim());
    setNewStatusText('');
    setIsAddingStatus(false);
  };

  return (
    <div id="updates-screen" className="min-h-screen bg-white text-gray-900 pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Title Header with clean typography - No top menu bar */}
      <div className="flex items-center justify-between pt-2 pb-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Jobs</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingStatus(true)}
            className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
            title="Post Job"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Heading */}
      <h2 className="text-base font-bold text-gray-900 mb-3">Featured Job Openings</h2>

      {/* My Status */}
      <div
        id="my-status-card"
        onClick={() => setIsAddingStatus(true)}
        className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50/80 rounded-xl px-1 transition-colors mb-4"
      >
        <div className="relative">
          <img
            src={myStatus.avatar}
            alt="My Avatar"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center border-2 border-white">
            <Plus className="w-3 h-3 stroke-[3]" />
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">My status</p>
          <p className="text-xs text-gray-500">Tap to add status update</p>
        </div>
      </div>

      {/* Recent Updates */}
      {recentStatuses.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">
            Recent updates
          </p>
          <div className="space-y-1">
            {recentStatuses.map((status) => (
              <div
                key={status.id}
                onClick={() => setSelectedStatus(status)}
                className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <div className="p-0.5 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-white">
                  <img
                    src={status.avatar}
                    alt={status.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{status.name}</p>
                  <p className="text-xs text-gray-500">{status.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Viewed Updates */}
      {viewedStatuses.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
            Viewed updates
          </p>
          <div className="space-y-1">
            {viewedStatuses.map((status) => (
              <div
                key={status.id}
                onClick={() => setSelectedStatus(status)}
                className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <div className="p-0.5 rounded-full ring-2 ring-gray-300 ring-offset-2 ring-offset-white">
                  <img
                    src={status.avatar}
                    alt={status.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover grayscale-30"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{status.name}</p>
                  <p className="text-xs text-gray-400">{status.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Channels section */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Channels</h2>
          <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
            Explore
          </button>
        </div>

        <div className="space-y-3">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer"
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{channel.name}</p>
                  <span className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px]">
                    ✓
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{channel.latest}</p>
              </div>
              <button className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full text-xs font-semibold transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status Viewer Modal on clean white screen */}
      {selectedStatus && (
        <div
          id="status-view-modal"
          className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 max-w-md mx-auto"
        >
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mb-4">
            <div className="bg-emerald-500 h-full w-full animate-[pulse_2s_ease-in-out_infinite]" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedStatus.avatar}
                alt={selectedStatus.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedStatus.name}</p>
                <p className="text-xs text-gray-400">{selectedStatus.time}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStatus(null)}
              className="text-gray-500 hover:text-gray-900 text-sm font-semibold px-2 py-1"
            >
              Close
            </button>
          </div>

          <div className="my-auto text-center py-12 px-4">
            <div className="max-w-xs mx-auto p-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-xs">
              <p className="text-lg font-medium text-gray-900">
                {selectedStatus.mediaText || 'Sharing a moment with friends on the new white theme.'}
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            Swipe up to reply
          </div>
        </div>
      )}

      {/* Add Status Modal */}
      {isAddingStatus && (
        <div
          id="add-status-modal"
          className="fixed inset-0 z-50 bg-white flex flex-col p-6 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">New Status</h3>
            <button
              onClick={() => setIsAddingStatus(false)}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handlePostStatus} className="flex-1 flex flex-col justify-between pt-6">
            <textarea
              autoFocus
              value={newStatusText}
              onChange={(e) => setNewStatusText(e.target.value)}
              placeholder="Type a status update..."
              className="w-full h-40 p-4 text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-500 resize-none"
            />

            <div className="pt-6">
              <button
                type="submit"
                disabled={!newStatusText.trim()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-xs"
              >
                Share to My Status
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
