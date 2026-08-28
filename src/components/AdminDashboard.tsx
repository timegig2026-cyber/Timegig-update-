import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  CreditCard, 
  Users, 
  FileText, 
  UserCheck,
  Search,
  MoreVertical,
  Download
} from 'lucide-react';

type AdminTab = 'profit' | 'pop' | 'subscriptions' | 'agreements' | 'registered';

interface AdminDashboardProps {
  onClose: () => void;
  pendingSubmissions: any[];
  allSubscriptions: any[];
  users: any[];
  gigsCount: number;
  seekersCount: number;
  marketItemsCount: number;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onClose, 
  pendingSubmissions, 
  allSubscriptions,
  users,
  gigsCount,
  seekersCount,
  marketItemsCount,
  onApprove, 
  onReject 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('profit');
  const [selectedPop, setSelectedPop] = useState<any | null>(null);

  const approvedSubscriptions = allSubscriptions.filter(s => s.status === 'Approved');
  const totalRevenue = approvedSubscriptions.reduce((acc, s) => {
    const priceStr = s.plan?.match(/\d+,\d+/)?.[0]?.replace(',', '.') || '0';
    return acc + parseFloat(priceStr);
  }, 0);

  const tabs = [
    { id: 'profit', label: 'ProfitView', icon: TrendingUp },
    { id: 'pop', label: 'PoP', icon: CreditCard },
    { id: 'subscriptions', label: 'SubscriptionUsers', icon: Users },
    { id: 'registered', label: 'Registered users', icon: UserCheck },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profit':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-xl font-bold text-slate-900">R {totalRevenue.toFixed(2)}</h3>
                <p className="text-[10px] text-emerald-500 mt-1">From {approvedSubscriptions.length} sales</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Active Users</p>
                <h3 className="text-xl font-bold text-slate-900">{users.length}</h3>
                <p className="text-[10px] text-blue-500 mt-1">Registered members</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Gigs</p>
                <p className="text-lg font-bold text-slate-900">{gigsCount}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Seekers</p>
                <p className="text-lg font-bold text-slate-900">{seekersCount}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Market</p>
                <p className="text-lg font-bold text-slate-900">{marketItemsCount}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 mb-3">Transaction History</h4>
              <div className="space-y-3">
                {approvedSubscriptions.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400">No approved transactions yet.</p>
                ) : (
                  approvedSubscriptions.slice(0, 10).map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                          {s.avatar ? <img src={s.avatar} className="w-full h-full object-cover" /> : <TrendingUp className="w-4 h-4 text-slate-500" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{s.user || 'Unknown User'}</p>
                          <p className="text-[10px] text-slate-500">{s.time || 'Recently'} • {s.plan}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">+{s.plan?.match(/R\d+,\d+/)?.[0] || 'R0.00'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case 'pop':
        return (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Proof of Payments</h4>
              <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingSubmissions.length} Pending
              </span>
            </div>
            <div className="p-4 space-y-4">
              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <CreditCard className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400">No pending proof of payments.</p>
                </div>
              ) : (
                pendingSubmissions.map((sub) => (
                  <div key={sub.id} className="border border-slate-100 rounded-xl p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={sub.avatar} className="w-8 h-8 rounded-full border border-slate-100" alt="User" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{sub.user}</p>
                          <p className="text-[10px] text-slate-500">{sub.time} • {sub.plan}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded-full uppercase">Pending</span>
                    </div>
                    
                    <div 
                      onClick={() => setSelectedPop(sub)}
                      className="group relative bg-slate-50 aspect-video rounded-lg mb-3 flex items-center justify-center border border-dashed border-slate-200 cursor-zoom-in overflow-hidden"
                    >
                      <img src={sub.file} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="PoP Preview" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
                        <Search className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onApprove(sub.id)}
                        className="flex-1 py-2.5 bg-emerald-600 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onReject(sub.id)}
                        className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-xl active:scale-[0.98] transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'registered':
      case 'subscriptions':
        const displayUsers = activeTab === 'subscriptions' 
          ? users.filter(u => approvedSubscriptions.some(s => s.userId === u.id))
          : users;
        return (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">
                {activeTab === 'subscriptions' ? 'Subscribed Users' : 'Registered Users'}
              </h4>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {displayUsers.length} total
              </span>
            </div>
            <div className="p-4 space-y-3">
              {displayUsers.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">No users found.</p>
              ) : (
                displayUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'} className="w-10 h-10 rounded-full border border-white shadow-sm" alt="User" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{u.name || 'Anonymous'}</p>
                        <p className="text-[10px] text-slate-500">{u.jobTitle || 'New Member'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Joined</span>
                      <p className="text-[10px] font-bold text-slate-900">Aug 28, 2026</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Search className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-xs">Database content for {activeTab} will appear here.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold">Admin Dashboard</h2>
              <p className="text-[10px] text-slate-400 font-medium">Platform Overview & Management</p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Top Menu */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all text-[11px] font-bold ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        <div className="max-w-2xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Full Screen PoP Viewer */}
      {selectedPop && (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="p-4 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedPop(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <p className="text-sm font-bold">{selectedPop.user}</p>
                <p className="text-[10px] text-slate-400">{selectedPop.plan} • Proof of Payment</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  onApprove(selectedPop.id);
                  setSelectedPop(null);
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-full"
              >
                Approve
              </button>
              <button 
                onClick={() => {
                  onReject(selectedPop.id);
                  setSelectedPop(null);
                }}
                className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold rounded-full"
              >
                Reject
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={selectedPop.file} 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" 
              alt="Full Screen PoP" 
            />
          </div>
        </div>
      )}

      {/* Footer / Status */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500">SYSTEM ONLINE</span>
        </div>
        <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
          <Download className="w-3 h-3" />
          Generate Report
        </button>
      </div>
    </div>
  );
};
