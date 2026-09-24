import React, { useState } from 'react';
import { UserProfile, CyclePrediction, DailyLog, PastCycle } from '../types';
import { addDays, diffInDays, formatThaiDate } from '../utils/cycleCalculations';
import { ChevronLeft, ChevronRight, Droplets, Sparkles, Plus, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  user: UserProfile;
  prediction: CyclePrediction;
  dailyLogs: Record<string, DailyLog>;
  onSelectDateToLog: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  user,
  prediction,
  dailyLogs,
  onSelectDateToLog
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const thaiMonthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Helper to determine phase of any calendar date based on cycle length and last period
  const getDayInfo = (dateStr: string) => {
    const log = dailyLogs[dateStr];
    if (log?.isPeriodDay) {
      return { type: 'period', label: 'มีประจำเดือน', color: 'bg-rose-500 text-white' };
    }

    // Check if it's predicted period
    const daysFromStart = diffInDays(dateStr, user.lastPeriodStartDate);
    const cycleLength = user.averageCycleLength;
    const cycleDay = ((daysFromStart % cycleLength) + cycleLength) % cycleLength + 1;

    const ovulationDay = cycleLength - 14;

    if (cycleDay <= user.averagePeriodDuration) {
      return { type: 'predicted_period', label: 'คาดว่ามีประจำเดือน', color: 'bg-rose-100 text-rose-700 border border-rose-300' };
    } else if (cycleDay === ovulationDay) {
      return { type: 'ovulation', label: 'วันไข่ตก (โอกาสท้องสูงสุด)', color: 'bg-purple-600 text-white shadow-xs' };
    } else if (cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1) {
      return { type: 'fertile', label: 'ระยะเจริญพันธุ์ (Fertile Window)', color: 'bg-purple-100 text-purple-700' };
    } else if (cycleDay > ovulationDay + 1) {
      return { type: 'luteal', label: 'ระยะลูเทียล (ก่อนรอบถัดไป)', color: 'bg-amber-100 text-amber-800' };
    } else {
      return { type: 'follicular', label: 'ระยะฟอลลิคูลาร์', color: 'bg-emerald-100 text-emerald-800' };
    }
  };

  const selectedDayInfo = getDayInfo(selectedDate);
  const selectedLog = dailyLogs[selectedDate];

  return (
    <div className="space-y-4 pb-20">
      {/* Header Month Nav */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 border border-rose-100 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            CYCLE CALENDAR
          </span>
          <h2 className="text-base font-bold text-slate-800">
            {thaiMonthNames[month]} {year + 543}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d, i) => (
            <span
              key={d}
              className={`text-[11px] font-semibold ${
                i === 0 ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 rounded-xl" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const info = getDayInfo(dStr);
            const isToday = dStr === todayStr;
            const isSelected = dStr === selectedDate;
            const hasLog = !!dailyLogs[dStr];

            return (
              <button
                key={dStr}
                onClick={() => setSelectedDate(dStr)}
                className={`relative h-11 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'ring-2 ring-rose-500 font-bold scale-105 z-10'
                    : 'hover:bg-rose-50/50'
                } ${info.color}`}
              >
                <span className="text-xs font-semibold leading-none">{dayNum}</span>

                {/* Sub-dot for log */}
                <div className="flex gap-0.5 mt-1">
                  {hasLog && (
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                  )}
                  {isToday && (
                    <span className="w-1 h-1 rounded-full bg-rose-600 ring-1 ring-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Color Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <span>มีประจำเดือนจริง (บันทึกไว้)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-300 shrink-0" />
            <span>คาดการณ์ประจำเดือนรอบถัดไป</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
            <span>วันไข่ตก (Ovulation Day)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-100 shrink-0" />
            <span>ระยะเจริญพันธุ์ (Fertile Window)</span>
          </div>
        </div>
      </div>

      {/* Selected Date Detail Drawer Card */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-rose-500 uppercase">
              SELECTED DAY OVERVIEW
            </p>
            <h3 className="text-sm font-bold text-slate-800">
              {formatThaiDate(selectedDate)}
            </h3>
          </div>
          <button
            onClick={() => onSelectDateToLog(selectedDate)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{selectedLog ? 'แก้ไขบันทึก' : 'บันทึกวันนี้'}</span>
          </button>
        </div>

        {/* Phase Info of this day */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">สถานะฮอร์โมนวันนั้น:</span>
            <span className="font-bold text-rose-600">{selectedDayInfo.label}</span>
          </div>
        </div>

        {/* Logged details if any */}
        {selectedLog ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {selectedLog.isPeriodDay && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-medium">
                  🩸 เลือดประจำเดือน: {selectedLog.flow}
                </span>
              )}
              {selectedLog.symptoms.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {s}
                </span>
              ))}
              {selectedLog.moods.map(m => (
                <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium">
                  {m}
                </span>
              ))}
              {selectedLog.hadSex && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                  💕 มีเพศสัมพันธ์ ({selectedLog.isProtectedSex ? 'ป้องกัน' : 'ไม่ป้องกัน'})
                </span>
              )}
            </div>
            {selectedLog.note && (
              <p className="text-xs text-slate-600 italic bg-rose-50/40 p-2.5 rounded-xl border border-rose-100">
                "{selectedLog.note}"
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-2">
            ยังไม่มีบันทึกอาการในวันนี้ แตะปุ่มด้านบนเพื่อบันทึก
          </p>
        )}
      </div>
    </div>
  );
};
