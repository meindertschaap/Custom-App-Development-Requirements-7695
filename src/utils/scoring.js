// AI scoring algorithm for Child-Apply micro-planner
export function scoreInitiative(initiative, context) {
  const { challenges, joys, closeness, dream, age } = context;
  const closenessBand = closeness < 25 ? 1 : closeness < 50 ? 2 : closeness < 75 ? 3 : 4;
  const meta = initiative.meta || { tags: [] };
  
  let score = 0;
  
  // Challenge matching (high priority)
  const challengeMatches = meta.tags.filter(tag => challenges.includes(tag)).length;
  score += challengeMatches * 2;
  
  // Joy matching (medium priority)
  const joyMatches = meta.tags.filter(tag => joys.includes(tag)).length;
  score += joyMatches * 1.5;
  
  // Closeness compatibility
  const requiredCloseness = meta.closenessMin || 1;
  if (requiredCloseness > closenessBand) {
    score -= (requiredCloseness - closenessBand) * 2;
  } else {
    score += 0.5; // Bonus for being within comfort zone
  }
  
  // Time penalty (prefer quick wins early)
  if (meta.estEffortMins) {
    score -= meta.estEffortMins / 120; // Small penalty per 2 hours
  }
  
  // Age appropriateness
  const ageTag = `Age:${getAgeGroup(age)}`;
  if (meta.tags.includes(ageTag)) {
    score += 1;
  }
  
  // Dream text similarity (basic keyword matching)
  if (dream) {
    const dreamWords = dream.toLowerCase().split(' ');
    const titleWords = initiative.title.toLowerCase().split(' ');
    const matches = dreamWords.filter(word => 
      titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
    ).length;
    score += matches * 0.3;
  }
  
  return Math.max(0, score);
}

function getAgeGroup(age) {
  if (age < 10) return "Under10";
  if (age <= 12) return "10-12";
  if (age <= 15) return "13-15";
  return "16+";
}

export function generateMicroPlan(initiatives, context, targetCount = 10) {
  // Score all initiatives
  const scoredInitiatives = initiatives.map(initiative => ({
    ...initiative,
    score: scoreInitiative(initiative, context),
    reasons: generateReasons(initiative, context)
  }));
  
  // Sort by score
  scoredInitiatives.sort((a, b) => b.score - a.score);
  
  // Apply diversity guardrail - ensure variety across different tasks
  const selected = [];
  const usedTasks = new Set();
  
  // First pass - select highest scoring from each task
  for (const initiative of scoredInitiatives) {
    if (selected.length >= targetCount) break;
    if (!usedTasks.has(initiative.taskId)) {
      selected.push(initiative);
      usedTasks.add(initiative.taskId);
    }
  }
  
  // Second pass - fill remaining slots with best remaining
  for (const initiative of scoredInitiatives) {
    if (selected.length >= targetCount) break;
    if (!selected.find(s => s.id === initiative.id)) {
      selected.push(initiative);
    }
  }
  
  // Assign days (1-14) based on effort and closeness requirements
  return selected.slice(0, targetCount).map((initiative, index) => {
    const isQuickWin = (initiative.meta?.estEffortMins || 0) < 30;
    const needsHighCloseness = (initiative.meta?.closenessMin || 1) > 3;
    
    let day;
    if (isQuickWin) {
      day = Math.min(4, index + 1); // Quick wins in first 4 days
    } else if (needsHighCloseness) {
      day = Math.max(8, Math.min(14, index + 5)); // High closeness items later
    } else {
      day = Math.min(14, index + 3); // Medium items in middle
    }
    
    return {
      ...initiative,
      day,
      completed: false
    };
  }).sort((a, b) => a.day - b.day);
}

function generateReasons(initiative, context) {
  const reasons = [];
  const meta = initiative.meta || { tags: [] };
  
  // Joy matches
  const joyMatches = meta.tags.filter(tag => context.joys.includes(tag));
  joyMatches.forEach(joy => {
    const emoji = getJoyEmoji(joy);
    reasons.push(`${emoji} child enjoys ${joy.toLowerCase()}`);
  });
  
  // Challenge addresses
  const challengeMatches = meta.tags.filter(tag => context.challenges.includes(tag));
  challengeMatches.forEach(challenge => {
    reasons.push(`🚩 addresses ${challenge.toLowerCase()} concerns`);
  });
  
  // Closeness fit
  const closenessBand = context.closeness < 25 ? 1 : context.closeness < 50 ? 2 : context.closeness < 75 ? 3 : 4;
  const requiredCloseness = meta.closenessMin || 1;
  if (requiredCloseness <= closenessBand) {
    reasons.push("🤝 fits current relationship level");
  }
  
  // Quick win
  if ((meta.estEffortMins || 0) < 30) {
    reasons.push("⚡ quick win");
  }
  
  return reasons;
}

function getJoyEmoji(joy) {
  const emojiMap = {
    Football: "⚽",
    Art: "🎨",
    Music: "🎵",
    Animals: "🐕",
    Games: "🎮"
  };
  return emojiMap[joy] || "✨";
}