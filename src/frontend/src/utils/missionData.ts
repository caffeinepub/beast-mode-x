import { getDateString, getMonthString, getWeekString } from "./gameUtils";

export type MissionTier = "daily" | "weekly" | "monthly";

export interface MissionDef {
  id: string;
  name: string;
  desc: string;
  xp: number;
  category: string;
  tier: MissionTier;
  haspenalty?: boolean;
}

// Level brackets
type Bracket = "beginner" | "intermediate" | "advanced" | "elite";

function getBracket(level: number): Bracket {
  if (level <= 10) return "beginner";
  if (level <= 30) return "intermediate";
  if (level <= 60) return "advanced";
  return "elite";
}

// ─── KIRA missions (fitness) ─────────────────────────────────────
const KIRA_DAILY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "10 Push-ups",
      desc: "Start your fitness journey, one rep at a time.",
      xp: 50,
    },
    {
      name: "10 Squats",
      desc: "Build your foundation. Legs carry everything.",
      xp: 50,
    },
    { name: "30s Plank", desc: "Core activation. Hold and breathe.", xp: 40 },
    { name: "15 Crunches", desc: "Ab work to ignite your core.", xp: 45 },
    { name: "5 Burpees", desc: "Full body activation. Push through.", xp: 60 },
  ],
  intermediate: [
    {
      name: "30 Push-ups",
      desc: "No stopping. Perfect form every rep.",
      xp: 150,
    },
    { name: "30 Squats", desc: "Deep and explosive. Own each rep.", xp: 150 },
    {
      name: "2min Plank",
      desc: "Stay rigid. No sagging. Feel the fire.",
      xp: 130,
    },
    { name: "50 Crunches", desc: "Full crunch, full contraction.", xp: 140 },
    {
      name: "15 Burpees",
      desc: "Push through the burn. Warrior pace.",
      xp: 170,
    },
  ],
  advanced: [
    {
      name: "80 Push-ups",
      desc: "Three sets, maximum power per rep.",
      xp: 300,
    },
    { name: "80 Squats", desc: "Full depth, explosive drive up.", xp: 300 },
    { name: "5min Plank", desc: "Iron core. Will over comfort.", xp: 280 },
    {
      name: "100 Crunches",
      desc: "No breaks allowed. Earn every rep.",
      xp: 290,
    },
    {
      name: "30 Burpees",
      desc: "Relentless pace. Champion standard.",
      xp: 320,
    },
  ],
  elite: [
    { name: "200 Push-ups", desc: "Elite territory. Break limits.", xp: 600 },
    { name: "150 Squats", desc: "Legs of steel. No excuses.", xp: 580 },
    { name: "10min Plank", desc: "The wall is the goal. Crush it.", xp: 560 },
    { name: "200 Crunches", desc: "Every crunch is a statement.", xp: 570 },
    { name: "50 Burpees", desc: "Superhuman endurance unlocked.", xp: 620 },
  ],
};

const KIRA_WEEKLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "3-day workout streak",
      desc: "Three consistent training days this week.",
      xp: 200,
    },
    {
      name: "Run 5km total",
      desc: "Accumulate 5km in runs across the week.",
      xp: 250,
    },
    {
      name: "Daily missions x3",
      desc: "Complete all KIRA daily missions 3 times.",
      xp: 300,
    },
  ],
  intermediate: [
    {
      name: "5-day workout streak",
      desc: "Five powerful training days this week.",
      xp: 500,
    },
    {
      name: "Run 15km total",
      desc: "15km of running distributed across the week.",
      xp: 550,
    },
    {
      name: "Daily missions x5",
      desc: "Complete all KIRA daily missions 5 days.",
      xp: 600,
    },
  ],
  advanced: [
    {
      name: "6-day workout week",
      desc: "Six days of disciplined training.",
      xp: 900,
    },
    { name: "Run 30km total", desc: "30km of running this week.", xp: 950 },
    {
      name: "Full week daily missions",
      desc: "Complete all KIRA daily missions every day.",
      xp: 1000,
    },
  ],
  elite: [
    {
      name: "7-day beast week",
      desc: "Seven days of elite training. No days off.",
      xp: 1500,
    },
    {
      name: "Run 50km total",
      desc: "50km of running this week. Elite level.",
      xp: 1600,
    },
    {
      name: "Weekly volume record",
      desc: "Beat your personal best total rep count.",
      xp: 1700,
    },
  ],
};

