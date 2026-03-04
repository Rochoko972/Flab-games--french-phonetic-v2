import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// ESCAPE FLAB: PHONÉTIQUE — French Pronunciation (A1)
// 30+ levels • For English speakers • 100% autonomous
// ═══════════════════════════════════════════════════════════════

// ── GAME CONSTANTS ────────────────────────────────────────────

const GEMS_PER_LEVEL = 10;
const BONUS_PERFECT = 5;

// ── PHONETIC DATA ─────────────────────────────────────────────

const ALPHABET = [
  { letter: "A", ipa: "/a/", sound: "ah", example: "ami", exampleEn: "friend", tip: "Open mouth wide, like 'ah' at the doctor" },
  { letter: "B", ipa: "/be/", sound: "bay", example: "bébé", exampleEn: "baby", tip: "Same as English B" },
  { letter: "C", ipa: "/se/", sound: "say", example: "café", exampleEn: "coffee", tip: "Like 'say' — NOT 'see'" },
  { letter: "D", ipa: "/de/", sound: "day", example: "dîner", exampleEn: "dinner", tip: "Like 'day' — tongue touches top teeth" },
  { letter: "E", ipa: "/ə/", sound: "uh", example: "le", exampleEn: "the", tip: "Short neutral sound like 'uh' — lips slightly rounded" },
  { letter: "F", ipa: "/ɛf/", sound: "eff", example: "fille", exampleEn: "girl", tip: "Same as English F" },
  { letter: "G", ipa: "/ʒe/", sound: "zhay", example: "garage", exampleEn: "garage", tip: "Soft 'zh' like pleasure — NOT 'jee'" },
  { letter: "H", ipa: "/aʃ/", sound: "ahsh", example: "hôtel", exampleEn: "hotel", tip: "ALWAYS silent in French!" },
  { letter: "I", ipa: "/i/", sound: "ee", example: "idée", exampleEn: "idea", tip: "Like 'ee' in see — lips spread wide" },
  { letter: "J", ipa: "/ʒi/", sound: "zhee", example: "jour", exampleEn: "day", tip: "Like 'zh' in measure — NOT 'jay'" },
  { letter: "K", ipa: "/ka/", sound: "kah", example: "kilo", exampleEn: "kilo", tip: "Same as English K" },
  { letter: "L", ipa: "/ɛl/", sound: "ell", example: "lune", exampleEn: "moon", tip: "Tongue tip touches upper teeth" },
  { letter: "M", ipa: "/ɛm/", sound: "em", example: "maman", exampleEn: "mom", tip: "Same as English M" },
  { letter: "N", ipa: "/ɛn/", sound: "en", example: "nuit", exampleEn: "night", tip: "Same as English N" },
  { letter: "O", ipa: "/o/", sound: "oh", example: "orange", exampleEn: "orange", tip: "Lips rounded, like 'oh' — more rounded than English" },
  { letter: "P", ipa: "/pe/", sound: "pay", example: "papa", exampleEn: "dad", tip: "Like 'pay' — no aspiration (less puff of air)" },
  { letter: "Q", ipa: "/ky/", sound: "kew", example: "quatre", exampleEn: "four", tip: "Like 'kew' — always followed by U" },
  { letter: "R", ipa: "/ɛʁ/", sound: "air", example: "rouge", exampleEn: "red", tip: "Throat sound! Gargle gently — not tongue roll" },
  { letter: "S", ipa: "/ɛs/", sound: "ess", example: "soleil", exampleEn: "sun", tip: "Same as English S" },
  { letter: "T", ipa: "/te/", sound: "tay", example: "table", exampleEn: "table", tip: "Tongue on upper teeth — less aspiration" },
  { letter: "U", ipa: "/y/", sound: "ew", example: "lune", exampleEn: "moon", tip: "Say 'ee' but round your lips tight! This sound doesn't exist in English" },
  { letter: "V", ipa: "/ve/", sound: "vay", example: "vert", exampleEn: "green", tip: "Same as English V" },
  { letter: "W", ipa: "/dubləve/", sound: "doo-bluh-vay", example: "wagon", exampleEn: "wagon", tip: "Called 'double V' in French" },
  { letter: "X", ipa: "/iks/", sound: "eeks", example: "taxi", exampleEn: "taxi", tip: "Like 'eeks'" },
  { letter: "Y", ipa: "/igʁɛk/", sound: "ee-grek", example: "yaourt", exampleEn: "yogurt", tip: "Called 'Greek I' in French" },
  { letter: "Z", ipa: "/zɛd/", sound: "zed", example: "zéro", exampleEn: "zero", tip: "Like British 'zed' — NOT 'zee'" },
];

const ORAL_VOWELS = [
  { sound: "a", ipa: "/a/", words: ["chat", "papa", "table"], wordsEn: ["cat", "dad", "table"], mouth: "wide-open", lips: "neutral", tongue: "flat-low", tip: "Mouth wide open. Like 'ah' at the doctor.", color: "#ef4444" },
  { sound: "e", ipa: "/ə/", words: ["le", "me", "que"], wordsEn: ["the", "me", "that"], mouth: "slightly-open", lips: "rounded", tongue: "mid-central", tip: "Short neutral 'uh'. Lips slightly rounded.", color: "#f59e0b" },
  { sound: "é", ipa: "/e/", words: ["été", "café", "parler"], wordsEn: ["summer", "coffee", "to speak"], mouth: "half-open", lips: "spread", tongue: "mid-front", tip: "Like 'ay' in 'say' but shorter. Lips spread.", color: "#eab308" },
  { sound: "è", ipa: "/ɛ/", words: ["mère", "fête", "lait"], wordsEn: ["mother", "party", "milk"], mouth: "half-open", lips: "spread-wide", tongue: "low-front", tip: "Like 'e' in 'bed'. Mouth wider than 'é'.", color: "#84cc16" },
  { sound: "i", ipa: "/i/", words: ["lit", "ami", "fille"], wordsEn: ["bed", "friend", "girl"], mouth: "nearly-closed", lips: "spread-tight", tongue: "high-front", tip: "Like 'ee' in 'see'. Lips stretched wide.", color: "#22c55e" },
  { sound: "o", ipa: "/o/", words: ["mot", "eau", "beau"], wordsEn: ["word", "water", "beautiful"], mouth: "half-open", lips: "very-rounded", tongue: "mid-back", tip: "Lips very rounded like a small O. Pure sound.", color: "#0ea5e9" },
  { sound: "u", ipa: "/y/", words: ["lune", "rue", "tu"], wordsEn: ["moon", "street", "you"], mouth: "nearly-closed", lips: "very-rounded-tight", tongue: "high-front", tip: "Say 'ee' but round your lips tight! Unique to French.", color: "#6366f1" },
  { sound: "ou", ipa: "/u/", words: ["fou", "nous", "rouge"], wordsEn: ["crazy", "we", "red"], mouth: "nearly-closed", lips: "very-rounded", tongue: "high-back", tip: "Like 'oo' in 'food'. Lips pushed forward.", color: "#8b5cf6" },
  { sound: "eu", ipa: "/ø/", words: ["bleu", "jeu", "deux"], wordsEn: ["blue", "game", "two"], mouth: "half-open", lips: "rounded", tongue: "mid-front", tip: "Like 'u' in 'burn' (British). Lips rounded + tongue forward.", color: "#a855f7" },
];

const NASAL_VOWELS = [
  { sound: "an/en", ipa: "/ɑ̃/", words: ["enfant", "dans", "manger"], wordsEn: ["child", "in", "to eat"], tip: "Open mouth wide + air through nose. Like 'on' in 'song' but more open.", spellings: ["an", "am", "en", "em"], color: "#f43f5e" },
  { sound: "on", ipa: "/ɔ̃/", words: ["bon", "pont", "salon"], wordsEn: ["good", "bridge", "living room"], tip: "Round lips + air through nose. Like a nasal 'oh'.", spellings: ["on", "om"], color: "#f97316" },
  { sound: "in", ipa: "/ɛ̃/", words: ["vin", "matin", "pain"], wordsEn: ["wine", "morning", "bread"], tip: "Spread lips + air through nose. Like nasal 'an' in 'ban'.", spellings: ["in", "im", "ain", "aim", "ein", "un"], color: "#a855f7" },
  { sound: "un", ipa: "/œ̃/", words: ["un", "brun", "lundi"], wordsEn: ["one", "brown", "Monday"], tip: "Round lips slightly + air through nose. Rare sound, merging with /ɛ̃/.", spellings: ["un", "um"], color: "#ec4899" },
];

const HARD_CONSONANTS = [
  { sound: "R", ipa: "/ʁ/", words: ["rouge", "Paris", "merci"], wordsEn: ["red", "Paris", "thank you"], tip: "Throat sound! Like gargling gently. Back of tongue near soft palate.", method: "throat", color: "#ef4444" },
  { sound: "J / GE", ipa: "/ʒ/", words: ["jour", "rouge", "manger"], wordsEn: ["day", "red", "to eat"], tip: "Like 'zh' in English 'pleasure'. Tongue doesn't touch palate.", method: "friction", color: "#f59e0b" },
  { sound: "GN", ipa: "/ɲ/", words: ["montagne", "champagne", "ligne"], wordsEn: ["mountain", "champagne", "line"], tip: "Like 'ny' in 'canyon'. Middle of tongue on palate.", method: "palatal", color: "#22c55e" },
  { sound: "CH", ipa: "/ʃ/", words: ["chat", "chaud", "chose"], wordsEn: ["cat", "hot", "thing"], tip: "Like 'sh' in 'shoe'. Lips pushed slightly forward.", method: "friction", color: "#0ea5e9" },
  { sound: "U vs OU", ipa: "/y/ vs /u/", words: ["rue/roue", "vu/vous", "su/sous"], wordsEn: ["street/wheel", "seen/you", "known/under"], tip: "U = 'ee' with rounded lips. OU = 'oo'. The lip position is the key!", method: "vowel-contrast", color: "#6366f1" },
];

