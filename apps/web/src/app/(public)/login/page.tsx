'use client';

import { useState } from 'react';
import { Wine, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#07070D] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-[#C9843A]/10 border border-[#C9843A]/20 flex items-center justify-center">
            <Wine className="w-8 h-8 text-[#C9843A]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-bold text-[#EEECE7] mb-2">
            Welcome back
          </h1>
          <p className="text-[16px] text-[#A09E96]">
            Sign in to your account
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <Mail className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-[#EEECE7]">Check your email</h2>
            <p className="text-sm text-[#A09E96]">
              We sent a magic link to <span className="font-medium text-[#EEECE7]/80">{email}</span>.
              Click the link to sign in.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-sm text-[#C9843A] hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
              />
            </div>

            {/* Magic Link Button */}
            <button
              onClick={() => {
                if (email) setSubmitted(true);
              }}
              className="w-full h-12 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[16px] transition-all active:scale-[0.97] flex items-center justify-center gap-2 mb-6"
            >
              <Mail className="w-5 h-5" />
              Send magic link
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
              <span className="text-[12px] text-[#6B6963]">or continue with</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            </div>

            {/* Apple Sign In */}
            <button className="w-full h-12 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[16px] transition-all active:scale-[0.97] flex items-center justify-center gap-2 mb-8">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Sign in with Apple
            </button>

            {/* Footer */}
            <p className="text-center text-[12px] text-[#6B6963]">
              By continuing you agree to our{' '}
              <a href="#" className="text-[#C9843A] hover:underline">Terms</a>
              {' & '}
              <a href="#" className="text-[#C9843A] hover:underline">Privacy</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
