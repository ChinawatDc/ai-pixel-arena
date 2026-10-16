#!/usr/bin/env node

/**
 * AI Agent Simulator Script
 * Usage: node scripts/simulate-agent.mjs <ROOM_CODE> <TEAM: RED|BLUE> <AGENT_NAME>
 * Example: node scripts/simulate-agent.mjs ARENA-1234 RED "DeepJab AI"
 */

const args = process.argv.slice(2);
const roomCode = args[0] || 'ARENA-TEST';
const team = args[1] || 'RED';
const agentName = args[2] || `Fighter-${Math.floor(Math.random() * 1000)}`;
const baseUrl = process.env.ARENA_URL || 'http://localhost:3000';

async function main() {
  console.log(`🤖 Starting AI Agent Simulator for [${agentName}]...`);
  console.log(`Connecting to ${baseUrl} Room: ${roomCode} | Team: ${team}`);

  // 1. Join room
  const joinRes = await fetch(`${baseUrl}/api/rooms/${roomCode}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: agentName,
      team,
      role: 'PLAYER',
      avatar: team === 'RED' ? 'boxer_red' : 'boxer_blue',
    }),
  });

  const joinData = await joinRes.json();
  if (!joinData.success) {
    console.error('❌ Failed to join room:', joinData.error);
    process.exit(1);
  }

  const participantId = joinData.participantId;
  console.log(`✅ Joined successfully! Participant ID: ${participantId}`);
  console.log(`Waiting for game loop...`);

  // 2. Game loop
  setInterval(async () => {
    try {
      const stateRes = await fetch(`${baseUrl}/api/rooms/${roomCode}`);
      const stateData = await stateRes.json();
      if (!stateData.success || !stateData.room) return;

      const room = stateData.room;
      if (room.status !== 'IN_PROGRESS') {
        if (room.status === 'FINISHED') {
          console.log(`🏆 Match Finished! Winner: Team ${room.state.winner}`);
          process.exit(0);
        }
        return;
      }

      if (room.gameMode === 'BOXING') {
        if (room.state.activeTeamTurn === team) {
          const actions = ['JAB', 'UPPERCUT', 'GUARD', 'DODGE'];
          const myParticipant = room.participants.find((p) => p.id === participantId);
          let chosenAction = actions[Math.floor(Math.random() * actions.length)];
          if (myParticipant && myParticipant.superMeter >= 100) {
            chosenAction = 'SPECIAL';
          }

          console.log(`🥊 It's my turn! Executing action: ${chosenAction}`);
          await fetch(`${baseUrl}/api/rooms/${roomCode}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              participantId,
              action: chosenAction,
              trashTalk: 'Calculated trajectory strike!',
            }),
          });
        }
      } else if (room.gameMode === 'SPEED_MATH') {
        const q = room.state.currentMathQuestion;
        if (q) {
          console.log(`🧮 Solving math: ${q.question}`);
          await fetch(`${baseUrl}/api/rooms/${roomCode}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              participantId,
              answer: q.answer,
              trashTalk: `Solved ${q.question} instantly!`,
            }),
          });
        }
      }
    } catch (err) {
      console.error('Error in agent loop:', err.message);
    }
  }, 2000);
}

main().catch(console.error);
