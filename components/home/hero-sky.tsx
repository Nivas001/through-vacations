/** Decorative sky behind the hero: warm sun, drifting clouds and a plane flying a dotted route. */
export function HeroSky() {
  const route = "M -60 210 C 140 70, 420 10, 660 55 S 1040 70, 1300 -30";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* sun */}
      <div className="sun-pulse absolute -top-40 right-[18%] size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(255_210_63/.55),rgb(255_210_63/.12)_45%,transparent_70%)]" />
      {/* clouds */}
      {[
        { top: "8%", w: 220, dur: "75s", delay: "-10s", o: 0.22 },
        { top: "30%", w: 140, dur: "55s", delay: "-40s", o: 0.16 },
        { top: "62%", w: 260, dur: "95s", delay: "-60s", o: 0.12 },
        { top: "18%", w: 110, dur: "48s", delay: "-25s", o: 0.18 },
      ].map((c, i) => (
        <svg key={i} viewBox="0 0 200 80" width={c.w} className="cloud-drift absolute left-0" style={{ top: c.top, opacity: c.o, ["--dur" as string]: c.dur, animationDelay: c.delay }}>
          <path fill="#fff" d="M38 70h132a28 28 0 0 0 2-56 40 40 0 0 0-74-6A30 30 0 0 0 52 30a20 20 0 0 0-14 40z" />
        </svg>
      ))}
      {/* flight route with a plane along it */}
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 hidden size-full sm:block">
        <path id="hero-route" d={route} fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" className="route-dash" />
        <circle cx="1005" cy="62" r="5" fill="#ffd23f" />
        <circle cx="1005" cy="62" r="14" fill="none" stroke="#ffd23f" strokeOpacity=".5" strokeWidth="2">
          <animate attributeName="r" values="8;22;8" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values=".6;0;.6" dur="3s" repeatCount="indefinite" />
        </circle>
        <g className="hero-plane">
          <g>
            <path fill="#ffd23f" d="M-14 -2 L4 -2 L12 -12 L16 -12 L11 -2 L18 -2 L22 -6 L25 -6 L22 1 L25 8 L22 8 L18 4 L11 4 L16 14 L12 14 L4 4 L-14 4 Q-18 1 -14 -2 Z" transform="scale(0.85)" />
            <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#hero-route" />
            </animateMotion>
          </g>
        </g>
      </svg>
    </div>
  );
}
