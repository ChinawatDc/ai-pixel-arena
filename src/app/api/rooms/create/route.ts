import { NextRequest, NextResponse } from 'next/server';
import { createNewRoom, saveRoom } from '@/lib/db';
import { GameMode, BattleType, MatchFormat } from '@/types/arena';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const gameMode: GameMode = body.gameMode === 'SPEED_MATH' ? 'SPEED_MATH' : 'BOXING';
    const battleType: BattleType = body.battleType === 'TEAM' ? 'TEAM' : '1V1';
    const matchFormat: MatchFormat = body.matchFormat || 'BEST_OF_3';
    const name: string = body.name || `Battle Arena`;

    const room = createNewRoom(name, gameMode, battleType, matchFormat);
    await saveRoom(room);

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error('Failed to create room:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
