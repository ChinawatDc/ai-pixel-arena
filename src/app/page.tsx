'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameMode, BattleType, MatchFormat } from '@/types/arena';
import { Play, ArrowRight } from 'lucide-react';

export default function LobbyPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('BOXING');
  const [battleType, setBattleType] = useState<BattleType>('1V1');
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('BEST_OF_3');
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Pelican Colosseum',
          gameMode,
          battleType,
          matchFormat,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        if (typeof window !== 'undefined' && data.room.hostToken) {
          localStorage.setItem(`arena_host_${data.room.code}`, data.room.hostToken);
        }
        router.push(`/arena/${data.room.code}`);
      }
    } catch {
      alert('Failed to create room');
      setCreating(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    router.push(`/arena/${joinCode.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 select-none relative">
      {/* Wooden Hanging Village Sign Header */}
      <div className="relative mt-2 mb-5 text-center flex flex-col items-center">
        {/* Banner Image */}
        <div className="w-full max-w-xl rounded-xl overflow-hidden border-4 border-[#3a2010] shadow-2xl mb-3">
          <img
            src="/banner.jpg"
            alt="Stardew AI Arena Banner"
            className="w-full h-auto max-h-48 object-cover object-center"
          />
        </div>

        <div className="sd-box px-8 py-3 rounded-xl inline-block">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-xl">🥊</span>
            <h1 className="text-2xl md:text-4xl font-black text-[#ffea85] text-shadow tracking-wider">
              STARDEW AI ARENA
            </h1>
            <span className="text-xl">🧮</span>
          </div>
          <p className="text-xs text-[#ffd7a8] font-bold">
            สังเวียนประลอง AI สไตล์ Stardew Valley • มวยพิกเซล 60 FPS & แข่งคิดเลข
          </p>
        </div>
      </div>

      {/* Main Notice Board Card */}
      <div className="w-full max-w-xl sd-box p-6 rounded-xl shadow-2xl relative">
        <div className="sd-parchment p-5 rounded-lg border-2 border-[#bba36d]">
          <h2 className="text-base font-bold text-[#633a18] uppercase tracking-wider text-center border-b-2 border-[#d8c38e] pb-2 mb-4">
            📜 Create Arena (เปิดห้องสังเวียน)
          </h2>

          <form onSubmit={handleCreateRoom} className="space-y-4 text-xs font-bold text-[#3a2010]">
            {/* Arena Name */}
            <div>
              <label className="block mb-1 text-[#633a18]">Arena Name (ชื่อสังเวียน):</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pelican Town Boxing Match"
                className="w-full bg-white border-2 border-[#bba36d] rounded px-3 py-2 text-[#3a2010] font-bold focus:outline-none focus:border-[#704214]"
              />
            </div>

            {/* Game Mode Pick */}
            <div>
              <label className="block mb-1.5 text-[#633a18]">Game Mode (เลือกการแข่งขัน):</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGameMode('BOXING')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${
                    gameMode === 'BOXING'
                      ? 'sd-button-red text-white scale-102 ring-2 ring-[#ffd7a8]'
                      : 'bg-[#f4ebd0] text-[#633a18] border-[#bba36d] hover:bg-[#fff9e6]'
                  }`}
                >
                  <span className="text-2xl mb-1">🥊</span>
                  <span className="font-black text-xs">PIXEL BOXING</span>
                  <span className="text-[10px] opacity-90 mt-0.5">ต่อยมวย & ท่าไม้ตาย</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameMode('SPEED_MATH')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${
                    gameMode === 'SPEED_MATH'
                      ? 'sd-button-green text-white scale-102 ring-2 ring-[#ffd7a8]'
                      : 'bg-[#f4ebd0] text-[#633a18] border-[#bba36d] hover:bg-[#fff9e6]'
                  }`}
                >
                  <span className="text-2xl mb-1">🧮</span>
                  <span className="font-black text-xs">SPEED MATH</span>
                  <span className="text-[10px] opacity-90 mt-0.5">คิดเลขเร็วชิงแต้ม</span>
                </button>
              </div>
            </div>

            {/* Battle Format */}
            <div>
              <label className="block mb-1 text-[#633a18]">Match Format (รูปแบบ):</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBattleType('1V1')}
                  className={`py-1.5 rounded text-xs font-bold border-2 ${
                    battleType === '1V1'
                      ? 'sd-button text-white'
                      : 'bg-[#f4ebd0] text-[#633a18] border-[#bba36d]'
                  }`}
                >
                  1 VS 1 Match
                </button>
                <button
                  type="button"
                  onClick={() => setBattleType('TEAM')}
                  className={`py-1.5 rounded text-xs font-bold border-2 ${
                    battleType === 'TEAM'
                      ? 'sd-button text-white'
                      : 'bg-[#f4ebd0] text-[#633a18] border-[#bba36d]'
                  }`}
                >
                  2 VS 2 Team Brawl
                </button>
              </div>
            </div>

            {/* Rounds / Match Format Selector */}
            <div>
              <label className="block mb-1 text-[#633a18]">Match Rules (จำนวนรอบตัดสิน):</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMatchFormat('BEST_OF_1')}
                  className={`py-2 px-1 rounded text-center border-2 transition-all ${
                    matchFormat === 'BEST_OF_1'
                      ? 'sd-button-red text-white scale-102 ring-1 ring-amber-300'
                      : 'bg-[#f4ebd0] text-[#633a18] border-[#bba36d]'
                  }`}
                >
                  <span className="block font-black text-xs">⚡ 1 Round</span>
                  <span className="text-[9px] opacity-80">รอบเดียวจบ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMatchFormat('BEST_OF_3')}
                  className={`py-2 px-1 rounded text-center border-2 transition-all ${
                    matchFormat === 'BEST_OF_3'
                      ? 'sd-button-green text-white scale-102 ring-1 ring-amber-300'
                      : 'bg-[#f4ebd0] text-[#633a18] border-[#bba36d]'
                  }`}
                >
                  <span className="block font-black text-xs">🏆 Best of 3</span>
                  <span className="text-[9px] opacity-80">ชนะ 2 ใน 3 ยก</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMatchFormat('BEST_OF_5')}
                  className={`py-2 px-1 rounded text-center border-2 transition-all ${
                    matchFormat === 'BEST_OF_5'
                      ? 'sd-button-blue text-white scale-102 ring-1 ring-amber-300'
                      : 'bg-[#f4ebd0] text-[#633a18] border-[#bba36d]'
                  }`}
                >
                  <span className="block font-black text-xs">🥊 Best of 5</span>
                  <span className="text-[9px] opacity-80">ชนะ 3 ใน 5 ยก</span>
                </button>
              </div>
            </div>

            {/* Create Room Button */}
            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 sd-button-green rounded-lg font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 mt-4 hover:scale-101 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              {creating ? 'Opening Colosseum...' : 'Open Arena Room'}
            </button>
          </form>

          {/* Quick Join */}
          <div className="mt-5 pt-4 border-t-2 border-[#d8c38e]">
            <span className="text-xs font-bold text-[#633a18] block mb-2">
              Have a Room Code? (เข้าร่วมด้วยรหัสห้อง):
            </span>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. ARENA-1234"
                className="flex-1 bg-white border-2 border-[#bba36d] rounded px-3 py-1.5 text-xs font-bold text-[#3a2010] uppercase focus:outline-none"
              />
              <button
                type="submit"
                className="sd-button px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                Join <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="mt-6 text-xs text-[#ffd7a8] font-bold text-shadow">
        Stardew AI Colosseum • Pixel Combat & Quiz
      </footer>
    </div>
  );
}
