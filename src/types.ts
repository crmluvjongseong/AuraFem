export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type UserGoal = 
  | 'track_period'          // ติดตามรอบเดือนทั่วไป
  | 'trying_to_conceive'    // เตรียมพร้อมมีบุตร (TTC)
  | 'contraception'         // คุมกำเนิดธรรมชาติ
  | 'pcos_health';          // ดูแลสุขภาพเฉพาะ เช่น PCOS หรือรอบเดือนไม่สม่ำเสมอ

export type PeriodFlow = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type BloodColor = 'bright_red' | 'dark_red' | 'brown' | 'pink' | 'orange';
export type CervicalMucus = 'dry' | 'sticky' | 'creamy' | 'egg_white' | 'watery';

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatarId: string;
  goal: UserGoal;
  averageCycleLength: number; // typically 21 - 38 days, default 28
  averagePeriodDuration: number; // typically 3 - 7 days, default 5
  lastPeriodStartDate: string; // YYYY-MM-DD
  pinCode?: string;
  isPinEnabled: boolean;
  partnerCode: string;
  isPartnerLinked: boolean;
  partnerNickname?: string;
  showPartnerNotifications: boolean;
  notes?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  isPeriodDay: boolean;
  flow?: PeriodFlow;
  bloodColor?: BloodColor;
  symptoms: string[];
  moods: string[];
  energyLevel: number; // 1 - 5
  sleepHours: number;
  stressLevel: number; // 1 - 5
  waterGlasses: number;
  cervicalMucus?: CervicalMucus;
  hadSex?: boolean;
  isProtectedSex?: boolean;
  bbt?: number; // Basal Body Temperature e.g. 36.5
  note?: string;
}

export interface PastCycle {
  id: string;
  startDate: string;
  endDate: string;
  cycleLength: number; // in days
  periodDuration: number; // in days
  isAbnormal?: boolean;
}

export interface CyclePrediction {
  currentDayOfCycle: number;
  currentPhase: CyclePhase;
  daysUntilNextPeriod: number;
  nextPeriodStartDate: string;
  nextOvulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  pregnancyChance: 'ต่ำมาก' | 'ต่ำ' | 'ปานกลาง' | 'สูงมาก (วันไข่ตก)';
  cycleRegularityScore: number; // 0 - 100
  regularityStatus: 'สม่ำเสมอดียิ่ง' | 'ค่อนข้างสม่ำเสมอ' | 'ควรปรึกษาแพทย์ (ไม่สม่ำเสมอ)';
}

export interface PhaseGuideData {
  phase: CyclePhase;
  thaiName: string;
  englishName: string;
  daysRangeDesc: string;
  keyHormones: string;
  hormoneDescription: string;
  biologicalState: string;
  foodsToEat: {
    category: string;
    thaiIngredients: string[];
    benefit: string;
  }[];
  foodsToAvoid: {
    category: string;
    examples: string[];
    reason: string;
  }[];
  symptomCare: {
    symptom: string;
    gynecologistAdvice: string;
    nutritionistTip: string;
  }[];
  exerciseAndSelfCare: {
    intensity: 'เบามาก (Restorative)' | 'ปานกลาง (Strength/Cardio)' | 'สูงสุด (Peak Performance)' | 'เบาลง (Cozy Low-Impact)';
    suggestedActivities: string[];
    selfCareRitual: string;
  };
  partnerCareGuide: {
    emotionalState: string;
    whatToDo: string[];
    whatToAvoid: string[];
    careGiftsOrFood: string[];
  };
  mascotAdvice: string;
  accentColor: string;
  bgPastel: string;
  badgeBg: string;
}
