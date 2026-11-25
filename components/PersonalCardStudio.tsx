'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { StudentUser } from '@/app/page';

interface PersonalCardStudioProps {
  currentUser: StudentUser | null;
  onBackToOverview: () => void;
  isBoss: boolean;
}

export interface StudentCardRecord {
  admissionNo: string;
  name: string;
  section: string;
  rollNo?: number;
  group?: string;
  photoUrl: string;
  archetypeId: string;
  archetypeTitle: string;
  archetypeEmoji: string;
  themeId: string;
  customQuote: string;
  customAlias: string;
  tier: string;
  auraScore: string;
  stats: {
    attendance: number;
    examClutch: number;
    canteenSpeed: number;
    sleepHours: number;
  };
  updatedAt: string;
}

export interface CardArchetype {
  id: string;
  title: string;
  emoji: string;
  vibe: string;
  dialogue: string;
  perk: string;
  tier: string;
  baseAura: number;
  stats: {
    attendance: number;
    examClutch: number;
    canteenSpeed: number;
    sleepHours: number;
  };
}

const ARCHETYPES: CardArchetype[] = [
  {
    id: 'backbench',
    title: 'Supreme Backbench Architect',
    emoji: '👑⚡',
    vibe: 'Attendance 75.1% pe maintain karne ka master-mind!',
    dialogue: 'Attendance chahe 75.001% ho, Boss ikA ke blessing se End-Sem me hum hi toofan machate hain! 😎🔥',
    perk: 'Special Ability: Last bench pe baith ke poore lecture me phone chalane ki 100% stealth!',
    tier: 'MYTHIC S-TIER',
    baseAura: 9850,
    stats: { attendance: 76, examClutch: 98, canteenSpeed: 88, sleepHours: 4 },
  },
  {
    id: 'teamen',
    title: "Tea Men's Samosa Diplomat",
    emoji: '☕🥟',
    vibe: 'College Upper Canteen me bina line ke cutting chai aur samosa lene wala VIP!',
    dialogue: '10-minute ke break me Upper Canteen se 2 samosa aur 1 chai laana koi aam baat nahi hai! ☕🤤',
    perk: 'Special Ability: Samosa counter wale bhaiya se direct eye-contact VIP treatment! 🥟✨',
    tier: 'SHINIGAMI ELITE',
    baseAura: 8920,
    stats: { attendance: 78, examClutch: 85, canteenSpeed: 99, sleepHours: 6 },
  },
  {
    id: 'maggi',
    title: 'Hostel 2 AM Maggi Philosopher',
    emoji: '🍜🌙',
    vibe: 'Raat ke 2 baje kettle me Maggi banate huye universe aur FLAS ka geopolitics solve karne wala!',
    dialogue: 'Kal subah paper hai par abhi Maggi khayenge, tabhi dimag ka internal GPU activate hoga! 🍜😂',
    perk: 'Special Ability: Ek hi kettle me bina jalaaye 4 packet Maggi banane ka record! ⚡',
    tier: 'LEGENDARY GOLD',
    baseAura: 9100,
    stats: { attendance: 75, examClutch: 95, canteenSpeed: 90, sleepHours: 3 },
  },
  {
    id: 'code_ninja',
    title: 'Code Ninja of CSE-2',
    emoji: '💻🥷',
    vibe: 'Bina documentation padhe pehle attempt me program compile karne wala legend!',
    dialogue: 'C++ ho ya Data Structures, hamara code compiler se pehle dimag me execute hota hai! 🚀💻',
    perk: 'Special Ability: Lab assistant ke monitor dekhne se theek 2 second pe segmentation fault fix karna! 🐛',
    tier: 'CYBER TITAN',
    baseAura: 9640,
    stats: { attendance: 82, examClutch: 99, canteenSpeed: 80, sleepHours: 5 },
  },
  {
    id: 'kj_momos',
    title: 'K.J Cafe Kurkure Momos VIP',
    emoji: '🍔🥟',
    vibe: 'Boys Hostel canteen me kurkure momos ka permanent brand ambassador!',
    dialogue: 'Jab tak K.J Cafe ke Kurkure Momos pet me nahi jaate, tab tak dimag ka core processor cool nahi hota! 🥟😋',
    perk: 'Special Ability: Extra mayonnaise ke liye bina extra paise diye negotiate karne ki kala! 🍟',
    tier: 'CAMPUS CELEB',
    baseAura: 8750,
    stats: { attendance: 75, examClutch: 80, canteenSpeed: 96, sleepHours: 7 },
  },
  {
    id: 'attendance_monk',
    title: '75% Attendance Survival Monk',
    emoji: '🛡️🧮',
    vibe: 'Har subah calculator khol ke bunk calculate karne wala certified ganitacharya!',
    dialogue: 'Autonomous 75% rule ek game hai, aur main uska cheat code hu! Na ek lecture zyada, na kam! 🧮😎',
    perk: 'Special Ability: Teacher ke attendence register kholne se pehle exact bunk formula calculate kar lena! 🧘‍♂️',
    tier: 'MATH WIZARD',
    baseAura: 9420,
    stats: { attendance: 75, examClutch: 91, canteenSpeed: 85, sleepHours: 6 },
  },
  {
    id: 'clutch_god',
    title: 'Last Night MT-2 Clutch God',
    emoji: '🎯⚡',
    vibe: 'Exam se 3 ghante pehle one-shot video dekh ke 28/30 internal marks laane wala jadugar!',
    dialogue: 'Duniya poora semester padhti hai, hum subah 5 baje formula dekh ke class me top karte hain! 📖🔥',
    perk: 'Special Ability: Question paper dekhte hi formula sheet dimag me hallucinate hona! 🧠✨',
    tier: 'MYTHIC CLUTCH',
    baseAura: 9990,
    stats: { attendance: 77, examClutch: 100, canteenSpeed: 82, sleepHours: 2 },
  },
  {
    id: 'royal_queen',
    title: "Royal Princess of ikA's World",
    emoji: '🌸👑',
    vibe: 'Poore ABES campus me sabse graceful, intellectual aur royal persona!',
    dialogue: 'Phoolon ki khushbu aur sitaron ki chamak... ikA ke digital samrajya me hamara decree sabse sarvopari hai! 🌷💫',
    perk: 'Special Ability: Presence se poore classroom ka ambient temperature calm aur graceful bana dena! ✨💖',
    tier: 'ROYAL DIAMOND',
    baseAura: 10000,
    stats: { attendance: 89, examClutch: 96, canteenSpeed: 85, sleepHours: 7 },
  },
  {
    id: 'ghost_bunk',
    title: 'Classroom Ghost / Invisible Coder',
    emoji: '🕶️👻',
    vibe: 'Attendance sheet pe sign hote hi hawa me disappear hone wala phantom!',
    dialogue: 'Attendance lag gayi na mere bhai? Ab mera physical presence classroom me mandatory nahi hai! 🏃‍♂️💨',
    perk: 'Special Ability: Gate number 2 ke security guard ke blink karte hi college se bahar nikal jana! 💨',
    tier: 'SHADOW PHANTOM',
    baseAura: 9300,
    stats: { attendance: 75, examClutch: 88, canteenSpeed: 94, sleepHours: 8 },
  },
  {
    id: 'racer',
    title: 'Day Scholar Highway Racer',
    emoji: '🛵💨',
    vibe: 'Subah 8:59 AM pe scooty drift maar ke gate number 2 se enter karne wala champion!',
    dialogue: 'Traffic police aur ABES security dono hamare entry speed aur timing se hairaan rehte hain! 🏍️⚡',
    perk: 'Special Ability: RJ block ke parking se 4th floor tak seedhiyan 25 second me chadna! 🏁',
    tier: 'SPEED DEMON',
    baseAura: 8880,
    stats: { attendance: 80, examClutch: 84, canteenSpeed: 91, sleepHours: 6 },
  },
  {
    id: 'gamer',
    title: 'Hostel LAN Gaming Warlord',
    emoji: '🎮🎧',
    vibe: 'Room me baithe baithe poore hostel floor ko 1v4 clutch karne wala esports legend!',
    dialogue: 'Clutch hum BGMI me bhi karte hain aur semester ke End-Sem paper me bhi! GG WP! 🎧🔥',
    perk: 'Special Ability: 200 ms ping pe bhi headshot connect karne ka superhuman reflex! 💥',
    tier: 'ESPORTS TITAN',
    baseAura: 9210,
    stats: { attendance: 75, examClutch: 93, canteenSpeed: 87, sleepHours: 3 },
  },
];

