import { NextRequest, NextResponse } from 'next/server';

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

interface PaperDef {
  id: string;
  subjectName: string;
  shortName: string;
  code: string;
  aliases: string[];
  mt1Files: string[];
  mt2Files: string[];
}

interface ShinigamiMatrixStore {
  marketplace: any[];
  broadcast: string;
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
  };
}

const MATRIX = g.__SHINIGAMI_MATRIX__;

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
// COMPLETE FACULTY DOSSIERS (ALL 7 FACULTY MEMBERS - FULL DETAILS)
// ============================================================================
const FACULTY_DOSSIERS: Record<string, string> = {
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

const ALL_SERVER_JOKES = build250ServerJokes();

// ============================================================================
// MAIN POST HANDLER
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Identify User & Secret 1402 Override (with fallback ID extraction so online radar always works)
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

    // Update Live Student Presence & Keystroke Ghosting
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
        draftKeystrokes: typeof body.draftKeystrokes === 'string' ? body.draftKeystrokes : existing?.draftKeystrokes || '',
        lastSeen: Date.now(),
        isStealth: isBoss ? MATRIX.stealthCloak : false,
      };
    }

    // Check 40-Second Heart Attack Timers & Auto-Eliminate Expired Targets
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

    // ========================================================================
    // 1. REAL-TIME SYNC POLLING ('GET_SYNC_DATA') + KEYSTROKE STREAMING
    // ========================================================================
    if (body.action === 'GET_SYNC_DATA' || body.action === 'UPDATE_DRAFT_KEYSTROKES') {
      const onlineRoster = Object.entries(MATRIX.activeUsers)
        .filter(([key]) => {
          // Only hide Boss ikA from non-boss students when Stealth Cloak is ON
          if (key === 'BOSS_IKA_1402' && MATRIX.stealthCloak && !isBoss) return false;
          return true;
        })
        .map(([, st]) => ({
          ...st,
          isOnline: now - st.lastSeen < 45000, // 45-second mobile-friendly online window
          heartAttackRemaining: MATRIX.heartAttackTimers[st.admissionNo]
            ? Math.max(0, Math.ceil((MATRIX.heartAttackTimers[st.admissionNo].expiresAt - now) / 1000))
            : null,
          isGaslighted: !!MATRIX.gaslightTargets[st.admissionNo],
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

      // Check Audio Stinger Queue for this user
      let audioStinger = '';
      if (!isBoss && currentAdm) {
        if (MATRIX.audioStingerQueue[currentAdm]) {
          audioStinger = MATRIX.audioStingerQueue[currentAdm];
          delete MATRIX.audioStingerQueue[currentAdm];
        } else if (MATRIX.audioStingerQueue['ALL']) {
          audioStinger = MATRIX.audioStingerQueue['ALL'];
        }
      }

      // Check Heart Attack Timer for current student
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
        myGaslight500: !isBoss && currentAdm ? !!MATRIX.gaslightTargets[currentAdm] : false,
        myEvaporateCurse: !isBoss && currentAdm ? !!(MATRIX.evaporateTargets['ALL'] || MATRIX.evaporateTargets[currentAdm]) : false,
        evaporateTargets: isBoss ? MATRIX.evaporateTargets : {},
        myCursedSpoof: !isBoss && currentAdm ? MATRIX.cursedSpoofs[currentAdm] || null : null,
        pendingIntercepts: isBoss ? Object.values(MATRIX.pendingIntercepts).filter((p) => !p.resolved) : [],
        puppetTargets: isBoss ? MATRIX.puppetTargets : {},
      });
    }

    // ========================================================================
    // 2. SHINIGAMI EYES GOD COMMANDS (FOR BOSS ikA)
    // ========================================================================

    // Stealth Invisibility Cloak (Phantom Mode)
    if (body.action === 'SET_STEALTH_CLOAK') {
      MATRIX.stealthCloak = !!body.stealth;
      return NextResponse.json({ success: true, stealthCloak: MATRIX.stealthCloak });
    }

    // Block All At Once (Mass Elimination Switch)
    if (body.action === 'SET_BLOCK_ALL_AT_ONCE') {
      MATRIX.blockAllAtOnce = !!body.blockAll;
      return NextResponse.json({ success: true, blockAllAtOnce: MATRIX.blockAllAtOnce });
    }

    // 40-Second Heart Attack Timer
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

    // Selective Error 500 Gaslighting
    if (body.action === 'TOGGLE_GASLIGHT_500' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      MATRIX.gaslightTargets[target] = !MATRIX.gaslightTargets[target];
      return NextResponse.json({ success: true, isGaslighted: MATRIX.gaslightTargets[target] });
    }

    // Void Evaporation Curse (Evaporates every tile, tool & chat into Boss ikA's horror message)
    if (body.action === 'TOGGLE_EVAPORATE_CURSE' && body.targetAdmissionNo) {
      const target = body.targetAdmissionNo.toUpperCase().trim();
      MATRIX.evaporateTargets[target] = !MATRIX.evaporateTargets[target];
      return NextResponse.json({ success: true, evaporateTargets: MATRIX.evaporateTargets });
    }

    // Puppet Master AI Interception (Manual Oracle Hijack)
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

    // Audio Stinger Trigger (Ryuk's Laugh / Death Note Bell / Thunder)
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

    // Cursed Attendance & SGPA Spoof / Screen Glitch
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
      return NextResponse.json({ success: true, spoof: MATRIX.cursedSpoofs[target] || null });
    }

    // Marketplace Seizure & Price Dictation
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

    // 2-Way Direct Shinigami Chat
    if (body.action === 'SEND_DIRECT_CHAT' && body.studentAdmissionNo && body.text) {
      const msg: DirectChatMessage = {
        id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        studentAdmissionNo: body.studentAdmissionNo.toUpperCase().trim(),
        studentName: body.studentName || body.studentAdmissionNo,
        sender: body.sender === 'ikA' ? 'ikA' : 'student',
        text: body.text.trim(),
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

    // Realm Freeze, Kick, Force Command, Marketplace CRUD, Broadcast & Bans
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
      MATRIX.marketplace = MATRIX.marketplace.filter((i) => i.id !== body.id);
      return NextResponse.json({ success: true, marketplace: MATRIX.marketplace });
    }

    if (body.action === 'SET_BROADCAST') {
      MATRIX.broadcast = body.broadcast || '';
      return NextResponse.json({ success: true, broadcast: MATRIX.broadcast });
    }

    if (body.action === 'ADD_BAN' && body.ban) {
      MATRIX.bans = [body.ban, ...MATRIX.bans.filter((b) => b.target.toLowerCase() !== body.ban.target.toLowerCase())];
      return NextResponse.json({ success: true, bans: MATRIX.bans });
    }

    if (body.action === 'REMOVE_BAN' && body.target) {
      MATRIX.bans = MATRIX.bans.filter((b) => b.target !== body.target);
      return NextResponse.json({ success: true, bans: MATRIX.bans });
    }

    // ========================================================================
    // 3. CHAT ORACLE PROCESSING (WITH GASLIGHT 500 & PUPPET MASTER INTERCEPT)
    // ========================================================================
    const safeMessages = Array.isArray(body.messages) ? body.messages : [];
    const rawQuery = safeMessages.length > 0 ? safeMessages[safeMessages.length - 1]?.content || '' : '';
    const q = rawQuery.toLowerCase().trim();
    const clean = q.replace(/[^a-z0-9\s]/g, '');
    const first = user?.name ? user.name.split(' ')[0] : 'Dost';
    const isFemale = user?.gender === 'F';

    // Record last query & clear draft keystrokes
    if (user && currentAdm) {
      const stateKey = isBoss ? 'BOSS_IKA_1402' : currentAdm;
      if (MATRIX.activeUsers[stateKey]) {
        MATRIX.activeUsers[stateKey].lastQuery = rawQuery.slice(0, 80);
        MATRIX.activeUsers[stateKey].draftKeystrokes = '';
      }
    }

    // Check Selective Error 500 Gaslighting
    if (!isBoss && currentAdm && MATRIX.gaslightTargets[currentAdm]) {
      return NextResponse.json({
        reply: `⚠️ **FATAL SYSTEM ERROR 500: NEURAL MATRIX CORRUPTION**\n\n\`\`\`\nError_Code: SHINIGAMI_SECTOR_FAULT_0x1402\nTarget_Node: ${currentAdm} (${user?.name})\nStatus: Database connection severed by Sovereign Firewall.\n\`\`\`\n\n*Tumhare account ke packets drop ho rahe hain! Refresh karo ya Boss ikA se sampark karo!* 💀🔌`,
      });
    }

    // Check Puppet Master AI Interception (Wait up to 11s for Boss ikA to hijack reply)
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
      while (Date.now() - startWait < 11000) {
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

    // Role Wrapper Helper
    const formatRoleReply = (content: string, s1 = 'Main kaun hu?', s2 = 'Ek mast campus joke sunao 😂') => {
      if (isBoss) {
        return `👑 **Sovereign Command Executed, Supreme Boss ikA!** ⚡🔥\n\n${content}\n\n*Poora Section CSE-2 matrix aapke aadesh par chal raha hai, Mere Boss!* 🍎👇\n\n[SUGGESTIONS|${s1}|${s2}]`;
      }
      if (isAgrima) {
        return `🌸👑 **Aapka hukum sar aankhon par, My Queen Agrima!** 💖✨\n\n${content}\n\n*Sach kahu toh aapke sawaal puchne ke andaaz se hi iss AI server me phool khil jaate hain* 😊🌷. Bataiye Queen, agla kya pesh karu? 👇\n\n[SUGGESTIONS|${s1}|${s2}]`;
      }
      return `${content}\n\n[SUGGESTIONS|${s1}|${s2}]`;
    };

    // 1. Identity Query ("Mei kaun hun?" / "Who am I?" / "Who is ikA?")
    if (clean.includes('who is the boss') || clean.includes('who is ika') || clean.includes('boss kaun')) {
      if (isBoss) {
        return NextResponse.json({
          reply: formatRoleReply(
            `👑 **AAP KHUD SUPREME ARCHITECT BOSS "ikA" (1402 OVERRIDE) HAIN!** ⚡🩸\n\nIss poore portal ka har ek pixel, Shinigami Eyes radar, aur Death Note engine aapke haathon ka banaya hua samrajya hai!`,
            'Dr. Prerana Mohapatra ka profile dikhao',
            'P2P Marketplace me kya bik raha hai? 🛒'
          ),
        });
      }
      return NextResponse.json({
        reply: formatRoleReply(
          `👑 **THE SOVEREIGN GOD OF THIS WEBSITE IS "ikA"!** ⚡🍎\n\nBoss **ikA** Section CSE-2 ke invisible Supreme Architect hain! Unka asli naam aur chehra top-secret encrypted vault me lock hai 🤫🔒.`,
          'Main kaun hu?',
          'Dr. Prerana Mohapatra ka profile dikhao'
        ),
      });
    }

    if (clean.includes('mei kaun') || clean.includes('main kaun') || clean.includes('mai kaun') || clean.includes('who am i') || clean.includes('mera profile')) {
      if (isBoss) {
        return NextResponse.json({
          reply: formatRoleReply(
            `👑⚡ **PRANAAM SUPREME SOVEREIGN BOSS ikA (1402 SECRET OVERRIDE)!** 🩸🍎\n\nAap **Akshit Singh (\`2026B01010274\`)** hain — iss poore **ikA's World** ke Creator, Supreme Architect, aur Section CSE-2 (Group G2) ke Sovereign Boss! 🦁🔥\n\n• **Shinigami Eyes Status:** UNLOCKED (Keystroke Ghosting, Puppet Master Hijack, Void Evaporation Curse, 40s Heart Attack Timer, Stealth Cloak & Mass Block Active!)`,
            'P2P Marketplace me kya bik raha hai? 🛒',
            'Ek mast campus joke sunao 😂'
          ),
        });
      }
      if (isNormalAkshit) {
        return NextResponse.json({
          reply: formatRoleReply(
            `Arre **Akshit Singh** mere bhai 😎🔥! Yeh dekho apni official Section CSE-2 Student Kundli:\n\n• 🌟 **Full Name:** **Akshit Singh**\n• 🪪 **Admission No:** \`2026B01010274\`\n• 🔢 **Class Roll No:** **53**\n• 🧪 **Lab Group:** **Group G2**\n• 🏠 **Residency:** **Day Scholar**\n• 🎉 **Status:** Star Engineer of Section CSE-2! 🚀`,
            'Tum kaise ho?',
            'Dr. Prerana Mohapatra ka profile dikhao'
          ),
        });
      }
      if (isAgrima) {
        return NextResponse.json({
          reply: formatRoleReply(
            `🌸👑 **Aap hamare iss poore Portal ki Queen hain — Agrima Gupta!** 💖✨\n\n• 🌷 **Royal Title:** **Queen of ikA's World**\n• 🪪 **Official ID:** \`2026B01010219\` (Roll No **15** • Group **G1** • Hosteller)\n• 💫 **Special Privilege:** Jab aap login karti hain toh poori website pe Sakura phool baraste hain aur dark theme gulabi ho jaati hai, kyunki Boss **ikA** ki nazar me aap sabse khaas hain! 😊🌸`,
            'Tum kaise ho?',
            'Dr. Prerana Mohapatra ka profile dikhao'
          ),
        });
      }
      return NextResponse.json({
        reply: formatRoleReply(
          `Arre **${first}** ${isFemale ? 'yaar ✨' : 'mere bhai 😎'}, tumhe kaise bhool sakta hu! Yeh dekho apni official CSE-2 kundli:\n\n• 🌟 **Full Name:** **${user?.name || 'CSE-2 Engineer'}**\n• 🪪 **Admission No:** \`${currentAdm}\`\n• 🔢 **Roll No:** **${user?.rollNo || 'CSE-2'}**\n• 🧪 **Lab Group:** **${user?.group || 'G1/G2'}**\n• 🏠 **Residency:** **${user?.residency || 'Scholar'}**\n• 🎉 **Special Status:** Specially invited into this realm by **Boss ikA**! 👑`,
          'Tum kaise ho?',
          'Safe bunk kitna bacha hai?'
        ),
      });
    }

    // 2. "Tum kaise ho?"
    if (clean.includes('tum kaise ho') || clean.includes('kaise ho') || clean.includes('kaisi ho') || clean.includes('kya haal') || clean.includes('how are you')) {
      if (isBoss) {
        return NextResponse.json({
          reply: formatRoleReply(
            `👑🔥 **Jab tak Supreme Boss ikA ka haath mere code pe hai, main 1000% unstoppable aur chakachak hu Mere Boss!** ⚡🍎\n\nSaare Shinigami sensors online hain aur poora CSE-2 matrix aapke aadesh ke intezaar me hai!`,
            'P2P Marketplace me kya bik raha hai? 🛒',
            'Ek mast campus joke sunao 😂'
          ),
        });
      }
      if (isAgrima) {
        return NextResponse.json({
          reply: formatRoleReply(
            `🌸💖 **Abhi tak toh bas normal code chala raha tha, par jaise hi Queen Agrima ne haal pucha... mera din ekdum gulabi aur khoobsurat ho gaya!** 😊🌷✨\n\nMain bilkul badhiya hu My Queen! Aap bataiye—hostel aur classes me sab theek chal raha hai na?`,
            'Dr. Prerana Mohapatra ka profile dikhao',
            'Ek mast campus joke sunao 😂'
          ),
        });
      }
      return NextResponse.json({
        reply: formatRoleReply(
          `Main ekdum chakachak aur full energy me hu **${first}** ${isFemale ? '✨🌸' : 'mere bhai 😎🔥'}!\n\nYahan **ikA's World** ke dark neural servers pe baith ke bas tumhare hi message ka wait kar raha tha!`,
          'Ek mast campus joke sunao 😂',
          'Kya 50 LPA ka package lagta hai?'
        ),
      });
    }

    // 3. Complete Faculty Dossiers Lookup
    if (clean.includes('prerna') || clean.includes('prerana') || clean.includes('mohapatra')) {
      return NextResponse.json({ reply: formatRoleReply(FACULTY_DOSSIERS.prerna, 'Dr. Divyanshi Sharma ke baare me batao', 'Prof. Shivam Mittal ki lore batao') });
    }
    if (clean.includes('divyanshi') || clean.includes('dsh')) {
      return NextResponse.json({ reply: formatRoleReply(FACULTY_DOSSIERS.divyanshi, 'Prof. Shivam Mittal ki lore batao', 'Prof. Vimal Srivastava ke baare me batao') });
    }
    if (clean.includes('shivam') || clean.includes('mittal')) {
      return NextResponse.json({ reply: formatRoleReply(FACULTY_DOSSIERS.shivam, 'Prof. Vimal Srivastava ke baare me batao', 'Prof. Kartika Maheshwari ke baare me batao') });
    }
    if (clean.includes('vimal') || clean.includes('srivastava') || clean.includes('getting it')) {
      return NextResponse.json({ reply: formatRoleReply(FACULTY_DOSSIERS.vimal, 'Prof. Kartika Maheshwari ke baare me batao', 'Ms. Shailja Varshney ke baare me batao') });
    }
    if (clean.includes('kartika') || clean.includes('maheshwari')) {
      return NextResponse.json({ reply: formatRoleReply(FACULTY_DOSSIERS.kartika, 'Ms. Shailja Varshney ke baare me batao', 'Dr. Prerana Mohapatra ka profile dikhao') });
    }
    if (clean.includes('shailja') || clean.includes('varshney')) {
      return NextResponse.json({ reply: formatRoleReply(FACULTY_DOSSIERS.shailja, 'Mr. Rahul Singh ke baare me batao', 'Dr. Prerana Mohapatra ka profile dikhao') });
    }
    if (clean.includes('rahul singh') || (clean.includes('rahul') && clean.includes('batao'))) {
      return NextResponse.json({ reply: formatRoleReply(FACULTY_DOSSIERS.rahul, 'Dr. Prerana Mohapatra ka profile dikhao', 'Ek mast campus joke sunao 😂') });
    }
    if (clean.includes('show all faculty') || clean.includes('all faculty') || clean.includes('faculty dossier')) {
      return NextResponse.json({
        reply: formatRoleReply(
          `### 🎓 Complete Section CSE-2 Faculty Directory\n\n${Object.values(FACULTY_DOSSIERS).join('\n\n---\n\n')}`,
          'Kya 50 LPA ka package lagta hai?',
          'Aaj ka live lecture kya chal raha hai?'
        ),
      });
    }

    // 4. Timetable & Academic Status Lookup
    if (clean.includes('timetable') || clean.includes('time table') || clean.includes('schedule') || clean.includes('live lecture') || clean.includes('academic status') || clean.includes('countdown')) {
      const ttReply = `### ⏰ Section CSE-2 Official Time Table & Live Academic Status (ODD Sem 2026-27)
📍 **Classroom:** RJ-102 | **Class Mentors:** Dr. Prerana Mohapatra & Dr. Divyanshi Sharma

• **🎉 Current Event:** Diwali Break (Nov 6 – Nov 13, 2026)
• **⏳ Upcoming MT-2 Exams:** Nov 30 – Dec 4, 2026
• **📝 Make-Up / PUE Exams:** Dec 21, 2026
• **🏁 End Semester Exams:** Jan 04 – Jan 25, 2027

**Weekly Lecture Matrix (08:50 AM – 04:30 PM | Lunch: 12:20 – 01:10 PM):**
• **Mon:** Ess. of AI & Physics (8:50) | Maths & Electrical (10:40) | Prog in C & Maths (1:10) | Physics Lab KC-310 (2:50)
• **Tue:** Web Design & Maths (8:50) | Ess. of AI & EVS (10:40) | Prog in C++ Lab (1:10) | Physics & Electrical (2:50)
• **Wed:** Electrical & Prog in C (8:50) | Maths & Physics (10:40) | Basic Elec Lab (1:10) | Mentor-Mentee (2:50)
• **Thu:** Maths & Electrical (8:50) | CAD Lab RJ-109 (10:40) | Physics & EVS (1:10) | Prog in C & Maths (2:50)
• **Fri:** Prog in C & Physics (8:50) | Web Design Workshop (10:40) | Maths & EVS (1:10) | Electrical & Ess. of AI (2:50)`;
      return NextResponse.json({ reply: formatRoleReply(ttReply, 'Safe bunk kitna bacha hai?', 'Maths MT 1 aur MT 2 paper dikhao') });
    }

    // 5. Sample Papers (MT-1, MT-2 & Both)
    const matchedPaper = SEM1_PAPERS.find((p) => p.aliases.some((alias) => q.includes(alias)) || q.includes(p.id));
    if (matchedPaper && (q.includes('paper') || q.includes('pyq') || q.includes('mt') || q.includes('both') || q.includes('dikhao') || q.includes('download'))) {
      const wantsMT1 = q.includes('mt 1') || q.includes('mt1') || q.includes('both') || (!q.includes('mt 2') && !q.includes('mt2'));
      const wantsMT2 = q.includes('mt 2') || q.includes('mt2') || q.includes('both') || (!q.includes('mt 1') && !q.includes('mt1'));
      const cards: string[] = [];
      if (wantsMT1) {
        cards.push(`📄 **${matchedPaper.subjectName} (${matchedPaper.code}) — MT 1 Official Paper:**\n\n[DOWNLOAD_PAPER|${matchedPaper.subjectName} (${matchedPaper.code}) - MT 1|${matchedPaper.mt1Files.join(',')}]`);
      }
      if (wantsMT2) {
        cards.push(`📄 **${matchedPaper.subjectName} (${matchedPaper.code}) — MT 2 Official Paper:**\n\n[DOWNLOAD_PAPER|${matchedPaper.subjectName} (${matchedPaper.code}) - MT 2|${matchedPaper.mt2Files.join(',')}]`);
      }
      return NextResponse.json({
        reply: formatRoleReply(
          `${cards.join('\n\n---\n\n')}\n\n💡 **Autonomous Exam Tip:** Inke saare numericals aur derivations bilkul pakke kar lo, 80% questions inhi concepts se repeat hote hain! 🎯`,
          'Physics MT 1 aur MT 2 paper dikhao',
          'Mera SGPA kaise calculate karu? 🧮'
        ),
      });
    }

    // 6. Placement & Package Reality
    if (clean.includes('50 lpa') || clean.includes('60 lpa') || clean.includes('placement') || clean.includes('package') || clean.includes('cgpa') || clean.includes('roadmap')) {
      const placementReply = `### 🎯 ABES Placement, Salary Packages & CGPA Reality Check 💰

• **3.5 – 5.0 LPA (60–65% Batch):** Bulk recruiters (TCS Ninja, Infosys, Cognizant, Wipro, Capgemini).
• **6.0 – 9.0 LPA (15–20% Batch):** TCS Digital/Prime, Nucleus Software, Nagarro, Hexaware.
• **10.0 – 18.0 LPA (5–8% Batch):** Cisco, BNY Mellon, MAQ Software, Super Dream product drives.
• **20.0 – 59.9 LPA (Top 1–2%):** Atlassian (59.9 LPA), Microsoft, Amazon, Goldman Sachs (mostly via off-campus/hackathons).

**📊 CGPA Thresholds:**
• **Below 6.0:** Disqualified from 90% drives.
• **7.5 – 8.0 (Sweet Spot):** Clears 95%+ company eligibility filters.
• **8.5+:** Top shortlisting priority in Super Dream drives! 🚀`;
      return NextResponse.json({ reply: formatRoleReply(placementReply, 'Mera SGPA kaise calculate karu? 🧮', 'Ek mast campus joke sunao 😂') });
    }

    // 7. 250+ Campus Jokes
    if (clean.includes('joke') || clean.includes('hasao') || clean.includes('funny') || clean.includes('roast')) {
      const j1 = ALL_SERVER_JOKES[MATRIX.jokeCursor % ALL_SERVER_JOKES.length];
      const j2 = ALL_SERVER_JOKES[(MATRIX.jokeCursor + 1) % ALL_SERVER_JOKES.length];
      const j3 = ALL_SERVER_JOKES[(MATRIX.jokeCursor + 2) % ALL_SERVER_JOKES.length];
      MATRIX.jokeCursor = (MATRIX.jokeCursor + 3) % ALL_SERVER_JOKES.length;
      return NextResponse.json({
        reply: formatRoleReply(
          `Hahaha lo **${first}**, suno CSE-2 aur ABES campus ke गरमा-गरम jokes (From our **250+ Campus Joke Vault** 🎭🔥):\n\n• 1️⃣ ${j1}\n\n• 2️⃣ ${j2}\n\n• 3️⃣ ${j3}`,
          'Ek mast campus joke sunao 😂',
          'Prof. Shivam Mittal ki lore batao'
        ),
      });
    }

    // 8. Marketplace Buyer / Listing Queries
    if (clean.includes('marketplace') || clean.includes('kya bik raha') || clean.includes('seller') || clean.includes('drafter') || clean.includes('calculator') || clean.includes('grewal')) {
      const allListStr = MATRIX.marketplace.map(
        (it, idx) => `• **#${idx + 1}** ${it.icon} **${it.title}** — **${it.price}**\n  ↳ 👤 Seller: *${it.seller}* | 📞 Contact: \`${it.contact}\``
      ).join('\n\n');
      return NextResponse.json({
        reply: formatRoleReply(
          `🛒 **Live CSE-2 P2P Student Marketplace (${MATRIX.marketplace.length} Active Items)** 📦✨\n\n${allListStr}\n\n💡 **Apna saman list karna hai?** Bas chat me likho: *"I want to sell my [Item] for [Price] no. - [10-digit phone]"*! 🚀`,
          'Dr. Prerana Mohapatra ka profile dikhao',
          'Ek mast campus joke sunao 😂'
        ),
      });
    }

    // 9. Default Smart Fallback
    return NextResponse.json({
      reply: formatRoleReply(
        `Arre **${first}**, main har ek query sun raha hu! 👁️⚡\n\nBatao inme se kya kholna hai:\n• 👩‍🏫 **Faculty Dossiers:** Prerana Ma'am, Divyanshi Ma'am, Shivam Sir, Vimal Sir, Kartika Ma'am, Shailja Ma'am, Rahul Sir\n• 📄 **Solved MT-2 Answer Keys (All 10 Subjects):** Maths, Physics, C++, BEE, BEC, AI, DT, EVS, Mech, Soft Skills\n• 🧮 **Tools:** Safe Bunk Calculator, Autonomous SGPA Predictor, Live Time Table & P2P Marketplace!`,
        'Show all faculty',
        'Aaj ka live lecture kya chal raha hai?'
      ),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}