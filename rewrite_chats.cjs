const fs = require('fs');

let code = fs.readFileSync('src/components/ChatsScreen.tsx', 'utf8');

// Update Props
code = code.replace(
  'onNewChat: () => void;',
  'onNewChat: () => void;\n  onRemoveChat?: (chatId: string) => void;'
);

code = code.replace(
  'onNewChat,\n})',
  'onNewChat,\n  onRemoveChat,\n})'
);

// Add Trash2 to imports
code = code.replace(
  'Archive,',
  'Archive,\n  Trash2,'
);

// Update Contacts section
code = code.replace(
  '<div className="flex flex-wrap items-center gap-3 pb-1">',
  '<div className="flex overflow-x-auto items-center gap-3 pb-1 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>'
);

// Add Trash2 to Chat List Items
const chatItemStart = '<div className="flex items-start justify-between">';
const chatItemReplacement = `<div className="flex items-start justify-between">
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
                </div>`;

code = code.replace(
  /<div className="flex items-start justify-between">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g,
  chatItemReplacement + '\n              </div>\n            </div>'
);


fs.writeFileSync('src/components/ChatsScreen.tsx', code);
