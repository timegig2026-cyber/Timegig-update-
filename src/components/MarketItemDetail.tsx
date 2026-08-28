import React, { useState, useRef } from 'react';
import { ChevronLeft, MapPin, Star, MessageCircle, X, ChevronRight, ThumbsUp, Share2 } from 'lucide-react';
import { MarketItem } from '../types';
import { getTranslation, TranslationKey } from '../lib/i18n';

interface MarketItemDetailProps {
  item: MarketItem;
  onClose: () => void;
  onWhatsAppClick: () => void;
  onInAppChatClick: () => void;
  onLike?: (id: string) => void;
  onShare?: (item: MarketItem) => void;
  language?: string;
}

export const MarketItemDetail: React.FC<MarketItemDetailProps> = ({ item, onClose, onWhatsAppClick, onInAppChatClick, onLike, onShare, language = 'en' }) => {
  const t = (key: TranslationKey) => getTranslation(language, key);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setIsFullscreen(true);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const index = Math.round(scrollPosition / width);
      setActiveImageIndex(index);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Images */}
        <div className="relative w-full aspect-square bg-slate-100">
          {item.images && item.images.length > 0 ? (
            <>
              <img 
                src={item.images[0]} 
                alt={item.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(0)}
              />
              {item.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                  1 / {item.images.length}
                </div>
              )}
            </>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xl bg-slate-200/50">
                {item.category}
             </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
             <h1 className="text-2xl font-bold text-slate-900 leading-tight flex-1">{item.title}</h1>
             <div className="flex items-center gap-2 shrink-0">
               <button 
                 onClick={() => onLike?.(item.id)}
                 className={`p-2 rounded-full transition-all ${item.isLiked ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
               >
                 <ThumbsUp className={`w-5 h-5 ${item.isLiked ? 'fill-current' : ''}`} />
                 {item.likes !== undefined && <span className="text-[10px] font-bold block text-center mt-0.5">{item.likes}</span>}
               </button>
               <button 
                 onClick={() => onShare?.(item)}
                 className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all"
               >
                 <Share2 className="w-5 h-5" />
               </button>
             </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-4">{item.price}</div>
          
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
            <span className="leading-tight">{item.location}{item.province ? `, ${item.province}` : ''}</span>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-3">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                {item.seller.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900">{item.seller}</div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {item.rating} Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-3 z-20 pb-safe">
        <button 
          onClick={onWhatsAppClick}
          className="flex-1 bg-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#22bf5b] transition-colors"
        >
          {/* WhatsApp SVG Icon */}
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 fill-current border-none">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          WhatsApp
        </button>
        <button 
          onClick={onInAppChatClick}
          className="flex-1 bg-slate-900 text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Chat
        </button>
      </div>

      {/* Full Screen Image Gallery Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-[70] flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="text-white font-medium text-sm">
              {activeImageIndex + 1} / {item.images.length}
            </div>
            <button onClick={() => setIsFullscreen(false)} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center justify-start"
            onScroll={handleScroll}
            style={{ scrollBehavior: 'smooth' }}
          >
            {item.images.map((img, idx) => (
              <div key={idx} className="w-full h-full shrink-0 snap-center flex items-center justify-center p-2">
                <img 
                  src={img} 
                  alt={`${item.title} - ${idx + 1}`} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
          
          {/* Desktop Next/Prev Controls */}
          {item.images.length > 1 && (
             <>
                <button 
                  onClick={() => {
                     if (scrollRef.current) {
                        const newIdx = Math.max(0, activeImageIndex - 1);
                        scrollRef.current.scrollTo({ left: newIdx * scrollRef.current.clientWidth, behavior: 'smooth' });
                     }
                  }}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors hidden sm:block ${activeImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => {
                     if (scrollRef.current) {
                        const newIdx = Math.min(item.images.length - 1, activeImageIndex + 1);
                        scrollRef.current.scrollTo({ left: newIdx * scrollRef.current.clientWidth, behavior: 'smooth' });
                     }
                  }}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors hidden sm:block ${activeImageIndex === item.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
             </>
          )}
        </div>
      )}
    </div>
  );
};
