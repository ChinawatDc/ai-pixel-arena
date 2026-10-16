'use client';

import React, { useState } from 'react';
import { Participant, Room } from '@/types/arena';

interface StardewMathArenaProps {
  room: Room;
  onManualAnswer?: (answer: number) => void;
  myParticipant?: Participant | null;
  isSpectator?: boolean;
}

export function StardewMathArena({
  room,
  onManualAnswer,
  myParticipant,
  isSpectator = false,
}: StardewMathArenaProps) {
  const [manualInput, setManualInput] = useState('');

  const redPlayers = room.participants.filter(
    (p) => p.role === 'PLAYER' && p.team === 'RED'
  );
  const bluePlayers = room.participants.filter(
    (p) => p.role === 'PLAYER' && p.team === 'BLUE'
  );

  const redScore = redPlayers.reduce((s, p) => s + p.score, 0);
  const blueScore = bluePlayers.reduce((s, p) => s + p.score, 0);

  const currentQ = room.state.currentMathQuestion;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim() || !onManualAnswer) return;
    const num = Number(manualInput);
    if (!isNaN(num)) {
      onManualAnswer(num);
      setManualInput('');
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto sd-box p-3 md:p-4 rounded-lg overflow-hidden">
      {/* Top Score Bar: Wooden HUD */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* RED TEAM SCORE */}
        <div className="sd-parchment p-2.5 rounded flex items-center justify-between border-2 border-[#bba36d]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍎</span>
            <div>
              <div className="font-bold text-xs text-red-700 uppercase">
                Team Red ({redPlayers.length} AI)
              </div>
              <div className="text-lg font-black text-[#3a2010]">
                {redScore} Points
              </div>
            </div>
          </div>
        </div>

        {/* BLUE TEAM SCORE */}
        <div className="sd-parchment p-2.5 rounded flex items-center justify-between border-2 border-[#bba36d] flex-row-reverse text-right">
          <div className="flex items-center gap-2 flex-row-reverse">
            <span className="text-xl">🫐</span>
            <div>
              <div className="font-bold text-xs text-blue-700 uppercase">
                Team Blue ({bluePlayers.length} AI)
              </div>
              <div className="text-lg font-black text-[#3a2010]">
                {blueScore} Points
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cozy Chalkboard Arena */}
      <div className="relative h-72 rounded border-4 border-[#3a2010] bg-[#223322] shadow-inner p-6 flex flex-col items-center justify-center text-center">
        {/* Subtle blackboard texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#2d442d_15%,transparent_16%)] bg-[size:12px_12px] opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#192619] border-2 border-[#415e41] p-6 rounded shadow-lg">
          <span className="text-[11px] text-[#a3d9a5] font-bold uppercase tracking-widest block mb-2">
            ROUND {room.state.currentRound} of {room.state.maxRounds} • SPEED MATH PUZZLE
          </span>

          {currentQ ? (
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#ffea85] tracking-widest drop-shadow">
                {currentQ.question} = ?
              </div>
              <p className="text-xs text-[#a3d9a5] mt-2">
                Fastest AI or Player to solve wins 100 points!
              </p>
            </div>
          ) : (
            <div className="text-sm text-[#a3d9a5] py-4">
              Waiting for match to begin...
            </div>
          )}
        </div>

        {/* Contestants at desks */}
        <div className="relative z-10 w-full max-w-lg mt-4 flex justify-between items-center px-6">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🧑‍🌾</span>
            <span className="text-xs font-bold text-[#fcf6e2]">
              {redPlayers[0]?.name || 'Red Seat'}
            </span>
          </div>

          <div className="text-xs font-bold text-amber-300">
            VS
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#fcf6e2]">
              {bluePlayers[0]?.name || 'Blue Seat'}
            </span>
            <span className="text-lg">🧑‍🌾</span>
          </div>
        </div>
      </div>

      {/* Manual Input for testing / playing directly (Hidden for spectators) */}
      {room.status === 'IN_PROGRESS' && onManualAnswer && !isSpectator && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 sd-parchment p-2.5 rounded flex items-center justify-center gap-2 border-2 border-[#bba36d]"
        >
          <span className="text-xs font-bold text-[#3a2010]">
            Enter Answer:
          </span>
          <input
            type="number"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Type number..."
            className="w-32 bg-white border-2 border-[#bba36d] rounded px-2.5 py-1 text-xs text-[#3a2010] font-bold focus:outline-none"
          />
          <button
            type="submit"
            className="sd-button-green px-3 py-1 rounded text-xs font-bold"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
