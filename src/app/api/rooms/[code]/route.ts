import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const room = await getRoom(code.toUpperCase());

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error('Failed to get room:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const room = await getRoom(code.toUpperCase());

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    const body = await req.json();

    if (body.reset) {
      room.status = 'WAITING';
      room.state.currentRound = 1;
      room.state.roundWins = { RED: 0, BLUE: 0 };
      room.state.winner = null;
      room.state.winnerName = null;
      room.participants.forEach((p) => {
        p.hp = 100;
        p.superMeter = 0;
        p.status = 'IDLE';
        p.score = 0;
        p.roundWins = 0;
      });
      room.logs.unshift({
        id: `log_${Date.now()}_reset`,
        timestamp: Date.now(),
        text: `🔄 Match reset for a rematch! Waiting for fighters...`,
        type: 'SYSTEM',
      });
    } else {
      if (body.status) room.status = body.status;
      if (body.winner) room.state.winner = body.winner;
      if (body.winnerName) room.state.winnerName = body.winnerName;
      if (body.roundWins) room.state.roundWins = body.roundWins;
      if (body.currentRound) room.state.currentRound = body.currentRound;
      if (body.logText) {
        room.logs.unshift({
          id: `log_${Date.now()}_patch`,
          timestamp: Date.now(),
          text: body.logText,
          type: body.logType || 'SYSTEM',
          team: body.winner,
        });
      }
    }

    await saveRoom(room);

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error('Failed to update room:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

