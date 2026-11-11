'use client';

import React, { useState } from 'react';

export interface StudentUser {
  name: string;
  email: string;
  admissionNo: string;
  rollNo: number;
  group: string;
  gender: 'M' | 'F';
  residency: 'Hosteller' | 'Day Scholar';
}

interface RosterEntry {
  rollNo: number;
  name: string;
  group: string;
  gender: 'M' | 'F';
  residency: 'Hosteller' | 'Day Scholar';
}

// Complete Verified CSE-2 Roster (1 to 79)
export const CSE2_ROSTER: Record<string, RosterEntry> = {
  '2026B01010410': { rollNo: 1, name: 'ADITYA KUMAR MAURYA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010578': { rollNo: 2, name: 'ADITYA KUMAR MAURYA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010062': { rollNo: 3, name: 'ADITYA MAURYA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010231': { rollNo: 4, name: 'ADITYA MAURYA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010273': { rollNo: 5, name: 'ADITYA PAL', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010375': { rollNo: 6, name: 'ADITYA PASWAN', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011084': { rollNo: 7, name: 'ADITYA PRAKASH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010044': { rollNo: 8, name: 'ADITYA PRAKASH SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010516': { rollNo: 9, name: 'ADITYA PRATAP SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010954': { rollNo: 10, name: 'ADITYA PRATAP SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011108': { rollNo: 11, name: 'ADITYA RAJ', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010445': { rollNo: 12, name: 'ADITYA RAJPUT', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011067': { rollNo: 13, name: 'ADITYA RAO', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010023': { rollNo: 14, name: 'ADITYA SHARMA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010105': { rollNo: 15, name: 'ADITYA SHARMA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010128': { rollNo: 16, name: 'ADITYA TRIPATHI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011095': { rollNo: 17, name: 'ADITYA VERMA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010719': { rollNo: 18, name: 'ADITYA YADAV', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011183': { rollNo: 19, name: 'ADITYA YADAV', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010977': { rollNo: 20, name: 'ADWATIYA PANDEY', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010405': { rollNo: 21, name: 'AGRIM KUSHWAHA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010508': { rollNo: 22, name: 'AGRIMA CHAURASIA', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010219': { rollNo: 23, name: 'AGRIMA GUPTA', group: 'G1', gender: 'F', residency: 'Hosteller' },
  '2026B01010027': { rollNo: 24, name: 'AGRIMA TYAGI', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010253': { rollNo: 25, name: 'AISHWARY YADAV', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010264': { rollNo: 26, name: 'AJAY', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010506': { rollNo: 27, name: 'AJAY KUMAR CHAUDHARY', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010913': { rollNo: 28, name: 'AJAY SARASWAT', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010765': { rollNo: 29, name: 'AJEET GUPTA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010101': { rollNo: 30, name: 'AJLA USMANI', group: 'G1', gender: 'F', residency: 'Hosteller' },
  '2026B01010793': { rollNo: 31, name: 'AKANSHA BASERA', group: 'G1', gender: 'F', residency: 'Hosteller' },
  '2026B01010998': { rollNo: 32, name: 'AKARSH VERMA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010461': { rollNo: 33, name: 'AKARSHIT VERMA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010075': { rollNo: 34, name: 'AKASH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010923': { rollNo: 35, name: 'AKASH JAISWAL', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010333': { rollNo: 36, name: 'AKASH KAUSHIK', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010244': { rollNo: 37, name: 'AKASH MAURYA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010221': { rollNo: 38, name: 'AKASH SAHANI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010892': { rollNo: 39, name: 'AKASH SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010984': { rollNo: 40, name: 'AKASH SINGHAL', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010723': { rollNo: 41, name: 'AKASH YADAV', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010846': { rollNo: 42, name: 'AKHIL CHAUDHARY', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011040': { rollNo: 43, name: 'AKSHAT CHAUHAN', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010420': { rollNo: 44, name: 'AKSHAT DIWAKAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010352': { rollNo: 45, name: 'AKSHAT JAISWAL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010404': { rollNo: 46, name: 'AKSHAT KRISHNA BAJPAI', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010373': { rollNo: 47, name: 'AKSHAT KUMAR VERMA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010606': { rollNo: 48, name: 'AKSHAT PANDEY', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010139': { rollNo: 49, name: 'AKSHAT VERMA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010897': { rollNo: 50, name: 'AKSHAT VERMA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010750': { rollNo: 51, name: 'AKSHAY KUMAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010318': { rollNo: 52, name: 'AKSHAY SHARMA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010600': { rollNo: 53, name: 'AKSHIKA', group: 'G2', gender: 'F', residency: 'Hosteller' },
  '2026B01010097': { rollNo: 54, name: 'AKSHIT MALIK', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010130': { rollNo: 55, name: 'AKSHIT RANJAN MITRA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010274': { rollNo: 56, name: 'AKSHIT SINGH', group: 'G2', gender: 'M', residency: 'Day Scholar' }, // Boss ikA
  '2026B01010377': { rollNo: 57, name: 'AKSHIT SINGH', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010107': { rollNo: 58, name: 'ALAK KUMAR MAURYA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010074': { rollNo: 59, name: 'ALOK PANDEY', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010326': { rollNo: 60, name: 'ALOK SINGH', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010960': { rollNo: 61, name: 'AMAN CHAURASIYA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010735': { rollNo: 62, name: 'AMAN KUMAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010056': { rollNo: 63, name: 'AMAN PAL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010586': { rollNo: 64, name: 'AMAN PAL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010346': { rollNo: 65, name: 'AMAN SHIVHARE', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010690': { rollNo: 66, name: 'AMAN SINGH', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010684': { rollNo: 67, name: 'AMAN SINGHAL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011187': { rollNo: 68, name: 'AMAN SRIVASTAVA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010332': { rollNo: 69, name: 'AMAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010949': { rollNo: 70, name: 'AMAR SAHU', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010817': { rollNo: 71, name: 'AMBESH KUMAR UPADHYAY', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011056': { rollNo: 72, name: 'AMBIKA RASTOGI', group: 'G2', gender: 'F', residency: 'Hosteller' },
  '2026B01010320': { rollNo: 73, name: 'AMBRESH KUMAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010493': { rollNo: 74, name: 'AMEY', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010390': { rollNo: 75, name: 'AMIT GUPTA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010805': { rollNo: 76, name: 'AMRITA VERMA', group: 'G2', gender: 'F', residency: 'Hosteller' },
  '2026B01010649': { rollNo: 77, name: 'ANAHITA UMRAO', group: 'G2', gender: 'F', residency: 'Hosteller' },
  '2026B01010978': { rollNo: 78, name: 'ANAND SHARMA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010427': { rollNo: 79, name: 'ANANT PANDEY', group: 'G2', gender: 'M', residency: 'Day Scholar' },
};

export default function RegisterModal({ onSuccess }: { onSuccess: (user: StudentUser) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [animationType, setAnimationType] = useState<'none' | 'popper' | 'flower' | 'boss'>('none');
  const [matchedUser, setMatchedUser] = useState<StudentUser | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@abes.ac.in')) {
      setError('Please apna official college email ID daalo (e.g. firstname.26b01010***@abes.ac.in)!');
      return;
    }

    const prefix = cleanEmail.split('@')[0];
    const digitMatches = prefix.match(/\d{3,}/g);

    let foundAdmNo = '';
    let foundEntry: RosterEntry | null = null;

    if (digitMatches && digitMatches.length > 0) {
      const longestDigits = digitMatches.sort((a, b) => b.length - a.length)[0];
      for (const [admNo, entry] of Object.entries(CSE2_ROSTER)) {
        if (admNo.toLowerCase().endsWith(longestDigits.toLowerCase()) || admNo.toLowerCase().includes(longestDigits.toLowerCase())) {
          foundAdmNo = admNo;
          foundEntry = entry;
          break;
        }
      }
    }

    if (!foundEntry) {
      const firstNamePart = prefix.split('.')[0].replace(/[^a-z]/g, '').toUpperCase();
      if (firstNamePart.length >= 3) {
        for (const [admNo, entry] of Object.entries(CSE2_ROSTER)) {
          const rosterFirst = entry.name.split(' ')[0];
          if (rosterFirst === firstNamePart || entry.name.startsWith(firstNamePart)) {
            foundAdmNo = admNo;
            foundEntry = entry;
            break;
          }
        }
      }
    }

    if (!foundEntry || !foundAdmNo) {
      setError('Yeh email Section CSE-2 ke official roster me nahi mila! Check your admission digits.');
      return;
    }

    const formattedName = foundEntry.name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    const detectedUser: StudentUser = {
      name: formattedName,
      email: cleanEmail,
      admissionNo: foundAdmNo,
      rollNo: foundEntry.rollNo,
      group: foundEntry.group,
      gender: foundEntry.gender,
      residency: foundEntry.residency,
    };

    setMatchedUser(detectedUser);

    if (foundAdmNo === '2026B01010274') {
      setAnimationType('boss');
    } else if (foundAdmNo === '2026B01010219' || foundEntry.name === 'AGRIMA GUPTA') {
      setAnimationType('flower');
    } else {
      setAnimationType('popper');
    }

    setTimeout(() => {
      localStorage.setItem('campus_user', JSON.stringify(detectedUser));
      onSuccess(detectedUser);
    }, 3400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-hidden select-none">
      
      {/* 👑 SUPREME ARCHITECT BOSS ikA AWAKENING */}
      {animationType === 'boss' && matchedUser && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center bg-black/95">
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl md:text-4xl animate-pulse"
              style={{
                top: `${(i * 17) % 92}%`,
                left: `${(i * 23) % 96}%`,
                animationDuration: `${0.9 + (i % 4) * 0.3}s`,
                opacity: 0.9,
              }}
            >
              {['👑', '⚡', '🩸', '🍎', '🔥', '💀', '🕸️'][i % 7]}
            </div>
          ))}
          <div className="relative z-10 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-black via-zinc-950 to-red-950 border-2 border-red-600 shadow-[0_0_90px_rgba(220,38,38,0.75)] text-center space-y-4 max-w-md mx-4 animate-in zoom-in-75 duration-300">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-black border-2 border-red-600 flex items-center justify-center text-3xl font-black text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.8)]">
              ikA
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/50 text-red-300 text-xs font-bold uppercase tracking-widest">
              Sovereign Override • Supreme Creator
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              ALL HAIL BOSS ikA! 👑⚡
            </h3>
            <p className="text-sm text-red-200 font-medium leading-relaxed">
              Pranaam <strong className="text-white">Boss Akshit Singh</strong>! Every neural circuit and database of this realm bows to your command. Welcome home, Supreme Architect! 🍎🔥
            </p>
          </div>
        </div>
      )}

      {/* 🌸 FLOWER SHOWER FOR QUEEN AGRIMA GUPTA */}
      {animationType === 'flower' && matchedUser && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl md:text-4xl animate-bounce"
              style={{
                top: `${(i * 17) % 92}%`,
                left: `${(i * 23) % 96}%`,
                animationDuration: `${1.1 + (i % 5) * 0.35}s`,
                opacity: 0.9,
              }}
            >
              {['🌸', '🌷', '🌺', '💐', '✨', '💖', '👑'][i % 7]}
            </div>
          ))}
          <div className="relative z-10 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-pink-950/95 via-rose-900/90 to-purple-950/95 border-2 border-pink-400/60 shadow-[0_0_80px_rgba(236,72,153,0.5)] text-center space-y-4 max-w-md mx-4 animate-in zoom-in-75 duration-300">
            <div className="text-6xl animate-pulse">🌸👑🌸</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-bold uppercase tracking-widest">
              Royal Queen Entry • Section CSE-2
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Our Boss wants to be your friend 💖✨
            </h3>
            <p className="text-sm text-pink-200 font-medium leading-relaxed">
              Welcome <strong className="text-white">Queen {matchedUser.name}</strong>! Boss <strong className="text-red-400">ikA</strong> has unlocked the entire CSE-2 sanctum in royal pink just for you! 🌷
            </p>
          </div>
        </div>
      )}

      {/* 🎉 PARTY POPPER FOR ALL OTHER CSE-2 STUDENTS */}
      {animationType === 'popper' && matchedUser && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl md:text-4xl animate-bounce"
              style={{
                top: `${(i * 13) % 92}%`,
                left: `${(i * 19) % 96}%`,
                animationDuration: `${0.8 + (i % 4) * 0.3}s`,
                opacity: 0.9,
              }}
            >
              {['🎉', '🎊', '🥳', '✨', '⚡', '👑', '🔥'][i % 7]}
            </div>
          ))}
          <div className="relative z-10 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-zinc-950 via-red-950/90 to-black border-2 border-red-500/50 shadow-[0_0_80px_rgba(220,38,38,0.5)] text-center space-y-4 max-w-md mx-4 animate-in zoom-in-75 duration-300">
            <div className="text-6xl animate-bounce">🎉👑🎊</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold uppercase tracking-widest">
              Verified CSE-2 • {matchedUser.group}
            </div>
            <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-red-400 via-white to-red-300 bg-clip-text text-transparent">
              Our Boss invites you! 🥳🚀
            </h3>
            <p className="text-sm text-gray-200 font-medium leading-relaxed">
              Swagat hai <strong className="text-white">{matchedUser.name}</strong> ({matchedUser.admissionNo})! Boss <strong className="text-red-500">ikA</strong> welcomes you to the official Section CSE-2 realm! ⚡
            </p>
          </div>
        </div>
      )}

      {/* EMAIL-ONLY LOGIN BOX WITH RED & BLACK ikA EMBLEM */}
      {animationType === 'none' && (
        <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#0d0f14]/95 border border-red-500/30 shadow-[0_0_60px_rgba(220,38,38,0.15)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            {/* RED & BLACK ikA BOX */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-black via-zinc-950 to-red-900 border-2 border-red-600 flex items-center justify-center text-2xl font-black text-red-500 shadow-[0_0_25px_rgba(220,38,38,0.5)]">
              ikA
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-bold text-red-400 uppercase tracking-widest">
              Section CSE-2 Smart Auto-Login
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Enter College Email</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Naam likhne ki zaroorat nahi! Bas apni ABES email ID daalo, <strong className="text-red-400">ikA&apos;s Neural Roster</strong> tumhara Naam aur Lab Group khud pehchan lega! ✨
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>Official ABES Email ID</span>
                <span className="text-[10px] text-red-400 font-mono">@abes.ac.in</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="firstname.26b01010***@abes.ac.in"
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition shadow-inner font-mono text-xs"
              />
              <p className="text-[10px] text-gray-500 pl-1">
                Example: <span className="text-gray-400 font-mono">firstname.26b01010***@abes.ac.in</span>
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs leading-relaxed">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-black via-red-900 to-red-700 hover:from-zinc-900 hover:to-red-600 text-white border border-red-500/50 font-extrabold text-sm shadow-xl shadow-red-600/20 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Auto-Detect Identity & Enter 🚀
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <span>👑 SOVEREIGN BOSS: ikA</span>
            <span>SECTION CSE-2</span>
          </div>
        </div>
      )}
    </div>
  );
}