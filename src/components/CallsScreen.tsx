import React, { useState } from 'react';
import { Phone, Video, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Link2, Plus } from 'lucide-react';
import { CallItem } from '../types';

interface CallsScreenProps {
  calls: CallItem[];
  onStartCall: (name: string, isVideo: boolean) => void;
}

export const CallsScreen: React.FC<CallsScreenProps> = ({
  calls,
  onStartCall,
}) => {
  const [activeCallModal, setActiveCallModal] = useState<{
    name: string;
    isVideo: boolean;
    isActive: boolean;
  } | null>(null);

  const handleCall = (name: string, isVideo: boolean) => {
    setActiveCallModal({ name, isVideo, isActive: true });
    onStartCall(name, isVideo);
  };

  return (
    <div id="calls-screen" className="min-h-screen bg-white text-gray-900 pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Title Header with clean typography - No top menu bar */}
      <div className="flex items-center justify-between pt-2 pb-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Interviews</h1>
        <button
          id="new-call-button"
          onClick={() => handleCall('Sarah Connor', false)}
          className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors focus:outline-none"
          title="New Call"
        >
          <PhoneCall className="w-5 h-5" />
        </button>
      </div>

      {/* Create Call Link Section */}
      <div
        id="create-call-link"
        onClick={() => alert('Call link created: https://call.whatsapp.com/v/w92fk81a')}
        className="flex items-center gap-3 py-3 px-1 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-colors mb-3"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
          <Link2 className="w-6 h-6 -rotate-45" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Create call link</p>
          <p className="text-xs text-gray-500">Share a link for your WhatsApp call</p>
        </div>
      </div>

      {/* Recent Calls Header */}
      <h2 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">
        Recent
      </h2>

      {/* Call History */}
      <div className="divide-y divide-gray-100/80">
        {calls.map((call) => {
          const isMissed = call.type === 'missed';
          return (
            <div
              key={call.id}
              id={`call-item-${call.id}`}
              className="flex items-center justify-between py-3 px-1 hover:bg-gray-50/80 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={call.avatar}
                  alt={call.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
                />
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isMissed ? 'text-red-500' : 'text-gray-900'
                    }`}
                  >
                    {call.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    {call.type === 'incoming' && (
                      <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {call.type === 'outgoing' && (
                      <PhoneOutgoing className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {call.type === 'missed' && (
                      <PhoneMissed className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <span>{call.time}</span>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => handleCall(call.name, call.isVideo)}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                title={call.isVideo ? 'Start video call' : 'Start voice call'}
              >
                {call.isVideo ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <Phone className="w-5 h-5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Call Simulation Modal */}
      {activeCallModal && (
        <div
          id="active-call-modal"
          className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
              End-to-end encrypted
            </span>
            <button
              onClick={() => setActiveCallModal(null)}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              Minimize
            </button>
          </div>

          <div className="text-center my-auto">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 border-2 border-emerald-500 p-1">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Caller"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {activeCallModal.name}
            </h3>
            <p className="text-xs text-gray-500 animate-pulse">
              {activeCallModal.isVideo ? 'Video Calling...' : 'Calling...'}
            </p>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-6 pb-6">
            <button
              onClick={() => setActiveCallModal(null)}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
