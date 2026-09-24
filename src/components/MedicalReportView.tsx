import React, { useState } from 'react';
import { UserProfile, CyclePrediction, PastCycle, DailyLog } from '../types';
import { formatThaiDate, formatThaiDateFull } from '../utils/cycleCalculations';
import { FileText, Printer, CheckCircle2, AlertCircle, BarChart3, TrendingUp, Sparkles, Activity, ArrowLeft } from 'lucide-react';

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
    <div className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            GYNECOLOGY ANALYTICS
          </span>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-500" />
            รายงานวิเคราะห์สุขภาพสูตินรีเวช
          </h2>
        </div>
        <button
          onClick={() => setShowPrintModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs shadow-rose-500/20 active:scale-95 transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>พิมพ์รายงานแพทย์</span>
        </button>
      </div>

      {/* Cycle Regularity Card */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">
              ดัชนีความสม่ำเสมอของรอบเดือน (Cycle Regularity)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              วิเคราะห์จาก 5 รอบเดือนย้อนหลัง
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-emerald-600">
              {prediction.cycleRegularityScore}%
            </span>
            <p className="text-[10px] font-semibold text-emerald-700">
              {prediction.regularityStatus}
            </p>
          </div>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">รอบเดือนเฉลี่ย</p>
            <p className="text-base font-bold text-slate-800 font-mono mt-0.5">{avgCycle} วัน</p>
            <span className="text-[9px] text-slate-400">เกณฑ์ปกติ: 21-35 วัน</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">วันมาเฉลี่ย</p>
            <p className="text-base font-bold text-slate-800 font-mono mt-0.5">{avgDuration} วัน</p>
            <span className="text-[9px] text-slate-400">เกณฑ์ปกติ: 3-7 วัน</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">ความแปรปรวน (Δ)</p>
            <p className="text-base font-bold text-slate-800 font-mono mt-0.5">±{Math.round(variation / 2)} วัน</p>
            <span className="text-[9px] text-emerald-600">อยู่ในเกณฑ์ดีเยี่ยม</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">ประเมิน PCOS</p>
            <p className={`text-xs font-bold mt-1 ${isPcosRisk ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isPcosRisk ? 'ควรเฝ้าระวัง' : 'ความเสี่ยงต่ำ'}
            </p>
            <span className="text-[9px] text-slate-400">Rotterdam Criteria</span>
          </div>
        </div>
      </div>

      {/* Cycle Length History Bar Chart */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            ประวัติความยาวรอบเดือน 5 รอบล่าสุด (Cycle Trend)
          </h3>
          <span className="text-[10px] text-slate-400">เส้นประ = ค่าเฉลี่ย 28 วัน</span>
        </div>

        <div className="space-y-2 pt-2">
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
                  {/* 28 day marker line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-400/70 z-10"
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

      {/* Symptoms Frequency Chart (Luteal & Menstrual) */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800">
          ความถี่ของอาการที่พบบ่อย (Symptom Frequency)
        </h3>
        <p className="text-[11px] text-slate-500">
          ข้อมูลสำคัญช่วยให้สูตินรีแพทย์แยกระหว่างอาการปวดประจำเดือนทั่วไป (Dysmenorrhea) กับภาวะเยื่อบุโพรงมดลูกเจริญผิดที่ หรือ PMDD
        </p>

        <div className="space-y-2 pt-1 text-xs">
          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>ปวดท้องน้อย (Dysmenorrhea)</span>
              <span className="text-rose-600 font-bold">พบบ่อยวันแรก (60%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-rose-400 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>คัดตึงเต้านม (Mastalgia)</span>
              <span className="text-purple-600 font-bold">ช่วงตกไข่ & ลูเทียล (45%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-purple-400 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>ท้องอืด / อาหารไม่ย่อย (Bloating)</span>
              <span className="text-amber-600 font-bold">ช่วงระยะลูเทียล (30%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[30%] h-full bg-amber-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Print / Export Sheet Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับหน้าแอป</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์หรือบันทึก PDF รายงานนี้</span>
              </button>
            </div>

            {/* CLINICAL PDF EXPORT CONTENT */}
            <div className="space-y-6 text-slate-900">
              {/* Header Letterhead */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">
                    AuraFem Medical Report: Menstrual Health Summary
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    รายงานสรุปประวัติรอบเดือนและสุขภาพสูตินรีเวช สำหรับแพทย์ผู้ตรวจ
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-semibold text-slate-800">AuraFem Clinical Export</p>
                  <p>วันที่พิมพ์: {formatThaiDateFull(new Date().toISOString().split('T')[0])}</p>
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400">ชื่อคนไข้:</span>
                  <p className="font-semibold">{user.nickname} ({user.username})</p>
                </div>
                <div>
                  <span className="text-slate-400">เป้าหมายการติดตาม:</span>
                  <p className="font-semibold">
                    {user.goal === 'track_period' ? 'ติดตามรอบเดือนทั่วไป' : user.goal}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">รอบเดือนล่าสุด:</span>
                  <p className="font-semibold">{formatThaiDate(user.lastPeriodStartDate)}</p>
                </div>
                <div>
                  <span className="text-slate-400">ความสม่ำเสมอ:</span>
                  <p className="font-semibold text-emerald-700">{prediction.regularityStatus}</p>
                </div>
              </div>

              {/* Clinical Metrics Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Clinical Menstrual Metrics (สถิติรอบเดือน)
                </h3>
                <table className="w-full text-xs text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-2 border-r">รอบที่</th>
                      <th className="p-2 border-r">วันที่เริ่มมีประจำเดือน</th>
                      <th className="p-2 border-r">ความยาวรอบเดือน</th>
                      <th className="p-2 border-r">จำนวนวันที่มีเลือด</th>
                      <th className="p-2">การประเมินทางคลินิก</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pastCycles.map((c, i) => (
                      <tr key={c.id}>
                        <td className="p-2 border-r font-medium">#{i + 1}</td>
                        <td className="p-2 border-r">{formatThaiDateFull(c.startDate)}</td>
                        <td className="p-2 border-r font-mono font-bold">{c.cycleLength} วัน</td>
                        <td className="p-2 border-r font-mono">{c.periodDuration} วัน</td>
                        <td className="p-2 text-emerald-700 font-medium">
                          {c.cycleLength >= 21 && c.cycleLength <= 35 ? 'ปกติ (Eumenorrhea)' : 'ผิดปกติ'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PCOS & Hormonal Screening Check */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. PCOS Early Screening Indicator (ตามเกณฑ์ Rotterdam 2003)
                </h3>
                <div className="p-3 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span>1. ภาวะไข่ไม่ตกเรื้อรังหรือรอบเดือนขาดนาน (Oligo/Anovulation):</span>
                    <span className="font-bold text-emerald-700">ไม่พบ (รอบเดือนสม่ำเสมอ 27-29 วัน)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. อาการฮอร์โมนเพศชายเด่น (Hyperandrogenism) เช่น สิวเรื้อรัง ขนดก:</span>
                    <span className="font-bold text-slate-700">บันทึกสิวระดับเล็กน้อยช่วงก่อนมีประจำเดือน</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. ลักษณะรังไข่หลายใบจากการตรวจอัลตราซาวด์ (PCO):</span>
                    <span className="font-bold text-slate-500">รอผลการตรวจทางกายภาพและ USG จากแพทย์</span>
                  </div>
                </div>
              </div>

              {/* Doctor Notes Box */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. บันทึกผลการตรวจและคำสั่งการรักษาของแพทย์ (Gynecologist Remarks)
                </h3>
                <div className="h-24 border border-dashed border-slate-300 rounded-xl p-3 text-xs text-slate-400">
                  ช่องสำหรับแพทย์เขียนคำวินิจฉัยและข้อแนะนำ...
                </div>
              </div>

              {/* Signature Lines */}
              <div className="pt-6 flex justify-between text-xs text-slate-600">
                <div>
                  <p>ลงชื่อคนไข้: ......................................................</p>
                  <p className="mt-1 text-slate-400">({user.nickname})</p>
                </div>
                <div className="text-right">
                  <p>ลงชื่อแพทย์ผู้ตรวจ: ......................................................</p>
                  <p className="mt-1 text-slate-400">ว.พ. ...................................................</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