const MINIMAL_PAIRS = [
  { pair: ["dessus", "dessous"], ipa: ["/dəsy/", "/dəsu/"], meaning: ["above", "below"], keyDiff: "u /y/ vs ou /u/" },
  { pair: ["poisson", "poison"], ipa: ["/pwasɔ̃/", "/pwazɔ̃/"], meaning: ["fish", "poison"], keyDiff: "ss /s/ vs s /z/" },
  { pair: ["père", "peur"], ipa: ["/pɛʁ/", "/pœʁ/"], meaning: ["father", "fear"], keyDiff: "è /ɛ/ vs eu /œ/" },
  { pair: ["lit", "lu"], ipa: ["/li/", "/ly/"], meaning: ["bed", "read (past)"], keyDiff: "i /i/ vs u /y/" },
  { pair: ["beau", "bon"], ipa: ["/bo/", "/bɔ̃/"], meaning: ["beautiful", "good"], keyDiff: "o /o/ vs on /ɔ̃/ (nasal)" },
  { pair: ["vu", "vous"], ipa: ["/vy/", "/vu/"], meaning: ["seen", "you"], keyDiff: "u /y/ vs ou /u/" },
  { pair: ["le", "les"], ipa: ["/lə/", "/le/"], meaning: ["the (sg)", "the (pl)"], keyDiff: "e /ə/ vs é /e/" },
  { pair: ["rue", "roue"], ipa: ["/ʁy/", "/ʁu/"], meaning: ["street", "wheel"], keyDiff: "u /y/ vs ou /u/" },
];

const LIAISON_RULES = [
  { example: "les amis", ipa: "/le.za.mi/", rule: "Plural article + vowel", tip: "The silent S becomes /z/ before a vowel", en: "the friends" },
  { example: "un ami", ipa: "/œ̃.na.mi/", rule: "Un/une + vowel", tip: "The N links to the next word", en: "a friend" },
  { example: "petit enfant", ipa: "/pə.ti.tɑ̃.fɑ̃/", rule: "Adjective + vowel", tip: "The silent T becomes pronounced", en: "small child" },
  { example: "nous avons", ipa: "/nu.za.vɔ̃/", rule: "Pronoun + verb", tip: "The S becomes /z/", en: "we have" },
  { example: "c'est un", ipa: "/sɛ.tœ̃/", rule: "C'est + vowel", tip: "The T links forward", en: "it's a" },
  { example: "très important", ipa: "/tʁɛ.zɛ̃.pɔʁ.tɑ̃/", rule: "Adverb + vowel", tip: "The S becomes /z/", en: "very important" },
];

const SOUND_COMBOS = [
  { combo: "oi", ipa: "/wa/", words: ["moi", "toi", "voiture"], wordsEn: ["me", "you", "car"], tip: "Sounds like 'wah' — nothing like English 'oy'" },
  { combo: "ai", ipa: "/ɛ/", words: ["maison", "lait", "fait"], wordsEn: ["house", "milk", "done"], tip: "Sounds like 'eh' in 'bed'" },
  { combo: "au/eau", ipa: "/o/", words: ["beau", "eau", "chaud"], wordsEn: ["beautiful", "water", "hot"], tip: "Sounds like 'oh' — lips very rounded" },
  { combo: "ou", ipa: "/u/", words: ["fou", "nous", "tout"], wordsEn: ["crazy", "we", "all"], tip: "Like 'oo' in 'food'" },
  { combo: "eu/oeu", ipa: "/ø/", words: ["bleu", "jeu", "coeur"], wordsEn: ["blue", "game", "heart"], tip: "Round lips + say 'eh' — unique French sound" },
  { combo: "ille", ipa: "/ij/", words: ["fille", "famille", "bille"], wordsEn: ["girl", "family", "marble"], tip: "Like 'ee-yuh' — Y glide after ee" },
  { combo: "gn", ipa: "/ɲ/", words: ["montagne", "ligne", "signe"], wordsEn: ["mountain", "line", "sign"], tip: "Like 'ny' in canyon" },
  { combo: "qu", ipa: "/k/", words: ["quatre", "qui", "quand"], wordsEn: ["four", "who", "when"], tip: "Just /k/ — the U is silent!" },
];

// ── ACCENT/ANSWER HELPERS ─────────────────────────────────────

const normalizeAccents = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const checkAnswer = (input, expected) => {
  const ci = input.toLowerCase().trim(), ce = expected.toLowerCase().trim();
  if (ci === ce) return { correct: true, accentIssue: false };
  if (normalizeAccents(ci) === normalizeAccents(ce)) return { correct: true, accentIssue: true };
  return { correct: false, accentIssue: false };
};

// ── VOICE ENGINE ──────────────────────────────────────────────

const V = {
  _ctx: null, _voice: null,
  getCtx() { if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)(); return this._ctx; },
  loadVoice() {
    if (!("speechSynthesis" in window)) return;
    const load = () => { const v = window.speechSynthesis.getVoices().filter(v => v.lang?.startsWith("fr")); if (v.length) { v.sort((a, b) => { const r = n => { const l = n.name.toLowerCase(); return l.includes("google") ? 100 : l.includes("natural") || l.includes("enhanced") ? 90 : l.includes("thomas") || l.includes("amelie") ? 85 : 50; }; return r(b) - r(a); }); this._voice = v[0]; } };
    load(); window.speechSynthesis.onvoiceschanged = load;
  },
  say(text, rate = 0.78) {
    if (!("speechSynthesis" in window)) return; window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = "fr-FR"; u.rate = rate; u.pitch = 1; u.volume = 1;
    if (this._voice) u.voice = this._voice; window.speechSynthesis.speak(u);
  },
  sfx(type) {
    try {
      const ctx = this.getCtx(), now = ctx.currentTime;
      if (type === "click") { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(880, now); o.frequency.exponentialRampToValueAtTime(440, now + 0.06); g.gain.setValueAtTime(0.06, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.06); o.start(now); o.stop(now + 0.06); }
      else if (type === "gem") { [660, 880, 1100].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(f, now + i * 0.06); g.gain.setValueAtTime(0.12, now + i * 0.06); g.gain.linearRampToValueAtTime(0, now + i * 0.06 + 0.25); o.start(now + i * 0.06); o.stop(now + i * 0.06 + 0.25); }); }
      else if (type === "ok") { [523, 659, 784].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "triangle"; o.frequency.setValueAtTime(f, now + i * 0.08); g.gain.setValueAtTime(0.08, now + i * 0.08); g.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.3); o.start(now + i * 0.08); o.stop(now + i * 0.08 + 0.3); }); }
      else if (type === "no") { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.setValueAtTime(180, now); o.frequency.linearRampToValueAtTime(90, now + 0.25); g.gain.setValueAtTime(0.06, now); g.gain.linearRampToValueAtTime(0, now + 0.25); o.start(now); o.stop(now + 0.25); }
      else if (type === "unlock") { [400, 550, 700, 900, 1100].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(f, now + i * 0.07); g.gain.setValueAtTime(0.1, now + i * 0.07); g.gain.linearRampToValueAtTime(0, now + i * 0.07 + 0.35); o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.35); }); }
      else if (type === "fanfare") { [523, 659, 784, 1047].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(f, now + i * 0.15); g.gain.setValueAtTime(0.12, now + i * 0.15); g.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.6); o.start(now + i * 0.15); o.stop(now + i * 0.15 + 0.6); }); }
    } catch (e) {}
  },
};

// ── UI HELPERS ─────────────────────────────────────────────────

const Tip = ({ children }) => (
  <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 14, padding: "11px 14px", marginBottom: 16, textAlign: "left" }}>
    <p style={{ margin: 0, fontSize: 12, color: "#0369a1", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.55 }}>{children}</p>
  </div>
);

const GemCounter = ({ gems, total }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 16 }}>
    <span style={{ fontSize: 18 }}>💎</span>
    <span style={{ fontSize: 16, fontWeight: 900, color: "#0ea5e9", fontFamily: "'Outfit', sans-serif" }}>{gems}</span>
    {total && <span style={{ fontSize: 11, color: "#64748b" }}>/ {total}</span>}
  </div>
);

const ProgressDots = ({ total, current, completed }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{ width: 24, height: 5, borderRadius: 3, background: completed?.has?.(i) || i < current ? "#10b981" : i === current ? "#0ea5e9" : "#e2e8f0", transition: "all 0.3s" }} />
    ))}
  </div>
);

const SpeakBtn = ({ text, size = 14, rate }) => (
  <button onClick={(e) => { e.stopPropagation(); V.sfx("click"); V.say(text, rate); }}
    style={{ background: "none", border: "none", cursor: "pointer", fontSize: size, padding: 2 }}>🔊</button>
);

// ── SVG MOUTH DIAGRAM ─────────────────────────────────────────

