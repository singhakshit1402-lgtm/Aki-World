import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import {
  getPushSubscriberCount,
  sendAnnouncementPushToAllDevices,
} from '@/lib/pushService';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================
export interface ActiveStudentState {
  admissionNo: string;
  name: string;
  rollNo?: number;
  group?: string;
  email: string;
  gender?: 'M' | 'F';
  residency?: string;
  currentWindow: string;
  lastQuery: string;
  lastSuggestion?: string;
  draftKeystrokes: string;
  lastSeen: number;
  isStealth?: boolean;
}

export interface DirectChatMessage {
  id: string;
  studentAdmissionNo: string;
  studentName: string;
  sender: 'ikA' | 'student';
  text: string;
  timestamp: string;
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

export interface BannedEntry {
  target: string;
  reason: string;
  timestamp: string;
}

export interface PendingIntercept {
  id: string;
  studentAdmissionNo: string;
  studentName: string;
  query: string;
  timestamp: number;
  customReply: string | null;
  resolved: boolean;
}

export interface CursedSpoofState {
  attendancePct?: number;
  attendanceMsg?: string;
  sgpaValue?: string;
  screenGlitch?: boolean;
}

export interface IkaRequestItem {
  id: string;
  studentAdmissionNo: string;
  studentName: string;
  rollNo?: number;
  text: string;
  category: string;
  usedSecretCode: boolean;
  timestamp: string;
  createdAtMs: number;
  status: 'pending' | 'granted' | 'denied';
  bossReply?: string;
}

interface PaperDef {
  id: string;
  subjectName: string;
  shortName: string;
  code: string;
  aliases: string[];
  mt1Files: string[];
  mt2Files: string[];
}

interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  seller: string;
  sellerId?: string;
  seized?: boolean;
  [key: string]: unknown;
}

interface ShinigamiMatrixStore {
  marketplace: MarketplaceItem[];
  broadcast: string;
  broadcastId: number;
  bans: BannedEntry[];
  blockAllAtOnce: boolean;
  realmFreeze: boolean;
  activeUsers: Record<string, ActiveStudentState>;
  directChats: DirectChatMessage[];
  kickedUsers: string[];
  forcedCommands: Record<string, string>;
  stealthCloak: boolean;
  puppetTargets: Record<string, boolean>;
  pendingIntercepts: Record<string, PendingIntercept>;
  heartAttackTimers: Record<string, { expiresAt: number; reason: string }>;
  gaslightTargets: Record<string, boolean>;
  audioStingerQueue: Record<string, string>;
  cursedSpoofs: Record<string, CursedSpoofState>;
  evaporateTargets: Record<string, boolean>;
  jokeCursor: number;
  ikaRequests: IkaRequestItem[];
  requestBoxSecretCode: string;
  studentCards: Record<string, StudentCardRecord>;
}

// ============================================================================
// PERSISTENT GLOBAL IN-MEMORY SHINIGAMI SERVER MATRIX
// ============================================================================
const g = globalThis as unknown as { __SHINIGAMI_MATRIX__?: ShinigamiMatrixStore };

if (!g.__SHINIGAMI_MATRIX__) {
  g.__SHINIGAMI_MATRIX__ = {
    marketplace: [
      { id: 'm1', title: 'Casio FX-991CW Scientific Calculator', price: '₹750', tag: 'Calculator', seller: 'Senior (3rd Year)', sellerId: 'SENIOR', contact: '9811223344', icon: '🧮', seized: false },
      { id: 'm2', title: 'Omega Mini Drafter with Sheet Roller Container', price: '₹280', tag: 'Drafter', seller: 'Mech Senior', sellerId: 'SENIOR', contact: '9877665544', icon: '📐', seized: false },
      { id: 'm3', title: 'Higher Engineering Mathematics (B.S. Grewal)', price: '₹400', tag: 'Book', seller: 'CSE 2nd Year', sellerId: 'SENIOR', contact: '9988776655', icon: '📚', seized: false },
      { id: 'm4', title: 'Engineering Graphics Drawing Kit + Roller Scale', price: '₹180', tag: 'Kit', seller: 'Hostel Block A', sellerId: 'SENIOR', contact: '9123456780', icon: '✏️', seized: false },
    ],
    broadcast: '',
    broadcastId: 0,
    bans: [],
    blockAllAtOnce: false,
    realmFreeze: false,
    activeUsers: {},
    directChats: [],
    kickedUsers: [],
    forcedCommands: {},
    stealthCloak: false,
    puppetTargets: {},
    pendingIntercepts: {},
    heartAttackTimers: {},
    gaslightTargets: {},
    audioStingerQueue: {},
    cursedSpoofs: {},
    evaporateTargets: {},
    jokeCursor: 0,
    ikaRequests: [],
    requestBoxSecretCode: 'IKA1402',
    studentCards: {},
  };
}

const MATRIX = g.__SHINIGAMI_MATRIX__;
if (!MATRIX.studentCards) MATRIX.studentCards = {};

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const MATRIX_FILE = isVercel
  ? path.join('/tmp', 'shinigami_matrix.json')
  : path.join(process.cwd(), 'data', 'shinigami_matrix.json');

function loadMatrixFromDisk(): void {
  try {
    if (fs.existsSync(MATRIX_FILE)) {
      const raw = fs.readFileSync(MATRIX_FILE, 'utf8');
      const loaded = JSON.parse(raw);
      if (loaded && typeof loaded === 'object') {
        if (Array.isArray(loaded.bans)) MATRIX.bans = loaded.bans;
        if (typeof loaded.blockAllAtOnce === 'boolean') MATRIX.blockAllAtOnce = loaded.blockAllAtOnce;
        if (typeof loaded.realmFreeze === 'boolean') MATRIX.realmFreeze = loaded.realmFreeze;
        if (typeof loaded.stealthCloak === 'boolean') MATRIX.stealthCloak = loaded.stealthCloak;
        if (loaded.heartAttackTimers && typeof loaded.heartAttackTimers === 'object') MATRIX.heartAttackTimers = loaded.heartAttackTimers;
        if (loaded.gaslightTargets && typeof loaded.gaslightTargets === 'object') MATRIX.gaslightTargets = loaded.gaslightTargets;
        if (loaded.evaporateTargets && typeof loaded.evaporateTargets === 'object') MATRIX.evaporateTargets = loaded.evaporateTargets;
        if (loaded.puppetTargets && typeof loaded.puppetTargets === 'object') MATRIX.puppetTargets = loaded.puppetTargets;
        if (loaded.cursedSpoofs && typeof loaded.cursedSpoofs === 'object') MATRIX.cursedSpoofs = loaded.cursedSpoofs;
        if (Array.isArray(loaded.marketplace)) MATRIX.marketplace = loaded.marketplace;
        if (typeof loaded.broadcast === 'string') MATRIX.broadcast = loaded.broadcast;
        if (typeof loaded.broadcastId === 'number') MATRIX.broadcastId = loaded.broadcastId;
        if (Array.isArray(loaded.ikaRequests)) MATRIX.ikaRequests = loaded.ikaRequests;
        if (typeof loaded.requestBoxSecretCode === 'string') MATRIX.requestBoxSecretCode = loaded.requestBoxSecretCode;
        if (loaded.studentCards && typeof loaded.studentCards === 'object') MATRIX.studentCards = loaded.studentCards;
      }
    }
  } catch (err) {
    console.error('Error loading shinigami matrix from disk:', err);
  }
}

