import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  Apple,
  FileText,
  PlusCircle,
  BookOpen,
  Users,
  Smartphone,
  Tablet,
  Monitor,
  Heart,
  Shield,
  Plus
} from 'lucide-react';
import { UserProfile } from '../types';

export type DeviceViewMode = 'mobile' | 'tablet' | 'desktop';
export type NavTab = 'home' | 'calendar' | 'tracker' | 'nutrition' | 'report' | 'partner';

interface MobileFrameProps {
  children: React.ReactNode;
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onOpenDoc: () => void;
  onOpenProfile: () => void;
  onLockPin: () => void;
  user: UserProfile;
  deviceMode?: DeviceViewMode;
  onDeviceModeChange?: (mode: DeviceViewMode) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  currentTab,
  onChangeTab,
  onOpenDoc,
  onOpenProfile,
  onLockPin,
  user,
  deviceMode: externalDeviceMode,
  onDeviceModeChange
}) => {
  const [internalDeviceMode, setInternalDeviceMode] = useState<DeviceViewMode>('mobile');
  const activeDeviceMode = externalDeviceMode || internalDeviceMode;

  const handleSetMode = (mode: DeviceViewMode) => {
    if (onDeviceModeChange) {
      onDeviceModeChange(mode);
    } else {
      setInternalDeviceMode(mode);
    }
  };

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'home', label: 'หน้าหลัก', icon: Home },
    { id: 'calendar', label: 'ปฏิทิน', icon: Calendar },
    { id: 'tracker', label: 'บันทึก', icon: PlusCircle, isCenter: true },
    { id: 'nutrition', label: '4 ระยะ', icon: Apple },
    { id: 'report', label: 'ผลตรวจ', icon: FileText },
  ];

  // =========================================================================
  // 1. DESKTOP VIEW (Full Width Workspace with Left Sidebar)
  // =========================================================================
  if (activeDeviceMode === 'desktop') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col select-none text-slate-800">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 px-6 py-2.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white text-lg shadow-xs">
              🌸
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 tracking-tight">AuraFem Desktop</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">PRO FEMTECH</span>
              </div>
              <p className="text-[11px] text-slate-400">ระบบติดตามประจำเดือน วิเคราะห์ฮอร์โมน และสุขภาพเฉพาะบุคคล</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => handleSetMode('mobile')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all text-slate-600 hover:text-slate-900"
                title="สลับเป็นจอมือถือ (Original Mobile View)"
              >
                <Smartphone className="w-3.5 h-3.5 text-rose-500" />
                <span>มือถือ</span>
              </button>
              <button
                onClick={() => handleSetMode('tablet')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all text-slate-600 hover:text-slate-900"
                title="แท็บเล็ต iPad"
              >
                <Tablet className="w-3.5 h-3.5 text-indigo-500" />
                <span>แท็บเล็ต</span>
              </button>
              <button
                onClick={() => handleSetMode('desktop')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all bg-white text-rose-600 shadow-xs"
                title="เดสก์ท็อป"
              >
                <Monitor className="w-3.5 h-3.5 text-rose-500" />
                <span>เดสก์ท็อป</span>
              </button>
            </div>

            <button
              onClick={onOpenDoc}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-rose-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold shadow-2xs transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              <span>คู่มือสถาปัตยกรรม (Full Spec)</span>
            </button>
          </div>
        </header>

        {/* Desktop Body with Left Sidebar */}
        <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
          {/* Left Sidebar */}
          <aside className="w-64 border-r border-rose-100/80 bg-white p-5 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              {/* User Profile Card */}
              <div
                onClick={onOpenProfile}
                className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100/80 flex items-center gap-3 cursor-pointer hover:bg-rose-100/50 transition-colors"
                title="คลิกเพื่อแก้ไขโปรไฟล์"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-200/80 flex items-center justify-center text-xl shrink-0">
                  🌸
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.nickname}</p>
                  <p className="text-[11px] text-rose-600 font-semibold truncate">
                    {user.goal === 'track_period' ? '🌸 ติดตามรอบเดือน' : user.goal === 'trying_to_conceive' ? '🍼 เตรียมมีบุตร' : user.goal === 'contraception' ? '🛡️ คุมกำเนิด' : '🩺 สุขภาพ PCOS'}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 text-xs">
                <button
                  onClick={() => onChangeTab('home')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all ${
                    currentTab === 'home' ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/20' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>หน้าหลัก (Dashboard)</span>
                </button>

                <button
                  onClick={() => onChangeTab('calendar')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all ${
                    currentTab === 'calendar' ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/20' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>ปฏิทินและวันไข่ตก</span>
                </button>

                <button
                  onClick={() => onChangeTab('nutrition')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all ${
                    currentTab === 'nutrition' ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/20' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <Apple className="w-4 h-4" />
                  <span>โภชนาการตาม 4 ระยะ</span>
                </button>

                <button
                  onClick={() => onChangeTab('partner')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all ${
                    currentTab === 'partner' ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/20' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>โหมดเชื่อมต่อคนรัก</span>
                </button>

                <button
                  onClick={() => onChangeTab('report')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all ${
                    currentTab === 'report' ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/20' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>รายงานสูตินรีเวช (PDF)</span>
                </button>
              </nav>

              {/* Quick Log Button */}
              <button
                onClick={() => onChangeTab('tracker')}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs rounded-2xl shadow-sm shadow-rose-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ บันทึกอาการวันนี้</span>
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              {user.isPinEnabled && (
                <button
                  onClick={onLockPin}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>ล็อกหน้าจอความเป็นส่วนตัว</span>
                </button>
              )}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">AuraFem Web v2.4</p>
                <p>สูตินรีเวชศาสตร์ & โภชนาการตามธรรมชาติ</p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. TABLET VIEW (iPad Frame with 2-Column Comfort)
  // =========================================================================
  if (activeDeviceMode === 'tablet') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 select-none text-slate-800">
        {/* Top Controls Bar */}
        <header className="w-full max-w-3xl flex items-center justify-between px-2 py-2 mb-2 no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-rose-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              AuraFem Tablet View
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => handleSetMode('mobile')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>มือถือ</span>
              </button>
              <button
                onClick={() => handleSetMode('tablet')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500 text-white font-semibold shadow-xs"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>แท็บเล็ต</span>
              </button>
              <button
                onClick={() => handleSetMode('desktop')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>เดสก์ท็อป</span>
              </button>
            </div>

            <button
              onClick={onOpenDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              <span>Full Spec</span>
            </button>
          </div>
        </header>

        {/* Tablet Frame */}
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-300/80 overflow-hidden flex flex-col min-h-[880px] max-h-[92vh]">
          {/* Tablet Status Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="font-mono">{currentTime}</span>
            <span className="text-[11px] text-slate-400">AuraFem iPad Studio</span>
            <div className="flex items-center gap-2">
              <span>📶 Wi-Fi</span>
              <span>🔋 100%</span>
            </div>
          </div>

          {/* Scrollable Viewport */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
            {children}
          </main>

          {/* Tablet Bottom Nav */}
          <nav className="bg-white/95 backdrop-blur-md border-t border-rose-100 px-6 py-2 shadow-lg">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentTab === item.id;
                if (item.isCenter) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChangeTab('tracker')}
                      className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>บันทึกอาการ</span>
                    </button>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => onChangeTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. ORIGINAL MOBILE VIEW (EXACTLY AS IN FIRST BUILD)
  // =========================================================================
  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      {/* Top Desktop Controls Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between px-4 py-2 mb-2 no-print">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-rose-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            AuraFem Mobile App
          </span>
          <span className="hidden sm:inline text-xs text-slate-400">·</span>
          <span className="hidden sm:inline text-xs text-slate-500">FemTech Personal Health & Menstrual Rhythm</span>
        </div>

        {/* Zone 2: Navigation / Device switchers */}
        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="flex items-center bg-white/90 p-0.5 rounded-xl border border-rose-200/80 text-xs shadow-2xs">
            <button
              onClick={() => handleSetMode('mobile')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all bg-rose-500 text-white shadow-xs font-semibold"
              title="จำลองจอมือถือ (Original Mobile View)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>มือถือ</span>
            </button>

            <button
              onClick={() => handleSetMode('tablet')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all text-slate-600 hover:text-slate-900"
              title="แท็บเล็ต iPad"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>แท็บเล็ต</span>
            </button>

            <button
              onClick={() => handleSetMode('desktop')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all text-slate-600 hover:text-slate-900"
              title="เดสก์ท็อปเต็มหน้าจอ"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>เดสก์ท็อป</span>
            </button>
          </div>

          <button
            onClick={onOpenDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold shadow-2xs transition-all"
            title="ดูคู่มือสถาปัตยกรรมและคอนเซปต์ 7 หัวข้อ"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">คู่มือสถาปัตยกรรม (Full Spec)</span>
            <span className="sm:hidden">Spec</span>
          </button>
        </div>
      </header>

      {/* Main Container: Smartphone frame (EXACT FIRST BUILD PROPORTIONS & NOTCH) */}
      <div
        className="w-full transition-all duration-300 relative flex flex-col bg-rose-50/20 sm:shadow-2xl sm:border border-slate-200/80 overflow-hidden max-w-md min-h-screen sm:min-h-[840px] sm:max-h-[880px] sm:rounded-[40px] ring-12 ring-slate-900/5"
      >
        {/* Smartphone Notch & Status Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 pt-2 pb-1 flex items-center justify-between border-b border-rose-100/50 text-[11px] font-semibold text-slate-700">
          <span className="font-mono">{currentTime}</span>

          {/* Center speaker/camera pill on mobile frame */}
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
          </div>

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

            {/* 5. Medical Report */}
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
