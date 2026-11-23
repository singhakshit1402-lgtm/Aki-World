'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { StudentUser } from '@/app/page';

export interface NuisanceMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface NuisanceSession {
  id: string;
  title: string;
  messages: NuisanceMessage[];
}

interface NuisanceCertificateProps {
  currentUser: StudentUser | null;
  messages: NuisanceMessage[];
  sessions?: NuisanceSession[];
  onBack: () => void;
  isBoss: boolean;
}

export interface NuisanceProfile {
  archetypeId: string;
  categoryLabel: string;
  title: string;
  hindiTitle: string;
  badge: string;
  badgeColor: string;
  avatarEmoji: string;
  quote: string;
  charges: string[];
  penalty: string;
  auraScore: string;
}

export const ALL_NUISANCE_ARCHETYPES: Record<string, NuisanceProfile> = {
  boss: {
    archetypeId: 'boss',
    categoryLabel: 'Supreme Overlord 👑',
    title: 'SUPREME SHINIGAMI OVERLORD OF CAMPUS NUISANCE',
    hindiTitle: 'सर्वोच्च उपद्रव सम्राट एवं कालदूत',
    badge: 'MYTHIC SSS-TIER CHAOS 👑⚡',
    badgeColor: 'from-red-600 via-amber-500 to-purple-600',
    avatarEmoji: '👑💀',
    quote: 'Main jiska naam Death Note me likh du, uska attendance register se pehle dimaag evaporate ho jata hai!',
    charges: [
      'Dhara 1402: ABES ke server matrix aur batch ke dimaag pe 100% sovereign adhikaar.',
      'Dhara 302: Kisi bhi student ko 1-click me heart attack timer ya gaslight 500 error lagana.',
      'Dhara 777: Har portal window me "Swagat hai Boss ikA" ka lal rang ka shinigami decree failana.',
    ],
    penalty: 'Roz shaam ko Shinigami apple khana aur server matrix par shanti banaye rakhna!',
    auraScore: '+99,999 AURA',
  },
  crush_girl: {
    archetypeId: 'crush_girl',
    categoryLabel: 'Dil-Todne Wali 🌸',
    title: 'CERTIFIED DIL-TODNE WALI (PAPA KI PARI PRO MAX)',
    hindiTitle: 'प्रमाणित दिल तोड़ने वाली एवं पापा की परी',
    badge: 'HIGH VOLTAGE HEARTBREAKER 🌸💔',
    badgeColor: 'from-pink-500 via-rose-500 to-purple-600',
    avatarEmoji: '🌸💅',
    quote: 'Tum bohot acche dost ho yaar... par main abhi padhai pe focus kar rahi hu! (Khud 9.7 SGPA le aayi)',
    charges: [
      'Dhara 302: ABES ke 15+ innocent masoom backbenchers ko "You are just a friend" bol ke dil todna.',
      'Dhara 420: Exam se 5 minute pehle sabhi se assignment copy maang ke top karna.',
      'Dhara 100: WhatsApp aur Instagram pe message 3 ghante "Seen" chhod ke ghost karna.',
    ],
    penalty: 'Agli baar Tea Men Canteen me bina dosto ko treat diye Kurkure Momos nahi khane ki strict warning!',
    auraScore: '+9,850 AURA',
  },
  laundiya_baaz: {
    archetypeId: 'laundiya_baaz',
    categoryLabel: 'Laundiya Baaz 😏',
    title: 'CERTIFIED SUPREME LAUNDIYA BAAZ (लौंडिया बाज़ PRO MAX)',
    hindiTitle: 'प्रमाणित सर्वोच्च लौंडिया बाज़',
    badge: 'NATIONAL CRUSH STALKER 😏🔥',
    badgeColor: 'from-amber-500 via-red-500 to-rose-600',
    avatarEmoji: '😏👑',
    quote: 'Maths ke FLAS me 1 bhi formula nahi pata, par aage wali row ke baal kitni baar flip huye exact count hai!',
    charges: [
      'Dhara 420: Lecture me board dekhne ke bajaye aage wali crush ko dekh ke muskurana.',
      'Dhara 109: Har nayi aane wali ladki ko dekh ke dosto ko "Bhai bhabhi hai teri" bolna.',
      'Dhara 007: Notes maangne ke bahaane se direct Instagram handle maangne ki naakaam koshish.',
    ],
    penalty: 'Is praani ko roz subah 1 ghanta Single Sher Motivation sunna aur dukan pe baithna anivarya hai!',
    auraScore: '+9,750 AURA',
  },
  proxy_mafia: {
    archetypeId: 'proxy_mafia',
    categoryLabel: 'Proxy Smuggler 🏃‍♂️',
    title: 'MASTER PROXY SMUGGLER & 74.9% BUNK MAFIA',
    hindiTitle: 'मास्टर प्रॉक्सी स्मगलर एवं बंक विशेषज्ञ',
    badge: '74.9% ATTENDANCE SURVIVOR 🏃‍♂️💨',
    badgeColor: 'from-emerald-500 via-teal-500 to-cyan-600',
    avatarEmoji: '🏃‍♂️🧮',
    quote: 'Teacher register khole usse pehle attendance formula calculate kar lena hi meri pehchan hai!',
    charges: [
      'Dhara 75: Attendance 74.8% hone par bhi "Bhai 75 ho hi jayegi" bol ke class bunk maarna.',
      'Dhara 420: Roll number 15 ke baad teacher ki aawaz me achanak "Present Sir!" bolna.',
      'Dhara 144: Medical certificate ke naam par fake typhoid ki report upload karne ka prayas.',
    ],
    penalty: 'Har lecture me sabse aage baith kar teacher se 100% eye-contact maintain karna hoga!',
    auraScore: '+9,420 AURA',
  },
  canteen_bhukkad: {
    archetypeId: 'canteen_bhukkad',
    categoryLabel: 'Canteen Diplomat 🥟',
    title: 'TEA MEN UPPER CANTEEN SAMOSA DIPLOMAT',
    hindiTitle: 'टी मेन कैंटीन समोसा राजनयिक',
    badge: 'SAMOSA DESTROYER GRADE-1 🥟☕',
    badgeColor: 'from-amber-500 via-yellow-500 to-orange-600',
    avatarEmoji: '🥟☕',
    quote: '10 minute ke break me Upper Canteen se 2 samosa aur 1 cutting chai lana hi mera permanent career goal hai!',
    charges: [
      'Dhara 100: Lecture start hote hi "Bhai 2 minute me aa raha hu" bol ke 2 ghante Tea Men\'s pe baithna.',
      'Dhara 420: K.J Cafe wale bhaiya se "Bhaiya extra mayonnaise aur green chutney dena" bol ke negotiate karna.',
      'Dhara 200: Dost ki treat me sabse mehnga shake order karke bolna "Bhai agla mera pakka"!',
    ],
    penalty: 'Agli 5 visits me canteen wale bhaiya se Udhaari book ka hisaab clear karna padega!',
    auraScore: '+9,100 AURA',
  },
  maggi_philosopher: {
    archetypeId: 'maggi_philosopher',
    categoryLabel: '2 AM Maggi Chef 🍜',
    title: '2 AM BOYS HOSTEL MAGGI PHILOSOPHER & KETTLE ENGINEER',
    hindiTitle: '2 AM हॉस्टल मैगी दार्शनिक एवं केतली इंजीनियर',
    badge: 'ELECTRIC KETTLE CHEF 🍜⚡',
    badgeColor: 'from-yellow-500 via-amber-500 to-red-500',
    avatarEmoji: '🍜🔌',
    quote: 'Raat ke 2 baje 1 cup Maggi me 4 roommates ki dosti aur dushmani dono test ho jaati hai!',
    charges: [
      'Dhara 302: Warden ke aane se 5 second pehle electric kettle desk ke neeche chhipana.',
      'Dhara 420: Dost ke room se bina bataye Maggi masala ka sachet gayab karna.',
      'Dhara 100: Subah 8:50 ki class ke liye 8:48 pe uthna aur toothpaste karte hue RJ-Block bhagna.',
    ],
    penalty: 'Pure hostel wing ke dosto ke liye agle 7 din tak midnight chai banana anivarya hai!',
    auraScore: '+9,280 AURA',
  },
  speed_demon: {
    archetypeId: 'speed_demon',
    categoryLabel: 'Dhoom Demon 🏍️',
    title: 'DHOOM SPEED DEMON & REVVING CHHAPRI KING',
    hindiTitle: 'धूम स्पीड दैत्य एवं रेविंग किंग',
    badge: 'NH-24 HIGHWAY TERROR 🏍️💨',
    badgeColor: 'from-emerald-500 via-lime-500 to-amber-500',
    avatarEmoji: '🏍️🔥',
    quote: 'Kawasaki Ninja H2R aur Hayabusa ki reel dekh ke college ke gate pe Activa full throttle ghaseetna!',
    charges: [
      'Dhara 180: Ninja H2R ki top speed (400 km/h) padh ke teacher se bolna "Sir main aerodynamics padh raha hu".',
      'Dhara 200: ABES ke mod par bina indicator aur bina helmet ke "Dhoom Machale" background sound me nikalna.',
      'Dhara 100: Tea Men ke samne khadi bike ke silencer pe ungli laga ke engine heat check karna.',
    ],
    penalty: 'Agli baar college aane ke liye rickshaw ka use karna padega taaki campus shant rahe!',
    auraScore: '+9,600 AURA',
  },
  exam_clutch_god: {
    archetypeId: 'exam_clutch_god',
    categoryLabel: 'Exam Clutch God 🎯',
    title: 'ONE-SHOT VIDEO 3 AM EXAM CLUTCH GOD',
    hindiTitle: 'वन-शॉट वीडियो 3 AM एग्जाम क्लच गॉड',
    badge: '33% PASS BOUNDARY LEGEND 🎯📚',
    badgeColor: 'from-blue-600 via-indigo-600 to-purple-600',
    avatarEmoji: '🎯⚡',
    quote: 'Poore semester me copy nahi kholi, par exam ki raat 2x speed pe One-Shot video dekh ke 65% le aana hi meri shakti hai!',
    charges: [
      'Dhara 101: Exam ki subah 7:30 baje WhatsApp group me "Bhai koi important question bhej do" spam karna.',
      'Dhara 33: Calculator me formulas ki jagah "80085" likh ke padosi ko dikhana.',
      'Dhara 420: Invigilator ke mudte hi "Bhai 2nd ka B bata de" whisper karna.',
    ],
    penalty: 'Agle exam se kam se kam 24 ghante pehle syllabus ka index page padhna anivarya hai!',
    auraScore: '+9,550 AURA',
  },
  front_bench_sleeper: {
    archetypeId: 'front_bench_sleeper',
    categoryLabel: '1st Bench Sleeper 😴',
    title: 'FIRST BENCH KUMBHKARAN & OPEN-EYE SLEEPER',
    hindiTitle: 'फर्स्ट बेंच कुंभकर्ण एवं खुली आँख स्लीपर',
    badge: 'ARE YOU GETTING IT? SURVIVOR 😴👀',
    badgeColor: 'from-teal-600 via-cyan-600 to-blue-600',
    avatarEmoji: '😴💤',
    quote: 'Vimal Sir "Are you getting it?" bol rahe the, aur main aage baith kar mundi hilate hue sapne dekh raha tha!',
    charges: [
      'Dhara 404: Samne baith kar sir ki taraf dekhte hue dimaag ko aeroplane mode pe daal dena.',
      'Dhara 100: Chashma laga kar aisi posture banana jaise deep philosophy soch rahe ho jabki deep REM sleep chal rahi thi.',
      'Dhara 200: Class khatam hote hi achanak jhatke se uth kar sabse pehle attendance lagwana.',
    ],
    penalty: 'Agli class me bench par soye bina dono haath upar karke 1 numerical solve karna hoga!',
    auraScore: '+9,150 AURA',
  },
  copy_paste_engineer: {
    archetypeId: 'copy_paste_engineer',
    categoryLabel: 'Copy-Paste Engg 💻',
    title: 'MASTER OF GITHUB COPY-PASTE & ASSIGNMENT FORGER',
    hindiTitle: 'गिटहब कॉपी-पेस्ट एवं असाइनमेंट जालसाज़',
    badge: 'STACK OVERFLOW SAMURAI 💻⌨️',
    badgeColor: 'from-violet-600 via-purple-600 to-pink-600',
    avatarEmoji: '💻⌨️',
    quote: 'Code chahe samajh na aaye, par Ctrl+C aur Ctrl+V ki speed dekh ke Google ke engineer bhi sharma jayein!',
    charges: [
      'Dhara 420: Doosre ke assignment me se uska naam mita kar apna roll number upar likhna.',
      'Dhara 101: C++ program me variable ka naam x se temp karke bolna "Sir main apna logic banaya hai".',
      'Dhara 500: Lab external viva me "Sir mere laptop me code chal raha tha, yahan compile error de raha hai" bolna.',
    ],
    penalty: 'Agli lab me bina ChatGPT aur GitHub khole 5-line ka Hello World code chalk se board par likhna!',
    auraScore: '+9,480 AURA',
  },
  campus_gossip_spiller: {
    archetypeId: 'campus_gossip_spiller',
    categoryLabel: 'Gossip Spiller 🕵️‍♀️',
    title: 'ABES SUPREME GOSSIP SPILLER & SPY NETWORK HEAD',
    hindiTitle: 'एबीईएस जासूस एवं गुप्त गपशप प्रमुख',
    badge: 'CAMPUS RAW AGENT 🕵️‍♀️☕',
    badgeColor: 'from-rose-600 via-pink-600 to-amber-600',
    avatarEmoji: '🕵️‍♀️☕',
    quote: 'Mujhe ye nahi pata ki exam me kya aayega, par ye pata hai ki kaun kiske sath Tea Men pe baitha tha!',
    charges: [
      'Dhara 007: Canteen ke corner table pe baith ke poori class ki relationships track karna.',
      'Dhara 100: Faculty lounge ke bahar aisi look dena jaise internals ke marks ki leak file mil gayi ho.',
      'Dhara 420: "Bhai kisi ko batana mat" bol ke agle 10 minute me poore section me khabar faila dena.',
    ],
    penalty: 'Pure 1 din bina kisi ki gossips sune aur bataye library me chupchap baithna!',
    auraScore: '+9,720 AURA',
  },
  general_nuisance: {
    archetypeId: 'general_nuisance',
    categoryLabel: 'Backbench Terror 😈',
    title: 'ALL-ROUND CAMPUS UPADRAVI & BACKBENCH TERROR',
    hindiTitle: 'प्रमाणित सर्वकालिक उपद्रवी एवं बैकबेंच आतंक',
    badge: 'GRADE-A CAMPUS NUISANCE 😈🪑',
    badgeColor: 'from-purple-600 via-pink-600 to-red-600',
    avatarEmoji: '😈🔥',
    quote: 'Peeche baith ke samne wale ke baal ginke timepass karna aur sir ke mudte hi table bajana hamara fundamental right hai!',
    charges: [
      'Dhara 420: Teacher ke sawal puchte hi padosi ko dekh ke hasna aur innocent face bana lena.',
      'Dhara 100: Lecture chalte waqt bench par pen se tabla bajana aur bolna "Sir acoustic sound check tha".',
      'Dhara 75: Semester bhar chill maar ke exam se 3 ghante pehle one-shot video dekh ke clutch karna.',
    ],
    penalty: 'Is praani ko roz aakhiri bench par baith ke chup rehne ka prayas karna anivarya hai!',
    auraScore: '+9,350 AURA',
  },
};

