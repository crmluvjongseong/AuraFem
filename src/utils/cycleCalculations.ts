import { CyclePhase, CyclePrediction, PastCycle } from '../types';

/**
 * Utility functions for date manipulation
 */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function diffInDays(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = d1.getTime() - d2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatThaiDate(dateStr: string, includeYear = true): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543;
  return includeYear ? `${day} ${month} ${year}` : `${day} ${month}`;
}

export function formatThaiDateFull(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const thaiMonthsFull = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const day = d.getDate();
  const month = thaiMonthsFull[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} พ.ศ. ${year}`;
}

/**
 * Cycle Prediction & Hormone Phase Calculation Algorithm
 * Based on Standard Clinical Gynecological Principles:
 * 1. Luteal Phase is biologically fixed at ~14 days for most women.
 * 2. Estimated Ovulation Day = Cycle Length - 14 days.
 * 3. Fertile Window = Ovulation Day - 5 days to Ovulation Day + 1 day (6 days total).
 * 4. Next Period Date = Start Date + Cycle Length days.
 */
export function calculateCyclePrediction(
  lastPeriodStartDate: string,
  userAverageCycleLength: number,
  averagePeriodDuration: number,
  pastCycles: PastCycle[],
  targetDate: string = new Date().toISOString().split('T')[0]
): CyclePrediction {
  // If past cycles exist, compute weighted average of cycle length
  let effectiveCycleLength = userAverageCycleLength;
  if (pastCycles.length >= 2) {
    const sum = pastCycles.reduce((acc, c) => acc + c.cycleLength, 0);
    effectiveCycleLength = Math.round(sum / pastCycles.length);
  }

  // Ensure reasonable bounds (21 to 45 days)
  effectiveCycleLength = Math.max(21, Math.min(45, effectiveCycleLength));

  // Current day of cycle (Day 1 is start of bleeding)
  const daysSinceStart = diffInDays(targetDate, lastPeriodStartDate);
  const currentDayOfCycle = (daysSinceStart % effectiveCycleLength) + 1;

  // Ovulation offset from start of cycle
  const ovulationDayOffset = effectiveCycleLength - 14;
  const nextOvulationDate = addDays(lastPeriodStartDate, ovulationDayOffset);

  // Fertile window: 5 days before ovulation to 1 day after
  const fertileWindowStart = addDays(nextOvulationDate, -5);
  const fertileWindowEnd = addDays(nextOvulationDate, 1);

  // Next period start date
  const nextPeriodStartDate = addDays(lastPeriodStartDate, effectiveCycleLength);
  const daysUntilNextPeriod = Math.max(0, diffInDays(nextPeriodStartDate, targetDate));

  // Determine current hormonal phase
  let currentPhase: CyclePhase = 'follicular';
  if (currentDayOfCycle <= averagePeriodDuration) {
    currentPhase = 'menstrual';
  } else if (currentDayOfCycle < ovulationDayOffset - 1) {
    currentPhase = 'follicular';
  } else if (currentDayOfCycle <= ovulationDayOffset + 1) {
    currentPhase = 'ovulation';
  } else {
    currentPhase = 'luteal';
  }

  // Calculate Pregnancy Chance
  let pregnancyChance: 'ต่ำมาก' | 'ต่ำ' | 'ปานกลาง' | 'สูงมาก (วันไข่ตก)' = 'ต่ำ';
  if (targetDate >= fertileWindowStart && targetDate <= fertileWindowEnd) {
    if (targetDate === nextOvulationDate || targetDate === addDays(nextOvulationDate, -1)) {
      pregnancyChance = 'สูงมาก (วันไข่ตก)';
    } else {
      pregnancyChance = 'ปานกลาง';
    }
  } else if (currentPhase === 'menstrual') {
    pregnancyChance = 'ต่ำมาก';
  } else {
    pregnancyChance = 'ต่ำ';
  }

  // Regularity calculation
  let stdDev = 0;
  if (pastCycles.length >= 3) {
    const lengths = pastCycles.map(c => c.cycleLength);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;
    stdDev = Math.sqrt(variance);
  }

  let regularityScore = 95;
  let regularityStatus: 'สม่ำเสมอดียิ่ง' | 'ค่อนข้างสม่ำเสมอ' | 'ควรปรึกษาแพทย์ (ไม่สม่ำเสมอ)' = 'สม่ำเสมอดียิ่ง';

  if (pastCycles.length >= 3) {
    if (stdDev <= 2.0) {
      regularityScore = 95 - Math.round(stdDev * 3);
      regularityStatus = 'สม่ำเสมอดียิ่ง';
    } else if (stdDev <= 5.0) {
      regularityScore = 80 - Math.round(stdDev * 4);
      regularityStatus = 'ค่อนข้างสม่ำเสมอ';
    } else {
      regularityScore = Math.max(40, 60 - Math.round(stdDev * 3));
      regularityStatus = 'ควรปรึกษาแพทย์ (ไม่สม่ำเสมอ)';
    }
  }

  return {
    currentDayOfCycle,
    currentPhase,
    daysUntilNextPeriod,
    nextPeriodStartDate,
    nextOvulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    pregnancyChance,
    cycleRegularityScore: regularityScore,
    regularityStatus
  };
}
