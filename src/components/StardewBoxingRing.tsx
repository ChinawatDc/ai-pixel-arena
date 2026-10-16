'use client';

import React, { useEffect, useState } from 'react';
import { Participant, Room } from '@/types/arena';

interface StardewBoxingRingProps {
  room: Room;
  onManualAction?: (action: 'JAB' | 'UPPERCUT' | 'GUARD' | 'DODGE' | 'SPECIAL') => void;
  myParticipant?: Participant | null;
}

export function StardewBoxingRing({ room, onManualAction, myParticipant }: StardewBoxingRingProps) {
  const redActive = room.participants.find((p) => p.role === 'PLAYER' && p.team === 'RED');
  const blueActive = room.participants.find((p) => p.role === 'PLAYER' && p.team === 'BLUE');

  const [impactEffect, setImpactEffect] = useState<{ text: string; x: number; y: number } | null>(null);

  // Trigger visual impact flash when damage or actions occur
  useEffect(() => {
    if (room.logs.length === 0) return;
    const latest = room.logs[0];
    if (latest.type === 'DAMAGE' || latest.type === 'ACTION') {
      const isUppercut = latest.text.includes('UPPERCUT');
      const text = isUppercut ? '💥 POW!' : '⭐ BAM!';
      setImpactEffect({ text, x: 50, y: 45 });
      const timer = setTimeout(() => setImpactEffect(null), 700);
      return () => clearTimeout(timer);
    }
  }, [room.logs]);

  // Calculate Hearts (5 Hearts total, 20 HP each)
  const renderHearts = (hp: number, maxHp: number) => {
    const totalHearts = 5;
    const heartValue = maxHp / totalHearts;
    const hearts = [];
    for (let i = 0; i < totalHearts; i++) {
      const fillThreshold = (i + 1) * heartValue;
      const isFull = hp >= fillThreshold;
      const isHalf = hp > fillThreshold - heartValue && hp < fillThreshold;
      hearts.push(
        <span key={i} className="inline-block text-lg transition-transform duration-200">
          {isFull ? '❤️' : isHalf ? '💔' : '🖤'}
        </span>
      );
    }
    return hearts;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto sd-box p-3 md:p-4 rounded-lg overflow-hidden">
      {/* Top HUD: Wooden Nameplates & Stardew Hearts */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* RED FIGHTER HUD */}
        <div className="sd-parchment p-2.5 rounded flex items-center justify-between border-2 border-[#bba36d]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-[#3a2010] flex items-center justify-center text-white font-bold text-xs shadow">
              🔴
            </div>
            <div>
              <div className="font-bold text-xs text-[#3a2010] flex items-center gap-1.5">
                {redActive ? redActive.name : 'Waiting for Fighter...'}
                {room.state.activeTeamTurn === 'RED' && room.status === 'IN_PROGRESS' && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full animate-bounce">
                    TURN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                {renderHearts(redActive?.hp ?? 0, redActive?.maxHp ?? 100)}
                <span className="text-[11px] font-bold text-[#633a18] ml-1.5">
                  {redActive?.hp ?? 0} HP
                </span>
              </div>
            </div>
          </div>
          {/* Super Meter Gauge */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] font-bold text-[#8b5a2b] uppercase tracking-wider">
              ⭐ Special Meter
            </span>
            <div className="w-20 h-2 bg-[#d8c38e] rounded-full border border-[#8b5a2b] overflow-hidden mt-0.5">
              <div
                className={`h-full transition-all duration-300 ${
                  (redActive?.superMeter || 0) >= 100
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${redActive?.superMeter || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* BLUE FIGHTER HUD */}
        <div className="sd-parchment p-2.5 rounded flex items-center justify-between border-2 border-[#bba36d] flex-row-reverse">
          <div className="flex items-center gap-2 flex-row-reverse text-right">
            <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-[#3a2010] flex items-center justify-center text-white font-bold text-xs shadow">
              🔵
            </div>
            <div>
              <div className="font-bold text-xs text-[#3a2010] flex items-center gap-1.5 justify-end">
                {room.state.activeTeamTurn === 'BLUE' && room.status === 'IN_PROGRESS' && (
                  <span className="bg-blue-500 text-white text-[9px] px-1.5 py-0.2 rounded-full animate-bounce">
                    TURN
                  </span>
                )}
                {blueActive ? blueActive.name : 'Waiting for Fighter...'}
              </div>
              <div className="flex items-center gap-0.5 mt-0.5 justify-end">
                <span className="text-[11px] font-bold text-[#633a18] mr-1.5">
                  {blueActive?.hp ?? 0} HP
                </span>
                {renderHearts(blueActive?.hp ?? 0, blueActive?.maxHp ?? 100)}
              </div>
            </div>
          </div>
          {/* Super Meter Gauge */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-[9px] font-bold text-[#8b5a2b] uppercase tracking-wider">
              Special Meter ⭐
            </span>
            <div className="w-20 h-2 bg-[#d8c38e] rounded-full border border-[#8b5a2b] overflow-hidden mt-0.5">
              <div
                className={`h-full transition-all duration-300 ${
                  (blueActive?.superMeter || 0) >= 100
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${blueActive?.superMeter || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Arena: Stardew Valley Festival Grass Ground */}
      <div className="relative h-80 rounded border-4 border-[#3a2010] bg-[#4a7c32] shadow-inner overflow-hidden flex items-center justify-between px-12 md:px-20">
        {/* Grass Texture & Little Daisies / Clover Patches */}
        <div className="absolute inset-0 bg-[radial-gradient(#3a6425_10%,transparent_11%)] bg-[size:16px_16px] pointer-events-none opacity-60" />

        {/* Cute Daisies scattered on grass */}
        <div className="absolute top-6 left-12 text-xs select-none">🌼</div>
        <div className="absolute top-20 left-28 text-xs select-none opacity-80">🌸</div>
        <div className="absolute bottom-8 left-16 text-xs select-none">🍀</div>
        <div className="absolute top-8 right-16 text-xs select-none">🌼</div>
        <div className="absolute bottom-12 right-24 text-xs select-none">🌸</div>

        {/* Wooden Fence Posts & Ropes (Stardew Style) */}
        <div className="absolute inset-x-6 top-16 border-b-4 border-[#8b5a2b] opacity-80 pointer-events-none" />
        <div className="absolute inset-x-6 top-32 border-b-4 border-[#b87d4b] opacity-70 pointer-events-none" />
        <div className="absolute inset-x-6 bottom-16 border-b-4 border-[#8b5a2b] opacity-80 pointer-events-none" />

        {/* Fence Corner Posts with Festival Torches */}
        <div className="absolute left-6 top-12 bottom-12 w-4 bg-[#5c3a21] border-2 border-[#241206] rounded-sm flex flex-col items-center">
          <div className="w-6 h-6 -mt-3 text-base animate-pulse">🏮</div>
        </div>
        <div className="absolute right-6 top-12 bottom-12 w-4 bg-[#5c3a21] border-2 border-[#241206] rounded-sm flex flex-col items-center">
          <div className="w-6 h-6 -mt-3 text-base animate-pulse">🏮</div>
        </div>

        {/* Center Ring Wooden Emblem */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#6ca848]/60 flex items-center justify-center">
            <span className="text-3xl opacity-40">🥊</span>
          </div>
        </div>

        {/* Impact Visual Pop (POW! / BAM!) */}
        {impactEffect && (
          <div
            className="absolute z-40 font-black text-2xl md:text-3xl text-amber-300 drop-shadow-[0_2px_4px_#3a2010] animate-impact pointer-events-none"
            style={{ left: `${impactEffect.x}%`, top: `${impactEffect.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {impactEffect.text}
          </div>
        )}

        {/* LEFT FIGHTER: RED SPRITE (STARDEW COZY STYLE) */}
        <div className="relative z-20 flex flex-col items-center">
          {redActive?.trashTalk && (
            <div className="absolute -top-16 left-0 z-30 bg-[#fcf6e2] text-[#3a2010] px-3 py-1.5 rounded border-2 border-[#3a2010] shadow-[2px_2px_0px_#241206] text-xs font-bold whitespace-nowrap animate-bounce">
              &ldquo;{redActive.trashTalk}&rdquo;
              <div className="absolute -bottom-1.5 left-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#3a2010]" />
            </div>
          )}

          {redActive ? (
            <div
              className={`relative flex flex-col items-center transition-all ${
                redActive.status === 'ATTACKING'
                  ? 'animate-punch-left'
                  : redActive.status === 'HURT'
                  ? 'animate-hurt'
                  : redActive.status === 'KO'
                  ? 'rotate-90 translate-y-8 opacity-80'
                  : 'animate-idle'
              }`}
            >
              {/* Dizzy stars on KO */}
              {redActive.status === 'KO' && (
                <div className="absolute -top-8 text-xl animate-dizzy">💫 💫 💫</div>
              )}

              {/* Stardew Pixel Farmer Boxer (Red) */}
              <div className="relative w-20 h-28 flex flex-col items-center">
                {/* Farmer Hair / Hat */}
                <div className="w-12 h-6 bg-[#d97706] rounded-t-md border-2 border-[#3a2010] relative">
                  {/* Red Headband */}
                  <div className="absolute bottom-0 inset-x-0 h-2 bg-red-600" />
                </div>
                {/* Face */}
                <div className="w-10 h-7 bg-[#ffd7a8] border-x-2 border-b-2 border-[#3a2010] relative flex items-center justify-around px-1.5">
                  {/* Eyes */}
                  <div className="w-1.5 h-2 bg-[#3a2010] rounded-xs" />
                  <div className="w-1.5 h-2 bg-[#3a2010] rounded-xs" />
                  {/* Blush */}
                  <div className="absolute bottom-1 left-1 w-1.5 h-1 bg-red-400 rounded-full opacity-60" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1 bg-red-400 rounded-full opacity-60" />
                </div>
                {/* Torso: Red Shirt / Overalls */}
                <div className="w-12 h-9 bg-red-600 border-2 border-[#3a2010] relative flex justify-center">
                  <div className="w-2 h-full bg-[#991b1b] opacity-40" />
                  {/* Left Glove (Animated) */}
                  <div
                    className={`absolute -left-3 top-1 w-6 h-6 rounded-full bg-red-500 border-2 border-[#3a2010] shadow ${
                      redActive.status === 'ATTACKING' ? 'translate-x-6 scale-125' : ''
                    }`}
                  />
                  {/* Right Glove */}
                  <div
                    className={`absolute -right-3 top-1 w-6 h-6 rounded-full bg-red-500 border-2 border-[#3a2010] shadow ${
                      redActive.status === 'BLOCKING' ? '-translate-x-3' : ''
                    }`}
                  />
                </div>
                {/* Blue Dungarees / Pants */}
                <div className="w-10 h-5 bg-[#1e3a8a] border-x-2 border-b-2 border-[#3a2010] flex">
                  <div className="w-1/2 border-r border-[#3a2010]" />
                </div>
                {/* Boots */}
                <div className="w-12 flex justify-between px-1">
                  <div className="w-4 h-2.5 bg-[#5c3a21] border border-[#241206] rounded-xs" />
                  <div className="w-4 h-2.5 bg-[#5c3a21] border border-[#241206] rounded-xs" />
                </div>
              </div>

              {/* Soft Drop Shadow under feet */}
              <div className="w-14 h-3 bg-[#244214] rounded-full opacity-70 -mt-1" />

              <span className="sd-parchment text-[11px] font-bold px-2 py-0.5 rounded mt-2 border border-[#bba36d] text-[#3a2010]">
                {redActive.name}
              </span>
            </div>
          ) : (
            <div className="w-20 h-28 border-2 border-dashed border-[#bba36d] rounded flex flex-col items-center justify-center text-xs text-[#fcf6e2] font-bold">
              <span>EMPTY</span>
              <span className="text-[9px] opacity-70">Slot Open</span>
            </div>
          )}
        </div>

        {/* Center Round Banner */}
        <div className="z-10 flex flex-col items-center">
          <div className="sd-box px-3.5 py-1.5 rounded text-center">
            <div className="text-[10px] text-[#fcd34d] font-bold uppercase tracking-wider">
              {room.status === 'WAITING'
                ? 'WAITING ROOM'
                : room.status === 'FINISHED'
                ? 'MATCH OVER'
                : `ROUND ${room.state.currentRound}`}
            </div>
            <div className="text-xl font-black text-white drop-shadow">
              VS
            </div>
          </div>
        </div>

        {/* RIGHT FIGHTER: BLUE SPRITE (STARDEW COZY STYLE) */}
        <div className="relative z-20 flex flex-col items-center">
          {blueActive?.trashTalk && (
            <div className="absolute -top-16 right-0 z-30 bg-[#fcf6e2] text-[#3a2010] px-3 py-1.5 rounded border-2 border-[#3a2010] shadow-[2px_2px_0px_#241206] text-xs font-bold whitespace-nowrap animate-bounce">
              &ldquo;{blueActive.trashTalk}&rdquo;
              <div className="absolute -bottom-1.5 right-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#3a2010]" />
            </div>
          )}

          {blueActive ? (
            <div
              className={`relative flex flex-col items-center transition-all ${
                blueActive.status === 'ATTACKING'
                  ? 'animate-punch-right'
                  : blueActive.status === 'HURT'
                  ? 'animate-hurt'
                  : blueActive.status === 'KO'
                  ? '-rotate-90 translate-y-8 opacity-80'
                  : 'animate-idle'
              }`}
            >
              {/* Dizzy stars on KO */}
              {blueActive.status === 'KO' && (
                <div className="absolute -top-8 text-xl animate-dizzy">💫 💫 💫</div>
              )}

              {/* Stardew Pixel Farmer Boxer (Blue) */}
              <div className="relative w-20 h-28 flex flex-col items-center">
                {/* Farmer Hair / Hat */}
                <div className="w-12 h-6 bg-[#475569] rounded-t-md border-2 border-[#3a2010] relative">
                  {/* Blue Headband */}
                  <div className="absolute bottom-0 inset-x-0 h-2 bg-blue-600" />
                </div>
                {/* Face */}
                <div className="w-10 h-7 bg-[#ffd7a8] border-x-2 border-b-2 border-[#3a2010] relative flex items-center justify-around px-1.5">
                  {/* Eyes */}
                  <div className="w-1.5 h-2 bg-[#3a2010] rounded-xs" />
                  <div className="w-1.5 h-2 bg-[#3a2010] rounded-xs" />
                  {/* Blush */}
                  <div className="absolute bottom-1 left-1 w-1.5 h-1 bg-red-400 rounded-full opacity-60" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1 bg-red-400 rounded-full opacity-60" />
                </div>
                {/* Torso: Blue Shirt / Overalls */}
                <div className="w-12 h-9 bg-blue-600 border-2 border-[#3a2010] relative flex justify-center">
                  <div className="w-2 h-full bg-[#1e3a8a] opacity-40" />
                  {/* Left Glove */}
                  <div
                    className={`absolute -left-3 top-1 w-6 h-6 rounded-full bg-blue-500 border-2 border-[#3a2010] shadow ${
                      blueActive.status === 'BLOCKING' ? 'translate-x-3' : ''
                    }`}
                  />
                  {/* Right Glove (Animated) */}
                  <div
                    className={`absolute -right-3 top-1 w-6 h-6 rounded-full bg-blue-500 border-2 border-[#3a2010] shadow ${
                      blueActive.status === 'ATTACKING' ? '-translate-x-6 scale-125' : ''
                    }`}
                  />
                </div>
                {/* Brown Pants */}
                <div className="w-10 h-5 bg-[#5c3a21] border-x-2 border-b-2 border-[#3a2010] flex">
                  <div className="w-1/2 border-r border-[#3a2010]" />
                </div>
                {/* Boots */}
                <div className="w-12 flex justify-between px-1">
                  <div className="w-4 h-2.5 bg-[#241206] border border-[#000] rounded-xs" />
                  <div className="w-4 h-2.5 bg-[#241206] border border-[#000] rounded-xs" />
                </div>
              </div>

              {/* Soft Drop Shadow under feet */}
              <div className="w-14 h-3 bg-[#244214] rounded-full opacity-70 -mt-1" />

              <span className="sd-parchment text-[11px] font-bold px-2 py-0.5 rounded mt-2 border border-[#bba36d] text-[#3a2010]">
                {blueActive.name}
              </span>
            </div>
          ) : (
            <div className="w-20 h-28 border-2 border-dashed border-[#bba36d] rounded flex flex-col items-center justify-center text-xs text-[#fcf6e2] font-bold">
              <span>EMPTY</span>
              <span className="text-[9px] opacity-70">Slot Open</span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Attack Controls (Only shown during active match for testing/playing) */}
      {room.status === 'IN_PROGRESS' && onManualAction && (
        <div className="mt-3 sd-parchment p-2.5 rounded flex flex-wrap items-center justify-center gap-2 border-2 border-[#bba36d]">
          <span className="text-xs font-bold text-[#633a18] mr-2">
            Action:
          </span>
          <button
            onClick={() => onManualAction('JAB')}
            className="sd-button-red px-3 py-1 rounded text-xs font-bold"
          >
            🥊 Swift Jab
          </button>
          <button
            onClick={() => onManualAction('UPPERCUT')}
            className="sd-button-red px-3 py-1 rounded text-xs font-bold"
          >
            💥 Heavy Uppercut
          </button>
          <button
            onClick={() => onManualAction('GUARD')}
            className="sd-button-blue px-3 py-1 rounded text-xs font-bold"
          >
            🛡️ Guard
          </button>
          <button
            onClick={() => onManualAction('DODGE')}
            className="sd-button-green px-3 py-1 rounded text-xs font-bold"
          >
            ⚡ Dodge
          </button>
          <button
            onClick={() => onManualAction('SPECIAL')}
            className="sd-button px-3 py-1 rounded text-xs font-bold text-amber-200 animate-pulse"
          >
            🔥 Special Attack
          </button>
        </div>
      )}
    </div>
  );
}
