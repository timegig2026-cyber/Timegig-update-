import React from 'react';
import { MarketItem } from '../types';
import { Users, Star, ShoppingBag } from 'lucide-react';

interface SeekersScreenProps {
  items: MarketItem[];
  searchQuery: string;
  onSelectSeeker: (item: MarketItem) => void;
}

export const SeekersScreen: React.FC<SeekersScreenProps> = ({ items, searchQuery, onSelectSeeker }) => {
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="seekers-screen" className="min-h-screen bg-white text-slate-900 pb-28 pt-4 px-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Seekers</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Find talented professionals and experts</p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-slate-100 mb-4"></div>

      {filteredItems.length === 0 ? (
        <div className="text-center text-slate-400 text-xs py-12">
          <Users className="w-7 h-7 mx-auto mb-1.5 text-slate-300 stroke-[1.5]" />
          No seekers found matching "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSeeker(item)}
              className="cursor-pointer group flex flex-col"
            >
              <div className="w-full aspect-square bg-slate-100 relative overflow-hidden rounded-lg mb-2">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {item.rating}
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
                  {item.category} • {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
