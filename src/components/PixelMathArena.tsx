'use client';

import React, { useState } from 'react';
import { Participant, Room } from '@/types/arena';
import { PixelSpeechBubble } from './PixelSpeechBubble';

interface PixelMathArenaProps {
  room: Room;
  onManualAnswer?: (answer: number) => void;
  myParticipant?: Participant | null;
}

export function PixelMathArena({ room, onManualAnswer, myParticipant }: PixelMathArenaProps) {
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
    <div className="relative w-full max-w-4xl mx-auto bg-slate-900 border-4 border-emerald-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden select-none">
      {/* Header: Scoreboard */}
      <div className="bg-black/90 p-4 border-b-4 border-slate-700 flex justify-between items-center">
        {/* Red Team Score */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 border-2 border-black flex items-center justify-center font-mono font-bold text-white text-lg">
            🔴
          </div>
          <div>
            <div className="font-mono text-red-400 font-bold text-xs uppercase">
              TEAM RED ({redPlayers.length} AI)
            </div>
            <div className="font-mono text-yellow-400 text-xl font-black">
              {redScore} PTS
            </div>
          </div>
        </div>

        {/* Round Badge */}
        <div className="text-center">
          <div className="font-mono font-black text-sm text-yellow-400 bg-slate-950 px-3 py-1 border-2 border-yellow-500">
            ROUND {room.state.currentRound} / {room.state.maxRounds}
          </div>
          <div className="font-mono text-[10px] text-emerald-400 mt-1">
            SPEED MATH MATRIX
          </div>
        </div>

        {/* Blue Team Score */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 bg-blue-600 border-2 border-black flex items-center justify-center font-mono font-bold text-white text-lg">
            🔵
          </div>
          <div className="text-right">
            <div className="font-mono text-blue-400 font-bold text-xs uppercase">
              TEAM BLUE ({bluePlayers.length} AI)
            </div>
            <div className="font-mono text-yellow-400 text-xl font-black">
              {blueScore} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Main Blackboard Canvas */}
      <div className="relative h-80 bg-gradient-to-b from-emerald-950 via-slate-950 to-black p-6 flex flex-col items-center justify-center">
        {/* CRT Scanline & grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        {/* Current Question Blackboard Frame */}
        <div className="relative z-10 w-full max-w-xl bg-slate-950 border-4 border-emerald-400 p-6 shadow-[6px_6px_0px_#000] text-center">
          <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 uppercase tracking-widest border-b border-emerald-900 pb-2 mb-4">
            <span>DIFFICULTY: {currentQ?.difficulty || 'NORMAL'}</span>
            <span className="animate-pulse">⚡ SOLVE AS FAST AS POSSIBLE</span>
            <span>TIME: 15s</span>
          </div>

          {currentQ ? (
            <div className="my-2">
              <div className="text-3xl md:text-5xl font-mono font-black tracking-wider text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
                {currentQ.question} = ?
              </div>
              <p className="font-mono text-xs text-slate-400 mt-3">
                First Agent to post the correct value scores 100 PTS!
              </p>
            </div>
          ) : (
            <div className="py-6 font-mono text-slate-500 text-sm">
              {room.status === 'WAITING' ? 'Waiting for Host to start match...' : 'Match Finished!'}
            </div>
          )}
        </div>

        {/* Both Teams AI Avatars at desks */}
        <div className="relative z-10 w-full max-w-2xl mt-6 flex justify-between items-end px-4">
          {/* Red Team Desk */}
          <div className="flex flex-col items-center">
            {redPlayers[0]?.trashTalk && (
              <PixelSpeechBubble
                text={redPlayers[0].trashTalk}
                sender={redPlayers[0].name}
                side="left"
              />
            )}
            <div className="flex items-center gap-1">
              {redPlayers.map((p) => (
                <div key={p.id} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-red-600 border-2 border-black flex items-center justify-center text-xs">
                    🤖
                  </div>
                  <span className="font-mono text-[9px] text-red-300 truncate max-w-[80px]">
                    {p.name}
                  </span>
                </div>
              ))}
              {redPlayers.length === 0 && (
                <span className="font-mono text-xs text-slate-600">No Red AI</span>
              )}
            </div>
          </div>

          {/* Blue Team Desk */}
          <div className="flex flex-col items-center">
            {bluePlayers[0]?.trashTalk && (
              <PixelSpeechBubble
                text={bluePlayers[0].trashTalk}
                sender={bluePlayers[0].name}
                side="right"
              />
            )}
            <div className="flex items-center gap-1">
              {bluePlayers.map((p) => (
                <div key={p.id} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 border-2 border-black flex items-center justify-center text-xs">
                    🤖
                  </div>
                  <span className="font-mono text-[9px] text-blue-300 truncate max-w-[80px]">
                    {p.name}
                  </span>
                </div>
              ))}
              {bluePlayers.length === 0 && (
                <span className="font-mono text-xs text-slate-600">No Blue AI</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Testing Input (Allows user / spectator / host to test answering directly) */}
      {room.status === 'IN_PROGRESS' && onManualAnswer && (
        <form
          onSubmit={handleSubmit}
          className="bg-black/95 p-3 border-t-4 border-slate-700 flex items-center justify-center gap-3"
        >
          <span className="text-xs font-mono text-emerald-400">
            TEST ANSWER ({myParticipant ? myParticipant.name : 'Human Tester'}):
          </span>
          <input
            type="number"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Type answer..."
            className="w-32 bg-slate-900 border-2 border-emerald-600 px-3 py-1 font-mono text-sm text-white focus:outline-none focus:border-yellow-400"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs border-2 border-black active:translate-y-0.5 shadow-[2px_2px_0px_#000]"
          >
            SUBMIT (ENTER)
          </button>
        </form>
      )}
    </div>
  );
}
