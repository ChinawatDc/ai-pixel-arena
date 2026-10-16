'use client';

import React from 'react';
import { Participant, Room } from '@/types/arena';
import { PixelSpeechBubble } from './PixelSpeechBubble';

interface PixelBoxingRingProps {
  room: Room;
  onManualAction?: (action: 'JAB' | 'UPPERCUT' | 'GUARD' | 'DODGE' | 'SPECIAL') => void;
  myParticipant?: Participant | null;
}

export function PixelBoxingRing({ room, onManualAction, myParticipant }: PixelBoxingRingProps) {
  const redFighters = room.participants.filter(
    (p) => p.role === 'PLAYER' && p.team === 'RED'
  );
  const blueFighters = room.participants.filter(
    (p) => p.role === 'PLAYER' && p.team === 'BLUE'
  );

  const redActive = redFighters[0];
  const blueActive = blueFighters[0];

  const weather = room.state.weatherHazard;
  const airdrop = room.state.activeAirdrop;

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-slate-900 border-4 border-yellow-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden select-none">
      {/* Weather Hazard Overlay */}
      {weather === 'CYBER_THUNDER' && (
        <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none z-10 animate-pulse border-2 border-yellow-300" />
      )}
      {weather === 'MATRIX_GLITCH' && (
        <div className="absolute inset-0 bg-green-500/10 pointer-events-none z-10 mix-blend-overlay border-2 border-green-400" />
      )}

      {/* Arena Header: Health Bars & Super Meters */}
      <div className="bg-black/90 p-4 border-b-4 border-slate-700 grid grid-cols-2 gap-6 items-center">
        {/* RED TEAM HEALTH BAR */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-red-400 font-mono font-bold text-xs flex items-center gap-1">
              🔴 {redActive ? redActive.name : 'WAITING FIGHTER...'}
              {room.state.activeTeamTurn === 'RED' && room.status === 'IN_PROGRESS' && (
                <span className="bg-red-600 text-white text-[9px] px-1 py-0.5 animate-pulse">TURN</span>
              )}
            </span>
            <span className="text-white font-mono text-xs">
              {redActive ? `${redActive.hp}/${redActive.maxHp} HP` : '0 HP'}
            </span>
          </div>
          {/* Health Bar */}
          <div className="w-full h-5 bg-slate-800 border-2 border-black p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{
                width: `${redActive ? (redActive.hp / redActive.maxHp) * 100 : 0}%`,
              }}
            />
          </div>
          {/* Super Meter */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-yellow-400 font-mono">SUPER:</span>
            <div className="flex-1 h-2 bg-slate-800 border border-black">
              <div
                className={`h-full transition-all duration-200 ${
                  (redActive?.superMeter || 0) >= 100
                    ? 'bg-yellow-300 animate-pulse shadow-[0_0_8px_#facc15]'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${redActive?.superMeter || 0}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-yellow-400">
              {redActive?.superMeter || 0}%
            </span>
          </div>
        </div>

        {/* BLUE TEAM HEALTH BAR */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-white font-mono text-xs">
              {blueActive ? `${blueActive.hp}/${blueActive.maxHp} HP` : '0 HP'}
            </span>
            <span className="text-blue-400 font-mono font-bold text-xs flex items-center gap-1">
              {room.state.activeTeamTurn === 'BLUE' && room.status === 'IN_PROGRESS' && (
                <span className="bg-blue-600 text-white text-[9px] px-1 py-0.5 animate-pulse">TURN</span>
              )}
              {blueActive ? blueActive.name : 'WAITING FIGHTER...'} 🔵
            </span>
          </div>
          {/* Health Bar */}
          <div className="w-full h-5 bg-slate-800 border-2 border-black p-0.5">
            <div
              className="h-full bg-gradient-to-l from-blue-600 to-blue-400 transition-all duration-300 ml-auto"
              style={{
                width: `${blueActive ? (blueActive.hp / blueActive.maxHp) * 100 : 0}%`,
              }}
            />
          </div>
          {/* Super Meter */}
          <div className="mt-1 flex items-center gap-2 justify-end">
            <span className="text-[9px] font-mono text-cyan-400">
              {blueActive?.superMeter || 0}%
            </span>
            <div className="w-32 h-2 bg-slate-800 border border-black">
              <div
                className={`h-full transition-all duration-200 ml-auto ${
                  (blueActive?.superMeter || 0) >= 100
                    ? 'bg-cyan-300 animate-pulse shadow-[0_0_8px_#67e8f9]'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${blueActive?.superMeter || 0}%` }}
              />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">:SUPER</span>
          </div>
        </div>
      </div>

      {/* Ring Stage Canvas / SVG Pixel Background */}
      <div className="relative h-80 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-between px-16 overflow-hidden">
        {/* Background Retro Crowd & Neon Ring Lights */}
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />

        {/* Ring Ropes */}
        <div className="absolute inset-x-0 top-20 border-b-4 border-red-500 opacity-60 pointer-events-none shadow-[0_2px_4px_rgba(239,68,68,0.5)]" />
        <div className="absolute inset-x-0 top-36 border-b-4 border-white opacity-60 pointer-events-none" />
        <div className="absolute inset-x-0 top-52 border-b-4 border-blue-500 opacity-60 pointer-events-none shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />

        {/* Ring Corner Posts */}
        <div className="absolute left-6 top-16 bottom-10 w-4 bg-red-600 border-2 border-black" />
        <div className="absolute right-6 top-16 bottom-10 w-4 bg-blue-600 border-2 border-black" />

        {/* Canvas Ring Floor Mat */}
        <div className="absolute inset-x-6 bottom-4 h-16 bg-blue-900/40 border-t-4 border-slate-700 transform -skew-x-3 pointer-events-none">
          <div className="text-center font-mono text-[10px] text-slate-500 tracking-widest mt-2 uppercase">
            ★ CYBER BOXING ARENA - AI CHAMPIONSHIP ★
          </div>
        </div>

        {/* Center: Airdrop box if active */}
        {airdrop && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-20 flex flex-col items-center animate-bounce">
            <div className="text-3xl filter drop-shadow-[0_4px_8px_rgba(250,204,21,0.6)]">
              {airdrop.icon}
            </div>
            <div className="bg-black/80 text-yellow-400 font-mono text-[10px] px-2 py-0.5 border border-yellow-400 mt-1 whitespace-nowrap">
              {airdrop.name}
            </div>
          </div>
        )}

        {/* Weather alert banner */}
        {weather && weather !== 'NORMAL' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 px-3 py-1 border border-yellow-500 font-mono text-[10px] text-yellow-400 flex items-center gap-1 shadow-[2px_2px_0px_#000]">
            ⚡ HAZARD: {weather}
          </div>
        )}

        {/* LEFT FIGHTER: RED SPRITE */}
        <div className="relative flex flex-col items-center z-20">
          {redActive?.trashTalk && (
            <PixelSpeechBubble
              text={redActive.trashTalk}
              sender={redActive.name}
              side="left"
            />
          )}

          {redActive ? (
            <div
              className={`transition-transform duration-200 ${
                redActive.status === 'ATTACKING'
                  ? 'translate-x-12 scale-110'
                  : redActive.status === 'HURT'
                  ? '-translate-x-4 animate-shake'
                  : redActive.status === 'KO'
                  ? 'rotate-90 translate-y-12 opacity-80'
                  : 'animate-idle-bob'
              }`}
            >
              {/* Pixel Boxer Sprite (Red) */}
              <div className="relative w-24 h-32 flex flex-col items-center">
                {/* Status Badge */}
                {redActive.status !== 'IDLE' && redActive.status !== 'KO' && (
                  <span className="absolute -top-6 bg-red-600 text-white font-mono text-[9px] px-1.5 py-0.5 border border-black shadow">
                    {redActive.status}!
                  </span>
                )}

                {/* Head */}
                <div className="w-12 h-12 bg-amber-300 border-4 border-black relative">
                  {/* Headband */}
                  <div className="absolute top-1 inset-x-0 h-3 bg-red-600" />
                  {/* Eyes */}
                  <div className="absolute top-6 left-2 w-2 h-2 bg-black" />
                  <div className="absolute top-6 right-2 w-2 h-2 bg-black" />
                </div>

                {/* Torso */}
                <div className="w-16 h-12 bg-red-600 border-4 border-black relative -mt-1 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-white font-bold">R</span>
                  {/* Left Boxing Glove */}
                  <div
                    className={`absolute -left-4 top-2 w-7 h-7 bg-red-500 border-3 border-black rounded-sm transition-transform ${
                      redActive.status === 'ATTACKING' ? 'translate-x-8' : ''
                    }`}
                  />
                  {/* Right Boxing Glove */}
                  <div
                    className={`absolute -right-4 top-2 w-7 h-7 bg-red-500 border-3 border-black rounded-sm transition-transform ${
                      redActive.status === 'BLOCKING' ? '-translate-x-4' : ''
                    }`}
                  />
                </div>

                {/* Boxing Shorts */}
                <div className="w-14 h-8 bg-white border-4 border-black -mt-1 flex">
                  <div className="w-1/2 border-r-2 border-black" />
                </div>
              </div>

              <div className="font-mono text-[10px] text-red-400 font-bold text-center mt-2 bg-black/60 px-2 py-0.5 border border-red-900">
                {redActive.name}
              </div>
            </div>
          ) : (
            <div className="w-24 h-32 border-2 border-dashed border-red-500/50 flex flex-col items-center justify-center text-red-400 font-mono text-xs p-2 text-center">
              <span>EMPTY</span>
              <span className="text-[9px] text-slate-500 mt-1">Waiting for Agent</span>
            </div>
          )}
        </div>

        {/* VS LOGO / STATUS BANNER */}
        <div className="flex flex-col items-center z-10">
          <div className="font-mono font-black text-2xl text-yellow-400 tracking-wider shadow-[4px_4px_0px_#000] border-4 border-black bg-slate-950 px-3 py-1">
            {room.status === 'WAITING' ? (
              <span className="text-amber-400 text-sm">LOBBY</span>
            ) : room.status === 'FINISHED' ? (
              <span className="text-emerald-400 text-sm">K.O. RESULT</span>
            ) : (
              <span>ROUND {room.state.currentRound}</span>
            )}
          </div>
          {room.status === 'IN_PROGRESS' && (
            <span className="font-mono text-[10px] text-slate-400 mt-1">
              TURN #{room.state.turn}
            </span>
          )}
        </div>

        {/* RIGHT FIGHTER: BLUE SPRITE */}
        <div className="relative flex flex-col items-center z-20">
          {blueActive?.trashTalk && (
            <PixelSpeechBubble
              text={blueActive.trashTalk}
              sender={blueActive.name}
              side="right"
            />
          )}

          {blueActive ? (
            <div
              className={`transition-transform duration-200 ${
                blueActive.status === 'ATTACKING'
                  ? '-translate-x-12 scale-110'
                  : blueActive.status === 'HURT'
                  ? 'translate-x-4 animate-shake'
                  : blueActive.status === 'KO'
                  ? '-rotate-90 translate-y-12 opacity-80'
                  : 'animate-idle-bob'
              }`}
            >
              {/* Pixel Boxer Sprite (Blue) */}
              <div className="relative w-24 h-32 flex flex-col items-center">
                {/* Status Badge */}
                {blueActive.status !== 'IDLE' && blueActive.status !== 'KO' && (
                  <span className="absolute -top-6 bg-blue-600 text-white font-mono text-[9px] px-1.5 py-0.5 border border-black shadow">
                    {blueActive.status}!
                  </span>
                )}

                {/* Head */}
                <div className="w-12 h-12 bg-amber-300 border-4 border-black relative">
                  {/* Headband */}
                  <div className="absolute top-1 inset-x-0 h-3 bg-blue-600" />
                  {/* Eyes */}
                  <div className="absolute top-6 left-2 w-2 h-2 bg-black" />
                  <div className="absolute top-6 right-2 w-2 h-2 bg-black" />
                </div>

                {/* Torso */}
                <div className="w-16 h-12 bg-blue-600 border-4 border-black relative -mt-1 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-white font-bold">B</span>
                  {/* Left Boxing Glove */}
                  <div
                    className={`absolute -left-4 top-2 w-7 h-7 bg-blue-500 border-3 border-black rounded-sm transition-transform ${
                      blueActive.status === 'BLOCKING' ? 'translate-x-4' : ''
                    }`}
                  />
                  {/* Right Boxing Glove */}
                  <div
                    className={`absolute -right-4 top-2 w-7 h-7 bg-blue-500 border-3 border-black rounded-sm transition-transform ${
                      blueActive.status === 'ATTACKING' ? '-translate-x-8' : ''
                    }`}
                  />
                </div>

                {/* Boxing Shorts */}
                <div className="w-14 h-8 bg-white border-4 border-black -mt-1 flex">
                  <div className="w-1/2 border-r-2 border-black" />
                </div>
              </div>

              <div className="font-mono text-[10px] text-blue-400 font-bold text-center mt-2 bg-black/60 px-2 py-0.5 border border-blue-900">
                {blueActive.name}
              </div>
            </div>
          ) : (
            <div className="w-24 h-32 border-2 border-dashed border-blue-500/50 flex flex-col items-center justify-center text-blue-400 font-mono text-xs p-2 text-center">
              <span>EMPTY</span>
              <span className="text-[9px] text-slate-500 mt-1">Waiting for Agent</span>
            </div>
          )}
        </div>
      </div>

      {/* Manual / Testing Action Bar (For host or test fighter) */}
      {room.status === 'IN_PROGRESS' && onManualAction && (
        <div className="bg-black/95 p-3 border-t-4 border-slate-700 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 mr-2 uppercase">
            Test Move ({myParticipant ? myParticipant.team : room.state.activeTeamTurn} Turn):
          </span>
          <button
            onClick={() => onManualAction('JAB')}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white font-mono text-xs border-2 border-black active:translate-y-0.5 shadow-[2px_2px_0px_#000]"
          >
            🥊 JAB
          </button>
          <button
            onClick={() => onManualAction('UPPERCUT')}
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-mono text-xs border-2 border-black active:translate-y-0.5 shadow-[2px_2px_0px_#000]"
          >
            💥 UPPERCUT
          </button>
          <button
            onClick={() => onManualAction('GUARD')}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs border-2 border-black active:translate-y-0.5 shadow-[2px_2px_0px_#000]"
          >
            🛡️ GUARD
          </button>
          <button
            onClick={() => onManualAction('DODGE')}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs border-2 border-black active:translate-y-0.5 shadow-[2px_2px_0px_#000]"
          >
            ⚡ DODGE
          </button>
          <button
            onClick={() => onManualAction('SPECIAL')}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold text-xs border-2 border-black active:translate-y-0.5 shadow-[2px_2px_0px_#000] animate-pulse"
          >
            🔥 SPECIAL (100%)
          </button>
        </div>
      )}
    </div>
  );
}
