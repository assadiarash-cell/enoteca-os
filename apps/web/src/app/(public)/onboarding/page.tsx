'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wine, Sparkles, Bot, Zap, Upload, ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgWhatsApp, setOrgWhatsApp] = useState('');
  const [orgWhatsAppPrefix, setOrgWhatsAppPrefix] = useState('');

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070D] text-[#EEECE7] overflow-hidden">
      {step === 0 && (
        <div className="relative h-screen flex flex-col items-center justify-end">
          {/* Hero Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1765850257843-aa029ab7769c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3aW5lJTIwY2VsbGFyJTIwZGFya3xlbnwxfHx8fDE3NzQ4MTcxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Wine cellar"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#07070D]/60 via-transparent to-[#07070D]" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-md mx-auto px-4 pb-16">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#C9843A]/10 border border-[#C9843A]/20 flex items-center justify-center">
                <Wine className="w-8 h-8 text-[#C9843A]" strokeWidth={1.5} />
              </div>
            </div>

            {/* Text */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#EEECE7] tracking-tight mb-3">
                ENOTECA OS
              </h1>
              <p className="text-[16px] text-[#A09E96]">
                The operating system for rare bottles
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleNext}
              className="w-full h-14 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[16px] transition-all active:scale-[0.97]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-[28px] font-bold text-[#EEECE7] mb-3 leading-tight">
                Autonomous wine operations
              </h2>
              <p className="text-[16px] text-[#A09E96]">
                Built for professional dealers
              </p>
            </div>

            {/* Value Cards */}
            <div className="space-y-4">
              <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C9843A]/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-[#C9843A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-2">
                      AI-powered valuations
                    </h3>
                    <p className="text-[14px] text-[#A09E96]">
                      Get accurate market prices in 90 seconds with our AI analysis engine
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C9843A]/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-[#C9843A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-2">
                      19 autonomous agents
                    </h3>
                    <p className="text-[14px] text-[#A09E96]">
                      Working 24/7 on acquisitions, pricing, listings, and deal closure
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C9843A]/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#C9843A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-2">
                      Automated workflows
                    </h3>
                    <p className="text-[14px] text-[#A09E96]">
                      From WhatsApp inquiry to deal closure, fully automated
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-2 pt-8">
              <div className="w-2 h-2 rounded-full bg-[#6B6963]" />
              <div className="w-6 h-2 rounded-full bg-[#C9843A]" />
              <div className="w-2 h-2 rounded-full bg-[#6B6963]" />
            </div>

            <button
              onClick={handleNext}
              className="w-full h-14 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[16px] transition-all active:scale-[0.97] flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-[28px] font-bold text-[#EEECE7] mb-3">
                Setup your organization
              </h2>
              <p className="text-[16px] text-[#A09E96]">
                Let&apos;s configure your workspace
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organization name"
                  className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  WhatsApp Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={orgWhatsAppPrefix}
                    onChange={(e) => setOrgWhatsAppPrefix(e.target.value)}
                    placeholder="+39"
                    className="w-20 h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                  />
                  <input
                    type="tel"
                    value={orgWhatsApp}
                    onChange={(e) => setOrgWhatsApp(e.target.value)}
                    placeholder="123 456 7890"
                    className="flex-1 h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  Organization Logo
                </label>
                <div className="w-full h-32 bg-[#1C1C2A] border-2 border-dashed border-[rgba(255,255,255,0.12)] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#C9843A]/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-[#6B6963]" strokeWidth={1.5} />
                  <span className="text-[14px] text-[#6B6963]">Upload logo</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-2 pt-8 pb-4">
              <div className="w-2 h-2 rounded-full bg-[#6B6963]" />
              <div className="w-2 h-2 rounded-full bg-[#6B6963]" />
              <div className="w-6 h-2 rounded-full bg-[#C9843A]" />
            </div>

            <button
              onClick={handleNext}
              className="w-full h-14 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[16px] transition-all active:scale-[0.97]"
            >
              Create Organization
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