const KIRA_MONTHLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "500 total push-ups",
      desc: "Accumulate 500 push-ups this month.",
      xp: 800,
    },
    {
      name: "10 days no junk food",
      desc: "Ten clean eating days this month.",
      xp: 900,
    },
    {
      name: "Run 30km total",
      desc: "30km of running throughout the month.",
      xp: 850,
    },
  ],
  intermediate: [
    {
      name: "1000 total push-ups",
      desc: "1000 push-ups total. The warrior standard.",
      xp: 1500,
    },
    {
      name: "20 days clean eating",
      desc: "Twenty days of disciplined nutrition.",
      xp: 1600,
    },
    { name: "Run 60km total", desc: "60km running over the month.", xp: 1550 },
  ],
  advanced: [
    {
      name: "3000 total push-ups",
      desc: "3000 push-ups. Serious commitment.",
      xp: 2500,
    },
    {
      name: "25 days clean eating",
      desc: "25 days of perfect nutrition.",
      xp: 2600,
    },
    {
      name: "Run 100km total",
      desc: "100km of running. Advanced standard.",
      xp: 2550,
    },
  ],
  elite: [
    {
      name: "Half-marathon equivalent",
      desc: "21km in a single run. Epic feat.",
      xp: 4000,
    },
    {
      name: "30 days no junk food",
      desc: "Full month of elite nutrition.",
      xp: 4200,
    },
    {
      name: "10,000 total push-ups",
      desc: "10,000 push-ups. Legendary.",
      xp: 4500,
    },
  ],
};

// ─── RYU missions (martial) ─────────────────────────────────────
const RYU_DAILY: Record<Bracket, { name: string; desc: string; xp: number }[]> =
  {
    beginner: [
      {
        name: "20 basic strikes",
        desc: "Learn the fundamentals. Form over speed.",
        xp: 55,
      },
      {
        name: "Shadow boxing 5min",
        desc: "Visualize your opponent. Move with intent.",
        xp: 60,
      },
      {
        name: "Kata practice 1 round",
        desc: "One full kata sequence. Focus on flow.",
        xp: 65,
      },
      { name: "10 kicks", desc: "5 each leg. Power from the hip.", xp: 50 },
      {
        name: "Stance training 3min",
        desc: "Hold your fighting stance. Stability first.",
        xp: 50,
      },
    ],
    intermediate: [
      {
        name: "50 basic strikes",
        desc: "Speed and precision. No wasted motion.",
        xp: 160,
      },
      {
        name: "Shadow boxing 10min",
        desc: "Full intensity. Move like a fighter.",
        xp: 170,
      },
      {
        name: "Kata practice 2 rounds",
        desc: "Two complete katas. Perfect transitions.",
        xp: 175,
      },
      {
        name: "30 kicks",
        desc: "15 each leg. Explosive hip rotation.",
        xp: 155,
      },
      {
        name: "Stance training 8min",
        desc: "Deep stance. Iron legs.",
        xp: 150,
      },
    ],
    advanced: [
      {
        name: "100 basic strikes",
        desc: "Maximum speed, maximum power.",
        xp: 320,
      },
      {
        name: "Shadow boxing 20min",
        desc: "Full combat simulation. Leave nothing back.",
        xp: 330,
      },
      {
        name: "Kata practice 3 rounds",
        desc: "Three katas with perfect form.",
        xp: 340,
      },
      { name: "60 kicks", desc: "30 each leg. Warrior's power.", xp: 310 },
      {
        name: "Stance training 15min",
        desc: "Advanced stance holds. Unbreakable base.",
        xp: 305,
      },
    ],
    elite: [
      {
        name: "200 strikes at speed",
        desc: "Elite striking speed. No compromise.",
        xp: 650,
      },
      {
        name: "Shadow boxing 30min",
        desc: "30 minutes of elite combat flow.",
        xp: 680,
      },
      {
        name: "Kata practice 5 rounds",
        desc: "Five perfect katas. Master standard.",
        xp: 700,
      },
      {
        name: "100 kicks",
        desc: "50 each leg. Elite power generation.",
        xp: 640,
      },
      {
        name: "Stance training 25min",
        desc: "Extreme endurance. Iron will.",
        xp: 630,
      },
    ],
  };

const RYU_WEEKLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "3 martial arts sessions",
      desc: "Three dedicated training sessions.",
      xp: 250,
    },
    {
      name: "Learn 1 new combo",
      desc: "Master a new combination this week.",
      xp: 300,
    },
    {
      name: "Train 3 days with heart",
      desc: "Three sessions with real intensity.",
      xp: 280,
    },
  ],
  intermediate: [
    {
      name: "4 martial arts sessions",
      desc: "Four sessions, increasing intensity.",
      xp: 550,
    },
    {
      name: "Master 2 new combos",
      desc: "Two new combinations added to your arsenal.",
      xp: 600,
    },
    {
      name: "Train 4 days with power",
      desc: "Four days of full-power training.",
      xp: 580,
    },
  ],
  advanced: [
    {
      name: "5 martial arts sessions",
      desc: "Five sessions. Advanced frequency.",
      xp: 950,
    },
    {
      name: "Master complex combo",
      desc: "A 6+ move combination perfected.",
      xp: 1000,
    },
    {
      name: "Train 5 days at 100%",
      desc: "Five days of absolute maximum effort.",
      xp: 980,
    },
  ],
  elite: [
    {
      name: "6 sessions + sparring",
      desc: "Six sessions including live sparring.",
      xp: 1700,
    },
    {
      name: "Develop original combo",
      desc: "Create and master your signature combination.",
      xp: 1800,
    },
    {
      name: "Daily training all week",
      desc: "Seven consecutive training days.",
      xp: 1750,
    },
  ],
};

