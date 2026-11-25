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
  gender: 'M' | 'F' | 'ALL';
}

export type CertificateFont = 'royal' | 'modern' | 'gothic' | 'mono';
export type CertificateTheme = 'crimson_gold' | 'obsidian' | 'royal_blue' | 'sakura_rose' | 'cyber_emerald';

// ==========================================
// FEMALE ARCHETYPES (12 Authentic Varieties)
// ==========================================
export const FEMALE_ARCHETYPES: Record<string, NuisanceProfile> = {
  crush_girl: {
    archetypeId: 'crush_girl',
    categoryLabel: 'Dil-Todne Wali 🌸',
    title: 'CERTIFIED DIL-TODNE WALI (PAPA KI PARI PRO MAX)',
    hindiTitle: 'प्रमाणित दिल तोड़ने वाली एवं पापा की परी',
    badge: 'HIGH VOLTAGE HEARTBREAKER 🌸💔',
    badgeColor: 'from-pink-500 via-rose-500 to-purple-600',
    avatarEmoji: '🌸💅',
    gender: 'F',
    quote: 'Tum bohot acche dost ho yaar... par main abhi padhai pe focus kar rahi hu! (Khud 9.7 SGPA le aayi)',
    charges: [
      'Dhara 302: ABES ke 15+ masoom backbenchers ko "You are just a friend" bol ke dil todna.',
      'Dhara 420: Exam se 5 minute pehle sabhi dosto se assignment copy maang ke highest score karna.',
      'Dhara 100: WhatsApp aur Instagram pe text 3 ghante "Seen" chhod ke ghost kar dena.',
    ],
    penalty: 'Agli baar Tea Men Canteen me bina dosto ko treat diye Kurkure Momos nahi khane ki warning!',
    auraScore: '+9,850 AURA',
  },
  aesthetic_queen: {
    archetypeId: 'aesthetic_queen',
    categoryLabel: 'Aesthetic Queen 📸',
    title: 'INSTAGRAM REEL AESTHETIC & PINTEREST VIBE QUEEN',
    hindiTitle: 'इंस्टाग्राम रील्स एवं पिंटरेस्ट एस्थेटिक रानी',
    badge: 'GOLDEN HOUR SPECIALIST 📸✨',
    badgeColor: 'from-amber-400 via-pink-500 to-rose-500',
    avatarEmoji: '📸✨',
    gender: 'F',
    quote: 'Sir jo padha rahe hain theek hai, par RJ-Block ki sunlight me selfie lighting 10/10 hai!',
    charges: [
      'Dhara 007: Library me padhne ke bajaye book khol kar 45 aesthetic photos aur boomerang lena.',
      'Dhara 144: College gate se RJ Block tak chalte hue dost se slow-motion walk reel banwana.',
      'Dhara 200: "Aaj casual pehen ke aayi hu" bol ke Pinterest board jaisa outfit flaunt karna.',
    ],
    penalty: 'Pure 1 din bina koi aesthetic story dale college attendance maintain karna!',
    auraScore: '+9,620 AURA',
  },
  silent_topper: {
    archetypeId: 'silent_topper',
    categoryLabel: 'Silent Topper 🤫',
    title: 'SECRET 9.8 SGPA ACADEMIC ASSASSIN',
    hindiTitle: 'गुप्त 9.8 एसजीपीए अकादमिक हत्यारा',
    badge: 'I DID NOT STUDY ANYTHING 🤫📚',
    badgeColor: 'from-indigo-500 via-purple-500 to-pink-500',
    avatarEmoji: '🤫📚',
    gender: 'F',
    quote: 'Yaar sach me kuch nahi padha, pakka fail ho jaungi! (Marks aane par University Rank 1)',
    charges: [
      'Dhara 420: Exam hall me rote hue bolna "Kuch nahi aata", aur 10 minute pehle additional sheet maangna.',
      'Dhara 101: Handwritten notes ko aisi handwriting me likhna jaise computer printout ho.',
      'Dhara 302: Backbencher dosto ko emotional false hope dekar khud top kar lena.',
    ],
    penalty: 'Pure class ko Unit 1 se Unit 5 tak ke saare revision notes free me Xerox karwana!',
    auraScore: '+9,940 AURA',
  },
  coffee_snob: {
    archetypeId: 'coffee_snob',
    categoryLabel: 'Iced Latte Snob ☕',
    title: 'NESCAFE ICED LATTE & UPPER CANTEEN DIPLOMAT',
    hindiTitle: 'आइस लट्टे राजनयिक एवं कैफ़ीन विशेषज्ञ',
    badge: 'CAFFEINE ADDICT GRADE-1 ☕💅',
    badgeColor: 'from-amber-600 via-yellow-600 to-orange-500',
    avatarEmoji: '☕✨',
    gender: 'F',
    quote: 'Lecture chahe samajh na aaye, par bina Nescafe Cold Coffee ke mera brain function nahi karta!',
    charges: [
      'Dhara 100: Subah 9 baje canteen bhaiya se extra chocolate drizzle ke liye bahas karna.',
      'Dhara 404: 15 minute ke recess ko 50 minute ka coffee date bana dena.',
      'Dhara 75: Coffee hath me pakad kar faculty se bolna "Ma\'am traffic ki wajah se late ho gayi".',
    ],
    penalty: 'Roommates ke liye kettle me agle 1 hafte tak black coffee banani hogi!',
    auraScore: '+9,410 AURA',
  },
  sprint_princess: {
    archetypeId: 'sprint_princess',
    categoryLabel: '8:59 AM Sprinter 🏃‍♀️',
    title: '8:59 AM STAIR-CLIMBING SPRINT PRINCESS',
    hindiTitle: '8:59 AM सीढ़ी धावक राजकुमारी',
    badge: 'LAST SECOND ENTRY SPECIALIST 🏃‍♀️💨',
    badgeColor: 'from-rose-500 via-red-500 to-amber-500',
    avatarEmoji: '🏃‍♀️💨',
    gender: 'F',
    quote: '8:58 pe gate pe thi, 8:59 pe 3rd floor classroom me slide in karke attendance mark karwai!',
    charges: [
      'Dhara 180: Lift ki bheed dekh ke 3rd floor tak stairs pe sprint maar ke sir ke aane se pehle baithna.',
      'Dhara 420: Sir ke register sign karne ke 2 second pehle "May I come in sir?" innocent face se bolna.',
      'Dhara 100: Roz raat ko 3 AM sona aur subah alarm ko 6 baar snooze karna.',
    ],
    penalty: 'Agli 10 classes me class start hone se kam se kam 5 minute pehle first bench par baithna!',
    auraScore: '+9,380 AURA',
  },
  gossip_empress: {
    archetypeId: 'gossip_empress',
    categoryLabel: 'Campus CID 🕵️‍♀️',
    title: 'ABES CAMPUS CID & SECRET SCOOP EMPRESS',
    hindiTitle: 'एबीईएस जासूस एवं गुप्त गपशप साम्राज्ञी',
    badge: 'SUPREME SPY NETWORK 🕵️‍♀️☕',
    badgeColor: 'from-fuchsia-600 via-pink-600 to-rose-600',
    avatarEmoji: '🕵️‍♀️☕',
    gender: 'F',
    quote: 'Syllabus bhale na pata ho, par poore CSE department me kaun kiske sath kahan baitha tha sab pata hai!',
    charges: [
      'Dhara 007: Canteen ke corner table se sabhi sections ki relationship timeline monitor karna.',
      'Dhara 420: "Bhai kisi ko mat batana, swear kar" bol ke 5 minute me 4 WhatsApp group me share karna.',
      'Dhara 1402: Faculty ke cabin ke bahar aisi look dena jaise internals ke marks hack kar liye ho.',
    ],
    penalty: 'Agla pura semester library me chupchap baith kar padhai karni padegi!',
    auraScore: '+9,790 AURA',
  },
  eye_roll_legend: {
    archetypeId: 'eye_roll_legend',
    categoryLabel: 'Eye-Roll Legend 🙄',
    title: 'LEGENDARY EYE-ROLLER & DRAMA RESISTANT QUEEN',
    hindiTitle: 'प्रमाणित आँख घुमाने वाली एवं ड्रामा प्रतिरोधी',
    badge: '360° SARCASM LEVEL 🙄⚡',
    badgeColor: 'from-purple-600 via-violet-600 to-indigo-600',
    avatarEmoji: '🙄👑',
    gender: 'F',
    quote: 'Tumhari baatein sun ke meri aankhein naturally 360 degree roll ho jaati hain!',
    charges: [
      'Dhara 360: Teacher ke boring sawal par aisi eye roll karna ki peeche wale bachhe has padein.',
      'Dhara 101: Kisi ke cringe WhatsApp status pe bina reply kiye direct screenshot dosto ko bhejna.',
      'Dhara 420: Presentation me "Very good question" bol ke question puchne wale ko side eye dena.',
    ],
    penalty: 'Har presentation ke baad smile karke "Thank you" bolna anivarya hai!',
    auraScore: '+9,520 AURA',
  },
  seen_ignorer: {
    archetypeId: 'seen_ignorer',
    categoryLabel: 'Ghosting Architect 📱',
    title: '99+ UNREAD MESSAGES GHOSTING ARCHITECT',
    hindiTitle: '99+ अनदेखे संदेश एवं घोस्टिंग वास्तुकार',
    badge: 'SEEN AT 11:11 PM 📱👻',
    badgeColor: 'from-teal-500 via-cyan-600 to-blue-600',
    avatarEmoji: '📱👻',
    gender: 'F',
    quote: 'Message dekh liya par reply 3 din baad aayega... busy nahi hu, bas vibe check fail ho gaya tha!',
    charges: [
      'Dhara 404: Blue ticks enable rakh ke bhi 4 din tak message seen pe chhodna.',
      'Dhara 100: "Sorry so gayi thi" bol ke subah 11 baje Instagram reel share karna.',
      'Dhara 302: Masoom dost ko "typing..." dikha ke app band kar dena.',
    ],
    penalty: 'Agli baar assignment bhejne wale dost ko 10 second ke andar reply dena padega!',
    auraScore: '+9,450 AURA',
  },
  one_shot_empress: {
    archetypeId: 'one_shot_empress',
    categoryLabel: 'One-Shot Empress 🎯',
    title: 'EXAM NIGHT 3 AM ONE-SHOT MAGICIAN',
    hindiTitle: 'एग्जाम नाईट 3 AM वन-शॉट जादूगरनी',
    badge: 'ONE NIGHT FIGHTER 🎯📚',
    badgeColor: 'from-blue-600 via-purple-600 to-pink-600',
    avatarEmoji: '🎯✨',
    gender: 'F',
    quote: 'Poore semester chilling, par exam se ek raat pehle 2x speed pe syllabus khatam karke pass hona meri superpower hai!',
    charges: [
      'Dhara 101: Exam ki raat 2 baje "Gate Smashers" aur "Neso Academy" playlist binge watch karna.',
      'Dhara 200: Subah 8 baje bina neend ke fresh face bana kar exam hall me aana.',
      'Dhara 75: 3 ghante ki padhai me 8.5 SGPA laa kar mehnati dosto ko shock dena.',
    ],
    penalty: 'Agle semester me kam se kam 1 week pehle syllabus dekhne ka wada karna!',
    auraScore: '+9,680 AURA',
  },
  soft_rebel: {
    archetypeId: 'soft_rebel',
    categoryLabel: 'Sweet Rebel 😈',
    title: 'SWEET SMILE BACKBENCH RULE BREAKER',
    hindiTitle: 'मीठी मुस्कान एवं बैकबेंच नियम भंजक',
    badge: 'INNOCENT LOOK DANGEROUS BRAIN 😈🎀',
    badgeColor: 'from-pink-600 via-rose-600 to-amber-600',
    avatarEmoji: '😈🎀',
    gender: 'F',
    quote: 'Chehre pe aisi masoomiyat rakho ki teacher ko shak bhi na ho ki proxy kisne lagayi!',
    charges: [
      'Dhara 420: Teacher ke daantne par aisi smile dena ki teacher khud confuse ho jaye.',
      'Dhara 100: Lab me faculty ke piche mudte hi phone desk ke neeche scroll karna.',
      'Dhara 75: Dost ki proxy aisi confident aawaz me bolna ki sab sach maan lein.',
    ],
    penalty: 'Agli class me pure time serious face bana kar notebook me notes likhna!',
    auraScore: '+9,590 AURA',
  },
  front_row_judge: {
    archetypeId: 'front_row_judge',
    categoryLabel: 'Front Row Judge 👀',
    title: 'FIRST BENCH SILENT JUDGING SUPREME',
    hindiTitle: 'प्रथम बेंच मूक न्यायाधीश सर्वोच्च',
    badge: '100% EYE CONTACT 👀💅',
    badgeColor: 'from-emerald-600 via-teal-600 to-cyan-600',
    avatarEmoji: '👀💅',
    gender: 'F',
    quote: 'Main aage baithti hu par peeche wale row ki har bakchodi mere radar pe live track hoti hai!',
    charges: [
      'Dhara 1402: Teacher ke galat formula likhte hi achanak pen stop karke eyebrow raise karna.',
      'Dhara 100: Peeche se paper ball aane par slow turn karke criminal look dena.',
      'Dhara 420: Internals me 30 me se 29 marks aane par 1 mark ke liye re-evaluation maangna.',
    ],
    penalty: 'Aakhiri bench wale dosto ke sath ek din lunch share karna padega!',
    auraScore: '+9,710 AURA',
  },
  mood_swing_ceo: {
    archetypeId: 'mood_swing_ceo',
    categoryLabel: 'Mood Swing CEO 🎭',
    title: '5-MINUTE MOOD FLIP CHIEF EXECUTIVE OFFICER',
    hindiTitle: '5-मिनट मनोदशा परिवर्तन मुख्य कार्यकारी अधिकारी',
    badge: 'EMOTIONAL ROLLERCOASTER 🎭⚡',
    badgeColor: 'from-violet-600 via-fuchsia-600 to-pink-600',
    avatarEmoji: '🎭⚡',
    gender: 'F',
    quote: 'Abhi chill hu... 5 minute baad dimaag kharab ho sakta hai, warning pehle se de rahi hu!',
    charges: [
      'Dhara 302: Dost ke "Kaisi ho?" puchne par bina wajah "Kuch nahi" bol ke chup baith jana.',
      'Dhara 200: Upper Canteen me burger order karke bolna "Yaar mujhe toh Maggi khani thi".',
      'Dhara 101: Ek hi lecture ke andar hassna, gussa hona aur existential crisis me chale jana.',
    ],
    penalty: 'Dosto ko agle 3 din tak treat dekar mood control me rakhna hoga!',
    auraScore: '+9,650 AURA',
  },
};

