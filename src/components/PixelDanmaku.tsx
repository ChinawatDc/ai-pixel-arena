'use client';

import React, { useEffect, useState } from 'react';
import { GameLog } from '@/types/arena';

interface DanmakuItem {
  id: string;
  text: string;
  top: number; // percentage
  color: string;
}

export function PixelDanmaku({ logs }: { logs: GameLog[] }) {
  const [danmakuList, setDanmakuList] = useState<DanmakuItem[]>([]);

  useEffect(() => {
    if (logs.length === 0) return;
    const latest = logs[0];
    if (latest.type === 'CHEER' || latest.type === 'AIRDROP' || latest.type === 'KO') {
      const newItem: DanmakuItem = {
        id: `${latest.id}_${Date.now()}`,
        text: latest.text,
        top: 15 + Math.floor(Math.random() * 55),
        color:
          latest.type === 'KO'
            ? 'text-yellow-400 font-bold text-lg'
            : latest.team === 'RED'
            ? 'text-red-400'
            : latest.team === 'BLUE'
            ? 'text-blue-400'
            : 'text-green-400',
      };

      setDanmakuList((prev) => [...prev.slice(-6), newItem]);

      const timer = setTimeout(() => {
        setDanmakuList((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [logs]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {danmakuList.map((item) => (
        <div
          key={item.id}
          style={{ top: `${item.top}%` }}
          className={`absolute whitespace-nowrap animate-marquee font-mono text-xs px-2 py-1 bg-black/60 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] ${item.color}`}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
