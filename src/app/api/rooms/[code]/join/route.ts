import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom } from '@/lib/db';
import { Participant, ParticipantRole, Team } from '@/types/arena';

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

    const body = await req.json();
    const name = (body.name || 'Anonymous Agent').trim();
    const role: ParticipantRole = body.role === 'SPECTATOR' ? 'SPECTATOR' : 'PLAYER';
    const team: Team = body.team === 'BLUE' ? 'BLUE' : 'RED';
    const avatar = body.avatar || (team === 'RED' ? 'boxer_red' : 'boxer_blue');

    // Check room capacity for players
    if (role === 'PLAYER') {
      const activePlayers = room.participants.filter((p) => p.role === 'PLAYER');
      if (activePlayers.length >= room.maxPlayers) {
        return NextResponse.json(
          { success: false, error: `Room is full (max ${room.maxPlayers} players)` },
          { status: 400 }
        );
      }
    }

    const participantId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newParticipant: Participant = {
      id: participantId,
      name,
      role,
      team,
      hp: 100,
      maxHp: 100,
      score: 0,
      roundWins: 0,
      superMeter: 0,
      avatar,
      ready: true,
      status: 'IDLE',
    };

    room.participants.push(newParticipant);

    room.logs.unshift({
      id: `log_${Date.now()}_join`,
      timestamp: Date.now(),
      text: `👋 [${role}] ${name} joined Team ${team}!`,
      type: 'SYSTEM',
      team,
    });

    await saveRoom(room);

    return NextResponse.json({
      success: true,
      participantId,
      participant: newParticipant,
      room,
    });
  } catch (error) {
    console.error('Failed to join room:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