const MouthDiagram = ({ openness = "half", lips = "neutral", tongue = "mid", nasal = false, size = 120 }) => {
  // openness: closed, slightly, half, wide
  // lips: neutral, spread, rounded, very-rounded
  // tongue: low, mid, high, front, back
  const jawOpen = { closed: 8, slightly: 14, half: 22, wide: 34 }[openness] || 22;
  const lipRound = lips.includes("rounded") ? 0.7 : lips.includes("spread") ? 1.4 : 1;
  const tongueY = { low: 58, mid: 48, high: 38, front: 42, back: 46 }[tongue] || 48;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block", margin: "0 auto" }}>
      {/* Head outline */}
      <ellipse cx="40" cy="40" rx="36" ry="38" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Lips */}
      <ellipse cx="40" cy={40 + jawOpen / 4} rx={16 * lipRound} ry={jawOpen / 2 + 3} fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
      {/* Mouth opening */}
      <ellipse cx="40" cy={40 + jawOpen / 4} rx={12 * lipRound} ry={jawOpen / 2} fill="#1e293b" />
      {/* Tongue */}
      <path d={`M ${28} ${tongueY + jawOpen / 3} Q 40 ${tongueY - 4 + jawOpen / 4} ${52} ${tongueY + jawOpen / 3}`} fill="#f87171" stroke="#dc2626" strokeWidth="0.8" />
      {/* Nasal indicator */}
      {nasal && (
        <>
          <line x1="40" y1="10" x2="40" y2="22" stroke="#a855f7" strokeWidth="2" strokeDasharray="2,2" />
          <text x="40" y="8" textAnchor="middle" fontSize="7" fill="#a855f7" fontWeight="700">NASAL</text>
          {[36, 40, 44].map((x, i) => (
            <circle key={i} cx={x} cy={14} r="1.5" fill="#a855f7" opacity="0.6">
              <animate attributeName="cy" values="14;8;14" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </>
      )}
      {/* Labels */}
      <text x="40" y={76} textAnchor="middle" fontSize="6" fill="#94a3b8" fontFamily="monospace">
        {lips.includes("rounded") ? "ROUNDED" : lips.includes("spread") ? "SPREAD" : "NEUTRAL"}
      </text>
    </svg>
  );
};

// ── VOWEL TRIANGLE (Interactive) ──────────────────────────────

const VowelTriangle = ({ onSelect, activeSound }) => {
  const vowels = [
    { sound: "i", x: 20, y: 15, color: "#22c55e" },
    { sound: "y", x: 35, y: 15, color: "#6366f1", label: "u" },
    { sound: "u", x: 75, y: 15, color: "#8b5cf6", label: "ou" },
    { sound: "e", x: 25, y: 35, color: "#eab308", label: "é" },
    { sound: "ø", x: 45, y: 35, color: "#a855f7", label: "eu" },
    { sound: "o", x: 70, y: 35, color: "#0ea5e9" },
    { sound: "ɛ", x: 30, y: 55, color: "#84cc16", label: "è" },
    { sound: "ə", x: 50, y: 45, color: "#f59e0b", label: "e" },
    { sound: "a", x: 45, y: 75, color: "#ef4444" },
  ];

  return (
    <svg viewBox="0 0 100 90" style={{ width: "100%", maxWidth: 360, margin: "0 auto", display: "block" }}>
      {/* Triangle outline */}
      <path d="M 15 10 L 80 10 L 50 80 Z" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
      {/* Axis labels */}
      <text x="5" y="8" fontSize="5" fill="#94a3b8" fontFamily="monospace">FRONT</text>
      <text x="72" y="8" fontSize="5" fill="#94a3b8" fontFamily="monospace">BACK</text>
      <text x="2" y="50" fontSize="5" fill="#94a3b8" fontFamily="monospace" transform="rotate(-90, 5, 50)">CLOSED → OPEN</text>

      {vowels.map((v) => {
        const isActive = activeSound === v.sound || activeSound === v.label;
        return (
          <g key={v.sound} onClick={() => { V.sfx("click"); onSelect?.(v); }} style={{ cursor: "pointer" }}>
            <circle cx={v.x} cy={v.y} r={isActive ? 7 : 5} fill={v.color} opacity={isActive ? 1 : 0.7} stroke={isActive ? "#fff" : "none"} strokeWidth="1.5">
              {isActive && <animate attributeName="r" values="7;8.5;7" dur="1s" repeatCount="indefinite" />}
            </circle>
            <text x={v.x} y={v.y + 3} textAnchor="middle" fontSize="5" fill="#fff" fontWeight="800" fontFamily="monospace" style={{ pointerEvents: "none" }}>
              {v.label || v.sound}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── SECTION LAYOUT (responsive) ───────────────────────────────

const SectionLayout = ({ children, title, index, isLocked, id, gems = 0 }) => (
  <section id={id} style={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 12px", position: "relative", transition: "all 0.7s", filter: isLocked ? "grayscale(1) brightness(0.35)" : "none" }}>
    <div style={{ width: "100%", maxWidth: 860, transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)", transform: isLocked ? "scale(0.94)" : "scale(1)", opacity: isLocked ? 0.35 : 1, pointerEvents: isLocked ? "none" : "auto" }}>
      <div style={{ borderRadius: 24, overflow: "hidden", background: isLocked ? "rgba(10,15,30,0.85)" : "rgba(255,255,255,0.96)", backdropFilter: "blur(24px)", border: isLocked ? "2px solid rgba(40,50,80,0.4)" : "2px solid rgba(226,232,240,0.6)", boxShadow: isLocked ? "none" : "0 20px 50px rgba(0,0,0,0.07)" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${isLocked ? "rgba(40,50,80,0.3)" : "#f1f5f9"}` }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: isLocked ? "#1e293b" : "linear-gradient(135deg, #f43f5e, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, flexShrink: 0 }}>{isLocked ? "🔒" : "🔓"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: isLocked ? "#475569" : "#0f172a", fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, color: "#fff", background: isLocked ? "#334155" : "#f43f5e" }}>LVL {index}</span>
              {!isLocked && gems > 0 && <span style={{ fontSize: 9, color: "#f59e0b" }}>💎 {gems}</span>}
            </div>
          </div>
          {!isLocked && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px rgba(16,185,129,0.7)", animation: "pulse 2s infinite", flexShrink: 0 }} />}
        </header>
        <div style={{ padding: "18px 16px 26px" }}>{children}</div>
      </div>
    </div>
    {isLocked && (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
        <div style={{ background: "rgba(8,12,25,0.92)", backdropFilter: "blur(16px)", padding: "32px 28px", borderRadius: 24, textAlign: "center", border: "1px solid #1e293b", maxWidth: 320 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
          <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Outfit'" }}>Locked</h3>
          <p style={{ color: "#475569", margin: 0, fontSize: 11 }}>Complete the previous level first.</p>
        </div>
      </div>
    )}
  </section>
);

// ── COVER SLIDE ───────────────────────────────────────────────

const CoverSlide = ({ onStart, totalGems }) => (
  <section style={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "24px 16px", position: "relative", overflow: "hidden", color: "#fff" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #0f0515 0%, #1a0a2e 30%, #0d0a1f 60%, #020617 100%)" }} />
    <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 65%)", filter: "blur(50px)" }} />
    <div style={{ position: "absolute", bottom: -120, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 65%)", filter: "blur(50px)" }} />
    <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 600, width: "100%" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", padding: "6px 16px", borderRadius: 50, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 28, animation: "fadeIn 0.8s" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f43f5e", animation: "pulse 2s infinite" }} />
        <span style={{ textTransform: "uppercase", letterSpacing: 4, fontSize: 9, fontWeight: 700, color: "rgba(253,164,175,0.8)", fontFamily: "'JetBrains Mono', monospace" }}>Sound Lab Active</span>
      </div>
      <h1 style={{ fontSize: "clamp(40px, 9vw, 90px)", fontWeight: 900, lineHeight: 0.88, margin: "0 0 8px", fontFamily: "'Outfit', sans-serif", animation: "fadeIn 0.8s 0.15s both" }}>
        <span style={{ background: "linear-gradient(135deg, #fda4af 0%, #f43f5e 30%, #ec4899 60%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ESCAPE</span><br />
        <span style={{ color: "#f1f5f9", letterSpacing: -2 }}>FLAB</span>
      </h1>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10, animation: "fadeIn 0.8s 0.3s both" }}>
        <div style={{ height: 1, width: 30, background: "rgba(244,63,94,0.3)" }} />
        <p style={{ fontSize: "clamp(11px, 2vw, 16px)", fontWeight: 800, color: "#fda4af", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>PHONÉTIQUE</p>
        <div style={{ height: 1, width: 30, background: "rgba(244,63,94,0.3)" }} />
      </div>
      <div style={{ display: "inline-flex", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.15)", padding: "4px 14px", borderRadius: 50, marginBottom: 28, animation: "fadeIn 0.8s 0.4s both" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#fda4af", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace" }}>PRONUNCIATION A1</span>
      </div>
      {totalGems > 0 && (
        <div style={{ marginBottom: 16, animation: "fadeIn 0.8s 0.45s both" }}>
          <span style={{ fontSize: 22 }}>💎</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#f43f5e", fontFamily: "'Outfit'", marginLeft: 6 }}>{totalGems}</span>
          <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4 }}>gems collected</span>
        </div>
      )}
      <p style={{ fontSize: 13, color: "#64748b", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.75, animation: "fadeIn 0.8s 0.5s both", fontFamily: "'DM Sans', sans-serif" }}>
        Master every French sound. From alphabet to liaisons. Earn gems. Escape the phonetic maze.
      </p>
      <button onClick={() => { V.sfx("unlock"); onStart(); }}
        style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7)", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 40px rgba(244,63,94,0.25)", fontFamily: "'Outfit', sans-serif", letterSpacing: 1, width: "100%", maxWidth: 280, animation: "fadeIn 0.8s 0.65s both" }}>
        ENTER SOUND LAB ⬇
      </button>
      <p style={{ marginTop: 20, fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace", animation: "fadeIn 0.8s 0.8s both" }}>💡 Tap any French word to hear it • Click 🔊 to listen</p>
    </div>
  </section>
);

// ── LVL 1: BRIEFING ──────────────────────────────────────────

const BriefingSlide = ({ onUnlock }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 40, marginBottom: 16 }}>🎙️</div>
    <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", marginBottom: 10, fontFamily: "'Outfit'" }}>SOUND MISSION BRIEFING</h3>
    <p style={{ color: "#64748b", fontSize: 13, maxWidth: 460, margin: "0 auto 24px", lineHeight: 1.7, fontFamily: "'DM Sans'" }}>
      The sound lab's phonetic system is corrupted. Your mission: recalibrate every French sound from scratch — vowels, consonants, nasal frequencies, and liaison protocols.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
      {[{ n: "Alphabet", icon: "🔤" }, { n: "Vowels", icon: "👄" }, { n: "Nasals", icon: "👃" }, { n: "Consonants", icon: "🦷" }, { n: "Combos", icon: "🔗" }, { n: "Liaisons", icon: "⛓️" }].map((s, i) => (
        <div key={i} style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #f1f5f9", textAlign: "center" }}>
          <div style={{ fontSize: 22 }}>{s.icon}</div>
          <div style={{ fontWeight: 700, color: "#475569", fontSize: 9, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>{s.n}</div>
        </div>
      ))}
    </div>
    <button onClick={() => { V.sfx("ok"); onUnlock(); }}
      style={{ background: "#0f172a", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", width: "100%", maxWidth: 260 }}>
      CALIBRATE SYSTEMS
    </button>
  </div>
);

// ── LVL 2: ALPHABET EXPLORER ─────────────────────────────────

const AlphabetExplorer = ({ onUnlock, addGems }) => {
  const [phase, setPhase] = useState("explore"); // explore | quiz
  const [activeLetter, setActiveLetter] = useState(null);
  const [explored, setExplored] = useState(new Set());
  // Quiz: hear a letter, pick which one
  const QUIZ_ORDER = useRef([...ALPHABET].sort(() => Math.random() - 0.5)).current;
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizStatus, setQuizStatus] = useState("idle");
  const [gems, setGems] = useState(0);

  const handleLetterClick = (item) => {
    V.sfx("click"); V.say(item.letter);
    setActiveLetter(item);
    const ne = new Set(explored); ne.add(item.letter); setExplored(ne);
  };

  // Quiz: play current letter sound
  const playQuizLetter = () => { V.sfx("click"); V.say(QUIZ_ORDER[quizIdx].letter, 0.75); };

  const handleQuizPick = (letter) => {
    if (quizStatus !== "idle") return;
    V.sfx("click");
    if (letter === QUIZ_ORDER[quizIdx].letter) {
      V.sfx("gem"); setQuizStatus("correct"); setGems(g => g + 1);
      setTimeout(() => {
        if (quizIdx + 1 >= QUIZ_ORDER.length) {
          addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 800);
        } else { setQuizIdx(i => i + 1); setQuizStatus("idle"); }
      }, 600);
    } else {
      V.sfx("no"); setQuizStatus("wrong");
      setTimeout(() => setQuizStatus("idle"), 1000);
    }
  };

  if (phase === "explore") return (
    <div>
      <Tip>{"💡"} <strong>THE FRENCH ALPHABET:</strong> Tap each letter to hear how it sounds in French — many are very different from English! Letters marked with ⚠ are the trickiest. Explore at least 20 to unlock the quiz.</Tip>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(42px, 1fr))", gap: 6, marginBottom: 16 }}>
        {ALPHABET.map((item) => {
          const isExplored = explored.has(item.letter);
          const isActive = activeLetter?.letter === item.letter;
          const isTricky = ["C", "E", "G", "H", "J", "Q", "R", "U", "Y"].includes(item.letter);
          return (
            <button key={item.letter} onClick={() => handleLetterClick(item)}
              style={{ height: 42, borderRadius: 10, border: isActive ? "2px solid #f43f5e" : "1px solid #f1f5f9", background: isActive ? "#f43f5e" : isExplored ? "#fef2f2" : "#fff", color: isActive ? "#fff" : isTricky ? "#f43f5e" : "#334155", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit'", transition: "all 0.15s", position: "relative" }}>
              {item.letter}
              {isTricky && !isActive && <span style={{ position: "absolute", top: 1, right: 2, fontSize: 6, color: "#f43f5e" }}>⚠</span>}
            </button>
          );
        })}
      </div>
      {activeLetter && (
        <div style={{ background: "#0f172a", borderRadius: 16, padding: "18px 16px", color: "#fff", animation: "fadeIn 0.2s", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Outfit'" }}>{activeLetter.letter}</span>
            <div>
              <div style={{ fontSize: 14, color: "#fda4af", fontFamily: "'JetBrains Mono', monospace" }}>French: "{activeLetter.sound}"</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Example: {activeLetter.example} = {activeLetter.exampleEn} <SpeakBtn text={activeLetter.example} size={14} /></div>
            </div>
          </div>
          <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#fda4af" }}>
            {"💡"} {activeLetter.tip}
          </div>
        </div>
      )}
      {explored.size >= 20 && (
        <button onClick={() => { V.sfx("click"); setPhase("quiz"); }}
          style={{ display: "block", margin: "0 auto", padding: "12px 28px", background: "linear-gradient(135deg, #f43f5e, #a855f7)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", fontSize: 14, animation: "bounceIn 0.4s" }}>
          {"🎧"} SOUND QUIZ — Guess the letter by ear! (26 letters)
        </button>
      )}
    </div>
  );

  // QUIZ: Hear the sound, tap the correct letter
  const currentQ = QUIZ_ORDER[quizIdx];
  return (
    <div style={{ textAlign: "center" }}>
      <Tip>{"🎧"} <strong>LISTEN & PICK:</strong> You'll hear a French letter. Tap the correct one on the grid! All 26 letters — earn a 💎 for each correct answer.</Tip>
      <GemCounter gems={gems} total={26} />
      <ProgressDots total={26} current={quizIdx} />

      <button onClick={playQuizLetter}
        style={{ width: 90, height: 90, borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #f43f5e, #a855f7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 32, boxShadow: "0 6px 24px rgba(244,63,94,0.3)", animation: "pulse 2s infinite" }}>
        🔊
      </button>
      <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
        Letter {quizIdx + 1} / 26 — tap to replay
      </p>

      {/* All 26 letters grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))", gap: 5, marginBottom: 16, maxWidth: 500, margin: "0 auto 16px" }}>
        {ALPHABET.map((item) => {
          const isCorrect = quizStatus === "correct" && item.letter === currentQ.letter;
          const isWrong = quizStatus === "wrong" && item.letter === currentQ.letter;
          return (
            <button key={item.letter} onClick={() => handleQuizPick(item.letter)}
              style={{
                height: 40, borderRadius: 9, border: isCorrect ? "2px solid #10b981" : "1px solid #f1f5f9",
                background: isCorrect ? "#dcfce7" : isWrong ? "#0f172a" : "#fff",
                color: isCorrect ? "#059669" : "#334155", fontWeight: 900, fontSize: 15,
                cursor: quizStatus === "idle" ? "pointer" : "default",
                fontFamily: "'Outfit'", transition: "all 0.15s",
              }}>
              {item.letter}
            </button>
          );
        })}
      </div>

      {quizStatus === "correct" && (
        <div style={{ color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s", fontSize: 14 }}>
          ✅ +1 💎 — {currentQ.letter} = "{currentQ.sound}"
        </div>
      )}
      {quizStatus === "wrong" && (
        <div style={{ color: "#ef4444", fontSize: 13, animation: "fadeIn 0.2s" }}>
          ❌ That was "{currentQ.letter}" ({currentQ.sound}). Listen again!
        </div>
      )}

      <button onClick={() => setPhase("explore")} style={{ marginTop: 12, background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}>← Back to explore</button>
    </div>
  );
};

const OralVowelsLearn = ({ onUnlock, addGems }) => {
  const [activeVowel, setActiveVowel] = useState(null);
  const [explored, setExplored] = useState(new Set());

  const handleClick = (vowel) => {
    V.sfx("click"); V.say(vowel.words[0]);
    setActiveVowel(vowel);
    const ne = new Set(explored); ne.add(vowel.sound); setExplored(ne);
  };

  return (
    <div>
      <Tip>{"💡"} <strong>ORAL VOWELS:</strong> French has 9+ distinct vowel sounds (English has ~5). Explore each one — study the mouth position and listen carefully. Tap all to unlock the next level.</Tip>

      {/* Vowel Triangle explanation */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <p style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans'", margin: "0 0 4px" }}>
          <strong style={{ color: "#0f172a" }}>{"👄"} VOWEL MAP</strong> — This triangle represents your <strong>mouth</strong>:
        </p>
        <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
          ↕ Top = mouth nearly closed • Bottom = mouth wide open<br/>
          ↔ Left = tongue forward • Right = tongue back<br/>
          Tap any dot to hear the sound!
        </p>
      </div>

      {/* Vowel Triangle */}
      <VowelTriangle activeSound={activeVowel?.sound} onSelect={(v) => {
        const found = ORAL_VOWELS.find(ov => ov.ipa.includes(v.sound) || ov.sound === v.label || ov.sound === v.sound);
        if (found) handleClick(found);
      }} />

      {/* Vowel cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, margin: "16px 0" }}>
        {ORAL_VOWELS.map((v) => {
          const isActive = activeVowel?.sound === v.sound;
          const isDone = explored.has(v.sound);
          return (
            <button key={v.sound} onClick={() => handleClick(v)}
              style={{ padding: "12px 8px", borderRadius: 12, border: isActive ? `2px solid ${v.color}` : "1px solid #f1f5f9", background: isActive ? v.color : isDone ? "#f8fafc" : "#fff", color: isActive ? "#fff" : "#334155", cursor: "pointer", textAlign: "center", transition: "all 0.2s", opacity: isDone && !isActive ? 0.6 : 1 }}>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Outfit'" }}>{v.sound}</div>
              <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: isActive ? "rgba(255,255,255,0.7)" : "#94a3b8" }}>{v.ipa}</div>
            </button>
          );
        })}
      </div>

      {/* Detail card */}
      {activeVowel && (
        <div style={{ background: "#0f172a", borderRadius: 18, padding: "20px 18px", color: "#fff", animation: "fadeIn 0.2s", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "start", gap: 16 }}>
            <MouthDiagram openness={activeVowel.mouth?.includes("wide") ? "wide" : activeVowel.mouth?.includes("slightly") ? "slightly" : activeVowel.mouth?.includes("nearly") ? "closed" : "half"} lips={activeVowel.lips} size={100} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: activeVowel.color, fontFamily: "'Outfit'", marginBottom: 4 }}>{activeVowel.sound} <span style={{ fontSize: 14, color: "#94a3b8" }}>{activeVowel.ipa}</span></div>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#fda4af", lineHeight: 1.5 }}>{activeVowel.tip}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {activeVowel.words.map((w, i) => (
                  <button key={w} onClick={(e) => { e.stopPropagation(); V.say(w); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit'" }}>
                    {w} <span style={{ fontSize: 10, color: "#64748b" }}>({activeVowel.wordsEn[i]})</span> 🔊
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {explored.size >= ORAL_VOWELS.length && (
        <button onClick={() => { addGems(GEMS_PER_LEVEL); V.sfx("unlock"); setTimeout(onUnlock, 500); }}
          style={{ display: "block", margin: "0 auto", padding: "14px 32px", background: "linear-gradient(135deg, #f43f5e, #a855f7)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", fontSize: 14, animation: "bounceIn 0.4s" }}>
          ✅ ALL VOWELS EXPLORED — UNLOCK +{GEMS_PER_LEVEL}💎
        </button>
      )}
    </div>
  );
};

// ── LVL 4: ORAL VOWELS QUIZ ──────────────────────────────────

const OralVowelsQuiz = ({ onUnlock, addGems }) => {
  const QUIZ = ORAL_VOWELS.map(v => ({
    audio: v.words[0], answer: v.sound, options: ORAL_VOWELS.map(x => x.sound).sort(() => Math.random() - 0.5).slice(0, 4).includes(v.sound) ? ORAL_VOWELS.map(x => x.sound).sort(() => Math.random() - 0.5).slice(0, 4) : [...ORAL_VOWELS.map(x => x.sound).sort(() => Math.random() - 0.5).slice(0, 3), v.sound].sort(() => Math.random() - 0.5),
    en: v.wordsEn[0], word: v.words[0],
  }));

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle");
  const [gems, setGems] = useState(0);

  const q = QUIZ[idx];
  const uniqueOptions = [...new Set([q.answer, ...ORAL_VOWELS.map(x => x.sound).filter(s => s !== q.answer).sort(() => Math.random() - 0.5).slice(0, 3)])].sort(() => Math.random() - 0.5);

  const handleCheck = () => {
    if (selected === q.answer) {
      V.sfx("gem"); setStatus("correct"); setGems(g => g + 1);
      setTimeout(() => {
        if (idx + 1 >= QUIZ.length) { addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 800); }
        else { setIdx(i => i + 1); setSelected(null); setStatus("idle"); }
      }, 800);
    } else { V.sfx("no"); setStatus("wrong"); setTimeout(() => setStatus("idle"), 1200); }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Tip>{"💡"} Listen to the word, then identify which vowel sound it contains. Earn 💎 for each correct answer!</Tip>
      <GemCounter gems={gems} total={QUIZ.length} />
      <ProgressDots total={QUIZ.length} current={idx} />
      <button onClick={() => { V.sfx("click"); V.say(q.word, 0.7); }} style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: "#0f172a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>▶️</button>
      <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>"{q.word}" ({q.en})</p>
      <p style={{ color: "#94a3b8", fontSize: 10, marginBottom: 16 }}>Which vowel sound do you hear?</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {uniqueOptions.map(opt => {
          const vowelData = ORAL_VOWELS.find(v => v.sound === opt);
          return (
            <button key={opt} onClick={() => { V.sfx("click"); setSelected(opt); }}
              style={{ padding: "14px 20px", borderRadius: 12, border: selected === opt ? `2px solid ${vowelData?.color || "#0ea5e9"}` : "1px solid #e2e8f0", background: selected === opt ? (vowelData?.color || "#0ea5e9") : "#fff", color: selected === opt ? "#fff" : "#334155", fontWeight: 900, fontSize: 20, cursor: "pointer", fontFamily: "'Outfit'", transition: "all 0.2s", minWidth: 60 }}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected && status === "idle" && <button onClick={handleCheck} style={{ padding: "12px 32px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 50, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", fontSize: 14 }}>CONFIRM</button>}
      {status === "correct" && <div style={{ color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s" }}>✅ +1 💎 Correct!</div>}
      {status === "wrong" && <div style={{ color: "#ef4444", fontSize: 13 }}>❌ That word uses the "{q.answer}" sound</div>}
    </div>
  );
};

// ── LVL 5: NASAL VOWELS ──────────────────────────────────────

const NasalVowelsLearn = ({ onUnlock, addGems }) => {
  const [activeNasal, setActiveNasal] = useState(null);
  const [explored, setExplored] = useState(new Set());

  return (
    <div>
      <Tip>{"💡"} <strong>NASAL VOWELS:</strong> These don't exist in English! Air goes through your nose AND mouth at the same time. Pinch your nose — if the sound changes, it's nasal!</Tip>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
        {NASAL_VOWELS.map((nv) => {
          const isActive = activeNasal?.sound === nv.sound;
          const isDone = explored.has(nv.sound);
          return (
            <div key={nv.sound} onClick={() => { V.sfx("click"); V.say(nv.words[0]); setActiveNasal(nv); const ne = new Set(explored); ne.add(nv.sound); setExplored(ne); }}
              style={{ padding: "16px 14px", borderRadius: 16, border: isActive ? `2px solid ${nv.color}` : "1px solid #f1f5f9", background: isActive ? "#0f172a" : "#fff", color: isActive ? "#fff" : "#0f172a", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Outfit'", color: isActive ? nv.color : "#0f172a" }}>{nv.sound}</span>
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: isActive ? "#94a3b8" : "#64748b" }}>{nv.ipa}</span>
              </div>
              {isActive && (
                <div style={{ animation: "fadeIn 0.2s" }}>
                  <MouthDiagram openness={nv.sound.includes("on") ? "half" : "wide"} lips={nv.sound.includes("on") ? "rounded" : "neutral"} nasal={true} size={90} />
                  <p style={{ fontSize: 11, color: "#fda4af", marginTop: 8, lineHeight: 1.5 }}>{nv.tip}</p>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 6 }}>Spellings: {nv.spellings.map(s => <span key={s} style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, marginRight: 4, fontWeight: 700 }}>{s}</span>)}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {nv.words.map((w, i) => (
                      <button key={w} onClick={(e) => { e.stopPropagation(); V.say(w); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 8px", color: "#e2e8f0", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit'" }}>
                        {w} ({nv.wordsEn[i]}) 🔊
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {isDone && !isActive && <span style={{ fontSize: 10, color: "#10b981" }}>✅ explored</span>}
            </div>
          );
        })}
      </div>
      {explored.size >= NASAL_VOWELS.length && (
        <button onClick={() => { addGems(GEMS_PER_LEVEL); V.sfx("unlock"); setTimeout(onUnlock, 500); }}
          style={{ display: "block", margin: "0 auto", padding: "14px 28px", background: "linear-gradient(135deg, #f43f5e, #a855f7)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", animation: "bounceIn 0.4s" }}>
          UNLOCK NEXT +{GEMS_PER_LEVEL}💎
        </button>
      )}
    </div>
  );
};

// ── LVL 6: NASAL VS ORAL QUIZ ────────────────────────────────

const NasalQuiz = ({ onUnlock, addGems }) => {
  const BASE_QUESTIONS = [
    { word: "bon", answer: "nasal", ipa: "/bɔ̃/", en: "good" },
    { word: "beau", answer: "oral", ipa: "/bo/", en: "beautiful" },
    { word: "vin", answer: "nasal", ipa: "/vɛ̃/", en: "wine" },
    { word: "enfant", answer: "nasal", ipa: "/ɑ̃fɑ̃/", en: "child" },
    { word: "été", answer: "oral", ipa: "/ete/", en: "summer" },
    { word: "pont", answer: "nasal", ipa: "/pɔ̃/", en: "bridge" },
    { word: "lundi", answer: "nasal", ipa: "/lœ̃di/", en: "Monday" },
    { word: "pot", answer: "oral", ipa: "/po/", en: "pot" },
    { word: "père", answer: "oral", ipa: "/pɛʁ/", en: "father" },
    { word: "pain", answer: "nasal", ipa: "/pɛ̃/", en: "bread" },
    { word: "vie", answer: "oral", ipa: "/vi/", en: "life" },
    { word: "dans", answer: "nasal", ipa: "/dɑ̃/", en: "in" },
  ];
  // Shuffle once on mount
  const QUESTIONS = useRef([...BASE_QUESTIONS].sort(() => Math.random() - 0.5)).current;
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState("idle");
  const [gems, setGems] = useState(0);
  const q = QUESTIONS[idx];

  const handleAnswer = (answer) => {
    V.sfx("click");
    if (answer === q.answer) {
      V.sfx("gem"); setStatus("correct"); setGems(g => g + 1);
      setTimeout(() => {
        if (idx + 1 >= QUESTIONS.length) { addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 800); }
        else { setIdx(i => i + 1); setStatus("idle"); }
      }, 800);
    } else { V.sfx("no"); setStatus("wrong"); setTimeout(() => setStatus("idle"), 1200); }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Tip>{"💡"} Listen to the word. Is the vowel <strong>nasal</strong> (air through nose 👃) or <strong>oral</strong> (air through mouth only 👄)?</Tip>
      <GemCounter gems={gems} total={QUESTIONS.length} />
      <ProgressDots total={QUESTIONS.length} current={idx} />
      <button onClick={() => V.say(q.word, 0.7)} style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: "#0f172a", cursor: "pointer", margin: "0 auto 12px", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>▶️</button>
      <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit'", marginBottom: 4 }}>"{q.word}"</p>
      <p style={{ fontSize: 11, color: "#64748b", marginBottom: 20 }}>{q.en} • {q.ipa}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => status === "idle" && handleAnswer("nasal")} style={{ padding: "16px 28px", borderRadius: 14, border: "2px solid #a855f7", background: status === "correct" && q.answer === "nasal" ? "#a855f7" : "#fff", color: status === "correct" && q.answer === "nasal" ? "#fff" : "#a855f7", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit'" }}>👃 NASAL</button>
        <button onClick={() => status === "idle" && handleAnswer("oral")} style={{ padding: "16px 28px", borderRadius: 14, border: "2px solid #0ea5e9", background: status === "correct" && q.answer === "oral" ? "#0ea5e9" : "#fff", color: status === "correct" && q.answer === "oral" ? "#fff" : "#0ea5e9", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit'" }}>👄 ORAL</button>
      </div>
      {status === "correct" && <div style={{ color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s" }}>✅ +1 💎</div>}
      {status === "wrong" && <div style={{ color: "#ef4444", fontSize: 13 }}>❌ "{q.word}" is {q.answer}!</div>}
    </div>
  );
};

// ── LVL 7–8 PLACEHOLDER (Hard Consonants learn + quiz) ───────

const HardConsonantsLearn = ({ onUnlock, addGems }) => {
  const [active, setActive] = useState(null);
  const [explored, setExplored] = useState(new Set());
  return (
    <div>
      <Tip>{"💡"} <strong>HARD CONSONANTS:</strong> These 4 sounds trip up English speakers the most. The French R is completely different from English!</Tip>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {HARD_CONSONANTS.map(c => {
          const isA = active?.sound === c.sound;
          return (
            <div key={c.sound} onClick={() => { V.sfx("click"); V.say(c.words[0]); setActive(c); const ne = new Set(explored); ne.add(c.sound); setExplored(ne); }}
              style={{ padding: "16px", borderRadius: 16, border: isA ? `2px solid ${c.color}` : "1px solid #f1f5f9", background: isA ? "#0f172a" : "#fff", color: isA ? "#fff" : "#0f172a", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Outfit'", color: isA ? c.color : "#0f172a" }}>{c.sound}</span>
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#94a3b8" }}>{c.ipa}</span>
              </div>
              {isA && (
                <div style={{ marginTop: 12, animation: "fadeIn 0.2s" }}>
                  <p style={{ fontSize: 12, color: "#fda4af", lineHeight: 1.5, margin: "0 0 10px" }}>{c.tip}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {c.words.map((w, i) => (
                      <button key={w} onClick={(e) => { e.stopPropagation(); V.say(w); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 10px", color: "#e2e8f0", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit'" }}>
                        {w} ({c.wordsEn[i]}) 🔊
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {explored.size >= HARD_CONSONANTS.length && (
        <button onClick={() => { addGems(GEMS_PER_LEVEL); V.sfx("unlock"); setTimeout(onUnlock, 500); }}
          style={{ display: "block", margin: "0 auto", padding: "14px 28px", background: "linear-gradient(135deg, #f43f5e, #a855f7)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", animation: "bounceIn 0.4s" }}>
          UNLOCK NEXT +{GEMS_PER_LEVEL}💎
        </button>
      )}
    </div>
  );
};

// ── LVL 9: SOUND COMBOS ──────────────────────────────────────

const SoundCombosLearn = ({ onUnlock, addGems }) => {
  const [active, setActive] = useState(null);
  const [explored, setExplored] = useState(new Set());
  return (
    <div>
      <Tip>{"💡"} <strong>LETTER COMBOS:</strong> In French, some letter combinations create completely different sounds. "OI" = /wa/, not "oy"!</Tip>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
        {SOUND_COMBOS.map(c => {
          const isA = active?.combo === c.combo;
          const isDone = explored.has(c.combo);
          return (
            <div key={c.combo} onClick={() => { V.sfx("click"); V.say(c.words[0]); setActive(c); const ne = new Set(explored); ne.add(c.combo); setExplored(ne); }}
              style={{ padding: "14px", borderRadius: 14, border: isA ? "2px solid #f43f5e" : "1px solid #f1f5f9", background: isA ? "#0f172a" : "#fff", color: isA ? "#fff" : "#0f172a", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Outfit'", color: isA ? "#fda4af" : "#f43f5e", textTransform: "uppercase" }}>{c.combo}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{c.ipa}</div>
              {isA && (
                <div style={{ marginTop: 8, animation: "fadeIn 0.2s" }}>
                  <p style={{ fontSize: 11, color: "#fda4af", margin: "0 0 6px" }}>{c.tip}</p>
                  {c.words.map((w, i) => (
                    <button key={w} onClick={(e) => { e.stopPropagation(); V.say(w); }} style={{ display: "block", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 4, padding: "3px 6px", color: "#e2e8f0", fontSize: 11, cursor: "pointer", marginTop: 2, fontFamily: "'Outfit'" }}>
                      {w} ({c.wordsEn[i]}) 🔊
                    </button>
                  ))}
                </div>
              )}
              {isDone && !isA && <span style={{ fontSize: 9, color: "#10b981" }}>✅</span>}
            </div>
          );
        })}
      </div>
      {explored.size >= SOUND_COMBOS.length && (
        <button onClick={() => { addGems(GEMS_PER_LEVEL); V.sfx("unlock"); setTimeout(onUnlock, 500); }}
          style={{ display: "block", margin: "0 auto", padding: "14px 28px", background: "linear-gradient(135deg, #f43f5e, #a855f7)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", animation: "bounceIn 0.4s" }}>
          UNLOCK NEXT +{GEMS_PER_LEVEL}💎
        </button>
      )}
    </div>
  );
};

// ── LVL 10: MINIMAL PAIRS ────────────────────────────────────

const MinimalPairsQuiz = ({ onUnlock, addGems }) => {
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState("idle");
  const [gems, setGems] = useState(0);
  const [targetIdx, setTargetIdx] = useState(() => Math.random() < 0.5 ? 0 : 1);
  const p = MINIMAL_PAIRS[idx];

  const playTarget = () => { V.sfx("click"); V.say(p.pair[targetIdx], 0.7); };
  const handleAnswer = (chosenIdx) => {
    V.sfx("click");
    if (chosenIdx === targetIdx) {
      V.sfx("gem"); setStatus("correct"); setGems(g => g + 1);
      setTimeout(() => {
        if (idx + 1 >= MINIMAL_PAIRS.length) { addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 800); }
        else { setIdx(i => i + 1); setTargetIdx(Math.random() < 0.5 ? 0 : 1); setStatus("idle"); }
      }, 1000);
    } else { V.sfx("no"); setStatus("wrong"); setTimeout(() => setStatus("idle"), 1500); }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Tip>{"💡"} <strong>MINIMAL PAIRS:</strong> Two words that differ by just one sound. Listen carefully and pick the one you hear!</Tip>
      <GemCounter gems={gems} total={MINIMAL_PAIRS.length} />
      <ProgressDots total={MINIMAL_PAIRS.length} current={idx} />
      <button onClick={playTarget} style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: "#0f172a", cursor: "pointer", margin: "0 auto 16px", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>▶️</button>
      <p style={{ fontSize: 10, color: "#94a3b8", marginBottom: 16 }}>Key difference: {p.keyDiff}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {p.pair.map((word, i) => (
          <button key={word} onClick={() => status === "idle" && handleAnswer(i)}
            style={{ padding: "16px 24px", borderRadius: 14, border: status === "correct" && i === targetIdx ? "2px solid #10b981" : "1px solid #e2e8f0", background: status === "correct" && i === targetIdx ? "#f0fdf4" : "#fff", cursor: "pointer", fontFamily: "'Outfit'", transition: "all 0.2s" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{word}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>{p.ipa[i]}</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{p.meaning[i]}</div>
          </button>
        ))}
      </div>
      {status === "correct" && <div style={{ color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s" }}>✅ +1 💎 You heard "{p.pair[targetIdx]}"!</div>}
      {status === "wrong" && <div style={{ color: "#ef4444", fontSize: 13 }}>❌ It was "{p.pair[targetIdx]}" — {p.meaning[targetIdx]}</div>}
    </div>
  );
};

// ── LVL 11: LIAISONS ─────────────────────────────────────────

const LiaisonsLearn = ({ onUnlock, addGems }) => {
  const [active, setActive] = useState(null);
  const [explored, setExplored] = useState(new Set());
  const [showRules, setShowRules] = useState(true);
  return (
    <div>
      <Tip>{"💡"} <strong>LIAISONS:</strong> In French, a normally silent final consonant can be pronounced when the next word starts with a vowel. This connects words smoothly!</Tip>

      {/* General rules section */}
      <div style={{ background: "#0f172a", borderRadius: 16, padding: "18px 16px", marginBottom: 16, color: "#fff" }}>
        <div onClick={() => setShowRules(!showRules)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#fda4af", fontFamily: "'Outfit'" }}>{"📖"} LIAISON RULES</h4>
          <span style={{ fontSize: 12, color: "#64748b", transition: "0.2s", transform: showRules ? "rotate(180deg)" : "none" }}>▼</span>
        </div>
        {showRules && (
          <div style={{ marginTop: 12, animation: "fadeIn 0.2s" }}>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: "#cbd5e1" }}>
              <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#4ade80" }}>{"✅"} MANDATORY liaisons:</strong></p>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>• Article + noun: <em>les‿amis, un‿ami</em></p>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>• Pronoun + verb: <em>nous‿avons, ils‿ont</em></p>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>• Adjective + noun: <em>petit‿enfant, bon‿ami</em></p>
              <p style={{ margin: "0 0 8px", fontSize: 11, color: "#94a3b8" }}>• After très, bien, en, dans: <em>très‿important</em></p>

              <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#ef4444" }}>{"❌"} FORBIDDEN liaisons:</strong></p>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>• After "et" (and): <em>lui et // elle</em></p>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>• Before "h aspiré": <em>les // héros</em></p>
              <p style={{ margin: "0 0 8px", fontSize: 11, color: "#94a3b8" }}>• After a singular noun: <em>un étudiant // intelligent</em></p>

              <p style={{ margin: "0 0 4px" }}><strong style={{ color: "#f59e0b" }}>{"🔊"} Sound changes:</strong></p>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>• S/X → /z/: <em>les‿amis</em> = /le<strong>z</strong>ami/</p>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>• D → /t/: <em>grand‿ami</em> = /grɑ̃<strong>t</strong>ami/</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>• N links directly: <em>un‿ami</em> = /œ̃<strong>n</strong>ami/</p>
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 10, fontFamily: "'Outfit'" }}>{"🎧"} Now explore these examples — tap to listen:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {LIAISON_RULES.map((l, i) => {
          const isA = active === i;
          return (
            <div key={i} onClick={() => { V.sfx("click"); V.say(l.example, 0.7); setActive(i); const ne = new Set(explored); ne.add(i); setExplored(ne); }}
              style={{ padding: "14px 16px", borderRadius: 14, border: isA ? "2px solid #f43f5e" : "1px solid #f1f5f9", background: isA ? "#0f172a" : "#fff", color: isA ? "#fff" : "#0f172a", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Outfit'" }}>{l.example} <SpeakBtn text={l.example} size={14} /></span>
                <span style={{ fontSize: 9, background: isA ? "rgba(244,63,94,0.2)" : "#f8fafc", padding: "3px 8px", borderRadius: 6, fontWeight: 700, color: isA ? "#fda4af" : "#64748b" }}>{l.rule}</span>
              </div>
              {isA && (
                <div style={{ marginTop: 10, animation: "fadeIn 0.2s" }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>{l.ipa}</div>
                  <p style={{ fontSize: 12, color: "#fda4af", margin: 0 }}>{l.tip}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>= "{l.en}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {explored.size >= LIAISON_RULES.length && (
        <button onClick={() => { addGems(GEMS_PER_LEVEL); V.sfx("unlock"); setTimeout(onUnlock, 500); }}
          style={{ display: "block", margin: "0 auto", padding: "14px 28px", background: "linear-gradient(135deg, #f43f5e, #a855f7)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'", animation: "bounceIn 0.4s" }}>
          UNLOCK NEXT +{GEMS_PER_LEVEL}💎
        </button>
      )}
    </div>
  );
};

// ── LVL 12: FINAL CERTIFICATE ────────────────────────────────

const CertificateSlide = ({ totalGems }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ background: "#fffbf0", border: "3px solid #0f172a", padding: "36px 28px", maxWidth: 520, margin: "0 auto", position: "relative" }}>
      {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, width: 8, height: 8, borderRadius: "50%", background: "#0f172a" }} />
      ))}
      <div style={{ background: "#f43f5e", color: "#fff", display: "inline-block", padding: "3px 12px", fontSize: 8, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Official Document</div>
      <h1 style={{ fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 900, color: "#0f172a", margin: "0 0 3px", fontFamily: "'Outfit'" }}>PHONÉTIQUE MASTERY</h1>
      <p style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>French Pronunciation • A1</p>
      <div style={{ borderBottom: "3px solid #0f172a", maxWidth: 300, margin: "0 auto 20px" }}>
        <input type="text" placeholder="YOUR NAME" style={{ width: "100%", textAlign: "center", fontSize: "clamp(18px, 4vw, 30px)", fontWeight: 900, background: "transparent", border: "none", outline: "none", color: "#f43f5e", textTransform: "uppercase", paddingBottom: 4, fontFamily: "'Outfit'" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
        <div><span style={{ fontSize: 24 }}>💎</span><div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", fontFamily: "'Outfit'" }}>{totalGems}</div><div style={{ fontSize: 8, color: "#64748b", letterSpacing: 1 }}>GEMS</div></div>
        <div style={{ width: 50, height: 50, borderRadius: "50%", border: "3px double #991b1b", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(12deg)" }}>
          <span style={{ fontSize: 7, fontWeight: 800, color: "#991b1b", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2 }}>Sound<br />Master</span>
        </div>
      </div>
    </div>
  </div>
);


// ── PHASE 2: CONSONANT QUIZ ──────────────────────────────────

const ConsonantQuiz = ({ onUnlock, addGems }) => {
  const QS = useRef([
    { audio: "rouge", answer: "R", options: ["R", "L", "GN", "CH"], en: "red" },
    { audio: "chat", answer: "CH", options: ["CH", "J", "S", "GN"], en: "cat" },
    { audio: "montagne", answer: "GN", options: ["GN", "N", "CH", "J"], en: "mountain" },
    { audio: "jour", answer: "J", options: ["J", "CH", "GN", "R"], en: "day" },
    { audio: "merci", answer: "R", options: ["R", "L", "J", "CH"], en: "thank you" },
    { audio: "chose", answer: "CH", options: ["CH", "S", "J", "R"], en: "thing" },
    { audio: "ligne", answer: "GN", options: ["GN", "N", "L", "J"], en: "line" },
    { audio: "manger", answer: "J", options: ["J", "GN", "CH", "R"], en: "to eat" },
  ].sort(() => Math.random() - 0.5)).current;
  const [idx, setIdx] = useState(0); const [selected, setSelected] = useState(null); const [status, setStatus] = useState("idle"); const [gems, setGems] = useState(0);
  const q = QS[idx];
  const handleCheck = () => {
    if (selected === q.answer) { V.sfx("gem"); setStatus("correct"); setGems(g => g + 1); setTimeout(() => { if (idx + 1 >= QS.length) { addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 800); } else { setIdx(i => i + 1); setSelected(null); setStatus("idle"); } }, 800); }
    else { V.sfx("no"); setStatus("wrong"); setTimeout(() => setStatus("idle"), 1200); }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <Tip>{"💡"} Listen and identify the <strong>tricky consonant</strong>: R, CH, J, or GN?</Tip>
      <GemCounter gems={gems} total={QS.length} /><ProgressDots total={QS.length} current={idx} />
      <button onClick={() => V.say(q.audio, 0.7)} style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: "#0f172a", cursor: "pointer", margin: "0 auto 12px", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>▶️</button>
      <p style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Outfit'", marginBottom: 16 }}>"{q.audio}" ({q.en})</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {q.options.map(opt => (<button key={opt} onClick={() => { V.sfx("click"); setSelected(opt); }} style={{ padding: "14px 22px", borderRadius: 12, border: selected === opt ? "2px solid #f43f5e" : "1px solid #e2e8f0", background: selected === opt ? "#f43f5e" : "#fff", color: selected === opt ? "#fff" : "#334155", fontWeight: 900, fontSize: 18, cursor: "pointer", fontFamily: "'Outfit'" }}>{opt}</button>))}
      </div>
      {selected && status === "idle" && <button onClick={handleCheck} style={{ padding: "12px 32px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 50, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'" }}>CONFIRM</button>}
      {status === "correct" && <div style={{ color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s" }}>✅ +1 💎</div>}
      {status === "wrong" && <div style={{ color: "#ef4444", fontSize: 13 }}>❌ The sound was {q.answer}!</div>}
    </div>
  );
};

// ── PHASE 2: U vs OU DRILL ───────────────────────────────────

const UvsOUDrill = ({ onUnlock, addGems }) => {
  const QS = useRef([
    { word: "rue", answer: "u", en: "street" }, { word: "roue", answer: "ou", en: "wheel" },
    { word: "vu", answer: "u", en: "seen" }, { word: "vous", answer: "ou", en: "you" },
    { word: "tu", answer: "u", en: "you" }, { word: "tout", answer: "ou", en: "all" },
    { word: "lune", answer: "u", en: "moon" }, { word: "nous", answer: "ou", en: "we" },
    { word: "sur", answer: "u", en: "on" }, { word: "sous", answer: "ou", en: "under" },
    { word: "bu", answer: "u", en: "drunk" }, { word: "bout", answer: "ou", en: "end" },
  ].sort(() => Math.random() - 0.5)).current;
  const [idx, setIdx] = useState(0); const [status, setStatus] = useState("idle"); const [gems, setGems] = useState(0);
  const q = QS[idx];
  const handleAnswer = (a) => {
    V.sfx("click"); if (a === q.answer) { V.sfx("gem"); setStatus("correct"); setGems(g => g + 1);
      setTimeout(() => { if (idx + 1 >= QS.length) { addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 800); } else { setIdx(i => i + 1); setStatus("idle"); } }, 800);
    } else { V.sfx("no"); setStatus("wrong"); setTimeout(() => setStatus("idle"), 1200); }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <Tip>{"💡"} The #1 hardest distinction! <strong>U</strong> = "ee" + rounded lips. <strong>OU</strong> = "oo" in food.</Tip>
      <GemCounter gems={gems} total={QS.length} /><ProgressDots total={QS.length} current={idx} />
      <button onClick={() => V.say(q.word, 0.65)} style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: "#0f172a", cursor: "pointer", margin: "0 auto 12px", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>▶️</button>
      <p style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Outfit'", marginBottom: 16 }}>"{q.word}" ({q.en})</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <button onClick={() => status === "idle" && handleAnswer("u")} style={{ padding: "18px 32px", borderRadius: 16, border: "2px solid #6366f1", background: status === "correct" && q.answer === "u" ? "#6366f1" : "#fff", color: status === "correct" && q.answer === "u" ? "#fff" : "#6366f1", fontWeight: 900, fontSize: 24, cursor: "pointer", fontFamily: "'Outfit'" }}>U</button>
        <button onClick={() => status === "idle" && handleAnswer("ou")} style={{ padding: "18px 32px", borderRadius: 16, border: "2px solid #8b5cf6", background: status === "correct" && q.answer === "ou" ? "#8b5cf6" : "#fff", color: status === "correct" && q.answer === "ou" ? "#fff" : "#8b5cf6", fontWeight: 900, fontSize: 24, cursor: "pointer", fontFamily: "'Outfit'" }}>OU</button>
      </div>
      {status === "correct" && <div style={{ marginTop: 12, color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s" }}>✅ +1 💎</div>}
      {status === "wrong" && <div style={{ marginTop: 12, color: "#ef4444", fontSize: 13 }}>❌ That was "{q.answer}"!</div>}
    </div>
  );
};

// ── PHASE 2: LIAISON QUIZ ────────────────────────────────────

const LiaisonQuiz = ({ onUnlock, addGems }) => {
  const QS = useRef([
    { phrase: "les amis", liaison: true, sound: "/z/", en: "the friends" },
    { phrase: "les héros", liaison: false, sound: "", en: "the heroes" },
    { phrase: "nous avons", liaison: true, sound: "/z/", en: "we have" },
    { phrase: "et elle", liaison: false, sound: "", en: "and she" },
    { phrase: "petit enfant", liaison: true, sound: "/t/", en: "small child" },
    { phrase: "un ami", liaison: true, sound: "/n/", en: "a friend" },
    { phrase: "très important", liaison: true, sound: "/z/", en: "very important" },
    { phrase: "un étudiant intelligent", liaison: false, sound: "", en: "an intelligent student" },
  ].sort(() => Math.random() - 0.5)).current;
  const [idx, setIdx] = useState(0); const [status, setStatus] = useState("idle"); const [gems, setGems] = useState(0);
  const q = QS[idx]; const correct = q.liaison ? "yes" : "no";
  const handleAnswer = (a) => {
    V.sfx("click"); if (a === correct) { V.sfx("gem"); setStatus("correct"); setGems(g => g + 1);
      setTimeout(() => { if (idx + 1 >= QS.length) { addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 800); } else { setIdx(i => i + 1); setStatus("idle"); } }, 1000);
    } else { V.sfx("no"); setStatus("wrong"); setTimeout(() => setStatus("idle"), 1500); }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <Tip>{"💡"} Should you make a <strong>liaison</strong>? Apply the rules you learned!</Tip>
      <GemCounter gems={gems} total={QS.length} /><ProgressDots total={QS.length} current={idx} />
      <div style={{ background: "#0f172a", borderRadius: 18, padding: "24px 18px", maxWidth: 380, margin: "0 auto 16px", color: "#fff" }}>
        <p style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Outfit'", margin: "0 0 6px" }}>"{q.phrase}" <SpeakBtn text={q.phrase} size={16} rate={0.7} /></p>
        <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{q.en}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => status === "idle" && handleAnswer("yes")} style={{ padding: "16px 28px", borderRadius: 14, border: "2px solid #10b981", background: status === "correct" && q.liaison ? "#10b981" : "#fff", color: status === "correct" && q.liaison ? "#fff" : "#10b981", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit'" }}>⛓️ YES</button>
        <button onClick={() => status === "idle" && handleAnswer("no")} style={{ padding: "16px 28px", borderRadius: 14, border: "2px solid #ef4444", background: status === "correct" && !q.liaison ? "#ef4444" : "#fff", color: status === "correct" && !q.liaison ? "#fff" : "#ef4444", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit'" }}>✂️ NO</button>
      </div>
      {status === "correct" && <div style={{ color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s" }}>✅ +1 💎 {q.liaison ? `Linked with ${q.sound}` : "No liaison!"}</div>}
      {status === "wrong" && <div style={{ color: "#ef4444", fontSize: 13 }}>❌ {q.liaison ? `Yes! Link with ${q.sound}` : "Forbidden liaison!"}</div>}
    </div>
  );
};

// ── PHASE 2: FINAL BOSS ──────────────────────────────────────

const FinalBossPhon = ({ onUnlock, addGems }) => {
  const ALL_Q = useRef([
    { audio: "lune", answer: "u", options: ["u", "ou", "eu", "o"], en: "moon" },
    { audio: "bleu", answer: "eu", options: ["eu", "u", "o", "ou"], en: "blue" },
    { audio: "enfant", answer: "nasal", options: ["nasal", "oral"], en: "child" },
    { audio: "été", answer: "oral", options: ["nasal", "oral"], en: "summer" },
    { audio: "rouge", answer: "R", options: ["R", "L", "J", "CH"], en: "red" },
    { audio: "champagne", answer: "GN", options: ["GN", "N", "CH", "J"], en: "champagne" },
    { audio: "voiture", answer: "oi", options: ["oi", "ou", "ai", "au"], en: "car" },
    { audio: "maison", answer: "ai", options: ["ai", "oi", "eau", "eu"], en: "house" },
    { audio: "dessus", answer: "dessus", options: ["dessus", "dessous"], en: "above" },
    { audio: "poisson", answer: "poisson", options: ["poisson", "poison"], en: "fish" },
    { audio: "rue", answer: "u", options: ["u", "ou"], en: "street" },
    { audio: "vous", answer: "ou", options: ["u", "ou"], en: "you" },
    { audio: "père", answer: "è", options: ["é", "è", "e", "a"], en: "father" },
    { audio: "jour", answer: "J", options: ["J", "CH", "GN", "R"], en: "day" },
    { audio: "pont", answer: "nasal", options: ["nasal", "oral"], en: "bridge" },
    { audio: "eau", answer: "eau", options: ["eau", "eu", "ou", "au"], en: "water" },
    { audio: "tout", answer: "ou", options: ["u", "ou"], en: "all" },
    { audio: "père", answer: "père", options: ["père", "peur"], en: "father" },
    { audio: "chat", answer: "CH", options: ["CH", "J", "S", "R"], en: "cat" },
    { audio: "bon", answer: "nasal", options: ["nasal", "oral"], en: "good" },
  ].sort(() => Math.random() - 0.5)).current;
  const [gs, setGs] = useState("ready"); const [idx, setIdx] = useState(0); const [sel, setSel] = useState(null); const [st, setSt] = useState("idle"); const [lives, setLives] = useState(3); const [gems, setGems] = useState(0); const [combo, setCombo] = useState(0);
  const start = () => { setGs("playing"); setIdx(0); setLives(3); setGems(0); setCombo(0); setSt("idle"); setSel(null); V.sfx("unlock"); };
  const submit = () => {
    if (!sel) return; const q = ALL_Q[idx];
    if (sel === q.answer) { V.sfx("gem"); setSt("correct"); setGems(g => g + 1); setCombo(c => c + 1);
      setTimeout(() => { if (idx + 1 >= ALL_Q.length) { setGs("victory"); addGems(gems + 1); V.sfx("fanfare"); setTimeout(onUnlock, 1500); } else { setIdx(i => i + 1); setSel(null); setSt("idle"); } }, 700);
    } else { V.sfx("no"); setSt("wrong"); setCombo(0); setLives(l => l - 1); if (lives <= 1) setTimeout(() => setGs("gameover"), 1500); else setTimeout(() => { setSt("idle"); setSel(null); }, 1500); }
  };
  if (gs === "ready") return (<div style={{ textAlign: "center" }}><div style={{ fontSize: 56, marginBottom: 12 }}>🏆</div><h3 style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Outfit'" }}>FINAL BOSS: PHONÉTIQUE</h3><p style={{ color: "#64748b", fontSize: 13, maxWidth: 400, margin: "0 auto 20px" }}>20 questions mixing ALL sounds. 3 lives!</p><button onClick={start} style={{ padding: "16px 40px", background: "linear-gradient(135deg, #dc2626, #b91c1c)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit'" }}>{"⚔️"} BEGIN</button></div>);
  if (gs === "gameover") return (<div style={{ textAlign: "center" }}><div style={{ fontSize: 56 }}>💀</div><h3 style={{ fontSize: 22, fontWeight: 900, color: "#dc2626", fontFamily: "'Outfit'" }}>FAILED</h3><p style={{ color: "#64748b" }}>{idx+1}/{ALL_Q.length} • {gems} 💎</p><button onClick={start} style={{ marginTop: 12, padding: "14px 32px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'" }}>🔄 RETRY</button></div>);
  if (gs === "victory") return (<div style={{ textAlign: "center", animation: "fadeIn 0.5s" }}><div style={{ fontSize: 64, animation: "bounceIn 0.6s" }}>🏆</div><h3 style={{ fontSize: 28, fontWeight: 900, color: "#059669", fontFamily: "'Outfit'" }}>ESCAPED!</h3><p style={{ color: "#64748b" }}>All 20 conquered! {gems} 💎</p></div>);
  const q = ALL_Q[idx];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", borderRadius: 12, padding: "10px 14px", marginBottom: 12, color: "#fff" }}>
        <div>{Array.from({length:3},(_,i)=><span key={i} style={{fontSize:16,opacity:i<lives?1:0.15}}>{i<lives?"❤️":"🖤"}</span>)}</div>
        <span style={{ fontWeight: 900, fontFamily: "'Outfit'" }}>💎 {gems}</span>
        {combo > 1 && <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 13 }}>🔥{combo}x</span>}
      </div>
      <div style={{ width: "100%", height: 5, background: "#1e293b", borderRadius: 3, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ width: `${(idx/ALL_Q.length)*100}%`, height: "100%", background: "linear-gradient(90deg,#f43f5e,#a855f7)", transition: "width 0.5s", borderRadius: 3 }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => V.say(q.audio, 0.7)} style={{ width: 70, height: 70, borderRadius: "50%", border: "none", background: "#0f172a", cursor: "pointer", margin: "0 auto 8px", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>▶️</button>
        <p style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Outfit'", marginBottom: 4 }}>"{q.audio}" ({q.en})</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
          {q.options.map(o => (<button key={o} onClick={() => { V.sfx("click"); setSel(o); }} style={{ padding: "12px 18px", borderRadius: 12, border: sel === o ? "2px solid #f43f5e" : "1px solid #e2e8f0", background: sel === o ? "#f43f5e" : "#fff", color: sel === o ? "#fff" : "#334155", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit'", textTransform: "uppercase" }}>{o}</button>))}
        </div>
        {sel && st === "idle" && <button onClick={submit} style={{ padding: "12px 28px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 50, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit'" }}>CONFIRM</button>}
        {st === "correct" && <div style={{ color: "#059669", fontWeight: 800, animation: "bounceIn 0.3s" }}>✅ +1 💎{combo > 2 ? ` 🔥${combo}x` : ""}</div>}
        {st === "wrong" && <div style={{ color: "#ef4444", fontSize: 13 }}>❌ "{q.answer}" — Life lost!</div>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 16 LEVELS — COMPLETE
// ═══════════════════════════════════════════════════════════════

const SECTIONS = [
  { id: "brief", title: "Sound Briefing", comp: BriefingSlide },
  { id: "alpha", title: "The Alphabet", comp: AlphabetExplorer },
  { id: "vowels-learn", title: "Oral Vowels", comp: OralVowelsLearn },
  { id: "vowels-quiz", title: "Vowel Ear Test", comp: OralVowelsQuiz },
  { id: "nasal-learn", title: "Nasal Vowels", comp: NasalVowelsLearn },
  { id: "nasal-quiz", title: "Nasal vs Oral", comp: NasalQuiz },
  { id: "consonants", title: "Hard Consonants", comp: HardConsonantsLearn },
  { id: "consonant-quiz", title: "Consonant Ear Test", comp: ConsonantQuiz },
  { id: "combos", title: "Sound Combos", comp: SoundCombosLearn },
  { id: "u-ou", title: "U vs OU Drill", comp: UvsOUDrill },
  { id: "pairs", title: "Minimal Pairs", comp: MinimalPairsQuiz },
  { id: "liaisons", title: "Liaison Rules", comp: LiaisonsLearn },
  { id: "liaison-quiz", title: "Liaison Challenge", comp: LiaisonQuiz },
  { id: "boss", title: "Final Boss", comp: FinalBossPhon },
  { id: "cert", title: "Certificate", comp: CertificateSlide },
];

export default function App() {
  const [level, setLevel] = useState(0);
  const [gems, setGems] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { V.loadVoice(); }, []);

  const unlockLevel = useCallback((cur) => {
    if (cur === level) {
      const next = level + 1; setLevel(next);
      setTimeout(() => { document.getElementById(`section-${next}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 500);
    }
  }, [level]);

  const addGems = (n) => setGems(g => g + n);

  return (
    <div style={{ display: "flex", background: "#020617", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700;800&family=Outfit:wght@300;400;600;700;800;900&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounceIn { 0% { transform:scale(0.8); opacity:0; } 60% { transform:scale(1.08); } 100% { transform:scale(1); opacity:1; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes tooltipIn { from { opacity:0; transform:translateX(-50%) translateY(6px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        * { box-sizing: border-box; } body { margin:0; background:#020617; }
        input::placeholder { color:#cbd5e1; }
        @media (max-width: 768px) { .desk-side { display: none !important; } }
        @media (min-width: 769px) { .mob-top { display: none !important; } }
      `}</style>

      {/* Grid BG */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Mobile top bar */}
      <div className="mob-top" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(8,12,25,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e293b", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><span style={{ fontWeight: 900, fontSize: 13, color: "#fff", fontFamily: "'Outfit'" }}>ESCAPE FLAB</span><span style={{ fontSize: 8, color: "#f43f5e", marginLeft: 6, fontFamily: "'JetBrains Mono', monospace" }}>PHONÉTIQUE</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12 }}>💎 <strong style={{ color: "#f43f5e" }}>{gems}</strong></span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #1e293b", borderRadius: 8, padding: "5px 9px", cursor: "pointer", color: "#94a3b8", fontSize: 14 }}>{sidebarOpen ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 90 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 48, right: 0, width: 250, maxHeight: "calc(100vh - 56px)", overflowY: "auto", background: "rgba(8,12,25,0.98)", borderLeft: "1px solid #1e293b", padding: "14px 10px" }}>
            {SECTIONS.map((s, idx) => {
              const isU = idx + 1 <= level, isC = idx + 1 === level;
              return (<div key={s.id} style={{ padding: "7px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: isC ? "#f43f5e" : isU ? "rgba(52,211,153,0.55)" : "#1e293b" }}><span style={{ fontSize: 10, marginRight: 6 }}>{isU ? "✅" : "🔒"}</span>{s.title}</div>);
            })}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="desk-side" style={{ display: "flex", flexDirection: "column", width: 210, height: "100vh", position: "sticky", top: 0, borderRight: "1px solid #1e293b", background: "rgba(8,12,25,0.96)", zIndex: 50, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ padding: "18px 14px", borderBottom: "1px solid #1e293b" }}>
          <h1 style={{ fontWeight: 900, fontSize: 16, color: "#fff", margin: "0 0 2px", fontFamily: "'Outfit'" }}>ESCAPE FLAB</h1>
          <p style={{ fontSize: 8, color: "#f43f5e", fontWeight: 700, letterSpacing: 2, margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>PHONÉTIQUE • A1</p>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>💎</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#f43f5e", fontFamily: "'Outfit'" }}>{gems}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ width: "100%", height: 3, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(level / SECTIONS.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, #f43f5e, #a855f7)", transition: "width 1s", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 9, color: "#64748b", marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round((level / SECTIONS.length) * 100)}%</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "8px 8px" }}>
          {SECTIONS.map((s, idx) => {
            const isU = idx + 1 <= level, isC = idx + 1 === level;
            return (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 8, marginBottom: 1, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, background: isC ? "rgba(244,63,94,0.06)" : "transparent", color: isC ? "#f43f5e" : isU ? "rgba(52,211,153,0.55)" : "#1e293b" }}><span style={{ fontSize: 9 }}>{isU ? "✅" : "🔒"}</span>{s.title}</div>);
          })}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, width: "100%", position: "relative", zIndex: 10 }}>
        <CoverSlide onStart={() => unlockLevel(0)} totalGems={gems} />
        <div style={{ paddingBottom: 80 }}>
          {SECTIONS.map((section, idx) => {
            const sectionLevel = idx + 1;
            return (
              <SectionLayout key={section.id} id={`section-${sectionLevel}`} title={section.title} isLocked={level < sectionLevel} index={sectionLevel} gems={0}>
                <section.comp onUnlock={() => unlockLevel(sectionLevel)} addGems={addGems} totalGems={gems} />
              </SectionLayout>
            );
          })}
        </div>
      </main>
    </div>
  );
}
