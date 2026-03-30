'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Zap,
  X,
  RotateCcw,
  CheckCircle2,
  Shield,
  TrendingUp,
  Package,
  FileText,
  ScanLine,
  Loader2,
  ChevronDown,
} from 'lucide-react';

const processingSteps = [
  { label: 'Analyzing label', duration: 1200 },
  { label: 'Identifying producer', duration: 1000 },
  { label: 'Checking authenticity', duration: 1400 },
  { label: 'Fetching prices', duration: 800 },
];

const mockResult = {
  name: 'Sassicaia 2018',
  producer: 'Tenuta San Guido',
  region: 'Bolgheri, Toscana',
  vintage: 2018,
  type: 'Red Wine',
  grape: 'Cabernet Sauvignon, Cabernet Franc',
  authenticity: 'Verified',
  authenticityScore: 97,
  priceRange: { low: 180, high: 240 },
  marketTrend: '+12% last 12 months',
  rating: '96/100 Wine Spectator',
};

export default function ScanPage() {
  const router = useRouter();
  const [state, setState] = useState<'camera' | 'processing' | 'result'>('camera');
  const [flashOn, setFlashOn] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Processing animation
  useEffect(() => {
    if (state !== 'processing') return;

    setCurrentStep(0);
    setCompletedSteps([]);

    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex >= processingSteps.length) {
        setTimeout(() => setState('result'), 400);
        return;
      }
      setCurrentStep(stepIndex);
      const timeout = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex++;
        runStep();
      }, processingSteps[stepIndex].duration);
      return () => clearTimeout(timeout);
    };

    const cleanup = runStep();
    return cleanup;
  }, [state]);

  // Camera View
  if (state === 'camera') {
    return (
      <div className="relative flex min-h-[calc(100vh-64px)] flex-col bg-[#07070D]">
        {/* Simulated camera view */}
        <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-[#111118] to-[#07070D] overflow-hidden">
          {/* Camera grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-1/3 top-0 h-full w-px bg-white" />
            <div className="absolute left-2/3 top-0 h-full w-px bg-white" />
            <div className="absolute left-0 top-1/3 h-px w-full bg-white" />
            <div className="absolute left-0 top-2/3 h-px w-full bg-white" />
          </div>

          {/* Targeting frame */}
          <div className="relative h-72 w-56 md:h-96 md:w-72">
            {/* Corner brackets */}
            <div className="absolute -left-1 -top-1 h-8 w-8 border-l-2 border-t-2 border-[#C9843A] rounded-tl-lg" />
            <div className="absolute -right-1 -top-1 h-8 w-8 border-r-2 border-t-2 border-[#C9843A] rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-[#C9843A] rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-2 border-r-2 border-[#C9843A] rounded-br-lg" />

            {/* Scanning line animation */}
            <div className="absolute inset-x-2 top-0 h-full overflow-hidden">
              <div className="animate-pulse">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#C9843A]/60 to-transparent" />
              </div>
            </div>

            {/* Center hint */}
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center px-4">
              <ScanLine className="h-8 w-8 text-[#EEECE7]/30" />
              <p className="text-sm text-[#EEECE7]/40">
                Posiziona la bottiglia nel riquadro
              </p>
            </div>
          </div>

          {/* Top bar */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-[#EEECE7] hover:bg-black/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-[#EEECE7]/70">Scan Bottle</span>
            <button
              onClick={() => setFlashOn(!flashOn)}
              className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
                flashOn
                  ? 'bg-[#C9843A] text-white'
                  : 'bg-black/40 text-[#EEECE7] hover:bg-black/60'
              }`}
            >
              <Zap className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-center gap-8 bg-[#0D0D15] px-6 py-8 border-t border-white/5">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-[#EEECE7]/60 hover:bg-white/5 transition-colors">
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Capture button */}
          <button
            onClick={() => setState('processing')}
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#C9843A] bg-[#C9843A]/10 transition-all hover:bg-[#C9843A]/20 active:scale-95"
          >
            <div className="h-14 w-14 rounded-full bg-[#C9843A] flex items-center justify-center shadow-lg shadow-[#C9843A]/30">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-[#EEECE7]/60 hover:bg-white/5 transition-colors">
            <Camera className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Processing View
  if (state === 'processing') {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-[#07070D] px-6">
        <div className="w-full max-w-sm">
          {/* Spinning indicator */}
          <div className="mb-10 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#C9843A]" />
              <ScanLine className="h-10 w-10 text-[#C9843A]" />
            </div>
          </div>

          <h2 className="mb-8 text-center text-xl font-bold text-[#EEECE7]">
            Analyzing bottle...
          </h2>

          {/* Processing steps */}
          <div className="space-y-4">
            {processingSteps.map((step, i) => {
              const isCompleted = completedSteps.includes(i);
              const isCurrent = currentStep === i && !isCompleted;

              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                    isCurrent
                      ? 'bg-[#C9843A]/10 border border-[#C9843A]/20'
                      : isCompleted
                        ? 'bg-[#0D0D15] border border-white/5'
                        : 'bg-[#0D0D15]/50 border border-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#C9843A]" />
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded-full border border-white/10" />
                  )}
                  <span
                    className={`text-sm ${
                      isCurrent
                        ? 'text-[#EEECE7] font-medium'
                        : isCompleted
                          ? 'text-[#EEECE7]/60'
                          : 'text-[#EEECE7]/30'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Result View
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#07070D]">
      {/* Image area placeholder */}
      <div className="relative flex h-72 items-center justify-center bg-gradient-to-b from-[#1a1020] to-[#0D0D15]">
        <div className="flex flex-col items-center gap-2 text-[#EEECE7]/30">
          <Camera className="h-12 w-12" />
          <span className="text-sm">Scanned image</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => setState('camera')}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-[#EEECE7] hover:bg-black/60 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom sheet */}
      <div className="relative -mt-6 flex-1 rounded-t-3xl bg-[#0D0D15] px-6 pt-4 pb-8 border-t border-white/5">
        {/* Drag indicator */}
        <div className="mb-6 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Bottle info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#EEECE7]">{mockResult.name}</h1>
          <p className="mt-1 text-sm text-[#EEECE7]/50">{mockResult.producer}</p>
          <p className="text-sm text-[#EEECE7]/40">
            {mockResult.region} &middot; {mockResult.type}
          </p>
        </div>

        {/* Authenticity badge */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3">
          <Shield className="h-5 w-5 text-green-400" />
          <div>
            <p className="text-sm font-semibold text-green-400">
              {mockResult.authenticity} &middot; {mockResult.authenticityScore}% confidence
            </p>
            <p className="text-xs text-green-400/60">
              Label, capsule, and glass verified
            </p>
          </div>
        </div>

        {/* Price range */}
        <div className="mb-6 rounded-xl border border-white/5 bg-[#07070D] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#EEECE7]/50">Estimated value</span>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <TrendingUp className="h-3.5 w-3.5" />
              {mockResult.marketTrend}
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#C9843A]">
              &euro;{mockResult.priceRange.low}
            </span>
            <span className="text-lg text-[#EEECE7]/40"> &ndash; </span>
            <span className="text-3xl font-bold text-[#C9843A]">
              &euro;{mockResult.priceRange.high}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#EEECE7]/40">{mockResult.rating}</p>
        </div>

        {/* Details dropdown */}
        <button className="mb-6 flex w-full items-center justify-between rounded-xl border border-white/5 bg-[#07070D] px-5 py-4 text-sm text-[#EEECE7]/60 hover:bg-white/[0.02] transition-colors">
          <span>View full details</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard/bottles')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9843A] py-4 text-sm font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20"
          >
            <Package className="h-4 w-4" />
            Add to Inventory
          </button>

          <button
            onClick={() => router.push('/dashboard/deals')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9843A]/30 bg-[#C9843A]/10 py-4 text-sm font-semibold text-[#C9843A] transition-all hover:bg-[#C9843A]/15"
          >
            <FileText className="h-4 w-4" />
            Create Valuation
          </button>

          <button
            onClick={() => {
              setState('camera');
              setCompletedSteps([]);
              setCurrentStep(0);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-4 text-sm font-medium text-[#EEECE7]/60 transition-all hover:bg-white/5"
          >
            <Camera className="h-4 w-4" />
            Scan Another
          </button>
        </div>
      </div>
    </div>
  );
}
