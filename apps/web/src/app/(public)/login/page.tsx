'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wine, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07070D] px-6 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/5 bg-[#0D0D15] p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9843A]/10">
              <Wine className="h-7 w-7 text-[#C9843A]" />
            </div>
            <h1 className="text-2xl font-bold text-[#EEECE7]">Welcome back</h1>
            <p className="text-sm text-[#EEECE7]/50">
              Sign in to your ENOTECA OS account
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Mail className="h-6 w-6 text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-[#EEECE7]">Check your email</h2>
              <p className="text-sm text-[#EEECE7]/50">
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
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#EEECE7]/70"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EEECE7]/30" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-[#07070D] py-3 pl-10 pr-4 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/25 focus:border-[#C9843A] transition-colors"
                  />
                </div>
              </div>

              {/* Send Magic Link */}
              <button
                onClick={() => {
                  if (email) setSubmitted(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9843A] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20"
              >
                Send magic link
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-[#EEECE7]/30">or continue with</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Apple Sign In */}
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#07070D] py-3 text-sm font-medium text-[#EEECE7] transition-all hover:bg-white/5 hover:border-white/20">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Sign in with Apple
              </button>
            </>
          )}
        </div>

        {/* Footer Links */}
        <p className="mt-8 text-center text-xs text-[#EEECE7]/30">
          By signing in, you agree to our{' '}
          <Link href="#" className="text-[#EEECE7]/50 underline hover:text-[#EEECE7]/70">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-[#EEECE7]/50 underline hover:text-[#EEECE7]/70">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
