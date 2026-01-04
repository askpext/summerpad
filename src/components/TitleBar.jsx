import { getCurrentWindow } from '@tauri-apps/api/window';
import { X, Minus, Menu } from 'lucide-react';

export default function TitleBar({ visible, color, onMenuClick }) {
  const appWindow = getCurrentWindow();

  return (
    <div 
      className={`fixed top-0 left-0 right-0 h-10 z-50 flex items-center px-4 select-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* LEFT: Menu Button (Clickable, NOT draggable) */}
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-md hover:bg-black/5 transition-colors active:scale-95"
        style={{ color: color }}
      >
        <Menu size={20} />
      </button>

      {/* CENTER: Draggable Area (This is the ONLY part that drags the window) */}
      <div 
        data-tauri-drag-region 
        className="flex-1 h-full"
      />

      {/* RIGHT: Window Controls (Clickable, NOT draggable) */}
      <div className="flex space-x-1">
        <button 
          onClick={() => appWindow.minimize()} 
          className="p-2 rounded-md hover:bg-black/5 transition-colors active:scale-95 opacity-60 hover:opacity-100"
          style={{ color: color }}
        >
          <Minus size={20} />
        </button>
        <button 
          onClick={() => appWindow.close()} 
          className="p-2 rounded-md hover:bg-red-500 hover:text-white transition-all active:scale-95 opacity-60 hover:opacity-100"
          style={{ color: color }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}