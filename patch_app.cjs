const fs = require('fs');

let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes('videoUrl?: string;')) {
  types = types.replace(
    /audioUrl\?: string;/g,
    'audioUrl?: string;\n  videoUrl?: string;'
  );
  fs.writeFileSync('src/types.ts', types);
  console.log("Updated types.ts");
}

let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('handleRemoveChat')) {
  const insertIndex = app.indexOf('const handleSendMessage =');
  const codeToInsert = `
  const handleRemoveChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
  };

  const handleClearChat = (chatId: string) => {
    setChatMessages(prev => ({
      ...prev,
      [chatId]: []
    }));
  };

`;
  app = app.substring(0, insertIndex) + codeToInsert + app.substring(insertIndex);
  
  app = app.replace(
    'const handleSendMessage = (msg: { text?: string; imageUrl?: string; audioUrl?: string }) => {',
    'const handleSendMessage = (msg: { text?: string; imageUrl?: string; audioUrl?: string; videoUrl?: string }) => {'
  );

  app = app.replace(
    'audioUrl: msg.audioUrl,',
    'audioUrl: msg.audioUrl,\n      videoUrl: msg.videoUrl,'
  );

  app = app.replace(
    "if (msg.audioUrl) summaryText = '🎤 Voice note';",
    "if (msg.audioUrl) summaryText = '🎤 Voice note';\n    if (msg.videoUrl) summaryText = '🎥 Video';"
  );

  app = app.replace(
    '<ChatsScreen',
    '<ChatsScreen\n            onRemoveChat={handleRemoveChat}'
  );

  app = app.replace(
    '<ChatDetailModal',
    '<ChatDetailModal\n          onClearChat={() => handleClearChat(activeChat.id)}'
  );

  fs.writeFileSync('src/App.tsx', app);
  console.log("Updated App.tsx");
}
