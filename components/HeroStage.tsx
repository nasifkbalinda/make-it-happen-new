"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * The homepage hero animation: four wordless scenes that show what the studio
 * does — code writing itself, a website assembling, an AI agent answering a
 * customer, and a post taking off on social — joined by a sweep of the logo's
 * lime pixels, looping forever.
 *
 * It is drawn on a fixed 600×480 canvas and scaled to whatever width it is
 * given, so it stays pin-sharp and identical from phones to large screens.
 */

const W = 600;
const H = 480;
const SCENE_MS = 4200;
const SCENES = 4;

type Props = { chatQuestion?: string | null; chatAnswer?: string | null; photoUrl?: string | null };

export default function HeroStage({ chatQuestion, chatAnswer, photoUrl }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scene, setScene] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(true);

  // Fit the fixed canvas to the available width.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Pause while off screen, in a background tab, or for reduced-motion visitors.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const update = () => setRunning(visible && !document.hidden && !reduced.matches);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setScene((current) => {
        const next = (current + 1) % SCENES;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, SCENE_MS);
    return () => window.clearInterval(timer);
  }, [running]);

  const question = chatQuestion?.trim() || "Hi! Can you deliver to Entebbe today?";
  const answer =
    chatAnswer?.trim() || "Yes! Orders placed before 2pm arrive today. Shall I book yours for this afternoon?";

  return (
    <div ref={wrapRef} className="relative w-full select-none" style={{ height: H * scale }} aria-hidden>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <div key={`${cycle}-${scene}`} className="absolute inset-0">
          {scene === 0 ? <CodeScene /> : null}
          {scene === 1 ? <SiteScene /> : null}
          {scene === 2 ? <ChatScene question={question} answer={answer} /> : null}
          {scene === 3 ? <SocialScene photoUrl={photoUrl} /> : null}
          <PixelSweep />
        </div>

        {/* Scene progress */}
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2">
          {Array.from({ length: SCENES }, (_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === scene ? "w-8 bg-accent-primary" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                        */
/* ------------------------------------------------------------------ */

function enter(delayMs: number, extra: CSSProperties = {}): CSSProperties {
  return { animation: `stage-in 700ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms both`, ...extra };
}

/** Lime squares from the logo sweep across as one scene hands over to the next. */
function PixelSweep() {
  const cells = Array.from({ length: 48 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-8 grid-rows-6">
      {cells.map((i) => {
        const col = i % 8;
        const row = Math.floor(i / 8);
        const delay = col * 45 + ((row * 37 + col * 11) % 5) * 25;
        return (
          <span
            key={i}
            className="bg-accent-primary"
            style={{ animation: `pixel-out 520ms steps(4) ${delay}ms both` }}
          />
        );
      })}
    </div>
  );
}

/** Types a string out character by character, starting after `delay` ms. */
function useTyped(text: string, speed: number, delay: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let timer: number | undefined;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            window.clearInterval(timer);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(start);
      if (timer) window.clearInterval(timer);
    };
  }, [text, speed, delay]);
  return count;
}

function WindowDots() {
  return (
    <div className="flex gap-1.5">
      {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
        <span key={color} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 1 — code writes itself                                         */
/* ------------------------------------------------------------------ */

const CODE: { t: string; c: string }[][] = [
  [{ t: "export async function ", c: "#5DD400" }, { t: "payWithMomo", c: "#7CC7FF" }, { t: "(order) {", c: "#E8E8E3" }],
  [{ t: "  const ", c: "#5DD400" }, { t: "payment = ", c: "#E8E8E3" }, { t: "await ", c: "#5DD400" }, { t: "momo.", c: "#E8E8E3" }, { t: "requestToPay", c: "#7CC7FF" }, { t: "({", c: "#E8E8E3" }],
  [{ t: "    amount: ", c: "#9A9A94" }, { t: "order.total,", c: "#E8E8E3" }],
  [{ t: "    currency: ", c: "#9A9A94" }, { t: '"UGX"', c: "#FF9A5C" }, { t: ",", c: "#E8E8E3" }],
  [{ t: "    payer: ", c: "#9A9A94" }, { t: "order.phone,", c: "#E8E8E3" }],
  [{ t: "  });", c: "#E8E8E3" }],
  [{ t: "  await ", c: "#5DD400" }, { t: "notify", c: "#7CC7FF" }, { t: "(order.customer, ", c: "#E8E8E3" }, { t: '"Paid ✓"', c: "#FF9A5C" }, { t: ");", c: "#E8E8E3" }],
  [{ t: "  return ", c: "#5DD400" }, { t: "payment.status === ", c: "#E8E8E3" }, { t: '"SUCCESSFUL"', c: "#FF9A5C" }, { t: ";", c: "#E8E8E3" }],
  [{ t: "}", c: "#E8E8E3" }],
];
// Character offsets, worked out once, so rendering only compares against the typed count.
const CODE_LINES = (() => {
  let offset = 0;
  return CODE.map((line) => {
    const tokens = line.map((token) => {
      const start = offset;
      offset += token.t.length;
      return { ...token, start };
    });
    return { tokens, start: tokens[0]?.start ?? offset, end: offset };
  });
})();
const CODE_LENGTH = CODE_LINES[CODE_LINES.length - 1].end;

function CodeScene() {
  const typed = useTyped("x".repeat(CODE_LENGTH), 11, 350);

  return (
    <div className="absolute inset-x-6 top-8 bottom-10" style={enter(0)}>
      <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">
        <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3">
          <WindowDots />
          <span className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/60">checkout.ts</span>
        </div>
        <pre className="px-5 py-5 font-mono text-[13px] leading-[1.75]">
          {CODE_LINES.map((line, lineIndex) => {
            const typing = typed > line.start && typed < line.end;
            return (
              <div key={lineIndex} className="flex">
                <span className="mr-5 w-4 text-right text-white/20">{lineIndex + 1}</span>
                <span>
                  {line.tokens.map((token, tokenIndex) => (
                    <span key={tokenIndex} style={{ color: token.c }}>
                      {token.t.slice(0, Math.max(0, typed - token.start))}
                    </span>
                  ))}
                  {typing ? <span className="ml-px inline-block h-4 w-2 translate-y-0.5 bg-accent-primary" /> : null}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
      <div
        className="absolute -bottom-3 right-6 flex items-center gap-2 rounded-full bg-accent-primary px-4 py-2 font-mono text-[12px] font-semibold text-[#0b0b0b]"
        style={enter(2900)}
      >
        <span>✓</span> Deployed to production
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 2 — a website assembles                                        */
/* ------------------------------------------------------------------ */

function SiteScene() {
  return (
    <div className="absolute inset-x-6 top-8 bottom-10 overflow-hidden rounded-2xl bg-[#FAFAF7]" style={enter(0)}>
      <div className="flex items-center gap-4 border-b border-black/5 bg-white px-4 py-3">
        <WindowDots />
        <span className="flex-1 rounded-md bg-black/5 px-3 py-1 font-mono text-[11px] text-black/50">yourbusiness.ug</span>
      </div>
      <div className="flex flex-col gap-3 p-5">
        {/* nav */}
        <div className="flex items-center justify-between" style={enter(250)}>
          <span className="h-3 w-20 rounded-full bg-[#0b0b0b]" />
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-10 rounded-full bg-black/15" />
            ))}
            <span className="h-5 w-16 rounded-full bg-[#5DD400]" />
          </div>
        </div>
        {/* hero */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 flex flex-col justify-center gap-2.5 rounded-xl bg-[#0b0b0b] p-5" style={enter(550)}>
            <span className="h-4 w-4/5 rounded-full bg-white" />
            <span className="h-4 w-3/5 rounded-full bg-white" />
            <span className="mt-1 h-2 w-4/5 rounded-full bg-white/30" />
            <span className="h-2 w-2/3 rounded-full bg-white/30" />
            <span className="mt-2 h-6 w-24 rounded-full bg-[#5DD400]" style={enter(1500)} />
          </div>
          <div className="col-span-2 h-[150px] overflow-hidden rounded-xl bg-[#FF7A45]" style={enter(800)}>
            <div className="grid h-full grid-cols-3 grid-rows-3 gap-1.5 p-4">
              {[1, 0, 1, 0, 1, 1, 1, 0, 1].map((on, i) => (
                <span key={i} className={on ? "rounded-[3px] bg-white/80" : ""} />
              ))}
            </div>
          </div>
        </div>
        {/* cards */}
        <div className="grid grid-cols-3 gap-3">
          {["#6EC1FF", "#5DD400", "#FFD23F"].map((color, i) => (
            <div key={color} className="rounded-xl border border-black/5 bg-white p-3" style={enter(1050 + i * 180)}>
              <span className="block h-12 rounded-lg" style={{ backgroundColor: color }} />
              <span className="mt-2.5 block h-2 w-4/5 rounded-full bg-black/60" />
              <span className="mt-1.5 block h-2 w-1/2 rounded-full bg-black/20" />
            </div>
          ))}
        </div>
      </div>
      {/* cursor clicks the call to action */}
      <svg
        className="absolute left-[150px] top-[250px] h-6 w-6 drop-shadow"
        viewBox="0 0 24 24"
        style={{ animation: "cursor-move 1200ms cubic-bezier(0.65,0,0.35,1) 1900ms both" }}
      >
        <path d="M4 2l15 9-7 1.5L8.5 20z" fill="#0b0b0b" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 3 — an AI agent answers a customer                             */
/* ------------------------------------------------------------------ */

function ChatScene({ question, answer }: { question: string; answer: string }) {
  const typed = useTyped(answer, 28, 1500);
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-6">
      <div className="w-[300px] overflow-hidden rounded-[28px] border-[6px] border-[#1c1c1c] bg-[#EFEAE2]" style={enter(0)}>
        <div className="flex items-center gap-3 bg-[#0b0b0b] px-4 py-3 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5DD400] text-[13px] font-bold text-[#0b0b0b]">
            AI
          </span>
          <div>
            <p className="text-[13px] font-semibold">Shop assistant</p>
            <p className="flex items-center gap-1 text-[10px] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5DD400]" /> online · replies instantly
            </p>
          </div>
        </div>
        <div className="flex h-[330px] flex-col gap-3 p-4">
          <div className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-white px-3.5 py-2.5 text-[13px] leading-snug text-[#0b0b0b] shadow-sm" style={enter(300)}>
            {question}
            <span className="mt-1 block text-right text-[9px] text-black/40">09:41</span>
          </div>
          {typed === 0 ? (
            <div className="flex w-16 gap-1 self-start rounded-2xl rounded-bl-md bg-[#0b0b0b] px-3.5 py-3" style={enter(800)}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-[#5DD400]" style={{ animation: `typing-dot 900ms ease-in-out ${i * 150}ms infinite` }} />
              ))}
            </div>
          ) : (
            <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-[#0b0b0b] px-3.5 py-2.5 text-[13px] leading-snug text-white">
              {answer.slice(0, typed)}
              {typed < answer.length ? <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-[#5DD400]" /> : null}
            </div>
          )}
          {typed >= answer.length ? (
            <div className="flex gap-2 self-start" style={enter(150)}>
              {["Book it", "Other times"].map((label, i) => (
                <span
                  key={label}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 0 ? "bg-[#5DD400] text-[#0b0b0b]" : "bg-white text-[#0b0b0b]"}`}
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="absolute right-4 top-24 rounded-full bg-white px-3.5 py-2 font-mono text-[11px] font-semibold text-[#0b0b0b] shadow" style={enter(3000)}>
        answered in 2s
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 4 — a post takes off on social                                 */
/* ------------------------------------------------------------------ */

const FLOATERS = [
  { x: 8, d: 0, k: "heart" },
  { x: 30, d: 260, k: "heart" },
  { x: 55, d: 520, k: "share" },
  { x: 18, d: 780, k: "heart" },
  { x: 70, d: 900, k: "comment" },
  { x: 42, d: 1150, k: "heart" },
  { x: 85, d: 1400, k: "heart" },
  { x: 60, d: 1650, k: "share" },
  { x: 12, d: 1900, k: "heart" },
  { x: 48, d: 2150, k: "heart" },
  { x: 78, d: 2400, k: "comment" },
  { x: 25, d: 2650, k: "heart" },
] as const;

function HeartIcon({ className = "", fill = "#FF3B6B" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill={fill} d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 2.9 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.8 0 5.8 4 4.3 7.3C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
function ShareIcon({ className = "", fill = "#6EC1FF" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill={fill} d="M21 3 3 10.5l7 2.5 2.5 7L21 3z" />
    </svg>
  );
}
function CommentIcon({ className = "", fill = "#FFD23F" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill={fill} d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function useCountUp(to: number, duration: number, delay: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const startAt = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - startAt) / duration));
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, duration, delay]);
  return value;
}

function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function SocialScene({ photoUrl }: { photoUrl?: string | null }) {
  const likes = useCountUp(12400, 3000, 400);
  const views = useCountUp(248000, 3000, 600);

  return (
    <div className="absolute inset-0">
      {/* Feed post */}
      <div className="absolute left-6 top-8 w-[290px] overflow-hidden rounded-2xl bg-white" style={enter(0)}>
        <div className="flex items-center gap-2.5 px-3.5 py-3">
          <span className="h-8 w-8 rounded-full border-2 border-[#FF7A45] bg-[#5DD400]" />
          <div className="leading-tight">
            <p className="text-[12px] font-semibold text-[#0b0b0b]">yourbrand</p>
            <p className="text-[10px] text-black/45">Kampala, Uganda</p>
          </div>
        </div>
        <div className="relative h-[230px] bg-[#5DD400]">
          {photoUrl ? <img src={`${photoUrl}?w=600&auto=format`} alt="" className="h-full w-full object-cover" /> : null}
          <HeartIcon className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2" fill="white" />
        </div>
        <div className="flex items-center gap-3.5 px-3.5 pt-3">
          <HeartIcon className="h-6 w-6" />
          <CommentIcon className="h-6 w-6" fill="#0b0b0b" />
          <ShareIcon className="h-6 w-6" fill="#0b0b0b" />
        </div>
        <p className="px-3.5 pb-3.5 pt-1.5 text-[12px] font-semibold text-[#0b0b0b]">{compact(likes)} likes</p>
      </div>

      {/* Short video */}
      <div className="absolute right-8 top-4 h-[400px] w-[225px] overflow-hidden rounded-[26px] border-[5px] border-[#1c1c1c] bg-[#0b0b0b]" style={enter(250)}>
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-7 gap-1 p-4 opacity-90">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              className="rounded-[3px]"
              style={{ backgroundColor: ["#5DD400", "#FF7A45", "#6EC1FF", "#FFD23F", "transparent", "transparent", "transparent"][(i * 5) % 7], opacity: 0.85 }}
            />
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-14 text-white">
          <p className="text-[12px] font-semibold">@yourbrand</p>
          <p className="mt-1 text-[11px] leading-snug text-white/80">New drop, made in Kampala</p>
          <p className="mt-2 font-mono text-[10px] text-white/60">{compact(views)} views</p>
        </div>
        <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4">
          {[
            { icon: <HeartIcon className="h-7 w-7" />, n: compact(Math.round(likes * 2.3)) },
            { icon: <CommentIcon className="h-7 w-7" fill="white" />, n: compact(Math.round(likes / 9)) },
            { icon: <ShareIcon className="h-7 w-7" fill="white" />, n: compact(Math.round(likes / 4)) },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-white">
              {item.icon}
              {item.n}
            </div>
          ))}
        </div>
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            className="absolute bottom-10"
            style={{ left: `${f.x}%`, animation: `float-up 2200ms ease-out ${f.d}ms both` }}
          >
            {f.k === "heart" ? <HeartIcon className="h-7 w-7" /> : f.k === "share" ? <ShareIcon className="h-6 w-6" /> : <CommentIcon className="h-6 w-6" />}
          </span>
        ))}
      </div>
    </div>
  );
}
