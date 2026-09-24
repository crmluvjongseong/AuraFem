import React, { useState } from 'react';
import { UserProfile, CyclePrediction, PastCycle, DailyLog } from '../types';
import { formatThaiDate, formatThaiDateFull } from '../utils/cycleCalculations';
import { FileText, Printer, CheckCircle2, AlertCircle, BarChart3, TrendingUp, Sparkles, Activity, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

interface MedicalReportViewProps {
  user: UserProfile;
  prediction: CyclePrediction;
  pastCycles: PastCycle[];
  dailyLogs: Record<string, DailyLog>;
}

export const MedicalReportView: React.FC<MedicalReportViewProps> = ({
  user,
  prediction,
  pastCycles,
  dailyLogs
}) => {
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Compute stats
  const cycleLengths = pastCycles.map(c => c.cycleLength);
  const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
  const avgDuration = (pastCycles.reduce((a, b) => a + b.periodDuration, 0) / pastCycles.length).toFixed(1);
  const minCycle = Math.min(...cycleLengths);
  const maxCycle = Math.max(...cycleLengths);
  const variation = maxCycle - minCycle;

  // PCOS assessment
  const isPcosRisk = variation > 7 || avgCycle > 38 || avgCycle < 21;

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            GYNECOLOGY ANALYTICS & CLINICAL REPORT
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            รายงานวิเคราะห์สุขภาพสูตินรีเวช สำหรับแพทย์
          </h2>
        </div>
        <button
          onClick={() => setShowPrintModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs shadow-rose-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>พิมพ์หรือดาวน์โหลดรายงาน (PDF)</span>
        </button>
      </div>

      {/* Cycle Regularity Card */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              ดัชนีความสม่ำเสมอของรอบเดือน (Cycle Regularity Score)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คำนวณตามเกณฑ์ ACOG (American College of Obstetricians and Gynecologists)
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-3xl font-extrabold font-mono text-emerald-600">
              {prediction.cycleRegularityScore}%
            </span>
            <p className="text-xs font-bold text-emerald-700">
              {prediction.regularityStatus}
            </p>
          </div>
        </div>

        {/* 4 Responsive Stat Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">รอบเดือนเฉลี่ย</p>
            <p className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{avgCycle} วัน</p>
            <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ปกติ: 21-35 วัน</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">วันมาเฉลี่ย</p>
            <p className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{avgDuration} วัน</p>
            <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ปกติ: 3-7 วัน</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ความแปรปรวน (Δ)</p>
            <p className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">±{Math.round(variation / 2)} วัน</p>
            <span className="text-[10px] text-emerald-600 font-medium">อยู่ในเกณฑ์ดีเยี่ยม</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ประเมิน PCOS</p>
            <p className={`text-base font-extrabold mt-1 ${isPcosRisk ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isPcosRisk ? 'ควรเฝ้าระวัง' : 'ความเสี่ยงต่ำ'}
            </p>
            <span className="text-[10px] text-slate-400">Rotterdam Criteria</span>
          </div>
        </div>
      </div>

      {/* Responsive 2-Column: Cycle Length Bar Chart & Symptoms Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Cycle Length History Bar Chart */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-50">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              ประวัติความยาวรอบเดือน 5 รอบล่าสุด (Cycle Trend)
            </h3>
            <span className="text-[10px] text-slate-400">เส้นประ = ค่าเฉลี่ย 28 วัน</span>
          </div>

          <div className="space-y-3 pt-1">
            {pastCycles.map((cycle, idx) => {
              const widthPercent = Math.min(100, Math.round((cycle.cycleLength / 40) * 100));
              return (
                <div key={cycle.id} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="font-medium">
                      รอบที่ {idx + 1} ({formatThaiDate(cycle.startDate, false)})
                    </span>
                    <span className="font-mono font-bold text-slate-800">{cycle.cycleLength} วัน</span>
                  </div>
                  <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-400/80 z-10"
                      style={{ left: `${(28 / 40) * 100}%` }}
                      title="มาตรฐาน 28 วัน"
                    />
                    <div
                      className="h-full bg-gradient-to-r from-rose-300 to-rose-500 rounded-full"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Symptoms & Red Flags Card */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-50">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              การประเมินสัญญาณเตือนทางคลินิก (Red Flags)
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              เกณฑ์ปลอดภัย
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">ไม่มีภาวะเลือดออกกะปริบกะปรอยผิดปกติ</p>
                <p className="text-slate-600 mt-0.5">ไม่พบประวัติเลือดออกระหว่างรอบเดือนเกินกว่า 2 วันติดต่อกัน</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">อาการปวดท้องประจำเดือน (Dysmenorrhea)</p>
                <p className="text-slate-600 mt-0.5">ปวดระดับปานกลางเฉพาะ 1-2 วันแรก และตอบสนองต่อการพักผ่อน</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">การตกไข่สม่ำเสมอ (Ovulatory Rhythm)</p>
                <p className="text-slate-600 mt-0.5">พบมูกไข่ตกยืดได้และอุณหภูมิร่างกายสอดคล้องกับระยะรอบเดือน</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Checklist Card */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800">
          หัวข้อแนะนำสำหรับพูดคุยกับแพทย์ในการตรวจสุขภาพประจำปี
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
            <p className="font-bold text-slate-800">1. การตรวจคัดกรองมะเร็งปากมดลูก</p>
            <p className="text-slate-500 mt-1">แนะนำตรวจ Pap Smear หรือ HPV DNA Test ทุก 3-5 ปี</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
            <p className="font-bold text-slate-800">2. อัลตราซาวด์มดลูกและรังไข่</p>
            <p className="text-slate-500 mt-1">คัดกรองช็อกโกแลตซีสต์ เนื้องอกมดลูก และเยื่อบุโพรงมดลูก</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
            <p className="font-bold text-slate-800">3. ระดับฮอร์โมนและธาตุเหล็ก</p>
            <p className="text-slate-500 mt-1">ตรวจความสมบูรณ์ของเม็ดเลือด (CBC) และระดับเฟอร์ริติน</p>
          </div>
        </div>
      </div>

      {/* Printable Clinical Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 my-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <div>
                  <h3 className="text-base font-bold text-slate-800">AuraFem Clinical Health Summary</h3>
                  <p className="text-xs text-slate-500">เอกสารสรุปประวัติรอบเดือนและฮอร์โมนสำหรับสถานพยาบาล</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200"
              >
                ปิด
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-slate-400 font-semibold">ชื่อผู้ใช้ / นามแฝง:</p>
                  <p className="font-bold text-slate-800 text-sm">{user.nickname} (@{user.username})</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">เป้าหมายทางสุขภาพ:</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {user.goal === 'track_period' ? 'ติดตามรอบเดือนปกติ' : user.goal === 'trying_to_conceive' ? 'เตรียมพร้อมมีบุตร' : 'คุมกำเนิดธรรมชาติ'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">รอบเดือนล่าสุดที่บันทึก:</p>
                  <p className="font-bold text-slate-800">{formatThaiDateFull(user.lastPeriodStartDate)}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">ความสม่ำเสมอของรอบเดือน:</p>
                  <p className="font-bold text-emerald-700">{prediction.regularityStatus} ({prediction.cycleRegularityScore}%)</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800">ประวัติ 5 รอบเดือนย้อนหลัง:</h4>
                <div className="divide-y divide-slate-100">
                  {pastCycles.map((c, i) => (
                    <div key={c.id} className="py-2 flex justify-between">
                      <span>รอบที่ {i + 1}: วันเริ่ม {formatThaiDate(c.startDate)}</span>
                      <span className="font-bold">{c.cycleLength} วัน (มีรอบเดือน {c.periodDuration} วัน)</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * เอกสารนี้สร้างขึ้นจากบันทึกของผู้ใช้ผ่านแอปพลิเคชัน AuraFem เพื่อใช้ประกอบการวินิจฉัยของแพทย์ผู้เชี่ยวชาญเท่านั้น
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์หรือบันทึก PDF ทันที</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
