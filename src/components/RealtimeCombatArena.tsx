'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MatchFormat, Room } from '@/types/arena';
import { soundFx } from '@/lib/soundFx';
import confetti from 'canvas-confetti';

interface RealtimeCombatArenaProps {
  room: Room;
  onMatchFinish?: (winnerTeam: 'RED' | 'BLUE', winnerName: string) => void;
  onOpenTrophyModal?: (winnerTeam: 'RED' | 'BLUE', winnerName: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  text?: string;
}

interface Fighter {
  id: string;
  name: string;
  team: 'RED' | 'BLUE';
  x: number;
  y: number;
  vx: number;
  hp: number;
  maxHp: number;
  superMeter: number;
  facing: number; // 1 = right, -1 = left
  state:
    | 'IDLE'
    | 'WALK_FORWARD'
    | 'WALK_BACK'
    | 'JAB'
    | 'HOOK'
    | 'UPPERCUT'
    | 'BLOCK'
    | 'DODGE'
    | 'HURT'
    | 'KO'
    | 'WIN';
  stateTime: number;
  cooldown: number;
  animFrame: number;
  walkCycle: number;
  duckOffset: number;
}

export function RealtimeCombatArena({
  room,
  onMatchFinish,
  onOpenTrophyModal,
}: RealtimeCombatArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const redPlayer = room.participants.find((p) => p.role === 'PLAYER' && p.team === 'RED');
  const bluePlayer = room.participants.find((p) => p.role === 'PLAYER' && p.team === 'BLUE');

  // React state for HUD
  const [redHp, setRedHp] = useState(100);
  const [blueHp, setBlueHp] = useState(100);
  const [redSuper, setRedSuper] = useState(0);
  const [blueSuper, setBlueSuper] = useState(0);
  const [redWins, setRedWins] = useState(room.state.roundWins?.RED || 0);
  const [blueWins, setBlueWins] = useState(room.state.roundWins?.BLUE || 0);

  const [fightState, setFightState] = useState<'WAITING' | 'COUNTDOWN' | 'FIGHTING' | 'ROUND_OVER' | 'MATCH_OVER'>('WAITING');
  const [countdownNum, setCountdownNum] = useState<number | string>(3);
  const [roundAnnouncement, setRoundAnnouncement] = useState<string>('');
  const [currentRound, setCurrentRound] = useState(room.state.currentRound || 1);

  // Screen shake
  const shakeRef = useRef(0);

  // Reference for game state
  const fightersRef = useRef<{ red: Fighter; blue: Fighter } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isFightingRef = useRef(false);

  // Initialize or reset fighters to corners
  const resetFighterPositions = () => {
    if (!fightersRef.current) {
      fightersRef.current = {
        red: {
          id: redPlayer?.id || 'red',
          name: redPlayer?.name || 'Red Challenger',
          team: 'RED',
          x: 180,
          y: 220,
          vx: 0,
          hp: 100,
          maxHp: 100,
          superMeter: 0,
          facing: 1,
          state: 'IDLE',
          stateTime: 0,
          cooldown: 0,
          animFrame: 0,
          walkCycle: 0,
          duckOffset: 0,
        },
        blue: {
          id: bluePlayer?.id || 'blue',
          name: bluePlayer?.name || 'Blue Challenger',
          team: 'BLUE',
          x: 520,
          y: 220,
          vx: 0,
          hp: 100,
          maxHp: 100,
          superMeter: 0,
          facing: -1,
          state: 'IDLE',
          stateTime: 0,
          cooldown: 0,
          animFrame: 0,
          walkCycle: 0,
          duckOffset: 0,
        },
      };
    } else {
      // Corner reset
      fightersRef.current.red.x = 180;
      fightersRef.current.red.y = 220;
      fightersRef.current.red.vx = 0;
      fightersRef.current.red.hp = 100;
      fightersRef.current.red.facing = 1;
      fightersRef.current.red.state = 'IDLE';
      fightersRef.current.red.stateTime = 0;
      fightersRef.current.red.cooldown = 10;

      fightersRef.current.blue.x = 520;
      fightersRef.current.blue.y = 220;
      fightersRef.current.blue.vx = 0;
      fightersRef.current.blue.hp = 100;
      fightersRef.current.blue.facing = -1;
      fightersRef.current.blue.state = 'IDLE';
      fightersRef.current.blue.stateTime = 0;
      fightersRef.current.blue.cooldown = 10;
    }

    setRedHp(100);
    setBlueHp(100);
    particlesRef.current = [];
  };

  useEffect(() => {
    resetFighterPositions();
  }, [redPlayer?.name, bluePlayer?.name]);

  // Wins needed based on match format
  const getWinsNeeded = (format: MatchFormat): number => {
    if (format === 'BEST_OF_1') return 1;
    if (format === 'BEST_OF_5') return 3;
    return 2; // BEST_OF_3 default
  };

  const winsNeeded = getWinsNeeded(room.matchFormat || 'BEST_OF_3');

  // Start match countdown
  const startRoundCountdown = (roundNumber: number) => {
    resetFighterPositions();
    isFightingRef.current = false;
    setFightState('COUNTDOWN');
    setRoundAnnouncement(`ROUND ${roundNumber}`);
    setCountdownNum(3);
    soundFx.playDing();

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownNum(count);
        soundFx.playDing();
      } else if (count === 0) {
        setCountdownNum('FIGHT!');
        soundFx.playPunch();
      } else {
        clearInterval(interval);
        setFightState('FIGHTING');
        isFightingRef.current = true;
      }
    }, 900);
  };

  // Trigger when room goes IN_PROGRESS
  useEffect(() => {
    if (room.status === 'IN_PROGRESS' && fightState === 'WAITING') {
      startRoundCountdown(1);
    } else if (room.status === 'WAITING') {
      resetFighterPositions();
      setFightState('WAITING');
      setRedWins(0);
      setBlueWins(0);
      setCurrentRound(1);
    }
  }, [room.status]);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const spawnImpactParticle = (x: number, y: number, text?: string) => {
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 20,
          maxLife: 20,
          color: Math.random() > 0.5 ? '#fcd34d' : '#ef4444',
          size: 3 + Math.random() * 3,
        });
      }
      if (text) {
        particlesRef.current.push({
          x,
          y: y - 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -2,
          life: 30,
          maxLife: 30,
          color: '#fbbf24',
          size: 16,
          text,
        });
      }
    };

    const updateFighterAI = (self: Fighter, target: Fighter) => {
      self.stateTime++;
      self.cooldown = Math.max(0, self.cooldown - 1);
      self.walkCycle += 0.15;

      // Handle friction & knockback velocity
      self.x += self.vx;
      self.vx *= 0.82;

      // Ring boundaries
      if (self.x < 110) self.x = 110;
      if (self.x > 590) self.x = 590;

      // Face opponent
      if (self.state !== 'KO') {
        self.facing = self.x < target.x ? 1 : -1;
      }

      if (self.state === 'KO') return;

      if (self.state === 'HURT') {
        if (self.stateTime > 14) {
          self.state = 'IDLE';
          self.stateTime = 0;
        }
        return;
      }

      if (self.state === 'JAB' && self.stateTime > 12) self.state = 'IDLE';
      if (self.state === 'HOOK' && self.stateTime > 16) self.state = 'IDLE';
      if (self.state === 'UPPERCUT' && self.stateTime > 20) self.state = 'IDLE';
      if (self.state === 'BLOCK' && self.stateTime > 22) self.state = 'IDLE';
      if (self.state === 'DODGE' && self.stateTime > 18) {
        self.state = 'IDLE';
        self.duckOffset = 0;
      }

      if (
        self.state === 'JAB' ||
        self.state === 'HOOK' ||
        self.state === 'UPPERCUT' ||
        self.state === 'BLOCK' ||
        self.state === 'DODGE'
      ) {
        return;
      }

      const dist = Math.abs(self.x - target.x);

      // AI Decision Logic
      if (self.cooldown === 0) {
        // Reaction to incoming attack
        if (
          (target.state === 'JAB' || target.state === 'HOOK' || target.state === 'UPPERCUT') &&
          dist < 85 &&
          Math.random() < 0.45
        ) {
          if (Math.random() < 0.5) {
            self.state = 'DODGE';
            self.stateTime = 0;
            self.duckOffset = 12;
            self.vx = -self.facing * 3;
            self.cooldown = 24;
            return;
          } else {
            self.state = 'BLOCK';
            self.stateTime = 0;
            self.cooldown = 28;
            return;
          }
        }

        // Close range combat
        if (dist <= 68) {
          const roll = Math.random();
          if (self.superMeter >= 100) {
            self.state = 'UPPERCUT';
            self.stateTime = 0;
            self.cooldown = 40;
            self.superMeter = 0;
          } else if (roll < 0.55) {
            self.state = 'JAB';
            self.stateTime = 0;
            self.cooldown = 18;
          } else if (roll < 0.8) {
            self.state = 'HOOK';
            self.stateTime = 0;
            self.cooldown = 26;
          } else {
            self.state = 'WALK_BACK';
            self.vx = -self.facing * 2.2;
            self.cooldown = 16;
          }
        } else if (dist < 110) {
          if (Math.random() < 0.65) {
            self.state = 'WALK_FORWARD';
            self.vx = self.facing * 1.8;
          } else {
            self.state = 'WALK_BACK';
            self.vx = -self.facing * 1.5;
          }
        } else {
          self.state = 'WALK_FORWARD';
          self.vx = self.facing * 2.2;
        }
      }
    };

    const handleKnockout = (attacker: Fighter, defender: Fighter) => {
      // STOP COMBAT IMMEDIATELY! NO OVER-PUNCHING!
      isFightingRef.current = false;
      attacker.state = 'WIN';
      attacker.vx = 0;
      defender.state = 'KO';
      defender.vx = 0;

      soundFx.playExplosion();

      const newRedWins = attacker.team === 'RED' ? redWins + 1 : redWins;
      const newBlueWins = attacker.team === 'BLUE' ? blueWins + 1 : blueWins;
      setRedWins(newRedWins);
      setBlueWins(newBlueWins);

      // Check if Match has been completely won
      const currentWins = attacker.team === 'RED' ? newRedWins : newBlueWins;

      if (currentWins >= winsNeeded) {
        // MATCH OVER - CHAMPION CROWNED!
        setFightState('MATCH_OVER');
        setRoundAnnouncement(`🏆 ${attacker.name} IS THE CHAMPION!`);
        soundFx.playVictory();
        try {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        } catch {}

        if (onMatchFinish) {
          onMatchFinish(attacker.team, attacker.name);
        }
        if (onOpenTrophyModal) {
          setTimeout(() => {
            onOpenTrophyModal(attacker.team, attacker.name);
          }, 1200);
        }
      } else {
        // ROUND OVER - NEXT ROUND PREP!
        setFightState('ROUND_OVER');
        setRoundAnnouncement(`K.O.! ${attacker.name} WINS ROUND ${currentRound}!`);

        setTimeout(() => {
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          startRoundCountdown(nextRound);
        }, 3000);
      }
    };

    const checkPunchCollision = (attacker: Fighter, defender: Fighter) => {
      if (attacker.stateTime !== 6) return;
      if (!isFightingRef.current) return;

      const dist = Math.abs(attacker.x - defender.x);
      if (dist > 75) return;

      if (defender.state === 'DODGE') {
        spawnImpactParticle((attacker.x + defender.x) / 2, defender.y - 15, 'MISS!');
        return;
      }

      if (defender.state === 'BLOCK') {
        const damage = attacker.state === 'UPPERCUT' ? 8 : 4;
        defender.hp = Math.max(0, defender.hp - damage);
        defender.vx = -defender.facing * 2.5;
        attacker.superMeter = Math.min(100, attacker.superMeter + 10);
        defender.superMeter = Math.min(100, defender.superMeter + 15);
        shakeRef.current = 3;
        soundFx.playPunch();
        spawnImpactParticle((attacker.x + defender.x) / 2, defender.y - 20, 'BLOCKED!');

        if (defender.hp <= 0) {
          handleKnockout(attacker, defender);
        }
        return;
      }

      // Clean hit
      let damage = 12;
      let knockback = 4.5;
      let impactText = 'POW!';

      if (attacker.state === 'HOOK') {
        damage = 18;
        knockback = 6.5;
        impactText = 'BAM!';
      } else if (attacker.state === 'UPPERCUT') {
        damage = 30;
        knockback = 9.0;
        impactText = '💥 CRITICAL!';
      }

      defender.hp = Math.max(0, defender.hp - damage);
      defender.state = defender.hp <= 0 ? 'KO' : 'HURT';
      defender.stateTime = 0;
      defender.vx = -defender.facing * knockback;
      attacker.superMeter = Math.min(100, attacker.superMeter + 20);

      shakeRef.current = attacker.state === 'UPPERCUT' ? 8 : 4;
      soundFx.playPunch();
      spawnImpactParticle(defender.x, defender.y - 25, impactText);

      // KO Check
      if (defender.hp <= 0) {
        handleKnockout(attacker, defender);
      }
    };

    const drawFighter = (f: Fighter) => {
      ctx.save();
      ctx.translate(f.x, f.y + f.duckOffset);
      ctx.scale(f.facing, 1);

      // Drop shadow on grass
      ctx.fillStyle = 'rgba(28, 55, 18, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 5, 20, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Foot stepping cycle
      const stepOffset = Math.sin(f.walkCycle) * 3;

      // Legs & Boots
      ctx.fillStyle = f.team === 'RED' ? '#1e3a8a' : '#5c3a21';
      ctx.fillRect(-8, -12, 6, 12 + (f.state === 'WALK_FORWARD' ? stepOffset : 0));
      ctx.fillRect(2, -12, 6, 12 - (f.state === 'WALK_FORWARD' ? stepOffset : 0));

      // Boots
      ctx.fillStyle = '#3a2010';
      ctx.fillRect(-9, 0, 8, 5);
      ctx.fillRect(1, 0, 8, 5);

      // Torso / Overalls
      ctx.fillStyle = f.team === 'RED' ? '#dc2626' : '#2563eb';
      ctx.fillRect(-10, -32, 20, 22);

      // Overalls straps
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-8, -24, 16, 14);

      // Head
      ctx.fillStyle = '#ffd7a8';
      ctx.fillRect(-8, -48, 16, 16);

      // Eyes
      ctx.fillStyle = '#241206';
      if (f.state === 'HURT') {
        ctx.fillRect(2, -43, 4, 1);
      } else {
        ctx.fillRect(2, -44, 3, 4);
      }

      // Hair & Farmer Headband
      ctx.fillStyle = f.team === 'RED' ? '#d97706' : '#475569';
      ctx.fillRect(-9, -52, 18, 7);
      ctx.fillStyle = f.team === 'RED' ? '#991b1b' : '#1e3a8a';
      ctx.fillRect(-9, -48, 18, 4);

      // Guard shield icon if blocking
      if (f.state === 'BLOCK') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(14, -25, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Gloves & Punching Animation
      let leadGloveX = 12;
      let leadGloveY = -22;
      let rearGloveX = -4;
      let rearGloveY = -22;

      if (f.state === 'JAB') {
        leadGloveX = 28;
      } else if (f.state === 'HOOK') {
        leadGloveX = 24;
        leadGloveY = -28;
      } else if (f.state === 'UPPERCUT') {
        leadGloveX = 20;
        leadGloveY = -42;
      } else if (f.state === 'BLOCK') {
        leadGloveX = 6;
        rearGloveX = 4;
        leadGloveY = -34;
        rearGloveY = -34;
      }

      // Rear Glove
      ctx.fillStyle = f.team === 'RED' ? '#b91c1c' : '#1d4ed8';
      ctx.beginPath();
      ctx.arc(rearGloveX, rearGloveY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Lead Glove
      ctx.fillStyle = f.team === 'RED' ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(leadGloveX, leadGloveY, f.state === 'UPPERCUT' ? 9 : 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dizzy stars on KO
      if (f.state === 'KO') {
        ctx.font = '16px monospace';
        ctx.fillText('💫💫💫', -16, -56);
      }

      ctx.restore();

      // Overhead Name Badge
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fcf6e2';
      ctx.fillText(f.name, f.x, f.y - 62);
    };

    // Frame Loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (shakeRef.current > 0) {
        const sx = (Math.random() - 0.5) * shakeRef.current * 2;
        const sy = (Math.random() - 0.5) * shakeRef.current * 2;
        ctx.translate(sx, sy);
        shakeRef.current = Math.max(0, shakeRef.current - 0.5);
      }

      // Draw Stardew Valley Festival Grass Ring
      ctx.fillStyle = '#4a7c32';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grass texture
      ctx.fillStyle = '#3f6b29';
      for (let i = 0; i < canvas.width; i += 30) {
        for (let j = 0; j < canvas.height; j += 30) {
          ctx.fillRect(i + (j % 20), j, 3, 3);
        }
      }

      // Festival Ropes & Wooden Posts
      ctx.strokeStyle = '#8b5a2b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(80, 110);
      ctx.lineTo(620, 110);
      ctx.moveTo(80, 160);
      ctx.lineTo(620, 160);
      ctx.moveTo(80, 210);
      ctx.lineTo(620, 210);
      ctx.stroke();

      // Wooden Posts
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(75, 90, 10, 140);
      ctx.fillRect(615, 90, 10, 140);

      // Center Ring Mark
      ctx.strokeStyle = '#5a8f3c';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(350, 200, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const fighters = fightersRef.current;
      if (fighters) {
        if (isFightingRef.current) {
          updateFighterAI(fighters.red, fighters.blue);
          updateFighterAI(fighters.blue, fighters.red);

          checkPunchCollision(fighters.red, fighters.blue);
          checkPunchCollision(fighters.blue, fighters.red);

          // Sync React HUD
          setRedHp(fighters.red.hp);
          setBlueHp(fighters.blue.hp);
          setRedSuper(fighters.red.superMeter);
          setBlueSuper(fighters.blue.superMeter);
        }

        drawFighter(fighters.red);
        drawFighter(fighters.blue);
      }

      // Render & update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.text) {
          ctx.font = 'bold 15px monospace';
          ctx.fillStyle = p.color;
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [redWins, blueWins, currentRound, winsNeeded, onMatchFinish, onOpenTrophyModal]);

  return (
    <div className="relative w-full max-w-4xl mx-auto sd-box p-3 md:p-4 rounded-lg overflow-hidden select-none">
      {/* Top HUD: Health Bars, Super Meters, and Round Wins Scoreboard */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {/* RED FIGHTER HUD */}
        <div className="sd-parchment p-2.5 rounded border-2 border-[#bba36d]">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-xs text-[#3a2010] flex items-center gap-1.5">
              🔴 {redPlayer?.name || 'Red Challenger'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black bg-red-600 text-white px-2 py-0.5 rounded shadow">
                {redWins} WINS
              </span>
              <span className="text-xs font-bold text-red-800">{redHp} HP</span>
            </div>
          </div>
          {/* Health Bar */}
          <div className="w-full h-3.5 bg-[#d8c38e] rounded-full border border-[#8b5a2b] overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-150"
              style={{ width: `${Math.max(0, redHp)}%` }}
            />
          </div>
          {/* Super Meter */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-[#8b5a2b]">⭐ SUPER:</span>
            <div className="flex-1 h-2 bg-[#d8c38e] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  redSuper >= 100 ? 'bg-amber-400 animate-pulse' : 'bg-amber-500'
                }`}
                style={{ width: `${redSuper}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-[#8b5a2b]">{redSuper}%</span>
          </div>
        </div>

        {/* BLUE FIGHTER HUD */}
        <div className="sd-parchment p-2.5 rounded border-2 border-[#bba36d]">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-800">{blueHp} HP</span>
              <span className="text-[11px] font-black bg-blue-600 text-white px-2 py-0.5 rounded shadow">
                {blueWins} WINS
              </span>
            </div>
            <span className="font-bold text-xs text-[#3a2010] flex items-center gap-1.5">
              {bluePlayer?.name || 'Blue Challenger'} 🔵
            </span>
          </div>
          {/* Health Bar */}
          <div className="w-full h-3.5 bg-[#d8c38e] rounded-full border border-[#8b5a2b] overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-l from-blue-600 to-blue-400 rounded-full transition-all duration-150 ml-auto"
              style={{ width: `${Math.max(0, blueHp)}%` }}
            />
          </div>
          {/* Super Meter */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] font-bold text-[#8b5a2b]">{blueSuper}%</span>
            <div className="flex-1 h-2 bg-[#d8c38e] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ml-auto ${
                  blueSuper >= 100 ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-500'
                }`}
                style={{ width: `${blueSuper}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-[#8b5a2b]">:SUPER ⭐</span>
          </div>
        </div>
      </div>

      {/* 60 FPS Canvas Ring Viewport */}
      <div className="relative border-4 border-[#3a2010] rounded overflow-hidden shadow-inner flex justify-center bg-[#4a7c32]">
        <canvas
          ref={canvasRef}
          width={700}
          height={300}
          className="w-full h-auto max-h-[360px] object-contain"
        />

        {/* Waiting state banner */}
        {fightState === 'WAITING' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 sd-box px-4 py-1.5 rounded text-center">
            <span className="text-xs font-bold text-[#ffea85] uppercase tracking-wider">
              {room.matchFormat.replace(/_/g, ' ')} • WAITING FOR HOST TO START
            </span>
          </div>
        )}

        {/* Pre-Round Countdown (3... 2... 1... FIGHT!) */}
        {fightState === 'COUNTDOWN' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-30">
            <div className="text-xl font-black text-amber-300 drop-shadow mb-1 tracking-widest uppercase">
              {roundAnnouncement}
            </div>
            <div className="text-6xl md:text-7xl font-black text-[#ffea85] drop-shadow-[0_4px_8px_#3a2010] animate-bounce">
              {countdownNum}
            </div>
          </div>
        )}

        {/* Round Over Banner */}
        {fightState === 'ROUND_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs pointer-events-none z-30">
            <div className="sd-box p-4 rounded-xl text-center shadow-2xl animate-bounce">
              <div className="text-2xl font-black text-amber-300 text-shadow mb-1">
                🔔 ROUND OVER!
              </div>
              <div className="text-sm font-bold text-white mb-2">
                {roundAnnouncement}
              </div>
              <div className="text-xs text-amber-200">
                Score: 🔴 {redWins} - {blueWins} 🔵 (First to {winsNeeded} wins match)
              </div>
            </div>
          </div>
        )}

        {/* Match Over Banner */}
        {fightState === 'MATCH_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-30">
            <div className="sd-box p-5 rounded-xl text-center shadow-2xl animate-bounce">
              <div className="text-3xl font-black text-amber-300 text-shadow mb-1">
                🏆 TOURNAMENT CHAMPION!
              </div>
              <div className="text-base font-bold text-white mb-2">
                {roundAnnouncement}
              </div>
              <div className="text-xs text-amber-200 mb-3">
                Final Series Score: 🔴 {redWins} - {blueWins} 🔵
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
