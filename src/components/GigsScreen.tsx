import React from 'react';
import { MarketItem } from '../types';
import { Briefcase, ShoppingBag, ThumbsUp, Share2 } from 'lucide-react';
import { getTranslation, TranslationKey } from '../lib/i18n';

interface GigsScreenProps {
  items: MarketItem[];
  searchQuery: string;
  onSelectGig: (item: MarketItem) => void;
  onLike?: (id: string) => void;
  onShare?: (item: MarketItem) => void;
  language?: string;
}

export const GigsScreen: React.FC<GigsScreenProps> = ({ items, searchQuery, onSelectGig, onLike, onShare, language = 'en' }) => {
  const t = (key: TranslationKey) => getTranslation(language, key);
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="gigs-screen" className="min-h-screen bg-white text-slate-900 pb-28 pt-4 px-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">GiGs</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Explore active work opportunities and projects</p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-slate-100 mb-4"></div>

      {filteredItems.length === 0 ? (
        <div className="text-center text-slate-400 text-xs py-12">
          <Briefcase className="w-7 h-7 mx-auto mb-1.5 text-slate-300 stroke-[1.5]" />
          No gigs found matching "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectGig(item)}
              className="cursor-pointer group flex flex-col"
            >
              <div className="w-full aspect-square bg-slate-100 relative overflow-hidden rounded-lg mb-2">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-white/90 text-slate-800 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase backdrop-blur-sm">
                  {item.category}
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike?.(item.id);
                    }}
                    className={`p-1.5 rounded-full backdrop-blur-md transition-all ${item.isLiked ? 'bg-blue-600 text-white' : 'bg-white/80 text-slate-600 hover:bg-white'}`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${item.isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare?.(item);
                    }}
                    className="p-1.5 bg-white/80 backdrop-blur-md text-slate-600 rounded-full hover:bg-white transition-all"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="px-1 flex flex-col">
                <span className="font-bold text-sm sm:text-base text-slate-900 leading-tight mb-0.5">
                  {item.price}
                </span>
                <span className="text-xs sm:text-sm text-slate-700 line-clamp-1 mb-0.5">
                  {item.title}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">
                  {item.seller} • {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
