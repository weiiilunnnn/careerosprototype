// Shared handoff between the Career Path Simulator and the Life Chapter Designer.
// This is a frontend prototype, so the "simulated" career path is passed between
// the two features through localStorage instead of a backend.

export type SimulatedCareerStep = {
  id: string;
  title: string;
  subtitle: string;
  targetYear: number;
};

export type SimulatedCareerPath = {
  savedAt: number;
  steps: SimulatedCareerStep[];
};

const STORAGE_KEY = "careeros.simulatedCareerPath";

/**
 * Career Path Simulator timelines are free-text labels such as "Now",
 * "0-12 months", "2-4 years". Convert one into a duration in years.
 *
 * Month ranges use the full/upper bound (e.g. "0-12 months" -> 12 months,
 * i.e. 1 year), while year ranges use the midpoint (e.g. "2-4 years" -> 3
 * years) — matching how these labels are actually meant to be read.
 */
export function parseTimelineToYears(timeline: string): number {
  const value = timeline.trim().toLowerCase();
  if (!value || value === "now") return 0;

  const rangeMatch = value.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(month|year)/);
  if (rangeMatch) {
    const low = Number(rangeMatch[1]);
    const high = Number(rangeMatch[2]);
    const isMonths = rangeMatch[3].startsWith("month");
    const amount = isMonths ? high : (low + high) / 2;
    return isMonths ? amount / 12 : amount;
  }

  const singleMatch = value.match(/(\d+(?:\.\d+)?)\s*(month|year)/);
  if (singleMatch) {
    const amount = Number(singleMatch[1]);
    return singleMatch[2].startsWith("month") ? amount / 12 : amount;
  }

  return 1;
}

/**
 * Turn an ordered list of simulator timeline labels (root/"current" first)
 * into cumulative year offsets for Life Chapter Designer.
 *
 * Each position's own duration is treated as how long you spend in that
 * position before moving on to the next one — so the gap between node i and
 * node i+1 comes from node i's own timeline. The only exception is the very
 * first hop away from "current" (whose own timeline is always "Now", i.e. no
 * duration), which instead borrows the first real position's own duration.
 */
export function buildSequentialYears(timelines: string[]): number[] {
  if (timelines.length === 0) return [];
  const minGapYears = 0.5;
  const years = [0];
  for (let index = 1; index < timelines.length; index += 1) {
    const gapSourceIndex = Math.max(1, index - 1);
    const gapYears = Math.max(minGapYears, Math.round(parseTimelineToYears(timelines[gapSourceIndex]) * 2) / 2);
    years.push(Math.round((years[index - 1] + gapYears) * 2) / 2);
  }
  return years;
}

export function saveSimulatedCareerPath(steps: SimulatedCareerStep[]) {
  if (typeof window === "undefined" || steps.length === 0) return;
  try {
    const payload: SimulatedCareerPath = { savedAt: Date.now(), steps };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.) — non-critical for a prototype.
  }
}

export function readSimulatedCareerPath(): SimulatedCareerPath | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimulatedCareerPath;
    if (!parsed?.steps?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSimulatedCareerPath() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}
