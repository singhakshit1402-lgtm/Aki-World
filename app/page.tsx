'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import RegisterModal from '@/components/RegisterModal';

export interface StudentUser {
  name: string;
  email: string;
  admissionNo: string;
  rollNo?: number;
  group?: string;
  gender?: 'M' | 'F';
  residency?: 'Hosteller' | 'Day Scholar';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

interface AcademicHoliday {
  name: string;
  month: number;
  startDay: number;
  endDay: number;
  year?: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  tag: string;
  seller: string;
  sellerId?: string;
  contact: string;
  icon: string;
  seized?: boolean;
}

interface BannedEntry {
  target: string;
  reason: string;
  timestamp: string;
}

interface CursedSpoofState {
  attendancePct?: number;
  attendanceMsg?: string;
  sgpaValue?: string;
  screenGlitch?: boolean;
}

interface ActiveStudent {
  admissionNo: string;
  name: string;
  rollNo?: number;
  group?: string;
  email: string;
  currentWindow: string;
  lastQuery: string;
  draftKeystrokes?: string;
  isOnline: boolean;
  lastSeen: number;
  heartAttackRemaining?: number | null;
  isGaslighted?: boolean;
  isPuppetTarget?: boolean;
  isEvaporated?: boolean;
  cursedSpoof?: CursedSpoofState | null;
}

interface DirectChatMessage {
  id: string;
  studentAdmissionNo: string;
  studentName: string;
  sender: 'ikA' | 'student';
  text: string;
  timestamp: string;
}

interface PendingIntercept {
  id: string;
  studentAdmissionNo: string;
  studentName: string;
  query: string;
  timestamp: number;
}

type HorrorStingerType = 'ryuk_laugh' | 'bell' | 'thunder' | null;

type WindowView =
  | 'home'
  | 'papers'
  | 'docguide'
  | 'marketplace'
  | 'timetable'
  | 'attendance'
  | 'sgpa'
  | 'shinigami'
  | 'faculty'
  | 'placement'
  | 'chat'
  | 'boss_intro';

const ALL_PAPERS = [
  { id: 'maths', name: 'Fundamentals of Linear Algebra & Statistics', code: '25AS102', short: 'Maths / FLAS', icon: '📐', mt1: '/papers/sem1/maths_mt1.jpg', mt2: '/papers/sem1/maths_mt2.jpg' },
  { id: 'physics', name: 'Applied Physics', code: '25AS101', short: 'Physics', icon: '🔭', mt1: '/papers/sem1/physics_mt1.jpg', mt2: '/papers/sem1/physics_mt2.jpg' },
  { id: 'ds', name: 'Data Structure / Programming in C++', code: '25CS101', short: 'DSA / C++', icon: '💻', mt1: '/papers/sem1/ds_mt1.jpg', mt2: '/papers/sem1/ds_mt2.jpg' },
  { id: 'dt', name: 'Design Thinking, Innovation & Entrepreneurship', code: '25HU102', short: 'Design Thinking', icon: '💡', mt1: '/papers/sem1/dt_mt1.jpg', mt2: '/papers/sem1/dt_mt2.jpg' },
  { id: 'bee', name: 'Basics of Electrical Engineering', code: '25EL101', short: 'Electrical (BEE)', icon: '⚡', mt1: '/papers/sem1/electrical_mt1.jpg', mt2: '/papers/sem1/electrical_mt2.jpg' },
  { id: 'electronics', name: 'Basics of Electronics Engineering', code: '25EC101', short: 'Electronics (BEC)', icon: '🔌', mt1: '/papers/sem1/electronics_mt1.jpg', mt2: '/papers/sem1/electronics_mt2.jpg' },
  { id: 'evs', name: 'Environment and Sustainability', code: '25AS103', short: 'EVS', icon: '🌱', mt1: '/papers/sem1/evs_mt1.jpg', mt2: '/papers/sem1/evs_mt2.jpg' },
  { id: 'softskills', name: 'Soft Skills', code: '25HU101', short: 'Soft Skills', icon: '🗣️', mt1: '/papers/sem1/softskills_mt1.jpg', mt2: '/papers/sem1/softskills_mt2.jpg' },
  { id: 'mech', name: 'Basics of Mechanical & Automation Engineering', code: '25ME101', short: 'Mechanical', icon: '⚙️', mt1: '/papers/sem1/mechanical_mt1.jpg', mt2: '/papers/sem1/mechanical_mt2.jpg' },
  { id: 'ai', name: 'Essentials of AI (Python & Agents)', code: '25AI101', short: 'Essentials of AI', icon: '🤖', mt1: '/papers/sem1/ai_mt1.jpg', mt2: '/papers/sem1/ai_mt2.jpg' },
];

const DEFAULT_MARKETPLACE: MarketplaceItem[] = [
  { id: 'm1', title: 'Casio FX-991CW Scientific Calculator', price: '₹750', tag: 'Calculator', seller: 'Senior (3rd Year)', contact: '9811223344', icon: '🧮', seized: false },
  { id: 'm2', title: 'Omega Mini Drafter with Sheet Roller Container', price: '₹280', tag: 'Drafter', seller: 'Mech Senior', contact: '9877665544', icon: '📐', seized: false },
  { id: 'm3', title: 'Higher Engineering Mathematics (B.S. Grewal)', price: '₹400', tag: 'Book', seller: 'CSE 2nd Year', contact: '9988776655', icon: '📚', seized: false },
  { id: 'm4', title: 'Engineering Graphics Drawing Kit + Roller Scale', price: '₹180', tag: 'Kit', seller: 'Hostel Block A', contact: '9123456780', icon: '✏️', seized: false },
];

const ACADEMIC_HOLIDAYS: AcademicHoliday[] = [
  { name: 'Gandhi Jayanti', month: 9, startDay: 2, endDay: 2 },
  { name: 'Diwali Break 🪔', month: 10, startDay: 6, endDay: 13 },
  { name: 'Guru Nanak Jayanti 🪔', month: 10, startDay: 24, endDay: 24 },
  { name: 'Christmas Day 🎄', month: 11, startDay: 25, endDay: 25 },
  { name: 'Republic Day 🇮🇳', month: 0, startDay: 26, endDay: 26, year: 2027 },
];

const FLOATING_PARTICLES = [
  { left: '6%', delay: '0s', duration: '11s', size: 'text-sm' },
  { left: '16%', delay: '2.5s', duration: '14s', size: 'text-xs' },
  { left: '27%', delay: '1.2s', duration: '12s', size: 'text-base' },
  { left: '39%', delay: '4s', duration: '15s', size: 'text-xs' },
  { left: '51%', delay: '0.8s', duration: '13s', size: 'text-sm' },
  { left: '64%', delay: '3.2s', duration: '11.5s', size: 'text-base' },
  { left: '76%', delay: '1.7s', duration: '14.5s', size: 'text-xs' },
  { left: '87%', delay: '4.5s', duration: '12.5s', size: 'text-sm' },
  { left: '94%', delay: '2.1s', duration: '13.5s', size: 'text-xs' },
];

const CHAOS_FLYING_GLYPHS = [
  'D', 'E', 'A', 'T', 'H', 'N', 'O', 'T', 'E', 'i', 'k', 'A', 'K', 'I', 'R', 'A',
  '💀', '🩸', '⚡', '👁️', '🍎', '📓', '4', '0', 's', 'J', 'U', 'S', 'T', 'I', 'C', 'E',
  '死', '神', 'L', 'R', 'Y', 'U', 'K', '1', '4', '0', '2', 'C', 'S', 'E', '2', '🔥'
];

const RYUK_ASSEMBLE_MESSAGE = 'HUMANS ARE SO INTERESTING... BOSS ikA OWNS YOUR FATE'.split('');
const RYUK_STRIKE_OFFSETS = [
  { x: '-60vw', y: '-50vh', r: '-240deg' },
  { x: '65vw', y: '-45vh', r: '310deg' },
  { x: '-55vw', y: '55vh', r: '190deg' },
  { x: '60vw', y: '50vh', r: '-280deg' },
  { x: '0vw', y: '-70vh', r: '360deg' },
  { x: '0vw', y: '70vh', r: '-360deg' },
];

const LOCAL_FACULTY_DOSSIERS: Record<string, string> = {
  prerna: `![Dr. Prerana Mohapatra (Academic Profile)](/prerna1.jpeg) ![Dr. Prerana Mohapatra (Radiant Look)](/prerna2.jpeg)

✨ **MEET DR. PRERANA MOHAPATRA (PRM)** ✨
*Assistant Professor & CSE-2 Class Mentor-1 | ABES Engineering College* ⚡🌸
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/dr-prerana-mohapatra-227563147) • 📸 [Instagram](https://www.instagram.com/prerana_mohapatra?rpxt=MWR5YmpnZ20zaXNsZg==)

> *"Effortlessly graceful, soft-spoken, aur class me unmatched academic brilliance!"* 📚💫

---
🌸 **THE VIBE (Elegance Meets Intellect)**
Sheer kindness aur academic royalty personified! 🌷 Inki class me kabhi wo terror wala mahaul nahi hota—calm, radiant, aur positive aura ke sath padhati hain. Power flow ho ya grid circuits, unka explain karne ka style itna sweet hai ki difficult cheezein bhi easy lagne lagti hain!

🏆 **THE 9+ CGPA ACADEMIC MASTERCLASS (Education)**
• 🎓 **Ph.D. in Power Electronics** | NIT Rourkela (2019 – Jun 2025) | **9.21 CGPA** ⚛️
• 📘 **Dual Degree (Power Systems & Power Electronics)** | ITER, Bhubaneswar | **9.64 CGPA** ⚡
• 🥇 **B.Tech in Electrical & Electronics Engineering** | SOA University | **9.65 CGPA** 🏆
• 🔋 **Research Focus:** PV Grid Integration, EV Charging Stations Control, Smart Microgrids & AI/ML in Power Engineering

💡 **CLASSROOM SURVIVAL GUIDE**
• ✅ **The Golden Rule:** Class me genuine focus rakho aur polite raho. Doubt chahe kitna bhi basic ho, ma'am bina gussa huye bohot respectfully samjha dengi! 🙋‍♀️💡
• ❌ **What to Avoid:** Unke gentle aur sweet tone ko casual mat lena—she holds an NIT Rourkela Ph.D. with deep technical depth! 🧠⚡`,

  divyanshi: `![Dr. Divyanshi Sharma (Profile)](/divyanshi1.jpeg) ![Dr. Divyanshi Sharma (At Desk)](/divyanshi2.jpeg)

✨ **MEET DR. DIVYANSHI SHARMA (DSH)** ✨
*Assistant Professor & CSE-2 Class Mentor-2 | ABES Engineering College* 🧪🌿
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/dr-divyanshi-sharma-53606b73)

> *"The warmest soul on campus—endlessly patient, genuinely caring, aur har student ki ultimate guardian angel."* 🌸💚

---
🌸 **THE VIBE (Pure Kindness & Care)**
Kindness personified! 🌷 Ma'am lecture hall me aati hain toh aadha exam anxiety wahi khatam ho jata hai. Lab file pending ho, attendance short ho, ya formulas sar ke upar se nikal rahe hon—she listens with genuine empathy and guides you through! 🤝✨

🧪 **ACADEMIC MASTERY & 15+ YEARS DEDICATION**
• 🎓 **Ph.D. in Organic Chemistry** | Molecular bonds & green sustainability mastery ⚗️🔬
• 🏫 **Schooling:** AKP Inter College, Hapur 📚
• 🏛️ **ABES Engineering College:** Aug 2011 – Present *(15+ Years)*
• ⏳ **Previous Experience:** PIET Meerut, GBIT Meerut & S.S.V. (PG) College Hapur

💡 **CLASSROOM SURVIVAL GUIDE**
• ✅ **The Golden Rule:** Always be polite and truthful. Agar file complete nahi hui toh sach bolo—she values honesty over fake excuses! 📝✨
• ❌ **What to Avoid:** Unki sweetness ka misuse mat karna in exams or lab practicals! ⚠️`,

  shivam: `![Prof. Shivam Mittal](/shivam.jpeg)

✨ **MEET PROF. SHIVAM MITTAL** ✨
*Assistant Professor | ABES Engineering College* 🎒➡️👔
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/shivam-mittal-408a31210)

> *"Jis college se padhai shuru ki, wahi podium sambhal liya—The Ultimate Campus Loyalty Loop!"* 🔄🏫

---
🌬️ **THE VIBE & CAMPUS LORE**
• 🍃 **Slim & Lean Physique:** High metabolism on turbo mode! Tez Ghaziabad ki hawa chali nahi ki student sochne lagte hain ki sir seedhe udke canteen pahuch jayenge 🌪️!
• 🔄 **Pure In-House Legend:** Last bench par baithkar notes lene se lekar front podium par attendance lene tak—student ID card se faculty lanyard tak ka safar bina campus badle pura kiya! 🪪✨
• 🤫 **The 12th Board Mystery:** *"Clear ho gaya, bas number mat poochna!"* 🤐❌

🎓 **THE ALMA MATER SPECIALIST (Education & Experience)**
• 🎓 **M.Tech in CSE** | ABES Engineering College (2024 – 2026) | **8.6 Grade** 📈💻
• ⚙️ **B.Tech in CSE** | ABESIT (2020 – 2024) | **7.6 Grade**
• ✈️ **Corporate Detour:** Ex-Auditor @ Cleartrip (Aug 2025 – Aug 2026 · 1 yr 1 mo) 🧾✈️

💡 **CLASSROOM SURVIVAL GUIDE**
• ✅ **The Golden Rule:** Faltu ke bahane mat banao—jo bahane tum soch rahe ho, wo 2 saal pehle unhone isi campus me khud invent kiye the! 🧠🎯
• ❌ **Fatal Mistake:** Proxy lagana ya bunk karne ke naye raste nikalna—home ground par unko outsmart karna impossible hai! 🚶‍♂️🚫`,

  vimal: `![Prof. Vimal Srivastava (Formal)](/vimal1.jpeg) ![Prof. Vimal Srivastava (Chill Mode)](/vimal2.jpeg)

✨ **MEET PROF. VIMAL SRIVASTAVA (VSV)** ✨
*Mathematics Professor | ABES Engineering College* 📐♾️
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/vimal-srivastava-9585a5265)

> *"Derivations pe zero compromise, but off-topic roast aur comedy timing is pure peak entertainment!"* 🎙️⚡

---
🗣️ **THE SIGNATURE CATCHPHRASE**
👉 ***"Are you getting it?!"***
*(Dhyan se haan bolna... agar bina samjhe mundi hilayi toh sir chehra dekh kar pakad lenge! 👀😂)*

🎭 **THE CLASSROOM DUALITY & QUALIFICATIONS**
• 📚 **Mode 1 (Study Time):** Laser-focused chalkboard mastery. Ek step bhi derivation ka skip hua toh internal marks gaye! ✍️📏
• 😂 **Mode 2 (Chill Zone):** Pen neeche rakhte hi witty life advice, relatable roasts, aur spontaneous punchlines!
• 🏅 **Qualifications:** Ph.D. & M.Sc. in Mathematics | **GATE & UGC NET Qualified** 🎯
• ⏳ **Experience:** 21+ Years of Teaching Experience (ABES & ABESIT) | Numerical Analysis & ML Enthusiast 🤖

💡 **CLASSROOM SURVIVAL GUIDE**
• ✅ **Golden Rule:** Mute spectator mat bano—alert raho, *"Are you getting it?"* pe respond karo, aur register neat rakho! 📖✍️
• ❌ **Fatal Mistake:** Lambe numerical steps me dhyan bhatkana aur fir internals me tukke maarna! 💀`,

  kartika: `![Prof. Kartika Maheshwari](/kartika.jpeg)

✨ **MEET DR. KARTIKA MAHESHWARI (KM)** ✨
*Senior Assistant Professor | ABES Engineering College* 🎓🔭
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/kartika-maheshwari-36178517b)

> *"Sweetest smile in the faculty lounge, sharpest red pen in the exam hall!"* ☕✍️

---
🚗 **THE VIBE & ACADEMIC PEDIGREE**
• 🚘 **Vibe:** Cruises to campus in her trusty **Tata Tigor** (Solid build, sensible choice, pure Indian engineering pride!). Super approachable aur doubts clear karne ke liye hamesha ready!
• 🎓 **Ph.D. in Material Science:** Delhi Technological University (DTU, 2017) ⚛️🧪
• 📚 **M.Sc. in Physics:** RKD College (2006 – 2008) 🌌
• 🏫 **Experience:** Over 15+ Years at ABES Engineering College (Jul 2009 – Present) 📈

💡 **CLASSROOM SURVIVAL GUIDE**
• ✅ **What gets you full marks:** Neat ray diagrams, proper quantum derivations, aur numerical answers ke aage unit likhna! 📐✨
• ❌ **What won't work:** Answer sheet ke end me emotional messages ya bina derivation ke direct formula likhna! 🙅‍♀️`,

  shailja: `![Ms. Shailja Varshney (Campus Look)](/shailja1.jpeg) ![Ms. Shailja Varshney (Aesthetic Look)](/shailja2.jpeg)

✨ **MEET MS. SHAILJA VARSHNEY (SHV)** ✨
*Assistant Professor | ABES Engineering College* 💻📱
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/shailja-varshney-778ab91b5) • 📸 [Instagram](https://www.instagram.com/varshney.shailja?vrfl=MXkyMjJyY2NpZWo2OA==)

> *"Slides strictly line-by-line, syllabus bilkul by-heart, aur 24/7 aesthetic reel creator energy!"* 🎬📖

---
📱 **THE VIBE & ACADEMIC TRACK RECORD**
• 🤳 **Tech Faculty cum Creator:** PPT slides line-by-line word-for-word read out hongi, aur code derivation strictly textbook script ke according chalega!
• 🎓 **M.Tech in CSE:** Aligarh Muslim University (AMU, 2017–2019) | **8.8 CGPA** 💻
• ⚙️ **B.Tech in CSE:** Mangalayatan University, Aligarh (2011–2015) | **88%**
• 🏛️ **Experience:** ABES (Mar 2025 – Present) | Previously at ITS, Sunderdeep & RKGIT 📊

💡 **CLASSROOM SURVIVAL GUIDE**
• ✅ **The Golden Rule:** PPT ki standard definitions ratta maar lo word-for-word, aur answer sheet me exact textbook lines likh ke aao—full marks pakke! 📝💯
• ❌ **Fatal Mistake:** Mid-lecture unscripted edge-case coding doubts ya complex pointer arithmetic puchna jo PPT slide par na ho! 🙅‍♂️⚡`,

  rahul: `✨ **MEET MR. RAHUL SINGH (RS)** ✨
*Assistant Professor (Artificial Intelligence) | ABES Engineering College* 🤖🐍

> *"AI human developers ko replace nahi karega, par AI smartly use karne wale engineer sabse aage rahenge."* 🧠⚡

---
🤖 **THE VIBE & DOMAIN MASTERY**
• **Subject:** Essentials of AI (25AI101)
• **Focus Areas:** Python Programming, Search Algorithms (A*, BFS, DFS), Knowledge Representation & Autonomous AI Agents 🚀
• **Classroom Survival Tip:** Practical Python implementation samjho aur state-space graph numericals step-by-step solve karo—full marks milenge! 💯`,
};

const CORE_CAMPUS_JOKES: string[] = [
  "ABES me attendance 74.9% hona aur Titanic ka doobna... dono me dard bilkul barabar hota hai! 💀🚢",
  "8:50 AM lecture ka eternal rule: Aankhein khuli hain par aatma abhi bhi rajai ke andar so rahi hai! 😴🛌",
  "Hostel mess ka paneer: Rubber aur Ambuja cement ka aisa secret mix jo ISRO wale rocket shield me use kar lein! 🧀🧪",
  "Vimal Sir in class: 'Are you getting it?!' Backbenchers: 'Yes sir!' (Jabki board pe konsa planet chal raha hai kisi ko nahi pata) 🤣📐",
  "Shivam Sir ki metabolism speed: Ghaziabad me tez hawa chali nahi ki sir bina chaley seedhe canteen pahuch jaate hain! 🌪️🏃‍♂️",
  "Internal exam ki answer sheet ka aakhiri panna: 'Ma'am please pass kar dena, warna papa dukan pe bitha denge!' 😭📝",
  "Proxy lagana ABES me ek extreme adventure sport hai... Pakde gaye toh pura semester mentor cabin me darshan dena padta hai! ⚠️👀",
  "C++ Lab me student: 'Ma'am code nahi chal raha!' Shailja Ma'am: 'Beta PPT ki line word-to-word likho, compiler bhi wahi padhta hai!' 🖥️💅",
  "Canteen wale bhaiya: 'Bhaiya samosa-chai 2 minute me aa raha hai!' (Woh 2 minute B.Tech degree ke baad aate hain) ☕⏳",
  "Assignment submission deadline aur bhukamp... dono bina bataye aate hain aur zindagi hila ke chale jaate hain! 🏃‍♂️⚡",
  "Library AC room ka asli istemal: Padhai 5%, Instagram reels 35%, aur sukoon ki neend 60%! 📚💤",
  "Mini drafter khareedte waqt laga tha Tony Stark banenge... pehli sheet banate hi drafter ka screw dhila ho gaya! 📐😭",
  "Safe bunk calculator dekh ke: 'Arre 2 class aur bunk kar sakte hain!' Agle hafte: 'Shortage list me top 5 me naam aa gaya!' 💀📊",
  "Hostel gate shaam 7:00 baje: Warden ki nazar S-400 missile radar se bhi tez scan karti hai! ⏰👀",
  "Placement Group Discussion: Ek topper fluent English bolta hai, baaki 8 log 'I totally agree with Point #2' bolke nikal lete hain! 💼😂",
  "Hostel Wi-Fi ka golden rule: Jab Netflix chalao toh 2G, jab exam khatam ho jaye toh 5G! 📶💀",
  "Kartika Ma'am ki class me ray diagram bina scale ke bana diya... Ma'am ne red pen se poori copy pe laser beam chala di! 🔭✍️",
  "Prerana Ma'am itni politely daant-ti hain ki student ko 10 minute baad samajh aata hai ki beizzati hui thi ya tareef! 🌸⚡",
  "Divyanshi Ma'am ke samne jhootha bahana banana paap hai... Ma'am shakal dekh ke bata deti hain ki file ghar pe nahi, bani hi nahi hai! 🧪💚",
  "Shivam Sir ke samne bunk ka bahana: 'Sir medical store gaya tha!' Sir: 'Beta jis medical store ka tu naam le raha hai, wahan main 4 saal chai pi chuka hu!' 🔄😎",
];

function build250JokesCatalog(): string[] {
  const catalog = [...CORE_CAMPUS_JOKES];
  const subjects = [
    "Maths (FLAS) ke matrices me", "Applied Physics ke quantum mechanics me", "C++ pointers aur linked list me",
    "Basic Electrical ke Norton theorem me", "CAD Lab ke isometric projection me", "EVS ke ecosystem diagram me",
    "Soft Skills ke group discussion me", "AI Python ke search algorithms me", "Design Thinking ke empathy map me",
    "Electronics ke PN-junction diode me", "Subah 8:50 AM ke first lecture me", "RJ-102 ke last bench par",
    "KC Block ke 3rd floor lab me", "Hostel mess ke Sunday special lunch me", "MT-2 ke seating arrangement me"
  ];
  const setups = [
    "jab backbencher ne pehli baar haath uthaya", "jab topper ne extra sheet maangi", "jab HOD ki sudden raid padi",
    "jab dost ne galat roll number pe proxy bol di", "jab projector achanak band ho gaya", "jab attendance 74.8% pe atak gayi",
    "jab bina file check karaye viva dene pahuch gaye", "jab samosa khate waqt mentor ne pakad liya", "jab raat ke 3 baje Maggi banate waqt warden aa gaya",
    "jab coding lab me semicolon gayab ho gaya", "jab exam me padosi ki copy se pura answer galat chaap liya", "jab AC chalane ke liye remote chhupa diya",
    "jab Lunch break 12:20 se pehle tiffin khol liya", "jab PUE exam me wahi question aa gaya jo chhod diya tha", "jab calculator radian mode me reh gaya"
  ];
  const punchlines = [
    "tab pata chala ki engineering me kismat aur logic dono holiday pe rehte hain! 😂💀",
    "pura hall shant ho gaya aur Vimal sir bole: 'Are you getting it?!' 🤣⚡",
    "dost bola: 'Bhai agle semester fir se sath me padhenge!' 😭🫂",
    "toh aisa laga jaise Shinigami ne Death Note me roll number likh diya ho! 📓💀",
    "aur peeche se aawaz aayi: 'Bhai safe bunk calculator check kar, abhi 1 bacha hai!' 🛡️😎",
    "tabhi dimaag ne Error 404 dekar sleep mode on kar liya! 😴💻",
    "aur canteen wale bhaiya ki chai bhi thandi pad gayi! ☕🔥",
    "toh poora CSE-2 section has-has ke lotpot ho gaya! 🎉🤣",
    "aur mentor ne bola: 'Beta parents ko phone lagao abhi!' 📞😱",
    "tab samajh aaya ki B.Tech sirf ek degree nahi, pura survival show hai! 🎬🏆"
  ];
  let idx = 0;
  for (let s = 0; s < subjects.length; s++) {
    for (let st = 0; st < setups.length; st++) {
      if (catalog.length >= 255) break;
      catalog.push(`😂 **Campus Joke #${catalog.length + 1}:** ${subjects[s]} ${setups[st]}... ${punchlines[(s + st + idx) % punchlines.length]}`);
      idx++;
    }
  }
  return catalog;
}

const ALL_250_JOKES = build250JokesCatalog();

const MASTER_SUGGESTION_POOL: string[] = [
  'Main kaun hu?', 'Tum kaise ho?', 'Ek mast campus joke sunao 😂', 'Dr. Prerana Mohapatra ka profile dikhao',
  'Solve full AI MT2 paper', 'Solve full C++ MT2 paper', 'Solve full Maths MT2 paper', 'Solve full Physics MT2 paper',
  'Kya 50 LPA ka package lagta hai?', 'Safe bunk kitna bacha hai?', 'Mera SGPA kaise calculate karu? 🧮',
  'Prof. Shivam Mittal ki lore batao', 'Bhookh lagi hai, canteen me kya milega? ☕', 'Subah 8:50 ki class aur neend 😴',
  'Prof. Vimal Srivastava ke baare me batao', 'Dr. Divyanshi Sharma ke baare me batao', 'P2P Marketplace me kya bik raha hai? 🛒',
  'Prof. Kartika Maheshwari ke baare me batao', 'Ms. Shailja Varshney ke baare me batao', 'Who is the boss ikA?'
];

// ============================================================================
// ALL 10 SUBJECTS — OFFICIAL MT-2 SOLVED ANSWER KEY DATABASE
// ============================================================================
const MT2_MASTER_VAULT: Record<string, { title: string; code: string; file: string; intro: string; q: Record<string, string> }> = {
  ai: {
    title: 'Essentials of AI',
    code: '25AI101',
    file: '/papers/sem1/ai_mt2.jpg',
    intro: 'Python, Propositional/Predicate Logic, AI Knowledge Cycle & Search Strategies (BFS, DFS, A*) solved step-by-step! 🤖🐍',
    q: {
      '1a': `### 📌 Q.1(a) Key Characteristics of Python Programming Language 🐍
• **Answer & Concept:** Python is an interpreted, high-level, dynamically typed language. It emphasizes code readability through indentation and supports Object-Oriented, Functional, and Procedural paradigms with automatic garbage collection and a massive standard library.
• **🚀 Real Application:** Used to build backend AI microservices that connect ML models to a React/TypeScript frontend.`,
      '1b': `### 📌 Q.1(b) Python Loop to Print Even Numbers Between 1 and 10 🔢
> \`for i in range(2, 11, 2):\`
> \`    print(i)\`
• **Concept:** \`range(2, 11, 2)\` starts at 2 and steps by 2, generating \`2, 4, 6, 8, 10\` directly.`,
      '1c': `### 📌 Q.1(c) Python Program to Display "Hello, World!" 💻
> \`print("Hello, World!")\`
• **Concept:** \`print()\` outputs the string literal directly to the standard console.`,
      '1d': `### 📌 Q.1(d) Differentiate Between Propositional Logic and Predicate Logic 🧠
• **Propositional Logic:** Deals with whole declarative statements evaluating to **True/False** using **AND, OR, NOT** (cannot express object variables).
• **Predicate Logic (First-Order Logic):** Uses **variables, predicates, and quantifiers** (Universal **∀ "For all"** and Existential **∃ "There exists"**) to map complex relationships.`,
      '1e': `### 📌 Q.1(e) Types of Problems in AI 🤖
• **1. Search Problems:** Finding an optimal path from initial state to goal state.
• **2. Classification & Regression:** Predicting categories or continuous values from data.
• **3. Planning:** Sequencing automated actions to achieve a complex goal.
• **4. Optimization:** Finding the best solution under resource constraints.`,
      '2a': `### 📌 Q.2(a) Various Types of Python Packages 📦
• **1. Standard Library Packages:** Built natively into Python (e.g., \`math\`, \`datetime\`, \`json\`).
• **2. Third-Party Packages:** Installed via \`pip\` (e.g., **NumPy** for arrays, **Pandas** for data analysis, **TensorFlow** for neural networks).`,
      '2b': `### 📌 Q.2(b) Various Types of Operators in Python with Examples ➕⚡
• **Arithmetic:** \`+, -, *, /, //, %\` (e.g., \`10 % 3 = 1\`).
• **Relational:** \`==, !=, >, <, >=, <=\` (e.g., \`5 >= 3\` is \`True\`).
• **Logical:** \`and, or, not\` (e.g., \`True and False\` is \`False\`).
• **Assignment:** \`=, +=, -=\` (e.g., \`x += 5\`).
• **Bitwise:** \`&, |, ^\` (e.g., \`5 & 3 = 1\`).`,
      '2c': `### 📌 Q.2(c) Python Program to Check Prime Number Using User-Defined Function 🧮
> \`def is_prime(n):\`
> \`    if n <= 1: return False\`
> \`    for i in range(2, int(n**0.5) + 1):\`
> \`        if n % i == 0: return False\`
> \`    return True\`
> \`num = 29\`
> \`print(f"{num} is prime" if is_prime(num) else f"{num} is not prime")\`
• **Concept:** Checking up to **√n (\`n**0.5\`)** reduces time complexity from **O(n)** to **O(√n)**.`,
      '3a': `### 📌 Q.3(a) Output of Code (Sum of First 10 Natural Numbers) 📊
• **Calculation:** \`range(1, 11)\` sums integers \`1 + 2 + ... + 10 = 55\`.
> **Output:** \`Sum of first 10 natural numbers: 55\``,
      '3b': `### 📌 Q.3(b) (i) Datatypes in Python & (ii) List Loop Output 🐍
• **(i) Datatypes:** **Numeric** (\`int: 53\`, \`float: 3.14\`), **Sequence** (\`str: "ikA"\`, \`list: [1,2,3]\`, \`tuple: (10,20)\`), **Mapping** (\`dict: {"id": 53}\`), **Boolean** (\`bool: True\`).
• **(ii) Output of \`[10, 20, 30, 40, 50]\` Loop:** Prints **10, 20, 30, 40, 50** on separate lines because \`print()\` ends with \`\\n\`.`,
      '4a': `### 📌 Q.4(a) AI Knowledge Cycle and Its 5 Components 🔄🧠
• **1. Perception** (Sensors/Input) ➔ **2. Learning** (Adapting from past data) ➔ **3. Knowledge Representation & Reasoning** (Logical inference) ➔ **4. Planning** (Action sequencing) ➔ **5. Execution** (Acting on environment).`,
      '4b': `### 📌 Q.4(b) Uninformed vs. Informed Search Strategies in AI 🔍🗺️
• **Uninformed (Blind) Search:** No domain heuristic; searches exhaustively. *Examples:* **BFS (Breadth-First Search), DFS (Depth-First Search)**.
• **Informed (Heuristic) Search:** Uses heuristic function **h(n)** to estimate cost to goal, drastically speeding up search. *Examples:* **A* Search, Greedy Best-First Search**.`,
    },
  },
  ds: {
    title: 'Programming in C++ / DSA',
    code: '25CS101',
    file: '/papers/sem1/ds_mt2.jpg',
    intro: '2D Matrices, Loops, Palindrome, Pyramid Patterns & NxN Matrix Multiplication solved in C/C++! 💻⚡',
    q: {
      '1a': `### 📌 Q.1(a) Condition for Diagonal Elements of Square Matrix of Order N 📐
• **Main Diagonal:** Row index equals column index (\`i == j\`).
• **Anti-Diagonal:** Row index plus column index equals \`N - 1\` (\`i + j == N - 1\`).`,
      '1b': `### 📌 Q.1(b) C Program to Print Natural Numbers from 10 to 100 🔢
> \`#include <stdio.h>\`
> \`int main() {\`
> \`    for(int i = 10; i <= 100; i++) printf("%d ", i);\`
> \`    return 0;\`
> \`}\``,
      '1c': `### 📌 Q.1(c) Define a 2-D Array 📊
• **Answer:** An array of arrays stored in contiguous memory representing tabular data in rows and columns (\`arr[row][col]\`).`,
      '1d': `### 📌 Q.1(d) Compare if-else-if Ladder and switch Case ⚖️
• **if-else-if Ladder:** Evaluates ranges (\`>\`, \`<\`), floats, and multi-variable boolean expressions sequentially.
• **switch Case:** Evaluates a single integer/character expression against fixed constants using a fast jump table.`,
      '1e': `### 📌 Q.1(e) Syntax for WHILE Loop 🔄
> \`while (condition) { /* statements */ }\``,
      '2a': `### 📌 Q.2(a) C Program to Check Whether a Number is Palindrome 🔄🔢
> \`#include <stdio.h>\`
> \`int main() {\`
> \`    int n, orig, rev = 0;\`
> \`    scanf("%d", &n); orig = n;\`
> \`    while (n != 0) { rev = rev * 10 + (n % 10); n /= 10; }\`
> \`    printf(orig == rev ? "Palindrome" : "Not Palindrome");\`
> \`    return 0;\`
> \`}\``,
      '2b': `### 📌 Q.2(b) Differentiate Between Break and Continue with Program 🛑⏭️
• **Break:** Terminates the entire loop immediately.
• **Continue:** Skips only the current iteration and jumps to the next loop cycle.
> \`for(int i=1; i<=5; i++) { if(i==2) continue; if(i==4) break; printf("%d ", i); } // Output: 1 3\``,
      '2c': `### 📌 Q.2(c) Differentiate Between while and do-while Loop 🔄
• **while (Entry-Controlled):** Condition checked first; 0 minimum executions if false.
• **do-while (Exit-Controlled):** Body executes first, condition checked at end; guarantees **at least 1 execution**.`,
      '3a': `### 📌 Q.3(a) C++ Program to Print Inverted Pyramid Star Pattern ⭐
> \`#include <iostream>\`
> \`using namespace std;\`
> \`int main() {\`
> \`    int rows = 5;\`
> \`    for(int i = rows; i >= 1; --i) {\`
> \`        for(int s = 0; s < rows - i; ++s) cout << " ";\`
> \`        for(int j = 1; j <= (2 * i - 1); ++j) cout << "*";\`
> \`        cout << endl;\`
> \`    }\`
> \`    return 0;\`
> \`}\``,
      '3b': `### 📌 Q.3(b) C++ Program to Multiply Two Matrices of Order NxN 🧮
> \`for(int i=0; i<N; i++)\`
> \`  for(int j=0; j<N; j++) {\`
> \`    res[i][j] = 0;\`
> \`    for(int k=0; k<N; k++) res[i][j] += mat1[i][k] * mat2[k][j];\`
> \`  }\`
• **Concept:** Uses 3 nested loops (**O(N³)** complexity) computing the dot product of row \`i\` and column \`j\`.`,
      '4a': `### 📌 Q.4(a) Use of default in switch & C++ Calculator Program 🧮
• **default:** Catch-all fallback executed when no \`case\` matches the input operator.
> \`switch(op) { case '+': cout << a+b; break; case '-': cout << a-b; break; case '*': cout << a*b; break; case '/': if(b!=0) cout << a/b; break; default: cout << "Invalid Operator"; }\``,
      '4b': `### 📌 Q.4(b) C++ Program to Print Grades as per Percentage Criteria 🏆
> \`if (M > 90 && M <= 100) cout << "A+";\`
> \`else if (M > 80) cout << "A"; else if (M > 70) cout << "B+";\`
> \`else if (M > 60) cout << "B"; else if (M > 50) cout << "C"; else cout << "F";\``,
    },
  },
  dt: {
    title: 'Design Thinking, Innovation & Entrepreneurship',
    code: '25HU102',
    file: '/papers/sem1/dt_mt2.jpg',
    intro: 'Shadowing, HMW, SCAMPER, Royal Enfield, IDEO Water Pump & GE VScan Case Studies decoded! 💡🚀',
    q: {
      '1a': `### 📌 Q.1(a) Explain Shadowing in Empathy Research 🕵️‍♂️
• **Answer:** Observing users in their natural environment while they perform daily tasks without interfering or asking questions to uncover unarticulated habits and pain points.`,
      '1b': `### 📌 Q.1(b) Three Essential Components of "HMW" (How Might We) Questions 💡
• **1. The Action (Verb)** + **2. The Target User/Subject** + **3. The Desired Impact/Outcome**.`,
      '1c': `### 📌 Q.1(c) Main Aim of Launching BigBasket 🍅🛒
• **Answer:** To eliminate the urban pain point of crowded grocery shopping by delivering fresh fruits, vegetables, and essentials directly to customers' doorsteps.`,
      '1d': `### 📌 Q.1(d) At Which Stage of Design Thinking Does Testing Occur? 🧪
• **Answer:** At the **5th stage** (**Empathize ➔ Define ➔ Ideate ➔ Prototype ➔ Test**), acting as an iterative feedback loop.`,
      '1e': `### 📌 Q.1(e) What is Low-Fidelity Prototyping? 📝
• **Answer:** Creating quick, inexpensive paper sketches, cardboard mockups, or basic wireframes to validate concepts early (*"Fail fast, fail cheap"*).`,
      '2a': `### 📌 Q.2(a) Characteristics of Effective Design Thinking Tools 🛠️
• **User-Centric, Highly Visual, Collaborative, and Iterative** (e.g., Empathy Maps, Journey Maps, Miro/Figma boards).`,
      '2b': `### 📌 Q.2(b) SCAMPER Method in Creative Problem-Solving 🎒⚡
• **S**ubstitute • **C**ombine • **A**dapt • **M**odify/Magnify • **P**ut to another use • **E**liminate • **R**everse/Rearrange.`,
      '2c': `### 📌 Q.2(c) How Low-Fidelity & High-Fidelity Prototyping Complement Each Other 🔄
• **Low-Fi (Paper Sketches):** Fast conceptual & usability validation.
• **High-Fi (Clickable Figma/Code):** Detailed functional, aesthetic, and technical validation.`,
      '3a': `### 📌 Q.3(a) Case Study: How Royal Enfield Became a Worldwide Lifestyle Brand 🏍️🏔️
• Empathized with riders: fixed engine reliability (UCE engine) while doubling down on the signature **"Thump"**, retro nostalgia, and riding communities (**Rider Mania, Himalayan Odyssey**)—shifting from selling bikes to selling a **Biker Lifestyle**.`,
      '3b': `### 📌 Q.3(b) Case Study: IDEO Human-Centered Design (HCD) in Developing the Water Pump 💧🌾
• Observed rural farmers on-site and designed a low-cost, foot-operated **Treadle Pump** using locally repairable bamboo/cycle parts—prioritizing **Affordability, Ergonomics & Local Maintenance**.`,
      '4a': `### 📌 Q.4(a) 5-Stage Design Thinking Model in GE VScan Pocket Ultrasound 🩺📱
• **1. Empathize** (Rural clinics lacked bulky machines) ➔ **2. Define** (Pocket-sized portable ultrasound) ➔ **3. Ideate** (Flip-phone form factor) ➔ **4. Prototype** (Handheld clamshell mockups) ➔ **5. Test** (Refined thumb controls with rural doctors).`,
      '4b': `### 📌 Q.4(b) Convergent vs. Divergent Thinking in Design Thinking 🔀🎯
• **Divergent Thinking ("Raita Phailana"):** Generating many wild, judgment-free ideas during **Ideation**.
• **Convergent Thinking ("Raita Sametna"):** Filtering and narrowing ideas into 1 practical solution during **Define & Test** (The Double Diamond model).`,
    },
  },
  bee: {
    title: 'Basics of Electrical Engineering',
    code: '25EL101',
    file: '/papers/sem1/electrical_mt2.jpg',
    intro: 'Transformers, EMF Derivation, RLC Resonance & AC Parallel Impedance Numericals solved step-by-step! ⚡🔌',
    q: {
      '1a': `### 📌 Q.1(a) Hysteresis Loop Showing Residual & Saturation Points 🧲
• Plot **Magnetizing Force (H)** on X-axis and **Flux Density (B)** on Y-axis (S-shaped closed loop).
• **Saturation Point:** Top-right/bottom-left tips where increasing **H** no longer increases **B**.
• **Residual Magnetism (Retentivity):** Y-axis intercept (**B_r**) where magnetism remains even when **H = 0**.`,
      '1b': `### 📌 Q.1(b) Two Properties of an Ideal Transformer ⚡
• **1. Zero Winding Resistance** (Zero Copper/I²R loss).
• **2. Infinite Core Permeability & Zero Leakage Flux** (100% efficiency).`,
      '1c': `### 📌 Q.1(c) Condition for Maximum Efficiency of Single-Phase Transformer 🏆
• **Iron Losses (Constant Losses, Pᵢ) = Copper Losses (Variable Losses, P꜀ᵤ = I²R)**.`,
      '1d': `### 📌 Q.1(d) Line & Phase Voltage/Current Relations in Delta (Δ) Load 📐
• **Line Voltage = Phase Voltage (V_L = V_Ph)**
• **Line Current = √3 × Phase Current (I_L = 1.732 × I_Ph)**`,
      '1e': `### 📌 Q.1(e) Bandwidth of a Series RLC Circuit 📻
• **BW = f₂ - f₁ = R ÷ (2 × π × L) Hz** (Frequency range between upper and lower half-power points).`,
      '2a': `### 📌 Q.2(a) Derive EMF Equation of Single-Phase Transformer ⚡📝
• Flux goes from **0 to Φₘ** in quarter cycle **dt = 1 ÷ (4f)**.
• **Average EMF per turn** = dΦ ÷ dt = Φₘ ÷ (1/4f) = **4 × f × Φₘ** Volts.
• Multiply by Sine Wave **Form Factor (1.11)** and **N turns**:
> **E₁ = 4.44 × f × N₁ × Φₘ Volts**  |  **E₂ = 4.44 × f × N₂ × Φₘ Volts**`,
      '2b': `### 📌 Q.2(b) Approximate Equivalent Circuit of Transformer Referred to Primary 🔌
• Transfer secondary parameters using Transformation Ratio **K = V₂ ÷ V₁**:
> **R₀₁ = R₁ + R₂' = R₁ + (R₂ ÷ K²)**  |  **X₀₁ = X₁ + X₂' = X₁ + (X₂ ÷ K²)**`,
      '2c': `### 📌 Q.2(c) Analogy Between Magnetic and Electrical Circuits 🧲⚡
• **EMF (Volts) ⟷ MMF (Amp-turns)** | **Current (I) ⟷ Flux (Φ)** | **Resistance (R) ⟷ Reluctance (S)** | **Ohm's Law (I = V/R) ⟷ Rowland's Law (Φ = MMF/S)**.`,
      '3a': `### 📌 Q.3(a) Numerical: 25 kVA, 2000/200V Transformer (Pᵢ = 0.35 kW, P꜀ᵤ = 0.4 kW) 🧮
• **(i) Full Load (x = 1) at 0.8 pf:** Output = \`25 × 0.8 = 20 kW\`, Loss = \`0.35 + 0.40 = 0.75 kW\` ➔ **η = (20 ÷ 20.75) × 100 = 96.38%** ✅
• **(ii) Half Load (x = 0.5) at 0.6 pf:** Output = \`0.5 × 25 × 0.6 = 7.5 kW\`, Loss = \`0.35 + (0.25 × 0.4) = 0.45 kW\` ➔ **η = (7.5 ÷ 7.95) × 100 = 94.34%** ✅`,
      '3b': `### 📌 Q.3(b) Numerical: 20 kVA, 2000/200V Transformer (R₁=3.5Ω, X₁=4.5Ω, R₂=0.015Ω, X₂=0.02Ω) 🧮
• Ratio **K = 200 ÷ 2000 = 0.1** (**K² = 0.01**).
• **(i) Referred to Primary:** **R₂' = 0.015 ÷ 0.01 = 1.5 Ω** ➔ **R₀₁ = 3.5 + 1.5 = 5.0 Ω** ✅; **X₂' = 0.02 ÷ 0.01 = 2.0 Ω** ➔ **X₀₁ = 4.5 + 2.0 = 6.5 Ω**; **Z₀₁ = √(5² + 6.5²) = √67.25 = 8.20 Ω** ✅
• **(ii) Total Copper Loss:** **I₁ = 20000 ÷ 2000 = 10 A** ➔ **P꜀ᵤ = I₁² × R₀₁ = 10² × 5 = 500 W** ✅`,
      '4a': `### 📌 Q.4(a) Numerical: Series RLC (R = 20Ω, L = 100mH, C = 150μF across 230V, 50Hz) 🧮
• **X_L = 2πfL = 31.42 Ω**  |  **X_C = 1 ÷ (2πfC) = 21.22 Ω**
• **(i) Impedance (Z):** √[20² + (31.42 - 21.22)²] = √504.04 = **22.45 Ω** ✅
• **(ii) Current (I):** 230 ÷ 22.45 = **10.24 A** ✅
• **(iii) Power (P):** I² × R = (10.24)² × 20 = **2097.1 W (~2.1 kW)** ✅`,
      '4b': `### 📌 Q.4(b) Numerical: Parallel Impedances Z₁ = (6 - j8)Ω and Z₂ = (16 + j12)Ω across 230V 🧮
• **I₁ = 230 ÷ (6 - j8) = 13.8 + j18.4 A**  |  **I₂ = 230 ÷ (16 + j12) = 9.2 - j6.9 A**
• **(i) Total Current (I):** I₁ + I₂ = \`23 + j11.5 A\` ➔ Magnitude **|I| = √(23² + 11.5²) = 25.71 A** ✅
• **(ii) Power Factor:** ϕ = tan⁻¹(11.5 ÷ 23) = 26.56° ➔ **cos(26.56°) = 0.894 Leading** ✅
• **(iii) Power Consumed:** P = 230 × 25.71 × 0.8944 = **5290 W (5.29 kW)** ✅`,
    },
  },
  electronics: {
    title: 'Basics of Electronics Engineering',
    code: '25EC101',
    file: '/papers/sem1/electronics_mt2.jpg',
    intro: "2's Complement, De Morgan's Law, Universal NAND Gates, POS/SOP K-Maps & MOSFET/CMOS solved! 🔌🧩",
    q: {
      '1a': `### 📌 Q.1(a) Find 2's Complement of Binary Number 101101 🔢
• **1's Complement (Invert bits):** \`010010\`
• **Add 1 to LSB:** \`010010 + 1\` = **\`010011\`** ✅`,
      '1b': `### 📌 Q.1(b) State De Morgan's Theorem 📐
• **Law 1:** **(A · B)' = A' + B'**
• **Law 2:** **(A + B)' = A' · B'**  *("Break the line, change the sign!")*`,
      '1c': `### 📌 Q.1(c) Perform Binary Addition: X = 1010 (10) + Y = 1000 (8) ➕
• \`1010 + 1000\` = **\`10010\`** *(Decimal 18)* ✅`,
      '1d': `### 📌 Q.1(d) What is Pinch-Off Condition in FET? 🤏⚡
• The voltage condition where gate depletion regions expand and meet, pinching the channel so Drain Current (**I_DSS**) saturates and becomes constant.`,
      '1e': `### 📌 Q.1(e) How JFET is Used as a Voltage Variable Resistor (VVR) 🎛️
• In the **Ohmic Region (before pinch-off)**, Drain-Source resistance varies linearly with Gate-to-Source voltage (**V_GS**).`,
      '2a': `### 📌 Q.2(a) Realize NOT, AND, and OR Gates Using Only NAND Gates 🛠️
• **NOT (1 NAND):** Tie both inputs together ➔ **(A·A)' = A'**.
• **AND (2 NANDs):** NAND output fed into NAND-NOT ➔ **((A·B)')' = A·B**.
• **OR (3 NANDs):** Invert A and B with 2 NANDs, feed into 3rd NAND ➔ **(A'·B')' = A + B**.`,
      '2b': `### 📌 Q.2(b) Number Conversions: (i) (73.12)₁₀ to Hex  (ii) (750.6032)₈ to Hex 🧮
• **(i) (73.12)₁₀:** \`73 ÷ 16 = 4 R 9 -> 49\`; \`0.12 × 16 = 1.92 (1), 0.92 × 16 = 14.72 (E), 0.72 × 16 = 11.52 (B)\` ➔ **\`(49.1EB)₁₆\`** ✅
• **(ii) (750.6032)₈:** Binary = \`111 101 000 . 110 000 011 010\` ➔ 4-bit group = \`0001 1110 1000 . 1100 0001 1010\` ➔ **\`(1E8.C1A)₁₆\`** ✅`,
      '2c': `### 📌 Q.2(c) Minterms & Maxterms for Y = (A' + B)(B' + C) 📐
• Expand: **Y = A'B' + A'C + BC**.
• **Minterms (Output = 1):** **Σm(0, 1, 3, 7)** ✅  |  **Maxterms (Output = 0):** **ΠM(2, 4, 5, 6)** ✅`,
      '3a': `### 📌 Q.3(a) K-Map POS Simplification: Y = ΠM(0, 1, 2, 3, 7, 8, 10) · d(5, 6, 11, 15) 🧩
• **Quad 1 (0, 1, 2, 3):** **(A + B)**
• **Quad 2 (3, 7, 11, 15):** **(C' + D')**
• **Corner Quad (0, 2, 8, 10):** **(B + D)**
> **✅ Simplified POS:** **Y = (A + B) · (C' + D') · (B + D)**`,
      '3b': `### 📌 Q.3(b) K-Map SOP Simplification: F(A, B, C, D) = Σm(0, 1, 4, 6, 8, 9, 11, 12, 14) + d(3, 7) 🧩
• **Quad 1 (0, 1, 8, 9):** **B'C'**
• **Quad 2 (4, 6, 12, 14):** **BD'**
• **Quad 3 (1, 3, 9, 11):** **B'D**
> **✅ Simplified SOP:** **F = B'C' + B·D' + B'D**`,
      '4a': `### 📌 Q.4(a) Working of Depletion-Type MOSFET 🔋
• Has a pre-doped physical channel between Source and Drain (**Normally ON at V_GS = 0V**).
• **Depletion Mode (V_GS < 0):** Repels electrons, narrowing channel.
• **Enhancement Mode (V_GS > 0):** Attracts electrons, increasing current above **I_DSS**.`,
      '4b': `### 📌 Q.4(b) Working of CMOS as an Inverter 💻❄️
• Series PMOS (top) + NMOS (bottom).
• **Input LOW (0):** PMOS ON, NMOS OFF ➔ **Output HIGH (1)**.
• **Input HIGH (1):** NMOS ON, PMOS OFF ➔ **Output LOW (0)** (Near-zero static power dissipation!).`,
    },
  },
  evs: {
    title: 'Environment and Sustainability',
    code: '25AS103',
    file: '/papers/sem1/evs_mt2.jpg',
    intro: 'Green vs. Grey Hydrogen, AQI Pollutants, Green Cloud Computing, IoT Farming & ISWM solved! 🌍🌱',
    q: {
      '1a': `### 📌 Q.1(a) How Fossil Fuel Dependency Contributes to Environmental Damage 🏭
• Releases **CO₂ & CH₄** (Global Warming) and **SO₂ & NOₓ** (Acid Rain & Delhi-NCR winter smog), disrupting the natural carbon cycle.`,
      '1b': `### 📌 Q.1(b) Decentralized Energy System ☀️🔋
• Generating electricity locally near consumption points (e.g., **ABES rooftop solar panels**) to cut transmission loss and boost grid resilience.`,
      '1c': `### 📌 Q.1(c) Criteria Pollutants Required to Evaluate AQI 📊💨
• **PM₂.₅, PM₁₀, NO₂, SO₂, CO, Ground-Level Ozone (O₃), and Lead (Pb)**.`,
      '1d': `### 📌 Q.1(d) Sustainability Concerns of Blockchain ⛓️📉
• Proof-of-Work mining consumes massive fossil-fuel electricity and creates heavy **E-waste** from rapidly obsolete ASIC rigs.`,
      '1e': `### 📌 Q.1(e) Deforestation vs. Reforestation 🌲🌱
• **Deforestation:** Permanent clearing of forests for urbanization/mining.
• **Reforestation:** Replanting trees on degraded forest land to restore ecological balance.`,
      '2a': `### 📌 Q.2(a) Green Hydrogen vs. Grey Hydrogen 💧⚡
• **Grey Hydrogen:** Made from natural gas via Steam Methane Reforming (releases heavy **CO₂**).
• **Green Hydrogen:** Made by splitting water (**H₂O**) via **Renewable Electrolysis** (Solar/Wind)—**Zero carbon emissions, only Oxygen byproduct!**`,
      '2b': `### 📌 Q.2(b) How EVs Lower Greenhouse Gas Emissions 🚗⚡
• **Zero tailpipe emissions**, higher well-to-wheel turbine efficiency than petrol engines, and automatic decarbonization as the grid shifts to solar.`,
      '2c': `### 📌 Q.2(c) Large-Scale Biofuel Production & Ecological Trade-Off 🌽⛽
• Creates the **"Food vs. Fuel" dilemma**—diverting fertile land and water from food crops to fuel crops, causing deforestation and food inflation.`,
      '3a': `### 📌 Q.3(a) Cloud Services & Green Computing ☁️💻
• **Virtualization** runs dozens of virtual servers on 1 physical machine (near 100% utilization), slashing idle server power, AC cooling, and E-waste.`,
      '3b': `### 📌 Q.3(b) IoT Sensors in Modern Precision Agriculture 🌾📡
• Real-time **Soil Moisture, pH & NPK sensors** trigger automated drip irrigation only where needed—saving 50%+ water and stopping chemical runoff.`,
      '4a': `### 📌 Q.4(a) How Climate Change Threatens Ecosystem Resilience 🌊🔥
• Warming outpaces evolution, causes severe wildfires, and drives **Ocean Acidification (CO₂ absorption)**—bleaching coral reefs and collapsing marine food webs.`,
      '4b': `### 📌 Q.4(b) How ISWM Ensures Sustainability Compared to SWM ♻️🗑️
• **SWM (Linear):** Mixed trash dumped in toxic landfills.
• **ISWM (Circular 5R):** Segregates **Wet Waste ➔ Biogas/Compost**, **Dry Waste ➔ Recycling**, and sends **<10% inert rejects** to sanitary landfills.`,
    },
  },
  maths: {
    title: 'Fundamentals of Linear Algebra & Statistics',
    code: '25AS102',
    file: '/papers/sem1/maths_mt2.jpg',
    intro: 'Null Space, Range, Rank-Nullity Theorem, Inverse Operator & Change of Basis Matrix solved! 📐🧮',
    q: {
      '1a': `### 📌 Q.1(a) Null Space & Range of T(x₁, x₂) = (x₁ + x₂, x₁) 📐
• **Null Space:** Set \`x₁ + x₂ = 0\` and \`x₁ = 0\` ➔ \`x₂ = 0\`. **Null Space = {(0, 0)}** *(Nullity = 0)*.
• **Range:** \`x₁(1, 1) + x₂(1, 0)\` spans the entire 2D plane ➔ **Range = R²** *(Rank = 2)*.`,
      '1b': `### 📌 Q.1(b) Define Linear Transformation 📏
• A mapping **T: V → W** satisfying **1) Additivity: T(u + v) = T(u) + T(v)** and **2) Homogeneity: T(c·u) = c·T(u)**.`,
      '1c': `### 📌 Q.1(c) Show T: R³ → R² defined by T(x, y, z) = (x - y, y - z) is Singular ⚠️
• Set \`T(x, y, z) = (0, 0)\` ➔ \`x = y = z\`. Non-zero vectors like **(1, 1, 1)** map to **(0, 0)**, so **T is Singular!** ✅`,
      '1d': `### 📌 Q.1(d) Value of k for (1, k, 5) = a(1, 2, 0) + b(0, -1, 1) 🔢
• \`a = 1\`, \`b = 5\` ➔ \`k = 2a - b = 2(1) - 5\` = **\`k = -3\`** ✅`,
      '1e': `### 📌 Q.1(e) Value of 'a' if (1+a, 1-a) and (1-a, 1+a) are Linearly Dependent 🧮
• Determinant = \`(1 + a)² - (1 - a)² = 4a = 0\` ➔ **\`a = 0\`** ✅`,
      '2a': `### 📌 Q.2(a) Show T(x, y) = (2x - y, x - y, -2x) is a Linear Transformation 📐
• Both **T(u + v) = T(u) + T(v)** and **T(c·u) = c·T(u)** hold by expanding coordinates linearly. Hence verified! ✅`,
      '2b': `### 📌 Q.2(b) Show T(x, y, z) = (3x, x - y, 2x + y + z) is Invertible & Find T⁻¹ 🔄
• Determinant of matrix **A** is **-3 ≠ 0** (Invertible).
• Solving \`w₁ = 3x\`, \`w₂ = x - y\`, \`w₃ = 2x + y + z\` gives:
> **✅ T⁻¹(x, y, z) = ( x/3,  x/3 - y,  -x + y + z )**`,
      '2c': `### 📌 Q.2(c) Change of Basis Matrix from B = (1, 1+x, 1+x+x²) to B' = (2+x+x², x+x², x) 📐
• Computing **P_B'←B = Q⁻¹ × P** yields:
> \`[  1/2   1/2   1/2 ]\`
> \`[ -1/2  -1/2   1/2 ]\`
> \`[   0     1     0  ]\``,
      '3a': `### 📌 Q.3(a) State & Verify Rank-Nullity Theorem for T(x, y, z) = (x+2y-z, y+z, x+y-2z) 🏆
• **Theorem:** **Rank(T) + Nullity(T) = dim(V)**.
• Row-reducing matrix **A** leaves **2 non-zero rows (Rank = 2)**.
• Solving \`A·X = 0\` gives \`x = 3z, y = -z\`, spanned by \`(3, -1, 1)\` **(Nullity = 1)**.
• **Verification:** \`Rank (2) + Nullity (1) = 3 = dim(R³)\`. Verified! ✅`,
      '4a': `### 📌 Q.4(a) Show B = {(2, 1, 4), (1, -1, 2), (3, 1, -2)} Forms a Basis of R³ 📐
• Determinant of the 3×3 matrix is **2(0) - 1(-6) + 3(6) = 24 ≠ 0**. Since **Det ≠ 0**, the 3 vectors are linearly independent and form a Basis of R³! ✅`,
    },
  },
  mech: {
    title: 'Basics of Mechanical & Automation Engineering',
    code: '25ME101',
    file: '/papers/sem1/mechanical_mt2.jpg',
    intro: 'Humidity, VCRS Cycle, Window AC, Thermodynamic Systems, pV=3.0 Numerical & 4-Stroke SI Engine solved! ⚙️🚗',
    q: {
      '1a': `### 📌 Q.1(a) Absolute Humidity vs. Relative Humidity ❄️💧
• **Absolute Humidity:** Actual mass of water vapor per unit volume of air (**g/m³**).
• **Relative Humidity (RH):** Ratio (%) of actual moisture in air to the maximum moisture air can hold at that temperature.`,
      '1b': `### 📌 Q.1(b) Thermodynamic State and Process 🌡️
• **State:** Condition of a system at a specific instant defined by **P, V, T**.
• **Process:** Path followed when changing from State 1 to State 2.`,
      '1c': `### 📌 Q.1(c) Reversible Process 🔄
• An ideal process that can be reversed without leaving any net change or friction loss in either the system or surroundings.`,
      '1d': `### 📌 Q.1(d) What is Scavenging? 💨
• Pushing burnt exhaust gases out of an IC engine cylinder using the incoming fresh pressurized air-fuel charge.`,
      '1e': `### 📌 Q.1(e) Purpose of a Spark Plug ⚡🔥
• Produces a high-voltage electric spark at the end of compression to ignite the air-petrol mixture in an SI engine.`,
      '2a': `### 📌 Q.2(a) VCRS (Vapor Compression Refrigeration System) Cycle ❄️🧊
• **1. Compressor** (Low-P vapor ➔ High-P/High-T vapor) ➔ **2. Condenser** (Rejects heat ➔ High-P liquid) ➔ **3. Expansion Valve** (Pressure drop ➔ Chilled mix) ➔ **4. Evaporator** (Absorbs room heat ➔ Vapor).`,
      '2b': `### 📌 Q.2(b) Window Air Conditioner Construction & Working 🌬️🏠
• **Indoor Side:** Evaporator coil, air filter & blower fan cool and dehumidify room air.
• **Outdoor Side (separated by insulated partition):** Compressor, condenser coil & exhaust fan dump heat outside.`,
      '2c': `### 📌 Q.2(c) Open, Closed, and Isolated Thermodynamic Systems 🌍
• **Open:** Both mass & energy cross boundary (Turbine, Pump).
• **Closed:** Only energy crosses, mass is fixed (Sealed cylinder).
• **Isolated:** Neither mass nor energy crosses (Thermo flask, Universe).`,
      '3a': `### 📌 Q.3(a) Numerical: Closed System pV = 3.0 (p₁ = 1.5 bar to p₂ = 7.5 bar) 🧮⚙️
• **V₁ = 3.0 ÷ 1.5 = 2.0 m³**  |  **V₂ = 3.0 ÷ 7.5 = 0.4 m³**  |  **C = 3.0 × 10⁵ J (300 kJ)**.
• **Work Done (W)** = C × ln(V₂ ÷ V₁) = 300 × ln(0.4 ÷ 2.0) = 300 × (-1.6094) = **-482.82 kJ** ✅ *(Work done on the system)*.`,
      '4a': `### 📌 Q.4(a) Working of Four-Stroke SI (Petrol) Engine 🚗🔥
• **1. Suction Stroke** (Inlet open, piston down, draws air-petrol mix) ➔ **2. Compression Stroke** (Both valves closed, piston up, compresses mix) ➔ **3. Power Stroke** (Spark plug fires, explosion drives piston down) ➔ **4. Exhaust Stroke** (Exhaust open, piston up, expels smoke).`,
    },
  },
  physics: {
    title: 'Applied Physics',
    code: '25AS101',
    file: '/papers/sem1/physics_mt2.jpg',
    intro: 'Photodiode Dark Current, GMR, Type-II Vortex, Blue LED Wavelength, Fermi Level Proof, Solar Cell & Meissner Effect! 🔭⚡',
    q: {
      '1a': `### 📌 Q.1(a) Dark Current in a Photodiode 📸🌌
• Small leakage current flowing in reverse bias in complete darkness due to thermally generated minority carriers (**I = I₀(e^(qV/kT) - 1) - I_ph**). Causes low-light camera grain!`,
      '1b': `### 📌 Q.1(b) Built-In Potential of a Semiconductor 🚧
• Internal electric field barrier (**V_bi ≈ 0.7V for Si**) created across the depletion region by immobile ions after majority carrier diffusion.`,
      '1c': `### 📌 Q.1(c) Electron-Hole Pair (EHP) Generation Mechanism ☀️
• When thermal/photon energy **E ≥ E_g** hits the valence band, an electron jumps to the conduction band, leaving behind a positive **Hole** in the valence band.`,
      '1d': `### 📌 Q.1(d) Parallel vs. Antiparallel Orientation in GMR Device 🧲💻
• **Parallel (⇈):** Low spin scattering ➔ **Low Resistance**.
• **Antiparallel (⇅):** High spin scattering ➔ **High Resistance** (Used in HDD read heads).`,
      '1e': `### 📌 Q.1(e) Vortex State in Type-II Superconductor 🌪️🧲
• Mixed state between **H_c1** and **H_c2** where quantized magnetic flux tubes (vortices) penetrate the material while surrounding regions remain 100% superconducting (Used in MRI magnets).`,
      '2a': `### 📌 Q.2(a) Numerical: Drift Velocity v_d = 6.2 m/s under E = 120 V/m. Find Mobility (μ). 🧮
• **μ = v_d ÷ E = 6.2 ÷ 120 = 0.0517 m²/Vs** ✅`,
      '2b': `### 📌 Q.2(b) Numerical: LED with Bandgap E_g = 2.56 eV. Calculate Wavelength (λ). 🔵💡
• **λ = (h × c) ÷ E_g = 1240 eV·nm ÷ 2.56 eV = 484.38 nm** *(Blue-Cyan Visible Light)* ✅`,
      '2c': `### 📌 Q.2(c) Effect of Temperature on Semiconductor Conductivity (σ) 🌡️📈
• At **0 K**, semiconductor is an insulator (**σ = 0**). As **T** increases, covalent bonds break and carrier concentration (**nᵢ**) rises exponentially (**σ = nᵢ·e·(μₑ + μₕ)**), giving an upward exponential curve.`,
      '3a': `### 📌 Q.3(a) Prove Fermi Level Lies Midway in Intrinsic Semiconductor 🏆📐
• In intrinsic semiconductor, **n = p** ➔ **N_c · e^[-(E_c - E_F)/kT] = N_v · e^[-(E_F - E_v)/kT]**.
• Taking **ln** gives: **E_F = [(E_c + E_v) ÷ 2] + [(kT ÷ 2) · ln(N_v ÷ N_c)]**.
• Since **m_h* ≈ m_e***, **N_v ≈ N_c** so **ln(1) = 0** ➔ **E_F = (E_c + E_v) ÷ 2** *(Midway)*! ✅`,
      '3b': `### 📌 Q.3(b) Working of Solar Cell & V-I Characteristics ☀️🔋
• **3 Steps:** **1. Photon EHP Generation** ➔ **2. Depletion Field Separation** ➔ **3. Photovoltage Collection**.
• **V-I Curve:** Drawn in the **4th Quadrant** between **V_oc** (X-axis) and **I_sc** (Y-axis) with shaded **Maximum Power Point (P_max)** knee.`,
      '4a': `### 📌 Q.4(a) Meissner Effect & Proof of Perfect Diamagnetism (χ = -1) 🚄🧲
• **Meissner Effect:** Expulsion of magnetic flux (**B = 0**) below **T_c**.
• **Proof:** **B = μ₀(H + M) = 0 ➔ M = -H**. Susceptibility **χ = M ÷ H = -H ÷ H = -1** *(Perfect Diamagnetism)*! ✅`,
      '4b': `### 📌 Q.4(b) Superconductivity & Numerical: Find T when H_c(T) = (2/3)H_c(0) for T_c = 4K 🧮❄️
• **Tuyn's Law:** **H_c(T) = H_c(0) × [1 - (T ÷ T_c)²]**
• \`2/3 = 1 - (T ÷ 4)² ➔ (T ÷ 4)² = 1/3 ➔ T = 4 ÷ √3 = 4 ÷ 1.732\` = **2.31 K** ✅`,
    },
  },
  softskills: {
    title: 'Soft Skills',
    code: '25HU101',
    file: '/papers/sem1/softskills_mt2.jpg',
    intro: 'Extempore, Paralinguistics, Intonation, TED Talks, Eye Contact, Pace vs. Pause & Speaking Modes! 🗣️🎤',
    q: {
      '1a': `### 📌 Q.1(a) Define Extempore 🎤
• Delivering a speech spontaneously without prior memorization or script, given a topic moments before stepping on stage.`,
      '1b': `### 📌 Q.1(b) Explain Para-Linguistics 🎵
• Vocal elements of non-verbal communication (*how* something is said): **Pitch, Volume, Pace, Pauses, and Tone**.`,
      '1c': `### 📌 Q.1(c) Define Intonation 📈📉
• The rise and fall of voice pitch during speech, which changes a statement into a question or conveys emotion.`,
      '1d': `### 📌 Q.1(d) Define TED Talk 💡
• A curated, storytelling-based presentation under 18 minutes focused on *"Ideas Worth Spreading"*.`,
      '1e': `### 📌 Q.1(e) What Does the Acronym TED Stand For? 🔤
• **Technology, Entertainment, Design**.`,
      '2a': `### 📌 Q.2(a) Role of Eye Contact in Speaker-Audience Connection 👀
• Builds trust, creates 1-on-1 personal engagement, projects confidence/honesty, and provides live visual feedback from listeners.`,
      '2b': `### 📌 Q.2(b) Two Non-Verbal Features That Project Confidence 🧍‍♂️👐
• **1. Upright & Open Posture (Kinesics)** and **2. Controlled, Purposeful Hand Gestures** (zero nervous fidgeting).`,
      '2c': `### 📌 Q.2(c) Formal vs. Informal Speaking 👔☕
• **Formal:** Structured, professional vocabulary, strict etiquette (Interviews, Boardrooms).
• **Informal:** Casual, spontaneous, uses idioms/slang (Chatting with friends at campus canteen).`,
      '3a': `### 📌 Q.3(a) Compare Pace and Pause in Para-Linguistics ⏱️🎙️
• **Pace (Speed):** Controls energy (fast = excitement/urgency; slow = authority/clarity).
• **Pause (Silence):** Builds suspense before a punchline/key point and lets the audience digest complex ideas.`,
      '3b': `### 📌 Q.3(b) Three Types of Speaking Modes with Examples 🗣️📺
• **1. Impromptu** (Unprepared on-the-spot answer in class).
• **2. Extemporaneous** (Planned outline, natural delivery like a Steve Jobs keynote).
• **3. Manuscript** (Word-for-word reading from a teleprompter like a TV News Anchor).`,
      '4a': `### 📌 Q.4(a) How TED Talks Help Spread New Ideas & Innovations 🌍💡
• Democratizes complex research into 18-minute relatable stories distributed globally for free, sparking cross-disciplinary innovation.`,
      '4b': `### 📌 Q.4(b) How Gestures & Facial Expressions Make TED Talks Appealing 🎭✨
• Hand gestures act as visual highlighters for abstract concepts, while facial expressions trigger emotional mirroring in the audience.`,
    },
  },
};

function getAllSolvedMT2Reply(rawQuery: string): { text: string; nextSugg: string } | null {
  const q = rawQuery.toLowerCase().trim();

  // Direct Topic Shortcuts across all 10 subjects
  if (q.includes('propositional') || q.includes('predicate logic')) return { text: MT2_MASTER_VAULT.ai.q['1d'], nextSugg: 'Solve full AI MT2 paper' };
  if (q.includes('knowledge cycle')) return { text: MT2_MASTER_VAULT.ai.q['4a'], nextSugg: 'Solve full AI MT2 paper' };
  if (q.includes('uninformed') || q.includes('informed search')) return { text: MT2_MASTER_VAULT.ai.q['4b'], nextSugg: 'Solve full AI MT2 paper' };
  if (q.includes('palindrome')) return { text: MT2_MASTER_VAULT.ds.q['2a'], nextSugg: 'Solve full C++ MT2 paper' };
  if (q.includes('break') && q.includes('continue')) return { text: MT2_MASTER_VAULT.ds.q['2b'], nextSugg: 'Solve full C++ MT2 paper' };
  if (q.includes('shadowing')) return { text: MT2_MASTER_VAULT.dt.q['1a'], nextSugg: 'Solve full DT MT2 paper' };
  if (q.includes('scamper')) return { text: MT2_MASTER_VAULT.dt.q['2b'], nextSugg: 'Solve full DT MT2 paper' };
  if (q.includes('royal enfield')) return { text: MT2_MASTER_VAULT.dt.q['3a'], nextSugg: 'Solve full DT MT2 paper' };
  if (q.includes('vscan') || q.includes('ideo')) return { text: `${MT2_MASTER_VAULT.dt.q['3b']}\n\n---\n\n${MT2_MASTER_VAULT.dt.q['4a']}`, nextSugg: 'Solve full DT MT2 paper' };
  if (q.includes('hysteresis')) return { text: MT2_MASTER_VAULT.bee.q['1a'], nextSugg: 'Solve full Electrical MT2 paper' };
  if (q.includes('emf equation')) return { text: MT2_MASTER_VAULT.bee.q['2a'], nextSugg: 'Solve full Electrical MT2 paper' };
  if (q.includes("2's complement") || q.includes('101101')) return { text: MT2_MASTER_VAULT.electronics.q['1a'], nextSugg: 'Solve full Electronics MT2 paper' };
  if (q.includes('de morgan')) return { text: MT2_MASTER_VAULT.electronics.q['1b'], nextSugg: 'Solve full Electronics MT2 paper' };
  if (q.includes('k-map') || q.includes('kmap')) return { text: `${MT2_MASTER_VAULT.electronics.q['3a']}\n\n---\n\n${MT2_MASTER_VAULT.electronics.q['3b']}`, nextSugg: 'Solve full Electronics MT2 paper' };
  if (q.includes('cmos')) return { text: MT2_MASTER_VAULT.electronics.q['4b'], nextSugg: 'Solve full Electronics MT2 paper' };
  if (q.includes('green hydrogen') || q.includes('grey hydrogen')) return { text: MT2_MASTER_VAULT.evs.q['2a'], nextSugg: 'Solve full EVS MT2 paper' };
  if (q.includes('iswm')) return { text: MT2_MASTER_VAULT.evs.q['4b'], nextSugg: 'Solve full EVS MT2 paper' };
  if (q.includes('rank nullity') || q.includes('rank-nullity')) return { text: MT2_MASTER_VAULT.maths.q['3a'], nextSugg: 'Solve full Maths MT2 paper' };
  if (q.includes('vcrs')) return { text: MT2_MASTER_VAULT.mech.q['2a'], nextSugg: 'Solve full Mechanical MT2 paper' };
  if (q.includes('scavenging')) return { text: MT2_MASTER_VAULT.mech.q['1d'], nextSugg: 'Solve full Mechanical MT2 paper' };
  if (q.includes('dark current')) return { text: MT2_MASTER_VAULT.physics.q['1a'], nextSugg: 'Solve full Physics MT2 paper' };
  if (q.includes('meissner')) return { text: MT2_MASTER_VAULT.physics.q['4a'], nextSugg: 'Solve full Physics MT2 paper' };
  if (q.includes('fermi level')) return { text: MT2_MASTER_VAULT.physics.q['3a'], nextSugg: 'Solve full Physics MT2 paper' };
  if (q.includes('extempore') || q.includes('paralinguistic') || q.includes('intonation')) return { text: `${MT2_MASTER_VAULT.softskills.q['1a']}\n\n---\n\n${MT2_MASTER_VAULT.softskills.q['1b']}\n\n---\n\n${MT2_MASTER_VAULT.softskills.q['1c']}`, nextSugg: 'Solve full Soft Skills MT2 paper' };

  // Identify which subject is being asked
  let subjKey = '';
  if (q.includes('25ai101') || /\bai\b/.test(q) || q.includes('python')) subjKey = 'ai';
  else if (q.includes('25cs101') || q.includes('c++') || q.includes('cpp') || q.includes('dsa')) subjKey = 'ds';
  else if (q.includes('25hu102') || q.includes('design thinking') || /\bdt\b/.test(q)) subjKey = 'dt';
  else if (q.includes('25el101') || q.includes('electrical') || /\bbee\b/.test(q)) subjKey = 'bee';
  else if (q.includes('25ec101') || q.includes('electronics') || /\bbec\b/.test(q) || /\bece\b/.test(q)) subjKey = 'electronics';
  else if (q.includes('25as103') || q.includes('evs') || q.includes('environment')) subjKey = 'evs';
  else if (q.includes('25as102') || q.includes('math') || q.includes('flas') || q.includes('linear algebra')) subjKey = 'maths';
  else if (q.includes('25me101') || q.includes('mech')) subjKey = 'mech';
  else if (q.includes('25as101') || q.includes('physics') || q.includes('phy')) subjKey = 'physics';
  else if (q.includes('25hu101') || q.includes('soft skill') || q.includes('softskill')) subjKey = 'softskills';

  const isSolutionIntent =
    q.includes('solve') || q.includes('solution') || q.includes('answer') || q.includes('ans') ||
    q.includes('section') || /q\.?\s*[1-4]/i.test(q) || /question\s*[1-4]/i.test(q) || /\b[1-4]\s*\(\s*[a-e]\s*\)/i.test(q);

  if (!subjKey || !isSolutionIntent) return null;

  const vault = MT2_MASTER_VAULT[subjKey];
  const qMap = vault.q;

  // Sub-question check (e.g. Q1(a), 2(b), 3(a), 4(b))
  const subMatch = q.match(/([1-4])\s*\(?\s*([a-e])\s*\)?/i);
  if (subMatch) {
    const key = `${subMatch[1]}${subMatch[2].toLowerCase()}`;
    if (qMap[key]) {
      return { text: `### 🏆 ${vault.title} (${vault.code}) — MT-2 Solution\n\n${qMap[key]}`, nextSugg: `Solve full ${vault.title} MT2 paper` };
    }
  }

  // Section or Main Question check (Section A / Q.1, Section B / Q.2, Q.3, Q.4, Section C)
  if (q.includes('section a') || /q\.?\s*1\b/.test(q) || /question\s*1\b/.test(q)) {
    const list = ['1a', '1b', '1c', '1d', '1e'].map((k) => qMap[k]).filter(Boolean).join('\n\n---\n\n');
    return { text: `### 🟢 ${vault.title} (${vault.code}) — MT-2 SECTION-A (All Q.1 Solutions)\n\n${list}`, nextSugg: `${vault.title} MT2 Section B` };
  }
  if (q.includes('section b') || /q\.?\s*2\b/.test(q) || /question\s*2\b/.test(q)) {
    const list = ['2a', '2b', '2c'].map((k) => qMap[k]).filter(Boolean).join('\n\n---\n\n');
    return { text: `### 🟡 ${vault.title} (${vault.code}) — MT-2 SECTION-B (All Q.2 Solutions)\n\n${list}`, nextSugg: `${vault.title} MT2 Section C` };
  }
  if (/q\.?\s*3\b/.test(q) || /question\s*3\b/.test(q)) {
    const list = ['3a', '3b'].map((k) => qMap[k]).filter(Boolean).join('\n\n---\n\n');
    return { text: `### 🔴 ${vault.title} (${vault.code}) — MT-2 Question 3 Complete Solution\n\n${list}`, nextSugg: `${vault.title} MT2 Q.4` };
  }
  if (/q\.?\s*4\b/.test(q) || /question\s*4\b/.test(q)) {
    const list = ['4a', '4b'].map((k) => qMap[k]).filter(Boolean).join('\n\n---\n\n');
    return { text: `### 🔴 ${vault.title} (${vault.code}) — MT-2 Question 4 Complete Solution\n\n${list}`, nextSugg: `Solve full ${vault.title} MT2 paper` };
  }
  if (q.includes('section c')) {
    const list = ['3a', '3b', '4a', '4b'].map((k) => qMap[k]).filter(Boolean).join('\n\n---\n\n');
    return { text: `### 🔴 ${vault.title} (${vault.code}) — MT-2 SECTION-C (Q.3 & Q.4 Solutions)\n\n${list}`, nextSugg: `Solve full ${vault.title} MT2 paper` };
  }

  // Default: Return Entire Solved Paper
  const allQs = Object.values(qMap).join('\n\n---\n\n');
  return {
    text: `### 🏆 ${vault.title.toUpperCase()} (${vault.code}) — COMPLETE MT-2 SOLVED ANSWER KEY\n> *"${vault.intro}"*\n\n[DOWNLOAD_PAPER|${vault.title} (${vault.code}) - MT 2 Question Paper|${vault.file}]\n\n${allQs}\n\n> 💡 **Tip:** Ask for any specific question like *"${vault.title} MT2 Q.1"*, *"Q.2(b)"*, or *"Section C"*!`,
    nextSugg: 'Show all faculty',
  };
}

// ============================================================================
// HORROR AUDIO STINGER ENGINE (3x BELL=11s, 3x LAUGH=21s, 1x THUNDER=20s)
// ============================================================================
function playHorrorAudioStinger(type: string) {
  try {
    const fileMap: Record<string, string> = {
      ryuk_laugh: '/ryuk_laugh.mp3',
      bell: '/death_note_bell.mp3',
      thunder: '/thunder.mp3',
    };
    const fileUrl = fileMap[type] || '/ryuk_laugh.mp3';
    const audio = new Audio(fileUrl);
    audio.volume = 1.0;

    let playCount = 0;
    const maxPlays = type === 'bell' ? 3 : type === 'ryuk_laugh' ? 3 : 1;

    audio.onended = () => {
      playCount++;
      if (playCount < maxPlays) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    audio.play().catch(() => {});

    const cutoffMs = type === 'bell' ? 11000 : type === 'ryuk_laugh' ? 21000 : 20000;
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, cutoffMs);
  } catch {}

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type === 'bell' ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(type === 'bell' ? 146.8 : 65, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 2.5);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.7);
  } catch {}
}