const RYU_MONTHLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "10 training sessions",
      desc: "Ten dedicated martial arts sessions.",
      xp: 900,
    },
    {
      name: "Learn basic kata",
      desc: "Complete a full kata from memory.",
      xp: 950,
    },
    {
      name: "30 combat drills",
      desc: "30 drilling sessions total this month.",
      xp: 880,
    },
  ],
  intermediate: [
    {
      name: "Full kata sequence",
      desc: "Master the complete kata sequence.",
      xp: 1700,
    },
    {
      name: "100 combat drills",
      desc: "100 drilling sessions. Serious volume.",
      xp: 1750,
    },
    {
      name: "Sparring sessions x4",
      desc: "Four sparring rounds this month.",
      xp: 1650,
    },
  ],
  advanced: [
    {
      name: "Advanced kata mastery",
      desc: "Master advanced kata with perfect form.",
      xp: 2700,
    },
    {
      name: "500 combat drills",
      desc: "500 drilling sessions. Advanced volume.",
      xp: 2800,
    },
    {
      name: "Perfect form certification",
      desc: "Demonstrate flawless technique.",
      xp: 2750,
    },
  ],
  elite: [
    {
      name: "Create personal kata",
      desc: "Compose and perform your own kata.",
      xp: 4500,
    },
    {
      name: "1000 combat drills",
      desc: "1000 drilling sessions. Legendary volume.",
      xp: 4800,
    },
    {
      name: "Elite sparring month",
      desc: "Daily sparring practice for the month.",
      xp: 4600,
    },
  ],
};

// ─── NOVA missions (intelligence) ───────────────────────────────
const NOVA_DAILY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "Read 10 pages",
      desc: "Absorb ideas. Let knowledge compound.",
      xp: 50,
    },
    {
      name: "Learn 5 vocabulary words",
      desc: "5 new words with definitions and usage.",
      xp: 45,
    },
    {
      name: "Solve 3 puzzles",
      desc: "Logic and pattern recognition training.",
      xp: 55,
    },
    {
      name: "Write journal entry",
      desc: "Reflection turns experience into wisdom.",
      xp: 50,
    },
    {
      name: "Learn 1 concept",
      desc: "Pick one concept and truly understand it.",
      xp: 60,
    },
  ],
  intermediate: [
    {
      name: "Read 20 pages",
      desc: "Deep reading. No skimming, full absorption.",
      xp: 130,
    },
    {
      name: "Learn 10 vocabulary words",
      desc: "10 high-level words mastered fully.",
      xp: 120,
    },
    {
      name: "Solve 5 puzzles",
      desc: "Challenge your analytical mind.",
      xp: 140,
    },
    {
      name: "Detailed journal entry",
      desc: "Structured reflection with key insights.",
      xp: 125,
    },
    {
      name: "Study 1 hour focused",
      desc: "60 minutes of deep, focused learning.",
      xp: 150,
    },
  ],
  advanced: [
    {
      name: "Read 40 pages",
      desc: "Advanced reading speed and retention.",
      xp: 280,
    },
    {
      name: "Learn 20 vocabulary words",
      desc: "Academic-level vocabulary expansion.",
      xp: 270,
    },
    {
      name: "Solve 10 puzzles",
      desc: "Complex multi-step problem solving.",
      xp: 300,
    },
    {
      name: "Research and write essay",
      desc: "Short research piece on any topic.",
      xp: 290,
    },
    {
      name: "Study 2 hours + notes",
      desc: "Two hours of structured learning.",
      xp: 310,
    },
  ],
  elite: [
    {
      name: "Read 60 pages",
      desc: "Elite reading stamina and comprehension.",
      xp: 580,
    },
    {
      name: "Learn 30 vocabulary words",
      desc: "Expert-level vocabulary daily.",
      xp: 560,
    },
    {
      name: "Solve 15 advanced puzzles",
      desc: "Elite-tier problem solving.",
      xp: 600,
    },
    {
      name: "Write research analysis",
      desc: "In-depth analysis with citations.",
      xp: 590,
    },
    {
      name: "Study 4 hours elite focus",
      desc: "Four hours of elite concentration.",
      xp: 620,
    },
  ],
};

