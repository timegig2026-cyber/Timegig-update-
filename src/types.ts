export interface MarketItem {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  province: string;
  location: string;
  contactInfo: string;
  images: string[];
  seller: string;
  rating: string;
  likes?: number;
  isLiked?: boolean;
}

export interface Settings {
  isSoundEnabled: boolean;
  notificationSound: string;
  chatSound: string;
  isPrivate: boolean;
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  language: string;
  country: string;
  currency: string;
}

export type TabType = 'gigs' | 'seekers' | 'market' | 'chats' | 'notifications';

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  role?: string;
}

export interface MessageItem {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  isLiked?: boolean;
}

export interface StatusItem {
  id: string;
  name: string;
  avatar: string;
  time: string;
  isViewed: boolean;
  isMine?: boolean;
  mediaText?: string;
}

export interface CallItem {
  id: string;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  isVideo: boolean;
  time: string;
  duration?: string;
}

export interface CommunityItem {
  id: string;
  name: string;
  description: string;
  avatar: string;
  subgroupsCount: number;
  membersCount: number;
  announcement: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  dateLabel: string; // 'Today', 'Yesterday', 'August 25, 2026', etc.
  timestamp: string;
  sourceType: 'gigs' | 'seekers' | 'market' | 'chats' | 'notifications' | 'friend_request';
  sourceId: string;
  read: boolean;
  actionRequired?: boolean;
  actionType?: 'friend_request';
  senderAvatar?: string;
  senderName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  province?: string;
  location?: string;
  isOnline?: boolean;
  followers: number;
  following: number;
  friends: number;
  isFollowing?: boolean;
  isFriend?: boolean;
  hasPendingRequest?: boolean;
  followingList?: string[];
  friendsList?: string[];
  userStats?: {
    followers: number;
    following: number;
    friends: number;
  };
}
