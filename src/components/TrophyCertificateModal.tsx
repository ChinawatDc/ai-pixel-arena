'use client';

import React, { useRef, useState } from 'react';
import { Room } from '@/types/arena';
import { Trophy, Download, X, Award, Check } from 'lucide-react';

interface TrophyCertificateModalProps {
  room: Room;
  winnerTeam: 'RED' | 'BLUE' | 'DRAW';
  winnerName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TrophyCertificateModal({
  room,
  winnerTeam,
  winnerName,
  isOpen,
  onClose,
}: TrophyCertificateModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const redScore = room.state.roundWins.RED;
  const blueScore = room.state.roundWins.BLUE;
  const finalScoreText = `${redScore} - ${blueScore}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const generateAndDownloadCertificate = () => {
    setDownloading(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Parchment & Wood Frame
    ctx.fillStyle = '#3a2010'; // Dark Wood Border
    ctx.fillRect(0, 0, 1200, 800);

    ctx.fillStyle = '#704214'; // Mid Wood
    ctx.fillRect(16, 16, 1168, 768);

    ctx.fillStyle = '#fcf6e2'; // Inner Parchment
    ctx.fillRect(36, 36, 1128, 728);

    // Decorative Gold Inner Line
    ctx.strokeStyle = '#cda365';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 1100, 700);

    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, 1088, 688);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#cda365';
      ctx.fillRect(x, y, 16, 16);
      ctx.fillStyle = '#704214';
      ctx.fillRect(x + 4, y + 4, 8, 8);
    };
    drawCorner(52, 52);
    drawCorner(1132, 52);
    drawCorner(52, 732);
    drawCorner(1132, 732);

    // 2. Top Header Ribbon
    ctx.fillStyle = winnerTeam === 'RED' ? '#991b1b' : '#1e3a8a';
    ctx.fillRect(300, 75, 600, 50);
    ctx.strokeStyle = '#cda365';
    ctx.lineWidth = 3;
    ctx.strokeRect(300, 75, 600, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('★ OFFICIAL CERTIFICATE OF VICTORY ★', 600, 108);

    // Subtitle
    ctx.fillStyle = '#704214';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('PELICAN TOWN AI COLOSSEUM CHAMPIONSHIP', 600, 165);

    // 3. Trophy Cup Illustration
    ctx.font = '68px monospace';
    ctx.fillText('🏆', 600, 255);

    // "THIS CERTIFIES THAT"
    ctx.fillStyle = '#5c3a21';
    ctx.font = '16px monospace';
    ctx.fillText('THIS PRESTIGIOUS TITLE IS PROUDLY AWARDED TO', 600, 310);

    // Champion Name
    ctx.fillStyle = winnerTeam === 'RED' ? '#dc2626' : '#2563eb';
    ctx.font = 'black 48px monospace';
    ctx.fillText(winnerName.toUpperCase(), 600, 375);

    // Underline
    ctx.strokeStyle = '#cda365';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 395);
    ctx.lineTo(850, 395);
    ctx.stroke();

    // Achievement text
    ctx.fillStyle = '#3a2010';
    ctx.font = '18px monospace';
    ctx.fillText(
      `For demonstrating supreme combat mastery and valor in the arena`,
      600,
      440
    );
    ctx.fillText(
      `and claiming total victory for TEAM ${winnerTeam}!`,
      600,
      470
    );

    // 4. Match Statistics Table / Box
    ctx.fillStyle = '#f4ebd0';
    ctx.fillRect(250, 510, 700, 110);
    ctx.strokeStyle = '#bba36d';
    ctx.lineWidth = 2;
    ctx.strokeRect(250, 510, 700, 110);

    ctx.fillStyle = '#633a18';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`• ARENA MATCH: ${room.name} [${room.code}]`, 280, 545);
    ctx.fillText(`• FORMAT: ${room.matchFormat.replace(/_/g, ' ')}`, 280, 575);
    ctx.fillText(`• FINAL SCORE: ${finalScoreText}`, 280, 605);

    ctx.fillText(`• DATE: ${dateStr}`, 660, 545);
    ctx.fillText(`• MODE: ${room.gameMode}`, 660, 575);
    ctx.fillText(`• STATUS: VERIFIED K.O.`, 660, 605);

    // 5. Signatures & Gold Seal
    ctx.textAlign = 'center';
    ctx.fillStyle = '#704214';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('Mayor Lewis', 380, 690);
    ctx.strokeStyle = '#704214';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(280, 670);
    ctx.lineTo(480, 670);
    ctx.stroke();
    ctx.font = '12px monospace';
    ctx.fillText('Arena Overseer', 380, 710);

    // Golden Wax Seal
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(600, 680, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('★', 600, 688);

    // Host Signature
    ctx.fillStyle = '#704214';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('AI Arena Master', 820, 690);
    ctx.beginPath();
    ctx.moveTo(720, 670);
    ctx.lineTo(920, 670);
    ctx.stroke();
    ctx.font = '12px monospace';
    ctx.fillText('Verified Referee', 820, 710);

    // Trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Arena_Champion_${room.code}_${winnerName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-xl sd-box p-6 rounded-xl text-[#3a2010] shadow-2xl animate-bounce-once">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#3a2010] hover:text-black font-bold p-1 bg-[#d8c38e] border border-[#3a2010] rounded"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Card Preview */}
        <div className="sd-parchment p-5 rounded-lg border-4 border-[#bba36d] text-center">
          {/* Trophy Header */}
          <div className="text-4xl mb-1">🏆</div>
          <span className="text-[10px] bg-amber-500 text-black px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest inline-block mb-1">
            VICTORY CEREMONY
          </span>
          <h2 className="text-xl font-black text-[#633a18] uppercase tracking-wider">
            CHAMPION OF PELICAN ARENA
          </h2>

          {/* Winner Display */}
          <div className="my-4 py-3 bg-[#f4ebd0] rounded border-2 border-[#d8c38e]">
            <div className="text-xs text-[#78522c] font-bold uppercase">
              Grand Champion:
            </div>
            <div
              className={`text-2xl md:text-3xl font-black mt-1 ${
                winnerTeam === 'RED' ? 'text-red-700' : 'text-blue-700'
              }`}
            >
              {winnerName} (TEAM {winnerTeam})
            </div>
            <div className="text-xs text-[#633a18] font-bold mt-1">
              Final Score: {finalScoreText} ({room.matchFormat.replace(/_/g, ' ')})
            </div>
          </div>

          <p className="text-xs text-[#78522c] mb-4">
            Congratulations! You can download your official high-resolution Trophy Certificate as a PNG image to share or keep as an achievement!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={generateAndDownloadCertificate}
              disabled={downloading}
              className="sd-button-green px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform shadow-lg cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  DOWNLOADED SUCCESS!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {downloading ? 'GENERATING CERTIFICATE...' : 'DOWNLOAD CERTIFICATE (PNG)'}
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="sd-button px-4 py-2.5 rounded-lg font-bold text-xs"
            >
              Back to Arena
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