const NOVA_WEEKLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "Finish a book chapter",
      desc: "Complete one full chapter this week.",
      xp: 250,
    },
    {
      name: "Study 5 hours total",
      desc: "Five accumulated study hours.",
      xp: 280,
    },
    {
      name: "Teach someone something",
      desc: "Teaching is the ultimate test of knowledge.",
      xp: 300,
    },
  ],
  intermediate: [
    {
      name: "Finish a book section",
      desc: "Complete a major section of your book.",
      xp: 550,
    },
    {
      name: "Study 10 hours total",
      desc: "Ten productive study hours.",
      xp: 580,
    },
    {
      name: "Create a learning summary",
      desc: "Summarize and review all week's learning.",
      xp: 560,
    },
  ],
  advanced: [
    {
      name: "Write detailed book notes",
      desc: "Full notes on completed reading.",
      xp: 980,
    },
    {
      name: "Study 20 hours total",
      desc: "Twenty focused hours of learning.",
      xp: 1000,
    },
    {
      name: "Master one skill",
      desc: "Go from novice to proficient in one skill.",
      xp: 1020,
    },
  ],
  elite: [
    {
      name: "Finish a full book",
      desc: "Complete an entire book this week.",
      xp: 1800,
    },
    {
      name: "Study 35 hours total",
      desc: "35 hours. Elite scholar standard.",
      xp: 1900,
    },
    {
      name: "Teach a full lesson",
      desc: "Teach someone an entire subject area.",
      xp: 1850,
    },
  ],
};

const NOVA_MONTHLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "Read 1 full book",
      desc: "Complete an entire book this month.",
      xp: 1000,
    },
    {
      name: "Online course module",
      desc: "Complete one module of an online course.",
      xp: 950,
    },
    { name: "50 hours studying", desc: "50 cumulative study hours.", xp: 900 },
  ],
  intermediate: [
    {
      name: "Read 2 full books",
      desc: "Two complete books this month.",
      xp: 1800,
    },
    {
      name: "Online course completed",
      desc: "Finish an entire online course.",
      xp: 1900,
    },
    {
      name: "Master new skill",
      desc: "Demonstrate measurable skill acquisition.",
      xp: 1850,
    },
  ],
  advanced: [
    {
      name: "Read 3 full books",
      desc: "Three books at advanced reading pace.",
      xp: 2800,
    },
    {
      name: "Full certification earned",
      desc: "Complete a professional certification.",
      xp: 3000,
    },
    {
      name: "Write your own guide",
      desc: "Create a detailed guide on a topic you mastered.",
      xp: 2900,
    },
  ],
  elite: [
    {
      name: "Read 5 books + summaries",
      desc: "5 books with detailed summaries.",
      xp: 5000,
    },
    {
      name: "Teach a complete course",
      desc: "Design and teach an entire course.",
      xp: 5200,
    },
    {
      name: "Elite research project",
      desc: "Complete a serious research project.",
      xp: 5100,
    },
  ],
};

// ─── ZEN missions (focus) ────────────────────────────────────────
const ZEN_DAILY: Record<Bracket, { name: string; desc: string; xp: number }[]> =
  {
    beginner: [
      {
        name: "Meditate 5min",
        desc: "Sit, breathe, and let thoughts pass.",
        xp: 50,
      },
      {
        name: "No phone 30min",
        desc: "Thirty minutes of intentional disconnection.",
        xp: 55,
      },
      {
        name: "Breathing 5min",
        desc: "Box breathing: 4-4-4-4 pattern.",
        xp: 45,
      },
      {
        name: "Gratitude list",
        desc: "Write 3 things you're genuinely grateful for.",
        xp: 50,
      },
      {
        name: "15min deep focus work",
        desc: "Single-task work. Zero distractions.",
        xp: 60,
      },
    ],
    intermediate: [
      {
        name: "Meditate 15min",
        desc: "Silence. Breathe. Let all thoughts pass.",
        xp: 130,
      },
      {
        name: "No phone 2 hours",
        desc: "Two hours. Reclaim your attention.",
        xp: 140,
      },
      {
        name: "Breathing 10min",
        desc: "Extended breathing practice for calm.",
        xp: 120,
      },
      {
        name: "Gratitude journal 5 items",
        desc: "Five specific, heartfelt gratitude entries.",
        xp: 125,
      },
      {
        name: "1hr deep focus work",
        desc: "One hour of single-task deep work.",
        xp: 145,
      },
    ],
    advanced: [
      {
        name: "Meditate 30min",
        desc: "Extended practice for deeper stillness.",
        xp: 280,
      },
      {
        name: "No phone 4 hours",
        desc: "Four hours of undivided presence.",
        xp: 300,
      },
      {
        name: "Breathing 20min",
        desc: "Advanced breathwork with varied patterns.",
        xp: 270,
      },
      {
        name: "Deep journaling session",
        desc: "30+ minutes of introspective writing.",
        xp: 285,
      },
      {
        name: "2hr deep focus block",
        desc: "Two uninterrupted hours of deep work.",
        xp: 310,
      },
    ],
    elite: [
      {
        name: "Meditate 60min",
        desc: "Elite-level stillness. An hour of pure presence.",
        xp: 600,
      },
      {
        name: "No phone 8 hours",
        desc: "Eight hours. Extreme digital detox.",
        xp: 650,
      },
      { name: "Breathing 30min", desc: "Master breathwork session.", xp: 580 },
      {
        name: "Full mindfulness day",
        desc: "Practice awareness in every activity.",
        xp: 620,
      },
      {
        name: "4hr deep focus elite",
        desc: "Four hours of elite single-task mastery.",
        xp: 640,
      },
    ],
  };

