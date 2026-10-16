'use client';

import React, { useState } from 'react';
import { Team } from '@/types/arena';
import { soundFx } from '@/lib/soundFx';

interface StardewCheerBarProps {
  onCheer: (team: Team, item: 'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING', message: string) => void;
  redName?: string;
  blueName?: string;
}

export function StardewCheerBar({ onCheer, redName = 'Team Red', blueName = 'Team Blue' }: StardewCheerBarProps) {
  const [targetTeam, setTargetTeam] = useState<Team>('RED');
  const [shoutText, setShoutText] = useState('');

  const snacks = [
    { type: 'HEART' as const, emoji: '🍓', name: 'Strawberry', effect: '+10 HP' },
    { type: 'ENERGY_DRINK' as const, emoji: '⭐', name: 'Starfruit', effect: '+25% Meter' },
    { type: 'LIGHTNING' as const, emoji: '☕', name: 'Espresso', effect: 'Hype' },
    { type: 'BANANA' as const, emoji: '🍌', name: 'Banana', effect: 'Slip Hazard' },
  ];

  const handleTossSnack = (itemType: 'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING') => {
    soundFx.playPowerup();
    onCheer(targetTeam, itemType, shoutText.trim() || 'Go for the win!');
    setShoutText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-3 sd-box p-3 rounded-lg text-[#3a2010]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#5c3a21] pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🎪</span>
          <span className="text-xs font-bold text-white text-shadow uppercase">
            Spectator Festival Cheer (โยนผลไม้ & เชียร์สด)
          </span>
        </div>

        {/* Team Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-[#fcf6e2] mr-1">Cheer for:</span>
          <button
            type="button"
            onClick={() => setTargetTeam('RED')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              targetTeam === 'RED'
                ? 'sd-button-red text-white scale-105'
                : 'bg-[#5c3a21] text-[#ffd7a8] border border-[#241206]'
            }`}
          >
            🔴 {redName}
          </button>
          <button
            type="button"
            onClick={() => setTargetTeam('BLUE')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              targetTeam === 'BLUE'
                ? 'sd-button-blue text-white scale-105'
                : 'bg-[#5c3a21] text-[#ffd7a8] border border-[#241206]'
            }`}
          >
            🔵 {blueName}
          </button>
        </div>
      </div>

      {/* Tossable Snacks */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {snacks.map((snack) => (
            <button
              key={snack.type}
              type="button"
              onClick={() => handleTossSnack(snack.type)}
              className="sd-parchment px-2.5 py-1 rounded border border-[#bba36d] hover:bg-white text-xs font-bold flex items-center gap-1 hover:scale-105 transition-transform"
              title={snack.effect}
            >
              <span className="text-sm">{snack.emoji}</span>
              <span>{snack.name}</span>
              <span className="text-[10px] text-[#8b5a2b]">({snack.effect})</span>
            </button>
          ))}
        </div>

        {/* Shout input */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xs ml-auto">
          <input
            type="text"
            value={shoutText}
            onChange={(e) => setShoutText(e.target.value)}
            placeholder="Type cheer shout..."
            className="w-full bg-white border-2 border-[#bba36d] rounded px-2.5 py-1 text-xs text-[#3a2010] font-bold focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
