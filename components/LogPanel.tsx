import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'combat': return 'text-[#ff5555]'; 
      case 'gain': return 'text-[#ffffff]'; 
      case 'danger': return 'text-[#ff0000] font-bold'; 
      case 'loot': return 'text-[#00c000]'; 
      case 'info': return 'text-[#55ff55]'; 
      case 'magic': return 'text-[#ffaa00]'; 
      default: return 'text-[#c0c0c0]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-[#555]">
      <div className="bg-[#222] px-2 py-1 border-b border-[#444] text-[11px] font-bold text-[#aaa] flex justify-between shrink-0 shadow-sm">
         <span>Server Log</span>
         <span className="cursor-pointer hover:text-white px-1">x</span>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-[12px] space-y-1 bg-black custom-scrollbar leading-snug"
      >
        {logs.map((log) => (
          <div key={log.id} className={`${getLogColor(log.type)} break-words`}>
            <span className="text-[#666] mr-2 select-none text-[10px]">
              {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })}
            </span>
            {log.message}
          </div>
        ))}
      </div>
      {/* Fake chat input */}
      <div className="bg-[#111] border-t border-[#444] p-1.5 flex shrink-0">
          <input disabled type="text" className="w-full bg-[#000] border border-[#333] text-gray-500 text-[11px] px-2 py-1" value="Chat disabled in Idle mode." />
      </div>
    </div>
  );
};