export type WorkAnimalSlug =
  | "lion"
  | "eagle"
  | "wolf"
  | "owl"
  | "dolphin"
  | "peacock"
  | "elephant"
  | "horse"
  | "ant"
  | "cheetah"
  | "fox"
  | "octopus";

export type WorkAnimalProfile = {
  slug: WorkAnimalSlug;
  name: string;
  emoji: string;
  archetype: string;
  category: "Leadership" | "Relational" | "Execution";
  short: string;
  roles: string[];
  dimensions: {
    pace: number;
    people: number;
    perspective: number;
    purpose: number;
  };
};

export type AnimalMatchInsight = {
  animal: WorkAnimalProfile;
  score: number;
  reason: string;
};

export type SupervisorGuide = {
  title: string;
  character: string;
  communication: string;
  workingStyle: string;
  candidateResponse: string;
  whyItWorks: string;
};

export const workAnimals: WorkAnimalProfile[] = [
  {
    slug: "lion",
    name: "Lion",
    emoji: "🦁",
    archetype: "The Commander",
    category: "Leadership",
    short: "Takes charge, decides under pressure, and moves teams forward when the room is stuck.",
    roles: ["General Manager", "Operations Director", "Sales Leader", "Founder"],
    dimensions: { pace: 88, people: 66, perspective: 58, purpose: 74 },
  },
  {
    slug: "eagle",
    name: "Eagle",
    emoji: "🦅",
    archetype: "The Visionary",
    category: "Leadership",
    short: "Sees the bigger picture, spots direction early, and helps teams aim beyond the immediate task.",
    roles: ["Product Strategist", "Innovation Lead", "Founder", "Brand Director"],
    dimensions: { pace: 72, people: 56, perspective: 92, purpose: 86 },
  },
  {
    slug: "wolf",
    name: "Wolf",
    emoji: "🐺",
    archetype: "The Pack Leader",
    category: "Leadership",
    short: "Independent, loyal to the mission, and comfortable leading from focused conviction.",
    roles: ["Technical Lead", "Security Lead", "Founder", "Field Lead"],
    dimensions: { pace: 70, people: 42, perspective: 64, purpose: 76 },
  },
  {
    slug: "owl",
    name: "Owl",
    emoji: "🦉",
    archetype: "The Scholar",
    category: "Leadership",
    short: "Studies the problem deeply, makes careful calls, and brings clarity through evidence.",
    roles: ["Researcher", "Data Scientist", "Policy Analyst", "Architect"],
    dimensions: { pace: 35, people: 34, perspective: 88, purpose: 54 },
  },
  {
    slug: "dolphin",
    name: "Dolphin",
    emoji: "🐬",
    archetype: "The Connector",
    category: "Relational",
    short: "Builds trust quickly, reads people well, and turns collaboration into momentum.",
    roles: ["Customer Success Lead", "Community Manager", "People Partner", "Account Manager"],
    dimensions: { pace: 68, people: 92, perspective: 60, purpose: 62 },
  },
  {
    slug: "peacock",
    name: "Peacock",
    emoji: "🦚",
    archetype: "The Performer",
    category: "Relational",
    short: "Brings ideas to life through presence, storytelling, and persuasive energy.",
    roles: ["Presenter", "Marketer", "Sales Executive", "Creative Lead"],
    dimensions: { pace: 84, people: 88, perspective: 70, purpose: 80 },
  },
  {
    slug: "elephant",
    name: "Elephant",
    emoji: "🐘",
    archetype: "The Mentor",
    category: "Relational",
    short: "Steady, wise, and people-centred, with a strong instinct for guidance and care.",
    roles: ["Mentor", "HR Manager", "Educator", "Programme Lead"],
    dimensions: { pace: 32, people: 86, perspective: 62, purpose: 38 },
  },
  {
    slug: "horse",
    name: "Horse",
    emoji: "🐴",
    archetype: "The Loyalist",
    category: "Relational",
    short: "Reliable, grounded, and strongest when carrying important work through to the finish.",
    roles: ["Operations Coordinator", "Client Services", "Administrator", "Project Coordinator"],
    dimensions: { pace: 48, people: 74, perspective: 38, purpose: 28 },
  },
  {
    slug: "ant",
    name: "Ant",
    emoji: "🐜",
    archetype: "The Architect",
    category: "Execution",
    short: "Turns work into systems, improves process, and protects quality through careful structure.",
    roles: ["Operations Manager", "Quality Lead", "Project Manager", "Systems Analyst", "Engineer"],
    dimensions: { pace: 38, people: 36, perspective: 44, purpose: 24 },
  },
  {
    slug: "cheetah",
    name: "Cheetah",
    emoji: "🐆",
    archetype: "The Sprinter",
    category: "Execution",
    short: "Moves fast, cuts through blockers, and gets urgent work into motion quickly.",
    roles: ["Growth Operator", "Startup Generalist", "Incident Lead", "Sales Hunter"],
    dimensions: { pace: 96, people: 52, perspective: 42, purpose: 82 },
  },
  {
    slug: "fox",
    name: "Fox",
    emoji: "🦊",
    archetype: "The Strategist",
    category: "Execution",
    short: "Reads the angle, finds leverage, and wins through sharp choices rather than brute force.",
    roles: ["Strategist", "Consultant", "Product Manager", "Business Analyst"],
    dimensions: { pace: 70, people: 46, perspective: 82, purpose: 72 },
  },
  {
    slug: "octopus",
    name: "Octopus",
    emoji: "🐙",
    archetype: "The Maker",
    category: "Execution",
    short: "Builds with range, adapts quickly, and handles many moving parts hands-on.",
    roles: ["Builder", "Designer", "Developer", "Creative Technologist"],
    dimensions: { pace: 62, people: 44, perspective: 66, purpose: 90 },
  },
];

