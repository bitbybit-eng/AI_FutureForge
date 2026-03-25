/**
 * Readiness Score Calculation Utilities
 */

export function calculateReadinessScore({ age, gpa, skills, habits }) {
  let score = 50; // Base score
  
  // Age factor (optimal age 20-35)
  if (age) {
    if (age >= 18 && age <= 25) score += 10;
    else if (age > 25 && age <= 35) score += 8;
    else if (age > 35 && age <= 45) score += 5;
    else if (age > 45) score += 2;
  }
  
  // GPA factor
  if (gpa) {
    const numericGpa = parseFloat(gpa);
    if (!isNaN(numericGpa)) {
      if (numericGpa >= 90) score += 15;
      else if (numericGpa >= 80) score += 12;
      else if (numericGpa >= 70) score += 8;
      else if (numericGpa >= 60) score += 5;
    }
  }
  
  // Skills factor
  if (skills) {
    const skillList = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    const skillCount = skillList.length;
    
    if (skillCount >= 8) score += 20;
    else if (skillCount >= 5) score += 15;
    else if (skillCount >= 3) score += 10;
    else if (skillCount >= 1) score += 5;
    
    // Bonus for technical skills
    const techSkills = ['programming', 'coding', 'python', 'javascript', 'java', 'data analysis', 
                        'machine learning', 'ai', 'cloud', 'devops', 'sql', 'database'];
    const hasTech = skillList.some(s => 
      techSkills.some(t => s.toLowerCase().includes(t))
    );
    if (hasTech) score += 5;
  }
  
  // Habits factor
  if (habits) {
    const habitLower = habits.toLowerCase();
    
    // Positive habits
    if (habitLower.includes('exercise') || habitLower.includes('gym') || habitLower.includes('workout')) {
      score += 5;
    }
    if (habitLower.includes('study') || habitLower.includes('learn') || habitLower.includes('course')) {
      score += 8;
    }
    if (habitLower.includes('read') || habitLower.includes('book')) {
      score += 5;
    }
    if (habitLower.includes('meditat') || habitLower.includes('mindful')) {
      score += 3;
    }
    if (habitLower.includes('network') || habitLower.includes('meetup')) {
      score += 5;
    }
    
    // Negative habits (subtract points)
    if (habitLower.includes('social media') || habitLower.includes('netflix') || habitLower.includes('gaming')) {
      score -= 5;
    }
  }
  
  // Ensure score is within bounds
  return Math.min(100, Math.max(0, score));
}

export function calculateSuccessProbability(readinessScore, goal = '') {
  const base = 30 + (readinessScore * 0.5);
  
  // Adjust based on goal specificity
  let modifier = 0;
  if (goal && goal.length > 50) modifier += 10; // Specific goals
  if (goal && goal.toLowerCase().includes('senior') || goal.includes('lead')) modifier += 5;
  if (goal && goal.toLowerCase().includes('startup') || goal.toLowerCase().includes('founder')) modifier -= 5;
  
  return Math.min(95, Math.max(10, Math.round(base + modifier)));
}

export function calculateImprovementPotential(readinessScore) {
  if (readinessScore >= 80) return 10;
  if (readinessScore >= 60) return 20;
  if (readinessScore >= 40) return 30;
  return 40;
}

export function estimateTimeToGoal(readinessScore, goalComplexity = 'medium') {
  const baseYears = {
    low: 1,
    medium: 2,
    high: 3,
    very_high: 5
  };
  
  const complexity = goalComplexity || 'medium';
  const base = baseYears[complexity] || 2;
  
  // Higher readiness = faster achievement
  const years = base - (readinessScore / 100) * (base * 0.5);
  
  return {
    current: Math.max(1, Math.ceil(years)),
    optimized: Math.max(1, Math.ceil(years * 0.6)),
    savings: Math.max(0, Math.ceil(years - years * 0.6))
  };
}

