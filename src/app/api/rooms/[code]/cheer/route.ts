import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom } from '@/lib/db';
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

    const body = await req.json();
    const passcode = (body.passcode || '').trim();

    // Enforce VIP buff passcode 253600
    if (passcode !== '253600') {
      return NextResponse.json(
        {
          success: false,
          error: '⛔ สิทธิ์โยนบัพถูกล็อค: ต้องกรอกรหัสผ่าน VIP 253600 เท่านั้น (จำกัดสิทธิ์เฉพาะเจ้าของ)',
        },
        { status: 403 }
      );
    }

    const sender = (body.sender || 'Arena VIP').trim();
    const team: Team = body.team === 'BLUE' ? 'BLUE' : 'RED';
    const item: 'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING' = body.item || 'HEART';
    const message = (body.message || '').trim().slice(0, 60);

    const itemIcons = {
      HEART: '❤️ Heart Toss (+10 HP)',
      BANANA: '🍌 Banana Trap',
      ENERGY_DRINK: '⚡ Energy Drink (+25% Super)',
      LIGHTNING: '⚡ Cyber Spark Cheer',
    };

    // If game is in progress, give a mini effect to team
    if (room.status === 'IN_PROGRESS') {
      const teamFighter = room.participants.find((p) => p.role === 'PLAYER' && p.team === team && p.hp > 0);
      if (teamFighter) {
        if (item === 'HEART') {
          teamFighter.hp = Math.min(teamFighter.maxHp, teamFighter.hp + 10);
        } else if (item === 'ENERGY_DRINK') {
          teamFighter.superMeter = Math.min(100, teamFighter.superMeter + 25);
        }
      }
    }

    room.logs.unshift({
      id: `cheer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      text: `📣 [Spectator ${sender}] cheered Team ${team} with ${itemIcons[item]}! "${message}"`,
      type: 'CHEER',
      team,
    });

    await saveRoom(room);

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error('Failed to cheer:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