export const unknownWorkAnimal = {
  status: "Unknown",
  summary: "Menagerie Method incomplete. Candidate profile stays incomplete until the animal trait test is finished.",
};

export function getWorkAnimal(slug?: string) {
  return workAnimals.find((animal) => animal.slug === slug);
}

export function topAnimalsForJob(input: {
  title: string;
  skills: string[];
  historicalAnimalSlugs?: WorkAnimalSlug[];
}): AnimalMatchInsight[] {
  const text = `${input.title} ${input.skills.join(" ")}`.toLowerCase();
  const historicalBoosts = new Map<WorkAnimalSlug, number>();

  input.historicalAnimalSlugs?.forEach((slug) => {
    historicalBoosts.set(slug, (historicalBoosts.get(slug) ?? 0) + 18);
  });

  const keywordScores: Partial<Record<WorkAnimalSlug, number>> = {
    lion: scoreKeywords(text, ["lead", "manager", "director", "ownership", "sales"]),
    eagle: scoreKeywords(text, ["strategy", "vision", "innovation", "roadmap", "brand"]),
    wolf: scoreKeywords(text, ["technical lead", "security", "principal", "independent"]),
    owl: scoreKeywords(text, ["research", "data", "analysis", "analytics", "analyst", "scientist", "policy", "bi"]),
    dolphin: scoreKeywords(text, ["customer", "community", "partner", "stakeholder", "success"]),
    peacock: scoreKeywords(text, ["presentation", "marketing", "storytelling", "sales", "creative"]),
    elephant: scoreKeywords(text, ["mentor", "people", "training", "hr", "programme"]),
    horse: scoreKeywords(text, ["coordinator", "support", "service", "delivery", "admin"]),
    ant: scoreKeywords(text, ["operations", "quality", "process", "systems", "engineer", "project", "dashboard", "reporting", "power bi"]),
    cheetah: scoreKeywords(text, ["growth", "startup", "fast", "incident", "activation"]),
    fox: scoreKeywords(text, ["product", "business", "consult", "strategy", "discovery"]),
    octopus: scoreKeywords(text, ["build", "design", "developer", "prototype", "maker"]),
  };

  const weightedAnimals = workAnimals.map((animal) => ({
    animal,
    rawScore: 1 + (keywordScores[animal.slug] ?? 0) + (historicalBoosts.get(animal.slug) ?? 0),
    reason: getJobReason(animal.slug),
  }));
  const totalScore = weightedAnimals.reduce((sum, item) => sum + item.rawScore, 0);
  const normalizedAnimals = weightedAnimals.map((item) => {
    const exactScore = (item.rawScore / totalScore) * 100;
    return {
      animal: item.animal,
      score: Math.floor(exactScore),
      remainder: exactScore - Math.floor(exactScore),
      reason: item.reason,
    };
  });
  const allocatedScore = normalizedAnimals.reduce((sum, item) => sum + item.score, 0);
  const remainderPoints = 100 - allocatedScore;
  const slugsToIncrement = new Set(
    [...normalizedAnimals]
      .sort((a, b) => b.remainder - a.remainder)
      .slice(0, remainderPoints)
      .map((item) => item.animal.slug)
  );

  return normalizedAnimals
    .map((item) => ({
      animal: item.animal,
      score: item.score + (slugsToIncrement.has(item.animal.slug) ? 1 : 0),
      reason: item.reason,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function compareCandidateToJob(candidateSlug: WorkAnimalSlug | undefined, topMatches: AnimalMatchInsight[]) {
  const candidateAnimal = getWorkAnimal(candidateSlug);
  if (!candidateAnimal) {
    return {
      status: "unknown" as const,
      title: "Animal trait unknown",
      body: "Take the Menagerie Method test to unlock trait matching, supervisor guidance, and a complete profile.",
    };
  }

  const directMatch = topMatches.find((match) => match.animal.slug === candidateAnimal.slug);
  if (directMatch) {
    return {
      status: "match" as const,
      title: `${candidateAnimal.name} matches this role`,
      body: `${candidateAnimal.archetype} fits because this job rewards ${directMatch.reason.toLowerCase()}`,
    };
  }

  return {
    status: "gap" as const,
    title: `${candidateAnimal.name} is different from the role pattern`,
    body: `Your natural style is ${candidateAnimal.short.toLowerCase()} For this role, practise the top traits shown here: decision rhythm, collaboration style, and the way success is maintained after launch.`,
  };
}

export function supervisorGuide(slug?: WorkAnimalSlug): SupervisorGuide {
  const animal = getWorkAnimal(slug);
  if (!animal) {
    return {
      title: "Supervisor trait not set",
      character: "The employer has not shared the reporting manager's work animal yet.",
      communication: "Ask about their preferred update style, decision rhythm, and expectations before the interview.",
      workingStyle: "Treat this as unknown until the employer provides more context.",
      candidateResponse: "Prepare flexible examples that show you can adapt to different manager styles.",
      whyItWorks: "Clarifying expectations early reduces misunderstanding and helps you decide whether the manager fit is right for you.",
    };
  }

  const guide: Record<WorkAnimalSlug, Omit<SupervisorGuide, "title">> = {
    lion: {
      character: "A Lion manager is decisive, direct, and comfortable taking ownership when the stakes are high.",
      communication: "They usually prefer clear recommendations, short context, and a confident point of view instead of long uncertainty.",
      workingStyle: "Expect pace, accountability, and visible progress. They may decide quickly and adjust later.",
      candidateResponse: "Lead with your answer, then support it with evidence. Show what you would do, what trade-off you considered, and where you need a decision.",
      whyItWorks: "A Lion trusts people who can take responsibility and reduce hesitation, while still giving enough context to make a strong call.",
    },
    eagle: {
      character: "An Eagle manager is future-oriented and cares about direction, ambition, and the larger purpose behind the work.",
      communication: "They respond well when you connect details to strategy, market impact, or long-term outcomes.",
      workingStyle: "Expect big goals, broad framing, and less patience for work that feels disconnected from the bigger picture.",
      candidateResponse: "Explain how your work supports the future direction, not only the task. Bring options and show the impact of each path.",
      whyItWorks: "An Eagle needs to see that you can operate beyond the immediate checklist and understand where the team is heading.",
    },
    wolf: {
      character: "A Wolf manager values independence, competence, loyalty to the mission, and people who can carry responsibility alone.",
      communication: "They may prefer concise updates, direct evidence, and fewer unnecessary meetings.",
      workingStyle: "Expect autonomy, high trust, and the need to prove you can handle ownership without constant prompting.",
      candidateResponse: "Show where you have worked independently, made judgement calls, and protected the team's goal even when conditions were unclear.",
      whyItWorks: "A Wolf trusts candidates who show self-reliance and do not need heavy supervision to keep moving.",
    },
    owl: {
      character: "An Owl manager is careful, analytical, and values sound judgement over fast noise.",
      communication: "They prefer reasoned explanations, evidence, assumptions, and the logic behind your recommendation.",
      workingStyle: "Expect depth, quality, and time spent getting the answer right. Rushed or shallow work may create doubt.",
      candidateResponse: "Bring the reasoning, not just the conclusion. Show how you checked the problem, what evidence mattered, and what risk remains.",
      whyItWorks: "An Owl trusts thinking that can be inspected. Showing your working helps them believe your answer will hold up.",
    },
    dolphin: {
      character: "A Dolphin manager is relationship-led, collaborative, and sensitive to trust, morale, and team alignment.",
      communication: "They prefer warm, open communication where people feel heard before decisions are pushed forward.",
      workingStyle: "Expect collaboration, check-ins, stakeholder awareness, and attention to how work affects people.",
      candidateResponse: "Build rapport first, then explain how you collaborate, keep stakeholders aligned, and handle disagreement without damaging trust.",
      whyItWorks: "A Dolphin is more likely to trust you when they see that you protect both the work and the relationships needed to deliver it.",
    },
    peacock: {
      character: "A Peacock manager is expressive, persuasive, and values confident storytelling and visible momentum.",
      communication: "They respond to memorable examples, clear outcomes, and energy in how ideas are presented.",
      workingStyle: "Expect presentations, stakeholder influence, and work that needs to be seen and understood by others.",
      candidateResponse: "Use strong examples, show the impact, and practise explaining your work in a way people can remember.",
      whyItWorks: "A Peacock trusts candidates who can make good work visible and bring others into the story.",
    },
    elephant: {
      character: "An Elephant manager is steady, people-wise, and guided by experience, care, and long-term development.",
      communication: "They prefer respectful communication, patience, and thoughtful reflection rather than aggressive urgency.",
      workingStyle: "Expect mentoring, gradual trust-building, and a strong interest in whether you are reliable and coachable.",
      candidateResponse: "Show maturity, willingness to learn, and respect for what has already worked before proposing change.",
      whyItWorks: "An Elephant trusts candidates who can grow without dismissing experience or disrupting stability unnecessarily.",
    },
    horse: {
      character: "A Horse manager values loyalty, reliability, and people who finish what they start.",
      communication: "They prefer practical updates, visible follow-through, and clarity on commitments.",
      workingStyle: "Expect consistency, dependable delivery, and attention to whether promises are kept.",
      candidateResponse: "Show examples of ownership, follow-through, and how you keep work moving even when it becomes repetitive or difficult.",
      whyItWorks: "A Horse trusts candidates who make commitments visible and then honour them.",
    },
    ant: {
      character: "An Ant manager is structured, process-minded, and highly attentive to quality and repeatability.",
      communication: "They prefer organized updates, clear steps, risks, owners, and evidence that details are controlled.",
      workingStyle: "Expect systems, standards, process discipline, and careful execution.",
      candidateResponse: "Bring structure. Explain your process, how you prevent mistakes, and how you keep quality consistent.",
      whyItWorks: "An Ant trusts candidates who reduce chaos and turn good intentions into reliable systems.",
    },
    cheetah: {
      character: "A Cheetah manager moves fast, values action, and is energized by urgent progress.",
      communication: "They prefer quick summaries, immediate blockers, and fast next steps.",
      workingStyle: "Expect speed, iteration, and pressure to act before everything is perfectly certain.",
      candidateResponse: "Show that you can move quickly without losing control. Clarify priorities, act, and report progress fast.",
      whyItWorks: "A Cheetah trusts candidates who can match pace while still keeping judgement intact.",
    },
    fox: {
      character: "A Fox manager is strategic, sharp, and interested in leverage, angles, and smart trade-offs.",
      communication: "They prefer insight, options, and the reasoning behind why one move is smarter than another.",
      workingStyle: "Expect strategic thinking, ambiguity, and questions about incentives, risks, and hidden opportunities.",
      candidateResponse: "Show your thinking. Explain the angle you see, the trade-off you would make, and why your approach is strategically useful.",
      whyItWorks: "A Fox trusts candidates who can think beyond obvious answers and make smarter moves with limited resources.",
    },
    octopus: {
      character: "An Octopus manager is adaptable, hands-on, and comfortable handling many moving parts.",
      communication: "They prefer practical examples, working prototypes, and proof that you can switch contexts without dropping quality.",
      workingStyle: "Expect variety, ambiguity, and the need to build while learning.",
      candidateResponse: "Show range through concrete work samples. Explain how you prioritize when several things need attention at once.",
      whyItWorks: "An Octopus trusts candidates who can adapt, build, and stay useful across changing problems.",
    },
  };

  return {
    title: `Working with ${animal.name}, ${animal.archetype}`,
    ...guide[animal.slug],
  };
}

export function getBlendInterpretation(input: {
  primary?: WorkAnimalSlug;
  secondary?: WorkAnimalSlug;
  shadow?: WorkAnimalSlug;
}) {
  const primary = getWorkAnimal(input.primary);
  const secondary = getWorkAnimal(input.secondary);
  const shadow = getWorkAnimal(input.shadow);

  if (!primary) {
    return {
      title: "Your blend is still locked",
      summary:
        "Complete the Menagerie Method test to reveal the primary animal, secondary influence, shadow style, and how the three work together.",
      strengths: ["Work-style fit", "Role guidance", "Team compatibility"],
      watchouts: ["Blind spots", "Draining roles", "Communication clashes"],
    };
  }

  const exactBlend = `${primary.slug}:${secondary?.slug ?? "none"}:${shadow?.slug ?? "none"}`;

  if (exactBlend === "owl:fox:peacock") {
    return {
      title: "Your Owl, sharpened by Fox, with Peacock in the shadow",
      summary:
        "You are at your best when you can think deeply, find the hidden angle, and turn careful judgement into a smart move. The Owl gives you patience and depth; the Fox adds strategy and independence. The Peacock shadow means visible self-promotion, performance, or being the loudest voice may feel less natural, even when your ideas deserve a bigger stage.",
      strengths: [
        "You see what others miss because you wait long enough for the pattern to appear.",
        "You can turn analysis into a strategic recommendation, not just a report.",
        "You are trusted when the cost of being wrong is high.",
      ],
      watchouts: [
        "You may hold back until the thinking is too complete, letting faster voices shape the room first.",
        "You may under-sell strong work because performance and visibility feel unnatural.",
        "People may need to see your thinking earlier, before you are fully certain.",
      ],
    };
  }

  return {
    title: `Your ${primary.name}${secondary ? `, shaped by ${secondary.name}` : ""}${shadow ? `, with ${shadow.name} in the shadow` : ""}`,
    summary:
      `${primary.short}${secondary ? ` Your secondary ${secondary.name} influence adds another layer: ${secondary.short.toLowerCase()}` : ""}${shadow ? ` Your shadow ${shadow.name} points to a style you may avoid or need to practise intentionally.` : ""}`,
    strengths: [
      primary.roles[0] ? `Strong fit for ${primary.roles[0]}-style work.` : "Clearer role-fit direction.",
      secondary ? `Secondary strength: ${secondary.archetype.toLowerCase()}.` : "Secondary pattern locked until test completion.",
      "A more precise picture than a single animal alone.",
    ],
    watchouts: [
      shadow ? `Watch the ${shadow.name} shadow when a role asks for ${shadow.short.toLowerCase()}` : "Shadow pattern locked until test completion.",
      "Use the blend to choose roles, teams, and supervisors with more self-awareness.",
      "Retake the official test if this result no longer feels accurate.",
    ],
  };
}

export function getAnimalRoleInTrio(role: "Primary" | "Secondary" | "Shadow") {
  const descriptions = {
    Primary:
      "Your dominant work pattern. This is the style CareerOS treats as your main operating mode.",
    Secondary:
      "The influence shaping how your primary animal shows up in teams, projects, and decisions.",
    Shadow:
      "The side you lean away from. It can become a blind spot or a growth area under pressure.",
  };

  return descriptions[role];
}

function scoreKeywords(text: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 12 : 0), 0);
}

function getJobReason(slug: WorkAnimalSlug) {
  const reasons: Record<WorkAnimalSlug, string> = {
    lion: "clear ownership, fast decisions, and accountability under pressure.",
    eagle: "big-picture direction, future thinking, and strategic alignment.",
    wolf: "independent leadership, specialist judgement, and mission focus.",
    owl: "analysis, evidence, careful thinking, and technical judgement.",
    dolphin: "stakeholder trust, collaboration, and people-centred momentum.",
    peacock: "presence, persuasion, storytelling, and visible influence.",
    elephant: "guidance, patience, coaching, and long-term people development.",
    horse: "dependability, consistency, and strong follow-through.",
    ant: "process discipline, systems thinking, and quality control.",
    cheetah: "speed, activation, urgent delivery, and fast iteration.",
    fox: "strategic judgement, leverage, and sharp trade-off thinking.",
    octopus: "hands-on building, adaptability, and practical creative range.",
  };

  return reasons[slug];
}