const CARD_THEMES = [
  {
    id: 'crimson',
    name: '🩸 Shinigami Blood',
    border: 'border-red-500/70',
    cardBg: 'from-red-950 via-black to-zinc-950',
    glow: 'shadow-[0_0_60px_rgba(220,38,38,0.55)]',
    accentText: 'text-red-400',
    primaryColor: '#ef4444',
    secondaryColor: '#991b1b',
  },
  {
    id: 'cyber',
    name: '⚡ Cyberpunk Neon',
    border: 'border-cyan-400/80',
    cardBg: 'from-cyan-950 via-black to-blue-950',
    glow: 'shadow-[0_0_60px_rgba(6,182,212,0.55)]',
    accentText: 'text-cyan-400',
    primaryColor: '#06b6d4',
    secondaryColor: '#1e3a8a',
  },
  {
    id: 'gold',
    name: '👑 Sovereign Gold',
    border: 'border-amber-400/80',
    cardBg: 'from-amber-950 via-black to-yellow-950',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.55)]',
    accentText: 'text-amber-300',
    primaryColor: '#f59e0b',
    secondaryColor: '#78350f',
  },
  {
    id: 'emerald',
    name: '🌿 Matrix Emerald',
    border: 'border-emerald-400/80',
    cardBg: 'from-emerald-950 via-black to-zinc-950',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.55)]',
    accentText: 'text-emerald-400',
    primaryColor: '#10b981',
    secondaryColor: '#064e3b',
  },
  {
    id: 'sakura',
    name: '🌸 Royal Sakura',
    border: 'border-pink-400/80',
    cardBg: 'from-pink-950 via-black to-purple-950',
    glow: 'shadow-[0_0_60px_rgba(236,72,153,0.55)]',
    accentText: 'text-pink-300',
    primaryColor: '#ec4899',
    secondaryColor: '#581c87',
  },
];

