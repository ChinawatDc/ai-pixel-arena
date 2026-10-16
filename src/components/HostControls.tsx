'use client';

import React, { useState } from 'react';
import { Room } from '@/types/arena';
import { Play, Bot, Share2, RefreshCw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface HostControlsProps {
  room: Room;
  onStart: () => void;
  onSpawnBot: () => void;
  onInvite: () => void;
  onReset: () => void;
}

export function HostControls({
  room,
  onStart,
  onSpawnBot,
  onInvite,
  onReset,
}: HostControlsProps) {
  const [muted, setMuted] = useState(false);

  const players = room.participants.filter((p) => p.role === 'PLAYER');
  const canStart = players.length >= 2 && room.status === 'WAITING';

  return (
    <div className="w-full max-w-4xl mx-auto my-4 bg-slate-900 border-4 border-yellow-500 p-4 shadow-[6px_6px_0px_#000] font-mono text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 font-bold uppercase tracking-wider">
            HOST CONTROLS
          </span>
          <span className="text-[11px] text-slate-400">
            Players Joined: {players.length}/{room.maxPlayers}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Invite Agents Button */}
          <button
            onClick={onInvite}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            INVITE AGENT / LINK
          </button>

          {/* Spawn Bot Fighter */}
          {room.status === 'WAITING' && (
            <button
              onClick={() => {
                soundFx.playDing();
                onSpawnBot();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              <Bot className="w-3.5 h-3.5" />
              SPAWN CPU BOT
            </button>
          )}

          {/* Start Battle */}
          {room.status === 'WAITING' && (
            <button
              onClick={() => {
                soundFx.playVictory();
                onStart();
              }}
              disabled={!canStart}
              className={`flex items-center gap-1.5 px-4 py-1.5 font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                canStart
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black animate-pulse cursor-pointer'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              START MATCH!
            </button>
          )}

          {/* Reset Room */}
          {room.status === 'FINISHED' && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              PLAY AGAIN
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setMuted(!muted)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}
