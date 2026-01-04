import { useState, useEffect } from 'react';
// remove Menu import from here
import TitleBar from './components/TitleBar';
import FontCarousel from './components/FontCarousel';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';

function App() {
  const initializePages = () => {
    const savedPages = localStorage.getItem('summerpad-pages');
    if (savedPages) return JSON.parse(savedPages);

    const oldText = localStorage.getItem('summerpad-text');
    return [{
      id: Date.now(),
      title: 'My First Note',
      text: oldText || '',
      font: null,
      updatedAt: Date.now()
    }];
  };

  const [pages, setPages] = useState(initializePages);
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const updatePage = (updates) => {
    setPages(pages.map(p => p.id === activePageId ? { ...p, ...updates } : p));
  };

  const createPage = () => {
    const newPage = {
      id: Date.now(),
      title: 'Untitled',
      text: '',
      font: null, 
      updatedAt: Date.now()
    };
    setPages([newPage, ...pages]);
    setActivePageId(newPage.id);
    setSidebarOpen(false);
  };

  const deletePage = (id) => {
    if (pages.length === 1) return;
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    if (activePageId === id) setActivePageId(newPages[0].id);
  };

  useEffect(() => {
    localStorage.setItem('summerpad-pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    const handleMouseMove = () => setUiVisible(true);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate current colors
  const currentColors = activePage.font?.colors || { bg: '#faf9f6', text: '#111827' };

  return (
    <div 
      className="h-screen w-screen relative border-[1px] transition-colors duration-700 ease-in-out overflow-hidden"
      style={{ 
        backgroundColor: currentColors.bg, 
        borderColor: uiVisible ? 'rgba(150,150,150,0.3)' : currentColors.bg,
      }}
    >
      {/* TitleBar gets the menu handler and colors */}
      <TitleBar 
        visible={uiVisible} 
        color={currentColors.text} 
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      {/* SIDEBAR COMPONENT: We are passing the 'colors' prop here! */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        pages={pages}
        activePageId={activePageId}
        onSelect={setActivePageId}
        onCreate={createPage}
        onDelete={deletePage}
        
        // THE KEY CHANGE: Pass the current theme's colors down
        theme={currentColors} 
      />

      {/* Main Content (Crawler or Editor) */}
      {!activePage.font ? (
        <FontCarousel onSelect={(font) => updatePage({ font })} />
      ) : (
        <Editor 
          selectedFont={activePage.font} 
          title={activePage.title}
          text={activePage.text}
          setTitle={(title) => updatePage({ title })}
          setText={(text) => updatePage({ text })}
          onType={() => setUiVisible(false)} 
          visible={uiVisible}
        />
      )}
    </div>
  );
}

export default App;