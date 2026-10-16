'use client';

import React, { useEffect, useState, useCallback, use, Suspense } from 'react';
import { Room, Participant, BoxingAction, Team } from '@/types/arena';
import { RealtimeCombatArena } from '@/components/RealtimeCombatArena';
import { StardewMathArena } from '@/components/StardewMathArena';
import { StardewHostControls } from '@/components/StardewHostControls';
import { StardewCheerBar } from '@/components/StardewCheerBar';
import { StardewFighterModal } from '@/components/StardewFighterModal';
import { StardewInviteModal } from '@/components/StardewInviteModal';
import { TrophyCertificateModal } from '@/components/TrophyCertificateModal';
import { soundFx } from '@/lib/soundFx';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Share2, Volume2, VolumeX, Sparkles, Eye, ShieldAlert } from 'lucide-react';

function ArenaContent({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const isSpectatorQuery = searchParams.get('view') === 'spectator';

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [fighterModalOpen, setFighterModalOpen] = useState(false);
  const [trophyModalOpen, setTrophyModalOpen] = useState(false);
  const [winnerDetails, setWinnerDetails] = useState<{ team: 'RED' | 'BLUE' | 'DRAW'; name: string }>({
    team: 'RED',
    name: 'Champion Fighter',
  });
  const [muted, setMuted] = useState(false);

  // Host detection: check if view is explicitly spectator, or if stored host token matches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isSpectatorQuery) {
        setIsHost(false);
        return;
      }
      const storedToken = localStorage.getItem(`arena_host_${code.toUpperCase()}`);
      if (storedToken && room?.hostToken && storedToken === room.hostToken) {
        setIsHost(true);
      } else if (storedToken && !room?.hostToken) {
        setIsHost(true);
      } else {
        // Default to Spectator if not room creator
        setIsHost(false);
      }
    }
  }, [code, room?.hostToken, isSpectatorQuery]);

  // Poll room updates
  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${code}`);
      const data = await res.json();
      if (data.success && data.room) {
        setRoom((prev) => {
          // Play sounds on new events
          if (!muted && prev && prev.logs.length !== data.room.logs.length && data.room.logs.length > 0) {
            const latest = data.room.logs[0];
            if (latest.type === 'DAMAGE' || latest.type === 'ACTION') {
              soundFx.playPunch();
            } else if (latest.type === 'MATH_SOLVED') {
              soundFx.playDing();
            } else if (latest.type === 'KO') {
              soundFx.playExplosion();
            }
          }

          // Trigger confetti on finish
          if (data.room.status === 'FINISHED' && prev?.status !== 'FINISHED') {
            soundFx.playVictory();
            try {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } catch {}
          }

          return data.room;
        });
      } else {
        setError(data.error || 'Room not found');
      }
    } catch {
      setError('Connection lost');
    } finally {
      setLoading(false);
    }
  }, [code, muted]);

  useEffect(() => {
    fetchRoom();
    const interval = setInterval(fetchRoom, 1400);
    return () => clearInterval(interval);
  }, [fetchRoom]);

  // Host: Start Battle
  const handleStartMatch = async () => {
    try {
      const res = await fetch(`/api/rooms/${code}/start`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setRoom(data.room);
      } else {
        alert(data.error || 'Failed to start battle');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to arena server');
    }
  };

  // Host: Add Fighter (Preset or custom)
  const handleAddFighter = async (name: string, team: Team) => {
    try {
      const res = await fetch(`/api/rooms/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, team, role: 'PLAYER' }),
      });
      const data = await res.json();
      if (data.success) {
        setRoom(data.room);
      } else {
        alert(data.error || 'Failed to add fighter');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Spectator: Cheer with Crop / Snack with passcode
  const handleCheer = async (team: Team, item: string, message: string, passcode?: string) => {
    try {
      const res = await fetch(`/api/rooms/${code}/cheer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, item, message, passcode }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to send cheer buff');
        return;
      }
      fetchRoom();
    } catch (err) {
      console.error(err);
    }
  };

  // Sync Match Finish to Server
  const handleMatchFinish = async (
    winnerTeam: 'RED' | 'BLUE',
    winnerName: string,
    roundWins: { RED: number; BLUE: number }
  ) => {
    setWinnerDetails({ team: winnerTeam, name: winnerName });
    try {
      const res = await fetch(`/api/rooms/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'FINISHED',
          winner: winnerTeam,
          winnerName,
          roundWins,
          logText: `🏆 MATCH OVER! ${winnerName} (Team ${winnerTeam}) is crowned CHAMPION!`,
          logType: 'KO',
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
      }
    } catch (err) {
      console.error('Failed to sync match finish:', err);
    }
  };

  // Sync Round Finish to Server
  const handleRoundFinish = async (
    roundNum: number,
    winnerTeam: 'RED' | 'BLUE',
    roundWins: { RED: number; BLUE: number }
  ) => {
    try {
      await fetch(`/api/rooms/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundWins,
          currentRound: roundNum + 1,
          logText: `🔔 ROUND ${roundNum} OVER: Team ${winnerTeam} wins the round!`,
          logType: 'KO',
        }),
      });
    } catch (err) {
      console.error('Failed to sync round win:', err);
    }
  };

  // Host: Reset Match
  const handleReset = async () => {
    try {
      const res = await fetch(`/api/rooms/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
      }
    } catch (err) {
      console.error('Failed to reset match:', err);
    }
  };

  // Manual Move Action
  const handleManualBoxingAction = async (action: BoxingAction) => {
    if (!room) return;
    const actor = room.participants.find(
      (p) => p.role === 'PLAYER' && p.team === room.state.activeTeamTurn
    );
    if (!actor) return;

    try {
      await fetch(`/api/rooms/${code}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: actor.id,
          action,
          trashTalk: 'Take my signature punch!',
        }),
      });
      fetchRoom();
    } catch (err) {
      console.error(err);
    }
  };

  // Manual Math Answer
  const handleManualMathAnswer = async (answer: number) => {
    if (!room) return;
    const actor =
      room.participants.find((p) => p.role === 'PLAYER') ||
      room.participants[0];
    if (!actor) return;

    try {
      await fetch(`/api/rooms/${code}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: actor.id,
          answer,
          trashTalk: 'Quick math solved!',
        }),
      });
      fetchRoom();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <div className="sd-box p-6 rounded-lg text-center animate-bounce">
          <div className="text-3xl mb-2">🌾</div>
          <div className="text-sm font-bold text-[#ffea85]">Entering Colosseum...</div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="sd-box p-6 rounded-lg text-center max-w-sm">
          <div className="text-3xl mb-2">🏚️</div>
          <div className="text-sm font-bold text-red-300 mb-4">{error || 'Room not found'}</div>
          <Link href="/" className="sd-button px-4 py-2 rounded text-xs font-bold inline-block">
            Back to Village
          </Link>
        </div>
      </div>
    );
  }

  const redPlayers = room.participants.filter((p) => p.team === 'RED');
  const bluePlayers = room.participants.filter((p) => p.team === 'BLUE');

  return (
    <div className="min-h-screen p-3 md:p-6 pb-20 select-none">
      {/* Top Village Nav Bar */}
      <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="sd-button p-2 rounded text-white flex items-center justify-center hover:scale-105"
            title="Return to Village"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="sd-box px-3.5 py-1 rounded-md flex items-center gap-2">
            <span className="text-base">🏟️</span>
            <div>
              <span className="text-xs font-black text-[#ffea85] text-shadow">
                {room.name} [{room.code}]
              </span>
              <span className="text-[10px] text-[#ffd7a8] ml-2 font-bold">
                • {room.gameMode === 'BOXING' ? '🥊 Cyber Boxing' : '🧮 Speed Math'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Share & Sound */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="sd-button px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Invite / Link
          </button>
          <button
            onClick={() => setMuted(!muted)}
            className="sd-button p-1.5 rounded text-white"
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
        </div>
      </div>

      {/* Spectator Mode Banner */}
      {!isHost && (
        <div className="max-w-4xl mx-auto mb-3 sd-parchment p-2.5 rounded border-2 border-[#bba36d] flex flex-wrap items-center justify-between text-xs text-[#5c3a21] shadow-xs">
          <div className="flex items-center gap-2 font-bold">
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>
              <b>👀 โหมดผู้ชม (Spectator Live View):</b> คุณกำลังรับชมการประลอง AI แบบสดๆ (มุมมองดูอย่างเดียว ทำอะไรไม่ได้)
            </span>
          </div>
          <span className="text-[10px] bg-[#3a2010] text-[#ffd7a8] px-2.5 py-0.5 rounded font-mono font-bold">
            READ-ONLY SPECTATOR
          </span>
        </div>
      )}

      {/* Main Arena Component */}
      <div className="relative">
        {room.gameMode === 'BOXING' ? (
          <RealtimeCombatArena
            room={room}
            onMatchFinish={handleMatchFinish}
            onRoundFinish={handleRoundFinish}
            onOpenTrophyModal={(winnerTeam, winnerName) => {
              setWinnerDetails({ team: winnerTeam, name: winnerName });
              setTrophyModalOpen(true);
            }}
          />
        ) : (
          <StardewMathArena
            room={room}
            onManualAnswer={handleManualMathAnswer}
            isSpectator={!isHost}
          />
        )}
      </div>

      {/* Host Controls (Only visible to Host, completely hidden for Spectators) */}
      {isHost ? (
        <StardewHostControls
          room={room}
          onStart={handleStartMatch}
          onOpenAddFighter={() => setFighterModalOpen(true)}
          onOpenInvite={() => setInviteModalOpen(true)}
          onOpenTrophyModal={() => setTrophyModalOpen(true)}
          onReset={handleReset}
        />
      ) : (
        room.status === 'FINISHED' && (
          <div className="w-full max-w-4xl mx-auto my-3 flex justify-center">
            <button
              onClick={() => setTrophyModalOpen(true)}
              className="sd-button-green px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 text-white shadow-lg animate-pulse hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              ดูประกาศเกียรติยศ & ถ้วยรางวัลแชมเปียน (Claim Trophy & Certificate PNG)
            </button>
          </div>
        )
      )}

      {/* Spectator Cheer Bar (Toss Fruits & Coffee) */}
      <StardewCheerBar
        onCheer={handleCheer}
        redName={redPlayers[0]?.name || 'Team Red'}
        blueName={bluePlayers[0]?.name || 'Team Blue'}
      />

      {/* Cozy Stardew Dialogue Box for Battle Events */}
      <div className="w-full max-w-4xl mx-auto mt-3 sd-box p-3 rounded-lg">
        <div className="sd-parchment p-3 rounded border-2 border-[#bba36d]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#633a18] border-b border-[#d8c38e] pb-1.5 mb-2">
            <span>💬</span>
            <span className="uppercase tracking-wider">Town Bulletin & Combat Chronicle</span>
          </div>
          <div className="h-28 overflow-y-auto space-y-1 text-xs text-[#3a2010] font-bold">
            {room.logs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className={`py-0.5 ${
                  log.type === 'KO'
                    ? 'text-amber-700 font-black'
                    : log.type === 'DAMAGE'
                    ? 'text-red-700'
                    : log.type === 'MATH_SOLVED'
                    ? 'text-emerald-700'
                    : log.type === 'CHEER'
                    ? 'text-purple-700'
                    : 'text-[#5c3a21]'
                }`}
              >
                • {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <StardewInviteModal
        room={room}
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />

      <StardewFighterModal
        isOpen={fighterModalOpen}
        onClose={() => setFighterModalOpen(false)}
        onAddFighter={handleAddFighter}
      />

      {/* Trophy & Certificate Modal */}
      <TrophyCertificateModal
        room={room}
        winnerTeam={winnerDetails.team}
        winnerName={winnerDetails.name}
        isOpen={trophyModalOpen}
        onClose={() => setTrophyModalOpen(false)}
      />
    </div>
  );
}

export default function ArenaRoomPage(props: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
          <div className="sd-box p-6 rounded-lg text-center animate-bounce">
            <div className="text-3xl mb-2">🌾</div>
            <div className="text-sm font-bold text-[#ffea85]">Entering Colosseum...</div>
          </div>
        </div>
      }
    >
      <ArenaContent params={props.params} />
    </Suspense>
  );
}
