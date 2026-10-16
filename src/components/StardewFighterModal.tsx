'use client';

import React, { useState } from 'react';
import { Team } from '@/types/arena';
import { X, UserPlus, Sparkles } from 'lucide-react';

interface StardewFighterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFighter: (name: string, team: Team) => void;
  defaultTeam?: Team;
}

export function StardewFighterModal({
  isOpen,
  onClose,
  onAddFighter,
  defaultTeam = 'RED',
}: StardewFighterModalProps) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState<Team>(defaultTeam);

  if (!isOpen) return null;

  const presets = [
    { name: '🥊 Brawler Alex', team: 'RED', emoji: '🧑‍🌾' },
    { name: '🌾 Farmer Robin', team: 'BLUE', emoji: '👩‍🌾' },
    { name: '🧙 Rasmodius AI', team: 'RED', emoji: '🧙‍♂️' },
    { name: '⚡ Cyber Junimo', team: 'BLUE', emoji: '👾' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddFighter(name.trim(), team);
    setName('');
    onClose();
  };

  const handlePickPreset = (presetName: string, presetTeam: string) => {
    onAddFighter(presetName, presetTeam as Team);
    onClose();
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
          <UserPlus className="w-5 h-5 text-amber-300" />
          Add Fighter to Ring
        </h3>

        {/* Quick Pick Presets */}
        <div className="sd-parchment p-3 rounded mb-4 border-2 border-[#bba36d]">
          <span className="text-[11px] font-bold text-[#633a18] uppercase tracking-wider block mb-2">
            ⭐ Quick Add Preset AI Fighter:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handlePickPreset(p.name, p.team)}
                className="sd-button p-2 rounded text-left text-xs flex items-center gap-2 hover:scale-102"
              >
                <span className="text-lg">{p.emoji}</span>
                <div>
                  <div className="font-bold text-white text-[11px] truncate">{p.name}</div>
                  <div className="text-[9px] text-amber-200">Team {p.team}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Fighter Form */}
        <form onSubmit={handleSubmit} className="sd-parchment p-3 rounded border-2 border-[#bba36d] space-y-3">
          <span className="text-[11px] font-bold text-[#633a18] uppercase tracking-wider block">
            Or Create Custom Fighter:
          </span>

          <div>
            <label className="text-[11px] font-bold block mb-1">Fighter Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shadow Boxer, Claude AI"
              className="w-full bg-white border-2 border-[#bba36d] rounded px-3 py-1.5 text-xs font-bold text-[#3a2010] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold block mb-1">Choose Team:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTeam('RED')}
                className={`py-1.5 rounded text-xs font-bold border-2 ${
                  team === 'RED'
                    ? 'sd-button-red text-white'
                    : 'bg-[#f4ebd0] text-red-800 border-[#bba36d]'
                }`}
              >
                🔴 Team Red
              </button>
              <button
                type="button"
                onClick={() => setTeam('BLUE')}
                className={`py-1.5 rounded text-xs font-bold border-2 ${
                  team === 'BLUE'
                    ? 'sd-button-blue text-white'
                    : 'bg-[#f4ebd0] text-blue-800 border-[#bba36d]'
                }`}
              >
                🔵 Team Blue
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 sd-button-green rounded font-bold text-xs mt-2"
          >
            Enter Ring
          </button>
        </form>
      </div>
    </div>
  );
}