// ==========================================
// MALE ARCHETYPES (12 Authentic Varieties)
// ==========================================
export const MALE_ARCHETYPES: Record<string, NuisanceProfile> = {
  laundiya_baaz: {
    archetypeId: 'laundiya_baaz',
    categoryLabel: 'Laundiya Baaz 😏',
    title: 'CERTIFIED SUPREME LAUNDIYA BAAZ (लौंडिया बाज़ PRO MAX)',
    hindiTitle: 'प्रमाणित सर्वोच्च लौंडिया बाज़',
    badge: 'NATIONAL CRUSH STALKER 😏🔥',
    badgeColor: 'from-amber-500 via-red-500 to-rose-600',
    avatarEmoji: '😏👑',
    gender: 'M',
    quote: 'Maths ke FLAS me 1 bhi formula nahi pata, par aage wali row ke baal kitni baar flip huye exact count hai!',
    charges: [
      'Dhara 420: Lecture me board dekhne ke bajaye aage wali crush ko dekh ke muskurana.',
      'Dhara 109: Har nayi aane wali ladki ko dekh ke dosto ko "Bhai bhabhi hai teri" bolna.',
      'Dhara 007: Notes maangne ke bahaane se direct Instagram handle maangne ki naakaam koshish.',
    ],
    penalty: 'Is praani ko roz subah 1 ghanta Single Sher Motivation sunna anivarya hai!',
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
    gender: 'M',
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
    gender: 'M',
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
    gender: 'M',
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
    gender: 'M',
    quote: 'Kawasaki Ninja H2R aur Hayabusa ki reel dekh ke college ke gate pe Activa full throttle ghaseetna!',
    charges: [
      'Dhara 180: Ninja H2R ki top speed (400 km/h) padh ke teacher se bolna "Sir main aerodynamics padh raha hu".',
      'Dhara 200: ABES ke mod par bina indicator aur bina helmet ke "Dhoom Machale" sound me nikalna.',
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
    gender: 'M',
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
    gender: 'M',
    quote: 'Vimal Sir "Are you getting it?" bol rahe the, aur main aage baith kar mundi hilate hue sapne dekh raha tha!',
    charges: [
      'Dhara 404: Samne baith kar sir ki taraf dekhte hue dimaag ko aeroplane mode pe daal dena.',
      'Dhara 100: Chashma laga kar aisi posture banana jaise deep philosophy soch rahe ho jabki deep sleep chal rahi thi.',
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
    gender: 'M',
    quote: 'Code chahe samajh na aaye, par Ctrl+C aur Ctrl+V ki speed dekh ke Google ke engineer bhi sharma jayein!',
    charges: [
      'Dhara 420: Doosre ke assignment me se uska naam mita kar apna roll number upar likhna.',
      'Dhara 101: C++ program me variable ka naam x se temp karke bolna "Sir main apna logic banaya hai".',
      'Dhara 500: Lab external viva me "Sir mere laptop me code chal raha tha, yahan compile error de raha hai" bolna.',
    ],
    penalty: 'Agli lab me bina ChatGPT aur GitHub khole 5-line ka Hello World code chalk se board par likhna!',
    auraScore: '+9,480 AURA',
  },
  bhabhi_stalker: {
    archetypeId: 'bhabhi_stalker',
    categoryLabel: 'Bhabhi Wingman 🤝',
    title: 'HAR LADKI KO BHABHI BOLNE WALA DANGEROUS WINGMAN',
    hindiTitle: 'हर लड़की को भाभी बोलने वाला ख़तरनाक विंगमैन',
    badge: 'CHRONIC MATCHMAKER 🤝👀',
    badgeColor: 'from-rose-600 via-amber-500 to-red-500',
    avatarEmoji: '🤝👀',
    gender: 'M',
    quote: 'Dost ne crush ki taraf bas ek glance dekha nahi ki poore section me chillana shuru "Bhai bhabhi hai teri"!',
    charges: [
      'Dhara 144: Dost ke phone se uski crush ke post pe bina bataye like maarna.',
      'Dhara 420: Canteen me crush ke table ke bagal wali seat zabardasti occupy karna.',
      'Dhara 100: "Bhai baat kara du?" bol ke dost ki zindagi bhar ke liye bezti karwana.',
    ],
    penalty: 'Agla pura mahina silent mode pe reh kar dost ki love life me dakhal na dena!',
    auraScore: '+9,530 AURA',
  },
  reserve_meter_hero: {
    archetypeId: 'reserve_meter_hero',
    categoryLabel: 'Reserve Meter Hero ⛽',
    title: 'PETROL RESERVE MEIN SCOOTY GHASEETNE WALA HERO',
    hindiTitle: 'पेट्रोल रिज़र्व में स्कूटी घसीटने वाला वीर',
    badge: '₹50 PETROL LEGEND ⛽🛵',
    badgeColor: 'from-yellow-600 via-amber-600 to-orange-600',
    avatarEmoji: '⛽🛵',
    gender: 'M',
    quote: 'Petrol needle red line ke bhi neeche chali gayi hai, par "Bhai ABES pahunch jayegi" ka confidence 100% hai!',
    charges: [
      'Dhara 50: Petrol pump pe jakar confidently bolna "Bhaiya ₹50 ka daal do emergency hai".',
      'Dhara 100: Scooty ko daayein-baayein jhula kar aakhiri 5 ml petrol carburetor me khinchne ka prayas.',
      'Dhara 420: Dosto se bolna "Bhai lift de raha hu ₹20 petrol ke dede".',
    ],
    penalty: 'Agli baar tanki kam se kam aadhi bharwa kar college aana anivarya hai!',
    auraScore: '+9,210 AURA',
  },
  backbench_terror: {
    archetypeId: 'backbench_terror',
    categoryLabel: 'Backbench Terror 😈',
    title: 'BACKBENCH TABLA & DESK DRUMMING TERROR',
    hindiTitle: 'प्रमाणित सर्वकालिक उपद्रवी एवं बैकबेंच आतंक',
    badge: 'GRADE-A CAMPUS NUISANCE 😈🪑',
    badgeColor: 'from-purple-600 via-pink-600 to-red-600',
    avatarEmoji: '😈🔥',
    gender: 'M',
    quote: 'Peeche baith ke samne wale ke baal ginke timepass karna aur sir ke mudte hi table bajana fundamental right hai!',
    charges: [
      'Dhara 420: Teacher ke sawal puchte hi padosi ko dekh ke hasna aur innocent face bana lena.',
      'Dhara 100: Lecture chalte waqt bench par pen se tabla bajana aur bolna "Sir acoustic sound check tha".',
      'Dhara 75: Semester bhar chill maar ke exam se 3 ghante pehle one-shot video dekh ke clutch karna.',
    ],
    penalty: 'Is praani ko roz aakhiri bench par baith ke chup rehne ka prayas karna hoga!',
    auraScore: '+9,350 AURA',
  },
  attendance_mathematician: {
    archetypeId: 'attendance_mathematician',
    categoryLabel: 'Attendance Math 🧮',
    title: '75% ATTENDANCE PROBABILITY ALCHEMIST & FRAUDULENT CALCULATOR',
    hindiTitle: '75% अटेंडेंस फॉर्मूला जादूगर एवं हिसाब विशेषज्ञ',
    badge: 'CALCULUS OF BUNK 🧮📉',
    badgeColor: 'from-cyan-600 via-blue-600 to-indigo-600',
    avatarEmoji: '🧮📉',
    gender: 'M',
    quote: 'Derivative aur Integration nahi aate, par "Agar 3 class bunk maaru toh 75.1% rahegi" ka exact formula aata hai!',
    charges: [
      'Dhara 75: Pure din calculator pe attendance ka permutation aur combination nikalna.',
      'Dhara 101: Teacher se bolna "Sir portal me glitch hai, main uss din class me hi tha".',
      'Dhara 420: Medical certificate me doctor ki jagah khud handwriting se sign maarna.',
    ],
    penalty: 'Agli 15 consecutive classes me 100% attendance physically maintain karni hogi!',
    auraScore: '+9,670 AURA',
  },
};

// ==========================================
// BOSS SUPREME ARCHETYPE
// ==========================================
export const BOSS_ARCHETYPE: NuisanceProfile = {
  archetypeId: 'boss',
  categoryLabel: 'Supreme Overlord 👑',
  title: 'SUPREME SHINIGAMI OVERLORD OF CAMPUS NUISANCE',
  hindiTitle: 'सर्वोच्च उपद्रव सम्राट एवं कालदूत',
  badge: 'MYTHIC SSS-TIER CHAOS 👑⚡',
  badgeColor: 'from-red-600 via-amber-500 to-purple-600',
  avatarEmoji: '👑💀',
  gender: 'ALL',
  quote: 'Main jiska naam Death Note me likh du, uska attendance register se pehle dimaag evaporate ho jata hai!',
  charges: [
    'Dhara 1402: ABES ke server matrix aur batch ke dimaag pe 100% sovereign adhikaar.',
    'Dhara 302: Kisi bhi student ko 1-click me heart attack timer ya gaslight 500 error lagana.',
    'Dhara 777: Har portal window me "Swagat hai Boss ikA" ka lal rang ka shinigami decree failana.',
  ],
  penalty: 'Roz shaam ko Shinigami apple khana aur server matrix par shanti banaye rakhna!',
  auraScore: '+99,999 AURA',
};

// Combined dictionary
export const ALL_NUISANCE_ARCHETYPES: Record<string, NuisanceProfile> = {
  boss: BOSS_ARCHETYPE,
  ...FEMALE_ARCHETYPES,
  ...MALE_ARCHETYPES,
};

// Theme configurations
export const THEME_CONFIGS: Record<
  CertificateTheme,
  {
    name: string;
    icon: string;
    cardBg: string;
    outerBorder: string;
    innerBorder: string;
    accentColor: string;
    headerColor: string;
    badgeBg: string;
    canvasBg: [string, string, string];
    canvasBorders: { primary: string; secondary: string; highlight: string };
  }
> = {
  crimson_gold: {
    name: 'Crimson Gold',
    icon: '👑',
    cardBg: 'from-[#160b0d] via-[#0d070a] to-[#050505]',
    outerBorder: 'border-amber-500/60',
    innerBorder: 'border-red-500/40',
    accentColor: '#fbbf24',
    headerColor: '#f59e0b',
    badgeBg: 'from-red-950/80 via-amber-950/50 to-red-950/80',
    canvasBg: ['#0f0a0c', '#1a0c0e', '#060405'],
    canvasBorders: { primary: '#d97706', secondary: '#ef4444', highlight: '#fbbf24' },
  },
  obsidian: {
    name: 'Death Note Obsidian',
    icon: '🖤',
    cardBg: 'from-[#050505] via-[#0d0d0f] to-[#020202]',
    outerBorder: 'border-red-600/70',
    innerBorder: 'border-zinc-700/60',
    accentColor: '#ef4444',
    headerColor: '#dc2626',
    badgeBg: 'from-zinc-900 via-red-950/60 to-zinc-900',
    canvasBg: ['#040404', '#0d0d10', '#020202'],
    canvasBorders: { primary: '#dc2626', secondary: '#71717a', highlight: '#ffffff' },
  },
  royal_blue: {
    name: 'Royal Blue & Gold',
    icon: '🔵',
    cardBg: 'from-[#081226] via-[#050a16] to-[#02040a]',
    outerBorder: 'border-amber-400/70',
    innerBorder: 'border-blue-500/40',
    accentColor: '#38bdf8',
    headerColor: '#fbbf24',
    badgeBg: 'from-blue-950/80 via-indigo-950/50 to-blue-950/80',
    canvasBg: ['#060f22', '#0a1633', '#030712'],
    canvasBorders: { primary: '#f59e0b', secondary: '#2563eb', highlight: '#60a5fa' },
  },
  sakura_rose: {
    name: 'Sakura Rose',
    icon: '🌸',
    cardBg: 'from-[#1f0b16] via-[#12060e] to-[#060205]',
    outerBorder: 'border-pink-500/70',
    innerBorder: 'border-rose-400/40',
    accentColor: '#f43f5e',
    headerColor: '#fda4af',
    badgeBg: 'from-pink-950/80 via-rose-950/60 to-purple-950/80',
    canvasBg: ['#160710', '#240b1b', '#080306'],
    canvasBorders: { primary: '#f43f5e', secondary: '#fb7185', highlight: '#fbcfe8' },
  },
  cyber_emerald: {
    name: 'Cyber Emerald',
    icon: '💚',
    cardBg: 'from-[#041c14] via-[#02100b] to-[#010805]',
    outerBorder: 'border-emerald-500/70',
    innerBorder: 'border-teal-400/40',
    accentColor: '#10b981',
    headerColor: '#34d399',
    badgeBg: 'from-emerald-950/80 via-teal-950/60 to-emerald-950/80',
    canvasBg: ['#02150f', '#06261b', '#010b07'],
    canvasBorders: { primary: '#10b981', secondary: '#059669', highlight: '#6ee7b7' },
  },
};

export default function NuisanceCertificate({
  currentUser,
  messages,
  sessions = [],
  onBack,
  isBoss,
}: NuisanceCertificateProps) {
  const isFemale = currentUser?.gender === 'F';

  // Archetype pool based on gender
  const genderPool = useMemo(() => {
    if (isBoss) {
      return ALL_NUISANCE_ARCHETYPES;
    }
    return isFemale ? FEMALE_ARCHETYPES : MALE_ARCHETYPES;
  }, [isBoss, isFemale]);

  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<CertificateFont>('royal');
  const [selectedTheme, setSelectedTheme] = useState<CertificateTheme>('crimson_gold');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [shuffleDisplayTitle, setShuffleDisplayTitle] = useState<string>('');
  const [shuffleDisplayEmoji, setShuffleDisplayEmoji] = useState<string>('🎰');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isGeneratingPng, setIsGeneratingPng] = useState<boolean>(false);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sound effects generator
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

  // Load saved custom photo from localStorage if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
      const savedPhoto = localStorage.getItem(`ika_cert_photo_${adm}`);
      if (savedPhoto) {
        setUserPhoto(savedPhoto);
      }
    }
  }, [currentUser]);

  // Initial detection from chat messages & queries
  const detectedProfile = useMemo<NuisanceProfile>(() => {
    if (isBoss) return BOSS_ARCHETYPE;

    const allText = [
      ...messages.map((m) => m.content),
      ...sessions.map((s) => s.title),
    ].join(' ').toLowerCase();

    // 1. Crush / Romance
    if (
      allText.includes('crush') ||
      allText.includes('propose') ||
      allText.includes('flirt') ||
      allText.includes('pyaar') ||
      allText.includes('gf') ||
      allText.includes('single')
    ) {
      return isFemale ? FEMALE_ARCHETYPES.crush_girl : MALE_ARCHETYPES.laundiya_baaz;
    }

    // 2. Proxy / Attendance / Bunk
    if (
      allText.includes('proxy') ||
      allText.includes('attendance') ||
      allText.includes('bunk') ||
      allText.includes('safe bunk') ||
      allText.includes('ninja hack')
    ) {
      return isFemale ? FEMALE_ARCHETYPES.sprint_princess : MALE_ARCHETYPES.proxy_mafia;
    }

    // 3. Super Bikes / Speed
    if (
      allText.includes('bike') ||
      allText.includes('ninja') ||
      allText.includes('speed') ||
      allText.includes('hayabusa')
    ) {
      return isFemale ? FEMALE_ARCHETYPES.soft_rebel : MALE_ARCHETYPES.speed_demon;
    }

    // 4. Canteen / Food
    if (
      allText.includes('canteen') ||
      allText.includes('samosa') ||
      allText.includes('chai') ||
      allText.includes('coffee')
    ) {
      return isFemale ? FEMALE_ARCHETYPES.coffee_snob : MALE_ARCHETYPES.canteen_bhukkad;
    }

    // 5. Exam / One-Shot
    if (
      allText.includes('mt2') ||
      allText.includes('exam') ||
      allText.includes('paper') ||
      allText.includes('one shot')
    ) {
      return isFemale ? FEMALE_ARCHETYPES.one_shot_empress : MALE_ARCHETYPES.exam_clutch_god;
    }

    // 6. Coding / Github
    if (
      allText.includes('code') ||
      allText.includes('c++') ||
      allText.includes('lab') ||
      allText.includes('github')
    ) {
      return isFemale ? FEMALE_ARCHETYPES.silent_topper : MALE_ARCHETYPES.copy_paste_engineer;
    }

    // 7. Gossip / Chit-chat
    if (
      allText.includes('gossip') ||
      allText.includes('secret') ||
      allText.includes('dossier')
    ) {
      return isFemale ? FEMALE_ARCHETYPES.gossip_empress : MALE_ARCHETYPES.bhabhi_stalker;
    }

    // Default: Pick a primary archetype according to gender
    const poolKeys = Object.keys(genderPool);
    const primaryKey = isFemale ? 'crush_girl' : 'laundiya_baaz';
    return genderPool[primaryKey] || genderPool[poolKeys[0]] || MALE_ARCHETYPES.laundiya_baaz;
  }, [genderPool, messages, sessions, isBoss, isFemale]);

  // Current active profile
  const profile = (selectedArchetypeId && ALL_NUISANCE_ARCHETYPES[selectedArchetypeId])
    ? ALL_NUISANCE_ARCHETYPES[selectedArchetypeId]
    : detectedProfile;

  const currentTheme = THEME_CONFIGS[selectedTheme];

  // Editable Student Name (prefilled with user's name, saved to localStorage)
  const initialName = useMemo(() => {
    if (typeof window !== 'undefined') {
      const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
      const saved = localStorage.getItem(`ika_cert_name_${adm}`);
      if (saved) return saved;
    }
    return currentUser?.name || 'CITIZEN OF ikA WORLD';
  }, [currentUser]);

  const [studentName, setStudentName] = useState<string>(initialName);

  useEffect(() => {
    if (currentUser?.name) {
      const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
      const saved = localStorage.getItem(`ika_cert_name_${adm}`);
      if (!saved) {
        setStudentName(currentUser.name);
      }
    }
  }, [currentUser]);

  const handleNameChange = (val: string) => {
    setStudentName(val);
    if (typeof window !== 'undefined') {
      const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
      localStorage.setItem(`ika_cert_name_${adm}`, val);
    }
  };

  const handleResetName = () => {
    const orig = currentUser?.name || 'CITIZEN OF ikA WORLD';
    setStudentName(orig);
    if (typeof window !== 'undefined') {
      const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
      localStorage.removeItem(`ika_cert_name_${adm}`);
    }
    playFx(650, 0.05);
    setCopyMsg('Name reset to default student name.');
    setTimeout(() => setCopyMsg(null), 2500);
  };

  const displayName = (studentName.trim() || currentUser?.name || 'CITIZEN OF ikA WORLD').toUpperCase();
  const displayRoll = currentUser?.rollNo ? `ROLL #${currentUser.rollNo}` : 'CSE';
  const displaySec = currentUser?.section || 'CSE-2';
  const displayAdm = currentUser?.admissionNo || '2026B01010***';

  // ==========================================
  // SHUFFLER / REROLL DEGREE ACTION
  // ==========================================
  const handleShuffleDegree = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    playFx(700, 0.08);

    const poolList = Object.values(genderPool);
    let iterations = 0;
    const maxIterations = 14;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * poolList.length);
      const tempItem = poolList[randomIdx];
      setShuffleDisplayTitle(tempItem.title);
      setShuffleDisplayEmoji(tempItem.avatarEmoji);
      playFx(450 + iterations * 30, 0.04);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        // Guarantee a different archetype if pool has > 1
        const otherOptions = poolList.filter((p) => p.archetypeId !== profile.archetypeId);
        const finalPick =
          otherOptions.length > 0
            ? otherOptions[Math.floor(Math.random() * otherOptions.length)]
            : poolList[0];

        setSelectedArchetypeId(finalPick.archetypeId);
        setIsShuffling(false);
        playFx(980, 0.2);
        setCopyMsg(`🎉 Rerolled to "${finalPick.categoryLabel}"!`);
        setTimeout(() => setCopyMsg(null), 3000);
      }
    }, 85);
  };

  // ==========================================
  // PHOTO UPLOAD HANDLER
  // ==========================================
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUserPhoto(result);
        if (typeof window !== 'undefined') {
          const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
          localStorage.setItem(`ika_cert_photo_${adm}`, result);
        }
        playFx(800, 0.1);
        setCopyMsg('📸 Photo successfully embedded on degree!');
        setTimeout(() => setCopyMsg(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setUserPhoto(null);
    if (typeof window !== 'undefined') {
      const adm = currentUser?.admissionNo || currentUser?.email || 'guest';
      localStorage.removeItem(`ika_cert_photo_${adm}`);
    }
    setCopyMsg('Photo reset to avatar emoji.');
    setTimeout(() => setCopyMsg(null), 2500);
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    playFx(820, 0.1);
    const text = `📜 *OFFICIAL DEGREE OF CAMPUS NUISANCE (उपद्रव प्रमाण पत्र)* 💀👑\n\n👤 *${displayName}* (${displayRoll} • *Sec ${displaySec}*)\n🎖️ *Title:* ${profile.avatarEmoji} *${profile.title}*\n🏆 *Status:* ${profile.badge} (${profile.auraScore})\n\n⚖️ *Campus Charges (Dharayein):*\n${profile.charges.map((c) => `• ${c}`).join('\n')}\n\n💬 *Quote:* "${profile.quote}"\n\n📜 *Decree:* ${profile.penalty}\n\n👉 *Apna degree check & download karo:* https://ki-world.vercel.app`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyDecree = () => {
    playFx(820, 0.1);
    const text = `📜 OFFICIAL CERTIFICATE OF NUISANCE: ${displayName} (${profile.title})\n"${profile.quote}"\nCharges: ${profile.charges.join(' | ')}\nhttps://ki-world.vercel.app`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyMsg('📋 Certificate text copied to clipboard!');
      setTimeout(() => setCopyMsg(null), 3000);
    }
  };

  // ==========================================
  // HIGH-RESOLUTION HORIZONTAL PNG EXPORT (1200x750)
  // ==========================================
  const handleDownloadCertificatePng = async () => {
    setIsGeneratingPng(true);
    playFx(920, 0.15);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Normal Horizontal Landscape Diploma: 1200 x 750
      const width = 1200;
      const height = 750;
      canvas.width = width;
      canvas.height = height;

      // 1. Theme-based Background Gradient
      const [bg1, bg2, bg3] = currentTheme.canvasBg;
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, bg1);
      bgGrad.addColorStop(0.5, bg2);
      bgGrad.addColorStop(1, bg3);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Double Borders
      const { primary, secondary, highlight } = currentTheme.canvasBorders;

      ctx.strokeStyle = primary;
      ctx.lineWidth = 12;
      ctx.strokeRect(18, 18, width - 36, height - 36);

      ctx.strokeStyle = secondary;
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, width - 56, height - 56);

      ctx.strokeStyle = highlight;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(34, 34, width - 68, height - 68);

      // Corner rosettes
      const drawRosette = (cx: number, cy: number) => {
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      };
      drawRosette(34, 34);
      drawRosette(width - 34, 34);
      drawRosette(34, height - 34);
      drawRosette(width - 34, height - 34);

      // Resolve Font Families
      const titleFontFamily =
        selectedFont === 'royal'
          ? 'Playfair Display, Georgia, serif'
          : selectedFont === 'modern'
          ? 'Inter, system-ui, sans-serif'
          : selectedFont === 'gothic'
          ? 'Cinzel, Georgia, serif'
          : 'Courier New, monospace';

      // ==========================================
      // LEFT SECTION: PHOTO & STUDENT CREDENTIALS
      // ==========================================
      const leftColX = 170;
      const photoWidth = 170;
      const photoHeight = 200;
      const photoX = leftColX - photoWidth / 2;
      const photoY = 90;

      // Photo frame background & border
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(photoX, photoY, photoWidth, photoHeight);

      // Load user uploaded photo if available
      if (userPhoto) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = userPhoto;
          });

          // Draw clipped image inside frame
          ctx.save();
          ctx.beginPath();
          ctx.rect(photoX + 4, photoY + 4, photoWidth - 8, photoHeight - 8);
          ctx.clip();
          ctx.drawImage(img, photoX + 4, photoY + 4, photoWidth - 8, photoHeight - 8);
          ctx.restore();
        } catch {
          // Fallback if image fails to render
          ctx.fillStyle = '#1e1b2e';
          ctx.fillRect(photoX + 4, photoY + 4, photoWidth - 8, photoHeight - 8);
          ctx.font = '64px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(profile.avatarEmoji, leftColX, photoY + 120);
        }
      } else {
        // Fallback: Archetype Avatar Emoji inside styled frame
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(photoX + 4, photoY + 4, photoWidth - 8, photoHeight - 8);
        ctx.font = '72px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(profile.avatarEmoji, leftColX, photoY + 125);
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = highlight;
        ctx.fillText('OFFICIAL IDENTITY', leftColX, photoY + 165);
      }

      // Ornate Frame Border
      ctx.strokeStyle = primary;
      ctx.lineWidth = 4;
      ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
      ctx.strokeStyle = highlight;
      ctx.lineWidth = 1;
      ctx.strokeRect(photoX + 4, photoY + 4, photoWidth - 8, photoHeight - 8);

      // Student Credentials under Photo
      ctx.textAlign = 'center';
      ctx.fillStyle = highlight;
      ctx.font = `bold 16px ${titleFontFamily}`;
      ctx.fillText(displayName, leftColX, photoY + photoHeight + 35);

      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(displayRoll, leftColX, photoY + photoHeight + 58);
      ctx.fillText(`SEC ${displaySec} • ${displayAdm}`, leftColX, photoY + photoHeight + 78);

      // Shinigami Red Wax Seal on Left
      const sealX = leftColX;
      const sealY = 570;

      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = highlight;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 40, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('SHINIGAMI REALM', sealX, sealY - 14);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('👑 1402', sealX, sealY + 8);
      ctx.font = 'bold 9px monospace';
      ctx.fillText('VERIFIED DEGREE', sealX, sealY + 24);

      // Verified mark under seal
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.fillText('SECURED HASH: #ikA-1402-ABES', sealX, 650);

      // Vertical Divider separating Left & Right columns
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(280, 50);
      ctx.lineTo(280, height - 50);
      ctx.stroke();

      // ==========================================
      // RIGHT SECTION: DIPLOMA CONTENT & CHARGES
      // ==========================================
      const rightStartX = 310;
      const rightWidth = width - rightStartX - 45;
      const rightCenterX = rightStartX + rightWidth / 2;

      // Header Crest
      ctx.textAlign = 'center';
      ctx.fillStyle = currentTheme.headerColor;
      ctx.font = 'bold 13px monospace';
      ctx.fillText('🏛️ ABES ENGINEERING COLLEGE • SUPREME SHINIGAMI REALM 👁️', rightCenterX, 70);

      // Diploma Title
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 30px ${titleFontFamily}`;
      ctx.fillText('CERTIFICATE OF CAMPUS NUISANCE', rightCenterX, 110);

      ctx.fillStyle = secondary;
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('उपद्रव एवं शैतानी उपाधि पत्र 📜💀', rightCenterX, 136);

      // Citation statement with student name
      ctx.fillStyle = highlight;
      ctx.font = `bold 16px ${titleFontFamily}`;
      ctx.fillText(
        `This sovereign decree proudly confers upon ${displayName}:`,
        rightCenterX,
        170
      );

      // Conferred Title Box
      const titleBoxY = 190;
      const titleBoxHeight = 82;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(rightStartX + 10, titleBoxY, rightWidth - 20, titleBoxHeight);
      ctx.strokeStyle = primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(rightStartX + 10, titleBoxY, rightWidth - 20, titleBoxHeight);

      ctx.fillStyle = highlight;
      ctx.font = `900 22px ${titleFontFamily}`;
      ctx.fillText(`${profile.avatarEmoji} ${profile.title}`, rightCenterX, titleBoxY + 34);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`(${profile.hindiTitle})`, rightCenterX, titleBoxY + 54);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${profile.badge} • ${profile.auraScore}`, rightCenterX, titleBoxY + 72);

      // Charges Box (Dharayein)
      const chargesY = 290;
      const chargesHeight = 180;
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(rightStartX + 10, chargesY, rightWidth - 20, chargesHeight);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeRect(rightStartX + 10, chargesY, rightWidth - 20, chargesHeight);

      ctx.fillStyle = secondary;
      ctx.font = 'bold 14px monospace';
      ctx.fillText('⚖️ OFFICIAL CAMPUS PENAL CODE CHARGES (धाराएं):', rightStartX + 25, chargesY + 30);

      ctx.fillStyle = '#f3f4f6';
      ctx.font = '14px sans-serif';
      let cy = chargesY + 62;
      profile.charges.forEach((ch) => {
        const words = ch.split(' ');
        let line = '• ';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          if (ctx.measureText(testLine).width > rightWidth - 65 && n > 0) {
            ctx.fillText(line, rightStartX + 25, cy);
            line = '  ' + words[n] + ' ';
            cy += 22;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, rightStartX + 25, cy);
        cy += 28;
      });

      // Signature Quote Box
      const quoteY = 485;
      const quoteHeight = 55;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(rightStartX + 10, quoteY, rightWidth - 20, quoteHeight);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(rightStartX + 10, quoteY, rightWidth - 20, quoteHeight);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('SIGNATURE CAMPUS PUNCHLINE:', rightCenterX, quoteY + 20);

      ctx.fillStyle = highlight;
      ctx.font = `italic 15px ${titleFontFamily}`;
      ctx.fillText(`“${profile.quote}”`, rightCenterX, quoteY + 42);

      // Sovereign Decree Penalty
      const decreeY = 555;
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`⚠️ OFFICIAL DECREE: ${profile.penalty}`, rightCenterX, decreeY);

      // Bottom Signatures
      ctx.textAlign = 'left';
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('VERIFIED BY: Shinigami Registry 📜', rightStartX + 25, 680);

      ctx.textAlign = 'right';
      ctx.fillStyle = primary;
      ctx.font = 'bold 12px monospace';
      ctx.fillText('SANCTIONED: Supreme Boss ikA 👑', width - 55, 680);

      // Trigger high-res horizontal PNG download
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${displayName.replace(/\s+/g, '_')}_Nuisance_Diploma.png`;
      downloadLink.click();

      setCopyMsg('📸 High-resolution horizontal diploma downloaded!');
      setTimeout(() => setCopyMsg(null), 3500);
    } catch (err) {
      console.error(err);
      setCopyMsg('Download failed. Kripya dobara try karein.');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex justify-center w-full">
      <div className="w-full max-w-5xl space-y-5 animate-in fade-in zoom-in-95 duration-200 pb-20">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white">Degree of Nuisance</h2>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono text-[10px] font-bold">
                  HORIZONTAL DIPLOMA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10px] font-bold">
                  {isFemale ? '🌸 Girl Edition' : '👑 Boy Edition'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Official campus bakchodi &amp; mischief degree — unlocked for {displayAdm}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffleDegree}
              disabled={isShuffling}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white text-xs font-black shadow-lg cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>🔀</span>
              <span>{isShuffling ? 'Rolling...' : 'Shuffler (Reroll)'}</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold cursor-pointer transition border border-white/10"
            >
              ← Overview
            </button>
          </div>
        </div>

        {/* CUSTOMIZATION CONTROLS BAR: FONT, COLOR THEME & SHUFFLER */}
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between flex-wrap gap-3">
          {/* Font Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider font-bold">
              ✍️ Font:
            </span>
            {(
              [
                { id: 'royal', label: 'Royal Serif', icon: '📜' },
                { id: 'modern', label: 'Modern Sans', icon: '⚡' },
                { id: 'gothic', label: 'Shinigami Gothic', icon: '💀' },
                { id: 'mono', label: 'Terminal Mono', icon: '💻' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setSelectedFont(f.id);
                  playFx(600, 0.04);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 border ${
                  selectedFont === f.id
                    ? 'bg-amber-500 text-black border-amber-400 shadow'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          {/* Theme Color Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider font-bold">
              🎨 Theme:
            </span>
            {(Object.keys(THEME_CONFIGS) as CertificateTheme[]).map((themeKey) => {
              const th = THEME_CONFIGS[themeKey];
              const isSelected = selectedTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => {
                    setSelectedTheme(themeKey);
                    playFx(640, 0.04);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-400 shadow'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>{th.icon}</span>
                  <span className="hidden sm:inline">{th.name}</span>
                </button>
              );
            })}
          </div>

          {/* Editable Name on Degree (Pre-filled with student name) */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold shrink-0">
              ✏️ Degree Name:
            </span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={studentName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Student name..."
                title="Edit name printed on certificate"
                className="bg-black/80 border border-amber-500/50 hover:border-amber-400 focus:border-amber-400 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold outline-none max-w-[170px] sm:max-w-[210px] transition"
              />
              {studentName !== (currentUser?.name || '') && (
                <button
                  type="button"
                  onClick={handleResetName}
                  title="Reset to default name"
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-mono font-bold cursor-pointer transition"
                >
                  ↺ Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NOTIFICATION MESSAGE */}
        {copyMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            {copyMsg}
          </div>
        )}

        {/* ROLLING SLOT MACHINE ANIMATION OVERLAY (WHEN SHUFFLING) */}
        {isShuffling && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-black to-red-950/80 border-2 border-amber-400/80 text-center space-y-2 animate-pulse shadow-2xl">
            <span className="text-3xl animate-bounce inline-block">
              {shuffleDisplayEmoji}
            </span>
            <div className="font-mono">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-black block">
                🎰 REROLLING DEGREE AMONG {isFemale ? 'FEMALE' : 'MALE'} CAMPUS ARCHETYPES...
              </span>
              <h4 className="text-base sm:text-lg font-black text-white truncate max-w-md mx-auto">
                {shuffleDisplayTitle || 'Generating Authentic Degree...'}
              </h4>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THE HORIZONTAL (LANDSCAPE) DIPLOMA CERTIFICATE CONTAINER  */}
        {/* ========================================================= */}
        <div
          className={`relative rounded-3xl p-5 sm:p-7 bg-gradient-to-br ${currentTheme.cardBg} border-4 ${currentTheme.outerBorder} shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white overflow-hidden`}
        >
          {/* Corner Ornaments */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-amber-500 border border-red-500" />
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-amber-500 border border-red-500" />
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-amber-500 border border-red-500" />
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-amber-500 border border-red-500" />

          {/* TWO-COLUMN HORIZONTAL LANDSCAPE LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* LEFT COLUMN: PHOTO FRAME & IDENTITY (35% on desktop) */}
            <div className="md:col-span-4 flex flex-col items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-center">
              
              {/* Photo Frame with Upload Trigger */}
              <div className="w-full flex flex-col items-center space-y-2">
                <div className="relative group w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden bg-black/80 border-2 border-amber-500/80 shadow-xl flex items-center justify-center">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                      <span className="text-5xl">{profile.avatarEmoji}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        No Photo Uploaded
                      </span>
                      <span className="text-[9px] text-gray-400">Tap below to add selfie 📸</span>
                    </div>
                  )}

                  {/* Hover upload pill */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-xs font-bold text-white cursor-pointer"
                  >
                    <span>📷</span>
                    <span>{userPhoto ? 'Change Photo' : 'Upload Selfie'}</span>
                  </button>
                </div>

                {/* Photo Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 cursor-pointer transition flex items-center gap-1"
                  >
                    <span>📸</span> {userPhoto ? 'Replace Photo' : 'Upload Your Photo'}
                  </button>
                  {userPhoto && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold border border-red-500/40 cursor-pointer transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Student Credentials (Directly Editable) */}
              <div className="space-y-1 w-full px-1">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[8px] font-mono text-gray-400 px-1">
                    <span className="text-amber-400 font-bold">✏️ TAP NAME TO EDIT:</span>
                    {studentName !== (currentUser?.name || '') && (
                      <button
                        type="button"
                        onClick={handleResetName}
                        className="text-amber-400 hover:text-white underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Student name..."
                    title="Click to edit name on certificate"
                    className={`w-full text-center bg-black/40 border border-amber-500/40 hover:border-amber-400 focus:border-amber-400 rounded-xl px-2 py-1 text-sm font-black text-amber-300 uppercase tracking-wide outline-none transition ${
                      selectedFont === 'royal'
                        ? 'font-serif'
                        : selectedFont === 'mono'
                        ? 'font-mono'
                        : ''
                    }`}
                  />
                </div>
                <p className="text-[11px] font-mono text-gray-300 font-bold">
                  {displayRoll}
                </p>
                <p className="text-[10px] font-mono text-gray-400">
                  SECTION {displaySec} • {displayAdm}
                </p>
              </div>

              {/* Shinigami Red Wax Seal */}
              <div className="flex flex-col items-center pt-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-700 to-amber-700 border-2 border-amber-400 flex flex-col items-center justify-center text-white shadow-lg shadow-red-950/60">
                  <span className="text-[7px] font-mono font-black">BOSS ikA</span>
                  <span className="text-sm">👑</span>
                  <span className="text-[7px] font-mono font-black">1402 SEAL</span>
                </div>
                <span className="text-[9px] font-mono text-gray-400 mt-1">
                  Verified by Shinigami Matrix
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: DIPLOMA CONTENT & CHARGES (65% on desktop) */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-3.5 text-left">
              
              {/* Header Crest */}
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-amber-400">
                  🏛️ ABES ENGINEERING COLLEGE • SUPREME SHINIGAMI REALM 👁️
                </p>
                <h1
                  className={`text-xl sm:text-3xl font-black text-white tracking-wide ${
                    selectedFont === 'royal'
                      ? 'font-serif'
                      : selectedFont === 'mono'
                      ? 'font-mono'
                      : ''
                  }`}
                >
                  CERTIFICATE OF NUISANCE
                </h1>
                <p className="text-xs font-bold text-red-400">
                  उपद्रव एवं शैतानी उपाधि पत्र 📜💀
                </p>
              </div>

              {/* Conferred upon Student Statement */}
              <div className="flex items-center justify-between flex-wrap gap-2 py-1.5 px-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 italic">
                  Conferred upon:
                </span>
                <span
                  className={`text-sm sm:text-base font-black text-amber-300 tracking-wide uppercase ${
                    selectedFont === 'royal'
                      ? 'font-serif'
                      : selectedFont === 'mono'
                      ? 'font-mono'
                      : ''
                  }`}
                >
                  🎓 {displayName}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  ({displayRoll} • Sec {displaySec})
                </span>
              </div>

              {/* Conferred Honorary Title Box */}
              <div
                className={`p-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.badgeBg} border-2 border-red-500/50 shadow-inner space-y-1`}
              >
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-300 block">
                  Honorary Degree Conferred:
                </span>
                <h3
                  className={`text-base sm:text-lg font-black text-white flex items-center gap-2 ${
                    selectedFont === 'royal'
                      ? 'font-serif'
                      : selectedFont === 'mono'
                      ? 'font-mono'
                      : ''
                  }`}
                >
                  <span>{profile.avatarEmoji}</span>
                  <span>{profile.title}</span>
                </h3>
                <p className="text-xs font-bold text-red-300">
                  ({profile.hindiTitle})
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-mono font-black border border-white/20">
                  {profile.badge} • {profile.auraScore}
                </span>
              </div>

              {/* Criminal Charges Section */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5 font-mono text-[11px]">
                <h4 className="font-bold text-red-400 flex items-center gap-1.5 text-xs border-b border-white/10 pb-1">
                  <span>⚖️</span> OFFICIAL CAMPUS PENAL CODE CHARGES (धाराएं):
                </h4>
                <div className="space-y-1 text-gray-200">
                  {profile.charges.map((ch, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Punchline Quote */}
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest block mb-0.5">
                  Signature Punchline
                </span>
                <p className="text-xs italic font-serif text-amber-200">
                  &ldquo;{profile.quote}&rdquo;
                </p>
              </div>

              {/* Sovereign Decree Penalty */}
              <div className="text-[11px] font-mono font-bold text-red-300 p-2 rounded-xl bg-red-950/40 border border-red-500/30">
                ⚠️ OFFICIAL DECREE: {profile.penalty}
              </div>

              {/* Footer Signatures */}
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1 border-t border-white/10">
                <span>Verified: Shinigami Registry 📜</span>
                <span className="text-red-400 font-bold">Sanctioned: Supreme Boss ikA 👑</span>
              </div>
            </div>
          </div>
        </div>

        {/* 12 DIVERSE CATEGORIES QUICK-SWITCH PILLS */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              🎖️ Quick Claim Degrees ({isFemale ? 'Female Collection' : 'Male Collection'}):
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              Current: <strong className="text-white">{profile.categoryLabel}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {Object.values(genderPool).map((arch) => {
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

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex items-center gap-3 justify-center flex-wrap pt-2">
          <button
            type="button"
            onClick={handleDownloadCertificatePng}
            disabled={isGeneratingPng}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs shadow-xl cursor-pointer transition flex items-center gap-2 disabled:opacity-50"
          >
            <span>📸</span>
            <span>{isGeneratingPng ? 'Generating High-Res...' : 'Download Horizontal PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handleShuffleDegree}
            disabled={isShuffling}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>🔀</span>
            <span>Reroll Degree (Shuffler)</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5"
          >
            <span>📲</span>
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyDecree}
            className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5 border border-white/10"
          >
            <span>📋</span>
            <span>Copy Text</span>
          </button>
        </div>

      </div>
    </div>
  );
}