const ZEN_WEEKLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "3-day meditation streak",
      desc: "Three consecutive days of meditation.",
      xp: 250,
    },
    {
      name: "Digital detox half-day",
      desc: "4 hours without any screen.",
      xp: 280,
    },
    {
      name: "Breathing practice x3",
      desc: "Three breathing sessions this week.",
      xp: 260,
    },
  ],
  intermediate: [
    {
      name: "5-day meditation streak",
      desc: "Five consecutive days of meditation.",
      xp: 550,
    },
    {
      name: "Digital detox full day",
      desc: "One full day without screens.",
      xp: 600,
    },
    {
      name: "Master breathing technique",
      desc: "Perfect the Wim Hof or box breathing.",
      xp: 580,
    },
  ],
  advanced: [
    {
      name: "7-day meditation streak",
      desc: "Full week of daily meditation.",
      xp: 1000,
    },
    {
      name: "Two digital detox days",
      desc: "Two full screen-free days this week.",
      xp: 1050,
    },
    {
      name: "Advanced mindfulness week",
      desc: "Mindfulness in all daily activities.",
      xp: 1020,
    },
  ],
  elite: [
    {
      name: "Full week of silence",
      desc: "Daily meditation every day, minimum 30 minutes.",
      xp: 1800,
    },
    {
      name: "No social media week",
      desc: "Seven days without social media.",
      xp: 1900,
    },
    {
      name: "Deep work 25hr week",
      desc: "25 hours of focused, deep work.",
      xp: 1850,
    },
  ],
};

const ZEN_MONTHLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "15-day meditation streak",
      desc: "15 consecutive meditation days.",
      xp: 1000,
    },
    {
      name: "No phone before 9am month",
      desc: "Start every morning phone-free.",
      xp: 950,
    },
    {
      name: "Gratitude journal 20 days",
      desc: "20 days of consistent gratitude writing.",
      xp: 900,
    },
  ],
  intermediate: [
    {
      name: "21-day meditation streak",
      desc: "21 consecutive days. Habit formed.",
      xp: 1800,
    },
    {
      name: "Complete mental clarity program",
      desc: "Finish a mindfulness program.",
      xp: 1900,
    },
    {
      name: "Zero distraction month",
      desc: "No social media the entire month.",
      xp: 1850,
    },
  ],
  advanced: [
    {
      name: "30-day meditation streak",
      desc: "30 consecutive days. Pure dedication.",
      xp: 2800,
    },
    {
      name: "Mindset transformation",
      desc: "Document a measurable mindset shift.",
      xp: 3000,
    },
    {
      name: "Digital minimalism month",
      desc: "Extreme reduction of all screen time.",
      xp: 2900,
    },
  ],
  elite: [
    {
      name: "30-day extreme mindfulness",
      desc: "Every moment practiced with awareness.",
      xp: 5000,
    },
    {
      name: "Monk protocol month",
      desc: "No social media, no entertainment, only growth.",
      xp: 5500,
    },
    {
      name: "Complete inner peace month",
      desc: "Zero anger, zero complaints all month.",
      xp: 5200,
    },
  ],
};

