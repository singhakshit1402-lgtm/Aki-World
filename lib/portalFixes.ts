/**
 * Security-hardened, bug-fixed core utilities for ikA's World (Campus Hub).
 * - Zero-eval recursive-descent math parser (replaces Function() eval)
 * - Fixed MT-2 / Canteen / EE Assignment / Multi-command / URL sanitization helpers
 * - Singleton Web Audio API manager (prevents 6-AudioContext browser leak)
 */

export function safeEvaluateArithmetic(expression: string): number | null {
  const input = expression.replace(/\s+/g, '');
  if (!input || input.length > 120) return null;
  if (!/^[0-9+\-*/().^%]+$/.test(input)) return null;

  let pos = 0;
  let depth = 0;
  const MAX_DEPTH = 32;

  const peek = (): string => input[pos] ?? '';
  const consume = (): string => input[pos++] ?? '';

  function parseExpression(): number {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseUnary();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = consume();
      const right = parseUnary();
      if ((op === '/' || op === '%') && right === 0) {
        throw new Error('Division by zero');
      }
      if (op === '*') left *= right;
      else if (op === '/') left /= right;
      else left %= right;
    }
    return left;
  }

  function parseUnary(): number {
    if (peek() === '+') {
      consume();
      return parseUnary();
    }
    if (peek() === '-') {
      consume();
      return -parseUnary();
    }
    return parsePower();
  }

  function parsePower(): number {
    const base = parsePrimary();
    if (peek() === '^') {
      consume();
      const exponent = parseUnary();
      if (Math.abs(exponent) > 1000) {
        throw new Error('Exponent out of safe bounds');
      }
      return Math.pow(base, exponent);
    }
    return base;
  }

  function parsePrimary(): number {
    if (peek() === '(') {
      depth++;
      if (depth > MAX_DEPTH) throw new Error('Max depth exceeded');
      consume();
      const val = parseExpression();
      if (peek() !== ')') throw new Error('Missing closing parenthesis');
      consume();
      depth--;
      return val;
    }

    const start = pos;
    let hasDot = false;
    while (pos < input.length) {
      const ch = input[pos];
      if (ch >= '0' && ch <= '9') {
        pos++;
      } else if (ch === '.' && !hasDot) {
        hasDot = true;
        pos++;
      } else {
        break;
      }
    }

    if (pos === start || (pos === start + 1 && input[start] === '.')) {
      throw new Error('Expected number');
    }

    const num = Number(input.slice(start, pos));
    if (!Number.isFinite(num)) throw new Error('Invalid number');
    return num;
  }

  try {
    const result = parseExpression();
    if (pos !== input.length || !Number.isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

export function trySolveMathQuerySafe(
  rawQuery: string,
  buddy: string
): { text: string; nextSugg: string } | null {
  const q = rawQuery.toLowerCase().trim();

  // Never hijack ABES subject codes, admission IDs, dates, or "24/7"
  if (/25[a-z]{2}\d{3}|2026b/i.test(q)) return null;
  if (/\b\d{1,4}[-/]\d{1,2}[-/]\d{2,4}\b/.test(q) || /\b24\/7\b/.test(q)) return null;

  // 1. Percentage Calculation (separate regexes fix "100% of 10" swap bug)
  const pctFirst = q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|ka|ki)\s*(\d+(?:\.\d+)?)/i);
  const totalFirst = pctFirst ? null : q.match(/(\d+(?:\.\d+)?)\s*(?:ka|ki)\s*(\d+(?:\.\d+)?)\s*%/i);
  if (pctFirst || totalFirst) {
    const pct = parseFloat(pctFirst ? pctFirst[1] : totalFirst![2]);
    const total = parseFloat(pctFirst ? pctFirst[2] : totalFirst![1]);
    const ans = Number(((pct / 100) * total).toFixed(4));
    return {
      text: `🧮 **Live Maths Calculator for ${buddy}!** ⚡✨\n\n• **Question:** ${pct}% of ${total}\n• **Step-by-Step:** (${pct} ÷ 100) × ${total} = **\`${ans}\`** ✅\n\n*Bhai, attendance ki percentage nikal rahe ho ya canteen bill ka discount?* 😎📐`,
      nextSugg: 'Safe bunk & SGPA kaise check karu? 🧮',
    };
  }

  // 2. Square Root / Cube Root / Factorial / Binary Conversion
  const sqrtMatch = q.match(/(?:sqrt|square root of|under root|√)\s*\(?(\d+(?:\.\d+)?)\)?/i);
  if (sqrtMatch) {
    const val = parseFloat(sqrtMatch[1]);
    const ans = Number(Math.sqrt(val).toFixed(6));
    return {
      text: `🧮 **Square Root Solved!** ⚡\n\n• **√${val}** = **\`${ans}\`** ✅\n• **Check:** ${ans} × ${ans} = ${val} 🎯`,
      nextSugg: 'Solve full Maths MT2 paper',
    };
  }

  const cbrtMatch = q.match(/(?:cbrt|cube root of|∛)\s*\(?(\d+(?:\.\d+)?)\)?/i);
  if (cbrtMatch) {
    const val = parseFloat(cbrtMatch[1]);
    const ans = Number(Math.cbrt(val).toFixed(6));
    return {
      text: `🧮 **Cube Root Solved!** ⚡\n\n• **∛${val}** = **\`${ans}\`** ✅`,
      nextSugg: 'Solve full Maths MT2 paper',
    };
  }

  const factMatch = q.match(/\bfactorial(?:\s+of)?\s+(\d+)\b|\b(\d+)\s*!/i);
  if (factMatch) {
    const n = parseInt(factMatch[1] || factMatch[2], 10);
    if (n >= 0 && n <= 20) {
      let f = 1;
      for (let i = 2; i <= n; i++) f *= i;
      return {
        text: `🧮 **Factorial Solved!** ⚡\n\n• **${n}!** = **\`${f.toLocaleString('en-IN')}\`** ✅\n• **Concept:** 1 × 2 × ... × ${n} = ${f.toLocaleString('en-IN')} 🎯`,
        nextSugg: 'Solve full Maths MT2 paper',
      };
    }
  }

  const binMatch = q.match(/\b(\d+)\s+(?:in|to)\s+binary\b|\bbinary\s+of\s+(\d+)\b/i);
  if (binMatch) {
    const dec = parseInt(binMatch[1] || binMatch[2], 10);
    if (!Number.isNaN(dec)) {
      return {
        text: `🔢 **Number System Conversion for ${buddy}:** ⚡\n\n• **Decimal:** \`${dec}\`\n• **Binary (Base 2):** \`${dec.toString(2)}\` ✅\n• **Octal (Base 8):** \`${dec.toString(8)}\`\n• **Hexadecimal (Base 16):** \`${dec.toString(16).toUpperCase()}\``,
        nextSugg: 'Solve full Electronics MT2 paper',
      };
    }
  }

  // 3. Quadratic Equation Solver (supports implicit ±1, decimals, a === 0 guard, complex roots)
  const quadMatch = q.match(
    /([+-]?\s*\d*(?:\.\d+)?)\s*x\^?2\s*([+-]\s*\d*(?:\.\d+)?)\s*x\s*([+-]\s*\d+(?:\.\d+)?)\s*=\s*0/i
  );
  if (quadMatch) {
    const parseCoeff = (raw: string): number => {
      const s = raw.replace(/\s+/g, '');
      if (s === '' || s === '+') return 1;
      if (s === '-') return -1;
      return parseFloat(s);
    };
    const a = parseCoeff(quadMatch[1]);
    const b = parseCoeff(quadMatch[2]);
    const c = parseFloat(quadMatch[3].replace(/\s+/g, ''));

    if (a === 0 || !Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
      return {
        text: `📐 **Not a Quadratic Equation:** Coefficient of \`x²\` (\`a\`) cannot be \`0\`.`,
        nextSugg: 'Solve full Maths MT2 paper',
      };
    }

    const fmtTerm = (val: number, suffix: string) => `${val >= 0 ? '+ ' : '- '}${Math.abs(val)}${suffix}`;
    const eqLabel = `${a}x² ${fmtTerm(b, 'x')} ${fmtTerm(c, '')} = 0`;
    const d = Number((b * b - 4 * a * c).toFixed(6));

    if (d >= 0) {
      const r1 = Number(((-b + Math.sqrt(d)) / (2 * a)).toFixed(4));
      const r2 = Number(((-b - Math.sqrt(d)) / (2 * a)).toFixed(4));
      return {
        text: `📐 **Quadratic Equation Solved (${eqLabel}):**\n\n• **Discriminant (D = b² - 4ac):** \`${d}\`\n• **Real Roots:** **x₁ = \`${r1}\`**, **x₂ = \`${r2}\`** ✅`,
        nextSugg: 'Solve full Maths MT2 paper',
      };
    } else {
      const realPart = Number((-b / (2 * a)).toFixed(4));
      const imagPart = Number((Math.sqrt(-d) / (2 * Math.abs(a))).toFixed(4));
      return {
        text: `📐 **Quadratic Equation Solved (${eqLabel}):**\n\n• **Discriminant (D = b² - 4ac):** \`${d}\` *(Negative → Complex Roots)*\n• **Roots:** **x₁ = \`${realPart} + ${imagPart}i\`**, **x₂ = \`${realPart} - ${imagPart}i\`** ✅`,
        nextSugg: 'Solve full Maths MT2 paper',
      };
    }
  }

  // 4. Safe BODMAS Arithmetic (zero eval / zero Function)
  const cleanedExpr = q
    .replace(/(?:what is|calculate|solve|kitna hota hai|kitna hoga|batao|value of|ans of|equals|equal to|=|\?)/gi, '')
    .replace(/(\d)\s*[×x]\s*(\d)/gi, '$1 * $2')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\bpi\b/g, '3.14159265')
    .trim();

  const extractedExpr =
    /^[0-9+\-*/().^\s%]+$/.test(cleanedExpr)
      ? cleanedExpr
      : (
          cleanedExpr.match(/([0-9]+(?:\.[0-9]+)?(?:\s*[+\-*/^%]\s*\(?[0-9]+(?:\.[0-9]+)?\)?)+)/)?.[1] || ''
        ).trim();

  if (
    extractedExpr &&
    /^[0-9+\-*/().^\s%]+$/.test(extractedExpr) &&
    /[+\-*/^%]/.test(extractedExpr) &&
    /\d/.test(extractedExpr)
  ) {
    const result = safeEvaluateArithmetic(extractedExpr);
    if (result !== null) {
      const formatted = Number.isInteger(result) ? result : Number(result.toFixed(6));
      return {
        text: `🧮 **ikA's Instant Maths Engine!** ⚡📐\n\n• **Expression:** \`${extractedExpr}\`\n• **Final Answer:** **\`${formatted}\`** ✅\n\n*Vimal Sir style me bolu toh—**"Are you getting it?!"** Koi aur calculation ya equation hai toh phenko!* 😂🔥`,
        nextSugg: 'Solve full Maths MT2 paper',
      };
    }
    if (/\/\s*0(?:\.0+)?(?:\D|$)/.test(extractedExpr)) {
      return {
        text: `🧮 **Division by Zero Detected!** ⚠️\n\n• **Expression:** \`${extractedExpr}\`\n• **Result:** **Undefined** *(Cannot divide by zero in real arithmetic!)*`,
        nextSugg: 'Solve full Maths MT2 paper',
      };
    }
  }

  return null;
}

