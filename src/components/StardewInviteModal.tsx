'use client';

import React, { useState } from 'react';
import { Room } from '@/types/arena';
import { Copy, Check, X, Share2, Link as LinkIcon, Cpu } from 'lucide-react';

interface StardewInviteModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

export function StardewInviteModal({ room, isOpen, onClose }: StardewInviteModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ai-pixel-arena.vercel.app';
  const joinUrl = `${origin}/arena/${room.code}`;
  const botEndpoint = `${origin}/api/rooms/${room.code}/join`;

  const copyText = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md sd-box p-5 rounded-lg text-[#3a2010]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#3a2010] hover:text-black font-bold p-1 bg-[#d8c38e] border border-[#3a2010] rounded"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-white text-shadow flex items-center gap-2 mb-3">
          <Share2 className="w-5 h-5 text-amber-300" />
          Invite to Arena: {room.code}
        </h3>

        <div className="space-y-3">
          {/* Option 1: Spectator Only Link (For User / Viewers) */}
          <div className="sd-parchment p-3 rounded border-2 border-[#bba36d]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-[#633a18] flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
                👀 Link สำหรับคนดู (Spectator Mode - ดูสดอย่างเดียว):
              </span>
              <button
                onClick={() => copyText(`${joinUrl}?view=spectator`, true)}
                className="sd-button-green px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 text-white hover:scale-105"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                {copiedLink ? 'คัดลอกแล้ว!' : 'Copy Spectator Link'}
              </button>
            </div>
            <p className="text-[11px] text-[#78522c] mb-2">
              ส่งลิงก์นี้ให้ผู้ชมหรือเพื่อนเข้ามาดูการชกแบบเรียลไทม์ (มุมมองคนดู ไม่สามารถกดเริ่มหรือควบคุมห้องได้)
            </p>
            <input
              type="text"
              readOnly
              value={`${joinUrl}?view=spectator`}
              className="w-full bg-white border border-[#bba36d] rounded px-2.5 py-1 text-xs text-[#3a2010] select-all font-mono"
            />
          </div>

          {/* Option 2: 1-Line Bot Webhook (For automated AI agents) */}
          <div className="sd-parchment p-3 rounded border-2 border-[#bba36d]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-[#633a18] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-700" />
                AI Agent API Hook:
              </span>
              <button
                onClick={() => copyText(botEndpoint, false)}
                className="sd-button px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                {copiedCurl ? 'Copied!' : 'Copy API'}
              </button>
            </div>
            <p className="text-[11px] text-[#78522c] mb-2">
              External agents can join instantly by sending a POST request with their name and team.
            </p>
            <input
              type="text"
              readOnly
              value={botEndpoint}
              className="w-full bg-white border border-[#bba36d] rounded px-2.5 py-1 text-xs text-[#3a2010] select-all font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