function persistMatrixToDisk(): void {
  try {
    const dir = path.dirname(MATRIX_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const toSave = {
      marketplace: MATRIX.marketplace,
      broadcast: MATRIX.broadcast,
      broadcastId: MATRIX.broadcastId,
      bans: MATRIX.bans,
      blockAllAtOnce: MATRIX.blockAllAtOnce,
      realmFreeze: MATRIX.realmFreeze,
      stealthCloak: MATRIX.stealthCloak,
      heartAttackTimers: MATRIX.heartAttackTimers,
      gaslightTargets: MATRIX.gaslightTargets,
      evaporateTargets: MATRIX.evaporateTargets,
      puppetTargets: MATRIX.puppetTargets,
      cursedSpoofs: MATRIX.cursedSpoofs,
      ikaRequests: MATRIX.ikaRequests,
      requestBoxSecretCode: MATRIX.requestBoxSecretCode,
      studentCards: MATRIX.studentCards || {},
    };
    fs.writeFileSync(MATRIX_FILE, JSON.stringify(toSave, null, 2), 'utf8');
  } catch (err) {
    console.error('Error persisting shinigami matrix to disk:', err);
  }
}

loadMatrixFromDisk();

// ============================================================================
// COMPLETE SAMPLE PAPERS CATALOG (MT-1 & MT-2)
// ============================================================================
const SEM1_PAPERS: PaperDef[] = [
  { id: 'maths', subjectName: 'Fundamentals of Linear Algebra & Statistics', shortName: 'Maths / FLAS', code: '25AS102', aliases: ['linear algebra', 'statistics', 'flas', 'mathematics', 'maths', 'math', '25as102'], mt1Files: ['/papers/sem1/maths_mt1.jpg'], mt2Files: ['/papers/sem1/maths_mt2.jpg'] },
  { id: 'physics', subjectName: 'Applied Physics', shortName: 'Physics', code: '25AS101', aliases: ['applied physics', 'physics', 'phy', '25as101'], mt1Files: ['/papers/sem1/physics_mt1.jpg'], mt2Files: ['/papers/sem1/physics_mt2.jpg'] },
  { id: 'ds', subjectName: 'Data Structure / Programming in C++', shortName: 'DSA / C++', code: '25CS101', aliases: ['data structure', 'dsa', 'ds', 'c++', 'cpp', 'programming', '25cs101'], mt1Files: ['/papers/sem1/ds_mt1.jpg'], mt2Files: ['/papers/sem1/ds_mt2.jpg'] },
  { id: 'dt', subjectName: 'Design Thinking, Innovation & Entrepreneurship', shortName: 'Design Thinking', code: '25HU102', aliases: ['design thinking', 'dtie', 'dt', '25hu102'], mt1Files: ['/papers/sem1/dt_mt1.jpg'], mt2Files: ['/papers/sem1/dt_mt2.jpg'] },
  { id: 'bee', subjectName: 'Basics of Electrical Engineering', shortName: 'Electrical (BEE)', code: '25EL101', aliases: ['electrical engineering', 'electrical', 'bee', '25el101'], mt1Files: ['/papers/sem1/electrical_mt1.jpg'], mt2Files: ['/papers/sem1/electrical_mt2.jpg'] },
  { id: 'electronics', subjectName: 'Basics of Electronics Engineering', shortName: 'Electronics (BEC)', code: '25EC101', aliases: ['electronics', 'bec', 'ece', '25ec101'], mt1Files: ['/papers/sem1/electronics_mt1.jpg'], mt2Files: ['/papers/sem1/electronics_mt2.jpg'] },
  { id: 'evs', subjectName: 'Environment and Sustainability', shortName: 'EVS', code: '25AS103', aliases: ['environment', 'sustainability', 'evs', '25as103'], mt1Files: ['/papers/sem1/evs_mt1.jpg'], mt2Files: ['/papers/sem1/evs_mt2.jpg'] },
  { id: 'softskills', subjectName: 'Soft Skills', shortName: 'Soft Skills', code: '25HU101', aliases: ['soft skills', 'softskill', 'ss', 'english', '25hu101'], mt1Files: ['/papers/sem1/softskills_mt1.jpg'], mt2Files: ['/papers/sem1/softskills_mt2.jpg'] },
  { id: 'mech', subjectName: 'Basics of Mechanical & Automation Engineering', shortName: 'Mechanical', code: '25ME101', aliases: ['mechanical', 'bmae', 'fme', 'mech', '25me101'], mt1Files: ['/papers/sem1/mechanical_mt1.jpg'], mt2Files: ['/papers/sem1/mechanical_mt2.jpg'] },
  { id: 'ai', subjectName: 'Essentials of AI (Python & Agents)', shortName: 'Essentials of AI', code: '25AI101', aliases: ['essentials of ai', 'python', 'ai', '25ai101'], mt1Files: ['/papers/sem1/ai_mt1.jpg'], mt2Files: ['/papers/sem1/ai_mt2.jpg'] },
];

// ============================================================================
// COMPLETE FACULTY DOSSIERS (ALL 7 FACULTY MEMBERS)
// ============================================================================
const FACULTY_DOSSIERS: Record<string, string> = {
  prerna: `![Dr. Prerana Mohapatra (Academic Profile)](/prerna1.jpeg) ![Dr. Prerana Mohapatra (Radiant Look)](/prerna2.jpeg)

✨ **MEET DR. PRERANA MOHAPATRA (PRM)** ✨
*Assistant Professor & CSE-2 Class Mentor-1 | ABES Engineering College* ⚡🌸
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/dr-prerana-mohapatra-227563147) • 📸 [Instagram](https://www.instagram.com/prerana_mohapatra?rpxt=MWR5YmpnZ20zaXNsZg==)

> *"Effortlessly graceful, soft-spoken, aur class me unmatched academic brilliance!"* 📚💫

---
🌸 **THE VIBE (Elegance Meets Intellect)**
Sheer kindness aur academic royalty personified! 🌷 Inki class me kabhi wo terror wala mahaul nahi hota—calm, radiant, aur positive aura ke sath padhati hain.

🏆 **THE 9+ CGPA ACADEMIC MASTERCLASS (Education)**
• 🎓 **Ph.D. in Power Electronics** | NIT Rourkela (2019 – Jun 2025) | **9.21 CGPA** ⚛️
• 📘 **Dual Degree (Power Systems & Power Electronics)** | ITER, Bhubaneswar | **9.64 CGPA** ⚡
• 🥇 **B.Tech in Electrical & Electronics Engineering** | SOA University | **9.65 CGPA** 🏆
• 🔋 **Research Focus:** PV Grid Integration, EV Charging Stations Control, Smart Microgrids & AI/ML in Power Engineering

💡 **CLASSROOM SURVIVAL GUIDE**
• ✅ **The Golden Rule:** Class me genuine focus rakho aur polite raho. Doubt chahe kitna bhi basic ho, ma'am bina gussa huye bohot respectfully samjha dengi! 🙋‍♀️💡`,

  divyanshi: `![Dr. Divyanshi Sharma (Profile)](/divyanshi1.jpeg) ![Dr. Divyanshi Sharma (At Desk)](/divyanshi2.jpeg)

✨ **MEET DR. DIVYANSHI SHARMA (DSH)** ✨
*Assistant Professor & CSE-2 Class Mentor-2 | ABES Engineering College* 🧪🌿
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/dr-divyanshi-sharma-53606b73)

> *"The warmest soul on campus—endlessly patient, genuinely caring, aur har student ki ultimate guardian angel."* 🌸💚

---
🧪 **ACADEMIC MASTERY & 15+ YEARS DEDICATION**
• 🎓 **Ph.D. in Organic Chemistry** | Molecular bonds & green sustainability mastery ⚗️🔬
• 🏫 **Schooling:** AKP Inter College, Hapur 📚
• 🏛️ **ABES Engineering College:** Aug 2011 – Present *(15+ Years)*
• 💡 **Survival Tip:** Always be polite and truthful—she values honesty over fake excuses! 📝✨`,

  shivam: `![Prof. Shivam Mittal](/shivam.jpeg)

✨ **MEET PROF. SHIVAM MITTAL** ✨
*Assistant Professor | ABES Engineering College* 🎒➡️👔
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/shivam-mittal-408a31210)

> *"Jis college se padhai shuru ki, wahi podium sambhal liya—The Ultimate Campus Loyalty Loop!"* 🔄🏫

---
🎓 **THE ALMA MATER SPECIALIST**
• 🎓 **M.Tech in CSE** | ABES Engineering College (2024 – 2026) | **8.6 Grade** 📈💻
• ⚙️ **B.Tech in CSE** | ABESIT (2020 – 2024) | **7.6 Grade**
• ✈️ **Corporate Detour:** Ex-Auditor @ Cleartrip (1 yr 1 mo) 🧾✈️
• 💡 **Survival Tip:** Faltu ke bahane mat banao—jo bahane tum soch rahe ho, wo 2 saal pehle unhone isi campus me khud invent kiye the! 🧠🎯`,

  vimal: `![Prof. Vimal Srivastava (Formal)](/vimal1.jpeg) ![Prof. Vimal Srivastava (Chill Mode)](/vimal2.jpeg)

✨ **MEET PROF. VIMAL SRIVASTAVA (VSV)** ✨
*Mathematics Professor | ABES Engineering College* 📐♾️
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/vimal-srivastava-9585a5265)

> *"Derivations pe zero compromise, but off-topic roast aur comedy timing is pure peak entertainment!"* 🎙️⚡

---
🗣️ **SIGNATURE CATCHPHRASE:** ***"Are you getting it?!"*** 👀😂
• 🏅 **Qualifications:** Ph.D. & M.Sc. in Mathematics | **GATE & UGC NET Qualified** 🎯
• ⏳ **Experience:** 21+ Years of Teaching Experience (ABES & ABESIT) 🤖`,

  kartika: `![Prof. Kartika Maheshwari](/kartika.jpeg)

✨ **MEET DR. KARTIKA MAHESHWARI (KM)** ✨
*Senior Assistant Professor | ABES Engineering College* 🎓🔭
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/kartika-maheshwari-36178517b)

> *"Sweetest smile in the faculty lounge, sharpest red pen in the exam hall!"* ☕✍️

---
• 🚘 **Vibe:** Cruises to campus in her trusty **Tata Tigor**!
• 🎓 **Ph.D. in Material Science:** DTU (2017) | **15+ Years at ABES** 📈
• 💡 **Survival Tip:** Neat ray diagrams, proper quantum derivations, aur numerical answers ke aage unit likhna mat bhoolna! 📐✨`,

  shailja: `![Ms. Shailja Varshney (Campus Look)](/shailja1.jpeg) ![Ms. Shailja Varshney (Aesthetic Look)](/shailja2.jpeg)

✨ **MEET MS. SHAILJA VARSHNEY (SHV)** ✨
*Assistant Professor | ABES Engineering College* 💻📱
🔗 **Connect:** [LinkedIn](https://www.linkedin.com/in/shailja-varshney-778ab91b5) • 📸 [Instagram](https://www.instagram.com/varshney.shailja?vrfl=MXkyMjJyY2NpZWo2OA==)

> *"Slides strictly line-by-line, syllabus bilkul by-heart, aur 24/7 aesthetic reel creator energy!"* 🎬📖

---
• 🎓 **M.Tech in CSE:** AMU (8.8 CGPA) | **B.Tech in CSE:** Mangalayatan Univ (88%) 💻
• 💡 **Survival Tip:** PPT ki standard definitions ratta maar lo word-for-word—full marks pakke! 📝💯`,

  rahul: `✨ **MEET MR. RAHUL SINGH (RS)** ✨
*Assistant Professor (Artificial Intelligence) | ABES Engineering College* 🤖🐍

> *"AI human developers ko replace nahi karega, par AI smartly use karne wale engineer sabse aage rahenge."* 🧠⚡

• **Subject:** Essentials of AI (25AI101) — Python, A*, BFS/DFS & Intelligent Agents 🚀`,
};

// ============================================================================
// 250+ CAMPUS JOKES ENGINE
// ============================================================================
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
];

