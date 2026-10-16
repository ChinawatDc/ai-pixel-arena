'use client';

import React, { useState } from 'react';
import { Team } from '@/types/arena';
import { Heart, Zap, Send } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface SpectatorCheerBarProps {
  onCheer: (team: Team, item: 'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING', message: string) => void;
  redName?: string;
  blueName?: string;
}

export function SpectatorCheerBar({ onCheer, redName = 'RED', blueName = 'BLUE' }: SpectatorCheerBarProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team>('RED');
  const [selectedItem, setSelectedItem] = useState<'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING'>('HEART');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('Fan_1');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPowerup();
    onCheer(selectedTeam, selectedItem, message || 'GO FIGHT WIN!');
    setMessage('');
  };

  const items = [
    { type: 'HEART' as const, label: '❤️ Heart (+10 HP)', desc: 'Heal your team' },
    { type: 'ENERGY_DRINK' as const, label: '⚡ Energy (+25% Super)', desc: 'Boost Super gauge' },
    { type: 'BANANA' as const, label: '🍌 Banana Trap', desc: 'Slippery hazard' },
    { type: 'LIGHTNING' as const, label: '✨ Spark Cheer', desc: 'Arcade hype' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 bg-slate-900 border-4 border-purple-500 p-4 shadow-[6px_6px_0px_#000] font-mono text-white">
      <div className="flex flex-wrap justify-between items-center border-b border-purple-900/60 pb-2 mb-3">
        <span className="text-xs text-purple-300 font-bold flex items-center gap-1.5 uppercase">
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          SPECTATOR CHEER ZONE (INTERACTIVE AIRDROP & TOSS)
        </span>
        <span className="text-[10px] text-slate-400">
          Cheer for your AI to boost their morale and drop buffs!
        </span>
      </div>

      <form onSubmit={handleSend} className="space-y-3">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Pick Team */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-300 mr-1">Cheer for:</span>
            <button
              type="button"
              onClick={() => setSelectedTeam('RED')}
              className={`px-3 py-1 text-xs font-bold border-2 border-black ${
                selectedTeam === 'RED'
                  ? 'bg-red-600 text-white shadow-[2px_2px_0px_#fff]'
                  : 'bg-red-950 text-red-300 hover:bg-red-900'
              }`}
            >
              🔴 {redName}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTeam('BLUE')}
              className={`px-3 py-1 text-xs font-bold border-2 border-black ${
                selectedTeam === 'BLUE'
                  ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#fff]'
                  : 'bg-blue-950 text-blue-300 hover:bg-blue-900'
              }`}
            >
              🔵 {blueName}
            </button>
          </div>

          {/* Pick Item */}
          <div className="flex flex-wrap items-center gap-1.5 ml-auto">
            {items.map((it) => (
              <button
                key={it.type}
                type="button"
                onClick={() => setSelectedItem(it.type)}
                className={`px-2 py-1 text-[11px] border border-black ${
                  selectedItem === it.type
                    ? 'bg-purple-600 text-white font-bold shadow-[2px_2px_0px_#facc15]'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
                title={it.desc}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input and Submit */}
        <div className="flex gap-2">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your Name"
            className="w-28 bg-black border border-slate-700 px-2.5 py-1.5 text-xs text-purple-300 focus:outline-none"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type live cheer shoutout... (e.g. KO them with your next uppercut!)"
            className="flex-1 bg-black border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5"
          >
            <Send className="w-3.5 h-3.5" />
            CHEER!
          </button>
        </div>
      </form>
    </div>
  );
}
