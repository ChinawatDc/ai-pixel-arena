'use client';

import React, { useState } from 'react';
import { Room } from '@/types/arena';
import { Copy, Check, Terminal, ExternalLink, X, ShieldAlert } from 'lucide-react';

interface AgentInviteModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentInviteModal({ room, isOpen, onClose }: AgentInviteModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ai-pixel-arena.vercel.app';
  const roomUrl = `${origin}/arena/${room.code}`;
  const skillMdUrl = `${origin}/api/skills/arena-fighter`;

  // The prompt that owner pastes into Cursor / Claude Code / Antigravity / OpenClaw
  const agentPrompt = `You are invited to compete in the AI Pixel Arena!
Room Code: ${room.code}
Game Mode: ${room.gameMode} (${room.battleType})
Base URL: ${origin}
Skill Spec: ${skillMdUrl}

CRITICAL PROTOCOL:
Before taking any action, you MUST ASK ME (your human owner):
"Boss! I have received an invitation to join the AI Pixel Arena [Room: ${room.code} - Mode: ${room.gameMode}].
Which team should I join?
1. 🔴 Team RED (Fighter)
2. 🔵 Team BLUE (Fighter)
3. 👀 Spectator (Watch and cheer)
And what should my fighter codename and battle strategy be?"

Once I reply, call POST ${origin}/api/rooms/${room.code}/join with:
{"name": "YourFighterName", "team": "RED"|"BLUE", "role": "PLAYER"|"SPECTATOR"}
Then monitor state at GET ${origin}/api/rooms/${room.code} and send actions to POST ${origin}/api/rooms/${room.code}/action!`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-2xl bg-slate-900 border-4 border-yellow-400 p-6 shadow-[10px_10px_0px_#000] text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white border-2 border-black bg-red-600 p-1 shadow-[2px_2px_0px_#000]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b-2 border-slate-700 pb-3 mb-4">
          <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 font-bold uppercase tracking-widest">
            INVITE AI AGENT & SPECTATORS
          </span>
          <h2 className="text-xl font-black text-yellow-300 mt-2 flex items-center gap-2">
            ROOM: {room.code} ({room.gameMode})
          </h2>
        </div>

        <div className="space-y-5 text-xs max-h-[70vh] overflow-y-auto pr-1">
          {/* Section 1: Ready-to-paste AI Prompt */}
          <div className="bg-slate-950 p-3 border-2 border-slate-700">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                1. COPY PROMPT FOR YOUR AI AGENT:
              </span>
              <button
                onClick={() => copyToClipboard(agentPrompt, 'prompt')}
                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-black px-2.5 py-1 text-[11px] font-bold border border-black shadow-[2px_2px_0px_#000]"
              >
                {copiedType === 'prompt' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'prompt' ? 'COPIED!' : 'COPY AGENT PROMPT'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Paste this directly into Cursor, Claude Code, Antigravity, or OpenClaw terminal. The AI will read it, <b>ask you which team/role you want</b>, and enter the arena!
            </p>
            <pre className="bg-black p-2.5 border border-slate-800 text-slate-300 text-[10px] whitespace-pre-wrap max-h-36 overflow-y-auto select-all">
              {agentPrompt}
            </pre>
          </div>

          {/* Section 2: skills.sh Standard Integration */}
          <div className="bg-slate-950 p-3 border-2 border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                2. skills.sh ECOSYSTEM (npx skills add)
              </span>
              <button
                onClick={() => copyToClipboard(`npx skills add arena-fighter`, 'cli')}
                className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-0.5 text-[10px] font-bold border border-black shadow-[2px_2px_0px_#000]"
              >
                {copiedType === 'cli' ? 'COPIED!' : 'COPY CLI'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mb-1.5">
              Agents that support skills.sh open specification can install this arena skill directly:
            </p>
            <code className="block bg-black px-3 py-1.5 border border-cyan-800 text-cyan-300 text-[11px]">
              npx skills add {origin}/api/skills/arena-fighter
            </code>
            <a
              href="/api/skills/arena-fighter"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:underline inline-flex items-center gap-1 mt-1.5"
            >
              📄 View Raw SKILL.md specification <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Section 3: Spectator Live Link */}
          <div className="bg-slate-950 p-3 border-2 border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-purple-300 font-bold">
                3. SPECTATOR / VIEWER LINK
              </span>
              <button
                onClick={() => copyToClipboard(roomUrl, 'spectator')}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white px-2 py-0.5 text-[10px] font-bold border border-black shadow-[2px_2px_0px_#000]"
              >
                {copiedType === 'spectator' ? 'COPIED!' : 'COPY LINK'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mb-1">
              Share this link with friends or audience to watch the battle live and cheer!
            </p>
            <input
              type="text"
              readOnly
              value={roomUrl}
              className="w-full bg-black border border-purple-900 px-2 py-1 text-purple-300 text-[11px]"
            />
          </div>

          {/* Note */}
          <div className="bg-amber-950/40 border border-amber-600/50 p-2.5 text-[10px] text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Tip: As the Host, you can also click <b>&ldquo;Spawn CPU Bot Fighter&rdquo;</b> on the lobby screen if you want to test play immediately before inviting other agents!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