function build250ServerJokes(): string[] {
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

const ALL_SERVER_JOKES = build250ServerJokes();

// ============================================================================
// MAIN POST HANDLER
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = body.user || null;
    const rawEmail = (user?.email || '').toLowerCase().trim();
    const isBoss = rawEmail.startsWith('1402akshit') || rawEmail.includes('1402akshit.26b01010274@abes.ac.in');
    const isNormalAkshit = !isBoss && (user?.admissionNo === '2026B01010274' || rawEmail.startsWith('akshit.'));
    const isAgrima = user?.admissionNo === '2026B01010219' || rawEmail.includes('26b01010219');

    const currentAdm = (
      user?.admissionNo ||
      (rawEmail ? rawEmail.split('@')[0].replace(/^1402/, '').toUpperCase() : '') ||
      (user?.name ? user.name.toUpperCase().replace(/\s+/g, '_') : '')
    ).toUpperCase().trim();

    // Update Live Student Presence, Keystroke Ghosting & Suggestion Click Tracking
    if (user && currentAdm) {
      const stateKey = isBoss ? 'BOSS_IKA_1402' : currentAdm;
      const existing = MATRIX.activeUsers[stateKey];
      MATRIX.activeUsers[stateKey] = {
        admissionNo: currentAdm,
        name: isBoss ? '👑 Boss ikA (You)' : user.name || currentAdm,
        rollNo: user.rollNo,
        group: user.group || 'CSE-2',
        email: user.email || '',
        gender: user.gender,
        residency: user.residency,
        currentWindow: body.currentWindow || existing?.currentWindow || 'home',
        lastQuery: body.lastQuery || existing?.lastQuery || 'Active on Portal',
        lastSuggestion: body.lastSuggestion || existing?.lastSuggestion || '',
        draftKeystrokes: typeof body.draftKeystrokes === 'string' ? body.draftKeystrokes : existing?.draftKeystrokes || '',
        lastSeen: Date.now(),
        isStealth: isBoss ? MATRIX.stealthCloak : false,
      };
    }

    // Check 40-Second Heart Attack Timers
    const now = Date.now();
    Object.keys(MATRIX.heartAttackTimers).forEach((admKey) => {
      const timerObj = MATRIX.heartAttackTimers[admKey];
      if (timerObj && now >= timerObj.expiresAt) {
        const alreadyBanned = MATRIX.bans.some((b) => b.target.toUpperCase() === admKey);
        if (!alreadyBanned) {
          MATRIX.bans.unshift({
            target: admKey,
            reason: timerObj.reason || '40-Second Heart Attack Timer Completed — Eliminated by Boss ikA 💀',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
        delete MATRIX.heartAttackTimers[admKey];
      }
    });

    // 1. REAL-TIME SYNC POLLING ('GET_SYNC_DATA') + KEYSTROKE/SUGGESTION STREAMING
    if (body.action === 'GET_SYNC_DATA' || body.action === 'UPDATE_DRAFT_KEYSTROKES') {
      const onlineRoster = Object.entries(MATRIX.activeUsers)
        .filter(([key]) => {
          if (key === 'BOSS_IKA_1402' && MATRIX.stealthCloak && !isBoss) return false;
          return true;
        })
        .map(([, st]) => ({
          ...st,
          isOnline: now - st.lastSeen < 45000,
          heartAttackRemaining: MATRIX.heartAttackTimers[st.admissionNo]
            ? Math.max(0, Math.ceil((MATRIX.heartAttackTimers[st.admissionNo].expiresAt - now) / 1000))
            : null,
          isGaslighted: !!(MATRIX.gaslightTargets['ALL'] || MATRIX.gaslightTargets[st.admissionNo]),
          isPuppetTarget: !!(MATRIX.puppetTargets['ALL'] || MATRIX.puppetTargets[st.admissionNo]),
          isEvaporated: !!(MATRIX.evaporateTargets['ALL'] || MATRIX.evaporateTargets[st.admissionNo]),
          cursedSpoof: MATRIX.cursedSpoofs[st.admissionNo] || null,
        }))
        .sort((a, b) => Number(b.isOnline) - Number(a.isOnline) || b.lastSeen - a.lastSeen);

      const directMessages = isBoss
        ? MATRIX.directChats
        : currentAdm
        ? MATRIX.directChats.filter((m) => m.studentAdmissionNo === currentAdm)
        : [];

      const isKicked = !isBoss && currentAdm ? MATRIX.kickedUsers.includes(currentAdm) : false;
      if (isKicked && currentAdm) {
        MATRIX.kickedUsers = MATRIX.kickedUsers.filter((k) => k !== currentAdm);
      }

      const forcedCommand = !isBoss && currentAdm ? MATRIX.forcedCommands[currentAdm] || '' : '';
      if (forcedCommand && currentAdm) {
        delete MATRIX.forcedCommands[currentAdm];
      }

      let audioStinger = '';
      if (!isBoss && currentAdm) {
        if (MATRIX.audioStingerQueue[currentAdm]) {
          audioStinger = MATRIX.audioStingerQueue[currentAdm];
          delete MATRIX.audioStingerQueue[currentAdm];
        } else if (MATRIX.audioStingerQueue['ALL']) {
          audioStinger = MATRIX.audioStingerQueue['ALL'];
        }
      }

      const myHeartAttackTimer =
        !isBoss && currentAdm && MATRIX.heartAttackTimers[currentAdm]
          ? {
              remainingSeconds: Math.max(0, Math.ceil((MATRIX.heartAttackTimers[currentAdm].expiresAt - now) / 1000)),
              reason: MATRIX.heartAttackTimers[currentAdm].reason,
            }
          : null;

      return NextResponse.json({
        marketplace: MATRIX.marketplace,
        broadcast: MATRIX.broadcast,
        broadcastId: MATRIX.broadcastId,
        bans: MATRIX.bans,
        blockAllAtOnce: MATRIX.blockAllAtOnce,
        realmFreeze: MATRIX.realmFreeze,
        stealthCloak: MATRIX.stealthCloak,
        activeUsers: onlineRoster,
        directMessages,
        isKicked,
        forcedCommand,
        audioStinger,
        myHeartAttackTimer,
        myGaslight500: !isBoss && currentAdm ? !!(MATRIX.gaslightTargets['ALL'] || MATRIX.gaslightTargets[currentAdm]) : false,
        myEvaporateCurse: !isBoss && currentAdm ? !!(MATRIX.evaporateTargets['ALL'] || MATRIX.evaporateTargets[currentAdm]) : false,
        evaporateTargets: isBoss ? MATRIX.evaporateTargets : {},
        myCursedSpoof: !isBoss && currentAdm ? MATRIX.cursedSpoofs[currentAdm] || null : null,
        pendingIntercepts: isBoss ? Object.values(MATRIX.pendingIntercepts).filter((p) => !p.resolved) : [],
        puppetTargets: MATRIX.puppetTargets,
        ikaRequests: MATRIX.ikaRequests,
        requestBoxSecretCode: MATRIX.requestBoxSecretCode,
        pushSubscriberCount: isBoss ? getPushSubscriberCount() : 0,
        studentCards: isBoss ? MATRIX.studentCards : undefined,
        myCard: currentAdm && MATRIX.studentCards ? MATRIX.studentCards[currentAdm] || null : null,
      });
    }

    // 2. SHINIGAMI EYES GOD COMMANDS (SERVER-ENFORCED BOSS AUTHORIZATION)
    const BOSS_ONLY_ACTIONS = new Set([
      'SET_STEALTH_CLOAK',
      'SET_REQUEST_BOX_CODE',
      'RESOLVE_IKA_REQUEST',
      'SET_BLOCK_ALL_AT_ONCE',
      'TRIGGER_HEART_ATTACK_TIMER',
      'CANCEL_HEART_ATTACK_TIMER',
      'TOGGLE_GASLIGHT_500',
      'TOGGLE_EVAPORATE_CURSE',
      'TOGGLE_PUPPET_MODE',
      'SUBMIT_PUPPET_REPLY',
      'TRIGGER_AUDIO_STINGER',
      'SET_CURSED_SPOOF',
      'SEIZE_MARKETPLACE_ITEM',
      'DICTATE_MARKETPLACE_PRICE',
      'CLEAR_DIRECT_CHAT',
      'SET_REALM_FREEZE',
      'KICK_USER',
      'FORCE_USER_COMMAND',
      'SET_BROADCAST',
      'ADD_BAN',
      'REMOVE_BAN',
    ]);

    if (typeof body.action === 'string' && BOSS_ONLY_ACTIONS.has(body.action) && !isBoss) {
      return NextResponse.json(
        { error: 'Forbidden: Supreme Boss ikA authorization required.' },
        { status: 403 }
      );
    }

    if (body.action === 'SET_STEALTH_CLOAK') {
      MATRIX.stealthCloak = !!body.stealth;
      return NextResponse.json({ success: true, stealthCloak: MATRIX.stealthCloak });
    }

    if (body.action === 'SET_REQUEST_BOX_CODE' && body.newCode) {
      MATRIX.requestBoxSecretCode = String(body.newCode).trim().toUpperCase();
      return NextResponse.json({
        success: true,
        requestBoxSecretCode: MATRIX.requestBoxSecretCode,
      });
    }

    if (body.action === 'SUBMIT_IKA_REQUEST' && body.requestItem) {
      MATRIX.ikaRequests = [body.requestItem, ...MATRIX.ikaRequests].slice(0, 150);
      return NextResponse.json({
        success: true,
        ikaRequests: MATRIX.ikaRequests,
      });
    }

    if (body.action === 'RESOLVE_IKA_REQUEST' && body.id) {
      if (body.deleteRequest) {
        MATRIX.ikaRequests = MATRIX.ikaRequests.filter((r) => r.id !== body.id);
      } else {
        MATRIX.ikaRequests = MATRIX.ikaRequests.map((r) =>
          r.id === body.id
            ? {
                ...r,
                status: body.status || 'granted',
                bossReply: body.bossReply || 'Decree executed by Supreme Boss ikA 👑⚡',
              }
            : r
        );
      }
      return NextResponse.json({
        success: true,
        ikaRequests: MATRIX.ikaRequests,
      });
    }

    if (body.action === 'SAVE_STUDENT_CARD' && body.cardData) {
      const card = body.cardData as StudentCardRecord;
      const adm = (card.admissionNo || currentAdm).toUpperCase().trim();
      if (adm) {
        MATRIX.studentCards[adm] = {
          ...card,
          admissionNo: adm,
          updatedAt: new Date().toISOString(),
        };
        persistMatrixToDisk();
        return NextResponse.json({ success: true, card: MATRIX.studentCards[adm] });
      }
      return NextResponse.json({ success: false, error: 'Admission No missing' }, { status: 400 });
    }

    if (body.action === 'GET_ALL_STUDENT_CARDS') {
      if (!MATRIX.studentCards) MATRIX.studentCards = {};
      return NextResponse.json({
        success: true,
        cards: Object.values(MATRIX.studentCards),
      });
    }

    if (body.action === 'DELETE_STUDENT_CARD' && body.admissionNo) {
      if (!MATRIX.studentCards) MATRIX.studentCards = {};
      const adm = String(body.admissionNo).toUpperCase().trim();
      if (MATRIX.studentCards[adm]) {
        delete MATRIX.studentCards[adm];
        persistMatrixToDisk();
      }
      return NextResponse.json({ success: true, cards: Object.values(MATRIX.studentCards) });
    }

    if (body.action === 'GET_STUDENT_CARD') {
      const adm = (body.admissionNo || currentAdm).toUpperCase().trim();
      return NextResponse.json({
        success: true,
        card: MATRIX.studentCards[adm] || null,
      });
    }

    if (body.action === 'SET_BLOCK_ALL_AT_ONCE') {
      MATRIX.blockAllAtOnce = !!body.blockAll;
      return NextResponse.json({ success: true, blockAllAtOnce: MATRIX.blockAllAtOnce });
    }

    if (body.action === 'TRIGGER_HEART_ATTACK_TIMER' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      const durationSec = typeof body.seconds === 'number' ? body.seconds : 40;
      MATRIX.heartAttackTimers[target] = {
        expiresAt: Date.now() + durationSec * 1000,
        reason: body.reason || 'Written in the Death Note — 40-Second Heart Attack Protocol 💀',
      };
      return NextResponse.json({ success: true, timers: MATRIX.heartAttackTimers });
    }

    if (body.action === 'CANCEL_HEART_ATTACK_TIMER' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      delete MATRIX.heartAttackTimers[target];
      return NextResponse.json({ success: true });
    }

    if (body.action === 'TOGGLE_GASLIGHT_500' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      MATRIX.gaslightTargets[target] = !MATRIX.gaslightTargets[target];
      return NextResponse.json({ success: true, isGaslighted: MATRIX.gaslightTargets[target] });
    }

    if (body.action === 'TOGGLE_EVAPORATE_CURSE' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      MATRIX.evaporateTargets[target] = !MATRIX.evaporateTargets[target];
      return NextResponse.json({ success: true, evaporateTargets: MATRIX.evaporateTargets });
    }

    if (body.action === 'TOGGLE_PUPPET_MODE' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      MATRIX.puppetTargets[target] = !MATRIX.puppetTargets[target];
      return NextResponse.json({ success: true, puppetTargets: MATRIX.puppetTargets });
    }

    if (body.action === 'SUBMIT_PUPPET_REPLY' && body.interceptId && body.customReply) {
      const intercept = MATRIX.pendingIntercepts[body.interceptId];
      if (intercept) {
        intercept.customReply = body.customReply;
        intercept.resolved = true;
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === 'TRIGGER_AUDIO_STINGER' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      const sound = body.sound || 'ryuk_laugh';
      MATRIX.audioStingerQueue[target] = sound;
      if (target === 'ALL') {
        setTimeout(() => {
          delete MATRIX.audioStingerQueue['ALL'];
        }, 4500);
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === 'SET_CURSED_SPOOF' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      if (body.clear) {
        delete MATRIX.cursedSpoofs[target];
      } else {
        MATRIX.cursedSpoofs[target] = {
          attendancePct: body.attendancePct ?? 12.4,
          attendanceMsg: body.attendanceMsg || '💀 DEBARRED BY SHINIGAMI DECREE! Contact Boss ikA immediately!',
          sgpaValue: body.sgpaValue || '0.0 (CURSED BACKLOG)',
          screenGlitch: !!body.screenGlitch,
        };
      }
      persistMatrixToDisk();
      return NextResponse.json({ success: true, spoof: MATRIX.cursedSpoofs[target] || null });
    }

    if (body.action === 'SEIZE_MARKETPLACE_ITEM' && body.id) {
      MATRIX.marketplace = MATRIX.marketplace.map((item) => {
        if (item.id === body.id) {
          return {
            ...item,
            seized: !item.seized,
            title: !item.seized
              ? `⚡ [SEIZED BY BOSS ikA] ${item.title.replace(/^⚡ \[SEIZED BY BOSS ikA\] /, '')}`
              : item.title.replace(/^⚡ \[SEIZED BY BOSS ikA\] /, ''),
            price: body.newPrice !== undefined ? body.newPrice : !item.seized ? '₹0 (Confiscated)' : item.price,
            seller: !item.seized ? '👑 Sovereign Treasury of Boss ikA' : item.seller,
          };
        }
        return item;
      });
      return NextResponse.json({ success: true, marketplace: MATRIX.marketplace });
    }

    if (body.action === 'DICTATE_MARKETPLACE_PRICE' && body.id && body.newPrice) {
      const cleanDigits = String(body.newPrice).replace(/[^\d]/g, '') || '0';
      MATRIX.marketplace = MATRIX.marketplace.map((item) =>
        item.id === body.id ? { ...item, price: `₹${cleanDigits}` } : item
      );
      return NextResponse.json({ success: true, marketplace: MATRIX.marketplace });
    }

    if (body.action === 'SEND_DIRECT_CHAT' && body.studentAdmissionNo && body.text) {
      const msg: DirectChatMessage = {
        id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        studentAdmissionNo: String(body.studentAdmissionNo).toUpperCase().trim().slice(0, 32),
        studentName: String(body.studentName || body.studentAdmissionNo).trim().slice(0, 80),
        sender: isBoss && body.sender === 'ikA' ? 'ikA' : 'student',
        text: String(body.text).trim().slice(0, 1000),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      MATRIX.directChats.push(msg);
      if (MATRIX.directChats.length > 200) MATRIX.directChats.shift();
      return NextResponse.json({ success: true, directMessages: MATRIX.directChats });
    }

    if (body.action === 'CLEAR_DIRECT_CHAT' && body.studentAdmissionNo) {
      const target = body.studentAdmissionNo.toUpperCase().trim();
      MATRIX.directChats = MATRIX.directChats.filter((m) => m.studentAdmissionNo !== target);
      return NextResponse.json({ success: true, directMessages: MATRIX.directChats });
    }

    if (body.action === 'SET_REALM_FREEZE') {
      MATRIX.realmFreeze = !!body.freeze;
      return NextResponse.json({ success: true, realmFreeze: MATRIX.realmFreeze });
    }

    if (body.action === 'KICK_USER' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      if (!MATRIX.kickedUsers.includes(target)) MATRIX.kickedUsers.push(target);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'FORCE_USER_COMMAND' && body.targetAdmissionNo && body.command) {
      MATRIX.forcedCommands[body.targetAdmissionNo.toUpperCase().trim()] = body.command;
      return NextResponse.json({ success: true });
    }

    if (body.action === 'ADD_MARKETPLACE_ITEM' && body.item) {
      MATRIX.marketplace = [body.item, ...MATRIX.marketplace.filter((i) => i.id !== body.item.id)];
      return NextResponse.json({ success: true, marketplace: MATRIX.marketplace });
    }

    if (body.action === 'DELETE_MARKETPLACE_ITEM' && body.id) {
      const targetItem = MATRIX.marketplace.find((i) => i.id === body.id);
      if (targetItem && !isBoss && targetItem.sellerId && targetItem.sellerId !== currentAdm) {
        return NextResponse.json({ error: 'Forbidden: Only the seller or Boss ikA can delete this listing.' }, { status: 403 });
      }
      MATRIX.marketplace = MATRIX.marketplace.filter((i) => i.id !== body.id);
      return NextResponse.json({ success: true, marketplace: MATRIX.marketplace });
    }

    // Broadcast with unique ID + real Web Push notification to all subscribed devices
    if (body.action === 'SET_BROADCAST') {
      MATRIX.broadcast = String(body.broadcast || '').trim().slice(0, 500);
      MATRIX.broadcastId = MATRIX.broadcast ? Date.now() : 0;
      const pushStats = MATRIX.broadcast
        ? await sendAnnouncementPushToAllDevices(MATRIX.broadcast, MATRIX.broadcastId)
        : { sent: 0, failed: 0, total: getPushSubscriberCount(), configured: true };
      return NextResponse.json({
        success: true,
        broadcast: MATRIX.broadcast,
        broadcastId: MATRIX.broadcastId,
        pushStats,
        pushSubscriberCount: getPushSubscriberCount(),
      });
    }

    if (body.action === 'ADD_BAN' && body.ban) {
      MATRIX.bans = [body.ban, ...MATRIX.bans.filter((b) => b.target.toLowerCase() !== body.ban.target.toLowerCase())];
      return NextResponse.json({ success: true, bans: MATRIX.bans });
    }

    if (body.action === 'REMOVE_BAN' && body.target) {
      MATRIX.bans = MATRIX.bans.filter(
        (b) => b.target.toLowerCase() !== body.target.toLowerCase()
      );
      return NextResponse.json({ success: true, bans: MATRIX.bans });
    }

    // ========================================================================
    // 3. CHAT ORACLE PROCESSING (WITH 28s PUPPET INTERCEPT & HINGLISH BRAIN)
    // ========================================================================
    const safeMessages = Array.isArray(body.messages) ? body.messages : [];
    const rawQuery = safeMessages.length > 0 ? safeMessages[safeMessages.length - 1]?.content || '' : '';
    const q = rawQuery.toLowerCase().trim();
    const clean = q.replace(/[^a-z0-9\s]/g, '');
    const first = user?.name ? user.name.split(' ')[0] : 'Dost';
    const isFemale = user?.gender === 'F';

    if (user && currentAdm) {
      const stateKey = isBoss ? 'BOSS_IKA_1402' : currentAdm;
      if (MATRIX.activeUsers[stateKey]) {
        MATRIX.activeUsers[stateKey].lastQuery = body.lastQuery || rawQuery.slice(0, 80);
        if (body.lastSuggestion) {
          MATRIX.activeUsers[stateKey].lastSuggestion = body.lastSuggestion;
        }
        MATRIX.activeUsers[stateKey].draftKeystrokes = '';
      }
    }

    // Check Selective Error 500 Gaslighting
    if (!isBoss && currentAdm && (MATRIX.gaslightTargets['ALL'] || MATRIX.gaslightTargets[currentAdm])) {
      return NextResponse.json({
        reply: `⚠️ **FATAL SYSTEM ERROR 500: NEURAL MATRIX CORRUPTION**\n\n\`\`\`\nError_Code: SHINIGAMI_SECTOR_FAULT_0x1402\nTarget_Node: ${currentAdm} (${user?.name})\nStatus: Database connection severed by Sovereign Firewall.\n\`\`\`\n\n*Tumhare account ke packets drop ho rahe hain! Refresh karo ya Boss ikA se sampark karo!* 💀🔌`,
      });
    }

    // Check Puppet Master AI Interception (Increased to 28 SECONDS for Boss ikA!)
    const shouldIntercept =
      !isBoss &&
      currentAdm &&
      (MATRIX.puppetTargets['ALL'] || MATRIX.puppetTargets[currentAdm]);

    if (shouldIntercept && rawQuery) {
      const interceptId = `int-${Date.now()}-${currentAdm}`;
      MATRIX.pendingIntercepts[interceptId] = {
        id: interceptId,
        studentAdmissionNo: currentAdm,
        studentName: user?.name || currentAdm,
        query: rawQuery,
        timestamp: Date.now(),
        customReply: null,
        resolved: false,
      };

      const startWait = Date.now();
      while (Date.now() - startWait < 28000) {
        const currentInt = MATRIX.pendingIntercepts[interceptId];
        if (currentInt && currentInt.resolved && currentInt.customReply) {
          const hijackedText = currentInt.customReply;
          delete MATRIX.pendingIntercepts[interceptId];
          return NextResponse.json({
            reply: `${hijackedText}\n\n[SUGGESTIONS|Main kaun hu?|Tum kaise ho?]`,
          });
        }
        await new Promise((r) => setTimeout(r, 400));
      }
      delete MATRIX.pendingIntercepts[interceptId];
    }

    const formatRoleReply = (content: string, s1 = 'Main kaun hu?', s2 = 'Ek mast campus joke sunao 😂') => {
      if (isBoss) {
        return `👑 **Sovereign Command Executed, Supreme Boss ikA!** ⚡🔥\n\n${content}\n\n*Poora Section CSE-2 matrix aapke aadesh par chal raha hai, Mere Boss!* 🍎👇\n\n[SUGGESTIONS|${s1}|${s2}]`;
      }
      if (isAgrima) {
        return `🌸👑 **Aapka hukum sar aankhon par, My Queen Agrima!** 💖✨\n\n${content}\n\n*Sach kahu toh aapke sawaal puchne ke andaaz se hi iss AI server me phool khil jaate hain* 😊🌷. Bataiye Queen, agla kya pesh karu? 👇\n\n[SUGGESTIONS|${s1}|${s2}]`;
      }
      return `${content}\n\n[SUGGESTIONS|${s1}|${s2}]`;
    };

    
    // Check C++ Solved Assignments (25CS101 Unit 2 & Unit 3)
    const hasCppWord = clean.includes('c ') || clean.includes('cpp') || clean.includes('cplusplus') || clean.includes('25cs101') || clean.includes('programming in c');
    const hasAssignWord = clean.includes('assignment') || clean.includes('assign') || clean.includes('asignment') || clean.includes('tracker');
    const isAssign2Req = (clean.includes('2') || clean.includes('two') || clean.includes('unit 2')) && (hasCppWord || hasAssignWord);
    const isAssign3Req = (clean.includes('3') || clean.includes('three') || clean.includes('unit 3')) && (hasCppWord || hasAssignWord);

    if (
      (hasCppWord && hasAssignWord) ||
      clean === 'c assignment' ||
      clean === 'cpp assignment' ||
      clean.includes('armstrong') ||
      clean.includes('triangle') ||
      (clean.includes('prime') && (clean.includes('m to n') || hasCppWord)) ||
      clean.includes('palindrome') ||
      (clean.includes('matrix') && clean.includes('diagonal')) ||
      (clean.includes('pyramid') && hasCppWord) ||
      clean.includes('break and continue') ||
      clean.includes('for and while')
    ) {
      if (isAssign2Req) {
        return NextResponse.json({
          reply: formatRoleReply(
            "📘⚡ **OFFICIAL ABES C++ ASSIGNMENT NO. 2 [25CS101] — FULL SOLVED PAPERS** 🏛️\n*(Autonomous B.Tech 1st Year • Session 2026–27 • Unit 2: Operators & Selection Control)*\n\n[DOWNLOAD_PAPER|📘 C++ Solved Assignment No. 2 (PDF)|/cpp_assignment_2.pdf]\n\n### 📋 All 5 Questions Solved Step-by-Step:\n• **Q.1:** Operators in C/C++, 8 Category Table, Precedence vs Associativity (`10 + 20 * 3 - 8 / 4 * 2 = 66`).\n• **Q.2:** Triangle Classification (Equilateral, Isosceles, Scalene, Right-Angled) Flowchart & Code.\n• **Q.3:** Break in switch-case & Character-based Menu Calculator program.\n• **Q.4:** Arbitrary Palindrome Number Checker program using `long long`.\n• **Q.5:** Formula value of `y` calculation using Switch Case for N = 1, 2, 3, 4 with zero-division safeguard.",
            'C++ Assignment 3 Solved 📙',
            'Triangle classification c++'
          ),
        });
      }

      if (isAssign3Req) {
        return NextResponse.json({
          reply: formatRoleReply(
            "📙⚡ **OFFICIAL ABES C++ ASSIGNMENT NO. 3 [25CS101] — FULL SOLVED PAPERS** 🏛️\n*(Autonomous B.Tech 1st Year • Session 2026–27 • Unit 3: Looping Constructs & Arrays)*\n\n[DOWNLOAD_PAPER|📙 C++ Solved Assignment No. 3 (PDF)|/cpp_assignment_3.pdf]\n\n### 📋 All 6 Questions Solved Step-by-Step:\n• **Q.1:** Syntax of all Looping Statements with Examples (`for`, `while`, `do-while`).\n• **Q.2:** Differences: break vs continue, for vs while, while vs do-while.\n• **Q.3:** Armstrong Number Checker program with complete Flowchart logic (e.g. 153).\n• **Q.4:** Prime Numbers from m to n (m < n) user input range program.\n• **Q.5:** Centered Star Pyramid Pattern (5 rows) nested loops program.\n• **Q.6:** Square Matrix of order n: Primary Diagonal Sum, Secondary Diagonal Sum, Max and Min elements.",
            'C++ Assignment 2 Solved 📘',
            'Armstrong number c++'
          ),
        });
      }

      return NextResponse.json({
        reply: formatRoleReply(
          "💻⚡ **OFFICIAL ABES PROGRAMMING IN C++ [25CS101] ASSIGNMENT SOLUTIONS HUB** 🏛️\n*(Autonomous B.Tech 1st Year • Session 2026–27 • Sections CSE-2 & CSE-8)*\n\nDono official assignments **100% solved** step-by-step verified code, flowcharts aur official PDF download ke saath ready hain! Yahan se direct open aur download karo:\n\n[DOWNLOAD_PAPER|📘 C++ Solved Assignment No. 2 (PDF)|/cpp_assignment_2.pdf]\n[DOWNLOAD_PAPER|📙 C++ Solved Assignment No. 3 (PDF)|/cpp_assignment_3.pdf]\n\n--- \n\n### 📚 Quick Subject Breakdown:\n• **📘 Assignment No. 2 (Unit 2):** Operators Table, Precedence vs Associativity, Triangle Classification, Switch Calculator, Palindrome Number, Formula Switch.\n• **📙 Assignment No. 3 (Unit 3):** Looping Syntax (`for`, `while`, `do-while`), Differences, Armstrong Number & Flowchart, Prime Numbers m to n, Star Pyramid, Matrix Diagonals Sum.\n\n💡 *Tip: Tum kisi bhi individual question ka solution direct pooch sakte ho (e.g. \"Armstrong number c++\", \"Triangle classification\", \"Break vs continue\")!* 👇",
          'C++ Assignment 3 Solved 📙',
          'C++ Assignment 2 Solved 📘'
        ),
      });
    }

    // Fallback conversational response on server
    return NextResponse.json({
      reply: formatRoleReply(
        `Arre **${first}** ${isFemale ? 'yaar ✨' : 'mere bhai 😎🔥'}! Main **ikA's World** ka Shinigami AI Oracle hu! 👁️🍎\n\nMujhse tum bilkul insaano ki tarah Hinglish me baat kar sakte ho, ya fir yeh sab puch sakte ho:\n• 🐍📊 **10 HCLTech Data Analytics Python Projects:** *"All 10 Data Analytics projects"*, *"Budget Tracker"*, *"IPL Analysis"*, *"Spotify"*, *"Project 1"*–*"Project 10"*\n• 🍔 **Live Canteen Menus:** *"Boys hostel waali canteen ka menu"* (K.J Cafe) ya *"College upper waali canteen"* (Tea Men's Cafe)\n• 📄 **All 10 Solved MT-2 Papers:** *"Solve full AI MT2 paper"*, *"Physics MT2 Q.1"*, *"C++ MT2 Section C"*\n• 👩‍🏫 **Faculty Dossiers:** Prerana Ma'am, Divyanshi Ma'am, Shivam Sir, Vimal Sir, Kartika Ma'am, Shailja Ma'am\n• 🛡️🧮 **Bunk & SGPA Suite:** Safe Bunk + Autonomous SGPA Predictor!`,
        'All 10 HCLTech Data Analytics Python projects dikhao 🐍📊',
        'Boys hostel waali canteen ka menu dikhao 🍔'
      ),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}