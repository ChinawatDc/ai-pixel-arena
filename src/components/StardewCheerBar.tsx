'use client';

import React, { useState, useEffect } from 'react';
import { Team } from '@/types/arena';
import { soundFx } from '@/lib/soundFx';
import { Lock, Unlock, KeyRound, Sparkles } from 'lucide-react';

interface StardewCheerBarProps {
  onCheer: (
    team: Team,
    item: 'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING',
    message: string,
    passcode?: string
  ) => Promise<{ success: boolean; error?: string } | void> | void;
  redName?: string;
  blueName?: string;
}

export function StardewCheerBar({
  onCheer,
  redName = 'Team Red',
  blueName = 'Team Blue',
}: StardewCheerBarProps) {
  const [targetTeam, setTargetTeam] = useState<Team>('RED');
  const [shoutText, setShoutText] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_buff_passcode');
      if (saved === '253600') {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '253600') {
      soundFx.playPowerup();
      setIsUnlocked(true);
      setPinError(null);
      setShowPinModal(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('arena_buff_passcode', '253600');
      }
    } else {
      soundFx.playExplosion();
      setPinError('❌ รหัสผ่านไม่ถูกต้อง (เฉพาะเจ้าของห้องเท่านั้น)');
    }
  };

  const handleLockAgain = () => {
    setIsUnlocked(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arena_buff_passcode');
    }
  };

  const snacks = [
    { type: 'HEART' as const, emoji: '🍓', name: 'Strawberry', effect: '+10 HP' },
    { type: 'ENERGY_DRINK' as const, emoji: '⭐', name: 'Starfruit', effect: '+25% Meter' },
    { type: 'LIGHTNING' as const, emoji: '☕', name: 'Espresso', effect: 'Hype' },
    { type: 'BANANA' as const, emoji: '🍌', name: 'Banana', effect: 'Slip Hazard' },
  ];

  const handleTossSnack = async (itemType: 'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING') => {
    if (!isUnlocked) {
      setShowPinModal(true);
      return;
    }
    soundFx.playPowerup();
    await onCheer(targetTeam, itemType, shoutText.trim() || 'Go for the win!', '253600');
    setShoutText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-3 sd-box p-3 rounded-lg text-[#3a2010]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#5c3a21] pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🎪</span>
          <span className="text-xs font-bold text-white text-shadow uppercase">
            Special Buff & Festival Cheer (โยนผลไม้ & บัพสด)
          </span>

          {/* VIP Status Badge */}
          {isUnlocked ? (
            <span className="bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-1 border border-amber-600">
              <Sparkles className="w-3 h-3 text-amber-800" />
              VIP BUFFS ACTIVE
            </span>
          ) : (
            <span className="bg-[#42220f] text-[#ffd7a8] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-[#8b5a2b]">
              <Lock className="w-3 h-3 text-amber-400" />
              VIP LOCKED
            </span>
          )}
        </div>

        {/* Team Selector & Lock Toggle */}
        <div className="flex items-center gap-1.5">
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

          {isUnlocked && (
            <button
              type="button"
              onClick={handleLockAgain}
              className="ml-2 text-[10px] bg-[#3a2010] text-[#ffea85] px-2 py-1 rounded border border-[#8b5a2b] hover:bg-[#5c3a21]"
              title="Lock VIP buffs"
            >
              Lock 🔒
            </button>
          )}
        </div>
      </div>

      {/* Main Body: If Locked vs If Unlocked */}
      {!isUnlocked ? (
        <div className="sd-parchment p-3 rounded border-2 border-[#bba36d] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5c3a21] flex items-center justify-center text-amber-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#633a18]">
                ระบบโยนบัพจำกัดสิทธิ์เฉพาะเจ้าของห้อง (VIP Passcode Protected)
              </div>
              <div className="text-[10px] text-[#8b5a2b]">
                ผู้ชมทั่วไปไม่สามารถแทรกแซงการต่อสู้ได้ หากคุณคือเจ้าของ กรุณากรอกรหัส PIN เพื่อปลดล็อก
              </div>
            </div>
          </div>

          <form onSubmit={handleUnlockSubmit} className="flex items-center gap-1.5 ml-auto">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(null);
                }}
                placeholder="กรอกรหัส PIN (6 หลัก)..."
                className="bg-white border-2 border-[#bba36d] rounded px-2.5 py-1 text-xs text-[#3a2010] font-mono font-bold tracking-widest w-40 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="sd-button-green px-3 py-1 rounded text-xs font-bold flex items-center gap-1 text-white hover:scale-105"
            >
              <KeyRound className="w-3.5 h-3.5" />
              ปลดล็อกบัพ
            </button>
          </form>
          {pinError && (
            <div className="w-full text-xs text-red-600 font-bold mt-1 text-right">{pinError}</div>
          )}
        </div>
      ) : (
        /* Unlocked: Tossable Snacks & Buffs */
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {snacks.map((snack) => (
              <button
                key={snack.type}
                type="button"
                onClick={() => handleTossSnack(snack.type)}
                className="sd-parchment px-2.5 py-1 rounded border border-[#bba36d] hover:bg-white text-xs font-bold flex items-center gap-1 hover:scale-105 transition-transform cursor-pointer shadow-xs"
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
              placeholder="พิมพ์คำเชียร์เจ้าของ..."
              className="w-full bg-white border-2 border-[#bba36d] rounded px-2.5 py-1 text-xs text-[#3a2010] font-bold focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

