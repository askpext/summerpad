import { Plus, Trash2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// 1. ACCEPT THE 'theme' PROP
export default function Sidebar({ isOpen, onClose, pages, activePageId, onSelect, onCreate, onDelete, theme }) {
  
  // 2. CALCULATE COLORS based on the theme, with a fallback for safety
  const bgColor = theme?.bg || '#FFFFFF';
  const textColor = theme?.text || '#000000';
  
  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* THE DRAWER */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        
        // THE KEY CHANGES:
        // Removed: hardcoded 'bg-white/95' and 'border-gray-200'
        className="fixed top-0 bottom-0 left-0 w-68 z-50 flex flex-col shadow-2xl"
        
        // Added: Dynamic background color based on the theme.
        // I added '/F0' for slight transparency (94% opacity) for that premium glassy feel.
        style={{ 
          backgroundColor: `${bgColor}F0`, 
          borderRight: `1px solid ${textColor}15` // Subtle border using text color
        }} 
      >
        
        {/* HEADER */}
        <div className="p-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${textColor}15` }}>
          {/* Uses theme text color with lower opacity */}
          <span className="text-xs font-bold tracking-widest uppercase opacity-40" style={{ color: textColor }}>Notebook</span>
          <button 
            onClick={onCreate}
            className="p-2 rounded-full transition-colors"
            
            // Dynamic hover and active states using the theme text color
            style={{ color: textColor }} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${textColor}08`}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="New Page"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* PAGE LIST */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {pages.map((page) => {
            const isActive = page.id === activePageId;
            return (
              <div 
                key={page.id}
                onClick={() => { onSelect(page.id); onClose(); }}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm transition-all ${
                  isActive 
                    ? 'shadow-md' // Shadow for active item
                    : ''
                }`}
                
                // Dynamic colors for items based on theme and active state
                style={isActive ? {
                    backgroundColor: textColor, // Active item background is the theme's text color
                    color: bgColor // Active item text is the theme's paper color (Inverted!)
                  } : {
                    color: textColor // Inactive item uses theme text color
                  }}
                
                // Inactive items get a dynamic hover effect
                onMouseOver={(e) => !isActive && (e.currentTarget.style.backgroundColor = `${textColor}08`)}
                onMouseOut={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <FileText size={14} className={isActive ? 'opacity-100' : 'opacity-40'} />
                  <span className="truncate font-medium">
                    {page.title || 'Untitled'}
                  </span>
                </div>
                
                {/* Delete Button (Only shows on hover) */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
                  className={`p-1 rounded hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 ${
                    pages.length === 1 ? 'hidden' : ''
                  }`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
        
        {/* FOOTER */}
        <div className="p-4 text-[10px] text-center tracking-widest opacity-20" style={{ color: textColor }}>
          SUMMERPAD v1.0
        </div>
      </motion.div>
    </>
  );
}