export function extractMT2SubQuestionKey(q: string): string | null {
  const subMatch =
    q.match(/\b(?:q\.?|question)\s*([1-4])\s*\(?\s*([a-e])\s*\)?\b/i) ||
    q.match(/\b([1-4])\s*\(\s*([a-e])\s*\)/i);
  if (!subMatch) return null;
  return `${subMatch[1]}${subMatch[2].toLowerCase()}`;
}

export function hasMT2SolutionIntent(q: string): boolean {
  return (
    /\b(solve|solution|solutions|answer|answers|ans|section\s*[abc])\b/i.test(q) ||
    /\b(?:q\.?|question)\s*[1-4]\b/i.test(q) ||
    /\b[1-4]\s*\(\s*[a-e]\s*\)/i.test(q)
  );
}

export function isRoyalEnfieldDTCaseStudy(q: string): boolean {
  const lower = q.toLowerCase();
  if (!lower.includes('royal enfield')) return false;
  if (/\b(cars?|superbikes?|supra|gt-?r|thar|bike|garage|mustang)\b/i.test(lower)) return false;
  return true;
}

export function detectCanteenIntent(rawQuery: string): {
  isFoodQuery: boolean;
  isHostel: boolean;
  isTeaMen: boolean;
} {
  const q = rawQuery.toLowerCase().trim();
  const hasFoodContext =
    /\b(canteen|cafe|menu|maggi|momos?|samosa|paranth?a|chh?ole|cold coffee|shikanji|biryani|chaap|omelette|patties|bhookh|khana|thaali|thali|noodles?|burger|sandwich|kulcha|lassi|rate\s*list|price\s*list)\b/i.test(
      q
    ) ||
    /\b(egg\s*(roll|curry)|boiled\s*egg|oreo\s*shake|kitkat\s*shake|banana\s*shake|chocolate\s*shake|shake\s*price)\b/i.test(
      q
    );

  const isHostel =
    /\b(kj\s*cafe|k\.j\.?\s*cafe|boys\s*hostel\s*(?:waali\s*)?canteen|hostel\s*(?:waali\s*)?(?:canteen|menu|cafe))\b/i.test(
      q
    ) ||
    (/\bhostel\b/i.test(q) &&
      hasFoodContext &&
      !/\b(hostel\s*life|protein\s*diet|gym|warden|wi-?fi|mess\s*ka\s*khana)\b/i.test(q));

  const isTeaMen =
    /\b(tea\s*men'?s?|teamen|college\s*(?:mei\s*)?(?:upper\s*)?waali\s*canteen|upper\s*(?:waali\s*)?canteen)\b/i.test(
      q
    );

  return {
    isFoodQuery: isHostel || isTeaMen || hasFoodContext,
    isHostel,
    isTeaMen,
  };
}

