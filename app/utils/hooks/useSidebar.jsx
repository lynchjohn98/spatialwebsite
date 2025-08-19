import { useState, useEffect } from 'react';

export function useSidebar(defaultOpen = false) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultOpen);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen(prev => !prev)
  };
}