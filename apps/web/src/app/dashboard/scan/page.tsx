'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Zap, Camera, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

type ScanState = 'camera' | 'processing' | 'result';

export default function ScanPage() {
  const router = useRouter();
  const [state, setState] = useState<ScanState>('camera');
  const [flash, setFlash] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const handleCapture = () => {
    setState('processing');
    setProcessingStep(0);
    const steps = [
      { delay: 500, step: 0 },
      { delay: 1000, step: 1 },
      { delay: 1500, step: 2 },
      { delay: 2000, step: 3 },
      { delay: 2500, step: 4 },
    ];

    steps.forEach(({ delay, step }) => {
      setTimeout(() => {
        if (step === 4) {
          setState('result');
        } else {
          setProcessingStep(step + 1);
        }
      }, delay);
    });
  };

  const processingSteps = [
    'Analyzing label...',
    'Identifying producer & vintage...',
    'Checking authenticity...',
    'Fetching market prices...',
  ];

  return (
    <div className="min-h-screen bg-[#07070D] relative overflow-hidden">
      {state === 'camera' && (
        <div className="absolute inset-0">
          {/* Camera View Simulation */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60">
            <img
              src="https://images.unsplash.com/photo-1717449361883-bda3da0629e7?w=800"
              alt="Camera view"
              className="w-full h-full object-cover opacity-70 blur-sm"
            />
          </div>

          {/* Guide Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Frame */}
              <div className="w-72 h-96 border-2 border-[#C9843A] rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#C9843A] rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#C9843A] rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#C9843A] rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#C9843A] rounded-br-2xl" />
              </div>
              {/* Guide Text */}
              <p className="absolute -bottom-12 left-0 right-0 text-center text-[14px] text-[#A09E96]">
                Position the label inside the frame
              </p>
            </div>
          </div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.12)]"
            >
              <X className="w-6 h-6 text-[#EEECE7]" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlash(!flash)}
                className={`w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.12)] ${
                  flash ? 'bg-[#C9843A]' : ''
                }`}
              >
                <Zap className="w-5 h-5 text-[#EEECE7]" strokeWidth={1.5} fill={flash ? '#EEECE7' : 'none'} />
              </button>
              <button className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.12)]">
                <ImageIcon className="w-5 h-5 text-[#EEECE7]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Capture Button */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center">
            <button
              onClick={handleCapture}
              className="w-16 h-16 rounded-full border-4 border-[#EEECE7] bg-[#C9843A] hover:bg-[#D4A05A] transition-all active:scale-95 shadow-xl"
            >
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-[#07070D]" strokeWidth={2} />
              </div>
            </button>
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          {/* Photo Preview */}
          <div className="w-48 h-64 rounded-2xl overflow-hidden mb-8 shadow-2xl animate-pulse">
            <img
              src="https://images.unsplash.com/photo-1717449361883-bda3da0629e7?w=400"
              alt="Captured bottle"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Processing Steps */}
          <div className="w-full max-w-md space-y-3">
            {processingSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  i < processingStep ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    i < processingStep
                      ? 'bg-[#22C68A]'
                      : 'bg-[#0D0D15] border border-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  {i < processingStep && (
                    <CheckCircle className="w-4 h-4 text-[#07070D]" strokeWidth={2} />
                  )}
                </div>
                <span className="text-[14px] text-[#EEECE7]">{step}</span>
              </div>
            ))}
          </div>

          {/* Sparkle Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#C9843A] rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {state === 'result' && (
        <div className="absolute inset-0">
          {/* Blurred Background */}
          <div className="absolute inset-0 bg-[#07070D]/95 backdrop-blur-xl" />

          {/* Result Card */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#0D0D15]/80 backdrop-blur-xl rounded-t-[20px] border-t border-[rgba(255,255,255,0.06)]">
            <div className="max-w-md mx-auto px-6 py-6">
              {/* Drag Handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-[rgba(255,255,255,0.2)] rounded-full" />
              </div>

              {/* Bottle Info */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1717449361883-bda3da0629e7?w=200"
                    alt="Identified bottle"
                    className="w-20 h-28 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-[20px] font-bold text-[#EEECE7] mb-1 leading-tight">
                      Giacomo Conterno
                    </h2>
                    <p className="text-[16px] text-[#A09E96] mb-2">
                      Barolo Monfortino Riserva 2010
                    </p>
                    <p className="text-[13px] text-[#6B6963]">
                      Barolo DOCG &bull; Piedmont, Italy
                    </p>
                  </div>
                </div>

                {/* Authenticity Badge */}
                <div className="bg-[#22C68A]/10 border border-[#22C68A]/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-[#22C68A]" strokeWidth={1.5} />
                    <span className="text-[14px] font-semibold text-[#22C68A]">
                      Verified Authentic &mdash; 94/100
                    </span>
                  </div>
                  <p className="text-[12px] text-[#A09E96]">
                    High confidence based on label analysis and market data
                  </p>
                </div>

                {/* Price Range */}
                <div className="bg-[#0D0D15] rounded-xl p-4 border border-[rgba(255,255,255,0.06)]">
                  <p className="text-[11px] text-[#6B6963] mb-1">Estimated market value</p>
                  <p className="text-[24px] font-bold text-[#C9843A] font-mono">
                    &euro;650 &mdash; &euro;1,200
                  </p>
                  <p className="text-[12px] text-[#A09E96] mt-1">
                    Based on 6 recent sales
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pb-4">
                <button
                  onClick={() => router.push('/dashboard/bottles')}
                  className="w-full h-12 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[14px] transition-all active:scale-[0.98]"
                >
                  Add to Inventory
                </button>
                <button
                  onClick={() => router.push('/dashboard/deals')}
                  className="w-full h-12 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[14px] transition-all active:scale-[0.98]"
                >
                  Create Valuation
                </button>
                <button
                  onClick={() => {
                    setState('camera');
                    setProcessingStep(0);
                  }}
                  className="w-full h-12 text-[#C9843A] rounded-xl font-medium text-[14px] transition-all"
                >
                  Scan Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