export function detectEEAssignmentQuestionNumber(q: string): number | null {
  const qNumMatch = q.match(/\b(?:q\.?|question|que|ans)[\s\-]*?(10|[1-9])\b/i);
  if (qNumMatch) return parseInt(qNumMatch[1], 10);

  if (q.includes('100') && q.includes('120') && q.includes('240') && q.includes('lamp')) return 1;
  if (q.includes('400') && q.includes('3000t') && q.includes('10')) return 2;
  if (q.includes('parallel') && q.includes('20') && q.includes('7') && /\b(50\s*hz|r1|branch|current)\b/i.test(q)) return 3;
  if (q.includes('200') && q.includes('230') && q.includes('8') && q.includes('capacitor')) return 4;
  if (q.includes('non-inductive') && q.includes('10') && q.includes('200')) return 5;
  if (q.includes('50') && (q.includes('millihenry') || /\bmh\b/i.test(q)) && q.includes('200')) return 6;
  if (q.includes('series-parallel') && q.includes('100')) return 7;
  if (q.includes('ammeter') && q.includes('voltmeter') && q.includes('45')) return 8;
  if (q.includes('two impedances') && q.includes('parallel') && q.includes('20')) return 9;
  if (q.includes('three-phase') && q.includes('star') && q.includes('delta')) return 10;

  return null;
}

