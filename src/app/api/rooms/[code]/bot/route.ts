import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom } from '@/lib/db';
import { createBotParticipant } from '@/lib/botAgent';
import { Team } from '@/types/arena';

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

    const body = await req.json().catch(() => ({}));
    let team: Team = body.team;
    if (!team) {
      // Auto assign team with fewer players
      const redCount = room.participants.filter((p) => p.role === 'PLAYER' && p.team === 'RED').length;
      const blueCount = room.participants.filter((p) => p.role === 'PLAYER' && p.team === 'BLUE').length;
      team = redCount <= blueCount ? 'RED' : 'BLUE';
    }

    const bot = createBotParticipant(room.id, team, body.name);
    room.participants.push(bot);

    room.logs.unshift({
      id: `log_${Date.now()}_bot`,
      timestamp: Date.now(),
      text: `🤖 CPU Fighter [${bot.name}] entered the arena for Team ${team}!`,
      type: 'SYSTEM',
      team,
    });

    await saveRoom(room);

    return NextResponse.json({
      success: true,
      bot,
      room,
    });
  } catch (error) {
    console.error('Failed to spawn bot:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
