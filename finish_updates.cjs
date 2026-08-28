const fs = require('fs');

// 1. ChatDetailModal modifications
let chat = fs.readFileSync('src/components/ChatDetailModal.tsx', 'utf8');

// Replace ThumbsUp icon with actual 👍 emoji
chat = chat.replace(
  /<ThumbsUp className="[^"]*" \/>/g,
  '<span className="text-[12px]">👍</span>'
);

// Remove Camera icon from the input area
chat = chat.replace(
  /<button[^>]*>\s*<Camera className="w-4 h-4" \/>\s*<\/button>/g,
  ''
);

// Add 3-dot dropdown menu state and logic
if (!chat.includes('showDropdown')) {
  chat = chat.replace(
    'const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);',
    'const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);\n  const [showDropdown, setShowDropdown] = useState(false);\n  const [isBlocked, setIsBlocked] = useState(false);'
  );
  
  // Also need to add onClearChat to props if not there
  if (!chat.includes('onClearChat?: () => void;')) {
     chat = chat.replace(
       'onDeleteMessage?: (msgId: string) => void;',
       'onDeleteMessage?: (msgId: string) => void;\n  onClearChat?: () => void;'
     );
     chat = chat.replace(
       'onDeleteMessage',
       'onDeleteMessage,\n  onClearChat'
     );
  }

  const dropdownHTML = `
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
                  onClick={() => setShowDropdown(false)}
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
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Report contact
                </button>
              </div>
            )}
          </div>
  `;
  
  // Replace the exact 3-dot button with the dropdownHTML
  chat = chat.replace(
    /<button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">\s*<MoreVertical className="w-5 h-5" \/>\s*<\/button>/g,
    dropdownHTML
  );
}

fs.writeFileSync('src/components/ChatDetailModal.tsx', chat);
console.log("ChatDetailModal patched.");