// ─── VEGA missions (discipline) ─────────────────────────────────
const VEGA_DAILY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    { name: "Wake at 6am", desc: "Own the morning. Own the day.", xp: 70 },
    {
      name: "No junk food today",
      desc: "Fuel your body like the machine it is.",
      xp: 65,
    },
    { name: "Complete all tasks", desc: "Zero procrastination today.", xp: 80 },
    {
      name: "Sleep by 11pm",
      desc: "Recovery is part of the discipline.",
      xp: 60,
    },
    {
      name: "Cold shower",
      desc: "End with cold water. Discipline your mind.",
      xp: 75,
    },
  ],
  intermediate: [
    {
      name: "Wake at 5:30am",
      desc: "Earlier rise, more time for greatness.",
      xp: 160,
    },
    {
      name: "Strict clean diet",
      desc: "No processed food, no exceptions.",
      xp: 155,
    },
    {
      name: "Complete all tasks + 1 extra",
      desc: "Do more than planned. Always.",
      xp: 180,
    },
    { name: "Sleep by 10:30pm", desc: "Elite recovery schedule.", xp: 150 },
    { name: "2min cold shower", desc: "Two full minutes. Ice cold.", xp: 165 },
  ],
  advanced: [
    { name: "Wake at 5am", desc: "5am. When legends rise.", xp: 300 },
    {
      name: "Keto/clean eating strict",
      desc: "Maximum performance nutrition.",
      xp: 295,
    },
    {
      name: "Complete task list + review",
      desc: "All tasks done and reviewed for tomorrow.",
      xp: 320,
    },
    { name: "Sleep by 10pm", desc: "Maximum recovery protocol.", xp: 285 },
    {
      name: "5min cold shower",
      desc: "Five minutes. Advanced cold exposure.",
      xp: 310,
    },
  ],
  elite: [
    { name: "Wake at 4:30am", desc: "4:30am. The elite hour.", xp: 620 },
    {
      name: "Perfect elite diet",
      desc: "Every meal optimized for performance.",
      xp: 610,
    },
    {
      name: "All tasks + future planning",
      desc: "Complete today and set up tomorrow.",
      xp: 650,
    },
    { name: "Sleep at 9:30pm", desc: "Elite circadian optimization.", xp: 600 },
    {
      name: "10min cold plunge",
      desc: "10 minutes in cold. Mental steel.",
      xp: 640,
    },
  ],
};

const VEGA_WEEKLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "Perfect sleep schedule",
      desc: "Same wake/sleep time all week.",
      xp: 280,
    },
    {
      name: "No sugar 5 days",
      desc: "Five days without refined sugar.",
      xp: 300,
    },
    {
      name: "Complete 20 tasks",
      desc: "20 completed tasks total this week.",
      xp: 270,
    },
  ],
  intermediate: [
    {
      name: "Perfect sleep 6 days",
      desc: "Six days of consistent sleep schedule.",
      xp: 580,
    },
    {
      name: "No sugar full week",
      desc: "Seven days no sugar. Iron discipline.",
      xp: 620,
    },
    {
      name: "Complete 40 tasks",
      desc: "40 completed tasks. Productive warrior.",
      xp: 600,
    },
  ],
  advanced: [
    {
      name: "Early riser 7 days",
      desc: "7 consecutive 5am wake-ups.",
      xp: 1000,
    },
    {
      name: "Perfect clean eating week",
      desc: "7 days of zero cheat meals.",
      xp: 1050,
    },
    {
      name: "Complete 60 tasks + review",
      desc: "60 tasks completed with end-of-week review.",
      xp: 1020,
    },
  ],
  elite: [
    {
      name: "Week of elite discipline",
      desc: "Every habit perfect, every day.",
      xp: 1800,
    },
    {
      name: "Zero vice week",
      desc: "No sugar, no junk, no laziness all week.",
      xp: 1900,
    },
    {
      name: "80 tasks + planning system",
      desc: "80 tasks with system improvements.",
      xp: 1850,
    },
  ],
};

const VEGA_MONTHLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "15 days early rise",
      desc: "15 days waking before alarm.",
      xp: 1000,
    },
    { name: "20 days no junk food", desc: "20 clean eating days.", xp: 950 },
    {
      name: "Build one daily habit",
      desc: "Establish one new lasting habit.",
      xp: 900,
    },
  ],
  intermediate: [
    {
      name: "25 days early rise",
      desc: "25 days of disciplined mornings.",
      xp: 1800,
    },
    {
      name: "No social media month",
      desc: "Zero social media for 30 days.",
      xp: 1900,
    },
    {
      name: "Iron will challenge",
      desc: "Complete the full 30-day discipline protocol.",
      xp: 1850,
    },
  ],
  advanced: [
    {
      name: "Perfect discipline month",
      desc: "30 days with every habit completed.",
      xp: 3000,
    },
    {
      name: "Eliminate one major vice",
      desc: "Remove one significant bad habit permanently.",
      xp: 3200,
    },
    {
      name: "Build 3 elite habits",
      desc: "Three new elite-level daily habits.",
      xp: 3100,
    },
  ],
  elite: [
    {
      name: "Monk mode month",
      desc: "30 days of absolute maximum discipline.",
      xp: 5500,
    },
    {
      name: "Zero bad days month",
      desc: "Not a single compromised day.",
      xp: 5800,
    },
    {
      name: "Discipline transformation",
      desc: "Document proof of fundamental change.",
      xp: 5600,
    },
  ],
};

