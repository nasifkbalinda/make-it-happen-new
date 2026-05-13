"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
          First name
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D7FF65] focus:outline-none"
            placeholder="Jane"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
          Last name
          <input
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D7FF65] focus:outline-none"
            placeholder="Doe"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D7FF65] focus:outline-none"
          placeholder="you@company.com"
        />
      </label>
      <label className="flex min-h-0 flex-1 flex-col gap-2 text-sm font-medium text-white/80">
        Message
        <textarea
          name="message"
          rows={4}
          required
          className="min-h-[7.5rem] resize-y bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D7FF65] focus:outline-none"
          placeholder="Tell us about your project…"
        />
      </label>
      {sent ? (
        <p className="text-center text-sm text-[#D7FF65]" role="status">
          Thanks — we&apos;ll be in touch shortly.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={sent}
        className="mt-1 w-full rounded-full bg-[#D7FF65] py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Send message
      </button>
    </form>
  );
}
