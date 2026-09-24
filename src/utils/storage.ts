import { DailyLog, PastCycle, UserProfile } from '../types';
import { addDays } from './cycleCalculations';

const STORAGE_KEY_USER = 'aurafem_user_profile';
const STORAGE_KEY_LOGS = 'aurafem_daily_logs';
const STORAGE_KEY_CYCLES = 'aurafem_past_cycles';

// Today's date in local YYYY-MM-DD
export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const today = getTodayDateStr();
// Let's seed current cycle start as 14 days ago so today is right on day 15 (Ovulation / High energy)
const initialCycleStart = addDays(today, -14);

export const DEFAULT_USER: UserProfile = {
  id: 'usr_meena_01',
  username: 'meena.s',
  nickname: 'มีนา 🌸',
  avatarId: 'mascot',
  goal: 'track_period',
  averageCycleLength: 28,
  averagePeriodDuration: 5,
  lastPeriodStartDate: initialCycleStart,
  pinCode: '',
  isPinEnabled: false,
  partnerCode: 'AURA-7892',
  isPartnerLinked: true,
  partnerNickname: 'พีท (Pete) ☕',
  showPartnerNotifications: true,
  notes: 'ออกกำลังกายประจำ ไม่ทานเนื้อวัว สุขภาพแข็งแรงดี'
};

export const INITIAL_PAST_CYCLES: PastCycle[] = [
  { id: 'c1', startDate: addDays(initialCycleStart, -140), endDate: addDays(initialCycleStart, -112), cycleLength: 28, periodDuration: 5 },
  { id: 'c2', startDate: addDays(initialCycleStart, -112), endDate: addDays(initialCycleStart, -83), cycleLength: 29, periodDuration: 5 },
  { id: 'c3', startDate: addDays(initialCycleStart, -83), endDate: addDays(initialCycleStart, -56), cycleLength: 27, periodDuration: 4 },
  { id: 'c4', startDate: addDays(initialCycleStart, -56), endDate: addDays(initialCycleStart, -28), cycleLength: 28, periodDuration: 5 },
  { id: 'c5', startDate: addDays(initialCycleStart, -28), endDate: initialCycleStart, cycleLength: 28, periodDuration: 5 }
];

export const INITIAL_LOGS: Record<string, DailyLog> = {
  // Day 1 to 5 of current cycle (period days)
  [initialCycleStart]: {
    date: initialCycleStart,
    isPeriodDay: true,
    flow: 'heavy',
    bloodColor: 'bright_red',
    symptoms: ['cramps', 'backache', 'fatigue'],
    moods: ['sensitive', 'need_hugs'],
    energyLevel: 2,
    sleepHours: 7.5,
    stressLevel: 3,
    waterGlasses: 6,
    note: 'ปวดท้องน้อยวันแรก ใช้กระเป๋าน้ำร้อนช่วยได้เยอะ'
  },
  [addDays(initialCycleStart, 1)]: {
    date: addDays(initialCycleStart, 1),
    isPeriodDay: true,
    flow: 'medium',
    bloodColor: 'dark_red',
    symptoms: ['cramps', 'bloating'],
    moods: ['calm', 'need_hugs'],
    energyLevel: 2,
    sleepHours: 8,
    stressLevel: 2,
    waterGlasses: 8
  },
  [addDays(initialCycleStart, 2)]: {
    date: addDays(initialCycleStart, 2),
    isPeriodDay: true,
    flow: 'medium',
    bloodColor: 'dark_red',
    symptoms: ['fatigue'],
    moods: ['calm'],
    energyLevel: 3,
    sleepHours: 7,
    stressLevel: 2,
    waterGlasses: 8
  },
  [addDays(initialCycleStart, 3)]: {
    date: addDays(initialCycleStart, 3),
    isPeriodDay: true,
    flow: 'light',
    bloodColor: 'brown',
    symptoms: [],
    moods: ['happy'],
    energyLevel: 3,
    sleepHours: 7.5,
    stressLevel: 1,
    waterGlasses: 8
  },
  [addDays(initialCycleStart, 4)]: {
    date: addDays(initialCycleStart, 4),
    isPeriodDay: true,
    flow: 'spotting',
    bloodColor: 'brown',
    symptoms: [],
    moods: ['happy', 'productive'],
    energyLevel: 4,
    sleepHours: 8,
    stressLevel: 1,
    waterGlasses: 8
  },
  // Day 10 (Follicular phase glow)
  [addDays(initialCycleStart, 9)]: {
    date: addDays(initialCycleStart, 9),
    isPeriodDay: false,
    flow: 'none',
    symptoms: [],
    moods: ['happy', 'productive'],
    energyLevel: 5,
    sleepHours: 8,
    stressLevel: 1,
    waterGlasses: 9,
    note: 'วิ่งไป 5 กม. สมองแล่นมาก ไอเดียงานผ่านฉลุย'
  },
  // Today's log (Day 15 - Ovulation)
  [today]: {
    date: today,
    isPeriodDay: false,
    flow: 'none',
    symptoms: ['tender_breasts'],
    moods: ['happy'],
    energyLevel: 5,
    sleepHours: 8,
    stressLevel: 1,
    waterGlasses: 8,
    cervicalMucus: 'egg_white',
    hadSex: true,
    isProtectedSex: true,
    bbt: 36.8,
    note: 'รู้สึกสดชื่น ผิวผ่อง มูกไข่ขาวชัดเจน'
  }
};

export function loadUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading user profile', e);
  }
  return DEFAULT_USER;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

export function loadDailyLogs(): Record<string, DailyLog> {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LOGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading daily logs', e);
  }
  return INITIAL_LOGS;
}

export function saveDailyLog(log: DailyLog): void {
  try {
    const current = loadDailyLogs();
    current[log.date] = log;
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(current));
  } catch (e) {
    console.error('Error saving daily log', e);
  }
}

export function loadPastCycles(): PastCycle[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CYCLES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading past cycles', e);
  }
  return INITIAL_PAST_CYCLES;
}

export function savePastCycles(cycles: PastCycle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CYCLES, JSON.stringify(cycles));
  } catch (e) {
    console.error('Error saving past cycles', e);
  }
}
