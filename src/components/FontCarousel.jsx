import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FONTS = [
  { 
    name: 'Playfair Display', 
    label: 'The Romantic', 
    css: 'font-serif',
    colors: { bg: '#F2EBE3', text: '#4A4A4A', accent: '#8C7B75' }
  },
  { 
    name: 'JetBrains Mono', 
    label: 'The Hacker', 
    css: 'font-mono',
    colors: { bg: '#09090b', text: '#E4E4E7', accent: '#22c55e' }
  },
  { 
    name: 'Abril Fatface', 
    label: 'The Statement', 
    css: "font-['Abril_Fatface']",
    colors: { bg: '#ffffff', text: '#000000', accent: '#FF0000' }
  },
  { 
    name: 'Caveat', 
    label: 'The Human', 
    css: "font-['Caveat']",
    colors: { bg: '#FEFCF5', text: '#2C3E50', accent: '#2980b9' }
  },
  { 
    name: 'Space Grotesk', 
    label: 'The Modern', 
    css: "font-['Space_Grotesk']",
    colors: { bg: '#FAFAFA', text: '#18181B', accent: '#52525B' }
  },
  
  // --- NEW MODES ---
  { 
    name: 'Courier Prime', 
    label: 'The Screenwriter', 
    css: "font-['Courier_Prime']",
    colors: { bg: '#e8e4d9', text: '#333333', accent: '#b03030' }
  },
  { 
    name: 'Shadows Into Light', 
    label: 'The Ghost', 
    css: "font-['Shadows_Into_Light']",
    colors: { bg: '#1a1a1a', text: '#d4d4d4', accent: '#737373' }
  },
  { 
    name: 'Righteous', 
    label: 'The Cyberpunk', 
    css: "font-['Righteous']",
    colors: { bg: '#11001c', text: '#ff2a6d', accent: '#05d9e8' },
    glow: true // <--- Trigger for Neon Effect
  },
];

export default function FontCarousel({ onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth * 0.6;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative group/container">
      
      <button 
        onClick={() => scroll('left')}
        className="absolute left-4 z-20 p-4 text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover/container:opacity-100 duration-500"
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-4 z-20 p-4 text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover/container:opacity-100 duration-500"
      >
        <ChevronRight size={32} />
      </button>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory w-full py-20 no-scrollbar px-[40vw] scroll-smooth"
      >
        {FONTS.map((font) => (
          <div 
            key={font.name}
            onClick={() => onSelect(font)}
            className="w-[60vw] flex-shrink-0 snap-center flex flex-col justify-center items-center cursor-pointer group"
          >
            <motion.h1 
              layoutId={`title-${font.name}`} 
              className={`text-7xl md:text-9xl ${font.css} transition-transform duration-500 group-hover:scale-110 text-center text-gray-800`}
              // Apply glow here too for the preview!
              style={font.glow ? { textShadow: `0 0 20px ${font.colors.text}` } : {}}
            >
              Love
            </motion.h1>
            <p className="mt-4 text-xs tracking-widest uppercase text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {font.label}
            </p>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => onSelect({ 
          name: 'Manrope', 
          css: 'font-sans', 
          colors: { bg: '#F5F5F5', text: '#171717', accent: '#737373' } 
        })}
        className="absolute bottom-8 text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 z-20"
      >
        I don't care
      </button>
    </div>
  );
}