export default function NuisanceCertificate({
  currentUser,
  messages,
  sessions = [],
  onBack,
  isBoss,
}: NuisanceCertificateProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string | null>(null);

  // Play audio effects
  const playFx = useCallback((freq = 520, duration = 0.08) => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, []);

  // Auto-unlock this certificate in localStorage so user can access it anytime from Upcoming tiles or chat
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
      localStorage.setItem(`ika_nuisance_unlocked_${adm}`, 'true');
    }
  }, [currentUser]);

  // Scanning stages
  useEffect(() => {
    const timer1 = setTimeout(() => { setScanStep(1); playFx(440, 0.06); }, 400);
    const timer2 = setTimeout(() => { setScanStep(2); playFx(550, 0.06); }, 900);
    const timer3 = setTimeout(() => { setScanStep(3); playFx(660, 0.06); }, 1400);
    const timer4 = setTimeout(() => { setScanStep(4); playFx(880, 0.12); }, 1900);
    const timer5 = setTimeout(() => { setIsScanning(false); playFx(990, 0.2); }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [playFx]);

  // Determine Nuisance Profile based on user messages, clicked suggestions, and user data
  const detectedProfile = useMemo<NuisanceProfile>(() => {
    const allText = [
      ...messages.map((m) => m.content),
      ...sessions.map((s) => s.title),
    ].join(' ').toLowerCase();

    const isFemale =
      currentUser?.gender === 'F' ||
      currentUser?.name.toLowerCase().includes('agrima') ||
      false;

    // 1. Supreme Boss ikA
    if (isBoss) {
      return ALL_NUISANCE_ARCHETYPES.boss;
    }

    // 2. Crush / Flirt / Laundiyabaaz
    const hasCrushQuery =
      allText.includes('crush') ||
      allText.includes('propose') ||
      allText.includes('ladki') ||
      allText.includes('bhabhi') ||
      allText.includes('flirt') ||
      allText.includes('single') ||
      allText.includes('gf') ||
      allText.includes('girlfriend') ||
      allText.includes('pyaar');

    if (hasCrushQuery) {
      return isFemale ? ALL_NUISANCE_ARCHETYPES.crush_girl : ALL_NUISANCE_ARCHETYPES.laundiya_baaz;
    }

    // 3. Super Bikes / Racing
    const hasBikeQuery =
      allText.includes('bike') ||
      allText.includes('ninja') ||
      allText.includes('superbike') ||
      allText.includes('hayabusa') ||
      allText.includes('h2r') ||
      allText.includes('speed') ||
      allText.includes('racing');

    if (hasBikeQuery) {
      return ALL_NUISANCE_ARCHETYPES.speed_demon;
    }

    // 4. Proxy / Attendance / Bunk
    const hasProxyQuery =
      allText.includes('proxy') ||
      allText.includes('attendance') ||
      allText.includes('bunk') ||
      allText.includes('safe bunk') ||
      allText.includes('75%') ||
      allText.includes('ninja hack');

    if (hasProxyQuery) {
      return ALL_NUISANCE_ARCHETYPES.proxy_mafia;
    }

    // 5. Canteen / Samosa / Chai
    const hasCanteenQuery =
      allText.includes('canteen') ||
      allText.includes('samosa') ||
      allText.includes('chai') ||
      allText.includes('tea men') ||
      allText.includes('kurkure momos');

    if (hasCanteenQuery) {
      return ALL_NUISANCE_ARCHETYPES.canteen_bhukkad;
    }

    // 6. Maggi / Late Night Hostel
    const hasMaggiHostelQuery =
      allText.includes('maggi') ||
      allText.includes('hostel') ||
      allText.includes('kettle') ||
      allText.includes('warden') ||
      allText.includes('roommate');

    if (hasMaggiHostelQuery) {
      return ALL_NUISANCE_ARCHETYPES.maggi_philosopher;
    }

    // 7. Exam / Papers / One-Shot
    const hasExamQuery =
      allText.includes('mt2') ||
      allText.includes('paper') ||
      allText.includes('exam') ||
      allText.includes('datesheet') ||
      allText.includes('one shot') ||
      allText.includes('pass');

    if (hasExamQuery) {
      return ALL_NUISANCE_ARCHETYPES.exam_clutch_god;
    }

    // 8. Gossip / Faculty
    const hasGossipQuery =
      allText.includes('gossip') ||
      allText.includes('faculty') ||
      allText.includes('dossier') ||
      allText.includes('sir') ||
      allText.includes('maam');

    if (hasGossipQuery) {
      return ALL_NUISANCE_ARCHETYPES.campus_gossip_spiller;
    }

    // 9. Copy Paste / Labs
    const hasCodingQuery =
      allText.includes('code') ||
      allText.includes('c++') ||
      allText.includes('assignment') ||
      allText.includes('lab') ||
      allText.includes('github');

    if (hasCodingQuery) {
      return ALL_NUISANCE_ARCHETYPES.copy_paste_engineer;
    }

    // Default: General Campus Nuisance
    return ALL_NUISANCE_ARCHETYPES.general_nuisance;
  }, [currentUser, messages, sessions, isBoss]);

  // Final active profile (allows user manual override from category pills)
  const profile = (selectedArchetypeId && ALL_NUISANCE_ARCHETYPES[selectedArchetypeId])
    ? ALL_NUISANCE_ARCHETYPES[selectedArchetypeId]
    : detectedProfile;

  const displayName = (currentUser?.name || 'CITIZEN OF ikA WORLD').toUpperCase();
  const displayRoll = currentUser?.rollNo ? `ROLL #${currentUser.rollNo}` : 'CSE';
  const displaySec = currentUser?.section || 'CSE-2';
  const displayAdm = currentUser?.admissionNo || '2026B01010***';

  // DIRECT WHATSAPP SHARE
  const handleShareWhatsApp = () => {
    playFx(820, 0.1);
    const text = `📜 *CERTIFICATE OF OFFICIAL NUISANCE (उपद्रव प्रमाण पत्र)* 💀👑\n\n👤 *${displayName}* (${displayRoll} • *Sec ${displaySec}*)\n🎖️ *Official Title:* ${profile.avatarEmoji} *${profile.title}*\n🏆 *Status:* ${profile.badge} (${profile.auraScore})\n\n⚖️ *Campus Charges (Dharayein):*\n${profile.charges.map((c) => `• ${c}`).join('\n')}\n\n💬 *Signature Quote:*\n"${profile.quote}"\n\n📜 *Decree:* ${profile.penalty}\n\n👉 *Apna Nuisance Degree check karo:* https://ki-world.vercel.app`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // NATIVE SHARE / CLIPBOARD
  const handleCopyDecree = () => {
    playFx(820, 0.1);
    const text = `📜 OFFICIAL CERTIFICATE OF NUISANCE: ${displayName} (${profile.title})\n"${profile.quote}"\nhttps://ki-world.vercel.app`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyMsg('📋 Certificate text copied to clipboard!');
      setTimeout(() => setCopyMsg(null), 3000);
    }
  };

  // DOWNLOAD CERTIFICATE PNG
  const handleDownloadCertificatePng = async () => {
    setIsGeneratingPng(true);
    playFx(920, 0.15);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 850;
      const height = 1150;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Parchment Obsidian Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0a0c');
      bgGrad.addColorStop(0.5, '#180e0e');
      bgGrad.addColorStop(1, '#050505');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Double Gold Borders
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Corner Ornaments
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(40, 40);
      drawCorner(width - 40, 40);
      drawCorner(40, height - 40);
      drawCorner(width - 40, height - 40);

      // 3. Top Header Crest
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('🏛️ ABES ENGINEERING COLLEGE • SUPREME SHINIGAMI REALM 👁️', width / 2, 85);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px serif';
      ctx.fillText('CERTIFICATE OF NUISANCE', width / 2, 130);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('उपद्रव एवं शैतानी प्रमाण पत्र 📜💀', width / 2, 162);

      // Decorative divider
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 180);
      ctx.lineTo(width - 120, 180);
      ctx.stroke();

      // 4. Citation Opening
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'italic 16px serif';
      ctx.fillText('This official decree certifies that the individual named below has demonstrated', width / 2, 215);
      ctx.fillText('unmatched mischief, chaos, backbench genius & campus entertainment:', width / 2, 240);

      // 5. Student Name in Big Bold Royal Font
      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 38px sans-serif';
      ctx.fillText(displayName, width / 2, 295);

      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`${displayAdm} • ${displayRoll} • SECTION ${displaySec}`, width / 2, 330);

      // 6. Conferred Title Box
      ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
      ctx.fillRect(80, 360, width - 160, 95);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 360, width - 160, 95);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('HONORARY CAMPUS TITLE CONFERRED:', width / 2, 388);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 24px sans-serif';
      ctx.fillText(`${profile.avatarEmoji} ${profile.title}`, width / 2, 422);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`(${profile.hindiTitle})`, width / 2, 444);

      // 7. Charges Section Box
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(80, 480, width - 160, 240);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(80, 480, width - 160, 240);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('⚖️ OFFICIAL CAMPUS PENAL CODE CHARGES (धाराएं):', 110, 515);

      ctx.fillStyle = '#f3f4f6';
      ctx.font = '15px sans-serif';
      let chargeY = 550;
      profile.charges.forEach((ch) => {
        const words = ch.split(' ');
        let line = '• ';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          if (ctx.measureText(testLine).width > width - 240 && n > 0) {
            ctx.fillText(line, 110, chargeY);
            line = '  ' + words[n] + ' ';
            chargeY += 26;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 110, chargeY);
        chargeY += 34;
      });

      // 8. Quote Box
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(80, 745, width - 160, 90);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(80, 745, width - 160, 90);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('SIGNATURE PUNCHLINE / CAMPUS MOTTO:', width / 2, 770);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'italic 17px serif';
      ctx.fillText(`“${profile.quote}”`, width / 2, 805);

      // 9. Sovereign Penalty
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`⚠️ OFFICIAL DECREE: ${profile.penalty}`, width / 2, 875);

      // 10. Bottom Wax Seal & Stamp
      const sealX = width / 2;
      const sealY = 960;

      ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
      ctx.beginPath();
      ctx.arc(sealX, sealY, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('SUPREME BOSS ikA', sealX, sealY - 8);
      ctx.font = '900 16px sans-serif';
      ctx.fillText('👑 SEAL 1402', sealX, sealY + 12);
      ctx.font = '10px monospace';
      ctx.fillText('VERIFIED NUISANCE', sealX, sealY + 28);

      // Signatures
      ctx.textAlign = 'left';
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('VERIFIED BY: Shinigami Registry', 90, 1070);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('SANCTIONED: Supreme Boss ikA 👑', width - 90, 1070);

      // Trigger download
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${displayName.replace(/\s+/g, '_')}_Nuisance_Certificate.png`;
      downloadLink.click();

      setCopyMsg('📸 High-resolution certificate downloaded successfully!');
      setTimeout(() => setCopyMsg(null), 3500);
    } catch (err) {
      console.error(err);
      setCopyMsg('Download failed');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
      <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-20">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Certificate of Nuisance</h2>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono text-[10px] font-bold">
                  OFFICIAL DEGREE
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Official campus bakchodi &amp; mischief degree — unlocked for your admission number!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold cursor-pointer transition border border-white/10"
          >
            ← Overview
          </button>
        </div>

        {/* 12 DIVERSE CATEGORIES SELECTOR */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              🎖️ 12 Official Campus Degrees (Tap to Preview &amp; Claim):
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              Current: <strong className="text-white">{profile.categoryLabel}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {Object.values(ALL_NUISANCE_ARCHETYPES).map((arch) => {
              const isSelected = profile.archetypeId === arch.archetypeId;
              return (
                <button
                  key={arch.archetypeId}
                  type="button"
                  onClick={() => {
                    setSelectedArchetypeId(arch.archetypeId);
                    playFx(600, 0.05);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-400 shadow-md scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  <span>{arch.avatarEmoji}</span>
                  <span>{arch.categoryLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTIFICATION MESSAGE */}
        {copyMsg && (
          <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            {copyMsg}
          </div>
        )}

        {/* SCANNING RADAR ANIMATION (FIRST 2.5 SECONDS) */}
        {isScanning ? (
          <div className="p-10 rounded-3xl bg-black/70 border border-red-500/30 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/50 animate-spin" />
              <span className="text-4xl animate-bounce">🔍</span>
            </div>

            <div className="space-y-2 max-w-md mx-auto font-mono">
              <h3 className="text-lg font-black text-white">AI NUISANCE RADAR RUNNING...</h3>
              <p className="text-xs text-amber-400">
                {scanStep === 0 && '🔍 Scanning campus chat history & late-night prompts...'}
                {scanStep === 1 && '🕵️ Detecting proxy attempts & 74.9% bunk violations...'}
                {scanStep === 2 && '💔 Checking crush stalking & Laundiyabaazi coefficient...'}
                {scanStep === 3 && '🥟 Calculating canteen samosa debt & Maggi frequency...'}
                {scanStep === 4 && '👑 Boss ikA Shinigami Seal authenticated! Degree Conferred!'}
              </p>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${(scanStep + 1) * 20}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* THE CERTIFICATE ITSELF */
          <div className="space-y-6">
            <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#110f13] via-[#0b090d] to-black border-4 border-amber-500/50 shadow-[0_0_40px_rgba(217,119,6,0.25)] text-center space-y-6 overflow-hidden">
              
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-amber-500 border border-red-500" />
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-amber-500 border border-red-500" />
              <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-amber-500 border border-red-500" />
              <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-amber-500 border border-red-500" />

              {/* Header Crest */}
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400">
                  🏛️ ABES ENGINEERING COLLEGE • SUPREME SHINIGAMI REALM 👁️
                </p>
                <h1 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wider">
                  CERTIFICATE OF NUISANCE
                </h1>
                <p className="text-sm font-bold text-red-400">
                  उपद्रव एवं शैतानी प्रमाण पत्र 📜💀
                </p>
                <div className="w-48 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent my-2" />
              </div>

              {/* Conferred to */}
              <div className="space-y-1">
                <p className="text-xs font-serif italic text-gray-400">
                  This official decree certifies that the student named below has demonstrated unmatched mischief:
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide uppercase">
                  {displayName}
                </h2>
                <p className="text-xs font-mono text-gray-400">
                  {displayAdm} • {displayRoll} • SECTION {displaySec}
                </p>
              </div>

              {/* Conferred Degree Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-red-950/60 border-2 border-red-500/50 max-w-xl mx-auto shadow-inner space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300 block">
                  Honorary Campus Title Conferred
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-2">
                  <span>{profile.avatarEmoji}</span>
                  <span>{profile.title}</span>
                </h3>
                <p className="text-xs font-bold text-red-300">
                  ({profile.hindiTitle})
                </p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-mono font-black border border-white/20">
                  {profile.badge} • {profile.auraScore}
                </span>
              </div>

              {/* Criminal Charges Box */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-left max-w-xl mx-auto space-y-2.5 font-mono text-xs">
                <h4 className="font-bold text-red-400 flex items-center gap-2 text-sm border-b border-white/10 pb-1.5">
                  <span>⚖️</span> OFFICIAL CAMPUS PENAL CODE CHARGES (धाराएं):
                </h4>
                <div className="space-y-2 text-gray-200">
                  {profile.charges.map((ch, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Quote */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xl mx-auto">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  Signature Punchline / Campus Motto
                </span>
                <p className="text-xs sm:text-sm italic font-serif text-amber-200">
                  &ldquo;{profile.quote}&rdquo;
                </p>
              </div>

              {/* Sovereign Decree Penalty */}
              <div className="text-xs font-mono font-bold text-red-300 max-w-xl mx-auto p-2.5 rounded-xl bg-red-950/40 border border-red-500/30">
                ⚠️ OFFICIAL DECREE: {profile.penalty}
              </div>

              {/* Red Wax Seal */}
              <div className="pt-2 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-red-700/80 border-4 border-amber-400 flex flex-col items-center justify-center text-white shadow-xl shadow-red-900/50 animate-pulse">
                  <span className="text-[10px] font-mono font-black">BOSS ikA</span>
                  <span className="text-lg">👑</span>
                  <span className="text-[8px] font-mono font-black">SEAL 1402</span>
                </div>
                <p className="text-[10px] font-mono text-gray-400 mt-2">
                  Signed &amp; Sealed in the Sovereign Realm • Verified by Shinigami Matrix
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <button
                type="button"
                onClick={handleDownloadCertificatePng}
                disabled={isGeneratingPng}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs shadow-xl cursor-pointer transition flex items-center gap-2 disabled:opacity-50"
              >
                <span>📸</span> {isGeneratingPng ? 'Generating High-Res...' : 'Download Certificate PNG'}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5"
              >
                <span>📲</span> Share on WhatsApp
              </button>

              <button
                type="button"
                onClick={handleCopyDecree}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5 border border-white/10"
              >
                <span>📋</span> Copy Decree
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedArchetypeId(null);
                  setIsScanning(true);
                  setScanStep(0);
                }}
                className="px-4 py-3.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold cursor-pointer transition flex items-center gap-1.5"
              >
                <span>🎲</span> Rescan / Auto-Detect
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
