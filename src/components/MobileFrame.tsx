import React from 'react';
import { Home, Calendar, PlusCircle, Apple, FileText, Heart, Shield, BookOpen, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'home' | 'calendar' | 'tracker' | 'nutrition' | 'report' | 'partner';

interface MobileFrameProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenDoc: () => void;
  onOpenProfile: () => void;
  onLockPin: () => void;
  user: UserProfile;
  isExpandedView: boolean;
  onToggleExpand: () => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentTab,
  onChangeTab,
  onOpenDoc,
  onOpenProfile,
  onLockPin,
  user,
  isExpandedView,
  onToggleExpand,
  children
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      {/* Top Desktop Controls Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between px-4 py-2 mb-2 no-print">
        {/* Zone 1: Brand title single element */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-rose-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            AuraFem Mobile App
          </span>
          <span className="hidden sm:inline text-xs text-slate-400">·</span>
          <span className="hidden sm:inline text-xs text-slate-500">FemTech Personal Health & Menstrual Rhythm</span>
        </div>

        {/* Zone 2: Navigation / Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold shadow-2xs transition-all"
            title="ดูคู่มือสถาปัตยกรรมและคอนเซปต์ 7 หัวข้อ"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-500" />
            <span>คู่มือสถาปัตยกรรม (Full Spec)</span>
          </button>

          <button
            onClick={onToggleExpand}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-all shadow-2xs"
            title={isExpandedView ? 'เปลี่ยนเป็นจอมือถือ' : 'ขยายเต็มจอ'}
          >
            {isExpandedView ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isExpandedView ? 'กรอบมือถือ' : 'ขยายจอ'}</span>
          </button>
        </div>
      </header>

      {/* Main Container: Smartphone frame or responsive wrapper */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col bg-rose-50/20 sm:shadow-2xl sm:border border-slate-200/80 overflow-hidden ${
          isExpandedView
            ? 'max-w-3xl min-h-[90vh] sm:rounded-3xl'
            : 'max-w-md min-h-screen sm:min-h-[840px] sm:max-h-[880px] sm:rounded-[40px] ring-12 ring-slate-900/5'
        }`}
      >
        {/* Smartphone Notch & Status Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 pt-2 pb-1 flex items-center justify-between border-b border-rose-100/50 text-[11px] font-semibold text-slate-700">
          <span className="font-mono">{currentTime}</span>

          {/* Center speaker/camera pill on mobile frame */}
          {!isExpandedView && (
            <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-600 text-[10px]">
            <span>5G</span>
            <span>📶</span>
            <span>🔋 98%</span>
          </div>
        </div>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
          {children}
        </main>

        {/* Fixed Mobile Bottom Tab Bar */}
        <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100/80 px-2 py-1.5 shadow-lg">
          <div className="grid grid-cols-5 items-center">
            {/* 1. Home */}
            <button
              onClick={() => onChangeTab('home')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentTab === 'home' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">หน้าหลัก</span>
            </button>

            {/* 2. Calendar */}
            <button
              onClick={() => onChangeTab('calendar')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentTab === 'calendar' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calendar className={`w-5 h-5 ${currentTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">ปฏิทิน</span>
            </button>

            {/* 3. Center Daily Tracker Trigger */}
            <button
              onClick={() => onChangeTab('tracker')}
              className="min-h-[44px] flex flex-col items-center justify-center -mt-3 group"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-active:scale-95 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-rose-600 mt-0.5">บันทึก</span>
            </button>

            {/* 4. Nutrition Guide */}
            <button
              onClick={() => onChangeTab('nutrition')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentTab === 'nutrition' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Apple className={`w-5 h-5 ${currentTab === 'nutrition' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">4 ระยะ</span>
            </button>

            {/* 5. Medical Report / Partner */}
            <button
              onClick={() => onChangeTab('report')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                currentTab === 'report' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText className={`w-5 h-5 ${currentTab === 'report' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">ผลตรวจ</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};
