'use client';

import React from 'react';
import { Room } from '@/types/arena';
import { Play, UserPlus, Share2, RotateCcw, Trophy, CheckCircle, Clock } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface StardewHostControlsProps {
  room: Room;
  onStart: () => void;
  onOpenAddFighter: () => void;
  onOpenInvite: () => void;
  onOpenTrophyModal: () => void;
  onReset: () => void;
}

export function StardewHostControls({
  room,
  onStart,
  onOpenAddFighter,
  onOpenInvite,
  onOpenTrophyModal,
  onReset,
}: StardewHostControlsProps) {
  const players = room.participants.filter((p) => p.role === 'PLAYER');
  const redPlayer = players.find((p) => p.team === 'RED');
  const bluePlayer = players.find((p) => p.team === 'BLUE');

  const bothReady = Boolean(redPlayer && bluePlayer);
  const canStart = bothReady && room.status === 'WAITING';

  return (
    <div className="w-full max-w-4xl mx-auto my-3 sd-box p-3.5 rounded-lg text-white">
      {/* Top Bar: Readiness status of both fighters */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#5c3a21] pb-2 mb-2.5 text-xs font-bold">
        <div className="flex items-center gap-3">
          <span className="text-[#fcd34d]">Fighter Readiness:</span>

          {/* Red Fighter Ready Badge */}
          <div className="flex items-center gap-1">
            <span className="text-red-400">🔴 {redPlayer ? redPlayer.name : 'Slot 1 Empty'}</span>
            {redPlayer ? (
              <span className="text-emerald-400 flex items-center text-[10px]">
                <CheckCircle className="w-3.5 h-3.5 ml-0.5 inline" /> READY
              </span>
            ) : (
              <span className="text-amber-400 flex items-center text-[10px]">
                <Clock className="w-3.5 h-3.5 ml-0.5 inline" /> WAITING
              </span>
            )}
          </div>

          <span className="text-[#8b5a2b]">vs</span>

          {/* Blue Fighter Ready Badge */}
          <div className="flex items-center gap-1">
            <span className="text-blue-400">🔵 {bluePlayer ? bluePlayer.name : 'Slot 2 Empty'}</span>
            {bluePlayer ? (
              <span className="text-emerald-400 flex items-center text-[10px]">
                <CheckCircle className="w-3.5 h-3.5 ml-0.5 inline" /> READY
              </span>
            ) : (
              <span className="text-amber-400 flex items-center text-[10px]">
                <Clock className="w-3.5 h-3.5 ml-0.5 inline" /> WAITING
              </span>
            )}
          </div>
        </div>

        {/* Match Format Badge */}
        <div className="text-[11px] text-[#fcd34d] bg-[#3a2010] px-2.5 py-0.5 rounded border border-[#8b5a2b]">
          Format: <b>{room.matchFormat ? room.matchFormat.replace(/_/g, ' ') : 'BEST OF 3'}</b>
        </div>
      </div>

      {/* Main Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Add Fighter Button */}
          {room.status === 'WAITING' && players.length < 2 && (
            <button
              onClick={onOpenAddFighter}
              className="sd-button px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 text-amber-200"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-300" />
              + Add Fighter
            </button>
          )}

          {/* Invite Link */}
          <button
            onClick={onOpenInvite}
            className="sd-button px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Link
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Big Start Button */}
          {room.status === 'WAITING' && (
            <button
              onClick={() => {
                soundFx.playVictory();
                onStart();
              }}
              disabled={!canStart}
              className={`px-6 py-2 rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                canStart
                  ? 'sd-button-green cursor-pointer animate-bounce hover:scale-105 shadow-lg'
                  : 'bg-[#5c3a21] text-[#9e642d] border-2 border-[#241206] cursor-not-allowed opacity-60'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {canStart ? 'START FIGHT!' : 'Waiting for Both Fighters...'}
            </button>
          )}

          {/* Trophy Certificate Download Button */}
          {room.status === 'FINISHED' && (
            <button
              onClick={onOpenTrophyModal}
              className="sd-button-green px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 animate-pulse shadow-lg"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              Claim Champion Trophy (PNG)
            </button>
          )}

          {/* Reset / Rematch Button */}
          {room.status === 'FINISHED' && (
            <button
              onClick={onReset}
              className="sd-button px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rematch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
