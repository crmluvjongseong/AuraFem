/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, PastCycle, CyclePhase } from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadDailyLogs,
  saveDailyLog,
  loadPastCycles,
  savePastCycles,
  getTodayDateStr
} from './utils/storage';
import { calculateCyclePrediction } from './utils/cycleCalculations';
import { MobileFrame, NavTab } from './components/MobileFrame';
import { HomeDashboard } from './components/HomeDashboard';
import { CalendarView } from './components/CalendarView';
import { DailyTrackerModal } from './components/DailyTrackerModal';
import { NutritionPhaseGuide } from './components/NutritionPhaseGuide';
import { PartnerSyncView } from './components/PartnerSyncView';
import { MedicalReportView } from './components/MedicalReportView';
import { OnboardingModal } from './components/OnboardingModal';
import { PinLockModal } from './components/PinLockModal';
import { SpecDocModal } from './components/SpecDocModal';
import { Heart, Users } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(loadDailyLogs);
  const [pastCycles, setPastCycles] = useState<PastCycle[]>(loadPastCycles);

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerDate, setTrackerDate] = useState<string>(getTodayDateStr());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSpecDocOpen, setIsSpecDocOpen] = useState(false);
  const [isPinLocked, setIsPinLocked] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [selectedPhaseGuide, setSelectedPhaseGuide] = useState<CyclePhase>('follicular');

  const todayStr = getTodayDateStr();

  // Compute prediction dynamically
  const prediction = calculateCyclePrediction(
    user.lastPeriodStartDate,
    user.averageCycleLength,
    user.averagePeriodDuration,
    pastCycles,
    todayStr
  );

  const todayLog = dailyLogs[todayStr];

  // Save profile updates
  const handleSaveProfile = (updated: UserProfile) => {
    setUser(updated);
    saveUserProfile(updated);
  };

  // Save log updates
  const handleSaveLog = (newLog: DailyLog) => {
    saveDailyLog(newLog);
    setDailyLogs(prev => ({
      ...prev,
      [newLog.date]: newLog
    }));

    // If marked as period day and user has no last period set or this is a new cycle start
    if (newLog.isPeriodDay && newLog.date > user.lastPeriodStartDate) {
      // If gap is more than 15 days, it could be a new cycle!
      const daysDiff = (new Date(newLog.date).getTime() - new Date(user.lastPeriodStartDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff >= 20) {
        // Record completed past cycle
        const completedCycle: PastCycle = {
          id: `cycle_${Date.now()}`,
          startDate: user.lastPeriodStartDate,
          endDate: newLog.date,
          cycleLength: Math.round(daysDiff),
          periodDuration: user.averagePeriodDuration
        };
        const updatedPast = [...pastCycles, completedCycle];
        setPastCycles(updatedPast);
        savePastCycles(updatedPast);

        // Update current cycle start date
        const updatedUser = { ...user, lastPeriodStartDate: newLog.date };
        setUser(updatedUser);
        saveUserProfile(updatedUser);
      }
    }
  };

  const handleOpenTrackerForDate = (dateStr: string) => {
    setTrackerDate(dateStr);
    setIsTrackerOpen(true);
  };

  const handleOpenPhaseGuide = (phaseKey?: string) => {
    if (phaseKey && ['menstrual', 'follicular', 'ovulation', 'luteal'].includes(phaseKey)) {
      setSelectedPhaseGuide(phaseKey as CyclePhase);
    }
    setCurrentTab('nutrition');
  };

  return (
    <>
      <MobileFrame
        currentTab={currentTab}
        onChangeTab={(tab) => {
          if (tab === 'tracker') {
            handleOpenTrackerForDate(todayStr);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenDoc={() => setIsSpecDocOpen(true)}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onLockPin={() => setIsPinLocked(true)}
        user={user}
        isExpandedView={isExpandedView}
        onToggleExpand={() => setIsExpandedView(!isExpandedView)}
      >
        {/* Sub-navigation bar inside app for Partner sync */}
        <div className="flex items-center justify-between mb-3 px-1 no-print">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">เป้าหมาย:</span>
            <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              {user.goal === 'track_period' ? '🌸 ติดตามรอบเดือน' : user.goal === 'trying_to_conceive' ? '🍼 เตรียมมีบุตร' : user.goal === 'contraception' ? '🛡️ คุมกำเนิด' : '🩺 สุขภาพ PCOS'}
            </span>
          </div>

          <button
            onClick={() => setCurrentTab('partner')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'partner'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-white border border-rose-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>โหมดคู่รัก</span>
          </button>
        </div>

        {/* Tab 1: Home Dashboard */}
        {currentTab === 'home' && (
          <HomeDashboard
            user={user}
            prediction={prediction}
            todayLog={todayLog}
            onOpenTracker={() => handleOpenTrackerForDate(todayStr)}
            onOpenProfile={() => setIsOnboardingOpen(true)}
            onOpenPhaseGuide={handleOpenPhaseGuide}
            onLockPin={() => setIsPinLocked(true)}
          />
        )}

        {/* Tab 2: Calendar */}
        {currentTab === 'calendar' && (
          <CalendarView
            user={user}
            prediction={prediction}
            dailyLogs={dailyLogs}
            onSelectDateToLog={handleOpenTrackerForDate}
          />
        )}

        {/* Tab 3: Nutrition & 4 Phases Guide */}
        {currentTab === 'nutrition' && (
          <NutritionPhaseGuide initialPhase={selectedPhaseGuide} />
        )}

        {/* Tab 4: Partner Sync */}
        {currentTab === 'partner' && (
          <PartnerSyncView
            user={user}
            prediction={prediction}
            onUpdatePartnerSettings={(partial) => {
              handleSaveProfile({ ...user, ...partial });
            }}
          />
        )}

        {/* Tab 5: Medical Report */}
        {currentTab === 'report' && (
          <MedicalReportView
            user={user}
            prediction={prediction}
            pastCycles={pastCycles}
            dailyLogs={dailyLogs}
          />
        )}
      </MobileFrame>

      {/* Daily Tracker Modal */}
      {isTrackerOpen && (
        <DailyTrackerModal
          isOpen={isTrackerOpen}
          onClose={() => setIsTrackerOpen(false)}
          dateStr={trackerDate}
          existingLog={dailyLogs[trackerDate]}
          onSaveLog={handleSaveLog}
        />
      )}

      {/* Onboarding & Profile Modal */}
      {isOnboardingOpen && (
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          currentProfile={user}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {/* Privacy PIN Lock Modal */}
      <PinLockModal
        isOpen={isPinLocked}
        correctPin={user.pinCode || '1234'}
        onSuccess={() => setIsPinLocked(false)}
        onCancel={() => setIsPinLocked(false)}
      />

      {/* Full 7-Section Architecture & Spec Doc Modal */}
      <SpecDocModal
        isOpen={isSpecDocOpen}
        onClose={() => setIsSpecDocOpen(false)}
      />
    </>
  );
}
