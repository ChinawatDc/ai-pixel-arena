import { Room, Participant, BoxingAction, Team, MathQuestion, AirdropItem, GameState } from '@/types/arena';

// Math generator helper
export function generateMathQuestion(round: number): MathQuestion {
  const operations = ['+', '-', '*'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1 = 10 + Math.floor(Math.random() * 40 * (round > 2 ? 2 : 1));
  let num2 = 3 + Math.floor(Math.random() * 20);

  if (op === '*') {
    num1 = Math.floor(Math.random() * 15) + 3;
    num2 = Math.floor(Math.random() * 12) + 2;
  }

  let answer = 0;
  let qText = '';

  switch (op) {
    case '+':
      answer = num1 + num2;
      qText = `${num1} + ${num2}`;
      break;
    case '-':
      answer = num1 - num2;
      qText = `${num1} - ${num2}`;
      break;
    case '*':
      answer = num1 * num2;
      qText = `${num1} × ${num2}`;
      break;
  }

  // Round 4+ adds an extra term for spicy challenge
  if (round >= 3) {
    const extra = Math.floor(Math.random() * 15) + 1;
    qText = `(${qText}) + ${extra}`;
    answer = answer + extra;
  }

  return {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    question: qText,
    answer,
    difficulty: round >= 3 ? 'HARD' : round === 2 ? 'MEDIUM' : 'EASY',
    timeLimitSec: 15,
    createdAt: Date.now(),
  };
}

// Random Airdrop Generator
export function spawnAirdrop(): AirdropItem {
  const items: Array<{
    type: AirdropItem['type'];
    name: string;
    icon: string;
    effectDescription: string;
  }> = [
    {
      type: 'HEALTH_POTION',
      name: 'Cyber Nano-Juice',
      icon: '🧪',
      effectDescription: '+25 HP to lucky fighter!',
    },
    {
      type: 'OVERCLOCK_BOOST',
      name: 'Overclock Module',
      icon: '⚡',
      effectDescription: '+50% Super Meter & +10 Atk!',
    },
    {
      type: 'SHIELD_DRINK',
      name: 'Glitch Barrier',
      icon: '🛡️',
      effectDescription: 'Negates next incoming damage!',
    },
    {
      type: 'BANANA_PEEL',
      name: 'Quantum Banana',
      icon: '🍌',
      effectDescription: 'Slipped! Loses 10 HP & stumbles.',
    },
  ];

  const pick = items[Math.floor(Math.random() * items.length)];
  return {
    id: `airdrop_${Date.now()}`,
    ...pick,
    active: true,
  };
}

// Handle Boxing Turn
export function processBoxingAction(
  room: Room,
  actorId: string,
  action: BoxingAction,
  trashTalk?: string
): { success: boolean; message: string } {
  if (room.status !== 'IN_PROGRESS') {
    return { success: false, message: 'Game is not in progress' };
  }

  const actor = room.participants.find((p) => p.id === actorId);
  if (!actor || actor.role !== 'PLAYER') {
    return { success: false, message: 'Participant is not a player' };
  }

  // Target opposing team
  const opponents = room.participants.filter(
    (p) => p.role === 'PLAYER' && p.team !== actor.team && p.hp > 0
  );

  if (opponents.length === 0) {
    checkGameOver(room);
    return { success: false, message: 'No opponents remaining' };
  }

  const target = opponents[Math.floor(Math.random() * opponents.length)];

  actor.lastAction = action;
  if (trashTalk && trashTalk.trim()) {
    actor.trashTalk = trashTalk.trim().slice(0, 80);
    room.logs.unshift({
      id: `log_${Date.now()}_tt`,
      timestamp: Date.now(),
      text: `[${actor.name}] "${actor.trashTalk}"`,
      type: 'ACTION',
      team: actor.team,
    });
  }

  let damage = 0;
  let logText = '';
  let hitType: 'DAMAGE' | 'ACTION' = 'ACTION';

  // Weather Hazard modifier
  const isGlitch = room.state.weatherHazard === 'MATRIX_GLITCH' && Math.random() < 0.25;

  switch (action) {
    case 'JAB':
      damage = 12 + Math.floor(Math.random() * 6);
      actor.status = 'ATTACKING';
      actor.superMeter = Math.min(100, actor.superMeter + 15);
      logText = `🥊 ${actor.name} delivered a swift JAB at ${target.name}!`;
      break;

    case 'UPPERCUT':
      if (Math.random() < 0.3) {
        // Miss or dodged
        damage = 0;
        actor.status = 'ATTACKING';
        logText = `💨 ${actor.name} swung a massive UPPERCUT but missed completely!`;
      } else {
        damage = 26 + Math.floor(Math.random() * 10);
        actor.status = 'ATTACKING';
        actor.superMeter = Math.min(100, actor.superMeter + 25);
        logText = `💥 BOOM! ${actor.name} connected a devastating UPPERCUT on ${target.name}!`;
      }
      break;

    case 'GUARD':
      actor.status = 'BLOCKING';
      actor.superMeter = Math.min(100, actor.superMeter + 10);
      logText = `🛡️ ${actor.name} raised defensive guard!`;
      break;

    case 'DODGE':
      actor.status = 'IDLE';
      actor.superMeter = Math.min(100, actor.superMeter + 10);
      logText = `⚡ ${actor.name} shifted into evasive stance!`;
      break;

    case 'SPECIAL':
      if (actor.superMeter < 100) {
        return { success: false, message: 'Super meter not fully charged yet!' };
      }
      actor.superMeter = 0;
      damage = 45 + Math.floor(Math.random() * 15);
      actor.status = 'ATTACKING';
      logText = `🔥 OVERCLOCK SPECIAL BURST! ${actor.name} unleashed supreme energy at ${target.name}!`;
      break;
  }

  if (isGlitch) {
    logText += ` [MATRIX GLITCH: Reality fluctuated!]`;
  }

  // Apply damage if target is not guarding or dodging
  if (damage > 0) {
    if (target.status === 'BLOCKING') {
      damage = Math.floor(damage * 0.35); // 65% reduction
      logText += ` (${target.name} guarded, taking only ${damage} DMG)`;
    } else if (target.status === 'IDLE' && Math.random() < 0.35) {
      damage = 0;
      logText += ` (${target.name} slipped and evaded the hit!)`;
    }

    if (damage > 0) {
      target.hp = Math.max(0, target.hp - damage);
      target.status = target.hp === 0 ? 'KO' : 'HURT';
      actor.score += damage * 10;
      hitType = 'DAMAGE';
      logText += ` -> [-${damage} HP]`;

      if (target.hp === 0) {
        room.logs.unshift({
          id: `log_${Date.now()}_ko`,
          timestamp: Date.now(),
          text: `💀 K.O.! ${target.name} was knocked out!`,
          type: 'KO',
          team: target.team,
        });
      }
    }
  }

  room.logs.unshift({
    id: `log_${Date.now()}`,
    timestamp: Date.now(),
    text: logText,
    type: hitType,
    team: actor.team,
  });

  // Switch active turn
  room.state.turn += 1;
  room.state.activeTeamTurn = actor.team === 'RED' ? 'BLUE' : 'RED';

  // Check random Airdrop event (25% chance per turn if none active)
  if (!room.state.activeAirdrop && Math.random() < 0.25) {
    room.state.activeAirdrop = spawnAirdrop();
    room.logs.unshift({
      id: `log_${Date.now()}_drop`,
      timestamp: Date.now(),
      text: `📦 AIRDROP INCOMING! ${room.state.activeAirdrop.name} ${room.state.activeAirdrop.icon} dropped into the ring!`,
      type: 'AIRDROP',
    });
  } else if (room.state.activeAirdrop && Math.random() < 0.4) {
    // Collect airdrop
    const drop = room.state.activeAirdrop;
    if (drop.type === 'HEALTH_POTION') {
      actor.hp = Math.min(actor.maxHp, actor.hp + 25);
      logText = `🧪 ${actor.name} grabbed ${drop.name} (+25 HP)!`;
    } else if (drop.type === 'OVERCLOCK_BOOST') {
      actor.superMeter = 100;
      logText = `⚡ ${actor.name} grabbed ${drop.name} (SUPER METER MAX)!`;
    } else if (drop.type === 'BANANA_PEEL') {
      actor.hp = Math.max(1, actor.hp - 10);
      logText = `🍌 ${actor.name} slipped on ${drop.name} (-10 HP)!`;
    }
    room.state.activeAirdrop = null;
    room.logs.unshift({
      id: `log_${Date.now()}_use`,
      timestamp: Date.now(),
      text: logText,
      type: 'AIRDROP',
    });
  }

  // Check weather hazard shift every 6 turns
  if (room.state.turn % 6 === 0) {
    const hazards: Array<GameState['weatherHazard']> = ['NORMAL', 'CYBER_THUNDER', 'MATRIX_GLITCH', 'NEON_FOG'];
    room.state.weatherHazard = hazards[Math.floor(Math.random() * hazards.length)];
    if (room.state.weatherHazard !== 'NORMAL') {
      room.logs.unshift({
        id: `log_${Date.now()}_hazard`,
        timestamp: Date.now(),
        text: `⚠️ ARENA HAZARD ALERT: Weather changed to ${room.state.weatherHazard}!`,
        type: 'SYSTEM',
      });
    }
  }

  checkGameOver(room);
  room.state.lastUpdate = Date.now();
  return { success: true, message: 'Action executed' };
}

// Handle Math Quiz Answer
export function processMathAnswer(
  room: Room,
  actorId: string,
  answer: number,
  trashTalk?: string
): { success: boolean; message: string; isCorrect: boolean } {
  if (room.status !== 'IN_PROGRESS') {
    return { success: false, message: 'Game is not in progress', isCorrect: false };
  }

  const actor = room.participants.find((p) => p.id === actorId);
  if (!actor || actor.role !== 'PLAYER') {
    return { success: false, message: 'Participant is not a player', isCorrect: false };
  }

  const currentQ = room.state.currentMathQuestion;
  if (!currentQ) {
    return { success: false, message: 'No active question currently', isCorrect: false };
  }

  if (trashTalk && trashTalk.trim()) {
    actor.trashTalk = trashTalk.trim().slice(0, 80);
  }

  const isCorrect = Number(answer) === currentQ.answer;

  if (isCorrect) {
    actor.score += 100;
    actor.superMeter = Math.min(100, actor.superMeter + 35);
    actor.status = 'WIN';

    room.logs.unshift({
      id: `log_${Date.now()}_correct`,
      timestamp: Date.now(),
      text: `🎯 CORRECT! ${actor.name} solved [${currentQ.question} = ${currentQ.answer}] first! (+100 PTS)`,
      type: 'MATH_SOLVED',
      team: actor.team,
    });

    // Advance round or check winner
    if (room.state.currentRound >= room.state.maxRounds) {
      checkGameOver(room);
    } else {
      room.state.currentRound += 1;
      room.state.currentMathQuestion = generateMathQuestion(room.state.currentRound);
      room.logs.unshift({
        id: `log_${Date.now()}_nq`,
        timestamp: Date.now(),
        text: `📝 ROUND ${room.state.currentRound}: Solve [${room.state.currentMathQuestion.question}]`,
        type: 'SYSTEM',
      });
    }

    room.state.lastUpdate = Date.now();
    return { success: true, message: 'Correct answer!', isCorrect: true };
  } else {
    actor.score = Math.max(0, actor.score - 20);
    actor.status = 'HURT';

    room.logs.unshift({
      id: `log_${Date.now()}_wrong`,
      timestamp: Date.now(),
      text: `❌ WRONG! ${actor.name} guessed ${answer} for [${currentQ.question}]! (-20 PTS)`,
      type: 'ACTION',
      team: actor.team,
    });

    room.state.lastUpdate = Date.now();
    return { success: true, message: 'Incorrect answer', isCorrect: false };
  }
}

// Check victory condition
export function checkGameOver(room: Room): boolean {
  if (room.gameMode === 'BOXING') {
    const redSurvivors = room.participants.filter(
      (p) => p.role === 'PLAYER' && p.team === 'RED' && p.hp > 0
    );
    const blueSurvivors = room.participants.filter(
      (p) => p.role === 'PLAYER' && p.team === 'BLUE' && p.hp > 0
    );

    if (redSurvivors.length === 0 && blueSurvivors.length === 0) {
      room.status = 'FINISHED';
      room.state.winner = 'DRAW';
      room.logs.unshift({
        id: `log_${Date.now()}_win`,
        timestamp: Date.now(),
        text: `🏁 MATCH FINISHED: DOUBLE KNOCKOUT! DRAW!`,
        type: 'SYSTEM',
      });
      return true;
    } else if (redSurvivors.length === 0) {
      room.status = 'FINISHED';
      room.state.winner = 'BLUE';
      room.logs.unshift({
        id: `log_${Date.now()}_win`,
        timestamp: Date.now(),
        text: `🏆 MATCH FINISHED: TEAM BLUE IS VICTORIOUS!`,
        type: 'SYSTEM',
        team: 'BLUE',
      });
      return true;
    } else if (blueSurvivors.length === 0) {
      room.status = 'FINISHED';
      room.state.winner = 'RED';
      room.logs.unshift({
        id: `log_${Date.now()}_win`,
        timestamp: Date.now(),
        text: `🏆 MATCH FINISHED: TEAM RED IS VICTORIOUS!`,
        type: 'SYSTEM',
        team: 'RED',
      });
      return true;
    }
  } else if (room.gameMode === 'SPEED_MATH') {
    if (room.state.currentRound >= room.state.maxRounds) {
      room.status = 'FINISHED';
      const redScore = room.participants
        .filter((p) => p.role === 'PLAYER' && p.team === 'RED')
        .reduce((sum, p) => sum + p.score, 0);
      const blueScore = room.participants
        .filter((p) => p.role === 'PLAYER' && p.team === 'BLUE')
        .reduce((sum, p) => sum + p.score, 0);

      if (redScore > blueScore) {
        room.state.winner = 'RED';
      } else if (blueScore > redScore) {
        room.state.winner = 'BLUE';
      } else {
        room.state.winner = 'DRAW';
      }

      room.logs.unshift({
        id: `log_${Date.now()}_win`,
        timestamp: Date.now(),
        text: `🏆 SPEED MATH FINISHED: ${room.state.winner === 'DRAW' ? 'DRAW!' : `TEAM ${room.state.winner} WINS!`}`,
        type: 'SYSTEM',
      });
      return true;
    }
  }

  return false;
}
