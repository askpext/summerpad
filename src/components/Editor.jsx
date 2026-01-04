import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function Editor({
  selectedFont,
  title,
  setTitle,
  text,
  setText,
  onType,
  visible
}) {
  const editorRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const textColor = selectedFont?.colors?.text || '#000000'

  // NEW: Calculate Glow Style
  const glowStyle = selectedFont?.glow 
    ? { textShadow: `0 0 10px ${selectedFont.colors.text}, 0 0 20px ${selectedFont.colors.text}` } 
    : {};

  const handleExport = () => {
    if (!editorRef.current) return

    setIsExporting(true)

    // Force layout sync
    editorRef.current.getBoundingClientRect()

    // Tauri needs double frame to settle DOM swap
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        const canvas = await html2canvas(editorRef.current, {
          backgroundColor: selectedFont.colors.bg,
          scale: 3,
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: 0
        })

        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ])
            setShowToast(true)
            setTimeout(() => setShowToast(false), 2500)
          }
          setIsExporting(false)
        }, 'image/png')
      })
    })
  }

  return (
    <motion.div
      ref={editorRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full px-16 pb-8 relative ${selectedFont.css}`}
      style={{ color: textColor }}
    >
      {/* CONTENT */}
      <div className="pt-10 flex flex-col flex-1">
        
        {/* TITLE INPUT (Editable) */}
        {!isExporting && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={onType}
            autoFocus
            placeholder="Untitled"
            className="
              w-full
              bg-transparent
              outline-none
              font-bold
              text-5xl md:text-6xl
              leading-[1.3]
              py-6
              mb-4
              placeholder:opacity-20
            "
            // Applied Glow Here
            style={{ color: textColor, ...glowStyle }}
          />
        )}

        {/* TITLE EXPORT (Static Div for Screenshot) */}
        {isExporting && (
          <div
            className="
              w-full
              font-bold
              text-5xl md:text-6xl
              leading-[1.3]
              py-6
              mb-4
              whitespace-pre-wrap
            "
            // Applied Glow Here
            style={{ color: textColor, ...glowStyle }}
          >
            {title || ' '}
          </div>
        )}

        {/* BODY TEXTAREA (Editable) */}
        {!isExporting && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onType}
            placeholder="Start writing..."
            className="
              flex-1
              w-full
              bg-transparent
              outline-none
              resize-none
              text-xl
              leading-relaxed
              placeholder:opacity-20
              caret-current
              no-scrollbar
            "
            spellCheck="false"
            // Applied Glow Here
            style={{ color: textColor, ...glowStyle }}
          />
        )}

        {/* BODY EXPORT (Static Div for Screenshot) */}
        {isExporting && (
          <div
            className="
              flex-1
              w-full
              text-xl
              leading-relaxed
              whitespace-pre-wrap
            "
            // Applied Glow Here
            style={{ color: textColor, ...glowStyle }}
          >
            {text || ' '}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        className={`absolute bottom-4 left-0 right-0 text-center text-[10px] tracking-[0.2em] transition-opacity ${
          isExporting ? 'opacity-50' : 'opacity-0'
        }`}
      >
        pext.org/summerpad
      </div>

      {/* EXPORT BUTTON */}
      <button
        onClick={handleExport}
        className={`absolute bottom-8 right-8 p-3 rounded-full hover:bg-black/5 transition-all duration-500 ${
          visible ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        title="Copy Image to Clipboard"
      >
        <Camera size={20} />
      </button>

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
            style={{
              backgroundColor: textColor,
              color: selectedFont.colors.bg
            }}
          >
            <Check size={14} />
            <span className="text-xs font-bold tracking-wider uppercase">
              Copied to Clipboard
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}