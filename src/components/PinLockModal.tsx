import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, X } from 'lucide-react';

interface PinLockModalProps {
  correctPin: string;
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  mode?: 'verify' | 'set_new';
  onSetNewPin?: (newPin: string) => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  correctPin,
  isOpen,
  onSuccess,
  onCancel,
  mode = 'verify',
  onSetNewPin
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        if (mode === 'verify') {
          if (nextPin === correctPin || correctPin === '') {
            setTimeout(() => {
              setPin('');
              onSuccess();
            }, 150);
          } else {
            setErrorMsg('รหัส PIN ไม่ถูกต้อง ลองอีกครั้งนะ');
            setTimeout(() => setPin(''), 500);
          }
        } else if (mode === 'set_new') {
          if (step === 'enter') {
            setConfirmPin(nextPin);
            setStep('confirm');
            setPin('');
          } else {
            if (nextPin === confirmPin) {
              onSetNewPin?.(nextPin);
              setTimeout(() => {
                setPin('');
                setStep('enter');
                onSuccess();
              }, 200);
            } else {
              setErrorMsg('รหัสไม่ตรงกัน กรุณาตั้งค่าใหม่อีกครั้ง');
              setTimeout(() => {
                setPin('');
                setStep('enter');
                setConfirmPin('');
              }, 600);
            }
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/40 backdrop-blur-md p-4">
      <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 flex flex-col items-center">
        {onCancel && (
          <div className="w-full flex justify-end">
            <button
              onClick={onCancel}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-3 shadow-inner">
          {mode === 'verify' ? <Lock className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
        </div>

        <h3 className="text-base font-semibold text-slate-800">
          {mode === 'verify'
            ? 'ความเป็นส่วนตัว AuraFem'
            : step === 'enter'
            ? 'ตั้งรหัส PIN 4 หลัก'
            : 'ยืนยันรหัส PIN อีกครั้ง'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 text-center">
          {mode === 'verify'
            ? 'ใส่รหัสเพื่อปลดล็อกข้อมูลสุขภาพของคุณ'
            : 'เพื่อป้องกันไม่ให้ผู้อื่นมองเห็นข้อมูลรอบเดือน'}
        </p>

        {/* PIN Dots */}
        <div className="flex gap-4 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-rose-500 scale-110 shadow-sm'
                    : 'bg-rose-100 border border-rose-200'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-500 font-medium mb-3 animate-shake">
            {errorMsg}
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="w-14 h-14 rounded-full bg-slate-50 hover:bg-rose-50 active:scale-95 text-lg font-semibold text-slate-700 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
            >
              {digit}
            </button>
          ))}
          <div className="w-14 h-14" />
          <button
            onClick={() => handleKeyPress('0')}
            className="w-14 h-14 rounded-full bg-slate-50 hover:bg-rose-50 active:scale-95 text-lg font-semibold text-slate-700 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-full bg-slate-50 hover:bg-rose-50 active:scale-95 text-xs font-medium text-slate-500 transition-all flex items-center justify-center border border-slate-100"
          >
            ลบ
          </button>
        </div>

        {mode === 'verify' && correctPin && (
          <p className="text-[11px] text-slate-400 mt-4 text-center">
            (PIN ทดสอบ: <span className="font-mono text-slate-600">{correctPin}</span>)
          </p>
        )}
      </div>
    </div>
  );
};
