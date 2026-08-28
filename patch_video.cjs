const fs = require('fs');

let chat = fs.readFileSync('src/components/ChatDetailModal.tsx', 'utf8');

// Update file upload to accept video
chat = chat.replace(
  'accept="image/*"',
  'accept="image/*,video/*"'
);

// Update handleImageUpload to handle videos
if (!chat.includes('const isVideo = file.type.startsWith(\'video/\');')) {
  chat = chat.replace(
    'const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {',
    `const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }; //`
  );
  
  // Clean up the replaced old handleImageUpload function by matching and replacing
  chat = chat.replace(
    /const handleImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => {[\s\S]*?reader\.readAsDataURL\(file\);\n    e\.target\.value = '';\n  };/,
    `const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };`
  );
}

// Ensure msg.videoUrl is rendered
if (!chat.includes('msg.videoUrl &&')) {
  chat = chat.replace(
    '{msg.imageUrl && (',
    `{msg.videoUrl && (
                  <video src={msg.videoUrl} controls className="w-full max-h-64 object-cover block pointer-events-auto" />
                )}
                {msg.imageUrl && (`
  );
  
  chat = chat.replace(
    /!\msg.text && \(msg.imageUrl || msg.audioUrl\)/g,
    '!msg.text && (msg.imageUrl || msg.audioUrl || msg.videoUrl)'
  );
}

fs.writeFileSync('src/components/ChatDetailModal.tsx', chat);
console.log("Video attachment patched.");
