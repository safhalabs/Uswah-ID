import { CityLocation, DEFAULT_CITY } from "@/data/cities";

export interface UserPreferences {
  city: CityLocation;
  hijriAdjustment: number; // e.g. -1, 0, +1
  audioEnabled: boolean;
  audioVolume: number; // 0.0 - 1.0
  audioTone: "adzan_makkah" | "adzan_madinah" | "gentle_chime";
  darkMode: boolean;
  layoutMode: "auto" | "desktop" | "portrait" | "mobile";
  qadhaTarget: number;
  qadhaCompleted: number;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  city: DEFAULT_CITY,
  hijriAdjustment: 0,
  audioEnabled: true,
  audioVolume: 0.8,
  audioTone: "gentle_chime",
  darkMode: false,
  layoutMode: "auto",
  qadhaTarget: 0,
  qadhaCompleted: 0,
};

const STORAGE_KEYS = {
  PREFERENCES: "uswah_preferences_v1",
  AMALAN_CHECKLIST: "uswah_amalan_checklist_v1",
  FASTING_LOGS: "uswah_fasting_logs_v1",
};

export function getStoredPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Failed to read preferences", e);
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save preferences", e);
    return DEFAULT_PREFERENCES;
  }
}

export interface DayAmalanState {
  date: string; // YYYY-MM-DD
  completedIds: string[];
}

export function getDayAmalan(dateKey: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AMALAN_CHECKLIST);
    if (!raw) return [];
    const all: Record<string, string[]> = JSON.parse(raw);
    return all[dateKey] || [];
  } catch {
    return [];
  }
}

export function toggleDayAmalan(dateKey: string, amalanId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AMALAN_CHECKLIST);
    const all: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    const current = all[dateKey] || [];
    
    let updated: string[];
    if (current.includes(amalanId)) {
      updated = current.filter((id) => id !== amalanId);
    } else {
      updated = [...current, amalanId];
    }
    
    all[dateKey] = updated;
    localStorage.setItem(STORAGE_KEYS.AMALAN_CHECKLIST, JSON.stringify(all));
    return updated;
  } catch (e) {
    console.error("Failed to update amalan checklist", e);
    return [];
  }
}

export function isSunnahCompleted(dateKey: string, amalanId: string): boolean {
  return getDayAmalan(dateKey).includes(amalanId);
}

export interface FastingLogEntry {
  id: string;
  dateKey: string; // YYYY-MM-DD
  type: string; // e.g. "senin", "kamis", "ayyamul_bidh", "qadha"
  notes?: string;
  createdAt: string;
}

export function getFastingLogs(): FastingLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FASTING_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logFasting(entry: Omit<FastingLogEntry, "id" | "createdAt">): FastingLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getFastingLogs();
    const newEntry: FastingLogEntry = {
      ...entry,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    localStorage.setItem(STORAGE_KEYS.FASTING_LOGS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function removeFastingLog(id: string): FastingLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getFastingLogs();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.FASTING_LOGS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