// ─── APEX missions (mindset) ─────────────────────────────────────
const APEX_DAILY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "Visualize goals 5min",
      desc: "See your success in vivid detail.",
      xp: 55,
    },
    {
      name: "Daily affirmations x5",
      desc: "Speak your future into existence.",
      xp: 50,
    },
    {
      name: "Face one small fear",
      desc: "Do something that makes you uncomfortable.",
      xp: 70,
    },
    { name: "Help someone today", desc: "Give without expectation.", xp: 60 },
    { name: "Review progress", desc: "Track your wins and lessons.", xp: 50 },
  ],
  intermediate: [
    {
      name: "Visualize goals 10min",
      desc: "Vivid mental rehearsal of your best self.",
      xp: 130,
    },
    {
      name: "Affirmations x10 spoken",
      desc: "Ten affirmations stated with conviction.",
      xp: 120,
    },
    {
      name: "Face real discomfort",
      desc: "Take meaningful action on your fear.",
      xp: 160,
    },
    {
      name: "Meaningful contribution",
      desc: "Help someone in a significant way.",
      xp: 140,
    },
    {
      name: "Weekly progress review",
      desc: "Detailed review of your growth trajectory.",
      xp: 135,
    },
  ],
  advanced: [
    {
      name: "Visualize goals 20min",
      desc: "Full sensory visualization practice.",
      xp: 285,
    },
    {
      name: "Written affirmations x20",
      desc: "Write and feel each affirmation deeply.",
      xp: 270,
    },
    {
      name: "Major fear confronted",
      desc: "Attack your biggest fear directly.",
      xp: 320,
    },
    {
      name: "Mentor or be mentored",
      desc: "One hour of meaningful mentorship.",
      xp: 300,
    },
    {
      name: "Life audit session",
      desc: "Review all life areas for alignment.",
      xp: 295,
    },
  ],
  elite: [
    {
      name: "Visualize goals 30min",
      desc: "Deep visualization. Feel the future.",
      xp: 590,
    },
    {
      name: "Elite affirmation ritual",
      desc: "Full morning ritual with affirmations.",
      xp: 570,
    },
    {
      name: "Extreme comfort zone breach",
      desc: "Push past your perceived limits today.",
      xp: 650,
    },
    {
      name: "Community contribution",
      desc: "Make a significant positive impact.",
      xp: 620,
    },
    {
      name: "Comprehensive life review",
      desc: "Full audit with action plan.",
      xp: 610,
    },
  ],
};

const APEX_WEEKLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "Mentor session",
      desc: "Talk to someone ahead of you on the path.",
      xp: 280,
    },
    {
      name: "Mindset journal week",
      desc: "Daily mindset entries for the week.",
      xp: 260,
    },
    {
      name: "One major challenge",
      desc: "Overcome one significant obstacle.",
      xp: 300,
    },
  ],
  intermediate: [
    {
      name: "Weekly mentor session",
      desc: "One hour with a mentor or role model.",
      xp: 580,
    },
    {
      name: "Detailed mindset journal",
      desc: "Structured mindset tracking all week.",
      xp: 560,
    },
    {
      name: "Overcome major challenge",
      desc: "Tackle the hardest thing on your list.",
      xp: 620,
    },
  ],
  advanced: [
    {
      name: "2 mentor/peer sessions",
      desc: "Two high-quality conversations with achievers.",
      xp: 1000,
    },
    {
      name: "Mindset breakthrough",
      desc: "Document and act on a major mental shift.",
      xp: 1050,
    },
    {
      name: "Seven daily discomfort wins",
      desc: "Face discomfort every single day.",
      xp: 1020,
    },
  ],
  elite: [
    {
      name: "Be the mentor",
      desc: "Teach and guide others meaningfully.",
      xp: 1850,
    },
    {
      name: "Elite mindset week",
      desc: "Peak mental performance every day.",
      xp: 1900,
    },
    {
      name: "Transform one belief",
      desc: "Identify and rewire a limiting belief.",
      xp: 1850,
    },
  ],
};

const APEX_MONTHLY: Record<
  Bracket,
  { name: string; desc: string; xp: number }[]