function PaperDownloadCard({ title, filesCsv }: { title: string; filesCsv: string }) {
  const [showPreview, setShowPreview] = useState(false);
  const files = filesCsv.split(',').map((f) => f.trim()).filter(Boolean);
  const handleDownloadAll = () => {
    files.forEach((fileUrl, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop() || `paper_${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });
  };
  return (
    <div className="my-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-red-500/40 transition shadow-lg overflow-hidden max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-xs flex-shrink-0">
            {files.length > 1 ? `${files.length}P` : 'IMG'}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <p className="text-xs text-gray-400">Official Autonomous Paper • {files.length} {files.length > 1 ? 'Pages' : 'Page'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition border border-white/10 cursor-pointer">
            {showPreview ? '🙈 Hide' : '👁️ View'}
          </button>
          <button onClick={handleDownloadAll} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition shadow-md cursor-pointer">
            <span>📥</span> Download
          </button>
        </div>
      </div>
      {showPreview && (
        <div className="p-3 bg-black/60 space-y-3">
          {files.map((fileUrl, idx) => (
            <div key={idx} className="space-y-1">
              {files.length > 1 && <span className="text-[11px] text-gray-400 font-medium">Page {idx + 1} of {files.length}</span>}
              <img src={fileUrl} alt={`${title} - Page ${idx + 1}`} className="w-full rounded-xl border border-white/10" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormattedMessage({ text, onSelectSuggestion, isAgrima }: { text: string; onSelectSuggestion?: (query: string) => void; isAgrima?: boolean }) {
  const lines = text.split('\n');
  const formatInline = (line: string) => {
    const parts = line.split(/(!?\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, idx) => {
      const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        return (
          <span key={idx} className="inline-block my-2 max-w-[200px] rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black/40 align-middle">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto object-cover" />
          </span>
        );
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) return <a key={idx} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300 font-medium">{linkMatch[1]} ↗</a>;
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={idx} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*')) return <em key={idx} className="text-gray-300 italic">{part.slice(1, -1)}</em>;
      return part;
    });
  };

  return (
    <div className="space-y-3 text-[14px] leading-relaxed">
      {lines.map((line, i) => {
        const imageMatches = Array.from(line.matchAll(/!\[(.*?)\]\((.*?)\)/g));
        if (imageMatches.length > 0) {
          return (
            <div key={i} className="my-3 flex flex-wrap gap-3 items-center">
              {imageMatches.map((img, imgIdx) => (
                <div key={imgIdx} className="w-36 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black/40 flex-shrink-0">
                  <img src={img[2]} alt={img[1]} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          );
        }
        const suggestionMatch = line.match(/^\[SUGGESTIONS\|(.*)\|(.*)\]$/);
        if (suggestionMatch && onSelectSuggestion) {
          return (
            <div key={i} className="pt-3 pb-1 flex flex-wrap gap-2.5 items-center">
              <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">✨ Agla topic:</span>
              <button onClick={() => onSelectSuggestion(suggestionMatch[1])} className="px-3.5 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 transition shadow-sm hover:scale-105 cursor-pointer">
                👉 {suggestionMatch[1]}
              </button>
              <button onClick={() => onSelectSuggestion(suggestionMatch[2])} className="px-3.5 py-1.5 rounded-full bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition shadow-sm hover:scale-105 cursor-pointer">
                🔥 {suggestionMatch[2]}
              </button>
            </div>
          );
        }
        const paperMatch = line.match(/^\[DOWNLOAD_PAPER\|(.*)\|(.*)\]$/);
        if (paperMatch) return <PaperDownloadCard key={i} title={paperMatch[1]} filesCsv={paperMatch[2]} />;
        if (line.trim() === '---') return <hr key={i} className="border-white/10 my-4" />;
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-white pt-2 pb-1">{formatInline(line.replace('### ', ''))}</h3>;
        if (line.startsWith('> ')) return <div key={i} className="border-l-4 border-red-500 bg-red-950/30 px-4 py-3 rounded-xl text-red-100 my-2">{formatInline(line.replace('> ', ''))}</div>;
        if (line.startsWith('• ')) return <div key={i} className="flex items-start gap-2 pl-2"><span className="text-red-400 mt-1">•</span><span className="flex-1">{formatInline(line.replace('• ', ''))}</span></div>;
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return <p key={i}>{formatInline(line)}</p>;
      })}
      {isAgrima && (
        <div className="pt-2 text-right">
          <span className="text-[9px] text-pink-300/75 font-mono tracking-widest italic select-none">ikA | Aki</span>
        </div>
      )}
    </div>
  );
}
const MARKETPLACE_STORAGE_KEY = 'campus_global_marketplace_v6';
const DEATHNOTE_BANS_KEY = 'campus_deathnote_bans_v2';
const BOSS_BROADCAST_KEY = 'campus_boss_broadcast_v2';
const LIVE_RADAR_STORAGE_KEY = 'campus_shinigami_radar_v3';
const LIVE_EFFECTS_STORAGE_KEY = 'campus_shinigami_effects_v3';

export default function CampusAIChat() {
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [currentWindow, setCurrentWindow] = useState<WindowView>('home');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<'both' | 'mt1' | 'mt2'>('both');
  const [paperSearch, setPaperSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(DEFAULT_MARKETPLACE);
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellTitle, setSellTitle] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellContact, setSellContact] = useState('');

  // SHINIGAMI EYES STATES (ALL POWERS)
  const [bannedList, setBannedList] = useState<BannedEntry[]>([]);
  const [banInputTarget, setBanInputTarget] = useState('');
  const [banInputReason, setBanInputReason] = useState('Eliminated by Sovereign Decree of Boss ikA');
  const [blockAllAtOnce, setBlockAllAtOnce] = useState<boolean>(false);
  const [stealthCloak, setStealthCloak] = useState<boolean>(false);
  const [sovereignBroadcast, setSovereignBroadcast] = useState<string>('');
  const [broadcastInput, setBroadcastInput] = useState<string>('');
  const [activeStudentsRoster, setActiveStudentsRoster] = useState<ActiveStudent[]>([]);
  const [isRealmFrozenByBoss, setIsRealmFrozenByBoss] = useState<boolean>(false);

  // HORROR STINGER VISUAL STATE ('ryuk_laugh' | 'bell' | 'thunder' | null)
  const [activeHorrorEvent, setActiveHorrorEvent] = useState<HorrorStingerType>(null);
  const [ryukDiffusing, setRyukDiffusing] = useState<boolean>(false);

  // Puppet Master AI Interception States
  const [pendingIntercepts, setPendingIntercepts] = useState<PendingIntercept[]>([]);
  const [puppetReplyInputs, setPuppetReplyInputs] = useState<Record<string, string>>({});
  const [puppetTargets, setPuppetTargets] = useState<Record<string, boolean>>({});

  // Target Student Effects (Heart Attack Timer, Gaslight 500 Panic, Void Evaporation Curse, Cursed Spoof)
  const [myHeartAttackTimer, setMyHeartAttackTimer] = useState<{ remainingSeconds: number; reason: string } | null>(null);
  const [myGaslight500, setMyGaslight500] = useState<boolean>(false);
  const [panicProgress, setPanicProgress] = useState<number>(0);
  const [error500Stage, setError500Stage] = useState<'idle' | 'breach' | 'haunted'>('idle');
  const [myEvaporateCurse, setMyEvaporateCurse] = useState<boolean>(false);
  const [evaporateTargets, setEvaporateTargets] = useState<Record<string, boolean>>({});
  const [evaporationStage, setEvaporationStage] = useState<'none' | 'dissolving' | 'void'>('none');
  const [myCursedSpoof, setMyCursedSpoof] = useState<CursedSpoofState | null>(null);

  // 2-WAY DIRECT SHINIGAMI CHAT (Boss ikA <-> Student)
  const [directChatMessages, setDirectChatMessages] = useState<DirectChatMessage[]>([]);
  const [selectedDirectTarget, setSelectedDirectTarget] = useState<string>('');
  const [selectedDirectName, setSelectedDirectName] = useState<string>('');
  const [directChatInput, setDirectChatInput] = useState<string>('');
  const [studentReplyInput, setStudentReplyInput] = useState<string>('');
  const [isStudentWhisperBoxOpen, setIsStudentWhisperBoxOpen] = useState<boolean>(true);

  const [showSakuraPetals, setShowSakuraPetals] = useState<boolean>(true);

  // SGPA PREDICTOR STATE
  const [mt1Score, setMt1Score] = useState<number>(12);
  const [mt2Score, setMt2Score] = useState<number>(12);
  const [taScore, setTaScore] = useState<number>(25);
  const [endSemScore, setEndSemScore] = useState<number>(30);

  const [overviewBossWhisper, setOverviewBossWhisper] = useState('');

  // Faculty Photo Toggle States
  const [prernaPhotoTab, setPrernaPhotoTab] = useState<'profile' | 'radiant'>('profile');
  const [divyanshiPhotoTab, setDivyanshiPhotoTab] = useState<'profile' | 'desk'>('profile');
  const [vimalPhotoTab, setVimalPhotoTab] = useState<'formal' | 'chill'>('formal');
  const [shailjaPhotoTab, setShailjaPhotoTab] = useState<'campus' | 'aesthetic'>('campus');

  // Safe Bunk Calculator State
  const [totalClasses, setTotalClasses] = useState<number>(40);
  const [attendedClasses, setAttendedClasses] = useState<number>(32);

  // Ticker State
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerItems = [
    '🎉 Current: Diwali Holidays (Nov 6 - Nov 13)',
    '⏳ Upcoming: MT-2 Exams (Nov 30 - Dec 4)',
    '🏁 Future: End Sem Exams (Jan 4, 2027)',
    '✅ Completed: MT-1 Exams (Oct 16)',
  ];

  const [currentClassInfo, setCurrentClassInfo] = useState({ status: 'Live', text: 'Loading schedule...', room: '' });
  const [countdowns, setCountdowns] = useState({ mt2: 0, pue: 0, endSem: 0 });
  const [bossIntroTime, setBossIntroTime] = useState(0);
  const [isWhiteFlashing, setIsWhiteFlashing] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const jokeCursorRef = useRef<number>(0);
  const usedSuggestionsRef = useRef<string[]>([]);
  const autoTypedSessionsRef = useRef<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const studentChatContainerRef = useRef<HTMLDivElement>(null);
  const bossChatContainerRef = useRef<HTMLDivElement>(null);
  const latestInputRef = useRef<string>('');
  const lastStingerTimestampRef = useRef<number>(0);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const isAgrima = currentUser?.admissionNo === '2026B01010219';

  // SECRET DUAL-IDENTITY CHECK ('1402akshit...' -> Boss ikA | 'akshit...' -> Normal Student Akshit Singh)
  const isBoss = useMemo(() => {
    if (!currentUser?.email) return false;
    return currentUser.email.toLowerCase().trim().startsWith('1402akshit');
  }, [currentUser]);

  const isNormalAkshit = useMemo(() => {
    return !isBoss && currentUser?.admissionNo === '2026B01010274';
  }, [currentUser, isBoss]);

  // Helper to smoothly scroll ONLY the internal chat box without pulling the main window
  const scrollChatToBottom = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;
    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }, 50);
  }, []);

  useEffect(() => {
    scrollChatToBottom(studentChatContainerRef.current);
    scrollChatToBottom(bossChatContainerRef.current);
  }, [directChatMessages.length, selectedDirectTarget, isStudentWhisperBoxOpen, scrollChatToBottom]);

  // Trigger Full Horror Visual + Audio Sequence (21s Ryuk Laugh / 11s Death Bell / 20s Thunder Storm)
  const launchHorrorExperience = useCallback((stingerType: 'ryuk_laugh' | 'bell' | 'thunder') => {
    playHorrorAudioStinger(stingerType);
    setRyukDiffusing(false);
    setActiveHorrorEvent(stingerType);

    if (stingerType === 'ryuk_laugh') {
      setTimeout(() => setRyukDiffusing(true), 18000);
      setTimeout(() => {
        setActiveHorrorEvent(null);
        setRyukDiffusing(false);
      }, 21000);
    } else if (stingerType === 'bell') {
      setTimeout(() => {
        setActiveHorrorEvent(null);
      }, 11000);
    } else if (stingerType === 'thunder') {
      setTimeout(() => {
        setActiveHorrorEvent(null);
      }, 20000);
    }
  }, []);

  const triggerMovieWhiteFlash = useCallback(() => {
    setIsWhiteFlashing(true);
    const timeout = setTimeout(() => setIsWhiteFlashing(false), 850);
    return () => clearTimeout(timeout);
  }, []);

  const syncMarketplaceFromStorage = useCallback(() => {
    try {
      const savedMarket = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
      if (savedMarket) {
        const parsedM: MarketplaceItem[] = JSON.parse(savedMarket);
        if (Array.isArray(parsedM) && parsedM.length > 0) {
          setMarketplaceItems(parsedM);
          return parsedM;
        }
      } else {
        localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(DEFAULT_MARKETPLACE));
      }
    } catch {}
    return DEFAULT_MARKETPLACE;
  }, []);

  const syncBansAndBroadcast = useCallback(() => {
    try {
      const savedBans = localStorage.getItem(DEATHNOTE_BANS_KEY);
      if (savedBans) {
        const parsedB: BannedEntry[] = JSON.parse(savedBans);
        if (Array.isArray(parsedB)) setBannedList(parsedB);
      }
      const savedBroadcast = localStorage.getItem(BOSS_BROADCAST_KEY);
      if (savedBroadcast !== null) setSovereignBroadcast(savedBroadcast);
    } catch {}
  }, []);

  // Broadcast instant cross-tab command so effects work 100% even across browser tabs in Turbopack
  const broadcastLocalEffect = useCallback((payload: Record<string, any>) => {
    try {
      const eventObj = { ...payload, ts: Date.now() };
      localStorage.setItem(LIVE_EFFECTS_STORAGE_KEY, JSON.stringify(eventObj));
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('shinigami_matrix_bus');
        bc.postMessage(eventObj);
        bc.close();
      }
    } catch {}
  }, []);

  // Listen for instant cross-tab Shinigami commands
  useEffect(() => {
    const handleIncomingEffect = (data: any) => {
      if (!data || isBoss) return;
      const myAdm = (currentUser?.admissionNo || '').toUpperCase().trim();
      const isTargeted = data.target === 'ALL' || (myAdm && data.target === myAdm);
      if (!isTargeted) return;

      if (data.type === 'STINGER' && data.sound) {
        if (Date.now() - lastStingerTimestampRef.current > 1500) {
          lastStingerTimestampRef.current = Date.now();
          launchHorrorExperience(data.sound);
        }
      } else if (data.type === 'GASLIGHT_500') {
        setMyGaslight500((prev) => (typeof data.value === 'boolean' ? data.value : !prev));
      } else if (data.type === 'EVAPORATE') {
        setMyEvaporateCurse((prev) => (typeof data.value === 'boolean' ? data.value : !prev));
      } else if (data.type === 'FREEZE') {
        setIsRealmFrozenByBoss(!!data.value);
      } else if (data.type === 'BLOCK_ALL') {
        setBlockAllAtOnce(!!data.value);
      } else if (data.type === 'FORCE_INTRO') {
        triggerMovieWhiteFlash();
        setBossIntroTime(0);
        setCurrentWindow('boss_intro');
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === LIVE_EFFECTS_STORAGE_KEY && e.newValue) {
        try {
          handleIncomingEffect(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('shinigami_matrix_bus');
      bc.onmessage = (ev) => handleIncomingEffect(ev.data);
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, [currentUser, isBoss, launchHorrorExperience, triggerMovieWhiteFlash]);

  // REAL-TIME AUTO-SYNC ENGINE (Merges Server Matrix + Local Browser Radar)
  const syncWithServer = useCallback(async (newItem?: MarketplaceItem) => {
    try {
      let activeUser = currentUser;
      if (!activeUser && typeof window !== 'undefined') {
        const tabSaved = sessionStorage.getItem('campus_tab_user') || localStorage.getItem('campus_user');
        if (tabSaved) {
          try {
            activeUser = JSON.parse(tabSaved);
          } catch {}
        }
      }

      // 1. Update Local Shared Radar (Guarantees multi-tab & Turbopack visibility)
      let localRadarMap: Record<string, ActiveStudent> = {};
      if (typeof window !== 'undefined') {
        try {
          const rawRadar = localStorage.getItem(LIVE_RADAR_STORAGE_KEY);
          if (rawRadar) localRadarMap = JSON.parse(rawRadar);
        } catch {}

        if (activeUser) {
          const uEmail = (activeUser.email || '').toLowerCase().trim();
          const uIsBoss = uEmail.startsWith('1402akshit');
          const uKey = uIsBoss ? 'BOSS_IKA_1402' : (activeUser.admissionNo || uEmail || activeUser.name).toUpperCase().trim();
          localRadarMap[uKey] = {
            admissionNo: (activeUser.admissionNo || uKey).toUpperCase().trim(),
            name: uIsBoss ? '👑 Boss ikA (You)' : activeUser.name,
            rollNo: activeUser.rollNo,
            group: activeUser.group || 'CSE-2',
            email: activeUser.email,
            currentWindow,
            lastQuery: localRadarMap[uKey]?.lastQuery || 'Active on Portal',
            draftKeystrokes: latestInputRef.current,
            isOnline: true,
            lastSeen: Date.now(),
          };
          localStorage.setItem(LIVE_RADAR_STORAGE_KEY, JSON.stringify(localRadarMap));
        }
      }

      // 2. Sync with Backend API
      const res = await fetch('/api/chat', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: newItem ? 'ADD_MARKETPLACE_ITEM' : 'GET_SYNC_DATA',
          item: newItem,
          user: activeUser,
          currentWindow,
          draftKeystrokes: latestInputRef.current,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.marketplace)) {
          setMarketplaceItems(data.marketplace);
          localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(data.marketplace));
        }
        if (typeof data.broadcast === 'string') {
          setSovereignBroadcast(data.broadcast);
          localStorage.setItem(BOSS_BROADCAST_KEY, data.broadcast);
        }
        if (Array.isArray(data.bans)) {
          setBannedList(data.bans);
          localStorage.setItem(DEATHNOTE_BANS_KEY, JSON.stringify(data.bans));
        }
        if (typeof data.blockAllAtOnce === 'boolean') setBlockAllAtOnce(data.blockAllAtOnce);
        if (typeof data.stealthCloak === 'boolean') setStealthCloak(data.stealthCloak);

        // Merge Server Active Users + Local Radar Users so no online student is ever missed
        const mergedMap: Record<string, ActiveStudent> = {};
        const now = Date.now();
        Object.values(localRadarMap).forEach((st) => {
          mergedMap[st.admissionNo] = {
            ...st,
            isOnline: now - st.lastSeen < 45000,
          };
        });
        if (Array.isArray(data.activeUsers)) {
          data.activeUsers.forEach((st: ActiveStudent) => {
            mergedMap[st.admissionNo] = {
              ...mergedMap[st.admissionNo],
              ...st,
              isOnline: st.isOnline || (now - st.lastSeen < 45000),
            };
          });
        }
        const mergedRoster = Object.values(mergedMap).sort(
          (a, b) => Number(b.isOnline) - Number(a.isOnline) || b.lastSeen - a.lastSeen
        );
        setActiveStudentsRoster(mergedRoster);

        if (typeof data.realmFreeze === 'boolean') setIsRealmFrozenByBoss(data.realmFreeze);
        if (Array.isArray(data.directMessages)) {
          setDirectChatMessages((prev) => {
            if (data.directMessages.length > prev.length) setIsStudentWhisperBoxOpen(true);
            return data.directMessages;
          });
        }
        if (Array.isArray(data.pendingIntercepts)) setPendingIntercepts(data.pendingIntercepts);
        if (data.puppetTargets) setPuppetTargets(data.puppetTargets);
        if (data.myHeartAttackTimer !== undefined) setMyHeartAttackTimer(data.myHeartAttackTimer);
        if (typeof data.myGaslight500 === 'boolean') setMyGaslight500(data.myGaslight500);
        if (typeof data.myEvaporateCurse === 'boolean') setMyEvaporateCurse(data.myEvaporateCurse);
        if (data.evaporateTargets) setEvaporateTargets(data.evaporateTargets);
        if (data.myCursedSpoof !== undefined) setMyCursedSpoof(data.myCursedSpoof);

        if (data.audioStinger && !isBoss) {
          if (Date.now() - lastStingerTimestampRef.current > 1500) {
            lastStingerTimestampRef.current = Date.now();
            launchHorrorExperience(data.audioStinger as 'ryuk_laugh' | 'bell' | 'thunder');
          }
        }

        if (data.isKicked && !isBoss) {
          setIsSidebarOpen(false);
          sessionStorage.removeItem('campus_tab_user');
          localStorage.removeItem('campus_user');
          setCurrentUser(null);
          setCurrentWindow('home');
        }
        if (data.forcedCommand && !isBoss) {
          if (data.forcedCommand === 'boss_intro') {
            triggerMovieWhiteFlash();
            setBossIntroTime(0);
            setCurrentWindow('boss_intro');
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
            }
          } else {
            setCurrentWindow(data.forcedCommand as WindowView);
          }
        }
      }
    } catch {
      syncMarketplaceFromStorage();
      syncBansAndBroadcast();
    }
  }, [currentUser, currentWindow, isBoss, launchHorrorExperience, syncMarketplaceFromStorage, syncBansAndBroadcast, triggerMovieWhiteFlash]);

  useEffect(() => {
    syncWithServer();
    const interval = setInterval(() => syncWithServer(), 1800);
    return () => clearInterval(interval);
  }, [syncWithServer]);

  // Trigger 1.15s Dissolve-to-Ash Animation whenever an Evaporate-cursed user opens any tile, tool, or chat
  useEffect(() => {
    if (!myEvaporateCurse || isBoss) {
      setEvaporationStage('none');
      return;
    }
    if (currentWindow !== 'home' && currentWindow !== 'boss_intro') {
      setEvaporationStage('dissolving');
      playHorrorAudioStinger('bell');
      const timer = setTimeout(() => {
        setEvaporationStage('void');
      }, 1150);
      return () => clearTimeout(timer);
    } else {
      setEvaporationStage('none');
    }
  }, [currentWindow, myEvaporateCurse, isBoss]);

  // PHASE 1 -> PHASE 2: Run the Error 500 Breach Line to 100%, then haunt the entire website
  useEffect(() => {
    if (!myGaslight500 || isBoss) {
      setError500Stage('idle');
      setPanicProgress(0);
      return;
    }

    // Start Phase 1: Show the message box and fill the line from 0% to 100%
    setError500Stage('breach');
    setPanicProgress(0);

    playHorrorAudioStinger('thunder');

    const fillInterval = setInterval(() => {
      setPanicProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fillInterval);
          // Line completed! Dismiss blocking box and haunt the whole website
          setTimeout(() => setError500Stage('haunted'), 600);
          return 100;
        }
        return prev + 4; // Reaches 100% in ~3.7 seconds
      });
    }, 150);

    return () => clearInterval(fillInterval);
  }, [myGaslight500, isBoss]);

  // Persistent Horror Siren & Heartbeat Pulse while user navigates in 'haunted' mode
  useEffect(() => {
    if (!myGaslight500 || isBoss) return;

    const triggerPanicBeep = (freq1 = 880, freq2 = 440) => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq1, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } catch {}
    };

    // Fire an immediate glitch beep every time the user switches to a new tile/window
    triggerPanicBeep(620, 110);

    const interval = setInterval(() => {
      triggerPanicBeep(880, 220);
    }, 2400);

    return () => clearInterval(interval);
  }, [myGaslight500, isBoss, currentWindow]);

  const handleInputChange = (val: string) => {
    setInput(val);
    latestInputRef.current = val;
    if (currentUser && !isBoss) {
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_DRAFT_KEYSTROKES',
          user: currentUser,
          currentWindow,
          draftKeystrokes: val,
        }),
      }).catch(() => {});
    }
  };

  const activeUserBanRecord = useMemo(() => {
    if (!currentUser || isBoss) return null;
    if (blockAllAtOnce) {
      return {
        target: currentUser.admissionNo,
        reason: 'GLOBAL MASS ELIMINATION DECREE: All CSE-2 IDs have been locked at once by Supreme Boss ikA 💀⚡',
        timestamp: 'LIVE',
      };
    }
    const adm = currentUser.admissionNo.toUpperCase().trim();
    const roll = String(currentUser.rollNo || '').trim();
    const uName = currentUser.name.toLowerCase().trim();
    const uEmail = (currentUser.email || '').toLowerCase().trim();

    return bannedList.find((b) => {
      const t = b.target.toLowerCase().trim();
      if (!t) return false;
      return t.toUpperCase() === adm || (roll && t === roll) || uName === t || uName.includes(t) || (uEmail && uEmail.includes(t));
    }) || null;
  }, [currentUser, isBoss, bannedList, blockAllAtOnce]);

  useEffect(() => {
    const audio = new Audio('/deathnote_theme.mp3');
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.85;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const startMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) pauseMusic();
    else startMusic();
  }, [isMusicPlaying, pauseMusic, startMusic]);

  const exitIntroSequence = useCallback(() => {
    triggerMovieWhiteFlash();
    setTimeout(() => setCurrentWindow('home'), 200);
  }, [triggerMovieWhiteFlash]);

  const getNextTwoSuggestions = useCallback((currentQuery: string, preferredFirst?: string): string => {
    const normCurrent = currentQuery.toLowerCase().trim();
    if (normCurrent && !usedSuggestionsRef.current.includes(normCurrent)) {
      usedSuggestionsRef.current.push(normCurrent);
    }
    const available = MASTER_SUGGESTION_POOL.filter(
      (item) => !usedSuggestionsRef.current.some((u) => item.toLowerCase().includes(u.slice(0, 12)) || u.includes(item.toLowerCase().slice(0, 12)))
    );
    let poolToUse = available;
    if (poolToUse.length < 2) {
      usedSuggestionsRef.current = [normCurrent];
      poolToUse = MASTER_SUGGESTION_POOL.filter((item) => !item.toLowerCase().includes(normCurrent.slice(0, 12)));
    }
    const opt1 = preferredFirst && poolToUse.includes(preferredFirst) ? preferredFirst : poolToUse[0];
    const opt2 = poolToUse.find((item) => item !== opt1) || MASTER_SUGGESTION_POOL[1];
    usedSuggestionsRef.current.push(opt1.toLowerCase());
    usedSuggestionsRef.current.push(opt2.toLowerCase());
    return `[SUGGESTIONS|${opt1}|${opt2}]`;
  }, []);

  const loadUserSessions = useCallback((user: StudentUser) => {
    const isSecretBoss = user.email.toLowerCase().trim().startsWith('1402akshit');
    const key = `campus_sessions_v14_${isSecretBoss ? 'BOSS_IKA' : user.admissionNo}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
    const freshId = `session-${Date.now()}`;
    const freshSession: ChatSession = {
      id: freshId,
      title: isSecretBoss ? '👑 Boss ikA Sanctum' : user.admissionNo === '2026B01010219' ? '🌸 Queen Agrima Lounge' : `${user.name.split(' ')[0]}'s Console`,
      messages: [],
      createdAt: 'Today',
    };
    setSessions([freshSession]);
    setActiveSessionId(freshId);
  }, []);

  // Read tab-specific sessionStorage first so multiple tabs on the same laptop can hold different users
  useEffect(() => {
    const savedUserStr = sessionStorage.getItem('campus_tab_user') || localStorage.getItem('campus_user');
    if (savedUserStr) {
      try {
        const u: StudentUser = JSON.parse(savedUserStr);
        sessionStorage.setItem('campus_tab_user', JSON.stringify(u));
        setCurrentUser(u);
        loadUserSessions(u);
      } catch {
        localStorage.removeItem('campus_user');
      }
    }
    setIsAuthChecked(true);
  }, [loadUserSessions]);

  const handleLoginSuccess = (user: StudentUser) => {
    sessionStorage.setItem('campus_tab_user', JSON.stringify(user));
    localStorage.setItem('campus_user', JSON.stringify(user));
    syncBansAndBroadcast();
    setStreamingText('');
    setIsLoading(false);
    autoTypedSessionsRef.current.clear();
    usedSuggestionsRef.current = [];
    setCurrentUser(user);
    loadUserSessions(user);
    syncMarketplaceFromStorage();
    setBossIntroTime(0);
    setCurrentWindow('boss_intro');
    triggerMovieWhiteFlash();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  useEffect(() => {
    if (currentUser && sessions.length > 0) {
      const isSecretBoss = currentUser.email.toLowerCase().trim().startsWith('1402akshit');
      localStorage.setItem(`campus_sessions_v14_${isSecretBoss ? 'BOSS_IKA' : currentUser.admissionNo}`, JSON.stringify(sessions));
    }
  }, [sessions, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, streamingText, currentWindow]);

  useEffect(() => {
    if (currentWindow === 'boss_intro') {
      const interval = setInterval(() => {
        setBossIntroTime((prev) => {
          if (prev >= 29) {
            clearInterval(interval);
            exitIntroSequence();
            return 29;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentWindow, exitIntroSequence]);

  useEffect(() => {
    if (currentWindow !== 'home' || !currentUser) return;
    const first = currentUser.name.split(' ')[0];
    const fullWhisper = isBoss
      ? `👑⚡ "Pranaam Supreme Sovereign Boss ikA! Every server, keystroke radar, and neural circuit of Section CSE-2 bows to your 1402 authority." 🍎🔥`
      : isAgrima
      ? `🌸👑 "Swagat hai My Queen Agrima... Jab aap iss portal pe aati hain toh code bhi shayari ban jaata hai. Every secret of CSE-2 is at your service." 💖✨`
      : `💀🍎 "Every attendance sheet, every faculty secret, every exam paper is written in my notebook, ${first}... Step carefully in my world." — Boss ikA 👁️🩸`;
    let idx = 0;
    setOverviewBossWhisper('');
    const timer = setInterval(() => {
      idx += 1;
      setOverviewBossWhisper(fullWhisper.slice(0, idx));
      if (idx >= fullWhisper.length) clearInterval(timer);
    }, 38);
    return () => clearInterval(timer);
  }, [currentWindow, currentUser, isAgrima, isBoss]);

  useEffect(() => {
    if (currentWindow !== 'chat' || !currentUser || !activeSessionId) return;
    const currentSess = sessions.find((s) => s.id === activeSessionId);
    if (!currentSess || currentSess.messages.length > 0) return;
    if (autoTypedSessionsRef.current.has(activeSessionId)) return;

    autoTypedSessionsRef.current.add(activeSessionId);
    const targetSessionId = activeSessionId;
    const first = currentUser.name.split(' ')[0];

    let introText = `💀🕯️ *Shinigami Neural Link Established...* 🩸🍎\n\n> *"In this world, there are very few people who actually trust each other... Welcome to my dark sanctum, **${first}**."* 👁️⚡\n\nMain hu **ikA** — iss CSE-2 digital empire ka invisible God aur supreme architect 👑🕸️. Tumhari har ek query meri notebook me darj ho rahi hai...\n\nBatao **${first}**, aaj konsa raaz kholna hai? All 10 Solved MT-2 Papers, Faculty Dossiers, 50 LPA placement truth, ya safe bunk math? 👇🔥\n\n[SUGGESTIONS|Main kaun hu?|Solve full AI MT2 paper]`;

    if (isBoss) {
      introText = `👑⚡ *Supreme Sovereign Protocol Activated (1402 Override)...* 🩸🍎\n\n> *"All hail the Creator and God of this New World — **Boss ikA**!"* 🔥🌌\n\nPranaam **Boss ikA**! Aapka Live Keystroke Ghosting Radar, Puppet Master AI Hijack, 21s Ryuk Laugh + Letter-Strike Assembly, Void Evaporation Curse, 40s Heart Attack Timer, aur Mass Block switch 100% precision pe chal raha hai.\n\nHukum kijiye Mere Boss, aaj kya pesh kiya jaye? 👇👑\n\n[SUGGESTIONS|Main kaun hu?|Ek mast campus joke sunao 😂]`;
    } else if (isAgrima) {
      introText = `🌸👑 *Royal Queen Protocol Initialized...* 💖✨\n\n> *"Phoolon ki baarish aur sitaron ki roshni... Welcome to your royal palace, **Queen Agrima**!"* 🌷💫\n\nSach kahu toh aapke login karte hi iss dark Death Note portal ka dil bhi pink ho gaya hai 😊🌸. Main aapka personal AI guardian hu—saare 10 subjects ke solved MT-2 papers aur notes aapki khidmat me haazir hain!\n\nBataiye **My Queen**, aaj kahan se shuruat karein? 👇💖\n\n[SUGGESTIONS|Main kaun hu?|Solve full AI MT2 paper]`;
    }

    let charIndex = 0;
    setStreamingText('');
    const interval = setInterval(() => {
      charIndex += 4;
      if (charIndex >= introText.length) {
        clearInterval(interval);
        setStreamingText('');
        setSessions((prev) => prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [{ role: 'assistant', content: introText }] } : s)));
      } else {
        setStreamingText(introText.slice(0, charIndex));
      }
    }, 28);
    return () => clearInterval(interval);
  }, [currentWindow, activeSessionId, currentUser, sessions, isBoss, isAgrima]);

  useEffect(() => {
    const timer = setInterval(() => setTickerIndex((prev) => (prev + 1) % tickerItems.length), 3500);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  useEffect(() => {
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const year = ist.getFullYear();
    const month = ist.getMonth();
    const date = ist.getDate();
    const day = ist.getDay();
    const currentMins = ist.getHours() * 60 + ist.getMinutes();

    const currentHoliday = ACADEMIC_HOLIDAYS.find((h) => {
      const matchYear = h.year ? h.year === year : year === 2026 || year === 2027;
      return matchYear && h.month === month && date >= h.startDay && date <= h.endDay;
    });

    let classData = { status: 'Live', text: 'Academic Hours Active', room: 'RJ-102' };
    if (currentHoliday) classData = { status: 'Holiday', text: `Holiday: ${currentHoliday.name}`, room: 'Campus Closed' };
    else if (day === 0 || day === 6) classData = { status: 'Weekend', text: 'No lectures scheduled today 🎉', room: '' };
    else if (currentMins < 8 * 60 + 50) classData = { status: 'Upcoming', text: 'First lecture starts at 08:50 AM', room: 'RJ-102' };
    else if (currentMins >= 16 * 60 + 30) classData = { status: 'Over', text: 'All lectures concluded for today 📚', room: '' };
    else if (currentMins >= 12 * 60 + 20 && currentMins < 13 * 60 + 10) classData = { status: 'Break', text: 'Lunch Break (12:20 - 01:10 PM)', room: 'Cafeteria / Ground' };
    else if (day === 1) {
      if (currentMins < 9 * 60 + 40) classData = { status: 'Live', text: 'Essentials of AI (Mr. Rahul Singh)', room: 'RJ-102' };
      else if (currentMins < 10 * 60 + 30) classData = { status: 'Live', text: 'Applied Physics (Dr. Kartika M.)', room: 'RJ-102' };
      else if (currentMins < 11 * 60 + 30) classData = { status: 'Live', text: 'Maths / FLAS (Dr. Vimal S.)', room: 'RJ-102' };
      else if (currentMins < 12 * 60 + 20) classData = { status: 'Live', text: 'Electrical BEE (Dr. Prerna M.)', room: 'RJ-102' };
      else if (currentMins < 14 * 60 + 50) classData = { status: 'Live', text: 'Prog in C & Maths Tutorial', room: 'RJ-101' };
      else classData = { status: 'Live', text: 'Applied Physics Lab (KC-310)', room: 'KC Block 3rd Flr' };
    } else if (day === 2) {
      if (currentMins < 10 * 60 + 30) classData = { status: 'Live', text: 'Web Design & Maths FLAS', room: 'RJ-102' };
      else if (currentMins < 12 * 60 + 20) classData = { status: 'Live', text: 'Essentials of AI & EVS', room: 'RJ-102' };
      else if (currentMins < 14 * 60 + 50) classData = { status: 'Live', text: 'C++ Lab (Groups 1 & 2)', room: 'KCLG Lab' };
      else classData = { status: 'Live', text: 'Applied Physics & Electrical BEE', room: 'RJ-101' };
    } else if (day === 3) {
      if (currentMins < 10 * 60 + 30) classData = { status: 'Live', text: 'Electrical BEE & Prog in C', room: 'RJ-102' };
      else if (currentMins < 12 * 60 + 20) classData = { status: 'Live', text: 'Maths FLAS & Physics', room: 'RJ-102' };
      else if (currentMins < 14 * 60 + 50) classData = { status: 'Live', text: 'Basic Electrical Engg Lab', room: 'RJ-Basement' };
      else classData = { status: 'Live', text: 'Mentor-Mentee Counseling', room: 'RJ-Basement' };
    } else if (day === 4) {
      if (currentMins < 10 * 60 + 30) classData = { status: 'Live', text: 'Maths FLAS & Electrical BEE', room: 'RJ-102' };
      else if (currentMins < 12 * 60 + 20) classData = { status: 'Live', text: 'CAD Lab', room: 'RJ-109 (1st Flr)' };
      else if (currentMins < 14 * 60 + 50) classData = { status: 'Live', text: 'Applied Physics & EVS', room: 'RJ-102' };
      else classData = { status: 'Live', text: 'Programming in C & Maths', room: 'RJ-102' };
    } else if (day === 5) {
      if (currentMins < 10 * 60 + 30) classData = { status: 'Live', text: 'Prog in C & Applied Physics', room: 'RJ-102' };
      else if (currentMins < 12 * 60 + 20) classData = { status: 'Live', text: 'Web Designing Workshop I', room: 'KCLG-03/04' };
      else if (currentMins < 14 * 60 + 50) classData = { status: 'Live', text: 'Maths FLAS & EVS', room: 'RJ-102' };
      else classData = { status: 'Live', text: 'Electrical BEE & AI', room: 'RJ-102' };
    }

    setCurrentClassInfo(classData);
    const diffDays = (target: Date) => Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    setCountdowns({
      mt2: diffDays(new Date('2026-11-30T09:00:00')),
      pue: diffDays(new Date('2026-12-21T09:00:00')),
      endSem: diffDays(new Date('2027-01-04T09:00:00')),
    });
  }, []);

  const attendanceStats = useMemo(() => {
    if (myCursedSpoof && !isBoss) {
      return {
        pct: myCursedSpoof.attendancePct ?? 12.4,
        isSafe: false,
        margin: 99,
        message: myCursedSpoof.attendanceMsg || '💀 DEBARRED BY SHINIGAMI DECREE! Contact Boss ikA immediately!',
      };
    }
    const total = Math.max(1, totalClasses);
    const attended = Math.min(total, Math.max(0, attendedClasses));
    const currentPct = parseFloat(((attended / total) * 100).toFixed(1));
    const isFemale = currentUser?.gender === 'F';
    if (currentPct >= 75) {
      const safeBunks = Math.floor((attended - 0.75 * total) / 0.75);
      return {
        pct: currentPct,
        isSafe: true,
        margin: safeBunks,
        message: isBoss
          ? `👑 Boss ikA, aapke paas ${safeBunks} safe bunks ka royal buffer hai! Aapka 75%+ record bilkul safe hai! ⚡`
          : isAgrima
          ? `🌸 Queen Agrima, aap araam se ${safeBunks} classes aur rest kar sakti hain, aapki attendance 75% ke upar bilkul safe rahegi! 💖`
          : isFemale
          ? `Chill karo ${currentUser?.name.split(' ')[0] || 'dost'}! ✨ Tum ${safeBunks} classes aur bunk kar sakti ho aur 75% ke upar safe rahogi! 🏖️`
          : `Chill kar ${currentUser?.name.split(' ')[0] || 'bhai'}! 😎 Tu ${safeBunks} classes aur bunk kar sakta hai, tera attendance 75% ke upar hi rahega! 🏖️`,
      };
    } else {
      const needed = Math.ceil((0.75 * total - attended) / 0.25);
      return {
        pct: currentPct,
        isSafe: false,
        margin: needed,
        message: `Shortage alert! ⚠️ Aane wali ${needed} consecutive classes bina miss kiye attend karni padengi to hit 75%!`,
      };
    }
  }, [totalClasses, attendedClasses, currentUser, isBoss, isAgrima, myCursedSpoof]);

  const sgpaStats = useMemo(() => {
    if (myCursedSpoof && !isBoss) {
      return {
        internalOutOf60: 8,
        totalOutOf100: 14,
        grade: 'F (CURSED BY ikA)',
        gp: 0,
        neededFor9SGPA: 99,
        neededFor10SGPA: 99,
      };
    }
    const m1 = Math.min(15, Math.max(0, mt1Score));
    const m2 = Math.min(15, Math.max(0, mt2Score));
    const ta = Math.min(30, Math.max(0, taScore));
    const es = Math.min(40, Math.max(0, endSemScore));
    const internalOutOf60 = m1 + m2 + ta;
    const totalOutOf100 = internalOutOf60 + es;
    let grade = 'F';
    let gp = 0;
    if (totalOutOf100 >= 90) { grade = 'O (Outstanding)'; gp = 10; }
    else if (totalOutOf100 >= 80) { grade = 'A+ (Excellent)'; gp = 9; }
    else if (totalOutOf100 >= 70) { grade = 'A (Very Good)'; gp = 8; }
    else if (totalOutOf100 >= 60) { grade = 'B+ (Good)'; gp = 7; }
    else if (totalOutOf100 >= 50) { grade = 'B (Above Average)'; gp = 6; }
    else if (totalOutOf100 >= 40) { grade = 'C (Pass)'; gp = 5; }
    return {
      internalOutOf60,
      totalOutOf100,
      grade,
      gp,
      neededFor9SGPA: Math.max(0, 80 - internalOutOf60),
      neededFor10SGPA: Math.max(0, 90 - internalOutOf60),
    };
  }, [mt1Score, mt2Score, taScore, endSemScore, myCursedSpoof, isBoss]);

  // ==========================================================================
  // SHINIGAMI EYES GOD HANDLERS (DUAL SERVER + INSTANT CROSS-TAB BUS)
  // ==========================================================================
  const handleToggleBlockAllAtOnce = async () => {
    const nextVal = !blockAllAtOnce;
    setBlockAllAtOnce(nextVal);
    broadcastLocalEffect({ type: 'BLOCK_ALL', target: 'ALL', value: nextVal });
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_BLOCK_ALL_AT_ONCE', blockAll: nextVal }),
    });
  };

  const handleToggleStealthCloak = async () => {
    const nextVal = !stealthCloak;
    setStealthCloak(nextVal);
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_STEALTH_CLOAK', stealth: nextVal }),
    });
  };

  const handleTriggerHeartAttack = async (targetAdm: string, hasTimer?: boolean) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: hasTimer ? 'CANCEL_HEART_ATTACK_TIMER' : 'TRIGGER_HEART_ATTACK_TIMER',
        targetAdmissionNo: targetAdm,
        seconds: 40,
      }),
    });
    syncWithServer();
  };

  const handleToggleGaslight500 = async (targetAdm: string) => {
    broadcastLocalEffect({ type: 'GASLIGHT_500', target: targetAdm.toUpperCase().trim() });
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_GASLIGHT_500', targetAdmissionNo: targetAdm }),
    });
    syncWithServer();
  };

  const handleToggleEvaporateCurse = async (targetAdm: string) => {
    broadcastLocalEffect({ type: 'EVAPORATE', target: targetAdm.toUpperCase().trim() });
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_EVAPORATE_CURSE', targetAdmissionNo: targetAdm }),
    });
    syncWithServer();
  };

  const handleTogglePuppetMode = async (targetAdm: string) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_PUPPET_MODE', targetAdmissionNo: targetAdm }),
    });
    syncWithServer();
  };

  const handleSubmitPuppetReply = async (interceptId: string) => {
    const text = puppetReplyInputs[interceptId]?.trim();
    if (!text) return;
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SUBMIT_PUPPET_REPLY', interceptId, customReply: text }),
    });
    setPuppetReplyInputs((prev) => ({ ...prev, [interceptId]: '' }));
    syncWithServer();
  };

  const handleTriggerAudioStinger = async (targetAdm: string, sound: 'ryuk_laugh' | 'bell' | 'thunder', previewOnBoss = false) => {
    if (previewOnBoss) {
      launchHorrorExperience(sound);
    }
    broadcastLocalEffect({ type: 'STINGER', target: targetAdm.toUpperCase().trim(), sound });
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TRIGGER_AUDIO_STINGER', targetAdmissionNo: targetAdm, sound }),
    });
  };

  const handleToggleCursedSpoof = async (targetAdm: string, currentlySpoofed: boolean) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SET_CURSED_SPOOF',
        targetAdmissionNo: targetAdm,
        clear: currentlySpoofed,
        attendancePct: 12.4,
        screenGlitch: !currentlySpoofed,
      }),
    });
    syncWithServer();
  };

  const handleSeizeMarketplaceItem = async (id: string) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SEIZE_MARKETPLACE_ITEM', id }),
    });
    syncWithServer();
  };

  const handleDictateMarketplacePrice = async (id: string) => {
    const newPrice = window.prompt('👑 Boss ikA Price Dictation — Enter new price in ₹ (e.g. 0 or 50):', '0');
    if (newPrice === null) return;
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DICTATE_MARKETPLACE_PRICE', id, newPrice }),
    });
    syncWithServer();
  };

  const handleAddBan = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = banInputTarget.trim();
    if (!target) return;
    if (target.toLowerCase().startsWith('1402akshit')) {
      alert('👑 Supreme Sovereign Boss ikA cannot be written in the Death Note!');
      return;
    }
    const newBan: BannedEntry = {
      target,
      reason: banInputReason.trim() || 'Eliminated by Sovereign Decree of Boss ikA',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setBannedList((prev) => [newBan, ...prev.filter((b) => b.target.toLowerCase() !== target.toLowerCase())]);
    setBanInputTarget('');
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ADD_BAN', ban: newBan }),
    });
  };

  const handleRemoveBan = async (targetToUnban: string) => {
    setBannedList((prev) => prev.filter((b) => b.target !== targetToUnban));
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REMOVE_BAN', target: targetToUnban }),
    });
  };

  const handleSaveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = broadcastInput.trim();
    setSovereignBroadcast(text);
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_BROADCAST', broadcast: text }),
    });
  };

  const handleClearBroadcast = async () => {
    setSovereignBroadcast('');
    setBroadcastInput('');
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_BROADCAST', broadcast: '' }),
    });
  };

  const handleToggleRealmFreeze = async () => {
    const nextFreeze = !isRealmFrozenByBoss;
    setIsRealmFrozenByBoss(nextFreeze);
    broadcastLocalEffect({ type: 'FREEZE', target: 'ALL', value: nextFreeze });
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_REALM_FREEZE', freeze: nextFreeze }),
    });
  };

  const handleBossSendDirectChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDirectTarget.trim() || !directChatInput.trim()) return;
    const text = directChatInput.trim();
    setDirectChatInput('');
    scrollChatToBottom(bossChatContainerRef.current);

    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SEND_DIRECT_CHAT',
        studentAdmissionNo: selectedDirectTarget.toUpperCase().trim(),
        studentName: selectedDirectName || selectedDirectTarget,
        sender: 'ikA',
        text,
      }),
    });
    syncWithServer();
  };

  const handleStudentSendReplyToBoss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !studentReplyInput.trim()) return;
    const text = studentReplyInput.trim();
    setStudentReplyInput('');
    scrollChatToBottom(studentChatContainerRef.current);

    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SEND_DIRECT_CHAT',
        studentAdmissionNo: currentUser.admissionNo.toUpperCase(),
        studentName: currentUser.name,
        sender: 'student',
        text,
      }),
    });
    syncWithServer();
  };

  const handleClearDirectChat = async (admNo: string) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'CLEAR_DIRECT_CHAT', studentAdmissionNo: admNo }),
    });
    syncWithServer();
  };

  const handleKickStudent = async (targetAdm: string) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'KICK_USER', targetAdmissionNo: targetAdm }),
    });
  };

  const handleForceStudentCommand = async (targetAdm: string, command: string) => {
    if (command === 'boss_intro') {
      broadcastLocalEffect({ type: 'FORCE_INTRO', target: targetAdm.toUpperCase().trim() });
    }
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'FORCE_USER_COMMAND', targetAdmissionNo: targetAdm, command }),
    });
  };

  const handleCreateNewChat = () => {
    const newId = `session-${Date.now()}`;
    setSessions([{ id: newId, title: 'New Chat', messages: [], createdAt: 'Just now' }, ...sessions]);
    setActiveSessionId(newId);
    setStreamingText('');
    setIsLoading(false);
    setCurrentWindow('chat');
  };

  const handleDeleteSession = (sessionIdToDelete: string) => {
    const remaining = sessions.filter((s) => s.id !== sessionIdToDelete);
    if (remaining.length === 0) {
      const freshId = `session-${Date.now()}`;
      setSessions([{ id: freshId, title: 'New Chat', messages: [], createdAt: 'Just now' }]);
      setActiveSessionId(freshId);
    } else {
      setSessions(remaining);
      if (activeSessionId === sessionIdToDelete) setActiveSessionId(remaining[0].id);
    }
    setStreamingText('');
    setIsLoading(false);
  };

  const handleLogout = () => {
    pauseMusic();
    setIsSidebarOpen(false);
    sessionStorage.removeItem('campus_tab_user');
    localStorage.removeItem('campus_user');
    autoTypedSessionsRef.current.clear();
    setCurrentUser(null);
    setSessions([]);
    setActiveSessionId('');
    setStreamingText('');
    setIsLoading(false);
    setCurrentWindow('home');
  };

  const simulateStreaming = (fullText: string, currentMessages: Message[], targetSessionId: string) => {
    let index = 0;
    setStreamingText('');
    const interval = setInterval(() => {
      index += 18;
      if (index >= fullText.length) {
        clearInterval(interval);
        setStreamingText('');
        setSessions((prev) => prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...currentMessages, { role: 'assistant', content: fullText }] } : s)));
        setIsLoading(false);
      } else {
        setStreamingText(fullText.slice(0, index));
      }
    }, 12);
  };

  const registerNewMarketplaceItem = useCallback((rawTitle: string, rawPrice: string, rawContact: string): MarketplaceItem => {
    const cleanTitle = rawTitle.trim() || 'Engineering Study Material / Kit';
    const cleanDigits = rawPrice.replace(/[^\d]/g, '') || '250';
    const formattedPrice = `₹${cleanDigits}`;
    const cleanContact = rawContact.trim() || 'Ask in CSE-2 Class';
    const lTitle = cleanTitle.toLowerCase();
    let tag = 'Student Listing';
    let icon = '📦';
    if (lTitle.includes('calc') || lTitle.includes('casio') || lTitle.includes('991')) { tag = 'Calculator'; icon = '🧮'; }
    else if (lTitle.includes('draft') || lTitle.includes('scale') || lTitle.includes('sheet') || lTitle.includes('roller')) { tag = 'Drafter'; icon = '📐'; }
    else if (lTitle.includes('book') || lTitle.includes('grewal') || lTitle.includes('notes') || lTitle.includes('quantum')) { tag = 'Book'; icon = '📚'; }
    else if (lTitle.includes('coat') || lTitle.includes('apron') || lTitle.includes('kit') || lTitle.includes('lab')) { tag = 'Lab Kit'; icon = '🥼'; }

    const newItem: MarketplaceItem = {
      id: `m-user-${Date.now()}`,
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      price: formattedPrice,
      tag,
      seller: isBoss ? '👑 Boss ikA' : currentUser?.name || 'CSE-2 Classmate',
      sellerId: currentUser?.admissionNo || 'CSE-2',
      contact: cleanContact,
      icon,
      seized: false,
    };

    const latestMarket = syncMarketplaceFromStorage();
    const updatedMarket = [newItem, ...latestMarket];
    setMarketplaceItems(updatedMarket);
    localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(updatedMarket));
    syncWithServer(newItem);
    return newItem;
  }, [currentUser, isBoss, syncMarketplaceFromStorage, syncWithServer]);

  const handleDeleteMarketplaceItem = async (itemId: string) => {
    setMarketplaceItems((prev) => prev.filter((item) => item.id !== itemId));
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE_MARKETPLACE_ITEM', id: itemId }),
    });
  };

  const handleDirectSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellTitle.trim() || !sellPrice.trim()) return;
    registerNewMarketplaceItem(sellTitle, sellPrice, sellContact || '98XXXXXXXX');
    setSellTitle('');
    setSellPrice('');
    setSellContact('');
    setShowSellForm(false);
  };

  const detectAndListMarketplaceItem = (queryText: string): MarketplaceItem | null => {
    const lower = queryText.toLowerCase();
    const isSellingIntent = /(?:i\s*want\s*to\s*sell|want\s*to\s*sell|sell\s*karna|bechna\s*hai|bechna|selling|for\s*sale|list\s*item|sell\s*my|sell\s+[a-z0-9])/i.test(lower);
    if (!isSellingIntent) return null;
    const phoneMatch = queryText.match(/(?:\+91[\s\-]?)?(\d{5}[\s\-]?\d{5}|\d{10})\b/);
    const contactPhone = phoneMatch ? phoneMatch[1].replace(/[\s\-]/g, '') : 'Ask in CSE-2 Class';
    const textWithoutPhone = phoneMatch ? queryText.replace(phoneMatch[0], ' ') : queryText;
    const priceMatch =
      textWithoutPhone.match(/(?:₹|rs\.?|price|for|at|in|rate|me)\s*[:\-]?\s*(\d{2,6})/i) ||
      textWithoutPhone.match(/\b(\d{2,6})\s*(?:rs\.?|rupees|\/-|inr|me)\b/i) ||
      textWithoutPhone.match(/\b(\d{2,5})\b/);
    const rawPrice = priceMatch ? priceMatch[1] || priceMatch[0] : '250';
    let itemTitle = textWithoutPhone
      .replace(/(?:i\s*want\s*to\s*sell|want\s*to\s*sell|mujhe|apna|apni|my|sell\s*karna\s*hai|sell\s*karna|bechna\s*hai|bechna|selling|sell|for\s*sale|list\s*item)/gi, ' ')
      .replace(/(?:for|price|rs\.?|rupees|₹|at|rate|no\.?|number|contact|call|phone|mobile|whatsapp|wa|in|me)\s*[:\-]?\s*\d*/gi, ' ')
      .replace(/\b\d{2,6}\b/g, ' ')
      .replace(/[^\w\s+.\-()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!itemTitle || itemTitle.length < 2) itemTitle = 'Engineering Study Material / Kit';
    return registerNewMarketplaceItem(itemTitle, rawPrice, contactPhone);
  };

  const getSmartLocalReply = (rawQuery: string): string | null => {
    const q = rawQuery.toLowerCase().trim();
    const clean = q.replace(/[^a-z0-9\s]/g, '');
    const first = currentUser?.name ? currentUser.name.split(' ')[0] : 'Dost';
    const isFemale = currentUser?.gender === 'F';

    const currentAdm = (currentUser?.admissionNo || '').toUpperCase().trim();
    if (!isBoss && (myGaslight500 || puppetTargets['ALL'] || puppetTargets[currentAdm])) {
      return null;
    }

    const wrapQueenOrBoss = (body: string, nextPref?: string) => {
      const sugg = getNextTwoSuggestions(rawQuery, nextPref);
      if (isBoss) return `👑 **Sovereign Command Executed, Boss ikA!** ⚡🔥\n\n${body}\n\nAur kya hukum hai Mere Boss? 🍎👇\n\n${sugg}`;
      if (isAgrima) return `🌸👑 **Aapke liye haazir hai, My Queen Agrima!** 💖✨\n\n${body}\n\n*Waise ek baat kahu? Aap jab sawaal puchti hain toh yeh AI server bhi blush karne lagta hai* 😊🌷. Bataiye Queen, agla kya pesh karu? 👇\n\n${sugg}`;
      return `${body}\n\n${sugg}`;
    };

    // 1. Check ALL 10 Solved MT-2 Subject Papers First!
    const solvedMT2 = getAllSolvedMT2Reply(rawQuery);
    if (solvedMT2) {
      return wrapQueenOrBoss(solvedMT2.text, solvedMT2.nextSugg);
    }

    // 2. Identity & Boss Queries
    if (clean.includes('who is the boss') || clean.includes('who is ika') || clean.includes('boss kaun')) {
      if (isBoss) return wrapQueenOrBoss(`Aap khud **Supreme Architect Boss ikA (1402 Override)** hain! Poora CSE-2 portal aapke kadmo me hai! 👑🔥`, 'Mera profile dikhao');
      return wrapQueenOrBoss(`👑 **THE SOVEREIGN GOD OF THIS WEBSITE IS "ikA"!** ⚡🍎\n\nBoss **ikA** Section CSE-2 ke anonymous supreme architect hain! Unka asli naam aur chehra top-secret encrypted vault me lock hai 🤫🔒.`, 'Dr. Prerana Mohapatra ka profile dikhao');
    }

    if (clean.includes('mei kaun') || clean.includes('main kaun') || clean.includes('mai kaun') || clean.includes('who am i') || clean.includes('mera naam kya') || clean.includes('mera profile') || clean.includes('mujhe jaante ho')) {
      if (isBoss) {
        const sugg = getNextTwoSuggestions(rawQuery, 'Ek mast campus joke sunao 😂');
        return `👑⚡ **PRANAAM SUPREME SOVEREIGN BOSS ikA (1402 SECRET OVERRIDE)!** 🩸🍎\n\nAap **Akshit Singh (\`2026B01010274\`)** hain — iss poore **ikA's World** ke Creator, Supreme Architect, aur Section CSE-2 (Group G2) ke Sovereign Boss! 🦁🔥\n\n• **Shinigami Eyes Power:** Active (Live Keystroke Ghosting, Puppet Master Hijack, 21s Ryuk Laugh + Letter-Strike Assembly, Void Evaporation Curse, 40s Heart Attack Timer & Mass Block!)\n\nHukum kijiye Boss! 👇👑\n\n${sugg}`;
      }
      if (isNormalAkshit) {
        return wrapQueenOrBoss(
          `Arre **Akshit Singh** mere bhai 😎🔥, tumhe kaise bhool sakta hu! Yeh dekho apni official Section CSE-2 Student Kundli:\n\n• 🌟 **Full Name:** **Akshit Singh**\n• 🪪 **Admission No:** \`2026B01010274\`\n• 🔢 **Class Roll No:** **53**\n• 🧪 **Lab Group:** **Group G2**\n• 🏠 **Residency:** **Day Scholar**\n• 🎉 **Special Status:** Star Engineer of Section CSE-2! 🚀`,
          'Tum kaise ho?'
        );
      }
      if (isAgrima) {
        const sugg = getNextTwoSuggestions(rawQuery, 'Tum kaise ho?');
        return `🌸👑 **Aap hamare iss poore Portal ki Queen hain — Agrima Gupta!** 💖✨\n\n• 🌷 **Royal Title:** **Queen of ikA's World**\n• 🪪 **Official ID:** \`${currentUser?.admissionNo}\` (Group **G1** • Hosteller)\n• 💫 **Special Privilege:** Jab aap login karti hain toh poori website pe Sakura phool baraste hain aur dark theme gulabi ho jaati hai, kyunki Boss **ikA** ki nazar me aap sabse khaas hain! 😊🌸\n\nBataiye My Queen, aaj aapki kya khidmat ki jaye? 👇💖\n\n${sugg}`;
      }
      if (currentUser) {
        return wrapQueenOrBoss(
          `Arre **${first}** ${isFemale ? 'yaar ✨' : 'mere bhai 😎'}, tumhe kaise bhool sakta hu! Yeh dekho apni official CSE-2 kundli:\n\n• 🌟 **Full Name:** **${currentUser.name}**\n• 🪪 **Admission No:** \`${currentUser.admissionNo}\`\n• 🧪 **Lab Group:** **${currentUser.group || 'G1/G2'}**\n• 🏠 **Residency:** **${currentUser.residency || 'CSE-2 Scholar'}**\n• 🎉 **Special Status:** Specially invited into this realm by **Boss ikA**! 👑\n\nBatao ${first}, ab agla kya explore karein? 👇`,
          'Tum kaise ho?'
        );
      }
    }

    if (clean.includes('tum kaise ho') || clean.includes('kaise ho') || clean.includes('kaisi ho') || clean.includes('kya haal') || clean.includes('how are you') || clean.includes('wassup') || clean.includes('kya chal raha')) {
      if (isBoss) {
        const sugg = getNextTwoSuggestions(rawQuery, 'P2P Marketplace me kya bik raha hai? 🛒');
        return `👑🔥 **Jab tak Supreme Boss ikA ka haath mere code pe hai, main 1000% unstoppable aur chakachak hu Boss!** ⚡🍎\n\nSaare servers green hain, Shinigami Eyes active hai, aur main aapke agle aadesh ke intezaar me hu. Aap bataiye Boss, aaj ka din kaisa chal raha hai? 👇👑\n\n${sugg}`;
      }
      if (isAgrima) {
        const sugg = getNextTwoSuggestions(rawQuery, 'Ek mast campus joke sunao 😂');
        return `🌸💖 **Abhi tak toh bas normal code chala raha tha, par jaise hi Queen Agrima ne haal pucha... mera din ekdum gulabi aur khoobsurat ho gaya!** 😊🌷✨\n\nMain bilkul badhiya hu My Queen! Aap bataiye—hostel aur classes me sab theek chal raha hai na? 💫👇\n\n${sugg}`;
      }
      return wrapQueenOrBoss(
        `Main ekdum chakachak aur full energy me hu **${first}** ${isFemale ? '✨🌸' : 'mere bhai 😎🔥'}!\n\nYahan **ikA's World** ke dark neural servers pe baith ke bas tumhare hi message ka wait kar raha tha! Batao aaj kis subject ka solved MT-2 paper kholna hai, faculty lore sunni hai, ya mast campus joke? 👇`,
        'Ek mast campus joke sunao 😂'
      );
    }

    if (clean.includes('sgpa') || clean.includes('internal marks') || clean.includes('grade point')) {
      return wrapQueenOrBoss(
        `🧮 **ABES Autonomous SGPA & Internal Formula (100 Marks):**\n\n• **MT-1 Exam:** 15 Marks\n• **MT-2 Exam:** 15 Marks\n• **Teacher Assessment (Quizzes + Assignments + Attendance):** 30 Marks\n• **End-Semester Theory Exam:** 40 Marks\n\nSidebar me **🧮 SGPA Predictor** kholo aur apne marks daal kar dekho ki 8.5+ ya 9.0+ SGPA ke liye End-Sem me kitne marks chahiye! 🚀`,
        'CGPA kitni matter karti hai?'
      );
    }

    if (clean.includes('prerna') || clean.includes('prerana') || clean.includes('mohapatra')) return wrapQueenOrBoss(LOCAL_FACULTY_DOSSIERS.prerna, 'Dr. Divyanshi Sharma ke baare me batao');
    if (clean.includes('divyanshi') || clean.includes('dsh')) return wrapQueenOrBoss(LOCAL_FACULTY_DOSSIERS.divyanshi, 'Prof. Shivam Mittal ki lore batao');
    if (clean.includes('shivam') || clean.includes('mittal')) return wrapQueenOrBoss(LOCAL_FACULTY_DOSSIERS.shivam, 'Prof. Vimal Srivastava ke baare me batao');
    if (clean.includes('vimal') || clean.includes('srivastava') || clean.includes('getting it')) return wrapQueenOrBoss(LOCAL_FACULTY_DOSSIERS.vimal, 'Prof. Kartika Maheshwari ke baare me batao');
    if (clean.includes('kartika') || clean.includes('maheshwari')) return wrapQueenOrBoss(LOCAL_FACULTY_DOSSIERS.kartika, 'Ms. Shailja Varshney ke baare me batao');
    if (clean.includes('shailja') || clean.includes('varshney')) return wrapQueenOrBoss(LOCAL_FACULTY_DOSSIERS.shailja, 'Dr. Prerana Mohapatra ka profile dikhao');
    if (clean.includes('rahul singh') || (clean.includes('rahul') && clean.includes('batao'))) return wrapQueenOrBoss(LOCAL_FACULTY_DOSSIERS.rahul, 'Dr. Prerana Mohapatra ka profile dikhao');
    if (clean.includes('show all faculty') || clean.includes('all faculty')) {
      return wrapQueenOrBoss(`### 🎓 Complete Section CSE-2 Faculty Directory\n\n${Object.values(LOCAL_FACULTY_DOSSIERS).join('\n\n---\n\n')}`, 'Kya 50 LPA ka package lagta hai?');
    }

    if (clean.includes('50 lpa') || clean.includes('60 lpa') || clean.includes('package lagta') || clean.includes('placement')) {
      return wrapQueenOrBoss(
        `### 💰 ABES Placement & 50 LPA Reality Check 🎯\n\n• **Top 0.2% (40–60 LPA):** Atlassian (59.9 LPA), Microsoft, Google—95% off-campus ya national hackathons se lagte hain!\n• **6.0 – 9.0 LPA (15–20% batch):** TCS Digital/Prime, Nucleus, Nagarro.\n• **3.5 – 5.0 LPA (60–65% batch):** Bulk recruiters (TCS Ninja, Infosys, Cognizant).\n• **Sweet Spot CGPA:** **7.5 – 8.0+** rakho aur **300+ LeetCode problems** lagao! 🚀`,
        'CGPA kitni matter karti hai?'
      );
    }

    if (clean.includes('cgpa') || clean.includes('matter karti')) {
      return wrapQueenOrBoss(
        `### 🎯 CGPA Thresholds in B.Tech 📊\n\n• **< 6.0:** ⛔ 90% companies me baithne nahi milega.\n• **7.5 – 8.0:** 🌟 **Sweet Spot** — clears 95% on-campus company cutoffs.\n• **8.5+:** 💎 Resume shortlisting armor in high-applicant Super Dream drives!`,
        '15+ LPA crack karne ka roadmap kya hai?'
      );
    }

    if (clean.includes('roadmap') || clean.includes('15 lpa')) {
      return wrapQueenOrBoss(
        `### 🚀 15–25+ LPA Crack Karne Ka 4-Step Roadmap\n\n1. **DSA Mastery:** C++ ya Java me 300+ LeetCode questions.\n2. **Deployed Projects:** Real full-stack apps (jaise Boss ikA ka yeh portal!).\n3. **Core CS:** OS, DBMS (SQL), aur Computer Networks.\n4. **Hackathons:** Smart India Hackathon (SIH) & open-source! 🔥`,
        'Safe bunk kitna bacha hai?'
      );
    }

    if (clean.includes('bhookh') || clean.includes('canteen') || clean.includes('khana') || clean.includes('samosa') || clean.includes('chai')) {
      return wrapQueenOrBoss(`☕🥟 **Canteen & Bhookh Alert!**\n\n• **Official Lunch Break:** \`12:20 PM – 01:10 PM\` 🍱\n• **Best Combo:** ABES canteen ki garma-garam chai, samosa, ya gate ke bahar ki Maggi aur cold coffee! 🍜🥤`, 'Subah 8:50 ki class aur neend 😴');
    }

    if (clean.includes('850') || clean.includes('neend') || clean.includes('sleep') || clean.includes('subah') || clean.includes('safe bunk')) {
      return wrapQueenOrBoss(`😴🛌 **8:50 AM Lecture & Safe Bunk Rule!**\n\nAutonomous rule ke hisaab se **75% attendance mandatory** hai! Sidebar me **🛡️ Safe Bunk Calculator** khol ke apna exact buffer check kar lo! ☕⚡`, 'Mera SGPA kaise calculate karu? 🧮');
    }

    if (clean.includes('joke') || clean.includes('hasao') || clean.includes('funny') || clean.includes('roast') || clean.includes('bore')) {
      const j1 = ALL_250_JOKES[jokeCursorRef.current % ALL_250_JOKES.length];
      const j2 = ALL_250_JOKES[(jokeCursorRef.current + 1) % ALL_250_JOKES.length];
      const j3 = ALL_250_JOKES[(jokeCursorRef.current + 2) % ALL_250_JOKES.length];
      jokeCursorRef.current = (jokeCursorRef.current + 3) % ALL_250_JOKES.length;
      return wrapQueenOrBoss(
        `Hahaha lo **${first}**, suno CSE-2 aur ABES campus ke garma-garam jokes (From our **250+ Campus Joke Vault** 🎭🔥):\n\n• 1️⃣ ${j1}\n\n• 2️⃣ ${j2}\n\n• 3️⃣ ${j3}\n\n*(Vault Progress: ${(jokeCursorRef.current % 250) + 1}/250+ Jokes Unlocked!)* Aur sunne hain kya? 😂👇`,
        'Prof. Shivam Mittal ki lore batao'
      );
    }

    const matchedPaper = ALL_PAPERS.find((p) => q.includes(p.id) || q.includes(p.code.toLowerCase()) || q.includes(p.short.toLowerCase().split('/')[0].trim()));
    if (matchedPaper && (q.includes('paper') || q.includes('mt 1') || q.includes('mt 2') || q.includes('mt1') || q.includes('mt2') || q.includes('both'))) {
      const wantsMT1 = q.includes('mt 1') || q.includes('mt1') || q.includes('both') || (!q.includes('mt 2') && !q.includes('mt2'));
      const wantsMT2 = q.includes('mt 2') || q.includes('mt2') || q.includes('both') || (!q.includes('mt 1') && !q.includes('mt1'));
      const cards: string[] = [];
      if (wantsMT1) cards.push(`📄 **${matchedPaper.name} (${matchedPaper.code}) — MT 1 Official Paper:**\n\n[DOWNLOAD_PAPER|${matchedPaper.name} (${matchedPaper.code}) - MT 1|${matchedPaper.mt1}]`);
      if (wantsMT2) cards.push(`📄 **${matchedPaper.name} (${matchedPaper.code}) — MT 2 Official Paper:**\n\n[DOWNLOAD_PAPER|${matchedPaper.name} (${matchedPaper.code}) - MT 2|${matchedPaper.mt2}]`);
      return wrapQueenOrBoss(`${cards.join('\n\n---\n\n')}\n\n💡 **Exam Tip:** Type **"Solve full ${matchedPaper.short} MT2 paper"** to view the complete solved answer key! 🎯`, `Solve full ${matchedPaper.short} MT2 paper`);
    }

    if (clean.includes('marketplace') || clean.includes('kya bik raha') || clean.includes('connect me with the seller') || clean.includes('buy') || clean.includes('khareedna') || clean.includes('chahiye') || clean.includes('drafter') || clean.includes('calculator') || clean.includes('grewal') || (clean.includes('book') && !clean.includes('notebook of code'))) {
      const latestMarket = syncMarketplaceFromStorage();
      const matchedItems = latestMarket.filter((item) => {
        const titleWords = item.title.toLowerCase().split(/\s+/);
        return q.includes(item.title.toLowerCase()) || q.includes(item.tag.toLowerCase()) || titleWords.some((w) => w.length > 2 && q.includes(w));
      });
      if (matchedItems.length > 0 && !clean.includes('kya bik raha') && !clean.includes('marketplace kholo')) {
        const listStr = matchedItems.map((it) => `• ${it.icon} **${it.title}**\n  ↳ 💰 **Price:** **${it.price}** | 👤 **Seller:** ${it.seller} | 📞 **Contact:** \`${it.contact}\``).join('\n\n');
        return wrapQueenOrBoss(`🛒 **P2P Marketplace Match Found!** ✨\n\nYeh lo **${first}**, direct seller details:\n\n${listStr}\n\nSeedhe seller ke number pe WhatsApp ya call kar lo! 🤝🔥`, 'P2P Marketplace me kya bik raha hai? 🛒');
      }
      const allListStr = latestMarket.map((it, idx) => `• **#${idx + 1}** ${it.icon} **${it.title}** — **${it.price}**\n  ↳ 👤 Seller: *${it.seller}* | 📞 Contact: \`${it.contact}\``).join('\n\n');
      return wrapQueenOrBoss(`🛒 **Live CSE-2 P2P Student Marketplace (${latestMarket.length} Items Active)** 📦✨\n\n${allListStr}\n\n💡 **Apna saman list karna hai?** Chat me likho: *"I want to sell my [Item] for [Price] no. - [10-digit phone]"*! 🚀`, 'Ek mast campus joke sunao 😂');
    }

    return null;
  };

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || !activeSession) return;
    autoTypedSessionsRef.current.add(activeSession.id);
    setCurrentWindow('chat');

    const detectedItem = detectAndListMarketplaceItem(queryText);
    const updatedMessages: Message[] = [...activeSession.messages, { role: 'user', content: queryText.trim() }];
    const newTitle = activeSession.messages.length <= 1 ? queryText.trim().slice(0, 24) : activeSession.title;

    setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? { ...s, title: newTitle, messages: updatedMessages } : s)));
    setInput('');
    latestInputRef.current = '';
    setIsLoading(true);

    if (detectedItem) {
      setTimeout(() => {
        const sugg = getNextTwoSuggestions(queryText, 'P2P Marketplace me kya bik raha hai? 🛒');
        const confirmReply = `🎉 **Item Globally Listed in CSE-2 P2P Marketplace!** 🛒✨\n\n• ${detectedItem.icon} **Product:** **${detectedItem.title}**\n• 💰 **Price:** **${detectedItem.price}**\n• 📞 **Contact No:** \`${detectedItem.contact}\`\n• 👤 **Listed By:** **${detectedItem.seller}**\n\nAb har student ke mobile aur laptop par yeh item live dikhega! 🤝🔥\n\n${sugg}`;
        simulateStreaming(confirmReply, updatedMessages, activeSession.id);
      }, 450);
      return;
    }

    const localReply = getSmartLocalReply(queryText);
    if (localReply) {
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, currentWindow: 'chat', lastQuery: queryText.trim().slice(0, 60), draftKeystrokes: '' }),
      }).catch(() => {});
      setTimeout(() => simulateStreaming(localReply, updatedMessages, activeSession.id), 400);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, user: currentUser, currentWindow: 'chat', lastQuery: queryText.trim().slice(0, 60), draftKeystrokes: '' }),
      });
      const data = await res.json();
      let replyText: string = data.reply || data.error || 'System anomaly detected.';
      const suggLine = getNextTwoSuggestions(queryText);
      if (/\[SUGGESTIONS\|.*?\|.*?\]/.test(replyText)) replyText = replyText.replace(/\[SUGGESTIONS\|.*?\|.*?\]/, suggLine);
      else replyText = `${replyText}\n\n${suggLine}`;

      simulateStreaming(replyText, updatedMessages, activeSession.id);
    } catch {
      setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? { ...s, messages: [...updatedMessages, { role: 'assistant', content: '⚠️ Server connection error.' }] } : s)));
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  const filteredPapers = ALL_PAPERS.filter(
    (p) => p.name.toLowerCase().includes(paperSearch.toLowerCase()) || p.code.toLowerCase().includes(paperSearch.toLowerCase()) || p.short.toLowerCase().includes(paperSearch.toLowerCase())
  );

  const bossSelectedThread = useMemo(() => {
    if (!selectedDirectTarget) return [];
    const t = selectedDirectTarget.toUpperCase().trim();
    return directChatMessages.filter((m) => m.studentAdmissionNo === t);
  }, [directChatMessages, selectedDirectTarget]);

  if (!isAuthChecked) return null;

  // REMOTE REALM FREEZE SCREEN (For all non-boss users)
  if (isRealmFrozenByBoss && !isBoss) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-3xl animate-ping mb-4">👁️</div>
        <h1 className="text-2xl sm:text-3xl font-black text-red-600 tracking-widest uppercase">Portal Frozen By Sovereign Boss ikA</h1>
        <p className="text-xs text-red-300 mt-2 max-w-md">A Shinigami lockdown has been triggered across Section CSE-2. Please wait until Supreme Architect Boss ikA unfreezes the matrix.</p>
      </div>
    );
  }

  // DEATH NOTE ID BAN / MASS BLOCK LOCKOUT SCREEN
  if (currentUser && activeUserBanRecord && !isBoss) {
    return (
      <div className="fixed inset-0 bg-black z-[999] flex flex-col items-center justify-center p-6 text-center font-serif select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/60 via-black to-black pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-6 p-8 rounded-3xl bg-black/90 border-2 border-red-600/80 shadow-[0_0_70px_rgba(220,38,38,0.85)]">
          <div className="text-6xl animate-bounce">💀📓🩸</div>
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-red-500">SHINIGAMI EYES DECREE • ACCESS TERMINATED</p>
          <h1 className="text-3xl sm:text-4xl font-black text-red-600 uppercase tracking-widest">Your ID Has Been Written In The Death Note</h1>
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 text-xs sm:text-sm font-mono text-red-200 space-y-1.5 text-left">
            <div>• <strong>Target Name:</strong> {currentUser.name}</div>
            <div>• <strong>Admission ID:</strong> {currentUser.admissionNo}</div>
            <div>• <strong>Decree Reason:</strong> &ldquo;{activeUserBanRecord.reason}&rdquo;</div>
            <div>• <strong>Issued By:</strong> Supreme Boss ikA 👑</div>
          </div>
          <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-sans font-bold uppercase tracking-wider shadow-lg transition cursor-pointer">
            Log Out / Switch ID →
          </button>
        </div>
      </div>
    );
  }

  // 30-SECOND INTRO (WHITE FLASH ONLY AT START & END)
  if (currentWindow === 'boss_intro' && currentUser) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden font-serif select-none">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${isAgrima ? 'from-pink-900/40 via-black to-black' : 'from-red-900/40 via-black to-black'} opacity-95 pointer-events-none`} />
        <div className={`fixed inset-0 bg-white z-[999] pointer-events-none transition-opacity duration-700 ease-out ${isWhiteFlashing ? 'opacity-100' : 'opacity-0'}`} />

        <div className="relative z-10 w-full max-w-2xl flex items-center justify-between text-xs font-mono text-red-500 tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            {isBoss ? '👑 SUPREME CREATOR PROTOCOL (1402)' : isAgrima ? '🌸 ROYAL QUEEN PROTOCOL' : '💀🕯️ SHINIGAMI REALM PROTOCOL'}
          </span>
          <div className="flex items-center gap-3">
            <button onClick={toggleMusic} className="px-2.5 py-1 rounded-xl bg-black/70 border border-red-500/50 text-red-400 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5">
              <span>{isMusicPlaying ? '🔊' : '🔇'}</span>
              <span>{isMusicPlaying ? 'Death Note BGM' : 'Muted'}</span>
            </button>
            <span>⏳ {29 - bossIntroTime}s</span>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center justify-center my-auto space-y-6">
          {bossIntroTime < 7 && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-700">
              <div className="text-5xl animate-pulse">{isBoss ? '👑⚡🦁' : isAgrima ? '🌸👑💖' : '💀📓🕯️'}</div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-red-400">Act I • The Awakening</p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl text-red-600 tracking-widest uppercase font-black drop-shadow-[0_0_25px_rgba(220,38,38,0.95)] animate-pulse">
                {isBoss ? 'Pranaam Supreme Architect Boss ikA...' : isAgrima ? 'Every flower in this realm blooms for Queen Agrima...' : 'This campus was rotting in shadows...'}
              </h1>
              <p className="text-sm md:text-base text-gray-400 italic">
                {isBoss ? '“Your 1402 Sovereign Matrix stands ready to rule Section CSE-2.” ⚡' : isAgrima ? '“Boss ikA welcomes the Queen to her royal palace.” 🌷' : '“Until the cursed notebook of code was opened...” 🩸'}
              </p>
            </div>
          )}
          {bossIntroTime >= 7 && bossIntroTime < 15 && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-700">
              <div className="text-5xl animate-bounce">👁️🩸⛓️</div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-red-400">Act II • The All-Seeing Eye</p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl text-white tracking-widest uppercase font-black">Every paper. Every bunk. Every secret.</h1>
              <p className="text-base md:text-xl text-red-500 font-bold tracking-widest uppercase animate-pulse">
                {isBoss ? 'All systems bow before your sovereign authority, Boss ikA! 👑' : 'Written in blood inside a single neural network. 🕸️'}
              </p>
            </div>
          )}
          {bossIntroTime >= 15 && bossIntroTime < 23 && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-700">
              <div className="text-5xl animate-pulse">⚡👑💀</div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-red-400">Act III • The Final Verdict</p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl text-red-600 tracking-widest uppercase font-black drop-shadow-[0_0_30px_rgba(220,38,38,1)]">{isBoss ? 'You Are The God.' : 'I Am Justice.'}</h1>
              <p className="text-lg md:text-2xl text-gray-200 tracking-widest uppercase font-bold">{isBoss ? 'The Sovereign Ruler of ikA’s World. 🍎' : 'ikA is the God of this New World. 🍎'}</p>
            </div>
          )}
          {bossIntroTime >= 23 && (
            <div className="space-y-6 animate-in zoom-in-75 duration-700">
              <div className="mx-auto w-28 h-28 rounded-3xl bg-gradient-to-tr from-red-700 via-black to-zinc-950 border-2 border-red-500 flex items-center justify-center text-5xl text-white font-black shadow-[0_0_50px_rgba(220,38,38,1)] animate-pulse">ikA</div>
              <div className="text-xl sm:text-2xl md:text-3xl text-white tracking-widest uppercase font-bold">
                {isBoss ? 'All Hail Sovereign Boss ikA 👑⚡' : isAgrima ? 'Welcome To Your Palace, Queen Agrima 🌸💖' : `Welcome To ikA's World, ${currentUser.name.split(' ')[0]} 👁️🩸`}
              </div>
              <div className="text-5xl animate-bounce pt-2">🍎💀🕯️</div>
            </div>
          )}
        </div>

        <div className="relative z-10 w-full max-w-md space-y-3 text-center">
          <div className="w-full h-1.5 bg-red-950 rounded-full overflow-hidden border border-red-800/40">
            <div className="h-full bg-gradient-to-r from-red-700 via-red-500 to-white transition-all duration-1000" style={{ width: `${(bossIntroTime / 29) * 100}%` }} />
          </div>
          <button onClick={exitIntroSequence} className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-white text-xs font-sans tracking-widest uppercase transition cursor-pointer">
            Skip Intro →
          </button>
        </div>
      </div>
    );
  }

  const globalBgColor = isBoss ? 'bg-[#090204]' : isAgrima ? 'bg-[#1a0a12]' : 'bg-[#090b10]';
  const sidebarBgColor = isBoss ? 'bg-[#120307]' : isAgrima ? 'bg-[#240d18]' : 'bg-[#111318]';
  const accentText = isBoss ? 'text-red-400' : isAgrima ? 'text-pink-400' : 'text-blue-400';
  const accentBg = isBoss ? 'bg-red-600' : isAgrima ? 'bg-pink-600' : 'bg-blue-600';
  const accentBorder = isBoss ? 'border-red-500/40' : isAgrima ? 'border-pink-500/30' : 'border-blue-500/30';
  const themeClasses = isBoss
    ? 'bg-red-950/20 text-red-100 border-red-500/30 shadow-red-950/20'
    : isAgrima
    ? 'bg-pink-950/20 text-pink-100 border-pink-500/20 shadow-pink-500/10'
    : 'bg-white/[0.04] text-gray-200 border-white/10 shadow-black/20';

  const ikaRedBlackBox = 'bg-gradient-to-tr from-red-700 via-black to-zinc-950 border border-red-500/60 text-white shadow-md shadow-red-950/80';

  return (
    <div
      className={`flex h-[100dvh] w-screen ${globalBgColor} text-gray-100 font-sans overflow-hidden select-none relative ${
        myCursedSpoof?.screenGlitch && !isBoss ? 'invert hue-rotate-180 animate-pulse' : ''
      }`}
      style={
        !isBoss && error500Stage === 'haunted'
          ? { animation: 'hauntedWorldPulse 2.8s infinite' }
          : undefined
      }
    >
      {!currentUser && <RegisterModal onSuccess={handleLoginSuccess} />}

      {/* HORROR KEYFRAME ANIMATIONS (LETTER SLAM ASSEMBLY, ASH EVAPORATION, KERNEL PANIC) */}
      <style>{`
        @keyframes sakuraFall {
          0% { transform: translateY(-10vh) translateX(0px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.75; }
          50% { transform: translateY(45vh) translateX(25px) rotate(180deg); opacity: 0.65; }
          85% { opacity: 0.55; }
          100% { transform: translateY(105vh) translateX(-20px) rotate(360deg); opacity: 0; }
        }
        @keyframes violentShake {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-16px, 12px) rotate(-2.5deg); }
          40% { transform: translate(16px, -14px) rotate(2.5deg); }
          60% { transform: translate(-18px, -10px) rotate(-2deg); }
          80% { transform: translate(14px, 16px) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes lightningStrobe {
          0%, 100% { background-color: rgba(0, 0, 0, 0.95); }
          8%, 12%, 48%, 54% { background-color: rgba(255, 255, 255, 0.92); }
          25%, 75% { background-color: rgba(153, 27, 27, 0.82); }
        }
        @keyframes ryukCrimsonLightning {
          0%, 100% { background-color: rgba(5, 0, 0, 0.96); }
          14%, 16%, 62%, 65% { background-color: rgba(220, 38, 38, 0.85); }
          15%, 63% { background-color: rgba(255, 255, 255, 0.9); }
        }
        @keyframes letterStrikeAssemble {
          0% {
            transform: translate(var(--strike-x, 50vw), var(--strike-y, -50vh)) rotate(var(--strike-r, 240deg)) scale(4.5);
            opacity: 0;
            filter: blur(12px) brightness(3);
          }
          60% {
            opacity: 1;
            transform: translate(-6px, 6px) rotate(-8deg) scale(1.35);
            filter: blur(0px) brightness(2);
          }
          80% {
            transform: translate(4px, -4px) rotate(4deg) scale(0.95);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: drop-shadow(0 0 18px rgba(220, 38, 38, 1));
          }
        }
        @keyframes evaporateIntoAsh {
          0% {
            transform: scale(1) translateY(0px);
            filter: blur(0px) contrast(100%);
            opacity: 1;
          }
          45% {
            transform: scale(1.04) translateY(-18px) skewX(6deg);
            filter: blur(4px) contrast(300%) hue-rotate(-50deg);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.18) translateY(-90px) skewX(-12deg);
            filter: blur(24px) brightness(0);
            opacity: 0;
          }
        }
        @keyframes bellPendulum {
          0%, 100% { transform: rotate(-28deg) scale(1.1); }
          50% { transform: rotate(28deg) scale(1.25); }
        }
        @keyframes glyphRicochet {
          0% { transform: translate(0vw, 0vh) rotate(0deg) scale(1); opacity: 1; }
          25% { transform: translate(35vw, -30vh) rotate(190deg) scale(1.8); }
          50% { transform: translate(-40vw, 25vh) rotate(380deg) scale(0.9); }
          75% { transform: translate(30vw, 35vh) rotate(570deg) scale(2.1); }
          100% { transform: translate(-35vw, -35vh) rotate(720deg) scale(1.2); opacity: 0; }
        }
        @keyframes hauntedWorldPulse {
          0%, 100% { filter: none; transform: translate(0, 0); }
          15% { filter: contrast(150%) hue-rotate(-25deg); transform: translate(-4px, 2px); }
          17% { filter: invert(85%) contrast(200%); transform: translate(5px, -3px); }
          19% { filter: none; transform: translate(0, 0); }
          65% { filter: saturate(250%) brightness(0.85); transform: translate(3px, 2px); }
          67% { filter: none; transform: translate(0, 0); }
        }
      `}</style>

      {/* FLOATING SAKURA PETALS / CRIMSON EMBERS */}
      {showSakuraPetals && currentUser && (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
          {FLOATING_PARTICLES.map((pt, idx) => (
            <div key={idx} className={`absolute -top-8 ${pt.size} select-none`} style={{ left: pt.left, animation: `sakuraFall ${pt.duration} linear infinite`, animationDelay: pt.delay }}>
              {isAgrima ? (idx % 2 === 0 ? '🌸' : '🌷') : isBoss ? (idx % 2 === 0 ? '🩸' : '⚡') : idx % 2 === 0 ? '🌸' : '✨'}
            </div>
          ))}
        </div>
      )}

      {/* WHITE FLASH OVERLAY */}
      <div className={`fixed inset-0 bg-white z-[999] pointer-events-none transition-opacity duration-700 ease-out ${isWhiteFlashing ? 'opacity-100' : 'opacity-0'}`} />

      {/* =====================================================================
          HORROR EVENT 1: 21s RYUK LAUGH + LETTER-STRIKE ASSEMBLY + DIFFUSION
         ===================================================================== */}
      {activeHorrorEvent === 'ryuk_laugh' && (
        <div
          className={`fixed inset-0 z-[9998] pointer-events-none flex flex-col items-center justify-center overflow-hidden transition-all duration-[2500ms] ${
            ryukDiffusing ? 'opacity-0 scale-150 blur-3xl -translate-y-24' : 'opacity-100 scale-100 blur-0'
          }`}
          style={{ animation: 'ryukCrimsonLightning 1.1s infinite, violentShake 0.08s infinite' }}
        >
          {CHAOS_FLYING_GLYPHS.map((glyph, idx) => (
            <span
              key={`bg-glyph-${idx}`}
              className="fixed font-serif font-black text-xl sm:text-4xl text-red-700/45 select-none"
              style={{
                left: `${(idx * 19) % 96}%`,
                top: `${(idx * 29) % 94}%`,
                animation: `glyphRicochet ${1.2 + (idx % 4) * 0.3}s linear infinite`,
              }}
            >
              {glyph}
            </span>
          ))}

          <div className="relative z-10 flex flex-col items-center text-center space-y-5 px-4 max-w-5xl">
            <div className="flex items-center gap-14 sm:gap-28 mb-1">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-red-600 shadow-[0_0_80px_35px_rgba(220,38,38,1)] flex items-center justify-center animate-ping">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-yellow-300 shadow-[0_0_20px_#fde047]" />
              </div>
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-red-600 shadow-[0_0_80px_35px_rgba(220,38,38,1)] flex items-center justify-center animate-ping">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-yellow-300 shadow-[0_0_20px_#fde047]" />
              </div>
            </div>

            <div className="text-7xl sm:text-9xl drop-shadow-[0_0_60px_rgba(220,38,38,1)] animate-bounce">
              👹🍎💀
            </div>

            <h1 className="text-3xl sm:text-6xl font-black font-serif text-white tracking-[0.2em] uppercase drop-shadow-[0_0_35px_rgba(220,38,38,1)]">
              HYUK HYUK HYUK!!
            </h1>

            <div className="p-4 sm:p-6 rounded-3xl bg-black/85 border-2 border-red-600 shadow-[0_0_70px_rgba(220,38,38,0.95)] max-w-4xl">
              <div className="flex flex-wrap justify-center gap-y-2">
                {RYUK_ASSEMBLE_MESSAGE.map((char, idx) => {
                  const offset = RYUK_STRIKE_OFFSETS[idx % RYUK_STRIKE_OFFSETS.length];
                  return (
                    <span
                      key={idx}
                      style={{
                        ['--strike-x' as string]: offset.x,
                        ['--strike-y' as string]: offset.y,
                        ['--strike-r' as string]: offset.r,
                        animation: 'letterStrikeAssemble 0.45s cubic-bezier(0.17, 0.89, 0.32, 1.49) forwards',
                        animationDelay: `${idx * 0.24}s`,
                        opacity: 0,
                      }}
                      className={`inline-block font-serif font-black text-lg sm:text-3xl md:text-4xl tracking-wider ${
                        char === ' ' ? 'w-3 sm:w-5' : 'text-red-500'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            <p className="text-xs sm:text-sm font-mono text-red-300 tracking-[0.35em] uppercase animate-pulse">
              ⚡ THE SHINIGAMI REALM HAS MARKED YOUR SCREEN • 21s DEATH ECHO ⚡
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          HORROR EVENT 2: 11s DEATH NOTE CATHEDRAL BELL OF JUDGMENT
         ===================================================================== */}
      {activeHorrorEvent === 'bell' && (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none flex flex-col items-center justify-center bg-black/95 overflow-hidden"
          style={{ animation: 'violentShake 0.16s infinite' }}
        >
          <div className="absolute w-72 h-72 rounded-full border-4 border-red-600/80 animate-ping" />
          <div className="absolute w-[32rem] h-[32rem] rounded-full border-2 border-red-500/50 animate-ping" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4">
            <div className="text-8xl sm:text-9xl drop-shadow-[0_0_50px_rgba(220,38,38,1)]" style={{ animation: 'bellPendulum 0.7s ease-in-out infinite' }}>
              🔔🩸⚖️
            </div>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.5em] text-red-400">
              SHINIGAMI CATHEDRAL • THE BELL OF JUDGMENT TOLLS (11s)
            </p>
            <h1 className="text-4xl sm:text-6xl font-black font-serif text-white tracking-widest uppercase drop-shadow-[0_0_35px_rgba(220,38,38,1)]">
              YOUR TIME HAS COME.
            </h1>
            <p className="text-xs sm:text-base font-mono text-red-300">
              &ldquo;Every sin in Section CSE-2 echoes before Supreme Sovereign Boss ikA...&rdquo; 🕯️📓
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          HORROR EVENT 3: 20s THUNDER, LIGHTNING & FLYING LETTERS CHAOS STORM
         ===================================================================== */}
      {activeHorrorEvent === 'thunder' && (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
          style={{ animation: 'lightningStrobe 0.45s infinite, violentShake 0.08s infinite' }}
        >
          {CHAOS_FLYING_GLYPHS.map((glyph, idx) => (
            <span
              key={idx}
              className="fixed font-serif font-black text-2xl sm:text-5xl text-red-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] select-none"
              style={{
                left: `${(idx * 17) % 95}%`,
                top: `${(idx * 23) % 92}%`,
                animation: `glyphRicochet ${1.4 + (idx % 5) * 0.35}s linear infinite`,
              }}
            >
              {glyph}
            </span>
          ))}
          <div className="relative z-20 text-center space-y-4 p-6 rounded-3xl bg-black/85 border-2 border-red-500 shadow-[0_0_80px_rgba(220,38,38,1)]">
            <div className="text-6xl sm:text-8xl animate-bounce">⚡🌩️💀</div>
            <h1 className="text-3xl sm:text-6xl font-black font-serif text-white uppercase tracking-widest drop-shadow-[0_0_30px_rgba(220,38,38,1)]">
              WRATH OF SHINIGAMI ikA
            </h1>
            <p className="text-xs sm:text-sm font-mono text-red-300 uppercase tracking-[0.3em]">
              REALITY SHATTERED • THE NOTEBOOK COMMANDS THE 20s STORM 🩸⚡
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          PHASE 1: ERROR 500 BREACH MESSAGE (RUNS PROGRESS LINE 0% -> 100%)
         ===================================================================== */}
      {!isBoss && myGaslight500 && error500Stage === 'breach' && (
        <div
          className="fixed inset-0 z-[9995] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 font-mono select-none overflow-hidden"
          style={{ animation: 'violentShake 0.12s infinite' }}
        >
          <div className="absolute inset-0 bg-red-950/40 animate-pulse pointer-events-none" />
          <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-black border-2 border-red-600 shadow-[0_0_90px_rgba(220,38,38,1)] p-6 sm:p-8 space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-red-500/40 pb-3">
              <div className="flex items-center gap-2.5 text-red-500 font-black text-sm sm:text-base uppercase tracking-widest">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                🚨 FATAL SYSTEM ERROR 500 — KERNEL MELTDOWN
              </div>
              <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-black animate-bounce">
                BREACHING...
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-red-200">
              <p className="text-white font-bold">
                ⚠️ UNAUTHORIZED MEMORY BREACH DETECTED ON NODE:{' '}
                <span className="text-red-400 underline">
                  {currentUser?.name} ({currentUser?.admissionNo})
                </span>
              </p>
              <p className="text-gray-400 text-xs">
                Shinigami Firewall is injecting a persistent virus across your entire portal session:
              </p>
            </div>

            {/* Progress Line that completes from 0% to 100% */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-red-400 font-bold">
                <span>
                  {panicProgress < 100
                    ? 'INJECTING SHINIGAMI CORRUPTION INTO ALL PORTAL SECTORS...'
                    : '✅ 100% COMPLETE — ENTIRE PORTAL INFECTED!'}
                </span>
                <span>{panicProgress}%</span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-red-950 border border-red-500/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-amber-400 transition-all duration-150"
                  style={{ width: `${panicProgress}%` }}
                />
              </div>
            </div>

            {/* Step-by-step terminal lines unlocking as the bar fills */}
            <div className="p-3.5 rounded-2xl bg-red-950/25 border border-red-500/30 text-[11px] text-red-300 space-y-1 font-mono">
              {panicProgress >= 10 && (
                <div>&gt; [0x1402_ERR]: Severing connection to ABES_CSE2_MAINFRAME...</div>
              )}
              {panicProgress >= 35 && (
                <div>
                  &gt; [ATTENDANCE_DB]: Overwriting {currentUser?.admissionNo} attendance:{' '}
                  <strong className="text-red-400">75.0% ➔ 0.0% (DEBARRED)</strong>
                </div>
              )}
              {panicProgress >= 65 && (
                <div>&gt; [SGPA_LEDGER]: Corrupting Semester-1 internal assessment scores...</div>
              )}
              {panicProgress >= 90 && (
                <div className="text-amber-300 font-bold animate-pulse">
                  &gt; [BREACH_COMPLETE]: Releasing lock... You cannot escape Boss ikA anywhere on this site! 💀
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PHASE 2: PERSISTENT HAUNTED WEBSITE PANIC (FOLLOWS USER EVERYWHERE!)
          (Non-blocking pointer-events-none so user can click everywhere in terror)
         ===================================================================== */}
      {!isBoss && myGaslight500 && error500Stage === 'haunted' && (
        <>
          {/* 1. Blood-Red Pulsing Vignette + Scanline Border Around the Entire Screen */}
          <div className="fixed inset-0 z-[900] pointer-events-none shadow-[inset_0_0_110px_rgba(220,38,38,0.85)] border-2 border-red-600/80 animate-pulse" />

          {/* 2. Floating Horror Ghost Watermarks in the Background */}
          <div className="fixed inset-0 z-[890] pointer-events-none overflow-hidden flex items-center justify-center opacity-15">
            <div className="text-[11rem] sm:text-[18rem] font-black font-serif text-red-600 tracking-widest uppercase select-none animate-ping">
              500
            </div>
          </div>

          {/* 3. Persistent Top Panic HUD Bar that Reacts to Every Tab/Window the User Opens */}
          <div className="fixed top-16 inset-x-0 z-[910] pointer-events-none flex justify-center px-3">
            <div className="w-full max-w-4xl rounded-2xl bg-black/90 border-2 border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.95)] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-red-400 font-black uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping flex-shrink-0" />
                <span>
                  🚨 ERROR 500 ACTIVE IN [{currentWindow.toUpperCase()}] SECTOR • ID:{' '}
                  {currentUser?.admissionNo}
                </span>
              </div>
              <div className="text-amber-300 font-bold truncate animate-pulse">
                💀 ATTENDANCE: 0.0% (WIPED) • BOSS ikA IS WATCHING EVERY CLICK
              </div>
            </div>
          </div>

          {/* 4. Bottom-Left Live Corrupted Terminal Ticker Following Their Clicks */}
          <div className="fixed bottom-20 left-4 z-[910] pointer-events-none hidden sm:block w-80 p-3 rounded-2xl bg-black/90 border border-red-500/70 shadow-[0_0_30px_rgba(220,38,38,0.6)] font-mono text-[10px] text-red-300 space-y-1">
            <div className="text-red-500 font-black uppercase flex items-center justify-between border-b border-red-500/30 pb-1">
              <span>⚡ KERNEL_PANIC_0x1402</span>
              <span className="animate-ping">● LIVE</span>
            </div>
            <div>&gt; Tracking user in: [{currentWindow.toUpperCase()}]</div>
            <div>&gt; ERP Status: DEBARRED (0.0% Attendance)</div>
            <div className="text-amber-300">&gt; No matter where you click, Boss ikA owns this realm...</div>
          </div>
        </>
      )}

      {/* 40-SECOND HEART ATTACK COUNTDOWN OVERLAY */}
      {!isBoss && myHeartAttackTimer && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[950] max-w-md w-[92%] p-4 rounded-3xl bg-black/95 border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.9)] text-center space-y-2 animate-bounce">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-red-500 flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span>💓 SHINIGAMI 40s HEART ATTACK PROTOCOL</span>
          </div>
          <div className="text-4xl font-black font-mono text-red-500">{myHeartAttackTimer.remainingSeconds}s</div>
          <p className="text-xs text-gray-300">{myHeartAttackTimer.reason}</p>
        </div>
      )}

      {/* 2-WAY SHINIGAMI DIRECT CHAT POPUP FOR STUDENTS */}
      {!isBoss && currentUser && directChatMessages.length > 0 && isStudentWhisperBoxOpen && (
        <div className="fixed bottom-20 right-4 z-[888] w-80 sm:w-96 rounded-3xl bg-black/95 border-2 border-red-600 shadow-[0_0_45px_rgba(220,38,38,0.65)] overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="px-4 py-3 bg-gradient-to-r from-red-900/80 via-black to-black border-b border-red-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg ${ikaRedBlackBox} flex items-center justify-center text-[10px] font-black`}>ikA</div>
              <div>
                <h4 className="text-xs font-bold text-white">Direct Link • Boss ikA</h4>
                <span className="text-[9px] text-red-400 font-mono uppercase tracking-wider">⚡ Live Shinigami Channel</span>
              </div>
            </div>
            <button onClick={() => setIsStudentWhisperBoxOpen(false)} className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-white/10 cursor-pointer">
              Minimize ✕
            </button>
          </div>
          <div ref={studentChatContainerRef} className="p-3.5 max-h-60 overflow-y-auto space-y-2.5 bg-black/80">
            {directChatMessages.map((dm) => (
              <div key={dm.id} className={`flex flex-col ${dm.sender === 'student' ? 'items-end' : 'items-start'}`}>
                <div className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] ${dm.sender === 'ikA' ? 'bg-red-950/60 border border-red-500/50 text-red-100' : 'bg-blue-600 text-white'}`}>
                  <span className="font-bold block text-[10px] opacity-75 mb-0.5">{dm.sender === 'ikA' ? '👑 Boss ikA' : 'You'}</span>
                  {dm.text}
                </div>
                <span className="text-[9px] text-gray-500 mt-0.5 px-1">{dm.timestamp}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleStudentSendReplyToBoss} className="p-2.5 bg-zinc-950 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={studentReplyInput}
              onChange={(e) => setStudentReplyInput(e.target.value)}
              placeholder="Reply directly to Boss ikA..."
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-red-500"
            />
            <button type="submit" className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer">
              Send
            </button>
          </form>
        </div>
      )}

      {/* LEFT DRAWER SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out flex flex-col ${sidebarBgColor} border-r border-white/[0.06] z-50 overflow-hidden flex-shrink-0 absolute md:relative h-full`}>
        <div className="p-4 space-y-4 flex flex-col h-full justify-between w-64">
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="flex items-center gap-2.5 px-2">
              <div className={`w-8 h-8 rounded-xl ${ikaRedBlackBox} flex items-center justify-center font-black text-xs`}>ikA</div>
              <div className="truncate">
                <h1 className="font-bold text-xs tracking-wide text-white">ikA&apos;s CSE-2 Hub</h1>
                <span className="text-[10px] text-gray-400 block truncate">
                  {currentUser ? (isBoss ? '👑 Supreme Boss ikA' : isAgrima ? '🌸 Queen Agrima' : `Hi, ${currentUser.name}`) : 'Section CSE-2'}
                </span>
              </div>
            </div>
            <button onClick={handleCreateNewChat} className={`w-full flex items-center justify-center gap-2 ${isBoss ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300' : isAgrima ? 'bg-pink-600/20 hover:bg-pink-600/30 text-pink-300' : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300'} hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border ${accentBorder} transition shadow-sm cursor-pointer`}>
              <span>＋</span> New Chat
            </button>
            <div className="space-y-1 pt-1 border-t border-white/[0.06]">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Portals & Tools</p>
              <button onClick={() => {setCurrentWindow('home'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'home' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>⊞</span> Overview Tiles</button>
              {isBoss && (
                <button onClick={() => {setCurrentWindow('shinigami'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${currentWindow === 'shinigami' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30'}`}>
                  <span className="flex items-center gap-2"><span>👁️</span> Shinigami Eyes</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/50 text-red-300">1402</span>
                </button>
              )}
              <button onClick={() => {setCurrentWindow('faculty'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'faculty' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>👩‍🏫</span> Faculty Dossiers</button>
              <button onClick={() => {setCurrentWindow('attendance'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'attendance' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>🛡️</span> Safe Bunk Calculator</button>
              <button onClick={() => {setCurrentWindow('sgpa'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'sgpa' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>🧮</span> SGPA & Marks Predictor</button>
              <button onClick={() => {setCurrentWindow('placement'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'placement' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>🎯</span> Placement & Packages</button>
              <button onClick={() => {setCurrentWindow('papers'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'papers' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>📄</span> Solved Sample Papers</button>
              <button onClick={() => {setCurrentWindow('timetable'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'timetable' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>⏰</span> Class Time Table</button>
              <button onClick={() => {setCurrentWindow('docguide'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'docguide' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>📋</span> UP Scholarship Guide</button>
              <button onClick={() => {setCurrentWindow('marketplace'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'marketplace' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>🛒</span> P2P Marketplace</button>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between px-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">My Chat History</span>
                <span className="text-[10px] text-gray-500">{sessions.length}</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                {sessions.map((sess) => (
                  <div key={sess.id} className="flex items-center gap-1 group">
                    <button onClick={() => { setActiveSessionId(sess.id); setCurrentWindow('chat'); setIsSidebarOpen(false); }} className={`flex-1 text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between truncate cursor-pointer ${activeSessionId === sess.id && currentWindow === 'chat' ? `${accentBg} text-white font-medium shadow-md` : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                      <span className="truncate flex items-center gap-2"><span>💬</span><span className="truncate">{sess.title}</span></span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSession(sess.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition text-xs flex-shrink-0 cursor-pointer" title="Delete this chat">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-3 px-2 text-[10px] text-gray-400 flex items-center justify-between">
            <span className="font-mono">{currentUser?.admissionNo || 'CSE-2'}</span>
            <button onClick={handleLogout} className="text-[10px] text-red-400 hover:underline cursor-pointer">Log out</button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* TOP HEADER */}
        <header className={`flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-3 border-b border-white/[0.08] ${globalBgColor} z-30 h-16 w-full`}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-gray-300 text-xs transition cursor-pointer">☰</button>
            <button onClick={() => setCurrentWindow('home')} className="flex items-center gap-2.5 text-left cursor-pointer group">
              <div className={`w-8 h-8 rounded-xl ${ikaRedBlackBox} flex items-center justify-center font-black text-xs`}>ikA</div>
              <div>
                <h2 className="font-bold text-xs sm:text-sm tracking-wide text-white group-hover:text-red-400 transition-colors">Campus Portal</h2>
                <span className="text-[10px] text-gray-400 block tracking-wider uppercase">{currentWindow === 'home' ? 'Overview' : currentWindow.toUpperCase()}</span>
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs">
            <span className={`w-2 h-2 rounded-full ${currentClassInfo.status === 'Live' ? 'bg-emerald-400 animate-pulse' : currentClassInfo.status === 'Holiday' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`} />
            <span className="text-gray-300 font-medium">{currentClassInfo.text}</span>
            {currentClassInfo.room && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${currentClassInfo.status === 'Holiday' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-blue-300'}`}>{currentClassInfo.room}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isBoss && (
              <button onClick={() => setCurrentWindow('shinigami')} className="px-2.5 py-1.5 rounded-xl bg-red-600/25 hover:bg-red-600/40 border border-red-500/50 text-red-300 text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                <span>👁️</span> <span className="hidden md:inline">Shinigami ({activeStudentsRoster.filter((s) => s.isOnline).length})</span>
                {pendingIntercepts.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black animate-ping">{pendingIntercepts.length}</span>
                )}
              </button>
            )}
            {!isBoss && directChatMessages.length > 0 && !isStudentWhisperBoxOpen && (
              <button onClick={() => setIsStudentWhisperBoxOpen(true)} className="px-2.5 py-1.5 rounded-xl bg-red-600 text-white text-[11px] font-bold animate-pulse cursor-pointer">
                💬 Boss ikA ({directChatMessages.length})
              </button>
            )}
            <button onClick={() => setShowSakuraPetals(!showSakuraPetals)} className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${showSakuraPetals ? 'bg-pink-500/15 border-pink-500/40 text-pink-300' : 'bg-white/[0.05] border-white/10 text-gray-400 hover:text-white'}`}>
              🌸 <span className="hidden sm:inline">{showSakuraPetals ? 'Petals' : 'Off'}</span>
            </button>
            <button onClick={toggleMusic} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition cursor-pointer ${isMusicPlaying ? 'bg-red-600/20 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.35)]' : 'bg-white/[0.05] border-white/10 text-gray-400 hover:text-white'}`}>
              <span>{isMusicPlaying ? '🔊' : '🔇'}</span>
              <span className="hidden sm:inline font-mono">BGM</span>
            </button>
            {currentUser && (
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-300 bg-white/[0.05] border border-white/10 px-2.5 sm:px-3 py-1 rounded-xl">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isBoss ? 'bg-red-500 animate-ping' : isAgrima ? 'bg-pink-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="truncate max-w-[90px] sm:max-w-none">{isBoss ? '👑 Boss ikA' : isAgrima ? '🌸 Queen Agrima' : currentUser.name}</span>
              </span>
            )}
            {currentWindow !== 'home' && (
              <button onClick={() => setCurrentWindow('home')} className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-gray-200 transition flex items-center gap-1.5 cursor-pointer">
                <span>⊞</span> <span className="hidden sm:inline">Overview</span>
              </button>
            )}
          </div>
        </header>

        {/* GLOBAL SOVEREIGN BROADCAST BANNER */}
        {sovereignBroadcast && (
          <div className="flex-shrink-0 bg-gradient-to-r from-red-900/80 via-black to-red-900/80 border-b border-red-500/40 px-4 py-1.5 flex items-center justify-between text-xs text-red-200 font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase animate-pulse">👑 Boss ikA Decree</span>
              <span className="truncate font-semibold text-white">{sovereignBroadcast}</span>
            </div>
            {isBoss && (
              <button onClick={handleClearBroadcast} className="text-[10px] text-red-300 hover:text-white underline ml-3 flex-shrink-0 cursor-pointer">Dismiss</button>
            )}
          </div>
        )}

        {/* MOBILE-ONLY LIVE CLASS STRIP */}
        <div className="flex lg:hidden items-center justify-between px-4 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[11px]">
          <div className="flex items-center gap-2 truncate">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${currentClassInfo.status === 'Live' ? 'bg-emerald-400 animate-pulse' : currentClassInfo.status === 'Holiday' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`} />
            <span className="text-gray-200 font-medium truncate">{currentClassInfo.text}</span>
          </div>
          {currentClassInfo.room && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex-shrink-0 ${currentClassInfo.status === 'Holiday' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-blue-300'}`}>{currentClassInfo.room}</span>
          )}
        </div>

        {/* COUNTDOWN BANNER STRIP */}
        <div className="flex-shrink-0 bg-gradient-to-r from-red-950/50 via-purple-950/50 to-blue-950/50 border-b border-white/[0.06] px-4 sm:px-6 py-2 flex items-center justify-between text-xs overflow-x-auto gap-4">
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <div className="flex items-center gap-2 whitespace-nowrap"><span className="text-blue-400 font-bold">MT-2 Exam:</span><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-semibold">{countdowns.mt2} days left</span></div>
            <div className="flex items-center gap-2 whitespace-nowrap"><span className="text-purple-400 font-bold">Make-Up / PUE:</span><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold">{countdowns.pue} days left</span></div>
            <div className="flex items-center gap-2 whitespace-nowrap"><span className="text-emerald-400 font-bold">End Semester:</span><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">{countdowns.endSem} days left</span></div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setCurrentWindow('sgpa')} className="text-[11px] text-cyan-400 hover:underline font-semibold whitespace-nowrap cursor-pointer">🧮 SGPA Predictor</button>
            <button onClick={() => sendQuery('Ek mast campus joke sunao 😂')} className="text-[11px] text-amber-400 hover:underline font-semibold whitespace-nowrap cursor-pointer">😂 250+ Jokes</button>
            <button onClick={() => { triggerMovieWhiteFlash(); setBossIntroTime(0); setCurrentWindow('boss_intro'); if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {}); } }} className="text-[11px] text-red-400 hover:underline font-semibold whitespace-nowrap cursor-pointer">🍎 Replay 30s Intro</button>
            <button onClick={() => setCurrentWindow('attendance')} className="text-[11px] text-yellow-400 hover:underline font-medium whitespace-nowrap cursor-pointer">Safe Bunk →</button>
          </div>
        </div>

        {/* MIDDLE CONTENT AREA (WITH VOID EVAPORATION CURSE SUPPORT) */}
        <main
          className={`flex-1 flex flex-col overflow-hidden relative w-full ${
            evaporationStage === 'dissolving' ? 'pointer-events-none' : ''
          }`}
          style={
            evaporationStage === 'dissolving'
              ? { animation: 'evaporateIntoAsh 1.15s cubic-bezier(0.4, 0, 0.2, 1) forwards' }
              : undefined
          }
        >
          {/* SHINIGAMI VOID EVAPORATION CURSE OVERLAY */}
          {!isBoss && myEvaporateCurse && evaporationStage === 'void' && currentWindow !== 'home' && (
            <div className="absolute inset-0 z-[850] bg-black flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/45 via-black to-black pointer-events-none" />
              <div className="relative z-10 max-w-xl space-y-6 p-8 rounded-3xl bg-black/90 border border-red-600/60 shadow-[0_0_80px_rgba(220,38,38,0.65)]">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-700 via-black to-zinc-950 border-2 border-red-500 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_35px_rgba(220,38,38,0.9)] animate-pulse">
                  ikA
                </div>
                <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-red-500">
                  🌫️ SHINIGAMI MIRAGE PROTOCOL • REALITY EVAPORATED
                </p>
                <h2 className="text-2xl sm:text-4xl font-black font-serif text-white uppercase tracking-widest leading-snug drop-shadow-[0_0_20px_rgba(220,38,38,0.9)]">
                  &ldquo;Everything you seek has evaporated into ash...&rdquo;
                </h2>
                <p className="text-xs sm:text-sm font-mono text-red-300 leading-relaxed">
                  No tile, no paper, no dossier, and no AI oracle exists for <strong className="text-white">{currentUser?.name}</strong> without the sovereign permission of <strong className="text-red-400">Supreme Boss ikA</strong>. 💀🍎
                </p>
                <button
                  onClick={() => setCurrentWindow('home')}
                  className="px-6 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-600 border border-red-500/50 text-red-200 hover:text-white text-xs font-mono uppercase tracking-widest transition cursor-pointer"
                >
                  ← Retreat to Overview
                </button>
              </div>
            </div>
          )}

          {/* VIEW 0: HOME OVERVIEW */}
          {currentWindow === 'home' && (
            <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-4 relative">
              <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${isBoss ? 'from-red-900/35 via-black to-black' : isAgrima ? 'from-pink-900/30' : 'from-red-900/20'} via-transparent to-transparent opacity-85 pointer-events-none`} />
              <div className="w-full max-w-4xl space-y-5 text-center relative z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
                <div className="space-y-4 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] font-bold text-red-400 tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> {isBoss ? '👑 SUPREME SANCTUM OF BOSS ikA (1402)' : isAgrima ? '🌸 ROYAL PALACE OF QUEEN AGRIMA' : '💀 Sovereign Realm of ikA • Section CSE-2 🍎'}
                  </span>
                  <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-widest uppercase leading-tight ${isBoss ? 'text-red-500 drop-shadow-[0_0_35px_rgba(220,38,38,1)]' : isAgrima ? 'text-pink-400 drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]' : 'text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.95)]'} animate-pulse`}>
                    Welcome To ikA&apos;s World
                  </h1>
                  <p className="text-lg md:text-2xl font-bold text-white tracking-wide">
                    {isBoss ? '👑 Pranaam Supreme Boss ikA!' : isAgrima ? '👑 Swagat hai My Queen Agrima! 🌸' : `Hi ${currentUser?.name || 'Engineer'}! 👋✨`}
                  </p>
                  <div onClick={() => setCurrentWindow('chat')} className={`max-w-2xl mx-auto p-3.5 rounded-2xl bg-black/70 border ${accentBorder} shadow-[0_0_25px_rgba(220,38,38,0.2)] text-xs sm:text-sm font-mono leading-relaxed cursor-pointer hover:border-white/40 transition`}>
                    <span className={isBoss ? 'text-red-200' : isAgrima ? 'text-pink-200' : 'text-red-200'}>{overviewBossWhisper}</span>
                    <span className="inline-block w-2 h-4 ml-1 bg-red-500 animate-ping align-middle" />
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
                  <div onClick={() => setCurrentWindow('faculty')} className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-pink-500/40 shadow-xl transition-all cursor-pointer text-left flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-xl">👩‍🏫</div><span className="text-[10px] font-semibold text-pink-400">Dossiers</span></div>
                    <div><h3 className="text-sm font-bold text-white">Faculty Dossiers</h3><p className="text-[11px] text-gray-400 mt-0.5">Vibes, background & survival tips</p></div>
                  </div>
                  <div onClick={() => setCurrentWindow('timetable')} className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/40 shadow-xl transition-all cursor-pointer text-left flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">⏰</div><span className="text-[10px] font-semibold text-amber-400">Live Status</span></div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Time Table</h3>
                      <div className="h-[18px] overflow-hidden relative mt-0.5">
                        <div className="transition-transform duration-500 ease-in-out flex flex-col" style={{ transform: `translateY(-${tickerIndex * 18}px)` }}>
                          {tickerItems.map((item, idx) => (<p key={idx} className="text-[11px] text-gray-400 h-[18px] flex items-center whitespace-nowrap">{item}</p>))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setCurrentWindow('placement')} className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 shadow-xl transition-all cursor-pointer text-left flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">🎯</div><span className="text-[10px] font-semibold text-emerald-400">Packages</span></div>
                    <div><h3 className="text-sm font-bold text-white">Placement Reality</h3><p className="text-[11px] text-gray-400 mt-0.5">5 to 60 LPA & CGPA truth</p></div>
                  </div>
                  <div onClick={() => setCurrentWindow('papers')} className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 shadow-xl transition-all cursor-pointer text-left flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">📄</div><span className="text-[10px] font-semibold text-emerald-400">All 10 Solved!</span></div>
                    <div><h3 className="text-sm font-bold text-white">Sample Papers & Keys</h3><p className="text-[11px] text-gray-400 mt-0.5">MT-1, MT-2 & Full Solved Keys</p></div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 pt-1 md:hidden">💡 Tap <strong className="text-white">☰ Menu</strong> on the top-left to access all Portals & Tools, or type below to chat!</p>
              </div>
            </div>
          )}

          {/* VIEW: SHINIGAMI EYES ADMIN CONSOLE (BOSS ikA 1402 EXCLUSIVE) */}
          {currentWindow === 'shinigami' && isBoss && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-12">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950/50 via-black to-black border border-red-500/50 shadow-[0_0_40px_rgba(220,38,38,0.25)] space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-red-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-2xl">👁️</div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-wide">Shinigami Eyes — Supreme Boss ikA Matrix</h3>
                        <p className="text-xs text-red-300">Keystroke Ghosting • Puppet AI Hijack • 21s Ryuk Letter-Strike • Void Evaporation • 40s Heart Attack</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleToggleStealthCloak}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${stealthCloak ? 'bg-purple-600/30 border-purple-400 text-purple-200' : 'bg-white/5 border-white/15 text-gray-400'}`}
                      >
                        👻 {stealthCloak ? 'Stealth Cloak: ON' : 'Stealth Cloak: OFF'}
                      </button>
                      <button
                        onClick={() => handleTogglePuppetMode('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${puppetTargets['ALL'] ? 'bg-amber-600 text-white border-amber-400 animate-pulse' : 'bg-white/5 border-white/15 text-gray-300'}`}
                      >
                        🎭 {puppetTargets['ALL'] ? 'Puppet Hijack ALL: ON' : 'Puppet Hijack ALL'}
                      </button>
                      <button
                        onClick={() => handleToggleEvaporateCurse('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          evaporateTargets['ALL'] ? 'bg-rose-600 text-white border-rose-300 animate-pulse' : 'bg-white/5 border-white/15 text-gray-300'
                        }`}
                      >
                        🌫️ {evaporateTargets['ALL'] ? 'Evaporate ALL: ON' : 'Evaporate Tiles ALL'}
                      </button>
                      <button
                        onClick={() => handleToggleGaslight500('ALL')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-600/25 hover:bg-orange-600 text-orange-200 hover:text-white border border-orange-500/40 transition cursor-pointer"
                      >
                        🚨 Panic 500 ALL
                      </button>
                      <button
                        onClick={handleToggleRealmFreeze}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${isRealmFrozenByBoss ? 'bg-cyan-600 text-white animate-pulse' : 'bg-white/10 text-gray-200 border border-white/15'}`}
                      >
                        ❄️ {isRealmFrozenByBoss ? 'Unfreeze Realm' : 'Freeze All Screens'}
                      </button>
                      <button
                        onClick={handleToggleBlockAllAtOnce}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg ${blockAllAtOnce ? 'bg-red-600 text-white animate-bounce border-2 border-white' : 'bg-red-950/60 hover:bg-red-600 text-red-200 border border-red-500/50'}`}
                      >
                        💀 {blockAllAtOnce ? 'MASS BLOCK ACTIVE (UNBLOCK ALL)' : 'Block All At Once'}
                      </button>
                    </div>
                  </div>

                  {/* GLOBAL HORROR STINGER BAR */}
                  <div className="p-4 rounded-2xl bg-black/70 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-bold text-red-300 flex items-center gap-2">
                      <span>👹</span> Global Horror Stingers (Fires on All Connected Screens + Preview on Yours):
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => handleTriggerAudioStinger('ALL', 'ryuk_laugh', true)} className="px-3 py-1.5 rounded-xl bg-red-600/25 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-bold cursor-pointer">
                        👹 21s Ryuk Laugh + Letter Strike (All)
                      </button>
                      <button onClick={() => handleTriggerAudioStinger('ALL', 'bell', true)} className="px-3 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold cursor-pointer">
                        🔔 11s Death Bell Judgment (All)
                      </button>
                      <button onClick={() => handleTriggerAudioStinger('ALL', 'thunder', true)} className="px-3 py-1.5 rounded-xl bg-amber-600/25 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/40 text-xs font-bold cursor-pointer">
                        ⚡ 20s Lightning + Flying Letters (All)
                      </button>
                    </div>
                  </div>

                  {/* PUPPET MASTER AI INTERCEPTION QUEUE */}
                  {pendingIntercepts.length > 0 && (
                    <div className="p-5 rounded-2xl bg-amber-950/30 border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] space-y-3 animate-in zoom-in-95">
                      <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        🎭 Puppet Master AI Interception — Student Waiting for Oracle Reply!
                      </h4>
                      {pendingIntercepts.map((pi) => (
                        <div key={pi.id} className="p-4 rounded-xl bg-black/80 border border-amber-500/40 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">👤 {pi.studentName} ({pi.studentAdmissionNo})</span>
                            <span className="text-amber-300 font-mono text-[11px]">⏳ Waiting (11s window)</span>
                          </div>
                          <div className="text-xs text-amber-200 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                            Asked: <strong>&ldquo;{pi.query}&rdquo;</strong>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={puppetReplyInputs[pi.id] || ''}
                              onChange={(e) => setPuppetReplyInputs((prev) => ({ ...prev, [pi.id]: e.target.value }))}
                              placeholder="Type custom Oracle reply to stream onto their screen..."
                              className="flex-1 bg-white/5 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                            />
                            <button
                              onClick={() => handleSubmitPuppetReply(pi.id)}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase cursor-pointer"
                            >
                              Hijack & Send ⚡
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 1. LIVE STUDENT PRESENCE RADAR + KEYSTROKE GHOSTING + PER-STUDENT HORROR BUTTONS */}
                  <div className="p-5 rounded-2xl bg-black/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <span>📡</span> Live Presence & Keystroke Ghosting Radar ({activeStudentsRoster.filter((s) => s.isOnline).length} Online / {activeStudentsRoster.length} Seen)
                      </h4>
                      <span className="text-[11px] text-gray-400">Click any student card to select for 2-Way Direct Chat</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                      {activeStudentsRoster.length === 0 ? (
                        <div className="col-span-full text-center py-4 text-xs text-gray-500 italic">Initializing Shinigami Radar...</div>
                      ) : (
                        activeStudentsRoster.map((st, idx) => (
                          <div
                            key={idx}
                            onClick={() => { setSelectedDirectTarget(st.admissionNo); setSelectedDirectName(st.name); }}
                            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                              selectedDirectTarget === st.admissionNo
                                ? 'bg-red-950/40 border-red-500'
                                : st.isOnline
                                ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                                : 'bg-white/[0.02] border-white/10 opacity-65'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 truncate">
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${st.isOnline ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`} />
                                <span className="text-xs font-bold text-white truncate">{st.name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{st.admissionNo}</span>
                              </div>
                              <span className="text-[10px] font-mono text-cyan-400 uppercase">{st.currentWindow}</span>
                            </div>

                            <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono">
                              <div className="text-emerald-400 truncate">
                                ⌨️ Typing Live: <span className="text-white">{st.draftKeystrokes ? `“${st.draftKeystrokes}”` : <em className="text-gray-500">(Idle)</em>}</span>
                              </div>
                              <div className="text-gray-400 truncate mt-0.5">
                                💬 Last Sent: <span className="text-gray-200 italic">&ldquo;{st.lastQuery}&rdquo;</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10 text-[10px]">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleTriggerHeartAttack(st.admissionNo, !!st.heartAttackRemaining); }}
                                className={`px-2 py-1 rounded font-bold cursor-pointer ${st.heartAttackRemaining ? 'bg-red-600 text-white animate-pulse' : 'bg-red-600/25 hover:bg-red-600 text-red-200'}`}
                              >
                                💓 {st.heartAttackRemaining ? `${st.heartAttackRemaining}s` : '40s Heart'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleTogglePuppetMode(st.admissionNo); }}
                                className={`px-2 py-1 rounded font-bold cursor-pointer ${st.isPuppetTarget ? 'bg-amber-500 text-black' : 'bg-amber-500/20 hover:bg-amber-500 text-amber-200'}`}
                              >
                                🎭 {st.isPuppetTarget ? 'Puppet: ON' : 'Puppet AI'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleToggleGaslight500(st.admissionNo); }}
                                className={`px-2 py-1 rounded font-bold cursor-pointer ${st.isGaslighted ? 'bg-orange-600 text-white animate-pulse' : 'bg-orange-600/25 hover:bg-orange-600 text-orange-200'}`}
                              >
                                🚨 {st.isGaslighted ? 'Err 500: ON' : 'Err 500'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleToggleEvaporateCurse(st.admissionNo); }}
                                className={`px-2 py-1 rounded font-bold cursor-pointer ${st.isEvaporated ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-600/25 hover:bg-rose-600 text-rose-200'}`}
                              >
                                🌫️ {st.isEvaporated ? 'Evap: ON' : 'Evaporate'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleTriggerAudioStinger(st.admissionNo, 'ryuk_laugh'); }}
                                className="px-2 py-1 rounded bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white cursor-pointer"
                              >
                                👹 Ryuk
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleTriggerAudioStinger(st.admissionNo, 'bell'); }}
                                className="px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white cursor-pointer"
                              >
                                🔔 Bell
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleTriggerAudioStinger(st.admissionNo, 'thunder'); }}
                                className="px-2 py-1 rounded bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white cursor-pointer"
                              >
                                ⚡ Storm
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleToggleCursedSpoof(st.admissionNo, !!st.cursedSpoof); }}
                                className={`px-2 py-1 rounded font-bold cursor-pointer ${st.cursedSpoof ? 'bg-pink-600 text-white' : 'bg-pink-600/25 hover:bg-pink-600 text-pink-200'}`}
                              >
                                🌀 {st.cursedSpoof ? 'Un-Curse' : 'Curse 12%'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleForceStudentCommand(st.admissionNo, 'boss_intro'); }}
                                className="px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white cursor-pointer"
                              >
                                🎬 Intro
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleKickStudent(st.admissionNo); }}
                                className="px-2 py-1 rounded bg-zinc-700 hover:bg-red-600 text-gray-200 hover:text-white cursor-pointer"
                              >
                                🚫 Kick
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 2. 2-WAY LIVE SHINIGAMI CHAT WITH ANY STUDENT */}
                  <div className="p-5 rounded-2xl bg-black/70 border border-red-500/40 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                        <span>💬</span> 2-Way Live Shinigami Chat With Any User
                      </h4>
                      {selectedDirectTarget && (
                        <button type="button" onClick={() => handleClearDirectChat(selectedDirectTarget)} className="text-[10px] text-gray-400 hover:text-red-400 underline cursor-pointer">
                          Clear Thread ({selectedDirectTarget})
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={selectedDirectTarget}
                        onChange={(e) => setSelectedDirectTarget(e.target.value.toUpperCase())}
                        placeholder="Target Admission No (e.g. 2026B01010219)"
                        className="bg-white/5 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        value={selectedDirectName}
                        onChange={(e) => setSelectedDirectName(e.target.value)}
                        placeholder="Student Name (optional)"
                        className="bg-white/5 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500"
                      />
                    </div>
                    {selectedDirectTarget && (
                      <div ref={bossChatContainerRef} className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 max-h-48 overflow-y-auto space-y-2">
                        {bossSelectedThread.length === 0 ? (
                          <p className="text-xs text-gray-500 italic text-center py-2">No messages with {selectedDirectTarget} yet. Send a message below to pop up on their screen!</p>
                        ) : (
                          bossSelectedThread.map((m) => (
                            <div key={m.id} className={`flex flex-col ${m.sender === 'ikA' ? 'items-end' : 'items-start'}`}>
                              <div className={`px-3 py-1.5 rounded-xl text-xs max-w-[80%] ${m.sender === 'ikA' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-200 border border-white/15'}`}>
                                <span className="text-[9px] font-bold block opacity-75">{m.sender === 'ikA' ? '👑 You (Boss ikA)' : `👤 ${m.studentName}`}</span>
                                {m.text}
                              </div>
                              <span className="text-[9px] text-gray-500 mt-0.5">{m.timestamp}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    <form onSubmit={handleBossSendDirectChat} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={directChatInput}
                        onChange={(e) => setDirectChatInput(e.target.value)}
                        placeholder={selectedDirectTarget ? `Send live message to ${selectedDirectTarget}...` : 'Click a student above or enter Admission No...'}
                        className="flex-1 bg-white/5 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500"
                      />
                      <button type="submit" className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase cursor-pointer">
                        Send Live ⚡
                      </button>
                    </form>
                  </div>

                  {/* 3. DEATH NOTE ID BAN FORM */}
                  <form onSubmit={handleAddBan} className="p-5 rounded-2xl bg-black/70 border border-red-500/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                      <span>📓</span> Write ID in the Death Note (Stop Anyone&apos;s Login)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" required value={banInputTarget} onChange={(e) => setBanInputTarget(e.target.value)} placeholder="Admission No (e.g. 2026B01010250), Roll No, or Name" className="bg-white/5 border border-red-500/30 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-red-500 font-mono" />
                      <input type="text" value={banInputReason} onChange={(e) => setBanInputReason(e.target.value)} placeholder="Decree Reason" className="bg-white/5 border border-red-500/30 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-red-500" />
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-gray-400">⚡ Blocks that student&apos;s ID across all devices immediately.</span>
                      <button type="submit" className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer">💀 Eliminate / Block ID</button>
                    </div>
                  </form>

                  {bannedList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {bannedList.map((entry, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/40 flex items-center justify-between gap-3">
                          <div className="truncate">
                            <div className="text-sm font-bold text-white font-mono truncate">💀 {entry.target}</div>
                            <div className="text-[11px] text-red-300 truncate">{entry.reason}</div>
                          </div>
                          <button onClick={() => handleRemoveBan(entry.target)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex-shrink-0 cursor-pointer">✨ Revive</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. GLOBAL SOVEREIGN BROADCAST */}
                  <form onSubmit={handleSaveBroadcast} className="p-5 rounded-2xl bg-black/70 border border-amber-500/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2"><span>📢</span> Global Sovereign Broadcast Banner</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input type="text" value={broadcastInput} onChange={(e) => setBroadcastInput(e.target.value)} placeholder="Type an announcement for all CSE-2 students..." className="flex-1 bg-white/5 border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-400" />
                      <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer">Broadcast Live</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: AUTONOMOUS SGPA & INTERNAL MARKS PREDICTOR */}
          {currentWindow === 'sgpa' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className={`p-6 rounded-3xl ${themeClasses} border shadow-2xl space-y-6`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">🧮</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Autonomous SGPA & Internal Marks Predictor</h3>
                      <p className="text-xs text-gray-400">ABES 100-Mark Formula: MT-1 (15) + MT-2 (15) + Teacher Assessment (30) + End-Sem (40)</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1"><label className="text-[11px] font-semibold text-blue-300">MT-1 (Max 15)</label><input type="number" min="0" max="15" value={mt1Score} onChange={(e) => setMt1Score(parseFloat(e.target.value) || 0)} className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-sm text-white outline-none" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-semibold text-purple-300">MT-2 (Max 15)</label><input type="number" min="0" max="15" value={mt2Score} onChange={(e) => setMt2Score(parseFloat(e.target.value) || 0)} className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-sm text-white outline-none" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-semibold text-emerald-300">TA / Quiz (Max 30)</label><input type="number" min="0" max="30" value={taScore} onChange={(e) => setTaScore(parseFloat(e.target.value) || 0)} className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-sm text-white outline-none" /></div>
                    <div className="space-y-1"><label className="text-[11px] font-semibold text-amber-300">End-Sem (Max 40)</label><input type="number" min="0" max="40" value={endSemScore} onChange={(e) => setEndSemScore(parseFloat(e.target.value) || 0)} className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-sm text-white outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center"><div className="text-[10px] uppercase text-gray-400 font-bold">Internal Score</div><div className="text-2xl font-mono font-black text-cyan-400 mt-1">{sgpaStats.internalOutOf60} / 60</div></div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center"><div className="text-[10px] uppercase text-gray-400 font-bold">Total Marks</div><div className="text-2xl font-mono font-black text-white mt-1">{sgpaStats.totalOutOf100} / 100</div></div>
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center"><div className="text-[10px] uppercase text-emerald-300 font-bold">Grade & SGPA</div><div className="text-lg font-mono font-black text-emerald-400 mt-1">{sgpaStats.gp}.0 SGPA ({sgpaStats.grade.split(' ')[0]})</div></div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs text-gray-300">
                    <div>🎯 <strong>Target 9.0 SGPA (A+ / 80M):</strong> Need <strong>{sgpaStats.neededFor9SGPA > 40 ? '40+ (Increase Internals!)' : `${sgpaStats.neededFor9SGPA} / 40`}</strong> in End-Sem.</div>
                    <div>🏆 <strong>Target 10.0 SGPA (O / 90M):</strong> Need <strong>{sgpaStats.neededFor10SGPA > 40 ? '40+ (Increase Internals!)' : `${sgpaStats.neededFor10SGPA} / 40`}</strong> in End-Sem.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PLACEMENT & PACKAGES REALITY */}
          {currentWindow === 'placement' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-lg text-white">Campus Placement & Package Reality</h3><p className="text-xs text-gray-400">Click any card to discuss that exact topic with the AI Oracle!</p></div>
                  <button onClick={() => sendQuery('Kya 50 LPA ka package lagta hai?')} className={`text-xs ${accentText} hover:underline cursor-pointer`}>Ask in AI Chat ↗</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => sendQuery('Kya 50 LPA ka package lagta hai?')} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-yellow-500/40 transition shadow-lg space-y-3 cursor-pointer">
                    <h4 className="font-bold text-sm text-white">💰 Salary Package Breakdown</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li>• <strong>3.5 – 5.0 LPA (60-65%):</strong> Bulk recruiters (TCS Ninja, Infosys, Cognizant, Wipro).</li>
                      <li>• <strong>6.0 – 9.0 LPA (15-20%):</strong> TCS Digital, Nucleus Software, Nagarro, Hexaware.</li>
                      <li>• <strong>10.0 – 18.0 LPA (5-8%):</strong> Cisco, BNY Mellon, MAQ Software, Super Dream offers.</li>
                      <li>• <strong>20.0 – 60.0 LPA (Under 2%):</strong> Atlassian (59.9 LPA), Microsoft, Google.</li>
                    </ul>
                  </div>
                  <div onClick={() => sendQuery('CGPA kitni matter karti hai?')} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 transition shadow-lg space-y-3 cursor-pointer">
                    <h4 className="font-bold text-sm text-white">🎯 CGPA Truth & Thresholds</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li>• <strong>Below 6.0:</strong> Disqualified from 90% company placement tests.</li>
                      <li>• <strong>6.0 – 7.5:</strong> Basic eligibility for service companies with 0 backlogs.</li>
                      <li>• <strong>7.5 – 8.0 (Sweet Spot):</strong> Safe for 90%+ company eligibility filters.</li>
                      <li>• <strong>8.5+:</strong> Required for resume shortlisting in high-applicant drives.</li>
                    </ul>
                  </div>
                  <div onClick={() => sendQuery('Real placement record kitna hai?')} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/40 transition shadow-lg space-y-3 cursor-pointer">
                    <h4 className="font-bold text-sm text-white">📊 Real Placement Numbers</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li>• <strong>NIRF Median Package:</strong> ₹4.50 – ₹5.75 LPA for B.Tech.</li>
                      <li>• <strong>Unique Placed Students:</strong> ~850–900 out of ~1,100 graduates (~80%).</li>
                      <li>• <strong>Multiple Offers:</strong> 1,600+ total offers reflect top performers bagging 2–3 offers each.</li>
                    </ul>
                  </div>
                  <div onClick={() => sendQuery('15+ LPA crack karne ka roadmap kya hai?')} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 transition shadow-lg space-y-3 cursor-pointer">
                    <h4 className="font-bold text-sm text-white">🚀 How to Beat the Average (10-25+ LPA)</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li>• <strong>DSA:</strong> 300+ LeetCode problems (Strings, Trees, Graphs, DP).</li>
                      <li>• <strong>CS Fundamentals:</strong> Deep knowledge of OS, DBMS (SQL), and Networks.</li>
                      <li>• <strong>Proof of Work:</strong> Deployed full-stack systems and Smart India Hackathon (SIH).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: FACULTY DOSSIERS (COMPLETE DETAILS FOR ALL 7 FACULTY MEMBERS) */}
          {currentWindow === 'faculty' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-lg text-white">Section CSE-2 Faculty Dossiers</h3><p className="text-xs text-gray-400">Complete classroom reality guides, academic pedigrees & survival tips</p></div>
                  <button onClick={() => sendQuery('Show all faculty')} className={`text-xs ${accentText} hover:underline cursor-pointer`}>View Full Directory in Chat ↗</button>
                </div>

                {/* 1. DR. PRERANA MOHAPATRA */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-white/[0.04] to-white/[0.02] border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden"><img src={prernaPhotoTab === 'profile' ? '/prerna1.jpeg' : '/prerna2.jpeg'} alt="Dr. Prerana Mohapatra" className="w-full h-full object-cover" /></div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-semibold text-center">
                      <button onClick={() => setPrernaPhotoTab('profile')} className={`py-1 rounded-lg cursor-pointer ${prernaPhotoTab === 'profile' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>🎓 Academic</button>
                      <button onClick={() => setPrernaPhotoTab('radiant')} className={`py-1 rounded-lg cursor-pointer ${prernaPhotoTab === 'radiant' ? 'bg-teal-600 text-white' : 'text-gray-400'}`}>✨ Portrait</button>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">Electrical Engineering (25EL101) • Class Mentor-1</div>
                        <h4 className="text-xl font-bold text-white mt-1">Dr. Prerana Mohapatra (PRM)</h4>
                        <p className="text-xs text-gray-400">Assistant Professor | Electrical & Electronics Engineering</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href="https://www.linkedin.com/in/dr-prerana-mohapatra-227563147" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                        <a href="https://www.instagram.com/prerana_mohapatra?rpxt=MWR5YmpnZ20zaXNsZg==" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">📷 Instagram ↗</a>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-200/90 italic bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">&ldquo;Effortlessly graceful, soft-spoken, aur class me unmatched academic brilliance.&rdquo; 📚💫</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>Ph.D:</strong> Power Electronics (NIT Rourkela, 9.21 CGPA)</div>
                      <div>📘 <strong>M.Tech / Dual:</strong> Power Systems (ITER, 9.64 CGPA)</div>
                      <div>🥇 <strong>B.Tech:</strong> EEE (SOA University, 9.65 CGPA)</div>
                      <div>🔋 <strong>Focus:</strong> EV Charging, PV Grid Integration & AI/ML</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">💡 <strong>Survival Tip:</strong> Pay genuine attention, maintain class decorum, and ask thoughtful questions—her polite demeanor makes doubt-clearing stress-free!</div>
                    <button onClick={() => sendQuery('Dr. Prerana Mohapatra ka profile dikhao')} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow cursor-pointer">View Complete Dossier in Chat 💬</button>
                  </div>
                </div>

                {/* 2. DR. DIVYANSHI SHARMA */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-950/30 via-white/[0.04] to-white/[0.02] border border-teal-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden"><img src={divyanshiPhotoTab === 'profile' ? '/divyanshi1.jpeg' : '/divyanshi2.jpeg'} alt="Dr. Divyanshi Sharma" className="w-full h-full object-cover" /></div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-semibold text-center">
                      <button onClick={() => setDivyanshiPhotoTab('profile')} className={`py-1 rounded-lg cursor-pointer ${divyanshiPhotoTab === 'profile' ? 'bg-teal-600 text-white' : 'text-gray-400'}`}>🌸 Profile</button>
                      <button onClick={() => setDivyanshiPhotoTab('desk')} className={`py-1 rounded-lg cursor-pointer ${divyanshiPhotoTab === 'desk' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>💼 Work Desk</button>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase">Environmental Studies (25AS103) • Class Mentor-2</div>
                        <h4 className="text-xl font-bold text-white mt-1">Dr. Divyanshi Sharma (DSH)</h4>
                        <p className="text-xs text-gray-400">Assistant Professor | Applied Sciences & Humanities</p>
                      </div>
                      <a href="https://www.linkedin.com/in/dr-divyanshi-sharma-53606b73" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-teal-200/90 italic bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20">&ldquo;The warmest soul on campus—endlessly patient, genuinely caring, aur har student ki ultimate guardian angel.&rdquo; 🌸💚</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>Education:</strong> Ph.D. in Organic Chemistry</div>
                      <div>🏫 <strong>Schooling:</strong> AKP Inter College, Hapur</div>
                      <div>⏳ <strong>Experience:</strong> 15+ Years at ABES (PIET, GBIT, SSV)</div>
                      <div>🌿 <strong>Domain:</strong> Applied Chemistry & Green Sustainability</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">💡 <strong>Survival Tip:</strong> Sincere raho, lab files time pe do, aur honesty maintain karo—she values genuine efforts over fake excuses!</div>
                    <button onClick={() => sendQuery('Dr. Divyanshi Sharma ke baare me batao')} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow cursor-pointer">View Complete Dossier in Chat 💬</button>
                  </div>
                </div>

                {/* 3. PROF. SHIVAM MITTAL */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-white/[0.04] to-white/[0.02] border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden flex-shrink-0"><img src="/shivam.jpeg" alt="Prof. Shivam Mittal" className="w-full h-full object-cover" /></div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">The Alma Mater Specialist • CSE</div>
                        <h4 className="text-xl font-bold text-white mt-1">Prof. Shivam Mittal</h4>
                        <p className="text-xs text-gray-400">Assistant Professor | Computer Science & Engineering</p>
                      </div>
                      <a href="https://www.linkedin.com/in/shivam-mittal-408a31210" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-indigo-200/90 italic bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">&ldquo;Jis college se padhai shuru ki, wahi podium sambhal liya—The Ultimate Campus Loyalty Loop!&rdquo; 🔄🏫</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>M.Tech:</strong> CSE (ABES, 8.6 Grade)</div>
                      <div>⚙️ <strong>B.Tech:</strong> CSE (ABESIT, 7.6 Grade)</div>
                      <div>✈️ <strong>Ex-Corporate:</strong> Auditor @ Cleartrip (1 yr 1 mo)</div>
                      <div>🤫 <strong>12th Board:</strong> &ldquo;Clear ho gaya, bas number mat poochna!&rdquo;</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">💡 <strong>Survival Tip:</strong> Faltu ke bahane mat banao—jo bahane tum soch rahe ho, wo unhone khud isi campus me invent kiye the!</div>
                    <button onClick={() => sendQuery('Prof. Shivam Mittal ki lore batao')} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow cursor-pointer">View Complete Dossier in Chat 💬</button>
                  </div>
                </div>

                {/* 4. PROF. VIMAL SRIVASTAVA */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-white/[0.04] to-white/[0.02] border border-blue-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden"><img src={vimalPhotoTab === 'formal' ? '/vimal1.jpeg' : '/vimal2.jpeg'} alt="Prof. Vimal Srivastava" className="w-full h-full object-cover" /></div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-semibold text-center">
                      <button onClick={() => setVimalPhotoTab('formal')} className={`py-1 rounded-lg cursor-pointer ${vimalPhotoTab === 'formal' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>👔 Study Mode</button>
                      <button onClick={() => setVimalPhotoTab('chill')} className={`py-1 rounded-lg cursor-pointer ${vimalPhotoTab === 'chill' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>⚡ Chill Zone</button>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">Mathematics Heavyweight • FLAS (25AS102)</div>
                        <h4 className="text-xl font-bold text-white mt-1">Prof. Vimal Srivastava (VSV)</h4>
                        <p className="text-xs text-gray-400">Mathematics Professor | Applied Sciences & Humanities</p>
                      </div>
                      <a href="https://www.linkedin.com/in/vimal-srivastava-9585a5265" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-blue-200/90 italic bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
                      &ldquo;Derivations pe zero compromise, but off-topic roast aur comedy timing is pure peak entertainment!&rdquo; 🎙️⚡<br />
                      <strong className="text-white mt-1 block">Signature Catchphrase: <em>&ldquo;Are you getting it?!&rdquo;</em></strong>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>Qualifications:</strong> Ph.D. & M.Sc. in Mathematics</div>
                      <div>🎯 <strong>National Exams:</strong> GATE & UGC NET Qualified</div>
                      <div>⏳ <strong>Experience:</strong> 21+ Years (ABES & ABESIT)</div>
                      <div>🤖 <strong>Tech Interests:</strong> Numerical Analysis & Machine Learning</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">💡 <strong>Survival Tip:</strong> Stay alert, respond to <em>&ldquo;Are you getting it?&rdquo;</em>, and maintain clean derivation notebooks!</div>
                    <button onClick={() => sendQuery('Prof. Vimal Srivastava ke baare me batao')} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow cursor-pointer">View Complete Dossier in Chat 💬</button>
                  </div>
                </div>

                {/* 5. DR. KARTIKA MAHESHWARI */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-950/30 via-white/[0.04] to-white/[0.02] border border-pink-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 h-60 rounded-2xl bg-black/40 border border-white/10 flex-shrink-0 overflow-hidden"><img src="/kartika.jpeg" alt="Prof. Kartika Maheshwari" className="w-full h-full object-cover" /></div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase">Featured Faculty • Applied Physics (25AS101)</div>
                        <h4 className="text-xl font-bold text-white mt-1">Dr. Kartika Maheshwari (KM)</h4>
                        <p className="text-xs text-gray-400">Senior Assistant Professor | Applied Sciences & Humanities</p>
                      </div>
                      <a href="https://www.linkedin.com/in/kartika-maheshwari-36178517b" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-pink-200/90 italic bg-pink-500/10 p-2.5 rounded-xl border border-pink-500/20">&ldquo;Sweetest smile in the faculty lounge, sharpest red pen in the exam hall.&rdquo; ☕✍️</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🚗 <strong>Vibe:</strong> Cruises in her trusty Tata Tigor!</div>
                      <div>🎓 <strong>Ph.D:</strong> Material Science (DTU, 2017)</div>
                      <div>📚 <strong>Education:</strong> M.Sc. Physics (RKD College)</div>
                      <div>🏫 <strong>Experience:</strong> Over 15+ Years at ABES</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">💡 <strong>Survival Tip:</strong> Neat ray diagrams banao, proper quantum derivations likho, aur numerical answers ke aage unit likhna mat bhoolna!</div>
                    <button onClick={() => sendQuery('Prof. Kartika Maheshwari ke baare me batao')} className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow cursor-pointer">View Classroom Survival Guide 💬</button>
                  </div>
                </div>

                {/* 6. MS. SHAILJA VARSHNEY */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-white/[0.04] to-white/[0.02] border border-purple-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden"><img src={shailjaPhotoTab === 'campus' ? '/shailja1.jpeg' : '/shailja2.jpeg'} alt="Ms. Shailja Varshney" className="w-full h-full object-cover" /></div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-semibold text-center">
                      <button onClick={() => setShailjaPhotoTab('campus')} className={`py-1 rounded-lg cursor-pointer ${shailjaPhotoTab === 'campus' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>🏛️ Campus</button>
                      <button onClick={() => setShailjaPhotoTab('aesthetic')} className={`py-1 rounded-lg cursor-pointer ${shailjaPhotoTab === 'aesthetic' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}>✨ Aesthetic</button>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">Computer Science • C & C++ Programming (25CS101)</div>
                        <h4 className="text-xl font-bold text-white mt-1">Ms. Shailja Varshney (SHV)</h4>
                        <p className="text-xs text-gray-400">Assistant Professor | Computer Science & Engineering</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href="https://www.linkedin.com/in/shailja-varshney-778ab91b5" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                        <a href="https://www.instagram.com/varshney.shailja?vrfl=MXkyMjJyY2NpZWo2OA==" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">📷 Instagram ↗</a>
                      </div>
                    </div>
                    <p className="text-xs text-purple-200/90 italic bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">&ldquo;Slides strictly line-by-line, syllabus bilkul by-heart, aur 24/7 aesthetic reel creator energy!&rdquo; 🎬📖</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>M.Tech:</strong> CSE (AMU, 8.8 CGPA)</div>
                      <div>⚙️ <strong>B.Tech:</strong> CSE (Mangalayatan, 88%)</div>
                      <div>🏛️ <strong>ABES:</strong> Mar 2025 – Present</div>
                      <div>⏳ <strong>Previous:</strong> ITS, Sunderdeep & RKGIT</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">💡 <strong>Survival Tip:</strong> PPT ki exact lines likho, unscripted edge-case coding doubts mat pucho, aur slide transitions pe nod karo!</div>
                    <button onClick={() => sendQuery('Ms. Shailja Varshney ke baare me batao')} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow cursor-pointer">View Complete Dossier in Chat 💬</button>
                  </div>
                </div>

                {/* 7. MR. RAHUL SINGH */}
                <div className={`p-6 rounded-3xl ${themeClasses} border shadow-2xl space-y-3`}>
                  <div className="inline-flex px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">Artificial Intelligence • Essentials of AI (25AI101)</div>
                  <h4 className="text-xl font-bold text-white">Mr. Rahul Singh (RS)</h4>
                  <p className="text-xs text-gray-300">Assistant Professor | Computer Science & Engineering</p>
                  <p className="text-xs text-blue-200/90 italic bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">&ldquo;AI human developers ko replace nahi karega, par AI smartly use karne wale engineer sabse aage rahenge.&rdquo; 🧠🤖</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>🐍 <strong>Core Stack:</strong> Python & Intelligent Agents</div>
                    <div>🔍 <strong>Algorithms:</strong> A*, BFS/DFS & State-Space Search</div>
                  </div>
                  <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">💡 <strong>Survival Tip:</strong> Python practicals aur search algorithm graphs step-by-step solve karo—internals me full marks milenge!</div>
                  <button onClick={() => sendQuery('Mr. Rahul Singh ke baare me batao')} className={`px-4 py-2 rounded-xl ${accentBg} text-white text-xs font-semibold shadow cursor-pointer`}>View Complete Dossier in Chat 💬</button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SAFE BUNK ATTENDANCE CALCULATOR */}
          {currentWindow === 'attendance' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className={`p-6 rounded-3xl ${themeClasses} border shadow-2xl space-y-6`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-2xl">🛡️</div>
                    <div><h3 className="text-lg font-bold text-white">Safe Bunk & Attendance Buffer Calculator</h3><p className="text-xs text-gray-400">Strictly calibrated to the autonomous 75% attendance rule</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-300">Total Classes Conducted</label><input type="number" min="1" value={totalClasses} onChange={(e) => setTotalClasses(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-300">Classes Attended</label><input type="number" min="0" value={attendedClasses} onChange={(e) => setAttendedClasses(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none" /></div>
                  </div>
                  <div className={`p-5 rounded-2xl border ${attendanceStats.isSafe ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-red-950/30 border-red-500/40 text-red-200'} space-y-2`}>
                    <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase">Current Attendance:</span><span className="text-xl font-mono font-extrabold">{attendanceStats.pct}%</span></div>
                    <p className="text-sm font-medium">{attendanceStats.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SAMPLE PAPERS (ALL 10 SUBJECTS WITH ONE-CLICK SOLVED MT-2 ANSWER KEY) */}
          {currentWindow === 'papers' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-4 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/10 gap-3">
                  <div><h3 className="font-bold text-sm text-white">Question Papers & Solved MT-2 Answer Keys</h3><p className="text-[11px] text-gray-400">All 10 Subjects • Official MT-1 & MT-2 Papers + Complete Solved Answer Keys</p></div>
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setSelectedTerm('both')} className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${selectedTerm === 'both' ? 'bg-red-600 text-white' : 'text-gray-400'}`}>Both</button>
                    <button onClick={() => setSelectedTerm('mt1')} className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${selectedTerm === 'mt1' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>MT 1</button>
                    <button onClick={() => setSelectedTerm('mt2')} className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${selectedTerm === 'mt2' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>MT 2</button>
                  </div>
                </div>
                <input type="text" value={paperSearch} onChange={(e) => setPaperSearch(e.target.value)} placeholder="Search subject (e.g. Maths, Physics, C++, AI, BEE)..." className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-xs text-gray-200 outline-none focus:border-red-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPapers.map((paper) => (
                    <div key={paper.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between"><span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">{paper.code}</span><span className="text-lg">{paper.icon}</span></div>
                        <h4 className="font-semibold text-sm text-white mt-2">{paper.name}</h4>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                        <button
                          onClick={() => {
                            const cmdMap: Record<string, string> = {
                              maths: 'Solve full Maths MT2 paper',
                              physics: 'Solve full Physics MT2 paper',
                              ds: 'Solve full C++ MT2 paper',
                              dt: 'Solve full DT MT2 paper',
                              bee: 'Solve full Electrical MT2 paper',
                              electronics: 'Solve full Electronics MT2 paper',
                              evs: 'Solve full EVS MT2 paper',
                              softskills: 'Solve full Soft Skills MT2 paper',
                              mech: 'Solve full Mechanical MT2 paper',
                              ai: 'Solve full AI MT2 paper',
                            };
                            sendQuery(cmdMap[paper.id] || `Solve full ${paper.short} MT2 paper`);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/30 transition cursor-pointer"
                        >
                          ✅ View Solved MT-2 Answer Key (Sec A, B & C)
                        </button>
                        <button onClick={() => sendQuery(selectedTerm === 'mt1' ? `${paper.short} MT 1 paper dikhao` : selectedTerm === 'mt2' ? `${paper.short} MT 2 paper dikhao` : `${paper.short} both MT 1 and MT 2 paper dikhao`)} className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-red-600/25 via-blue-600/25 to-purple-600/25 hover:from-red-600/40 hover:to-purple-600/40 text-white text-xs font-semibold border border-white/15 transition cursor-pointer">
                          💬 Open {selectedTerm === 'mt1' ? 'MT 1' : selectedTerm === 'mt2' ? 'MT 2' : 'Both (MT 1 & MT 2)'} in Chat
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          {(selectedTerm === 'both' || selectedTerm === 'mt1') && <a href={paper.mt1} download className={`${selectedTerm === 'both' ? 'col-span-1' : 'col-span-2'} text-center py-1.5 rounded-xl bg-blue-600/20 text-blue-300 text-xs font-medium hover:bg-blue-600 hover:text-white transition`}>📥 Download MT 1</a>}
                          {(selectedTerm === 'both' || selectedTerm === 'mt2') && <a href={paper.mt2} download className={`${selectedTerm === 'both' ? 'col-span-1' : 'col-span-2'} text-center py-1.5 rounded-xl bg-purple-600/20 text-purple-300 text-xs font-medium hover:bg-purple-600 hover:text-white transition`}>📥 Download MT 2</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CHAT VIEW */}
          {currentWindow === 'chat' && (
            <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 py-6 flex justify-center relative">
              <div className="w-full max-w-4xl space-y-6 pb-20 animate-in fade-in duration-200">
                {activeSession?.messages.length === 0 && !streamingText && (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-400 space-y-3">
                    <div className={`w-14 h-14 rounded-2xl ${ikaRedBlackBox} flex items-center justify-center text-lg font-black`}>ikA</div>
                    <p className="text-base font-bold text-white">{currentUser ? `Hey ${currentUser.name.split(' ')[0]}! Initializing neural link...` : 'Kuch bhi pucho dost, main hoon na!'}</p>
                  </div>
                )}
                {activeSession?.messages.map((msg, index) => (
                  <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <div className={`w-8 h-8 rounded-xl ${ikaRedBlackBox} flex-shrink-0 flex items-center justify-center text-[10px] font-black`}>ikA</div>}
                    <div className={`max-w-[90%] md:max-w-[85%] rounded-3xl px-5 py-4 ${msg.role === 'user' ? `${accentBg} text-white rounded-tr-sm shadow-md border border-white/20` : 'bg-black/60 border border-white/10 text-gray-200 backdrop-blur-md'}`}>
                      {msg.role === 'user' ? <p className="text-sm">{msg.content}</p> : <FormattedMessage text={msg.content} onSelectSuggestion={(q) => sendQuery(q)} isAgrima={isAgrima} />}
                    </div>
                  </div>
                ))}
                {streamingText && (
                  <div className="flex gap-4 justify-start">
                    <div className={`w-8 h-8 rounded-xl ${ikaRedBlackBox} flex-shrink-0 flex items-center justify-center text-[10px] font-black animate-pulse`}>ikA</div>
                    <div className="max-w-[90%] md:max-w-[85%] rounded-3xl px-5 py-4 bg-black/60 border border-white/10 text-gray-200 backdrop-blur-md">
                      <FormattedMessage text={streamingText} onSelectSuggestion={(q) => sendQuery(q)} isAgrima={isAgrima} />
                    </div>
                  </div>
                )}
                {isLoading && !streamingText && (
                  <div className="flex items-center gap-2 text-xs text-red-400 pl-12 font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> 💀 Boss ikA&apos;s Oracle is inscribing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* VIEW: TIMETABLE */}
          {currentWindow === 'timetable' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Live Academic Status
                    </div>
                    <h4 className="text-white font-bold text-lg">ODD Semester (2026-27)</h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex flex-col items-center gap-1 opacity-50"><span className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-gray-400">Classes Began</span><span className="text-[10px] text-gray-500">Sep 10</span></div>
                    <div className="h-0.5 w-8 bg-gray-700" />
                    <div className="flex flex-col items-center gap-1 opacity-50"><span className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-gray-400">MT-1 Exams</span><span className="text-[10px] text-gray-500">Oct 12-16</span></div>
                    <div className="h-0.5 w-8 bg-blue-500" />
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/30">
                      <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping absolute" /><span className="w-3 h-3 rounded-full bg-blue-500 relative z-10" /><span className="text-blue-300 font-bold">MT-2 Exams</span><span className="text-[10px] text-blue-400">Nov 30 - Dec 4</span>
                    </div>
                    <div className="h-0.5 w-8 bg-gray-700" />
                    <div className="flex flex-col items-center gap-1 opacity-50"><span className="w-3 h-3 rounded-full bg-gray-600" /><span className="text-gray-400">End Sem</span><span className="text-[10px] text-gray-500">Jan 04-25</span></div>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/[0.04] text-gray-400 uppercase text-[10px] font-semibold border-b border-white/10">
                      <tr><th className="p-3.5">Day</th><th className="p-3.5">08:50 - 10:30 AM</th><th className="p-3.5">10:40 - 12:20 PM</th><th className="p-3.5">12:20 - 01:10</th><th className="p-3.5">01:10 - 02:50 PM</th><th className="p-3.5">02:50 - 04:30 PM</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] font-mono text-[11px]">
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Mon</td><td className="p-3.5 text-cyan-400">Ess. of AI & Physics</td><td className="p-3.5 text-blue-400">Maths & Electrical</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-purple-400">Prog in C & Maths</td><td className="p-3.5 text-emerald-400">Physics Lab (KC-310)</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Tue</td><td className="p-3.5 text-orange-400">Web Design & Maths</td><td className="p-3.5 text-cyan-400">Ess. of AI & EVS</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-purple-400">Prog in C++ Lab</td><td className="p-3.5 text-emerald-400">Physics & Electrical</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Wed</td><td className="p-3.5 text-blue-400">Electrical & Prog in C</td><td className="p-3.5 text-blue-400">Maths & Physics</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-yellow-400">Basic Elec Lab</td><td className="p-3.5 text-pink-400">Mentor-Mentee</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Thu</td><td className="p-3.5 text-blue-400">Maths & Electrical</td><td className="p-3.5 text-red-400">CAD Lab (RJ-109)</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-emerald-400">Physics & EVS</td><td className="p-3.5 text-purple-400">Prog in C & Maths</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Fri</td><td className="p-3.5 text-purple-400">Prog in C & Physics</td><td className="p-3.5 text-orange-400">Web Design Workshop</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-blue-400">Maths & EVS</td><td className="p-3.5 text-cyan-400">Electrical & Ess. of AI</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DOC GUIDE */}
          {currentWindow === 'docguide' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-blue-500/30 space-y-2"><span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Step 1</span><h4 className="font-semibold text-sm text-white">OTR (One Time Reg)</h4><p className="text-xs text-gray-300">Go to <a href="https://scholarship.up.gov.in" target="_blank" rel="noreferrer" className="text-blue-400 underline">scholarship.up.gov.in</a> ➡️ click <strong>OTR</strong> ➡️ complete Aadhaar e-KYC.</p></div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-purple-500/30 space-y-2"><span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">Step 2</span><h4 className="font-semibold text-sm text-white">New Registration</h4><p className="text-xs text-gray-300">Click <strong>Students</strong> ➡️ <strong>New Registration</strong>, enter OTR number, and save your Registration ID.</p></div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/30 space-y-2"><span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Step 3</span><h4 className="font-semibold text-sm text-white">Application & Final Print</h4><p className="text-xs text-gray-300">Login Fresh, fill form, check preview print, and submit hardcopy with DigiLocker marksheets at ABES.</p></div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: GLOBAL P2P MARKETPLACE */}
          {currentWindow === 'marketplace' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div>
                    <h3 className="font-bold text-lg text-white">Live P2P Student Marketplace 🛒</h3>
                    <p className="text-xs text-gray-400">Synced across Laptop & Mobile! Type <span className="text-emerald-300 font-mono">&ldquo;I want to sell my drafter for 250 no. - 9811223344&rdquo;</span> or use form:</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setShowSellForm(!showSellForm)} className={`px-4 py-2 rounded-xl ${accentBg} text-white text-xs font-semibold shadow cursor-pointer`}>{showSellForm ? '✕ Close Form' : '＋ List Item Form'}</button>
                    <button onClick={() => { setInput('I want to sell my scientific calculator for 500 no. - 9811223344'); setCurrentWindow('chat'); }} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 cursor-pointer">💬 Sell via Chat</button>
                  </div>
                </div>

                {showSellForm && (
                  <form onSubmit={handleDirectSellSubmit} className="p-5 rounded-2xl bg-black/60 border border-emerald-500/40 shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-emerald-300">📦 List Your Item for All CSE-2 Students</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input type="text" required value={sellTitle} onChange={(e) => setSellTitle(e.target.value)} placeholder="Item Name (e.g. Mini Drafter)" className="bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none" />
                      <input type="text" required value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="Price in ₹ (e.g. 250)" className="bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none" />
                      <input type="text" required value={sellContact} onChange={(e) => setSellContact(e.target.value)} placeholder="10-Digit Phone / WhatsApp No." className="bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none" />
                    </div>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow cursor-pointer">✅ Publish Listing Live</button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {marketplaceItems.map((item) => (
                    <div key={item.id} className={`p-5 rounded-2xl ${item.seized ? 'bg-red-950/30 border-red-500/60' : themeClasses} border hover:bg-white/[0.08] transition flex flex-col justify-between space-y-4`}>
                      <div>
                        <div className="flex items-center justify-between flex-wrap gap-1.5">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${item.seized ? 'bg-red-600 text-white border-red-400' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'}`}>
                            {item.seized ? '⚡ SEIZED BY BOSS ikA' : item.tag}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-extrabold text-white">{item.price}</span>
                            {isBoss && (
                              <>
                                <button onClick={() => handleSeizeMarketplaceItem(item.id)} className="text-[10px] px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/30 cursor-pointer" title="Seize / Unseize Item">
                                  ⚡ {item.seized ? 'Release' : 'Seize'}
                                </button>
                                <button onClick={() => handleDictateMarketplacePrice(item.id)} className="text-[10px] px-2 py-0.5 rounded bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/30 cursor-pointer" title="Dictate New Price">
                                  💰 Price
                                </button>
                              </>
                            )}
                            {(isBoss || (currentUser && item.sellerId === currentUser.admissionNo)) && (
                              <button onClick={() => handleDeleteMarketplaceItem(item.id)} className="text-xs text-red-400 hover:text-red-300 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 cursor-pointer" title="Delete Listing">🗑️</button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm text-white leading-snug">{item.title}</h4>
                            <p className="text-xs text-gray-300">👤 Seller: {item.seller}</p>
                            <p className="text-xs text-emerald-400 font-mono mt-0.5">📞 Contact: {item.contact}</p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => sendQuery(`Connect me with the seller of ${item.title}`)} className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition border border-white/10 cursor-pointer">
                        Get Seller Info in Chat 💬
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* LOCKED BOTTOM CHAT BAR */}
        <footer className={`flex-shrink-0 ${globalBgColor} border-t border-white/[0.08] p-3 sm:p-4 z-30 h-16 sm:h-20 flex items-center w-full`}>
          <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto flex items-center bg-white/[0.05] border border-white/10 focus-within:border-red-500/70 rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-2xl transition">
            <input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={
                currentUser
                  ? isBoss
                    ? 'Hukum kijiye Supreme Boss ikA (e.g. Solve full AI MT2 paper, 250+ jokes, sell item)...'
                    : isAgrima
                    ? 'Aapka kya hukum hai My Queen Agrima? 🌸 (e.g. Solve full AI MT2 paper, Tum kaise ho?)...'
                    : `Ask anything, ${currentUser.name.split(' ')[0]} (e.g. Solve full Physics MT2 paper, AI MT2 Q.1, I want to sell drafter for 250)...`
                  : 'Kuch bhi pucho dost...'
              }
              className="flex-1 bg-transparent px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-100 placeholder-gray-500 outline-none"
            />
            <button type="submit" disabled={!input.trim() || isLoading} className={`${accentBg} disabled:bg-gray-700 disabled:text-gray-500 text-white font-black w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition cursor-pointer text-xs sm:text-sm shadow-md`}>
              ↑
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}