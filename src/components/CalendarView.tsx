import React, { useState } from 'react';
import { UserProfile, CyclePrediction, DailyLog } from '../types';
import { diffInDays, formatThaiDate } from '../utils/cycleCalculations';
import { ChevronLeft, ChevronRight, Droplets, Sparkles, Plus, Calendar as CalendarIcon, Heart, Info, Clock, CheckCircle } from 'lucide-react';

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

  // Helper to determine phase of any calendar date
  const getDayInfo = (dateStr: string) => {
    const log = dailyLogs[dateStr];
    if (log?.isPeriodDay) {
      return {
        type: 'period',
        label: 'มีประจำเดือนจริง (บันทึกไว้)',
        color: 'bg-rose-500 text-white shadow-xs font-bold',
        dotColor: 'bg-white'
      };
    }

    // Check if it's predicted period
    const daysFromStart = diffInDays(dateStr, user.lastPeriodStartDate);
    const cycleLength = user.averageCycleLength;
    const cycleDay = ((daysFromStart % cycleLength) + cycleLength) % cycleLength + 1;
    const ovulationDay = cycleLength - 14;

    if (cycleDay <= user.averagePeriodDuration) {
      return {
        type: 'predicted_period',
        label: 'คาดว่ามีประจำเดือน (รอบถัดไป)',
        color: 'bg-rose-100/90 text-rose-700 border border-rose-300 font-semibold',
        dotColor: 'bg-rose-500'
      };
    } else if (cycleDay === ovulationDay) {
      return {
        type: 'ovulation',
        label: 'วันไข่ตก (โอกาสตั้งครรภ์สูงสุด)',
        color: 'bg-purple-600 text-white shadow-xs font-bold ring-2 ring-purple-300',
        dotColor: 'bg-white'
      };
    } else if (cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1) {
      return {
        type: 'fertile',
        label: 'ระยะเจริญพันธุ์ (Fertile Window)',
        color: 'bg-purple-100 text-purple-800 border border-purple-200 font-medium',
        dotColor: 'bg-purple-500'
      };
    } else if (cycleDay > ovulationDay + 1) {
      return {
        type: 'luteal',
        label: 'ระยะลูเทียล (Luteal Phase)',
        color: 'bg-amber-50 text-amber-900 border border-amber-200/80',
        dotColor: 'bg-amber-500'
      };
    } else {
      return {
        type: 'follicular',
        label: 'ระยะฟอลลิคูลาร์ (Follicular Phase)',
        color: 'bg-emerald-50 text-emerald-900 border border-emerald-200/80',
        dotColor: 'bg-emerald-500'
      };
    }
  };

  const selectedDayInfo = getDayInfo(selectedDate);
  const selectedLog = dailyLogs[selectedDate];

  return (
    <div className="space-y-5 pb-16">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            CYCLE CALENDAR
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-rose-500" />
            ปฏิทินรอบเดือนและวันไข่ตก
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCurrentMonthDate(new Date());
              setSelectedDate(todayStr);
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
          >
            วันนี้
          </button>
        </div>
      </div>

      {/* Responsive Grid: 7 cols Calendar, 5 cols Selected Day Details on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Month Navigation + Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-4">
            {/* Month Navigator */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-50">
              <h3 className="text-base font-bold text-slate-800">
                {thaiMonthNames[month]} {year + 543}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                  title="เดือนก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                  title="เดือนถัดไป"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d, i) => (
                <span
                  key={d}
                  className={`text-xs font-bold py-1 ${
                    i === 0 ? 'text-rose-500' : 'text-slate-400'
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty cells before month starts */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-11 sm:h-12 rounded-2xl" />
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
                    className={`relative h-11 sm:h-13 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'ring-3 ring-rose-500 font-bold scale-105 z-10 shadow-md'
                        : 'hover:scale-102 hover:shadow-2xs'
                    } ${info.color}`}
                  >
                    <span className="text-xs sm:text-sm leading-none">{dayNum}</span>

                    {/* Indicator dots */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {hasLog && (
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                      )}
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 ring-1 ring-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Color Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
                <span>มีประจำเดือนจริง (บันทึกไว้)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-100 border border-rose-300 shrink-0" />
                <span>คาดการณ์ประจำเดือนรอบถัดไป</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-600 shrink-0" />
                <span>วันไข่ตก (โอกาสตั้งครรภ์สูงสุด)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-100 border border-purple-200 shrink-0" />
                <span>ระยะเจริญพันธุ์ (Fertile Window)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Date Detail Drawer Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-4 sticky top-16">
            <div className="flex items-center justify-between pb-3 border-b border-rose-50">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  รายละเอียดวันที่เลือก
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  {formatThaiDate(selectedDate, true)}
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${selectedDayInfo.color}`}>
                {selectedDayInfo.label.split(' ')[0]}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100/90 text-xs space-y-1">
                <p className="font-semibold text-rose-900">{selectedDayInfo.label}</p>
                <p className="text-slate-600">
                  {selectedDayInfo.type === 'period'
                    ? 'วันที่มีการบันทึกว่ามีประจำเดือน แนะนำพักผ่อนให้เพียงพอ'
                    : selectedDayInfo.type === 'ovulation'
                    ? 'วันไข่ตก อุณหภูมิร่างกายสูงขึ้นเล็กน้อย เหมาะที่สุดสำหรับผู้ที่วางแผนมีบุตร'
                    : selectedDayInfo.type === 'fertile'
                    ? 'อยู่ในช่วงระยะเจริญพันธุ์ อสุจิสามารถมีชีวิตอยู่ได้ 3-5 วัน'
                    : 'รอบการทำงานของฮอร์โมนตามธรรมชาติ สภาพร่างกายปกติ'}
                </p>
              </div>

              {/* Log Details if exists */}
              {selectedLog ? (
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>ข้อมูลที่บันทึกไว้ในวันนี้</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLog.isPeriodDay && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                        🩸 ปริมาณ: {selectedLog.flow}
                      </span>
                    )}
                    {selectedLog.symptoms.map(s => (
                      <span key={s} className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                        {s}
                      </span>
                    ))}
                    {selectedLog.moods.map(m => (
                      <span key={m} className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {m}
                      </span>
                    ))}
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      💧 {selectedLog.waterGlasses} แก้ว
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      🌙 {selectedLog.sleepHours} ชม.
                    </span>
                  </div>
                  {selectedLog.note && (
                    <p className="text-slate-600 italic mt-2 border-t border-slate-200/60 pt-1.5">
                      "{selectedLog.note}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
                  ยังไม่มีบันทึกอาการในวันที่เลือก
                </div>
              )}

              {/* Add / Edit button */}
              <button
                onClick={() => onSelectDateToLog(selectedDate)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{selectedLog ? 'แก้ไขบันทึกของวันนี้' : 'เพิ่มบันทึกสุขภาพของวันนี้'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
