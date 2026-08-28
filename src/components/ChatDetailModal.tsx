import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Video,
  Phone,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  CheckCheck,
  Smile,
  X,
  PhoneOff,
  MicOff,
  VideoOff,
  Square,
  Edit2,
  Trash2
} from 'lucide-react';
import { ChatItem, MessageItem } from '../types';
import EmojiPicker from 'emoji-picker-react';
import { ProfileView } from './ProfileView';

interface ChatDetailModalProps {
  chat: ChatItem;
  messages: MessageItem[];
  onBack: () => void;
  onSendMessage: (msg: { text?: string; imageUrl?: string; audioUrl?: string; videoUrl?: string }) => void;
  onUpdateMessage?: (msgId: string, updates: Partial<MessageItem>) => void;
  onDeleteMessage?: (msgId: string) => void;
  onClearChat?: () => void;
  onFollow?: (name: string) => void;
  onUnfollow?: (name: string) => void;
  onAddFriend?: (name: string, avatar: string) => void;
  onUnfriend?: (name: string) => void;
  isFollowing?: boolean;
  isFriend?: boolean;
}

export const ChatDetailModal: React.FC<ChatDetailModalProps> = ({
  chat,
  messages,
  onBack,
  onSendMessage,
  onUpdateMessage,
  onDeleteMessage,
  onClearChat,
  onFollow,
  onUnfollow,
  onAddFriend,
  onUnfriend,
  isFollowing,
  isFriend
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Call State
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [callState, setCallState] = useState<'ringing' | 'active' | null>(null);

  // Video Streams
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle Call
  const startCall = async (type: 'audio' | 'video') => {
    setCallType(type);
    setCallState('ringing');
    
    if (type === 'video') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera access denied:", e);
      }
    }

    setTimeout(() => {
      setCallState('active');
      if (type === 'video' && localVideoRef.current && localStreamRef.current) {
         localVideoRef.current.srcObject = localStreamRef.current;
      }
    }, 2500); // Simulate answer after 2.5s
  };

  const endCall = () => {
    setCallType(null);
    setCallState(null);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };

  // Handle Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage({ audioUrl });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  // Handle Images and Videos
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isVideo) {
        onSendMessage({ videoUrl: dataUrl });
      } else {
        onSendMessage({ imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    if (editingMessageId && onUpdateMessage) {
      onUpdateMessage(editingMessageId, { text: inputText.trim() });
      setEditingMessageId(null);
    } else {
      onSendMessage({ text: inputText.trim() });
    }
    
    setInputText('');
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiObject: any) => {
    setInputText(prev => prev + emojiObject.emoji);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Interaction handlers for message bubbles
  const handleEdit = (msg: MessageItem) => {
    if (!msg.text) return;
    setInputText(msg.text);
    setEditingMessageId(msg.id);
    setSelectedMessageId(null);
  };

  const handleDelete = (id: string) => {
    if (onDeleteMessage) {
      onDeleteMessage(id);
    }
    setSelectedMessageId(null);
  };

  const toggleLike = (msg: MessageItem) => {
    if (onUpdateMessage) {
      onUpdateMessage(msg.id, { isLiked: !msg.isLiked });
    }
  };

  const createTouchHandlers = (msg: MessageItem) => {
    let clickTimer: NodeJS.Timeout | null = null;
    let longPressTimer: NodeJS.Timeout | null = null;
    let clickCount = 0;

    const onStart = (e: React.MouseEvent | React.TouchEvent) => {
      if ((e.target as HTMLElement).closest('.bubble-actions')) return;
      
      longPressTimer = setTimeout(() => {
        if (navigator.share && msg.text) {
          navigator.share({
            title: 'Shared Message',
            text: msg.text
          }).catch(console.error);
        }
      }, 1000);
    };

    const onEnd = (e: React.MouseEvent | React.TouchEvent) => {
      if ((e.target as HTMLElement).closest('.bubble-actions')) return;

      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const onClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.bubble-actions')) return;
      
      clickCount++;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          setSelectedMessageId(prev => prev === msg.id ? null : msg.id);
          clickCount = 0;
        }, 250);
      } else if (clickCount === 2) {
        if (clickTimer) clearTimeout(clickTimer);
        toggleLike(msg);
        clickCount = 0;
      }
    };

    return {
      onMouseDown: onStart,
      onTouchStart: onStart,
      onMouseUp: onEnd,
      onTouchEnd: onEnd,
      onTouchMove: onEnd,
      onMouseLeave: onEnd,
      onClick: onClick
    };
  };

  return (
    <div
      id="chat-detail-view"
      className="fixed inset-0 z-50 bg-white flex flex-col max-w-md mx-auto"
    >
      {/* Profile View Modal */}
      {showProfile && (
        <ProfileView 
          user={{
            id: chat.id,
            name: chat.name,
            email: `${chat.name.toLowerCase().replace(' ', '.')}@example.com`,
            avatar: chat.avatar,
            isOnline: chat.isOnline,
            followers: 842,
            following: 256,
            friends: 124,
            isFollowing,
            isFriend
          }} 
          onClose={() => setShowProfile(false)} 
          onFollow={() => onFollow?.(chat.name)}
          onUnfollow={() => onUnfollow?.(chat.name)}
          onAddFriend={() => onAddFriend?.(chat.name, chat.avatar)}
          onUnfriend={() => onUnfriend?.(chat.name)}
        />
      )}

      {/* Call Screen Modal */}
      {callType && (
        <div className="absolute inset-0 z-50 bg-slate-900 text-white flex flex-col animate-in fade-in duration-300 overflow-hidden">
          {callType === 'video' ? (
            <div className="flex-1 relative flex flex-col bg-black">
              {/* Remote Video */}
              <div className="absolute inset-0 w-full h-full">
                {callState === 'active' ? (
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                    src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                    <img 
                      src={chat.avatar} 
                      alt={chat.name} 
                      className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-slate-700 animate-pulse"
                    />
                    <h2 className="text-3xl font-semibold mb-2">{chat.name}</h2>
                    <p className="text-slate-400 text-lg">Calling...</p>
                  </div>
                )}
              </div>
              
              {/* Local Video */}
              <div className="absolute top-6 right-6 w-28 h-40 bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 z-10">
                 <video 
                    ref={localVideoRef}
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                 />
              </div>

              {/* Overlay Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center gap-8 bg-gradient-to-t from-black/80 to-transparent pb-12 pt-20 z-10">
                <button className="p-4 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-colors backdrop-blur-md">
                  <MicOff className="w-6 h-6" />
                </button>
                <button 
                  onClick={endCall}
                  className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-lg shadow-red-500/20"
                >
                  <PhoneOff className="w-8 h-8" />
                </button>
                <button className="p-4 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-colors backdrop-blur-md">
                  <VideoOff className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            // Audio Call UI
            <>
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <img 
                  src={chat.avatar} 
                  alt={chat.name} 
                  className={`w-32 h-32 rounded-full object-cover mb-6 border-4 border-slate-700 ${callState === 'ringing' ? 'animate-pulse' : ''}`}
                />
                <h2 className="text-3xl font-semibold mb-2">{chat.name}</h2>
                <p className="text-slate-400 text-lg">
                  {callState === 'ringing' ? `Calling...` : 'In Call 0:01'}
                </p>
              </div>
              <div className="pb-12 pt-6 px-8 flex justify-center items-center gap-8 bg-slate-800/50">
                <button className="p-4 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-colors">
                  <MicOff className="w-6 h-6" />
                </button>
                <button 
                  onClick={endCall}
                  className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-lg shadow-red-500/20"
                >
                  <PhoneOff className="w-8 h-8" />
                </button>
                <button className="p-4 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-colors">
                  <VideoOff className="w-6 h-6" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Clean Chat Top Row */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button
            id="back-button"
            onClick={onBack}
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
            src={chat.avatar}
            alt={chat.name}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h2>
            <p className="text-[11px] text-gray-500">
              {chat.isOnline ? 'online' : 'last seen recently'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-600">
          <button onClick={() => startCall('video')} className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button onClick={() => startCall('audio')} className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    setShowProfile(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View contact profile
                </button>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    if(onClearChat) onClearChat();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear all conversations
                </button>
                <button 
                  onClick={() => {
                    setIsBlocked(!isBlocked);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  {isBlocked ? 'Unblock contact' : 'Block contact'}
                </button>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    setShowReportOptions(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Report contact
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Options Modal */}
      {showReportOptions && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Report contact</h3>
              <p className="text-xs text-gray-500 mt-1">Select a reason for reporting this contact</p>
            </div>
            <div className="py-2">
              {[
                'Spam',
                'Harassment',
                'Fraud or Scam',
                'Inappropriate Content',
                'Impersonation',
                'Other'
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setShowReportOptions(false);
                    alert(`Contact reported for: ${option}`);
                  }}
                  className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="p-3 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowReportOptions(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white relative">
        <div className="flex justify-center my-2">
          <div className="bg-amber-50/80 border border-amber-100 text-amber-800 text-[11px] px-3 py-1.5 rounded-lg text-center max-w-xs leading-relaxed shadow-2xs">
            🔒 Messages are end-to-end encrypted. No one outside of this chat can read or listen to them.
          </div>
        </div>
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          const isSelected = selectedMessageId === msg.id;
          
          return (
            <div
              key={msg.id}
              className={`flex flex-col relative ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                {...createTouchHandlers(msg)}
                className={`max-w-[80%] rounded-2xl text-sm shadow-2xs overflow-hidden cursor-pointer select-none relative ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-gray-100 text-gray-900 rounded-bl-xs border border-gray-200/60'
                }`}
              >
                {msg.videoUrl && (
                  <video src={msg.videoUrl} controls className="w-full max-h-64 object-cover block pointer-events-auto" />
                )}
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Attached" className="w-full max-h-64 object-cover block pointer-events-none" />
                )}
                {msg.audioUrl && (
                  <div className="p-2 w-48 bubble-actions">
                    <audio controls src={msg.audioUrl} className="w-full h-8" />
                  </div>
                )}
                {msg.text && (
                  <p className="leading-relaxed break-words px-3.5 pt-2 pb-1 pointer-events-none">{msg.text}</p>
                )}
                
                {(!msg.text && (msg.imageUrl || msg.audioUrl || msg.videoUrl)) && (
                   <div className="px-3.5 pb-1"></div>
                )}

                <div
                  className={`flex items-center justify-end gap-1 text-[10px] pb-1.5 px-3.5 pointer-events-none ${
                    isMe ? 'text-emerald-100' : 'text-gray-400'
                  } ${!msg.text && (msg.imageUrl || msg.audioUrl || msg.videoUrl) ? '-mt-1' : ''}`}
                >
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                </div>

                {msg.isLiked && (
                  <div className={`absolute -bottom-1 ${isMe ? '-left-2' : '-right-2'} bg-white border border-gray-100 shadow-sm rounded-full p-0.5 leading-none z-10`}>
                    <span className="text-[12px]">👍</span>
                  </div>
                )}
              </div>

              {/* Edit/Delete Popover */}
              {isSelected && isMe && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-xl flex items-center z-10 bubble-actions animate-in fade-in slide-in-from-top-1">
                  <button onClick={() => handleEdit(msg)} className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm flex items-center gap-2 border-r border-gray-100 transition-colors">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(msg.id)} className="px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex items-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input */}
      <div className="relative p-2.5 bg-white border-t border-gray-100">
        {showEmojiPicker && (
          <div className="absolute bottom-full left-2 mb-2 shadow-xl rounded-2xl overflow-hidden border border-slate-100 z-10">
            <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} />
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*,video/*" 
          onChange={handleImageUpload} 
        />

        {isRecording ? (
          <div className="flex items-center gap-3 bg-red-50 text-red-600 rounded-full px-4 py-2 border border-red-100 animate-in slide-in-from-right">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="flex-1 font-medium text-sm">{formatDuration(recordingDuration)}</span>
            <button 
              onClick={stopRecording}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
            <div className={`flex-1 flex items-center rounded-full px-3 py-1.5 border transition-all ${editingMessageId ? 'bg-amber-50 border-amber-200 focus-within:border-amber-400' : 'bg-gray-100 border-transparent focus-within:border-emerald-500 focus-within:bg-white'}`}>
              {editingMessageId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingMessageId(null); setInputText(''); }}
                  className="mr-2 text-amber-500 hover:text-amber-700 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {!editingMessageId && (
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`mr-2 focus:outline-none transition-colors ${showEmojiPicker ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Smile className="w-5 h-5" />
                </button>
              )}
              <input
                id="chat-message-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
                placeholder={editingMessageId ? "Edit message..." : "Message"}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              {!editingMessageId && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-gray-600 ml-1 p-1 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {inputText.trim() ? (
              <button
                id="send-message-button"
                type="submit"
                className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors shadow-xs shrink-0 ${editingMessageId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {editingMessageId ? <CheckCheck className="w-4 h-4" /> : <Send className="w-4 h-4 -translate-x-0.5 translate-y-0.5" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-xs shrink-0"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
