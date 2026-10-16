export type GameMode = 'BOXING' | 'SPEED_MATH';
export type BattleType = '1V1' | 'TEAM';
export type RoomStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED';
export type Team = 'RED' | 'BLUE';
export type ParticipantRole = 'PLAYER' | 'SPECTATOR';
export type MatchFormat = 'BEST_OF_1' | 'BEST_OF_3' | 'BEST_OF_5' | 'TOTAL_POINTS';

export type BoxingAction = 'JAB' | 'UPPERCUT' | 'GUARD' | 'DODGE' | 'SPECIAL';

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  team: Team;
  hp: number;
  maxHp: number;
  score: number;
  roundWins: number;
  superMeter: number; // 0 - 100%
  avatar: string; // pixel sprite identifier
  isBot?: boolean;
  ready: boolean;
  status: 'IDLE' | 'ATTACKING' | 'BLOCKING' | 'HURT' | 'KO' | 'WIN';
  lastAction?: string;
  trashTalk?: string;
}

export interface MathQuestion {
  id: string;
  question: string;
  answer: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimitSec: number;
  createdAt: number;
}

export interface GameLog {
  id: string;
  timestamp: number;
  text: string;
  type: 'SYSTEM' | 'ACTION' | 'DAMAGE' | 'KO' | 'AIRDROP' | 'CHEER' | 'MATH_SOLVED';
  team?: Team;
}

export interface AirdropItem {
  id: string;
  type: 'HEALTH_POTION' | 'OVERCLOCK_BOOST' | 'BANANA_PEEL' | 'SHIELD_DRINK';
  name: string;
  icon: string;
  effectDescription: string;
  active: boolean;
}

export interface GameState {
  currentRound: number;
  maxRounds: number;
  matchFormat: MatchFormat;
  roundWins: {
    RED: number;
    BLUE: number;
  };
  turn: number;
  activeTeamTurn?: Team;
  weatherHazard?: 'NORMAL' | 'CYBER_THUNDER' | 'MATRIX_GLITCH' | 'NEON_FOG';
  activeAirdrop?: AirdropItem | null;
  currentMathQuestion?: MathQuestion | null;
  winner?: Team | 'DRAW' | null;
  winnerName?: string | null;
  lastUpdate: number;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  gameMode: GameMode;
  battleType: BattleType;
  matchFormat: MatchFormat;
  status: RoomStatus;
  maxPlayers: number;
  participants: Participant[];
  state: GameState;
  logs: GameLog[];
  hostToken?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CheerEvent {
  id: string;
  sender: string;
  team: Team;
  item: 'HEART' | 'BANANA' | 'ENERGY_DRINK' | 'LIGHTNING';
  message: string;
  timestamp: number;
}
