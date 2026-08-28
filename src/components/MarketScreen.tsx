import React from 'react';
import { MarketItem } from '../types';
import { ShoppingBag, Star, MapPin, Mail, Tag, ExternalLink, ThumbsUp, Share2 } from 'lucide-react';
import { getTranslation, TranslationKey } from '../lib/i18n';

interface MarketScreenProps {
  items: MarketItem[];
  searchQuery: string;
  onBuyItem: (item: MarketItem) => void;
  onLike?: (id: string) => void;
  onShare?: (item: MarketItem) => void;
  language?: string;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({ items, searchQuery, onBuyItem, onLike, onShare, language = 'en' }) => {
  const t = (key: TranslationKey) => getTranslation(language, key);
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="market-screen" className="min-h-screen bg-white text-slate-900 pb-28 pt-4 px-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marketplace</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Discover and buy digital assets, templates, and services</p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-slate-100 mb-4"></div>

      {filteredItems.length === 0 ? (
        <div className="text-center text-slate-400 text-xs py-12">
          <ShoppingBag className="w-7 h-7 mx-auto mb-1.5 text-slate-300 stroke-[1.5]" />
          No marketplace items found matching "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onBuyItem(item)}
              className="cursor-pointer group flex flex-col"
            >
              {item.images && item.images.length > 0 ? (
                <div className="w-full aspect-square bg-slate-100 relative overflow-hidden rounded-lg mb-2">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm">
                      {item.images.length}
                    </div>
                  )}
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
              ) : (
                <div className="w-full aspect-square bg-slate-100 flex items-center justify-center rounded-lg mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white/50 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              )}
              
              <div className="px-1 flex flex-col">
                <span className="font-bold text-sm sm:text-base text-slate-900 leading-tight mb-0.5">
                  {item.price}
                </span>
                <span className="text-xs sm:text-sm text-slate-700 line-clamp-1 mb-0.5">
                  {item.title}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">
                  {item.location} {item.province ? `, ${item.province}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
