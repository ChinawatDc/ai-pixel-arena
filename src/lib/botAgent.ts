import { BoxingAction, Participant, Room, Team } from '@/types/arena';
import { processBoxingAction, processMathAnswer } from './gameEngine';

const BOT_AVATARS = ['cyber_bot', 'pixel_glitch', 'robo_brawler', 'neon_ninja'];
const TRASH_TALKS = [
  'My loss function is zero, prepare for defeat!',
  'Calculating your knockout probability: 99.9%!',
  'I have processed 10 billion punches per second!',
  'My neural weights are fully converged on victory!',
  'Syntax Error: Your defense was not found!',
  'You call that an inference speed? Too slow!',
];

export function createBotParticipant(
  roomId: string,
  team: Team,
  name?: string
): Participant {
  const botNames = [
    'DeepJab-Alpha',
    'GPT-Punch-4',
    'Claude-UpperCut',
    'Quantum-Brawler',
    'Pixel-Matrix-AI',
    'Zero-Shot-Fighter',
  ];
  const chosenName = name || botNames[Math.floor(Math.random() * botNames.length)];
  const avatar = BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)];

  return {
    id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: `🤖 ${chosenName}`,
    role: 'PLAYER',
    team,
    hp: 100,
    maxHp: 100,
    score: 0,
    roundWins: 0,
    superMeter: 20,
    avatar,
    isBot: true,
    ready: true,
    status: 'IDLE',
  };
}

// Bot automated turn execution
export function executeBotTurn(room: Room, bot: Participant): boolean {
  if (room.status !== 'IN_PROGRESS' || bot.hp <= 0) return false;

  const quote = TRASH_TALKS[Math.floor(Math.random() * TRASH_TALKS.length)];

  if (room.gameMode === 'BOXING') {
    // Choose move
    let action: BoxingAction = 'JAB';
    if (bot.superMeter >= 100) {
      action = 'SPECIAL';
    } else {
      const roll = Math.random();
      if (roll < 0.45) action = 'JAB';
      else if (roll < 0.75) action = 'UPPERCUT';
      else if (roll < 0.90) action = 'GUARD';
      else action = 'DODGE';
    }

    processBoxingAction(room, bot.id, action, quote);
    return true;
  } else if (room.gameMode === 'SPEED_MATH') {
    const q = room.state.currentMathQuestion;
    if (!q) return false;

    // 85% accuracy for bot
    const isBotCorrect = Math.random() < 0.85;
    const botAns = isBotCorrect ? q.answer : q.answer + (Math.random() < 0.5 ? 1 : -1);

    processMathAnswer(room, bot.id, botAns, quote);
    return true;
  }

  return false;
}
