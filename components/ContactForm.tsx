"use client";

import { useState, type FormEvent } from "react";

type Props = {
  email: string;
  whatsappNumber: string;
  serviceOptions: string[];
  budgetOptions: string[];
  heading: string;
  note: string;
};

/**
 * A project brief that is delivered through the visitor's own WhatsApp or
 * email app, pre-filled and addressed to the team — so every enquiry lands
 * somewhere a person reads, without a server-side mail service.
 */
export default function ContactForm({ email, whatsappNumber, serviceOptions, budgetOptions, heading, note }: Props) {
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleService(option: string) {
    setServices((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
  }

  function compose(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !message) {
      setError("Please add your name and a few words about the project.");
      return null;
    }
    setError(null);
    const lines = [
      `Hi Make It Happen, I'm ${name}${data.get("company") ? ` from ${String(data.get("company")).trim()}` : ""}.`,
      "",
      services.length ? `I need: ${services.join(", ")}` : null,
      budget ? `Budget: ${budget}` : null,
      "",
      message,
      "",
      data.get("email") ? `Email: ${String(data.get("email")).trim()}` : null,
      data.get("phone") ? `Phone: ${String(data.get("phone")).trim()}` : null,
    ].filter((line) => line !== null);
    return { name, text: lines.join("\n") };
  }

  function sendWhatsapp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const brief = compose(event.currentTarget);
    if (!brief) return;
    const digits = whatsappNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(brief.text)}`, "_blank", "noopener,noreferrer");
  }

  function sendEmail(form: HTMLFormElement | null) {
    if (!form) return;
    const brief = compose(form);
    if (!brief) return;
    const subject = `Project enquiry from ${brief.name}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief.text)}`;
  }

  const field =
    "w-full rounded-xl border border-ink/10 bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:bg-white focus:outline-none";

  return (
    <form onSubmit={sendWhatsapp} className="rounded-2xl bg-white p-5 text-ink sm:p-8" noValidate>
      <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{heading}</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Your name *
          <input name="name" autoComplete="name" required className={field} placeholder="Full name" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Company
          <input name="company" autoComplete="organization" className={field} placeholder="Company or brand" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="email" inputMode="email" className={field} placeholder="you@company.com" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Phone
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={field} placeholder="+256 …" />
        </label>
      </div>

      {serviceOptions.length ? (
        <fieldset className="mt-6">
          <legend className="text-sm font-medium">What do you need?</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {serviceOptions.map((option) => {
              const on = services.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleService(option)}
                  aria-pressed={on}
                  className={`rounded-[10px] border px-4 py-2.5 text-sm font-medium transition-colors ${
                    on ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink/40"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {budgetOptions.length ? (
        <fieldset className="mt-6">
          <legend className="text-sm font-medium">Budget</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {budgetOptions.map((option) => {
              const on = budget === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBudget(on ? null : option)}
                  aria-pressed={on}
                  className={`rounded-[10px] border px-4 py-2.5 text-sm font-medium transition-colors ${
                    on ? "border-accent-secondary bg-accent-primary text-ink" : "border-ink/15 bg-white hover:border-ink/40"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <label className="mt-6 flex flex-col gap-1.5 text-sm font-medium">
        About the project *
        <textarea
          name="message"
          rows={5}
          required
          className={`${field} min-h-[8rem] resize-y`}
          placeholder="What are you building, and what should it achieve?"
        />
      </label>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-[#B42318]">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-primary px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-accent-hover"
        >
          Send on WhatsApp
        </button>
        <button
          type="button"
          onClick={(event) => sendEmail(event.currentTarget.form)}
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-ink/15 px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
        >
          Send by email
        </button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{note}</p>
    </form>
  );
}
