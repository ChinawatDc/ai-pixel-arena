'use client';

import React from 'react';

interface PixelSpeechBubbleProps {
  text: string;
  sender: string;
  side: 'left' | 'right';
}

export function PixelSpeechBubble({ text, sender, side }: PixelSpeechBubbleProps) {
  if (!text) return null;

  return (
    <div
      className={`absolute -top-16 z-20 max-w-[220px] transition-all duration-300 animate-bounce ${
        side === 'left' ? 'left-4' : 'right-4'
      }`}
    >
      <div className="relative bg-white text-black p-2.5 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[11px] font-mono leading-tight">
        <span className="font-bold text-red-600 block mb-0.5 uppercase tracking-wider text-[9px]">
          💬 {sender}:
        </span>
        &ldquo;{text}&rdquo;
        {/* Pixel tail pointer */}
        <div
          className={`absolute -bottom-2.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black ${
            side === 'left' ? 'left-6' : 'right-6'
          }`}
        />
      </div>
    </div>
  );
}