> = {
  beginner: [
    {
      name: "Life audit (first)",
      desc: "Your first full life area assessment.",
      xp: 1000,
    },
    {
      name: "Set new monthly goals",
      desc: "Create and commit to monthly targets.",
      xp: 900,
    },
    {
      name: "Transform one small habit",
      desc: "Change one habit for the better.",
      xp: 850,
    },
  ],
  intermediate: [
    {
      name: "Full life audit",
      desc: "Comprehensive assessment of all life areas.",
      xp: 1800,
    },
    {
      name: "Reset all goals",
      desc: "Evaluate and upgrade your goal system.",
      xp: 1750,
    },
    {
      name: "Transform one major habit",
      desc: "Fundamentally change one area of behavior.",
      xp: 1900,
    },
  ],
  advanced: [
    {
      name: "Deep identity audit",
      desc: "Who are you, who do you want to be?",
      xp: 2900,
    },
    {
      name: "Personal manifesto",
      desc: "Write your definitive life manifesto.",
      xp: 3100,
    },
    {
      name: "Transform 3 habits",
      desc: "Change three significant behaviors.",
      xp: 3000,
    },
  ],
  elite: [
    {
      name: "Complete self reinvention",
      desc: "Document transformation across all areas.",
      xp: 5200,
    },
    {
      name: "Legacy goal setting",
      desc: "Define and commit to your life's legacy.",
      xp: 5500,
    },
    {
      name: "Teach your philosophy",
      desc: "Articulate your life philosophy to others.",
      xp: 5300,
    },
  ],
};

// ─── Trainer mission lookup maps ─────────────────────────────────
const TRAINER_MAPS = {
  kira: {
    daily: KIRA_DAILY,
    weekly: KIRA_WEEKLY,
    monthly: KIRA_MONTHLY,
    category: "fitness",
  },
  ryu: {
    daily: RYU_DAILY,
    weekly: RYU_WEEKLY,
    monthly: RYU_MONTHLY,
    category: "martial",
  },
  nova: {
    daily: NOVA_DAILY,
    weekly: NOVA_WEEKLY,
    monthly: NOVA_MONTHLY,
    category: "intelligence",
  },
  zen: {
    daily: ZEN_DAILY,
    weekly: ZEN_WEEKLY,
    monthly: ZEN_MONTHLY,
    category: "focus",
  },
  vega: {
    daily: VEGA_DAILY,
    weekly: VEGA_WEEKLY,
    monthly: VEGA_MONTHLY,
    category: "discipline",
  },
  apex: {
    daily: APEX_DAILY,
    weekly: APEX_WEEKLY,
    monthly: APEX_MONTHLY,
    category: "mindset",
  },
} as const;

type TrainerId = keyof typeof TRAINER_MAPS;

export function getScaledMissions(
  trainerId: string,
  tier: MissionTier,
  playerLevel: number,
): MissionDef[] {
  const trainerKey = trainerId as TrainerId;
  const map = TRAINER_MAPS[trainerKey];
  if (!map) return [];

  const bracket = getBracket(playerLevel);
  const rawMissions = map[tier][bracket] as {
    name: string;
    desc: string;
    xp: number;
  }[];
  const category = map.category;

  const dateStr = getDateString();
  const weekStr = getWeekString();
  const monthStr = getMonthString();

  const timeSuffix =
    tier === "daily" ? dateStr : tier === "weekly" ? weekStr : monthStr;

  return rawMissions.map((m) => ({
    id: `${trainerId}-${tier}-${m.name.replace(/\s+/g, "-").toLowerCase()}-${timeSuffix}`,
    name: m.name,
    desc: m.desc,
    xp: m.xp,
    category,
    tier,
    haspenalty: tier === "daily",
  }));
}

// ─── Special Missions ────────────────────────────────────────────
export function getSpecialMissions(playerLevel: number): MissionDef[] {
  if (playerLevel % 5 !== 0 || playerLevel === 0) return [];

  const dateStr = getDateString();
  const allSpecials: Omit<MissionDef, "id">[] = [
    {
      name: "THE HUNDRED CHALLENGE",
      desc: "100 push-ups + 100 squats + 100 crunches in one session. No mercy.",
      xp: 500,
      category: "fitness",
      tier: "daily",
    },
    {
      name: "IRON WILL",
      desc: "Complete all 6 trainers' daily missions today. The ultimate test.",
      xp: 800,
      category: "mindset",
      tier: "daily",
    },
    {
      name: "DAWN WARRIOR",
      desc: "Wake at 5am and complete a full workout before sunrise.",
      xp: 600,
      category: "discipline",
      tier: "daily",
    },
    {
      name: "SHADOW TRAINING",
      desc: "2 hours of solo martial arts training. No distractions.",
      xp: 700,
      category: "martial",
      tier: "daily",
    },
    {
      name: "MIND FORTRESS",
      desc: "2 hours zero distractions deep work. Build the fortress.",
      xp: 600,
      category: "focus",
      tier: "daily",
    },
  ];

  return allSpecials.map((m) => ({
    ...m,
    id: `special-${m.name.replace(/\s+/g, "-").toLowerCase()}-${dateStr}`,
  }));
}
