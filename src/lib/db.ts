import { neon } from '@neondatabase/serverless';
import { Room, Participant, GameLog, GameMode, BattleType, Team, MatchFormat } from '@/types/arena';

// Global in-memory storage fallback for local testing or when DATABASE_URL is not set
declare global {
  // eslint-disable-next-line no-var
  var __arenaRooms: Map<string, Room> | undefined;
}

if (!global.__arenaRooms) {
  global.__arenaRooms = new Map<string, Room>();
}

const memoryStore = global.__arenaRooms;

// Neon client if DATABASE_URL is provided
const getNeonSql = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;
  return neon(dbUrl);
};

// Ensure Neon schema if needed
let schemaInitialized = false;
async function initNeonSchema() {
  if (schemaInitialized) return;
  const sql = getNeonSql();
  if (!sql) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS arena_rooms (
        code VARCHAR(32) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    schemaInitialized = true;
  } catch (err) {
    console.error('Failed to init Neon schema, fallback to memory:', err);
  }
}

export async function saveRoom(room: Room): Promise<void> {
  room.updatedAt = Date.now();
  memoryStore.set(room.code, room);

  const sql = getNeonSql();
  if (sql) {
    try {
      await initNeonSchema();
      await sql`
        INSERT INTO arena_rooms (code, data, updated_at)
        VALUES (${room.code}, ${JSON.stringify(room)}, NOW())
        ON CONFLICT (code)
        DO UPDATE SET data = ${JSON.stringify(room)}, updated_at = NOW();
      `;
    } catch (err) {
      console.warn('Neon save failed, maintained in memory:', err);
    }
  }
}

export async function getRoom(code: string): Promise<Room | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await initNeonSchema();
      const rows = await sql`
        SELECT data FROM arena_rooms WHERE code = ${code} LIMIT 1;
      `;
      if (rows && rows.length > 0) {
        const room = rows[0].data as Room;
        memoryStore.set(code, room);
        return room;
      }
    } catch (err) {
      console.warn('Neon fetch failed, falling back to memory:', err);
    }
  }

  return memoryStore.get(code) || null;
}

export async function listRecentRooms(): Promise<Room[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await initNeonSchema();
      const rows = await sql`
        SELECT data FROM arena_rooms ORDER BY updated_at DESC LIMIT 10;
      `;
      if (rows && rows.length > 0) {
        return rows.map((r: Record<string, any>) => r.data as Room);
      }
    } catch (err) {
      console.warn('Neon list failed, fallback to memory:', err);
    }
  }

  return Array.from(memoryStore.values())
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 10);
}

export function createNewRoom(
  name: string,
  gameMode: GameMode,
  battleType: BattleType,
  matchFormat: MatchFormat = 'BEST_OF_3'
): Room {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const code = `ARENA-${randomSuffix}`;

  const maxRounds =
    matchFormat === 'BEST_OF_1' ? 1 : matchFormat === 'BEST_OF_5' ? 5 : 3;

  const hostToken = `host_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const newRoom: Room = {
    id: `room_${Date.now()}_${randomSuffix}`,
    code,
    name: name || `Match ${code}`,
    gameMode,
    battleType,
    matchFormat,
    status: 'WAITING',
    maxPlayers: battleType === '1V1' ? 2 : 6,
    participants: [],
    hostToken,
    state: {
      currentRound: 1,
      maxRounds,
      matchFormat,
      roundWins: {
        RED: 0,
        BLUE: 0,
      },
      turn: 1,
      activeTeamTurn: 'RED',
      weatherHazard: 'NORMAL',
      activeAirdrop: null,
      currentMathQuestion: null,
      winner: null,
      winnerName: null,
      lastUpdate: Date.now(),
    },
    logs: [
      {
        id: `log_${Date.now()}`,
        timestamp: Date.now(),
        text: `Arena [${code}] opened! Waiting for AI Agents to join...`,
        type: 'SYSTEM',
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return newRoom;
}
