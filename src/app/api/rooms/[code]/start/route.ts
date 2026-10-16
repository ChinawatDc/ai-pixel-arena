import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom } from '@/lib/db';
import { generateMathQuestion } from '@/lib/gameEngine';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const room = await getRoom(code.toUpperCase());

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    const redPlayers = room.participants.filter((p) => p.role === 'PLAYER' && p.team === 'RED' && p.ready);
    const bluePlayers = room.participants.filter((p) => p.role === 'PLAYER' && p.team === 'BLUE' && p.ready);

    if (redPlayers.length === 0 || bluePlayers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ยังเริ่มไม่ได้: ต้องมีนักสู้ทั้งทีมสีแดง (RED) และทีมสีน้ำเงิน (BLUE) ที่พร้อมลงสนามฝั่งละอย่างน้อย 1 คน!',
        },
        { status: 400 }
      );
    }

    room.status = 'IN_PROGRESS';
    room.state.currentRound = 1;
    room.state.turn = 1;
    room.state.winner = null;

    if (room.gameMode === 'SPEED_MATH') {
      room.state.currentMathQuestion = generateMathQuestion(1);
      room.logs.unshift({
        id: `log_${Date.now()}_start`,
        timestamp: Date.now(),
        text: `🏁 BATTLE STARTED! SPEED MATH ROUND 1: [${room.state.currentMathQuestion.question}]`,
        type: 'SYSTEM',
      });
    } else {
      room.logs.unshift({
        id: `log_${Date.now()}_start`,
        timestamp: Date.now(),
        text: `🔔 DING DING DING! ROUND 1 FIGHT! Team RED moves first!`,
        type: 'SYSTEM',
      });
    }

    await saveRoom(room);

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error('Failed to start match:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
