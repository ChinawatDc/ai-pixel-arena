import { NextRequest, NextResponse } from 'next/server';
import { getRoom } from '@/lib/db';

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