export function categorizePersonality({ skills, habits, field }) {
  const skillStr = (skills || '').toLowerCase();
  const habitStr = (habits || '').toLowerCase();
  const fieldStr = (field || '').toLowerCase();
  
  let scores = {
    Builder: 0,
    Analyst: 0,
    Creator: 0,
    Leader: 0,
    Specialist: 0
  };
  
  // Builder indicators
  if (skillStr.includes('entrepreneur') || skillStr.includes('business')) scores.Builder += 3;
  if (habitStr.includes('network') || habitStr.includes('meet')) scores.Builder += 2;
  
  // Analyst indicators
  if (skillStr.includes('data') || skillStr.includes('analysis') || skillStr.includes('research')) scores.Analyst += 3;
  if (fieldStr.includes('science') || fieldStr.includes('research')) scores.Analyst += 2;
  
  // Creator indicators
  if (skillStr.includes('design') || skillStr.includes('creative') || skillStr.includes('art')) scores.Creator += 3;
  if (skillStr.includes('writing') || skillStr.includes('content')) scores.Creator += 2;
  
  // Leader indicators
  if (skillStr.includes('leadership') || skillStr.includes('management') || skillStr.includes('team')) scores.Leader += 3;
  if (habitStr.includes('public') || habitStr.includes('speaking')) scores.Leader += 2;
  
  // Specialist indicators
  if (skillStr.includes('programming') || skillStr.includes('coding') || skillStr.includes('engineering')) scores.Specialist += 3;
  if (fieldStr.includes('engineering') || fieldStr.includes('technical')) scores.Specialist += 2;
  
  // Find highest score
  const maxScore = Math.max(...Object.values(scores));
  const personality = Object.keys(scores).find(k => scores[k] === maxScore) || 'Builder';
  
  return personality;
}

export function identifyStrengths({ skills, habits, gpa }) {
  const strengths = [];
  const skillList = Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim());
  const habitStr = (habits || '').toLowerCase();
  
  // Analyze skills
  const techSkills = ['programming', 'python', 'javascript', 'java', 'data analysis', 'machine learning', 'sql'];
  const hasTech = skillList.some(s => techSkills.some(t => s.toLowerCase().includes(t)));
  if (hasTech) strengths.push('Strong technical foundation');
  
  if (skillList.length >= 5) strengths.push('Diverse skill set');
  
  // Analyze habits
  if (habitStr.includes('exercise') || habitStr.includes('gym')) strengths.push('Physical wellness practice');
  if (habitStr.includes('study') || habitStr.includes('learn')) strengths.push('Continuous learning mindset');
  if (habitStr.includes('read')) strengths.push('Knowledge consumption habit');
  
  // Analyze academics
  if (gpa) {
    const numericGpa = parseFloat(gpa);
    if (!isNaN(numericGpa) && numericGpa >= 80) strengths.push('Strong academic performance');
  }
  
  return strengths.length > 0 ? strengths : ['Good starting foundation'];
}

export function identifyRisks({ skills, habits, field }) {
  const risks = [];
  const skillList = Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim());
  const habitStr = (habits || '').toLowerCase();
  
  // Missing skills analysis
  if (skillList.length < 3) risks.push('Limited skills inventory');
  
  const softSkills = ['communication', 'leadership', 'teamwork', 'presentation'];
  const hasSoft = skillList.some(s => softSkills.some(t => s.toLowerCase().includes(t)));
  if (!hasSoft) risks.push('Limited soft skills');
  
  // Habit risks
  if (habitStr.includes('social media')) risks.push('Distraction from social media');
  if (!habitStr.includes('exercise') && !habitStr.includes('gym')) risks.push('No regular exercise routine');
  if (!habitStr.includes('study') && !habitStr.includes('learn')) risks.push('No structured learning time');
  
  // Network risk
  if (!habitStr.includes('network')) risks.push('Limited professional networking');
  
  return risks.length > 0 ? risks : ['General market competition'];
}
