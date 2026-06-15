import { AlertCircle, Bell } from 'lucide-react';
import { useState } from 'react';

interface OutOfStockBadgeProps {
  compact?: boolean;
  onNotify?: () => void;
}

export function OutOfStockBadge({ compact = false, onNotify }: OutOfStockBadgeProps) {
  const [showNotify, setShowNotify] = useState(false);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">
        <AlertCircle size={12} />
        <span>缺货</span>
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl group/badge cursor-pointer"
      onMouseEnter={() => setShowNotify(true)}
      onMouseLeave={() => setShowNotify(false)}
    >
      <div className="text-center text-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/90 rounded-full mb-2">
          <AlertCircle size={18} className="text-orange-400" />
          <span className="font-semibold">暂时售罄</span>
        </div>
        
        {showNotify && onNotify && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNotify();
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-colors animate-fade-in"
          >
            <Bell size={14} />
            <span>到货提醒我</span>
          </button>
        )}
      </div>
    </div>
  );
}
