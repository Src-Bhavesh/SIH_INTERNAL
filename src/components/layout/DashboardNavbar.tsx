'use client';

import React from 'react';
import { useAuthStore, useAlertStore } from '@/lib/store';
import { Bell, Wifi, WifiOff, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardNavbar() {
  const { user } = useAuthStore();
  const { unreadCount } = useAlertStore();
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-[#E8E2D5] bg-[#FAF7F2]/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left: Role indicator */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-[#375340] bg-[#EBF1EC] border-[#C5D7C8]">
            <ShieldCheck size={11} className="mr-1 text-[#587B64] inline" />
            {user.role} workspace
          </Badge>
        </div>

        {/* Right: Status indicators */}
        <div className="flex items-center gap-3">
          {/* Online/Offline indicator */}
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF1EC] border border-[#C5D7C8] text-[#375340]">
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#587B64] animate-pulse" />
                <span className="text-[11px] text-[#375340] font-bold">Live Sync</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#E26D85]" />
                <span className="text-[11px] text-[#9B2C46]">Offline</span>
              </>
            )}
          </div>

          {/* Alerts in Baby Pink */}
          <Button variant="ghost" size="icon" className="relative h-8 w-8 text-[#5E6660] hover:text-[#1C221E] hover:bg-[#EFEBE2] rounded-lg">
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-4 w-4 bg-[#E26D85] text-white rounded-full p-0 flex items-center justify-center text-[9px] font-extrabold shadow-2xs">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Institution badge */}
          <Badge variant="outline" className="text-[10px] font-bold text-[#1C221E] border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs">
            ABC Public School
          </Badge>
        </div>
      </div>
    </header>
  );
}
