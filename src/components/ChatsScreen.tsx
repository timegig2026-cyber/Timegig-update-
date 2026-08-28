import React, { useState } from "react";

import {
  Search,
  MessageSquarePlus,
  CheckCheck,
  Pin,
  Archive,
  Trash2,
  X,
} from "lucide-react";

import { ChatItem } from "../types";

interface ChatsScreenProps {
  chats: ChatItem[];

  onSelectChat: (chat: ChatItem) => void;

  onNewChat: () => void;
  onRemoveChat?: (chatId: string) => void;
}

export const ChatsScreen: React.FC<ChatsScreenProps> = ({
  chats,
  onSelectChat,
  onNewChat,
  onRemoveChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "favorites" | "groups"
  >("all");

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "unread") {
      return (chat.unreadCount ?? 0) > 0;
    }

    if (activeFilter === "groups") {
      return (
        chat.name.toLowerCase().includes("group") ||
        chat.name.toLowerCase().includes("hub") ||
        chat.name.toLowerCase().includes("family")
      );
    }

    if (activeFilter === "favorites") {
      return chat.isPinned;
    }

    return true;
  });

  const availableContacts = [
    {
      id: "c1",
      name: "Emma Watson",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "c2",
      name: "Liam Neeson",
      role: "Full Stack Dev",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "c3",
      name: "Olivia Rodrigo",
      role: "Project Manager",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "c4",
      name: "Noah Centineo",
      role: "Frontend Engineer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    ...chats.map((c) => ({
      id: c.id,
      name: c.name,
      role: "Contact",
      avatar: c.avatar,
    })),
  ].filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);
  // Unique by name

  const handleContactSelect = (contact: any) => {
    // If chat already exists, select it
    const existingChat = chats.find((c) => c.name === contact.name);

    if (existingChat) {
      onSelectChat(existingChat);
    } else {
      // Otherwise fallback to app's random new chat generation (since it handles creating state)
      // Or better, let's trigger onNewChat for now.
      onNewChat();
    }

    setIsContactModalOpen(false);
  };

  return (
    <div
      id="chats-screen"
      className="min-h-screen overflow-x-hidden w-full bg-white text-slate-900 pb-20 pt-4 px-4 max-w-2xl mx-auto"
    >
      {/* Title Header with Clean Minimalism typography */}

      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Messages
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Select a contact below or pick a conversation
          </p>
        </div>
        <button
          id="new-chat-button"
          onClick={() => setIsContactModalOpen(true)}

          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors focus:outline-none"
          title="New Chat"
        >
          <MessageSquarePlus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input on pure white theme */}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          id="search-chats-input"
          type="text"
          value={searchQuery}

          onChange={(e) => setSearchQuery(e.target.value)}

          placeholder="Search conversations..."
          className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 placeholder-slate-400 rounded-xl border border-slate-100 focus:border-blue-500 focus:outline-none transition-all"
        />
      </div>

      {/* Contact List First - User can decide which contact to chat with */}

      <div className="mb-4">
        <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Contacts
        </h2>
        <div className="flex overflow-x-auto items-center gap-3 pb-1 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {chats.map((chat) => (
            <div
              key={`contact-${chat.id}
`}

              onClick={() => onSelectChat(chat)}

              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              <div className="relative mb-1">
                <img
                  src={chat.avatar}

                  alt={chat.name}

                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-transparent group-hover:border-blue-500 transition-all shadow-xs"
                />
                {chat.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-700 max-w-[48px] truncate text-center">
                {chat.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs / Pills */}

      <div className="flex flex-wrap items-center gap-1.5 pb-3 text-[11px] font-medium">
        {[
          {
            id: "all",
            label: "All",
          },
          {
            id: "unread",
            label: "Unread",
          },
          {
            id: "favorites",
            label: "Favorites",
          },
          {
            id: "groups",
            label: "Groups",
          },
        ].map((tab) => (
          <button
            key={tab.id}

            id={`filter-${tab.id}
`}

            onClick={() => setActiveFilter(tab.id as any)}

            className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors font-semibold ${
              activeFilter === tab.id
                ? "bg-blue-500 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }
`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chats List */}

      <div className="space-y-1">
        {filteredChats.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}

              id={`chat-item-${chat.id}
`}

              onClick={() => onSelectChat(chat)}

              className="flex items-start p-2.5 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer"
            >
              <div className="relative shrink-0">
                <img
                  src={chat.avatar}

                  alt={chat.name}

                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-100"
                />
                {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="ml-3 flex-1 border-b border-slate-50 pb-2.5">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold text-sm text-slate-900">
                    {chat.name}
                  </h3>
                  <span
                    className={`text-[10px] font-medium ${
                      (chat.unreadCount ?? 0) > 0
                        ? "text-blue-600 font-semibold"
                        : "text-slate-400"
                    }
`}
                  >
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-1.5 text-slate-500 text-[11px] pr-2">
                    {(chat.unreadCount ?? 0) === 0 && (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <span className="whitespace-normal break-words">
                      {chat.lastMessage}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 shrink-0 pt-0.5">
                    {chat.isPinned && (
                      <Pin className="w-3 h-3 text-slate-400 rotate-45" />
                    )}
                    {(chat.unreadCount ?? 0) > 0 && (
                      <span className="min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[9px] font-bold text-white bg-blue-500 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                    {onRemoveChat && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveChat(chat.id); }}
                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Chat Contacts Modal */}

      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <div className="bg-white sticky top-0 z-10 border-b border-slate-100 px-2 py-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setIsContactModalOpen(false)}

                className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold text-slate-900 flex-1">
                New Chat
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-7 pr-2 py-1.5 bg-slate-50 focus:bg-white text-[11px] text-slate-900 placeholder-slate-400 rounded-lg border border-slate-100 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-0.5">
            <div className="p-1">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                All Contacts
              </h3>
              <div className="space-y-0.5">
                {availableContacts.map((contact) => (
                  <div
                    key={contact.id}

                    onClick={() => handleContactSelect(contact)}

                    className="flex items-center p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={contact.avatar}

                      alt={contact.name}

                      className="w-6 h-6 rounded-md object-cover border border-slate-100"
                    />
                    <div className="ml-2 flex-1">
                      <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                        {contact.name}
                      </h4>
                      <p className="text-[9px] text-slate-500 leading-tight">
                        {contact.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