export default function PersonalCardStudio({ currentUser, onBackToOverview, isBoss }: PersonalCardStudioProps) {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<number>(0);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('crimson');
  const [customQuote, setCustomQuote] = useState<string>('');
  const [customAlias, setCustomAlias] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [isSavingCard, setIsSavingCard] = useState<boolean>(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState<boolean>(false);
  const [bossTab, setBossTab] = useState<'studio' | 'vault'>('studio');
  const [allCards, setAllCards] = useState<StudentCardRecord[]>([]);
  const [isLoadingVault, setIsLoadingVault] = useState<boolean>(false);
  const [vaultSearch, setVaultSearch] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Interactive 3D Card Tilt state
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number; glareX: number; glareY: number }>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });

  // Custom Power Stats
  const [customStats, setCustomStats] = useState({
    attendance: 76,
    examClutch: 95,
    canteenSpeed: 90,
    sleepHours: 5,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchVaultCards = useCallback(async () => {
    if (!isBoss) return;
    setIsLoadingVault(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GET_ALL_STUDENT_CARDS', user: currentUser }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.cards)) {
          setAllCards(data.cards);
        }
      }
    } catch (err) {
      console.error('Failed to load card vault:', err);
    } finally {
      setIsLoadingVault(false);
    }
  }, [isBoss, currentUser]);

  useEffect(() => {
    if (isBoss) {
      fetchVaultCards();
    }
  }, [isBoss, fetchVaultCards]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Initial Load: Check server first, then localStorage
  useEffect(() => {
    if (!currentUser) return;
    const adm = currentUser.admissionNo || '2026B01010274';
    const isFemale = currentUser.gender === 'F';

    // Default setup
    if (isFemale) {
      const qIdx = ARCHETYPES.findIndex((a) => a.id === 'royal_queen');
      if (qIdx !== -1) setSelectedArchetypeIndex(qIdx);
      setSelectedThemeId('sakura');
    } else {
      let sum = 0;
      for (let i = 0; i < adm.length; i++) sum += adm.charCodeAt(i);
      const pIdx = sum % (ARCHETYPES.length - 1);
      setSelectedArchetypeIndex(pIdx);
      setSelectedThemeId(CARD_THEMES[sum % CARD_THEMES.length].id);
    }

    // Try load from localStorage
    const localKey = `ika_card_${adm}`;
    try {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.photoUrl) setPhotoUrl(parsed.photoUrl);
        if (typeof parsed.archetypeIndex === 'number') setSelectedArchetypeIndex(parsed.archetypeIndex);
        if (parsed.themeId) setSelectedThemeId(parsed.themeId);
        if (parsed.customQuote) setCustomQuote(parsed.customQuote);
        if (parsed.customAlias) setCustomAlias(parsed.customAlias);
        if (parsed.stats) setCustomStats(parsed.stats);
      }
    } catch {}

    // Try load from server
    const fetchServerCard = async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'GET_STUDENT_CARD', admissionNo: adm, user: currentUser }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.card) {
            const c = data.card;
            if (c.photoUrl) setPhotoUrl(c.photoUrl);
            const aIdx = ARCHETYPES.findIndex((a) => a.id === c.archetypeId);
            if (aIdx !== -1) setSelectedArchetypeIndex(aIdx);
            if (c.themeId) setSelectedThemeId(c.themeId);
            if (c.customQuote) setCustomQuote(c.customQuote);
            if (c.customAlias) setCustomAlias(c.customAlias);
            if (c.stats) setCustomStats(c.stats);
          }
        }
      } catch {}
    };
    fetchServerCard();
  }, [currentUser]);

  const currentArchetype = ARCHETYPES[selectedArchetypeIndex] || ARCHETYPES[0];
  const currentTheme = CARD_THEMES.find((t) => t.id === selectedThemeId) || CARD_THEMES[0];

  // Update stats whenever archetype changes if user hasn't heavily modified
  useEffect(() => {
    setCustomStats(currentArchetype.stats);
  }, [selectedArchetypeIndex, currentArchetype]);

  // Total Live Aura calculation
  const totalAura = Math.round(
    currentArchetype.baseAura +
      (customStats.attendance - 75) * 35 +
      customStats.examClutch * 10 +
      customStats.canteenSpeed * 8 -
      (8 - customStats.sleepHours) * 20
  );

  // Play subtle synth sound on interaction
  const playFx = useCallback((freq = 520, duration = 0.08) => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const handleShuffleArchetype = () => {
    playFx(660, 0.1);
    const nextIdx = (selectedArchetypeIndex + 1) % ARCHETYPES.length;
    setSelectedArchetypeIndex(nextIdx);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    playFx(880, 0.1);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setPhotoUrl(base64Url);
      handleSaveCard(base64Url);

      // Save locally
      if (currentUser) {
        try {
          const userKey = `ika_card_${currentUser.admissionNo}`;
          const current = JSON.parse(localStorage.getItem(userKey) || '{}');
          localStorage.setItem(userKey, JSON.stringify({ ...current, photoUrl: base64Url }));
        } catch {}
      }

      // Automatically sync photo to backend so Boss ikA can view in Shinigami Eyes!
      setIsUploadingPhoto(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tile', 'personal_cards');
        formData.append('title', `${currentUser?.name || 'Student'} — Soul Card Photo`);
        formData.append('description', `Roll #${currentUser?.rollNo || '?'} • ${currentUser?.admissionNo} • Section ${currentUser?.section || 'CSE-2'}`);
        formData.append('badge', 'Soul Card');
        formData.append('uploader', currentUser?.name || 'Student');

        await fetch('/api/upload', { method: 'POST', body: formData });
        setStatusMsg({ text: '📸 Photo saved & synced to ikA World Matrix!', type: 'success' });
        setTimeout(() => setStatusMsg(null), 3500);
      } catch (err) {
        console.warn('Sync notice:', err);
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // FULL SAVE: Saves locally + syncs full card record to /api/chat so it's permanent across all devices!
  const handleSaveCard = async (photoOverride?: string) => {
    if (!currentUser) return;
    setIsSavingCard(true);
    playFx(740, 0.15);

    const adm = currentUser.admissionNo || '2026B01010274';
    const cardData = {
      admissionNo: adm,
      name: currentUser.name,
      section: currentUser.section || 'CSE-2',
      rollNo: currentUser.rollNo,
      group: currentUser.group || 'G1',
      photoUrl: typeof photoOverride === 'string' ? photoOverride : photoUrl,
      archetypeId: currentArchetype.id,
      archetypeTitle: currentArchetype.title,
      archetypeEmoji: currentArchetype.emoji,
      themeId: selectedThemeId,
      customQuote: customQuote.trim(),
      customAlias: customAlias.trim(),
      tier: currentArchetype.tier,
      auraScore: `+${totalAura} AURA`,
      stats: customStats,
      updatedAt: new Date().toISOString(),
    };

    // 1. Local persistence
    try {
      localStorage.setItem(`ika_card_${adm}`, JSON.stringify(cardData));
    } catch {}

    // 2. Server persistence
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_STUDENT_CARD',
          cardData,
          user: currentUser,
        }),
      });
      if (res.ok) {
        setStatusMsg({ text: '⚡ Soul Card locked & saved to Supreme ikA Cloud Matrix!', type: 'success' });
      } else {
        setStatusMsg({ text: '💾 Card saved to device storage!', type: 'info' });
      }
    } catch {
      setStatusMsg({ text: '💾 Card saved locally!', type: 'info' });
    } finally {
      setIsSavingCard(false);
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  // SHARE TO WHATSAPP DIRECTLY
  const handleShareWhatsApp = () => {
    playFx(820, 0.1);
    const name = currentUser?.name || 'Student';
    const roll = currentUser?.rollNo ? `(Roll #${currentUser.rollNo})` : '';
    const sec = currentUser?.section || 'CSE-2';
    const quote = customQuote.trim() || currentArchetype.dialogue;
    const alias = customAlias.trim() || currentArchetype.title;

    const text = `🎴 *MERA ikA WORLD SOUL CARD* 👑⚡\n\n👤 *${name}* ${roll} • *Section ${sec}*\n✨ *Persona:* ${currentArchetype.emoji} *${alias}*\n🎖️ *Tier:* ${currentArchetype.tier} (+${totalAura} AURA)\n\n💬 *Signature Quote:*\n"${quote}"\n\n⚡ *Special Ability:* ${currentArchetype.perk}\n\n👉 *Apna personalized card banao:* https://ki-world.vercel.app`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // NATIVE WEB SHARE API
  const handleNativeShare = async () => {
    playFx(820, 0.1);
    const name = currentUser?.name || 'Student';
    const quote = customQuote.trim() || currentArchetype.dialogue;
    const shareData = {
      title: `${name}'s ikA World Soul Card 🎴`,
      text: `Mera ikA World Verified Citizen Card: "${quote}"`,
      url: 'https://ki-world.vercel.app',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }

    // Fallback to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🎴 Mera ikA World Soul Card: ${name} (${currentArchetype.emoji} ${currentArchetype.title})\n"${quote}"\nhttps://ki-world.vercel.app`
      );
      setStatusMsg({ text: '📋 Card link & summary copied to clipboard!', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  // DOWNLOAD CARD AS PNG IMAGE (HTML5 Canvas high-resolution paint)
  const handleDownloadPng = async () => {
    setIsGeneratingPng(true);
    playFx(920, 0.15);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 800;
      const height = 1150;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.5, currentTheme.secondaryColor);
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Holographic border
      ctx.strokeStyle = currentTheme.primaryColor;
      ctx.lineWidth = 12;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Inner thin border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      // 3. Top Banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(40, 40, width - 80, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('👁️ ikA WORLD SOUL MATRIX', 65, 88);

      ctx.fillStyle = currentTheme.primaryColor;
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(currentArchetype.tier, width - 65, 88);
      ctx.textAlign = 'left';

      // 4. Draw Avatar Photo
      const photoSize = 220;
      const photoX = (width - photoSize) / 2;
      const photoY = 150;

      // Draw photo frame border
      ctx.fillStyle = currentTheme.primaryColor;
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 8, 0, Math.PI * 2);
      ctx.fill();

      if (photoUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = photoUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          ctx.save();
          ctx.beginPath();
          ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
          ctx.restore();
        } catch {
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '70px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentArchetype.emoji.slice(0, 2), photoX + photoSize / 2, photoY + photoSize / 2 + 25);
        ctx.textAlign = 'left';
      }

      // Section Pill
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(photoX + photoSize - 60, photoY + photoSize - 35, 75, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(currentUser?.section || 'CSE-2', photoX + photoSize - 50, photoY + photoSize - 13);

      // 5. Name and Alias
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((currentUser?.name || 'CITIZEN OF ikA WORLD').toUpperCase(), width / 2, 420);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`${currentArchetype.emoji} ${customAlias.trim() || currentArchetype.title}`, width / 2, 460);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px monospace';
      ctx.fillText(
        `${currentUser?.admissionNo || '2026B01010***'} • ROLL #${currentUser?.rollNo || '?'} • GROUP ${currentUser?.group || 'G1'}`,
        width / 2,
        490
      );

      // 6. Stats Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(60, 520, width - 120, 160);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(60, 520, width - 120, 160);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`🛡️ Attendance Buffer: ${customStats.attendance}% (Safe)`, 85, 560);
      ctx.fillText(`⚡ Exam Night Clutch: ${customStats.examClutch} / 100`, 85, 600);
      ctx.fillText(`☕ Canteen Samosa Speed: ${customStats.canteenSpeed}%`, 85, 640);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`+${totalAura} AURA`, width - 85, 600);
      ctx.textAlign = 'left';

      // 7. Hinglish Quote
      const quote = customQuote.trim() || currentArchetype.dialogue;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(60, 700, width - 120, 150);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(60, 700, width - 120, 150);

      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'italic 20px serif';
      ctx.textAlign = 'center';
      
      // Simple multi-line text wrap
      const words = `"${quote}"`.split(' ');
      let line = '';
      let lineY = 750;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 160 && n > 0) {
          ctx.fillText(line, width / 2, lineY);
          line = words[n] + ' ';
          lineY += 32;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, width / 2, lineY);

      // 8. Perk
      ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
      ctx.fillRect(60, 870, width - 120, 60);
      ctx.strokeStyle = '#dc2626';
      ctx.strokeRect(60, 870, width - 120, 60);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(currentArchetype.perk, width / 2, 907);

      // 9. Footer Seal & Barcode
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('VERIFIED CITIZEN • SECTION CSE-2', 65, 1070);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('DECREE OF SUPREME BOSS ikA 👑', width - 65, 1070);

      // Barcode bars
      ctx.fillStyle = '#ffffff';
      for (let b = 65; b < width - 65; b += 8) {
        const w = (b % 3 === 0) ? 4 : 2;
        ctx.fillRect(b, 1000, w, 40);
      }

      // Convert to image download
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${(currentUser?.name || 'Student').replace(/\s+/g, '_')}_ikA_World_Card.png`;
      downloadLink.click();

      setStatusMsg({ text: '📸 Card image downloaded successfully in high resolution!', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: 'Card download failed', type: 'error' });
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handleInspectStudentCard = (card: StudentCardRecord) => {
    playFx(700, 0.1);
    setPhotoUrl(card.photoUrl || '');
    const aIdx = ARCHETYPES.findIndex((a) => a.id === card.archetypeId);
    if (aIdx !== -1) setSelectedArchetypeIndex(aIdx);
    if (card.themeId) setSelectedThemeId(card.themeId);
    if (card.customQuote) setCustomQuote(card.customQuote);
    if (card.customAlias) setCustomAlias(card.customAlias);
    if (card.stats) setCustomStats(card.stats);
    setBossTab('studio');
    setStatusMsg({ text: `Viewing card of ${card.name} (${card.admissionNo})`, type: 'info' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteCard = async (admNo: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete soul card of ${studentName} (${admNo}) from matrix?`)) return;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_STUDENT_CARD', admissionNo: admNo, user: currentUser }),
      });
      if (res.ok) {
        setAllCards((prev) => prev.filter((c) => c.admissionNo !== admNo));
        setStatusMsg({ text: `Deleted card of ${studentName}`, type: 'success' });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {}
  };

  const displayName = currentUser?.name || 'CITIZEN OF ikA WORLD';
  const displaySection = currentUser?.section || 'CSE-2';
  const displayRoll = currentUser?.rollNo ? `ROLL #${currentUser.rollNo}` : 'CSE';
  const displayQuote = customQuote.trim() || currentArchetype.dialogue;
  const displayAlias = customAlias.trim() || currentArchetype.title;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
      <div className="w-full max-w-5xl space-y-7 animate-in fade-in zoom-in-95 duration-200 pb-20">
        
        {/* HEADER & TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-300 text-xs font-mono font-bold uppercase tracking-wider border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              🎴 ikA World Digital Identity &amp; Soul Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
              <span>Mera ikA World Card Studio</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold">
                PRO 3D
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Hover &amp; tilt your card in 3D, upload your photo, customize stats, and download your verified card!
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleShuffleArchetype}
              className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow"
            >
              <span>🎲</span> Shuffle Vibe
            </button>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow"
            >
              <span>🔄</span> {isFlipped ? 'Show Front' : 'Flip to Back'}
            </button>
            <button
              type="button"
              onClick={onBackToOverview}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold cursor-pointer transition border border-white/10"
            >
              ← Overview
            </button>
          </div>
        </div>

        {/* STATUS ALERT NOTIFICATION */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold text-center animate-in fade-in ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : statusMsg.type === 'error'
                ? 'bg-red-950/70 border-red-500/60 text-red-300'
                : 'bg-blue-950/70 border-blue-500/60 text-blue-300'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* BOSS TAB SELECTOR */}
        {isBoss && (
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/15">
            <button
              type="button"
              onClick={() => setBossTab('studio')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                bossTab === 'studio'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🎴</span> 3D Card Studio (Card Creator)
            </button>
            <button
              type="button"
              onClick={() => {
                setBossTab('vault');
                fetchVaultCards();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                bossTab === 'vault'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>👑</span> Shinigami Soul Vault ({allCards.length} Student Cards Saved)
            </button>
          </div>
        )}

        {/* BOSS SOUL VAULT VIEW */}
        {isBoss && bossTab === 'vault' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-black/60 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👁️</span>
                <div>
                  <h3 className="text-base font-black text-white">Shinigami Soul Matrix Archives</h3>
                  <p className="text-xs text-purple-300">All registered student soul cards, uploaded portraits &amp; calculated auras</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by name, roll, or admission ID..."
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  className="bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-purple-500 w-full sm:w-64 font-mono"
                />
                <button
                  type="button"
                  onClick={fetchVaultCards}
                  disabled={isLoadingVault}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold cursor-pointer transition shadow"
                >
                  {isLoadingVault ? '...' : '↻'}
                </button>
              </div>
            </div>

            {allCards.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-5xl block animate-pulse">🔮</span>
                <h4 className="text-base font-bold text-white">No Student Soul Cards in Matrix Yet</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  When students open the &ldquo;Mera ikA World Card&rdquo; studio, upload their portrait, and save, their soul card will appear here live!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCards
                  .filter((c) => {
                    if (!vaultSearch.trim()) return true;
                    const q = vaultSearch.toLowerCase();
                    return (
                      (c.name && c.name.toLowerCase().includes(q)) ||
                      (c.admissionNo && c.admissionNo.toLowerCase().includes(q)) ||
                      (c.rollNo && String(c.rollNo).includes(q)) ||
                      (c.archetypeTitle && c.archetypeTitle.toLowerCase().includes(q))
                    );
                  })
                  .map((c) => (
                    <div
                      key={c.admissionNo}
                      className="p-5 rounded-3xl bg-black/70 border border-white/15 hover:border-purple-500/50 shadow-xl transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 p-0.5 overflow-hidden shrink-0">
                            {c.photoUrl ? (
                              <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover rounded-[14px]" />
                            ) : (
                              <div className="w-full h-full bg-black/80 flex items-center justify-center text-2xl rounded-[14px]">
                                {c.archetypeEmoji ? c.archetypeEmoji.slice(0, 2) : '🎴'}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-white truncate">{c.name}</h4>
                            <p className="text-[11px] font-mono text-purple-300 font-bold truncate">
                              {c.archetypeEmoji} {c.customAlias || c.archetypeTitle}
                            </p>
                            <p className="text-[10px] font-mono text-gray-400">
                              {c.admissionNo} • Roll #{c.rollNo || '?'} • Sec {c.section}
                            </p>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-mono space-y-1">
                          <div className="flex justify-between text-gray-300">
                            <span>🛡️ Buffer: <strong className="text-emerald-400">{c.stats?.attendance || 75}%</strong></span>
                            <span>⚡ Clutch: <strong className="text-amber-400">{c.stats?.examClutch || 90}</strong></span>
                            <span>☕ Samosa: <strong className="text-cyan-400">{c.stats?.canteenSpeed || 85}%</strong></span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-white/5">
                            <span className="text-amber-400 font-bold">{c.auraScore || '+9000 AURA'}</span>
                            <span className="text-gray-500">{c.tier}</span>
                          </div>
                        </div>

                        {c.customQuote && (
                          <p className="text-[11px] italic font-serif text-gray-300 line-clamp-2 px-1">
                            &ldquo;{c.customQuote}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleInspectStudentCard(c)}
                          className="flex-1 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1"
                        >
                          <span>🔍</span> Inspect 3D
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(c.admissionNo, c.name)}
                          className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-bold cursor-pointer transition"
                          title="Delete from Matrix"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : null}

        {/* MAIN STUDIO LAYOUT */}
        {(!isBoss || bossTab === 'studio') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: 3D INTERACTIVE CARD PREVIEW */}
          <div className="lg:col-span-5 flex flex-col items-center select-none">
            
            <div className="w-full max-w-[340px] sm:max-w-[360px] perspective-[1000px]">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY + (isFlipped ? 180 : 0)}deg) scale3d(1.02, 1.02, 1.02)`,
                  transition: 'transform 0.15s ease-out',
                  transformStyle: 'preserve-3d',
                }}
                className={`relative w-full rounded-3xl p-6 bg-gradient-to-br ${currentTheme.cardBg} border-2 ${currentTheme.border} ${currentTheme.glow} shadow-2xl cursor-pointer overflow-hidden backdrop-blur-2xl`}
              >
                {/* PRISMATIC HOLOGRAPHIC FOIL SHINE OVERLAY */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,0,128,0.3) 30%, rgba(0,255,255,0.35) 60%, transparent 85%)`,
                  }}
                />

                {/* Shimmer sweep animation */}
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 pointer-events-none animate-[pulse_4s_infinite]" />

                {/* ================= FRONT SIDE ================= */}
                {!isFlipped ? (
                  <div className="space-y-4">
                    {/* Top Matrix Badge */}
                    <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-gray-300">
                        <span className="text-sm">👁️</span>
                        <span>ikA SOUL MATRIX</span>
                      </div>
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white shadow-sm">
                        {currentArchetype.tier}
                      </span>
                    </div>

                    {/* Photo / Avatar Section */}
                    <div className="flex flex-col items-center text-center space-y-2.5">
                      <div className="relative group/avatar">
                        <div className="w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 shadow-xl overflow-hidden">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={displayName}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <div className="w-full h-full rounded-2xl bg-black/85 flex flex-col items-center justify-center text-gray-400 p-2 text-center border border-white/10">
                              <span className="text-4xl mb-0.5 animate-bounce">{currentArchetype.emoji.slice(0, 2)}</span>
                              <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Tap Upload Photo</span>
                            </div>
                          )}
                        </div>
                        {/* Section Tag */}
                        <span className="absolute -bottom-1 -right-2 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-black border border-white/30 shadow-md">
                          {displaySection}
                        </span>
                      </div>

                      {/* Name & Title */}
                      <div>
                        <h3 className="text-lg font-black text-white tracking-wide leading-tight">
                          {displayName}
                        </h3>
                        <div className="text-xs font-mono font-bold text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                          <span>{currentArchetype.emoji}</span>
                          <span>{displayAlias}</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                          {currentUser?.admissionNo || '2026B01010***'} • {displayRoll} • {currentUser?.group || 'G1'}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Power Meters */}
                    <div className="space-y-2 p-3 rounded-2xl bg-black/60 border border-white/10 text-[10px] font-mono">
                      <div className="flex justify-between items-center text-gray-300">
                        <span>🛡️ Attendance Buffer:</span>
                        <span className="font-bold text-emerald-400">{customStats.attendance}% (Safe)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, customStats.attendance)}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-gray-300 pt-0.5">
                        <span>⚡ Exam Night Clutch:</span>
                        <span className="font-bold text-amber-300">{customStats.examClutch} / 100</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-300"
                          style={{ width: `${customStats.examClutch}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-gray-300 pt-0.5">
                        <span>☕ Canteen Samosa Speed:</span>
                        <span className="font-bold text-cyan-300">{customStats.canteenSpeed}%</span>
                      </div>
                    </div>

                    {/* Hinglish Dialogue Box */}
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                      <p className="text-[11px] text-gray-200 italic font-serif leading-relaxed">
                        &ldquo;{displayQuote}&rdquo;
                      </p>
                    </div>

                    {/* Perk Box */}
                    <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-[10px] text-red-200 font-mono text-center">
                      {currentArchetype.perk}
                    </div>

                    {/* Footer Seal */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 border-t border-white/15 pt-2.5">
                      <span className="tracking-widest">
                        AURA: <strong className="text-amber-400">+{totalAura} AURA</strong>
                      </span>
                      <span className="tracking-wider text-red-400">DECREE OF ikA 👑</span>
                    </div>
                  </div>
                ) : (
                  /* ================= BACK SIDE OF CARD ================= */
                  <div
                    style={{ transform: 'rotateY(180deg)' }}
                    className="space-y-4 py-2 text-center font-mono"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/20 border-2 border-red-500/50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
                      💀
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">
                        OFFICIAL SHINIGAMI CITIZEN DECREE
                      </h4>
                      <p className="text-[10px] text-red-400 mt-0.5">Section {displaySection} • Sovereign Portal Matrix</p>
                    </div>

                    {/* Barcode representation */}
                    <div className="p-3 rounded-xl bg-black/70 border border-white/10 flex flex-col items-center">
                      <div className="flex gap-1 h-8 items-end">
                        {[4, 2, 6, 1, 5, 2, 4, 1, 3, 6, 2, 4, 1, 5, 2, 6, 3, 1, 4, 2, 5, 1, 3, 6].map((w, idx) => (
                          <div key={idx} className="bg-white" style={{ width: `${w}px`, height: '100%' }} />
                        ))}
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono mt-1.5 tracking-widest">
                        #IKA-2026-{displaySection.replace('-', '')}-{currentUser?.rollNo || '007'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-[10px] text-gray-300 space-y-1">
                      <div>• <strong>Citizen:</strong> {displayName}</div>
                      <div>• <strong>Admission ID:</strong> {currentUser?.admissionNo}</div>
                      <div>• <strong>Autonomous Buffer:</strong> 75% calibrated</div>
                      <div>• <strong>Sanctum Access:</strong> Level-5 Shinigami Clearance</div>
                    </div>

                    <p className="text-[10px] text-gray-400 italic">
                      &ldquo;This card grants sovereign backbench immunity and unlimited access to solved MT-2 papers.&rdquo;
                    </p>

                    <div className="text-[9px] text-red-500 font-bold uppercase tracking-widest border-t border-white/10 pt-2">
                      Signed &amp; Sealed by Boss ikA 👑
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-2 font-mono flex items-center gap-1.5">
              <span>💡</span> Tap card to flip Front / Back
            </p>

            {/* ACTION BUTTON ROW */}
            <div className="w-full max-w-[360px] grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleSaveCard()}
                disabled={isSavingCard}
                className="py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black shadow-lg cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>💾</span> {isSavingCard ? 'Saving...' : 'Save My Card'}
              </button>

              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isGeneratingPng}
                className="py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-lg cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>📸</span> {isGeneratingPng ? 'Generating...' : 'Download Image'}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <span>📲</span> Share WhatsApp
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold border border-white/15 cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <span>🔗</span> Share Link
              </button>
            </div>
          </div>

          {/* RIGHT: CARD CUSTOMIZER CONTROLS */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. PHOTO UPLOADER */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📸</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Upload Your Photo / Avatar</h4>
                    <p className="text-[11px] text-gray-400">Fits automatically inside your glowing 3D card frame</p>
                  </div>
                </div>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="text-[11px] text-red-400 hover:underline cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-red-500/40 hover:border-red-400 rounded-2xl p-5 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition space-y-1.5"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <span className="text-3xl">📁</span>
                <div className="text-xs font-bold text-white">
                  {isUploadingPhoto ? 'Uploading & Syncing...' : photoUrl ? 'Change Selected Photo' : 'Click to select or drag photo here'}
                </div>
                <p className="text-[10px] text-gray-400">
                  Instantly rendered • Synchronized to Supreme Boss ikA Matrix
                </p>
              </div>
            </div>

            {/* 2. ARCHETYPE / PERSONA SELECTOR */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Campus Persona / Archetype</h4>
                    <p className="text-[11px] text-gray-400">Choose your distinctive Section {displaySection} role</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleShuffleArchetype}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer flex items-center gap-1"
                >
                  <span>🎲</span> Shuffle Vibe
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {ARCHETYPES.map((arch, idx) => {
                  const isSelected = idx === selectedArchetypeIndex;
                  return (
                    <div
                      key={arch.id}
                      onClick={() => {
                        playFx(550, 0.08);
                        setSelectedArchetypeIndex(idx);
                      }}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                        isSelected
                          ? 'bg-red-600/25 border-red-500 text-white shadow-md'
                          : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="text-xl mb-1">{arch.emoji}</div>
                      <div className="text-xs font-bold truncate">{arch.title}</div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5">{arch.tier}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. CARD THEME SKINS */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎨</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Card Hologram Theme Skin</h4>
                  <p className="text-[11px] text-gray-400">Select your glowing visual foil</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {CARD_THEMES.map((theme) => {
                  const isSelected = theme.id === selectedThemeId;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        playFx(600, 0.08);
                        setSelectedThemeId(theme.id);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-white/20 text-white border-white shadow-md'
                          : 'bg-white/[0.03] text-gray-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span>{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. INTERACTIVE POWER STATS SLIDERS */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Adjust Your Power Stats</h4>
                    <p className="text-[11px] text-gray-400">Slide to tune your stats &amp; watch your total Aura Score rise!</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  +{totalAura} AURA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>🛡️ Attendance Buffer</span>
                    <span className="font-mono text-emerald-400 font-bold">{customStats.attendance}%</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="99"
                    value={customStats.attendance}
                    onChange={(e) => setCustomStats({ ...customStats, attendance: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>⚡ Exam Night Clutch</span>
                    <span className="font-mono text-amber-400 font-bold">{customStats.examClutch} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={customStats.examClutch}
                    onChange={(e) => setCustomStats({ ...customStats, examClutch: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>☕ Canteen Samosa Speed</span>
                    <span className="font-mono text-cyan-400 font-bold">{customStats.canteenSpeed}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={customStats.canteenSpeed}
                    onChange={(e) => setCustomStats({ ...customStats, canteenSpeed: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>💤 Daily Sleep Hours</span>
                    <span className="font-mono text-purple-400 font-bold">{customStats.sleepHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={customStats.sleepHours}
                    onChange={(e) => setCustomStats({ ...customStats, sleepHours: parseInt(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 5. CUSTOM NICKNAME & PUNCHLINE */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">✍️</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Custom Nickname &amp; Punchline</h4>
                  <p className="text-[11px] text-gray-400">Personalize with your own campus dialogue or alias</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-300">Custom Campus Title / Nickname</label>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder={`e.g. ${currentArchetype.title}`}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-300">Custom Hinglish Punchline / Message</label>
                  <textarea
                    rows={2}
                    value={customQuote}
                    onChange={(e) => setCustomQuote(e.target.value)}
                    placeholder={`e.g. "${currentArchetype.dialogue}"`}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-red-500 resize-none font-serif italic"
                  />
                </div>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSaveCard()}
                disabled={isSavingCard}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-xl cursor-pointer transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>⚡</span> {isSavingCard ? 'Saving to Matrix...' : 'Save & Lock My Soul Card'}
              </button>
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isGeneratingPng}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs shadow-xl cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>📸</span> Download PNG
              </button>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5"
              >
                <span>📲</span> WhatsApp
              </button>
              <button
                type="button"
                onClick={handleNativeShare}
                className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5 border border-white/10"
                title="Share or Copy Link"
              >
                <span>🔗</span> Share
              </button>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
