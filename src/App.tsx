/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, ChatItem, MessageItem, NotificationItem, MarketItem, UserProfile } from './types';
import { initialChats, sampleChatMessages, initialMarketItems, initialGigs, initialSeekers } from './data';
import { BottomNavBar } from './components/BottomNavBar';
import { ChatsScreen } from './components/ChatsScreen';
import { GigsScreen } from './components/GigsScreen';
import { SeekersScreen } from './components/SeekersScreen';
import { MarketScreen } from './components/MarketScreen';
import { MarketItemDetail } from './components/MarketItemDetail';
import { ChatDetailModal } from './components/ChatDetailModal';
import { ProfileView } from './components/ProfileView';
import { 
  Search, 
  SlidersHorizontal, 
  Bell, 
  Plus, 
  X, 
  Upload, 
  Check,
  Edit2,
  LayoutDashboard,
  CreditCard,
  Info,
  HelpCircle,
  LogOut,
  ArrowLeft,
  User
} from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { EditProfile } from './components/EditProfile';
import { SettingsView } from './components/SettingsView';

const ProfileMenu: React.FC<{ 
  onClose: () => void, 
  onNavigate: (view: 'my-profile' | 'edit' | 'admin' | 'subscription' | 'about' | 'help' | 'settings' | 'logout') => void 
}> = ({ onClose, onNavigate }) => (
  <div className="absolute top-12 left-4 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl py-3 z-[60] animate-in fade-in zoom-in-95 duration-200">
    <div className="px-4 py-2 border-b border-slate-50 mb-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Account</p>
    </div>
    <button onClick={() => onNavigate('my-profile')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
      <User className="w-4 h-4 text-slate-500" />
      <span className="text-xs font-bold">My Profile</span>
    </button>
    <button onClick={() => onNavigate('edit')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
      <Edit2 className="w-4 h-4 text-blue-500" />
      <span className="text-xs font-bold">Edit Profile</span>
    </button>
    <button onClick={() => onNavigate('settings')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
      <SlidersHorizontal className="w-4 h-4 text-purple-500" />
      <span className="text-xs font-bold">Settings</span>
    </button>
    <button onClick={() => onNavigate('admin')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
      <LayoutDashboard className="w-4 h-4 text-emerald-500" />
      <span className="text-xs font-bold">Admin Dashboard</span>
    </button>
    <button onClick={() => onNavigate('subscription')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
      <CreditCard className="w-4 h-4 text-amber-500" />
      <span className="text-xs font-bold">Subscription</span>
    </button>
    <div className="h-[1px] bg-slate-50 my-2 mx-4" />
    <button onClick={() => onNavigate('about')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
      <Info className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-bold">About App</span>
    </button>
    <button onClick={() => onNavigate('help')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
      <HelpCircle className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-bold">Help Guide</span>
    </button>
    <button onClick={() => onNavigate('logout')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-red-600 transition-colors">
      <LogOut className="w-4 h-4" />
      <span className="text-xs font-bold">Logout</span>
    </button>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('gigs');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, MessageItem[]>>(sampleChatMessages);
  const [createModalType, setCreateModalType] = useState<'gig' | 'seeker' | 'market' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketItem | null>(null);

  const [isAccountDisabled, setIsAccountDisabled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeModalView, setActiveModalView] = useState<'my-profile' | 'edit' | 'admin' | 'subscription' | 'about' | 'help' | 'settings' | null>(null);

  const [userStats, setUserStats] = useState({
    followers: 1240,
    following: 842,
    friends: 456
  });

  const [settings, setSettings] = useState({
    isSoundEnabled: true,
    notificationSound: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
    chatSound: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
    isPrivate: false,
    showOnlineStatus: true,
    showLastSeen: true,
  });

  const playSound = (url: string) => {
    if (settings.isSoundEnabled) {
      try {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(err => {
          console.warn('Audio play auto-block prevented (safe to ignore):', err);
        });
      } catch (err) {
        console.error('Audio subsystem error:', err);
      }
    }
  };

  const [pendingPopSubmissions, setPendingPopSubmissions] = useState<any[]>([]);
  const [subscriptionStep, setSubscriptionStep] = useState<'select' | 'payment' | 'upload' | 'review'>('select');
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string} | null>(null);
  const [popFile, setPopFile] = useState<string | null>(null);
  const [isSubmittingPop, setIsSubmittingPop] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  const currentUser: UserProfile = {
    id: 'me',
    name: 'Julianna Smith',
    email: 'julianna@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+27 71 234 5678',
    province: 'Western Cape',
    location: 'Cape Town',
    ...userStats
  };

  const handleFollow = (userName: string) => {
    playSound(settings.notificationSound);
    const newNotif: NotificationItem = {
      id: `notif-follow-${Date.now()}`,
      title: 'New Follower!',
      message: `${userName} started following you.`,
      dateLabel: 'Today',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceType: 'notifications',
      sourceId: 'new-follower',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUserStats(prev => ({ ...prev, followers: prev.followers + 1 }));
    setToastMessage(`You are now following ${userName}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleFriendRequest = (userName: string, avatar: string) => {
    playSound(settings.notificationSound);
    const newNotif: NotificationItem = {
      id: `notif-friend-${Date.now()}`,
      title: 'Friend Request',
      message: `${userName} wants to be your friend.`,
      dateLabel: 'Today',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceType: 'friend_request',
      sourceId: 'friend-req',
      read: false,
      actionRequired: true,
      actionType: 'friend_request',
      senderAvatar: avatar
    };
    setNotifications(prev => [newNotif, ...prev]);
    setToastMessage(`Friend request sent to ${userName}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const [marketItems, setMarketItems] = useState<MarketItem[]>(initialMarketItems);
  const [gigsItems, setGigsItems] = useState<MarketItem[]>(initialGigs);
  const [seekersItems, setSeekersItems] = useState<MarketItem[]>(initialSeekers);
  const [marketForm, setMarketForm] = useState({
    title: '',
    category: 'Design Assets',
    description: '',
    price: '',
    province: 'California',
    location: '',
    contactInfo: '',
    images: [] as string[],
  });
  const [isCongratulating, setIsCongratulating] = useState(false);

  const handleMarketWhatsApp = (item: MarketItem) => {
    const text = encodeURIComponent(`Hi ${item.seller}, I am interested in your item: ${item.title} for ${item.price}.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleMarketInAppChat = (item: MarketItem) => {
    let chat = chats.find(c => c.name === item.seller);
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: `Hi, I am interested in your item: ${item.title}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as const
    };

    if (!chat) {
      chat = {
        id: `chat-${Date.now()}`,
        name: item.seller,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.seller)}&background=random`,
        lastMessage: newMsg.text,
        time: newMsg.time,
      };
      setChats(prev => [chat!, ...prev]);
      setChatMessages(prev => ({
         ...prev,
         [chat!.id]: [newMsg]
      }));
    } else {
      const existingMsgs = chatMessages[chat.id] || [];
      setChatMessages(prev => ({
        ...prev,
        [chat!.id]: [...existingMsgs, newMsg]
      }));
      setChats(prev => prev.map(c => c.id === chat!.id ? { ...c, lastMessage: newMsg.text, time: newMsg.time } : c));
    }
    setSelectedMarketItem(null);
    setActiveTab('chats');
    setActiveChat(chat);
  };

  const handleMarketImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file as File));
      setMarketForm(prev => ({
        ...prev,
        images: [...prev.images, ...newUrls]
      }));
    }
  };

  const handleCreateMarketItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketForm.title.trim() || !marketForm.price.trim()) {
      setToastMessage('Please fill in at least the title and price.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const newItem: MarketItem = {
      id: `m-${Date.now()}`,
      title: marketForm.title,
      category: marketForm.category,
      description: marketForm.description || 'No description provided.',
      price: marketForm.price.startsWith('$') ? marketForm.price : `$${marketForm.price}`,
      province: marketForm.province,
      location: marketForm.location || 'Online / Remote',
      contactInfo: marketForm.contactInfo || 'user@example.com',
      images: marketForm.images.length > 0 ? marketForm.images : ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'],
      seller: 'You (Verified Creator)',
      rating: '5.0',
    };

    setIsCongratulating(true);
    setTimeout(() => {
      setMarketItems((prev) => [newItem, ...prev]);
      setIsCongratulating(false);
      setCreateModalType(null);
      setMarketForm({
        title: '',
        category: 'Design Assets',
        description: '',
        price: '',
        province: 'California',
        location: '',
        contactInfo: '',
        images: [],
      });
      setActiveTab('market');
      setToastMessage('Item successfully listed in Market!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 2500);
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Gig Application',
      message: 'Sarah Connor applied for your Senior React Developer gig.',
      dateLabel: 'Today',
      timestamp: '10:45 AM',
      sourceType: 'gigs',
      sourceId: 'gig-1',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'New Message',
      message: 'Alex Rivera sent you a message regarding design files.',
      dateLabel: 'Today',
      timestamp: '09:12 AM',
      sourceType: 'chats',
      sourceId: 'chat-1',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Market Listing Update',
      message: 'Your listing "UI/UX System Kit" was favorited by 3 users.',
      dateLabel: 'Yesterday',
      timestamp: '4:30 PM',
      sourceType: 'market',
      sourceId: 'market-1',
      read: true,
    },
    {
      id: 'notif-4',
      title: 'Connection Accepted',
      message: 'David Kim accepted your seeker network connection request.',
      dateLabel: 'August 26, 2026',
      timestamp: '2:15 PM',
      sourceType: 'seekers',
      sourceId: 'seeker-1',
      read: true,
    },
  ]);

  const [selectedNotificationIds, setSelectedNotificationIds] = useState<string[]>([]);

  const handleToggleSelectNotification = (id: string) => {
    setSelectedNotificationIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllNotifications = () => {
    if (selectedNotificationIds.length === notifications.length) {
      setSelectedNotificationIds([]);
    } else {
      setSelectedNotificationIds(notifications.map((n) => n.id));
    }
  };

  const handleClearSelectedNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !selectedNotificationIds.includes(n.id)));
    setSelectedNotificationIds([]);
    setIsSelectionMode(false);
    setToastMessage('Selected notifications cleared');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setSelectedNotificationIds([]);
    setIsSelectionMode(false);
    setToastMessage('All notifications cleared');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.sourceType === 'chats') {
      const targetChat = chats.find((c) => c.id === notif.sourceId) || chats[0];
      if (targetChat) {
        handleSelectChat(targetChat);
      }
      setActiveTab('chats');
    } else {
      setActiveTab(notif.sourceType);
    }
  };

  const groupedNotifications = notifications.reduce((acc, notif) => {
    if (!acc[notif.dateLabel]) {
      acc[notif.dateLabel] = [];
    }
    acc[notif.dateLabel].push(notif);
    return acc;
  }, {} as Record<string, NotificationItem[]>);

  // Unread badge calculations
  const unreadChatsCount = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleSelectChat = (chat: ChatItem) => {
    // Mark as read when selected
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setActiveChat(chat);
  };

  
  const handleUpdateMessage = (msgId: string, updates: Partial<MessageItem>) => {
    if (!activeChat) return;
    setChatMessages((prev) => {
      const chatMsgs = prev[activeChat.id] || [];
      return {
        ...prev,
        [activeChat.id]: chatMsgs.map(m => m.id === msgId ? { ...m, ...updates } : m)
      };
    });
  };

  const handleDeleteMessage = (msgId: string) => {
    if (!activeChat) return;
    setChatMessages((prev) => {
      const chatMsgs = prev[activeChat.id] || [];
      return {
        ...prev,
        [activeChat.id]: chatMsgs.filter(m => m.id !== msgId)
      };
    });
  };

  
  const handleRemoveChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
  };

  const handleClearChat = (chatId: string) => {
    setChatMessages(prev => ({
      ...prev,
      [chatId]: []
    }));
  };

const handleSendMessage = (msg: { text?: string; imageUrl?: string; audioUrl?: string; videoUrl?: string }) => {
    if (!activeChat) return;

    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: msg.text || '',
      imageUrl: msg.imageUrl,
      audioUrl: msg.audioUrl,
      videoUrl: msg.videoUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
    }));

    // Update last message in chats list
    let summaryText = msg.text || '';
    if (msg.imageUrl) summaryText = '📷 Image';
    if (msg.audioUrl) summaryText = '🎤 Voice note';
    if (msg.videoUrl) summaryText = '🎥 Video';

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? { ...c, lastMessage: summaryText, time: newMessage.time }
          : c
      )
    );

    // Auto reply simulation after 1 second
    setTimeout(() => {
      const replyMsg: MessageItem = {
        id: `msg-reply-${Date.now()}`,
        sender: 'other',
        text: 'Sounds great! Thanks for reaching out.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      playSound(settings.chatSound);
      setChatMessages((prev) => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), replyMsg],
      }));
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? { ...c, lastMessage: replyMsg.text, time: replyMsg.time }
            : c
        )
      );
    }, 1200);
  };

  const handleNewChat = () => {
    const contactNames = ['Emma Watson', 'Liam Neeson', 'Olivia Rodrigo', 'Noah Centineo'];
    const randomName = contactNames[Math.floor(Math.random() * contactNames.length)];
    const newChatId = `chat-${Date.now()}`;
    const newChat: ChatItem = {
      id: newChatId,
      name: randomName,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&auto=format&fit=crop&q=80`,
      lastMessage: 'Hey there! I am using WhatsApp.',
      time: 'Just now',
      unreadCount: 1,
      isOnline: true,
    };
    setChats((prev) => [newChat, ...prev]);
    playSound(settings.chatSound);
    handleSelectChat(newChat);
  };

  const renderSearchHeader = (title: string, onCreate?: () => void) => (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-2">
      <div className="max-w-xs mx-auto flex items-center gap-2">
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200 cursor-pointer hover:opacity-95 transition-opacity"
            title="User Profile"
          >
            <img
              src={currentUser.avatar}
              alt="User Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {showProfileMenu && (
            <ProfileMenu 
              onClose={() => setShowProfileMenu(false)} 
              onNavigate={(view) => {
                if (view === 'logout') {
                  alert('Logging out...');
                } else {
                  setActiveModalView(view);
                }
                setShowProfileMenu(false);
              }} 
            />
          )}
        </div>
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${title}...`}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
          />
        </div>
        {onCreate && (
          <button
            onClick={onCreate}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:text-black hover:border-slate-300 transition-colors flex items-center justify-center shrink-0"
            title={`Create new ${title}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-slate-100 selection:text-slate-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Approval Success Popup */}
      {showApprovalSuccess && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-8 max-w-xs w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Congratulations!</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your subscription has been <span className="text-emerald-600 font-bold">Approved</span>. 
              You now have full access to all premium platform features.
            </p>
            <button 
              onClick={() => setShowApprovalSuccess(false)}
              className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all"
            >
              Great!
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full bg-white min-h-screen">
        {/* Modals/Overlays */}
        {activeModalView === 'my-profile' && (
          <ProfileView 
            user={currentUser} 
            onClose={() => setActiveModalView(null)} 
            onFollow={() => {}} // No-op for self
            onAddFriend={() => {}} // No-op for self
          />
        )}
        {activeModalView === 'edit' && (
          <EditProfile 
            currentUser={currentUser} 
            isAccountDisabled={isAccountDisabled}
            onToggleAccountStatus={() => setIsAccountDisabled(!isAccountDisabled)}
            onClose={() => setActiveModalView(null)} 
          />
        )}
        {activeModalView === 'admin' && (
          <AdminDashboard 
            onClose={() => setActiveModalView(null)} 
            pendingSubmissions={pendingPopSubmissions}
            onApprove={(id) => {
              setPendingPopSubmissions(prev => prev.filter(s => s.id !== id));
              setShowApprovalSuccess(true);
              playSound(settings.notificationSound);
              const newNotif: NotificationItem = {
                id: `notif-${Date.now()}`,
                title: 'Subscription Approved!',
                message: 'Your premium subscription has been activated successfully. Welcome aboard!',
                dateLabel: 'Today',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sourceType: 'notifications',
                sourceId: 'sub-approved',
                read: false
              };
              setNotifications(prev => [newNotif, ...prev]);
            }}
            onReject={(id) => {
              setPendingPopSubmissions(prev => prev.filter(s => s.id !== id));
              setToastMessage('Subscription Rejected.');
              setTimeout(() => setToastMessage(null), 3000);
            }}
          />
        )}
        {activeModalView === 'subscription' && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
            {subscriptionStep === 'select' && (
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={() => setActiveModalView(null)} className="p-1 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-base font-bold text-slate-900">Subscription Plans</h2>
                </div>
                <div className="space-y-4 max-w-sm mx-auto w-full">
                  {[
                    { name: 'R49,99 Monthly', price: 'R49,99' },
                    { name: 'R99,99 Monthly', price: 'R99,99' }
                  ].map(plan => (
                    <div key={plan.name} className="border border-slate-100 rounded-3xl p-6 hover:border-blue-500 transition-all cursor-pointer group bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full uppercase">Monthly</span>
                      </div>
                      <p className="text-xs text-slate-500">Access all core features and premium GiGs listings.</p>
                      <p className="text-2xl font-bold mt-4 text-slate-900">{plan.price}<span className="text-xs text-slate-400 font-medium">/mo</span></p>
                      <button 
                        onClick={() => {
                          setSelectedPlan(plan);
                          setSubscriptionStep('payment');
                        }}
                        className="w-full mt-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl group-hover:bg-blue-600 transition-colors"
                      >
                        Choose Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subscriptionStep === 'payment' && (
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={() => setSubscriptionStep('select')} className="p-1 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-base font-bold text-slate-900">Payment Details</h2>
                </div>
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 max-w-sm mx-auto w-full">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Bank Transfer Info</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Name</p>
                      <p className="text-lg font-bold text-slate-900">Capitec</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Name</p>
                      <p className="text-lg font-bold text-slate-900">Matthews</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                      <p className="text-xl font-bold text-blue-600 tracking-wider">1334067366</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reference</p>
                      <p className="text-lg font-bold text-emerald-600">{selectedPlan?.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSubscriptionStep('upload')}
                    className="w-full mt-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
                  >
                    I Have Paid
                  </button>
                </div>
              </div>
            )}

            {subscriptionStep === 'upload' && (
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={() => setSubscriptionStep('payment')} className="p-1 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-base font-bold text-slate-900">Upload Proof</h2>
                </div>
                <div className="max-w-sm mx-auto w-full">
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-blue-500 transition-all bg-slate-50/50 flex flex-col items-center">
                    {popFile ? (
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                        <img src={popFile} alt="PoP" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setPopFile(null)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input 
                          type="file" 
                          id="pop-upload" 
                          hidden 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setPopFile(URL.createObjectURL(file));
                          }}
                        />
                        <label htmlFor="pop-upload" className="cursor-pointer flex flex-col items-center">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-bold text-slate-900">Select Proof of Payment</p>
                          <p className="text-xs text-slate-400 mt-2">Upload PNG, JPG or PDF from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                  <button 
                    disabled={!popFile || isSubmittingPop}
                    onClick={() => {
                      setIsSubmittingPop(true);
                      setTimeout(() => {
                        const newSubmission = {
                          id: `pop-${Date.now()}`,
                          user: currentUser.name,
                          avatar: currentUser.avatar,
                          plan: selectedPlan?.name,
                          file: popFile,
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          status: 'Pending'
                        };
                        setPendingPopSubmissions(prev => [newSubmission, ...prev]);
                        setSubscriptionStep('review');
                        setIsSubmittingPop(false);
                      }, 2000);
                    }}
                    className={`w-full mt-8 py-4 font-bold rounded-2xl shadow-lg transition-all ${
                      !popFile || isSubmittingPop 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 text-white shadow-emerald-200 active:scale-[0.98]'
                    }`}
                  >
                    {isSubmittingPop ? 'Submitting...' : 'Submit Payment'}
                  </button>
                </div>
              </div>
            )}

            {subscriptionStep === 'review' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
                  <Check className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Congratulations!</h2>
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl text-center max-w-sm">
                  <p className="text-amber-800 text-sm font-semibold mb-2">Under Review</p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Thank you for your payment. Your submission is now being verified by our team. 
                    It typically takes <span className="font-bold">15 to 25 minutes</span>.
                  </p>
                  <div className="mt-4 pt-4 border-t border-amber-200 flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Office Hours</p>
                    <p className="text-xs font-bold text-amber-800">05:00 to 17:00 Daily</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setActiveModalView(null);
                    setSubscriptionStep('select');
                    setPopFile(null);
                  }}
                  className="mt-12 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
        {activeModalView === 'settings' && (
          <SettingsView 
            settings={settings}
            onUpdateSettings={(updates) => setSettings(prev => ({ ...prev, ...updates }))}
            onClose={() => setActiveModalView(null)} 
          />
        )}
        {activeModalView === 'about' && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
             <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveModalView(null)} className="p-1 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-base font-bold text-slate-900">About TimeGig</h2>
            </div>
            <div className="prose prose-slate max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl mb-6 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20">
                <LayoutDashboard className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-4">Empowering Modern Talent</h3>
              <p className="text-sm text-slate-600 leading-relaxed text-center">TimeGig is a specialized marketplace designed to connect skilled professionals with high-impact projects. Our mission is to streamline the gig economy through transparency, security, and elegant design.</p>
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version</p>
                <p className="text-xs font-bold text-slate-900">1.2.0-stable (2026)</p>
              </div>
            </div>
          </div>
        )}
        {activeModalView === 'help' && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col p-6 animate-in slide-in-from-bottom duration-300 text-center items-center justify-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <HelpCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">How can we help?</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xs">Our support team is available 24/7. You can also browse our extensive documentation below.</p>
            <div className="w-full max-w-xs space-y-3">
              <button className="w-full py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-2xl hover:bg-slate-200 transition-colors">Documentation</button>
              <button className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-colors">Contact Support</button>
              <button onClick={() => setActiveModalView(null)} className="w-full py-3 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors">Go Back</button>
            </div>
          </div>
        )}

        {activeTab === 'gigs' && (
          <div className="relative min-h-[calc(100vh-4rem)]">
            {renderSearchHeader('GiGs', () => setCreateModalType('gig'))}
            <GigsScreen 
              items={gigsItems}
              searchQuery={searchQuery}
              onSelectGig={(item) => setSelectedMarketItem(item)}
            />
          </div>
        )}
        {activeTab === 'seekers' && (
          <div className="relative min-h-[calc(100vh-4rem)]">
            {renderSearchHeader('Seekers', () => setCreateModalType('seeker'))}
            <SeekersScreen 
              items={seekersItems}
              searchQuery={searchQuery}
              onSelectSeeker={(item) => setSelectedMarketItem(item)}
            />
          </div>
        )}
        {activeTab === 'market' && (
          <div className="relative min-h-[calc(100vh-4rem)]">
            {renderSearchHeader('Market', () => setCreateModalType('market'))}
            <MarketScreen
              items={marketItems}
              searchQuery={searchQuery}
              onBuyItem={(item) => setSelectedMarketItem(item)}
            />
          </div>
        )}
        {activeTab === 'chats' && (
          <ChatsScreen
            onRemoveChat={handleRemoveChat}
            chats={chats}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
          />
        )}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h1 className="text-base font-semibold text-slate-900">Notifications</h1>
                <p className="text-[11px] text-slate-500">
                  {notifications.length} total, {notifications.filter(n => !n.read).length} unread
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {notifications.length > 0 && (
                  <>
                    {!isSelectionMode ? (
                      <>
                        <button
                          onClick={() => setIsSelectionMode(true)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Clear...
                        </button>
                        <button
                          onClick={handleClearAllNotifications}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                        >
                          Clear All
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSelectAllNotifications}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {selectedNotificationIds.length === notifications.length ? 'Deselect All' : 'Select All'}
                        </button>
                        {selectedNotificationIds.length > 0 && (
                          <button
                            onClick={handleClearSelectedNotifications}
                            className="px-2.5 py-1 text-[11px] font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Clear Sel ({selectedNotificationIds.length})
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsSelectionMode(false);
                            setSelectedNotificationIds([]);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-12">
                <Bell className="w-6 h-6 mx-auto mb-1.5 text-slate-300 stroke-[1.5]" />
                No notifications
              </div>
            ) : (
              <div className="space-y-4">
                {(Object.entries(groupedNotifications) as [string, NotificationItem[]][]).map(([dateLabel, items]) => (
                  <div key={dateLabel} className="space-y-2">
                    <div className="sticky top-12 z-20 bg-white/90 backdrop-blur-xs py-0.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {dateLabel}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {items.map((notif) => {
                        const isSelected = selectedNotificationIds.includes(notif.id);
                        return (
                          <div
                            key={notif.id}
                            className={`flex items-start gap-2.5 p-3 rounded-lg border transition-all ${
                              notif.read
                                ? 'bg-white border-slate-100 hover:border-slate-200'
                                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 shadow-xs'
                            }`}
                          >
                            {isSelectionMode && (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectNotification(notif.id)}
                                className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-black focus:ring-black cursor-pointer"
                              />
                            )}
                            <div
                              onClick={() => handleNotificationClick(notif)}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <div className="flex items-center gap-1.5">
                                  {!notif.read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                  )}
                                  <h4 className="text-xs font-semibold text-slate-900">{notif.title}</h4>
                                </div>
                                <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-normal">{notif.message}</p>
                              
                              {notif.actionRequired && notif.actionType === 'friend_request' && (
                                <div className="mt-3 flex items-center gap-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSound(settings.notificationSound);
                                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, actionRequired: false, message: 'You accepted the friend request.' } : n));
                                      setUserStats(prev => ({ ...prev, friends: prev.friends + 1 }));
                                      setToastMessage('Friend request accepted!');
                                      setTimeout(() => setToastMessage(null), 2000);
                                    }}
                                    className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all"
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, actionRequired: false, message: 'You rejected the friend request.' } : n));
                                      setToastMessage('Friend request rejected.');
                                      setTimeout(() => setToastMessage(null), 2000);
                                    }}
                                    className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-all"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}

                              <div className="mt-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-100 text-slate-700 capitalize">
                                  {notif.sourceType}
                                </span>
                                <span className="text-[10px] text-slate-500 hover:underline">
                                  View source &rarr;
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Modal / Fullscreen View */}
      {createModalType && (
        createModalType === 'market' ? (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            {isCongratulating ? (
              <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-md">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">🎉 Congratulations!</h2>
                <p className="text-base text-slate-600 max-w-md mb-6">
                  Your marketplace listing <span className="font-semibold text-slate-900">"{marketForm.title}"</span> has been successfully published to the Market!
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                  Redirecting to your new listing in Market...
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Create Marketplace Listing</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Fill in the details to publish your item to the marketplace</p>
                  </div>
                  <button
                    onClick={() => setCreateModalType(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateMarketItem} className="space-y-6">
                  {/* Upload multiple images from device by selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Upload Images from Device (Multiple)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMarketImagesChange}
                        className="hidden"
                        id="market-image-upload"
                      />
                      <label htmlFor="market-image-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm font-semibold text-slate-800">Click to upload photos from device</span>
                        <span className="text-xs text-slate-400 mt-1">Support PNG, JPG, WEBP (Select multiple files)</span>
                      </label>
                    </div>

                    {marketForm.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {marketForm.images.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100 shadow-2xs">
                            <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => {
                                setMarketForm(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Item Title *</label>
                      <input
                        type="text"
                        required
                        value={marketForm.title}
                        onChange={(e) => setMarketForm({ ...marketForm, title: e.target.value })}
                        placeholder="e.g. Modern UI Component Library"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                      <select
                        value={marketForm.category}
                        onChange={(e) => setMarketForm({ ...marketForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="Design Assets">Design Assets</option>
                        <option value="Software Templates">Software Templates</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Hardware & Devices">Hardware & Devices</option>
                        <option value="Services & Consulting">Services & Consulting</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Describe market item */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Describe Market Item *</label>
                    <textarea
                      rows={4}
                      required
                      value={marketForm.description}
                      onChange={(e) => setMarketForm({ ...marketForm, description: e.target.value })}
                      placeholder="Describe features, specifications, and what is included..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                    />
                  </div>

                  {/* Set price */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Set Price *</label>
                    <input
                      type="text"
                      required
                      value={marketForm.price}
                      onChange={(e) => setMarketForm({ ...marketForm, price: e.target.value })}
                      placeholder="e.g. $49 or Free"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  {/* Choose province and location option */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Choose Province / State</label>
                      <select
                        value={marketForm.province}
                        onChange={(e) => setMarketForm({ ...marketForm, province: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Ontario">Ontario</option>
                        <option value="British Columbia">British Columbia</option>
                        <option value="Île-de-France">Île-de-France</option>
                        <option value="Tokyo Prefecture">Tokyo Prefecture</option>
                        <option value="Greater London">Greater London</option>
                        <option value="Berlin">Berlin</option>
                        <option value="Remote / Global">Remote / Global</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Location Option</label>
                      <input
                        type="text"
                        value={marketForm.location}
                        onChange={(e) => setMarketForm({ ...marketForm, location: e.target.value })}
                        placeholder="e.g. San Francisco, CA or Remote"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Contact Information</label>
                    <input
                      type="text"
                      value={marketForm.contactInfo}
                      onChange={(e) => setMarketForm({ ...marketForm, contactInfo: e.target.value })}
                      placeholder="e.g. support@yourdomain.com or +1 (555) 019-2834"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCreateModalType(null)}
                      className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-black transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                    >
                      Create Listing
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 capitalize">
                Create New {createModalType}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Title / Name</label>
                  <input
                    type="text"
                    placeholder={`Enter ${createModalType} title...`}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter details..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCreateModalType(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const typeName = createModalType;
                      setCreateModalType(null);
                      setToastMessage(`${typeName} created successfully!`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Chat Conversation Screen Modal */}
      {activeChat && (
        <ChatDetailModal
          onClearChat={() => handleClearChat(activeChat.id)}
          chat={activeChat}
          messages={chatMessages[activeChat.id] || [
            {
              id: 'init',
              sender: 'other',
              text: activeChat.lastMessage,
              time: activeChat.time,
              status: 'read',
            },
          ]}
          onBack={() => setActiveChat(null)}
          onSendMessage={handleSendMessage}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
          onFollow={handleFollow}
          onAddFriend={handleFriendRequest}
        />
      )}

      {selectedMarketItem && (
        <MarketItemDetail
          item={selectedMarketItem}
          onClose={() => setSelectedMarketItem(null)}
          onWhatsAppClick={() => handleMarketWhatsApp(selectedMarketItem)}
          onInAppChatClick={() => handleMarketInAppChat(selectedMarketItem)}
        />
      )}

      {/* White Bottom Menu Bar */}
      {!activeChat && (
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSearchQuery('');
          }}
          unreadChatsCount={unreadChatsCount}
          unreadNotificationsCount={notifications.filter(n => !n.read).length}
        />
      )}
    </div>
  );
}
