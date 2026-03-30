'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wine,
  Sparkles,
  Brain,
  Bot,
  Workflow,
  ArrowRight,
  Upload,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';

const valueProps = [
  {
    icon: Brain,
    title: 'AI-powered valuations',
    description:
      'Get instant, accurate valuations for rare bottles using our proprietary AI trained on millions of auction results and market data.',
  },
  {
    icon: Bot,
    title: '19 autonomous agents',
    description:
      'From lead qualification to deal closing, our AI agents handle the heavy lifting so you can focus on building relationships.',
  },
  {
    icon: Workflow,
    title: 'Automated workflows',
    description:
      'Streamline your operations with intelligent automation that handles inventory, communications, and logistics end-to-end.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgWhatsApp, setOrgWhatsApp] = useState('');

  // Step 0: Hero
  if (step === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#07070D] px-6 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#C9843A]/5 blur-[150px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#C9843A]/10 shadow-lg shadow-[#C9843A]/10">
            <Wine className="h-10 w-10 text-[#C9843A]" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#EEECE7] tracking-tight">
              ENOTECA OS
            </h1>
            <p className="mt-4 text-lg text-[#EEECE7]/50">
              The operating system for rare bottles
            </p>
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-4 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#C9843A] px-10 text-base font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="text-xs text-[#EEECE7]/30">
            Set up your organization in under 2 minutes
          </p>
        </div>
      </div>
    );
  }

  // Step 1: Value Props
  if (step === 1) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#07070D] px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="mb-10 text-center">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-[#C9843A]" />
            <h2 className="text-3xl font-bold text-[#EEECE7]">
              Everything you need
            </h2>
            <p className="mt-2 text-[#EEECE7]/50">
              Built for serious dealers and collectors
            </p>
          </div>

          <div className="space-y-4">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="rounded-xl border border-white/5 bg-[#0D0D15] p-6 transition-all hover:border-[#C9843A]/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C9843A]/10">
                    <prop.icon className="h-5 w-5 text-[#C9843A]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#EEECE7]">
                      {prop.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#EEECE7]/50 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Page Indicators */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === 1 ? 'w-8 bg-[#C9843A]' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9843A] py-4 text-base font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setStep(0)}
            className="mt-3 w-full py-2 text-sm text-[#EEECE7]/40 hover:text-[#EEECE7]/60 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Organization Setup
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07070D] px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <Building2 className="mx-auto mb-4 h-8 w-8 text-[#C9843A]" />
          <h2 className="text-3xl font-bold text-[#EEECE7]">
            Set up your organization
          </h2>
          <p className="mt-2 text-[#EEECE7]/50">
            Tell us about your business
          </p>
        </div>

        <div className="space-y-5">
          {/* Org Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#EEECE7]/70">
              Organization name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EEECE7]/30" />
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enoteca di Marco"
                className="w-full rounded-lg border border-white/10 bg-[#0D0D15] py-3 pl-10 pr-4 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/25 focus:border-[#C9843A] transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#EEECE7]/70">
              Business email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EEECE7]/30" />
              <input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                placeholder="info@enoteca.com"
                className="w-full rounded-lg border border-white/10 bg-[#0D0D15] py-3 pl-10 pr-4 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/25 focus:border-[#C9843A] transition-colors"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#EEECE7]/70">
              WhatsApp number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EEECE7]/30" />
              <input
                type="tel"
                value={orgWhatsApp}
                onChange={(e) => setOrgWhatsApp(e.target.value)}
                placeholder="+39 333 123 4567"
                className="w-full rounded-lg border border-white/10 bg-[#0D0D15] py-3 pl-10 pr-4 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/25 focus:border-[#C9843A] transition-colors"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#EEECE7]/70">
              Organization logo
            </label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-[#0D0D15] p-8 hover:border-[#C9843A]/40 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-2 text-center">
                <Upload className="h-6 w-6 text-[#EEECE7]/30" />
                <p className="text-sm text-[#EEECE7]/50">
                  Drop your logo here or click to upload
                </p>
                <p className="text-xs text-[#EEECE7]/25">PNG, SVG up to 2MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 2 ? 'w-8 bg-[#C9843A]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9843A] py-4 text-base font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20"
        >
          Create Organization
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => setStep(1)}
          className="mt-3 w-full py-2 text-sm text-[#EEECE7]/40 hover:text-[#EEECE7]/60 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