export function splitMultiCommands(rawQuery: string): string[] {
  const hasMultiConnectors =
    /\b(?:aur|and|plus|also|phir|fir|then|saath\s+me|sath\s+me)\b|&|;/i.test(rawQuery);
  if (!hasMultiConnectors) return [rawQuery.trim()].filter(Boolean);

  return rawQuery
    .split(/\b(?:aur\s+saath\s+me|aur\s+bhi|saath\s+me|sath\s+me|aur|and\s+also|and\s+then|and|plus|also|phir|fir|then)\b|&|;/i)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

/**
 * Sanitizes markdown link/image URLs so javascript:/data: XSS is impossible.
 */
export function isSafeHrefOrSrc(url: string): boolean {
  const trimmed = url.trim();
  return (
    (trimmed.startsWith('/') && !trimmed.startsWith('//')) ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://')
  );
}

// ============================================================================
// SINGLETON WEB AUDIO ENGINE (ZERO AudioContext LEAK)
// ============================================================================
let sharedAudioCtx: AudioContext | null = null;
let activeStingerAudio: HTMLAudioElement | null = null;
let activeCutoffTimer: number | null = null;
let isMobileAudioUnlocked = false;

export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (sharedAudioCtx && sharedAudioCtx.state !== 'closed') return sharedAudioCtx;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  sharedAudioCtx = new AudioCtx();
  return sharedAudioCtx;
}

export async function unlockMobileAudioSafe(): Promise<boolean> {
  if (isMobileAudioUnlocked) return true;
  const ctx = getSharedAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    if (ctx.state === 'running') {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      isMobileAudioUnlocked = true;
      return true;
    }
  } catch {
    // Retry on next user gesture
  }
  return false;
}

export function playPanicBeepSafe(freq1 = 880, freq2 = 440): void {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq1, now);
    osc.frequency.exponentialRampToValueAtTime(freq2, now + 0.18);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Ignore synth errors
  }
}

export function playHorrorAudioStingerSafe(type: string | null): void {
  if (!type || typeof window === 'undefined') return;

  if (activeCutoffTimer !== null) {
    window.clearTimeout(activeCutoffTimer);
    activeCutoffTimer = null;
  }
  if (activeStingerAudio) {
    activeStingerAudio.onended = null;
    activeStingerAudio.pause();
    activeStingerAudio.currentTime = 0;
    activeStingerAudio = null;
  }

  try {
    const fileMap: Record<string, string> = {
      ryuk_laugh: '/ryuk_laugh.mp3',
      bell: '/death_note_bell.mp3',
      thunder: '/thunder.mp3',
    };
    const fileUrl = fileMap[type] || '/ryuk_laugh.mp3';
    const audio = new Audio(fileUrl);
    audio.volume = 1.0;
    audio.preload = 'auto';
    activeStingerAudio = audio;

    let playCount = 0;
    const maxPlays = type === 'bell' ? 2 : type === 'ryuk_laugh' ? 2 : 1;

    audio.onended = () => {
      playCount++;
      if (playCount < maxPlays && activeStingerAudio === audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    const cutoffMs = type === 'bell' ? 8000 : type === 'ryuk_laugh' ? 14000 : 12000;
    activeCutoffTimer = window.setTimeout(() => {
      if (activeStingerAudio === audio) {
        audio.onended = null;
        audio.pause();
        audio.currentTime = 0;
        activeStingerAudio = null;
      }
      activeCutoffTimer = null;
    }, cutoffMs);
  } catch {
    // Ignore autoplay errors
  }
}
