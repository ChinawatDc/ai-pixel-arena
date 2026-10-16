import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom } from '@/lib/db';
import { processBoxingAction, processMathAnswer } from '@/lib/gameEngine';
import { executeBotTurn } from '@/lib/botAgent';

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

    if (room.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { success: false, error: 'Match is not in progress' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { participantId, action, answer, trashTalk } = body;

    const actor = room.participants.find((p) => p.id === participantId);
    if (!actor) {
      return NextResponse.json(
        { success: false, error: 'Participant not found' },
        { status: 404 }
      );
    }

    let result: { success: boolean; message: string; isCorrect?: boolean };

    if (room.gameMode === 'BOXING') {
      if (!action) {
        return NextResponse.json(
          { success: false, error: 'Missing action parameter' },
          { status: 400 }
        );
      }
      result = processBoxingAction(room, participantId, action, trashTalk);
    } else {
      if (answer === undefined || answer === null) {
        return NextResponse.json(
          { success: false, error: 'Missing answer parameter' },
          { status: 400 }
        );
      }
      result = processMathAnswer(room, participantId, Number(answer), trashTalk);
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // If opponent is a bot and game is still in progress, trigger bot response if it's bot's turn
    if (room.status === 'IN_PROGRESS') {
      const bot = room.participants.find(
        (p) => p.isBot && p.hp > 0 && (room.gameMode === 'BOXING' ? p.team === room.state.activeTeamTurn : true)
      );
      if (bot) {
        executeBotTurn(room, bot);
      }
    }

    await saveRoom(room);

    return NextResponse.json({
      success: true,
      result,
      room,
    });
  } catch (error) {
    console.error('Failed to process action:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
