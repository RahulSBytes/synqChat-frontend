// components/layout/ResponsiveAppLayout.jsx
import { useState, useEffect } from 'react';
import AppLayout from './AppLayout.jsx';  // Your desktop layout
import MobileAppLayout from './MobileAppLayout.jsx';  // The new mobile layout

export default function ResponsiveAppLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile ? <MobileAppLayout /> : <AppLayout />
}