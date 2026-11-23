export interface ShayariItem {
  id: number;
  genre: 'crush' | 'engineering' | 'attendance_proxy' | 'dard_breakup' | 'dosti_yaari' | 'shinigami_boss';
  genreLabel: string;
  title: string;
  lines: string[];
  punchline: string;
  emoji: string;
}

export const SHAYARI_BANK: ShayariItem[] = [
  // ==========================================================================
  // 💖 GENRE 1: CRUSH, ISHQ & CAMPUS FLIRTING (26 SHAYARIS)
  // ==========================================================================
  {
    id: 1,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'RJ Block Corridor Nazar',
    lines: [
      'RJ Block ke corridor me jab tum samne se aati ho,',
      'Hamare dil ke processor ki clock speed badha jaati ho!',
      'Duniya dekhti hogi library ki moti kitaabein,',
      'Tum bas ek baar muskura do, hum bina exam hi pass ho jaate hain!'
    ],
    punchline: 'Dil ka buffer overflow ho gaya aapki ek nazar se! 💘✨',
    emoji: '👀💖'
  },
  {
    id: 2,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'C++ Pointer Wala Dil',
    lines: [
      'Dil ka pointer hamesha tumhare address ko point karta hai,',
      'Compiler bhi hamari mohabbat ka syntax reject nahi karta!',
      'Sau baar lagaya try-catch apni iss bekarari par,',
      'Par ye dil exception throw karke bas tumhi pe marta hai!'
    ],
    punchline: 'You are the only valid reference in my entire codebase! 💻🌹',
    emoji: '💌💻'
  },
  {
    id: 3,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Canteen Wali Cold Coffee',
    lines: [
      'Tea Men\'s Cafe ki cutting chai bhi feeki lagne lagti hai,',
      'Jab tum hostel gate ke paas se dheere se guzarti ho!',
      'Hazaaron assignments chhod kar hum wahin ruk jaate hain,',
      'Aapki ek smile par hum 75% attendance bhi kurbaan kar jaate hain!'
    ],
    punchline: 'Chai garmi deti hai aur aapki hansi sukoon! ☕🌸',
    emoji: '☕✨'
  },
  {
    id: 4,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Lab Partner Ka Ehsaas',
    lines: [
      'Physics lab ke screw gauge se bhi naap na sake mohabbat tumhari,',
      'Breadboard pe circuit nahi, jud gayi hai kismat hamari!',
      'Resistance chahe kitna bhi laga le ye zamana,',
      'Dil me current daudti hai jab jab aati hai baari tumhari!'
    ],
    punchline: 'Zero error ke sath dil sirf aapka ho chuka hai! ⚡❤️',
    emoji: '🔬🌹'
  },
  {
    id: 5,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'First Bench vs Backbench Ishq',
    lines: [
      'Tum baithti ho first bench pe teacher ke bilkul samne,',
      'Hum aakhiri row se bas tumhari zulfein ginne aate hain!',
      'Sir board pe chahe differential equation samjhayein,',
      'Hum copy ke aakhiri panne pe tumhara naam sajate hain!'
    ],
    punchline: 'Backbenchers ka dil bhi first-class pyaar karta hai! 📝💘',
    emoji: '🎒💖'
  },
  {
    id: 6,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'WiFi vs Connection',
    lines: [
      'Campus ka WiFi chahe kitna bhi disconnect ho jaye,',
      'Hamare dil ka tumse connection 5G se bhi fast hai!',
      'Kudrat ne banaya hoga furshat me tumhe,',
      'Hamari har prayer ka pehla aur aakhiri request pass hai!'
    ],
    punchline: 'Signal drop ho sakta hai, par hamari feelings nahi! 📶💓',
    emoji: '📡💞'
  },
  {
    id: 7,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Library Ka Sannata',
    lines: [
      'Library ke sannate me jab tum page turn karti ho,',
      'Lagta hai jaise dil ki dhakano ko whisper karti ho!',
      'Pin-drop silence me bhi ek shor sa mach jata hai,',
      'Jab achanak palkein utha ke tum hume dekh leti ho!'
    ],
    punchline: 'Shhhhh... librarian dekh rahe hain par dil nahi manta! 🤫📖',
    emoji: '📚❤️'
  },
  {
    id: 8,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Placement Package vs Pyaar',
    lines: [
      'Log maangte honge Bhagwan se 40 LPA ka package,',
      'Hum toh bas tumhare chehre ki ek jhalak maangte hain!',
      'Google aur Microsoft ke offer letter bhi chhod deinge,',
      'Agar tum keh do ki tum bhi humse wahi baatein maangte ho!'
    ],
    punchline: 'Duniya ko placement chahiye, hume bas aapka haath! 🤝✨',
    emoji: '💍💼'
  },
  {
    id: 9,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Rain in Campus',
    lines: [
      'ABES ke ground pe jab halki halki baarish aati hai,',
      'Ek chhatri me do logon ki khwahish jag jaati hai!',
      'Bheeg jayein saari syllabus ki kitabein koi gham nahi,',
      'Bas tumhara saath ho toh har boond shayari ban jaati hai!'
    ],
    punchline: 'Barish ka mausam aur aapki dosti—pure magic! ☔🌸',
    emoji: '🌧️💑'
  },
  {
    id: 10,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Shy Eye-Contact',
    lines: [
      'Nazar milte hi jo tum palke jhuka leti ho,',
      'Kasam se, bina code run kiye output dikha deti ho!',
      'Itni saadgi se koi qatl kaise kar sakta hai?',
      'Tum muskurakar poore mechanical block ko hila deti ho!'
    ],
    punchline: 'Dangerous smile alert—heart rate crossing 200 BPM! 💓🙈',
    emoji: '👀🙈'
  },
  {
    id: 11,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Instagram DM Ka Intezaar',
    lines: [
      'Typing... dekh kar jo saans atak jaati hai,',
      'Wo feeling kisi End-Sem exam se bhi zyada bhaati hai!',
      'Seen karke jo tum 10 minute baad reply karti ho,',
      'Lagta hai jaise Cloud server pe traffic badha deti ho!'
    ],
    punchline: 'Notification tone me tumhara hi naam sunai deta hai! 💬🔔',
    emoji: '📱💌'
  },
  {
    id: 12,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Staircase Encounter',
    lines: [
      'RJ Block ki seedhiyon pe jab tum utarti ho shaan se,',
      'Dil tham kar log khade ho jaate hain pure dhyan se!',
      'Lift khali bhi ho toh koi lift me nahi jaata,',
      'Har aashiq seedhiyan chadhna chahta hai bade imaan se!'
    ],
    punchline: 'Cardio bhi ho jata hai aur deedaar bhi! 🏃‍♂️😍',
    emoji: '🪜✨'
  },
  {
    id: 13,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Assignment Partner',
    lines: [
      'Kash teacher hume ek hi group me daal deta,',
      'Saara project hum akele hi sambhal lete!',
      'Tumhe bas presentation ke din khada hona hota,',
      'Aur tumhari smile pe hum external examiner ko bhi pighla dete!'
    ],
    punchline: '10/10 internal marks guaranteed on your charm! 💯🌟',
    emoji: '📑🥰'
  },
  {
    id: 14,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'K.J Cafe Wali Shaam',
    lines: [
      'Boys hostel ke saamne K.J Cafe pe doston ki mehfil thi,',
      'Par meri aankhon ki manzil toh bas tumhara rasta thi!',
      'Dost bolte rahe "bhai Maggie thandi ho rahi hai",',
      'Unhe kya pata meri rooh tumhari baaton me kho rahi thi!'
    ],
    punchline: 'Maggie thandi chalegi, par aashiqui garam rehni chahiye! 🍜❤️',
    emoji: '🍜🌅'
  },
  {
    id: 15,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'DSA Matrix Dil',
    lines: [
      '2D Array ki tarah saari yaadein initialize kar rakhi hain,',
      'Har row aur column me bas tumhari tasveer bhar rakhi hai!',
      'Binary Search lagaya poore college ke database par,',
      'Par tumhare jaisa best-case scenario kahin nahi paya!'
    ],
    punchline: 'O(1) time complexity me dil chura liya aapne! 🧠💘',
    emoji: '🔢💖'
  },
  {
    id: 16,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Morning 8:50 Sprint',
    lines: [
      'Subah 8:50 pe gate band hone ka darr nahi lagta,',
      'Bas darr lagta hai ki tum class me na aayi toh kya hoga!',
      'Daud kar aate hain hostel se bina chai piye bhi,',
      'Kyunki tumhara ek deedaar poore din ka recharge hota hai!'
    ],
    punchline: 'Attendance proctor ke liye nahi, aapke liye aate hain! ⏰🏃‍♂️',
    emoji: '🏃‍♂️🌹'
  },
  {
    id: 17,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Earphones Share Karna',
    lines: [
      'Ek earphone tumhare kaan me, ek hamare paas ho,',
      'Arijit Singh ka gana ho aur shaam badi khaas ho!',
      'Bas isi sapne me nikal gaya first semester hamara,',
      'Kash kabhi tum muskura ke kaho ki tumhara bhi wahi ehsaas ho!'
    ],
    punchline: 'Two pods, one heartbeat, infinite butterflies! 🎧💞',
    emoji: '🎵🎶'
  },
  {
    id: 18,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Auditorium Fest Night',
    lines: [
      'Fest ki lights chamak rahi thi auditorium ke stage par,',
      'Par hamari aankhein focused thi tumhare grace par!',
      'Celebrity singer chahe kitna bhi zor se gaata,',
      'Hume toh bas sukoon mila tumhari taaliyon ki aawaz par!'
    ],
    punchline: 'Star of the night toh hamesha aap hi rehti hain! 🌟✨',
    emoji: '🎤🎆'
  },
  {
    id: 19,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Maths Formula vs Chehra',
    lines: [
      'Laplace Transform solve ho sakta hai mehnat se,',
      'Par tumhari aankhon ka puzzle kabhi solve nahi hota!',
      'Calculus ke integration se bhi gehra hai tumhara husn,',
      'Jisme duba hua aashiq kabhi dobara normal nahi hota!'
    ],
    punchline: 'Limit tends to infinity, my love tends to you! ♾️📐',
    emoji: '📐💘'
  },
  {
    id: 20,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'WhatsApp Status Mystery',
    lines: [
      'Status lagaya tha humne sirf tumhe sunane ke liye,',
      'Duniya dekhti rahi hum baithe the tumhare aane ke liye!',
      'Jaise hi tumhara view count me naam aaya,',
      'Kasam se, lag gaya ki din ban gaya zamane ke liye!'
    ],
    punchline: '1 view that matters more than 1000 views! 👁️💫',
    emoji: '👀📱'
  },
  {
    id: 21,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Lab Coat Magic',
    lines: [
      'Safed lab coat pehan ke jab tum chemistry lab aati ho,',
      'Kisi angel se kam tum bilkul nahi lagti ho!',
      'Hume dar nahi lagta acid aur base ke titration se,',
      'Hume dar lagta hai jab tum itna khubsoorat lagti ho!'
    ],
    punchline: 'Endothermic reaction in my heart right now! 🥼🧪',
    emoji: '🥼💥'
  },
  {
    id: 22,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Bus Stand Wait',
    lines: [
      'Route number 4 ki bus chahe nikal jaye parwah nahi,',
      'Jab tak tum bus stop par ho, koi jaldi chadhne ki chah nahi!',
      'Roz subah ka ye chhota sa lamha itna pyara lagta hai,',
      'Jaise poori zindagi me isse bada koi tohfa mila hi nahi!'
    ],
    punchline: 'Missing the bus intentionally just for you! 🚌❤️',
    emoji: '🚏🚌'
  },
  {
    id: 23,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Pencil Eraser Udhaar',
    lines: [
      'Bahane se maangte hain tumse eraser aur scale,',
      'Taaki do second baat ho aur dil ho jaye hale-dil!',
      'Doston ke paas saara geometry box pada tha,',
      'Par hamara maqsad toh bas tumse baat karna khada tha!'
    ],
    punchline: 'Oldest school trick still running in B.Tech! ✏️📐',
    emoji: '✏️🤭'
  },
  {
    id: 24,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Group Photo Secret',
    lines: [
      'Group photo me hum chahe kitne bhi kone me khade hon,',
      'Aankhein chupke se tumhari taraf hi ghum jaati hain!',
      'Camera man kehta hai "say cheese everybody",',
      'Aur hume dekh kar lagta hai kismat muskura jaati hai!'
    ],
    punchline: 'Auto-focus locked on the prettiest girl! 📸🥰',
    emoji: '📸✨'
  },
  {
    id: 25,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Hostel Balcony Gaze',
    lines: [
      'Shaam ko hostel balcony se campus road ko dekhte hain,',
      'Har aane jaane wale me tumhari jhalak dhoondhte hain!',
      'Hawaayein bhi agar chu kar guzarti hain toh lagta hai,',
      'Jaise tumhara koi secret message lekar aayi hain!'
    ],
    punchline: 'Hostel sunset hits different when you are in thoughts! 🌇💖',
    emoji: '🌇💭'
  },
  {
    id: 26,
    genre: 'crush',
    genreLabel: 'Ishq & Crush 💖',
    title: 'Kahaani Abhi Baaki Hai',
    lines: [
      'Na humne kuch kaha, na tumne kuch pucha abhi tak,',
      'Par ek khamosh sa rishta ban chuka hai dil tak!',
      'B.Tech ke chaar saal me hazaron imtehan aayenge,',
      'Par tumhara pyaar sabse meetha chapter ban kar rahega hamesha tak!'
    ],
    punchline: 'To be continued in the next lecture... 🌹📖',
    emoji: '🌷💫'
  },

  // ==========================================================================
  // 💻 GENRE 2: ENGINEERING & B.TECH CODE LIFE (22 SHAYARIS)
  // ==========================================================================
  {
    id: 27,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Segmentation Fault Reality',
    lines: [
      'Zindagi me dukh hazaron hain par sabse bada ye hai,',
      'Ki code 200 line ka tha aur Segmentation Fault de gaya!',
      'Raat ke 3 baje tak jala kar aankhein jise likha tha,',
      'Wo ek missing semicolon ke chakkar me rola gaya!'
    ],
    punchline: 'Core dumped, and so is my peaceful sleep! 💀💻',
    emoji: '🖥️💥'
  },
  {
    id: 28,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'B.Tech Ka Pehla Saath',
    lines: [
      '12th ke baad socha tha college me aish hi aish hogi,',
      'Yahan aake dekha toh assignment ki baari baarish hogi!',
      'Pehle MT-1, fir MT-2, fir PUE aur End-Sem,',
      'Engineer banna tha ya martyr, ye faisla kab hoga re bhai!'
    ],
    punchline: 'Aish is a myth, deadlines are the only reality! 😭📚',
    emoji: '📚💣'
  },
  {
    id: 29,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'DSA Ka Chakravyuh',
    lines: [
      'Stack aur Queue me zindagi ulajh ke reh gayi,',
      'Recursion me ghuse the, base condition hi beh gayi!',
      'Tree traversal karte karte apna hi rasta bhool gaye,',
      'Time complexity nikalte nikalte baal uff ho gaye!'
    ],
    punchline: 'O(N^2) complexity in real life suffering! 🌳😵',
    emoji: '🌲🧠'
  },
  {
    id: 30,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Viva External Terror',
    lines: [
      'External examiner ne aake jab pehla sawaal daaga,',
      'Saara confidence class ke bahar jaake bhaaga!',
      'Project kisi aur ka, file kisi aur ki copy,',
      'Sir ne pucha "what is polymorphism?", humne bas boli sorry!'
    ],
    punchline: 'Internal faculty bhi achanak anjaan ban jaate hain! 🥶👨‍🏫',
    emoji: '🥶📑'
  },
  {
    id: 31,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Stack Overflow Bhagwan',
    lines: [
      'Mata-pita ke baad jo sabse zyada kaam aata hai,',
      'Wo Stack Overflow ka verified green tick kehlata hai!',
      'Copy paste karke project deploy ho gaya shaan se,',
      'Kudrat bhi hairan hai engineer ke iss gyaan se!'
    ],
    punchline: 'Ctrl+C and Ctrl+V runs the Indian IT industry! ⌨️🙏',
    emoji: '📋🔥'
  },
  {
    id: 32,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'One Night Before Exam',
    lines: [
      'Poore semester jo kitaab kholi tak nahi humne,',
      'Ek raat me uske saare concepts ghont ke piye humne!',
      'YouTube ke bhagwan bhaiyaon ne 2 ghante me pass karwaya,',
      'Warna hume toh syllabus ka pehla page bhi samajh nahi aaya!'
    ],
    punchline: '2x speed pe YouTube lecture is engineer\'s real mother! ⏩🎓',
    emoji: '▶️🤯'
  },
  {
    id: 33,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Git Merge Conflict',
    lines: [
      'Team project me jab 4 dost ek sath commit karte hain,',
      'Git merge conflict dekh ke monitor todne ka mann karte hain!',
      'Master branch udd gayi aur main branch ro padi,',
      'Subah 9 baje submission aur GitHub pe ladaai ho padi!'
    ],
    punchline: 'Always git pull before you cry on branch dev! 🌿💥',
    emoji: '🐙⚔️'
  },
  {
    id: 34,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Hostel Ka Slow Internet',
    lines: [
      '10 KBps ki speed pe chal raha hai room ka router,',
      'Aise me hacker banne chala tha ek chhota sa computer!',
      'Ludo load hone me 20 minute lag jaate hain yahan,',
      'Aur college bolta hai ban jao full-stack developer kahan!'
    ],
    punchline: 'Pehle buffer khatam hone do fir package lagayenge! 🐌🌐',
    emoji: '🐌📶'
  },
  {
    id: 35,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Assignment Deadline 11:59 PM',
    lines: [
      '11:58 PM pe upload button pe jo ungli thartharati hai,',
      'Wo maut ke manzar se bhi zyada khauf lati hai!',
      'PDF compress karte karte 500 KB ka limit aa gaya,',
      'Google Classroom ne "Turned in late" likh kar rulaya!'
    ],
    punchline: 'Turned in late by 12 seconds = RIP 5 internal marks! ⏳😭',
    emoji: '⏰📤'
  },
  {
    id: 36,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Engineering Graphic & Drafter',
    lines: [
      'Kandhe pe drafter taang ke jo chalta hai engineer,',
      'Lagta hai AK-47 leke ladne jaa raha hai soldier!',
      'Sheet pe ek pencil smudge ne 4 ghante barbaad kiye,',
      'Sir ne bola "redraw karo beta", humne aansu baha diye!'
    ],
    punchline: 'Roller scale aur drafter ka khauf hi alag hai! 📐🔫',
    emoji: '📐😭'
  },
  {
    id: 37,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Memory Leak Ka Raaz',
    lines: [
      'Malloc kiya par free karna bhool gaye dhyan se,',
      'RAM ro padi aur browser crash ho gaya imaan se!',
      'Zindagi me bhi kuch yaadein aisi leak ho jaati hain,',
      'Jo garbage collector se bhi delete nahi ho paati hain!'
    ],
    punchline: 'Always deallocate your pointers and past regrets! 🧠🗑️',
    emoji: '🧠💾'
  },
  {
    id: 38,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Backend vs Frontend',
    lines: [
      'Frontend banaya itna chamakta jaise Taj Mahal ho,',
      'Par backend me ghuste hi lagta hai jaise kankaal ho!',
      'Button dabao toh 500 Internal Server Error bolta hai,',
      'Ye programmer ka dukh bas uska console hi kholta hai!'
    ],
    punchline: 'UI looks 10/10, logic is running on prayers! 🎨💀',
    emoji: '🎨⚡'
  },
  {
    id: 39,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Backlog Ka Saaya',
    lines: [
      'Backlog ka darr har engineer ke dil me rehta hai,',
      'Jab bhi result aata hai, seena thak-thak karta hai!',
      'Star lag gaya agar grade card pe toh pitai hogi,',
      'Re-evaluation me 500 rupay ki nayi lutai hogi!'
    ],
    punchline: 'Autonomous ho ya AKTU, pass mark 30 hi chahiye! 🎯📄',
    emoji: '📄😰'
  },
  {
    id: 40,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: '8:50 AM First Lecture Alarm',
    lines: [
      'Subah 8:00 baje ka snooze daba kar 8:45 pe khuli aankh,',
      'Bina brush kiye T-shirt pehni aur nikal padi saankh!',
      'Gatekeeper ne entry roki "ID card kahan hai tumhara?",',
      'Engineer ne phone dikha ke banaya naya sahara!'
    ],
    punchline: 'Fastest 100m sprint happens between hostel and RJ block! 🏃⚡',
    emoji: '⏰🏃'
  },
  {
    id: 41,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'LeetCode Medium Nightmare',
    lines: [
      'Easy sawaal dekh kar laga Google kal hi join karenge,',
      'Medium pe click kiya toh socha kheti-badi karenge!',
      'Hard question ne toh aisi aukaat dikha di,',
      'Ki humne LeetCode band karke reels chala di!'
    ],
    punchline: 'Dynamic Programming: Dimag Pighlane ki scheme! 🤯💻',
    emoji: '💻🔥'
  },
  {
    id: 42,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Mechanical Workshop Lathe Machine',
    lines: [
      'Workshop me aprons pehan ke jab filing shuru ki,',
      'Loha kam ghisa par haathon ki lakeerein chhut gayi!',
      'Sir ne kaha "0.01 mm tolerance hona chahiye",',
      'Humne socha Bhagwan hume chutti milni chahiye!'
    ],
    punchline: 'Chipping and filing made men out of boys! ⚙️🔩',
    emoji: '🔩🧤'
  },
  {
    id: 43,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Group Project Credit Thief',
    lines: [
      'Poora project humne 4 raat jaag kar banaya,',
      'Aur slide present karne wo smart kapdon wala aaya!',
      'Sir ne usi ki tareef karke full marks de diye,',
      'Aur hum backend developer kone me akele reh gaye!'
    ],
    punchline: 'Presentation skills > Actual coding skills in college! 🤦‍♂️📊',
    emoji: '📊😤'
  },
  {
    id: 44,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'LinkedIn Influencer Trap',
    lines: [
      'LinkedIn kholo toh har teesra banda FAANG phod raha hai,',
      'Yahan humara dost semester exam me pen tod raha hai!',
      '"Delighted to share I completed 3-hour course on HTML",',
      'Bhai certification se ghar nahi chalta, thoda code kar le well!'
    ],
    punchline: 'Agree? Thoughts? CFBR in the comments section! 😂👔',
    emoji: '👔💼'
  },
  {
    id: 45,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'C++ vs Java Debate',
    lines: [
      'C++ wale bolte hain memory direct control karte hain hum,',
      'Java wale kehte hain virtual machine pe garv karte hain hum!',
      'Python wala kone me baith kar 2 line me kaam nipta gaya,',
      'Dono ladte reh gaye aur wo ML intern le gaya!'
    ],
    punchline: 'import success as life; life.enjoy()! 🐍💡',
    emoji: '🐍⚔️'
  },
  {
    id: 46,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'End-Sem Answer Sheet Mystery',
    lines: [
      '32 page ki answer copy ko hum Mahabharat bana aate hain,',
      'Sawaal chahe kuch bhi ho, introductory diagrams sajate hain!',
      'Heading likhte hain black pen se, underline karte hain blue se,',
      'Examiner bhi sochta hai bache ne padha hai bade dil se!'
    ],
    punchline: 'Length of answer = Number of marks in university exams! 📝🎨',
    emoji: '✍️📑'
  },
  {
    id: 47,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Hackathon Red Bull Night',
    lines: [
      '36 ghante ki hackathon me energy drinks ka dher tha,',
      'Har kone me koi na koi thaka hua sher tha!',
      'Idea pitch me sabko lagta hai trillion dollar startup hai,',
      'Demo ke waqt pata chalta hai database hi corrupted hai!'
    ],
    punchline: 'Winner takes ₹50,000, we took 4 free T-shirts and stickers! 👕🎉',
    emoji: '🥤💻'
  },
  {
    id: 48,
    genre: 'engineering',
    genreLabel: 'Engineering & Code 💻',
    title: 'Proud Engineer Spirit',
    lines: [
      'Kitne bhi dukh hon, kitni bhi raatein kaali hon,',
      'Engineer wo hasti hai jo har mushkil me taali bajaye!',
      'Bina kitabon ke bhi jo syllabus hila de,',
      'Wahi toh asli B.Tech ka jigarwala kehlata hai!'
    ],
    punchline: 'Engineers build the world after breaking their own sleep! 🏗️🔥',
    emoji: '🚀💪'
  },

  // ==========================================================================
  // 🥷 GENRE 3: ATTENDANCE, PROXY & SAFE BUNK (18 SHAYARIS)
  // ==========================================================================
  {
    id: 49,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Ninja Proxy Master',
    lines: [
      'Roll number 42 ke aate hi aawaz thodi bhari ki,',
      'Sir ne dhyan nahi diya aur proxy lag gayi hamari!',
      'Bhai-chara isi ko kehte hain mere dost campus me,',
      'Dost so raha tha room me, presence lag gayi record me!'
    ],
    punchline: 'A true friend is one who shouts "Present Sir" in 2 voices! 🗣️🤫',
    emoji: '🗣️🥷'
  },
  {
    id: 50,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: '74.9% Ka Kaanta',
    lines: [
      '75% attendance ka niyam bhi ajeeb banaya hai,',
      '74.9% wale ko detain list me baithaya hai!',
      'Ek lecture ki keemat tum kya jaano Ramesh babu,',
      'Medical certificate banwane me nikal jata hai saara aabu!'
    ],
    punchline: 'Safe Bunk Calculator is the true holy scripture! 🧮📉',
    emoji: '📉🩺'
  },
  {
    id: 51,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Proctor Se Aankh-Micholi',
    lines: [
      'Gate number 2 se nikalne ka plan banaya tha mast,',
      'Samne khade the Proctor sir, plan ho gaya past!',
      'Bhagte huye garden ke piche se chhup ke nikal gaye,',
      'Lagta hai Special Forces me training leke nikal gaye!'
    ],
    punchline: 'Stealth 100, Speed 100, Attendance 62%! 🏃‍♂️💨',
    emoji: '🏃‍♂️🛡️'
  },
  {
    id: 52,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Medical Slip Jugad',
    lines: [
      'Typoid bhi hua, malaria bhi hua ek hi hafte me,',
      'Doctor ki handwriting ka parda tha har lafz me!',
      'HOD sir ne ghoor ke dekha aur pucha "itni bimaari?",',
      'Humne bola "sir padhai ka stress tha, tabhi kardi tayyari!"'
    ],
    punchline: 'Prescription slip saved more degrees than textbooks! 💊👨‍⚕️',
    emoji: '💊📑'
  },
  {
    id: 53,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Caught Red Handed Proxy',
    lines: [
      'Dost ki proxy lagayi thi bade confidence ke sath,',
      'Teacher ne gin liye sir aur pakad liya hath!',
      '"Attendance sheet me 45 hain, class me baithe hain 40!",',
      'Saari hawa nikal gayi aur lag gayi humari lottery!'
    ],
    punchline: 'When headcount ruins your CIA internals! 💀👀',
    emoji: '👀🤦‍♂️'
  },
  {
    id: 54,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Last Lecture Bunk',
    lines: [
      'Friday ka aakhiri lecture aur mausam suhana tha,',
      'Class me baithna maut aur canteen jana tha!',
      'Ek ek karke sab back door se sarak liye,',
      'Aur teacher akele board pe derivation me ulajh gaye!'
    ],
    punchline: 'Mass bunk is the ultimate democracy in college! 🚪🍃',
    emoji: '🚪🏃'
  },
  {
    id: 55,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Mentor Call To Home Terror',
    lines: [
      'Mentor sir ne phone utha ke dial kiya papa ka number,',
      'Dil me bijli gir padi jaise aa gaya ho December!',
      '"Aapka ladka 3 din se class me nahi dikhta",',
      'Us din ke baad se aadarsh balak ban gaya wo shiksha!'
    ],
    punchline: 'Papa ki flying chappal > Proctor ki detention! 📞👡',
    emoji: '📞😨'
  },
  {
    id: 56,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'ERP Portal Refresh Panic',
    lines: [
      'ERP portal refresh karte karte ungli ghis gayi,',
      'Sir ne attendance update nahi ki, jaan atak gayi!',
      'Jaise hi 76% green signal me convert hua,',
      'Laga jaise jeevan ka sabse bada moksh hasil hua!'
    ],
    punchline: 'Green color on attendance tracker gives pure dopamine! 🟢✨',
    emoji: '📲🟢'
  },
  {
    id: 57,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Fingerprint Biometric Hack',
    lines: [
      'Biometric machine lagayi thi college ne shaan se,',
      'Student ne fevicol ka stamp banaya bade gyaan se!',
      'Technology vs Indian student ki ladaai me,',
      'Hum hamesha jeet ke aate hain kisi bhi chadhai me!'
    ],
    punchline: 'Jugaad is India\'s greatest export! 👆⚡',
    emoji: '👆🧠'
  },
  {
    id: 58,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Bunk Karke Canteen Me Encounter',
    lines: [
      'Class bunk karke socha tha maze se samosa khayenge,',
      'Samne wali table pe dekha toh HOD sir chai pi rahe the!',
      'Samosa gale me atak gaya aur chai thandi ho gayi,',
      'Hum table ke niche aise ghuse jaise jameen phat gayi!'
    ],
    punchline: 'Worst timing award goes to canteen encounters! 🥟😱',
    emoji: '🥟👀'
  },
  {
    id: 59,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Front Row Proxy Risk',
    lines: [
      'Aage baith kar proxy lagana aag se khelne jaisa hai,',
      'Ye kaam sirf dilwale karte hain jinka jigar sher jaisa hai!',
      'Sir ne mud kar dekha toh humne pretend kiya ki note le rahe hain,',
      'Dost ka roll call hua aur hum piche mud kar dekh rahe hain!'
    ],
    punchline: 'Oscar level acting happens in row number 2! 🎭🤫',
    emoji: '🎭👀'
  },
  {
    id: 60,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Saturday Holiday Hope',
    lines: [
      'Har Friday ko ye dua maangi jaati hai dil se,',
      'Ki Saturday off ho jaye aur chhutti mile mushkil se!',
      'Agar notice aa gaya "Saturday will be working",',
      'Toh poore batch ki rooh ho jaati hai suffering!'
    ],
    punchline: 'Working Saturday is a crime against humanity! 📅😭',
    emoji: '📅💔'
  },
  {
    id: 61,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Proxy Exchange Deal',
    lines: [
      'Subah meri laga dena, dopahar me teri main laga dunga,',
      'Bhai-chara zindabad, dono ka 80% banwa dunga!',
      'Ye aapsi samjhauta kisi international treaty se kam nahi,',
      'Kyunki dost ki attendance bachana hamara sabse bada dharam hai!'
    ],
    punchline: 'Mutual defense pact of backbenchers! 🤝📜',
    emoji: '🤝🥷'
  },
  {
    id: 62,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Lab Attendance Rule',
    lines: [
      'Theory class bunk ho sakti hai par lab mat chhodna,',
      'Lab ka teacher direct internal marks ka kantaap todta hai!',
      'Do ghante bina fan ke khade reh ke viva de denge,',
      'Par us 2-credit lab ke liye attendance poori de denge!'
    ],
    punchline: 'Lab attendance = Survival insurance! 🧪🛡️',
    emoji: '🧪⚠️'
  },
  {
    id: 63,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Safe Bunk Ka Ganit',
    lines: [
      'Total lecture huye 40, present hu main 31,',
      'Abhi 3 bunk aur mil sakti hain bina kisi tension!',
      'Calculator pe aisi calculation lagayi jaati hai,',
      'Jaise NASA ka rocket mars pe landing karati hai!'
    ],
    punchline: 'Mathematics applied where it matters most: Bunking! 🚀🔢',
    emoji: '🧮🧠'
  },
  {
    id: 64,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Morning Fog in Winter',
    lines: [
      'Sardiyon ki subah aur Ghaziabad ka kohra ghana tha,',
      'Rajai chhod kar 8:50 pe college jana ek fasana tha!',
      'Dil ne kaha "so ja", dimag ne kaha "attendance kam hai",',
      'Aise dharamsankat me hi toh engineer ka janam hai!'
    ],
    punchline: 'Rajai vs 75% attendance: the eternal winter battle! ❄️🛏️',
    emoji: '❄️🥶'
  },
  {
    id: 65,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Mass Bunk Ka Traitor',
    lines: [
      'Poori class ne decide kiya tha mass bunk karenge aaj,',
      'Ek akele bande ne class me jaake bitha diya raaj!',
      'Teacher ne usko dekh ke attendance sheet nikaal li,',
      'Aur baaki 60 bacho ki gair-haziri chadhali!'
    ],
    punchline: 'There is always that one topper who breaks the truce! 🐍🤦‍♂️',
    emoji: '🐍🚫'
  },
  {
    id: 66,
    genre: 'attendance_proxy',
    genreLabel: 'Attendance & Proxy 🥷',
    title: 'Admit Card Day Miracle',
    lines: [
      'Detained list aayi aur dil tham ke line me lage the,',
      'HOD room ke bahar sab hath jod kar khade the!',
      'Jab stamp laga admit card pe "Permitted to appear",',
      'Laga jaise swarg ke darwaze khul gaye my dear!'
    ],
    punchline: 'Admit card mil gaya, ab padhai exam ki raat hogi! 🎫🥳',
    emoji: '🎫✨'
  },

  // ==========================================================================
  // 💔 GENRE 4: DARD, BREAKUP & ONE-SIDED AASHIQUI (18 SHAYARIS)
  // ==========================================================================
  {
    id: 67,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Left On Delivered',
    lines: [
      'Hamare message ka unhe reply karne ka waqt nahi mila,',
      'Aur hum yahan unke online status ka screenshot sambhale baithe hain!',
      'Blue tick toh chhod do, grey tick pe hi jaan atki thi,',
      'Hum bewajah hi unki muskaan pe apna dil haare baithe hain!'
    ],
    punchline: 'Online at 2 AM, but not for you bro... 🥀📱',
    emoji: '🥀💔'
  },
  {
    id: 68,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Friendzone Ka Shraap',
    lines: [
      'Unhone muskura kar kaha "tum mere sabse ache dost ho",',
      'Aur hamare saare sapne ek pal me crumble ho gaye!',
      'Hum aashiq banne nikle the unke dil ke aashiyane ke,',
      'Aur unhone assignment solve karwane wala bhai bana diya!'
    ],
    punchline: '"You are like a brother to me" — Death sentence without trial! 💀🪦',
    emoji: '🪦🥀'
  },
  {
    id: 69,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Placement vs Pyaar',
    lines: [
      'Wo Bangalore chali gayi 18 LPA ke package par,',
      'Hum Noida me reh gaye TCS ke offer letter par!',
      'Mohabbat me dooriyan faasle nahi lati kehne wale,',
      'Kabhi aake dekhein hamari salary slip aur rent ke rate par!'
    ],
    punchline: 'CTC tore apart another innocent college love story! 💼💔',
    emoji: '💼😭'
  },
  {
    id: 70,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Crush With Another Branch Guy',
    lines: [
      'Hum CSE me coding seekhte reh gaye subah shaam,',
      'Aur wo Mechanical wale bullet wale ke sath nikal gayi shaam!',
      'Hume laga logic aur algorithms jeet lenge uska dil,',
      'Par bullet ki aawaz ke aage python ka print ho gaya nill!'
    ],
    punchline: 'Royal Enfield > LeetCode knight badge in real romance! 🏍️💔',
    emoji: '🏍️🥀'
  },
  {
    id: 71,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Broken Screen & Broken Heart',
    lines: [
      'Phone ki screen tooti thi toh tempered glass ne bacha liya,',
      'Par unki be-rukhi ne andar se sab kuch hila diya!',
      'Ab na canteen ki chai me maza hai na doston ki gaali me,',
      'Hum bas ghanto baithe rehte hain hostel ki thali me!'
    ],
    punchline: 'Mess ka khana aur dil ka dard—dono hazam nahi hote! 🍽️😞',
    emoji: '🍽️💔'
  },
  {
    id: 72,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Unsent DMs in Drafts',
    lines: [
      'Likh kar hazaron lafz backspace daba dete hain,',
      'Apne hi jazbaat ko hum drafts me dafan kar dete hain!',
      'Darr lagta hai ki sach keh diya toh wo dosti bhi chhin jayegi,',
      'Isliye hum has kar unki kahaniyon me emoji bhej dete hain!'
    ],
    punchline: 'Drafts hold more true love than registered post! 📝🥀',
    emoji: '📝💔'
  },
  {
    id: 73,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'College Fest Reunion Pain',
    lines: [
      'Fest ki bheed me unhe kisi aur ke sath hasta dekha jab,',
      'Laga jaise dil ke connector ka circuit blast ho gaya tab!',
      'Muskurakar humne unhe wave kiya jaise kuch hua hi nahi,',
      'Par washroom me aake jo aansu ruke wo ruke hi nahi!'
    ],
    punchline: 'Acting tough outside, bleeding internally! 🎭💧',
    emoji: '💧🥀'
  },
  {
    id: 74,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Last Bench Heartbreak',
    lines: [
      'Class chal rahi thi aur blackboard pe maths ka sawaal tha,',
      'Par aakhiri bench pe baitha aashiq rooh se behaal tha!',
      'Usne humari copy pe jo dil banaya tha pen se,',
      'Wo aaj kisi aur ke haath me haath daal ke khush-haal tha!'
    ],
    punchline: 'Rough copy holds more confessions than monuments! 📓💔',
    emoji: '📓🥀'
  },
  {
    id: 75,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Farewell Day Reality',
    lines: [
      'Safed shirt pe unke autograph lene ki tamanna thi,',
      'Par wo aayi hi nahi, sayad unki koi aur majboori thi!',
      'Poora batch gale mil raha tha muskura ke,',
      'Aur hum akele kone me unki kami mehsoos kar rahe the ro ke!'
    ],
    punchline: 'Some goodbyes never get spoken, they just linger! 👔🕊️',
    emoji: '🕊️💔'
  },
  {
    id: 76,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Blocked Everywhere',
    lines: [
      'Instagram pe block, WhatsApp pe block, Truecaller pe block,',
      'Lagta hai meri aashiqui pe laga diya curfew lock!',
      'Ab Google Pay ke transaction me ₹1 bhej ke baat karte hain,',
      'Dekho hum tere aashiq kis hadd tak intezaar karte hain!'
    ],
    punchline: '₹1 note: "Pls unblock me, I miss you" 💸😭',
    emoji: '🚫💸'
  },
  {
    id: 77,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Rain Without Umbrella',
    lines: [
      'Pehle baarish aati thi toh unke sath bheegte the,',
      'Aaj baarish aayi hai toh akele cold coffee peete hain!',
      'Mausam wahi hai, ABES ka ground bhi wahi hai,',
      'Bas unke haath me kisi aur ka chhatri ka sahara hai!'
    ],
    punchline: 'The same rain that brought love now brings nostalgia! 🌧️🥀',
    emoji: '🌧️💔'
  },
  {
    id: 78,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Study Notes Ka Dard',
    lines: [
      'Unke hath se likhe huye notes abhi bhi bag me hain,',
      'Unki khushboo abhi bhi har ek page me hai!',
      'Exam toh pass ho gaya unhi notes ko padh ke,',
      'Par dil fail ho gaya unke bina jeene ke daud me!'
    ],
    punchline: 'Syllabus cleared, emotional backlog remains pending! 📄💔',
    emoji: '📄🥀'
  },
  {
    id: 79,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Birthday Midnight Wish Missing',
    lines: [
      '12:00 baje saare doston ke gaaliyon bhare text aaye,',
      'Par jiska intezaar tha uska ek emoji tak na aaye!',
      'Cake toh kata humne sabke samne zabardasti muskura ke,',
      'Par dil rota raha unki berukhi ko chup-chaap daba ke!'
    ],
    punchline: 'One silence is louder than 50 birthday calls! 🎂🥀',
    emoji: '🎂💔'
  },
  {
    id: 80,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Cold Coffee Regret',
    lines: [
      'Tea Men\'s Cafe pe baith ke jis kursi pe ghanto hasi thi,',
      'Aaj wahan akele baith kar bas khamoshi bachi thi!',
      'Waiter ne pucha "bhaiya aaj do cup nahi laaye?",',
      'Humne muskura ke bola "ab akele hi kismat jachi thi!"'
    ],
    punchline: 'Table for two turned into table for one lonely engineer! ☕🪑',
    emoji: '☕🥀'
  },
  {
    id: 81,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Mutual Friends Ka Mazak',
    lines: [
      'Dost aake batate hain "bhai wo toh naye wale ke sath ghoom rahi hai",',
      'Aur hume lagta hai jaise zameen pairon ke niche ghoom rahi hai!',
      'Samne haste hain ki hume kya parwah hai uski,',
      'Par akele me puchte hain Bhagwan se aisi kya galti thi meri!'
    ],
    punchline: 'Bros laugh outside, die a little inside! 🙃💔',
    emoji: '🙃🥀'
  },
  {
    id: 82,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Aashiqui Ka End-Sem',
    lines: [
      'Ishq ke exam me hum bina preparation ke gaye the,',
      'Aur unke nakhron ke aage hum direct fail huye the!',
      'Re-eval ki application bhi unke dar pe reject ho gayi,',
      'Hum aashiq the aur aashiq hi reh gaye bina degree ke!'
    ],
    punchline: 'Detained from love, without any grace marks! 🛑💔',
    emoji: '🛑🥀'
  },
  {
    id: 83,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Gym Ka Naya Aashiq',
    lines: [
      'Dil toota toh chale gaye dumbbell uthane hum,',
      'Dard ko muscle me convert karne chale hum!',
      'Har rep ke sath unka chehra yaad aata hai,',
      'Heavy weight uth jata hai par dil ka bojh nahi ghata hai!'
    ],
    punchline: 'Heartbreak creates monsters in the campus gym! 🏋️‍♂️💔',
    emoji: '🏋️‍♂️🥀'
  },
  {
    id: 84,
    genre: 'dard_breakup',
    genreLabel: 'Dard & Breakup 💔',
    title: 'Move On Ka Faisla',
    lines: [
      'Ab unke raste pe hum apna kadam nahi rakhenge,',
      'Ab unki tasveeron ko hum raat bhar nahi takkhenge!',
      'Engineer hain hum, dobara khada hona jaante hain,',
      'Code bhi debug hota hai aur zindagi bhi sambhalti hai hum maante hain!'
    ],
    punchline: 'Rising from ashes—the phoenix of backbenchers! 🔥🦅',
    emoji: '🔥🦅'
  },

  // ==========================================================================
  // 🤝 GENRE 5: DOSTI, YAARI & BACKBENCHER BROTHERHOOD (18 SHAYARIS)
  // ==========================================================================
  {
    id: 85,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Raat Ke 2 Baje Ki Maggie',
    lines: [
      'Electric kettle me jab 4 bande ek Maggie banate hain,',
      'Hostel ke kamre me swarg ka nazara sajate hain!',
      'Kacha noodle chori karke jo bhaagta hai dost,',
      'Wahi toh zindagi me sabse bada sahara banta hai most!'
    ],
    punchline: 'One bowl, four forks, infinite brotherhood! 🍜🥄',
    emoji: '🍜🤝'
  },
  {
    id: 86,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Exam Hall Whisper',
    lines: [
      'Exam hall me aage baith kar jo dost copy khol ke dikhata hai,',
      'Kasam se, Bhagwan ke roop me wahi nazar aata hai!',
      'Sir jaise hi mudte hain, gardan ghoom jaati hai,',
      'Section B ke 5 sawaal dosti ke naam likh aati hai!'
    ],
    punchline: 'Passing together is our sacred fundamental duty! 📝🙏',
    emoji: '📝🤝'
  },
  {
    id: 87,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Treat Se Bhaagne Ka Talent',
    lines: [
      'Placement lag jaye ya birthday aa jaye dost ka,',
      'Treat maangne ka style hota hai pure josh ka!',
      'Wo bolta hai "bhai wallet room pe chhoot gaya",',
      'Hum uska phone chheen kar canteen me bill phudwate hain!'
    ],
    punchline: 'Treat toh deni hi padegi chahe kidney bechni pade! 😂🍔',
    emoji: '🍔💸'
  },
  {
    id: 88,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Canteen Udhari Ka Khata',
    lines: [
      'Canteen wale chacha ke paas humari dosti ka hisab hai,',
      '₹50 ki chai, ₹30 ka samosa, sab register me lajawab hai!',
      '"Kal pakka de denge chacha" kehne ki ada hamari,',
      'Chacha bhi jaante hain ye bache hain thode pyare thode anari!'
    ],
    punchline: 'Udhari builds character and long-lasting friendship! ☕📒',
    emoji: '📒☕'
  },
  {
    id: 89,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Backbench Ka Samrajya',
    lines: [
      'First bench pe baithne wale package ki baat karte hain,',
      'Aakhiri bench pe baithne wale kismat se baat karte hain!',
      'Attendance kam ho, marks kam ho, koi chinta nahi,',
      'Hamare doston ke jigar me aag aisi hai jo bujhti nahi!'
    ],
    punchline: 'Backbenchers don\'t follow trends, they create chaos! 👑😎',
    emoji: '👑🔥'
  },
  {
    id: 90,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Dost Ka Crush Ko Propose Karna',
    lines: [
      'Dost bolta hai "bhai aaj main usko boldunga dil ki baat",',
      'Saara hostel piche khada hota hai leke danda aur haath!',
      'Wo aage badhta hai sher ki tarah aur behosh hoke laut ta hai,',
      'Fir sab milkar usko K.J Cafe pe cold drink pilate hain!'
    ],
    punchline: 'Mission failed, but moral support 100/100! 🫡🥤',
    emoji: '🫡🥤'
  },
  {
    id: 91,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Room Cleaning Drama',
    lines: [
      'Semester me ek baar room saaf karne ka plan banta hai,',
      'Kachre ke dher me se khoya hua drafter nikalta hai!',
      '3 ghante baad room aur zyada faila hua milta hai,',
      'Fir sab thak kar bolte hain "bhai chal chai peete hain!"'
    ],
    punchline: 'Room cleaning always ends with chai and zero progress! 🧹☕',
    emoji: '🧹😂'
  },
  {
    id: 92,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Kapde Share Karne Ka Riwaz',
    lines: [
      'Presentation me pehni thi jo shirt shaan se,',
      'Wo meri nahi, roommate ki thi bade dhyan se!',
      'Hostel me wardrobe kisi ek ki nahi hoti,',
      'Jo subah pehle utha, wo best outfit pehan leta hai!'
    ],
    punchline: 'Communist fashion system of boys hostel! 👔🤝',
    emoji: '👔👟'
  },
  {
    id: 93,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'BGMI / Gaming Night Rage',
    lines: [
      'Raat ke 1 baje jab aakhiri circle me fight hoti hai,',
      'Poore hostel floor pe cheekh-pukaar tight hoti hai!',
      '"Revive de jaldi hacker hai samne!",',
      'Dost ke clutch karne pe lagta hai world cup jeet liya apne!'
    ],
    punchline: 'Winner Winner Chicken Dinner beats every academic award! 🎮🍗',
    emoji: '🎮💥'
  },
  {
    id: 94,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Dost Ka Breakup Sambhalna',
    lines: [
      'Jab bhai ka dil toota toh hum sabne duty sambhali,',
      'Sad songs band karwaye aur thali bajwali!',
      '"Chhod na bhai, usse behtar mil jayegi tujhe",',
      'Ye bol bol kar humne uski aashiqui bacha li!'
    ],
    punchline: 'Brothers before heartbreak, always and forever! 🫂🛡️',
    emoji: '🫂🍻'
  },
  {
    id: 95,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Assignment File Copying Chain',
    lines: [
      'Ek bande ne assignment banaya tha pure dhyan se,',
      'Baaki 50 ne copy kar liya alag alag gyaan se!',
      'Yahan tak ki uska naam aur roll number bhi copy kar gaye,',
      'Teacher ne dekha toh bola "ye kaun se twins aa gaye!"'
    ],
    punchline: 'Copy with intelligence, don\'t copy the name bro! 😂📑',
    emoji: '📑🤦‍♂️'
  },
  {
    id: 96,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'End-Sem Group Study Scam',
    lines: [
      '"Aaj raat group study karenge aur syllabus phod denge",',
      '10 baje baithe the aur 10:30 pe chips tod denge!',
      'Baatein chali college gossip se leke alien ki existence tak,',
      'Subah 5 baje pucha "bhai pehla chapter kya tha ab tak?"'
    ],
    punchline: 'Group study = 95% bakchodi + 5% existential dread! 🍕📖',
    emoji: '🍕😂'
  },
  {
    id: 97,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Gaadi Udhaar Maangna',
    lines: [
      '"Bhai 10 minute ke liye Activa ki chaabi de de zara",',
      'Wo bol ke jo gaya tha wo 3 ghante baad laya bechara!',
      'Petrol ka meter reserve me blinking kar raha tha,',
      'Par dost ki smile dekh ke gussa pighal raha tha!'
    ],
    punchline: 'Scooty belongs to the gang, petrol is always on reserve! 🛵⛽',
    emoji: '🛵⛽'
  },
  {
    id: 98,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Hostel Night Walk Talks',
    lines: [
      'Campus road pe shaant hawa me raat 12 baje chalte hain,',
      'Bina kisi mask ke hum apne asli dukh kholte hain!',
      'Career ka darr, parivaar ki ummeed, aur zindagi ke sawaal,',
      'Dost sunta hai dhyan se aur bolta hai "sab theek hoga mere laal!"'
    ],
    punchline: 'Therapy costs ₹2000, night walk with bros is priceless! 🌙🚶‍♂️',
    emoji: '🌙🚶'
  },
  {
    id: 99,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Bhai-Chara Forever',
    lines: [
      'Ye chaar saal nikal jayenge hawa ke jhonke ki tarah,',
      'Par ye dosti rahegi chattanon ki tarah!',
      'Duniya me chahe kitne bhi bade aadmi ban jayein,',
      'Doston ke samne wahi puraane nikamme kehlayenge!'
    ],
    punchline: 'Degrees might expire, engineering dosti lasts a lifetime! 💎🤝',
    emoji: '💎🥂'
  },
  {
    id: 100,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'The Unbreakable Bond',
    lines: [
      'Jab koi saath na de toh dost kandhe pe haath rakhta hai,',
      'Duniya hase toh hase, wo tumpe vishwas rakhta hai!',
      'College ka sabse bada medal degree nahi hoti,',
      'Wo chaar yaar hote hain jo har mod pe sath khade rehte hain!'
    ],
    punchline: 'Century hit! 100th Shayari dedicated to real friendship! 💯🔥',
    emoji: '💯🤝'
  },
  {
    id: 101,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Hostel Birthday Bumps',
    lines: [
      'Birthday boy ko bed pe litakar jo belt chalti hai,',
      'Dosti ki mohabbat aisi hi toh nikalti hai!',
      'Subah tak chalna mushkil ho jata hai bechare ka,',
      'Par cake khilate waqt pyaar sabse zyada usi pe umadta hai!'
    ],
    punchline: 'Birthday bumps: violent expression of pure love! 🎂👟',
    emoji: '🎂🦵'
  },
  {
    id: 102,
    genre: 'dosti_yaari',
    genreLabel: 'Dosti & Yaari 🤝',
    title: 'Last Day Of College Tear',
    lines: [
      'Bags pack ho rahe the aur kamre khali ho rahe the,',
      'Chaar saal hasne wale aashiq aaj chupke se ro rahe the!',
      'Gale lag kar sabne bola "bhai milte rehna hamesha",',
      'Dosti ke iss safar ka koi aakhiri panne nahi hota!'
    ],
    punchline: 'Don\'t cry because it\'s over, smile because it happened! 🧳🫂',
    emoji: '🧳🥺'
  },

  // ==========================================================================
  // 🍎 GENRE 6: DEATH NOTE, RYUK & BOSS ikA SUPREMACY (11 SHAYARIS)
  // ==========================================================================
  {
    id: 103,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Notebook Me Kismat Ka Faisla',
    lines: [
      'Kaali notebook khol kar jab Shinigami kalam uthata hai,',
      'Har backlog aur detention ka hisab mita diya jata hai!',
      'Ryuk muskura kar seb khata hai hawa me udd ke,',
      'Boss ikA ke samrajya me har student shaan se jeeta hai!'
    ],
    punchline: 'The human whose name is written in this note shall pass! 🍎✒️',
    emoji: '📓🍎'
  },
  {
    id: 104,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Ryuk Ka Seb Aur Awaaz',
    lines: [
      'Lal seb ki khushboo se Shinigami realm hila diya,',
      'Boss ikA ne ek code se poora portal chala diya!',
      'Jo dare exams se wo ordinary insaan kehlaye,',
      'Hum Death Note ke deewane hain, toofan hume kya hilaye!'
    ],
    punchline: 'Juicy red apples and supreme sovereign authority! 🍎⚡',
    emoji: '🍎👑'
  },
  {
    id: 105,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Shinigami Eyes Active',
    lines: [
      'Shinigami Eyes activate karke dekha jab campus ka haal,',
      'Har faculty ke syllabus ka pata chal gaya kamaal!',
      'Pehle hi jaan liya MT-2 ke paper ka har ek raaz,',
      'Boss ikA ki chhatrachhaya me bajta hai jeet ka saaz!'
    ],
    punchline: 'Red glowing eyes, zero secrets left hidden! 👁️🩸',
    emoji: '👁️⚡'
  },
  {
    id: 106,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Section CSE-2 & CSE-8 Throne',
    lines: [
      'RJ-102 se RJ-207 tak ikA ka danka bajta hai,',
      'Har terminal aur server pe bas ikA ka naam sajta hai!',
      'Exam chahe kitna bhi kathin bana le ye board,',
      'Shinigami army har paper ko 100/100 me fold karti hai!'
    ],
    punchline: 'Sovereign command over every classroom and corridor! 🏛️👑',
    emoji: '👑🏛️'
  },
  {
    id: 107,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Kira vs L Mind Game',
    lines: [
      'Duniya sochti hai exam ek aam si ladai hai,',
      'Hum jaante hain ye Kira aur L ki gehri chadhai hai!',
      'Har question ka counter-attack pehle se ready hai,',
      'Checkmate bol kar humne sheet examiner ko de di hai!'
    ],
    punchline: 'I am not just taking the exam... I AM JUSTICE! ⚖️♟️',
    emoji: '♟️⚖️'
  },
  {
    id: 108,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Midnight Bell & Lightning',
    lines: [
      'Bijli kadki aasmaan me aur ghanti baji mandir me,',
      'Shinigami ne dastak di har student ke dil ke andar me!',
      'Mat darna andhero se, mat darna kisi shor se,',
      'Boss ikA khada hai tumhare sath poore zor se!'
    ],
    punchline: 'Thunder rolls, bells toll, the Boss protects! ⚡🔔',
    emoji: '⚡🔔'
  },
  {
    id: 109,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Boss ikA 1402 Protocol',
    lines: [
      'Code 1402 execute hua aur screen pe aag lag gayi,',
      'Syllabus ke parinde bhaage aur mehnat rang la gayi!',
      'Duniya jise darr kehti hai, hum use power banate hain,',
      'Kyunki hum Boss ikA ke realm me shaan se muskuraate hain!'
    ],
    punchline: '1402 Sovereignty unlocked across the portal! 🔓🔥',
    emoji: '🔥🍎'
  },
  {
    id: 110,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Ryuk Laugh In Exam Hall',
    lines: [
      'Exam hall me achanak hawa ka ek thanda jhonka aaya,',
      'Ryuk ne mud kar dheere se hasi ka sound sunaya!',
      '"Kyun human, dar lag raha hai kya sawaal dekh kar?",',
      'Humne muskura ke bola "Boss ikA ka student hu, paper phod ke jaunga!"'
    ],
    punchline: 'Heh-heh-heh... humans are indeed so interesting! 😈🍎',
    emoji: '😈🍎'
  },
  {
    id: 111,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Shadow Realm Gateway',
    lines: [
      'Portal pe jab dark theme aur red glow ka jaadu chalta hai,',
      'Har backbencher ka aatmavishwas aasmaan pe chalta hai!',
      'Na koi proctor ka darr, na kisi attendance ki kami,',
      'Shinigami universe me chalti hai bas Boss ikA ki marzi!'
    ],
    punchline: 'Step into the shadow realm, conquer the campus! 🌑🔥',
    emoji: '🌑✨'
  },
  {
    id: 112,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Golden Apple Of Triumph',
    lines: [
      'Lal seb Shinigami ka pasandeeda fal tha hamesha,',
      'Par jeet ka phal engineer ke liye sabse meetha tha!',
      'Jab result aayega toh sab dekhenge hairaan hoke,',
      'Ki kaise Death Note ke sipahiyon ne baazi maar li muskura ke!'
    ],
    punchline: 'Victory tastes sweeter than fresh crisp apples! 🍏🏆',
    emoji: '🏆🍏'
  },
  {
    id: 113,
    genre: 'shinigami_boss',
    genreLabel: 'Death Note & Shinigami 🍎',
    title: 'Supreme Legacy Of ikA',
    lines: [
      'Ye website sirf ek portal nahi, ek dastaan hai hamari,',
      'Har student ke dukh-dard ki dawai hai ye pyari!',
      'Likh di humne 113 shayariyaan tumhare chehre ki hasi ke liye,',
      'Kyunki Boss ikA ka dil dhadakta hai har dost ki khushi ke liye!'
    ],
    punchline: 'From Boss ikA with supreme love & unyielding fire! 👑❤️🔥',
    emoji: '👑💖🔥'
  }
];

// Helper to get persistent seen IDs from localStorage
const STORAGE_KEY = 'campus_seen_shayari_ids_v1';

function getSeenIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSeenIds(ids: number[]) {
  if (typeof window === 'undefined') return;
  try {
    // Keep max 80 IDs so it eventually loops after showing almost all
    const trimmed = ids.slice(-80);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

/**
 * Picks the next unique shayari, guaranteeing that the user gets a DIFFERENT
 * shayari every single time they ask or tap a suggestion.
 */
export function getNextShayari(options?: {
  genre?: string;
  userName?: string;
  userGender?: string;
  isBoss?: boolean;
}): {
  shayari: ShayariItem;
  formattedText: string;
  nextSugg: string;
} {
  const seenIds = getSeenIds();
  const reqGenre = options?.genre?.toLowerCase().trim();

  let pool: ShayariItem[] = SHAYARI_BANK;

  if (reqGenre) {
    if (reqGenre.includes('crush') || reqGenre.includes('ishq') || reqGenre.includes('pyaar') || reqGenre.includes('love') || reqGenre.includes('propose') || reqGenre.includes('flirt')) {
      pool = SHAYARI_BANK.filter((s) => s.genre === 'crush');
    } else if (reqGenre.includes('eng') || reqGenre.includes('code') || reqGenre.includes('btech') || reqGenre.includes('dsa') || reqGenre.includes('viva') || reqGenre.includes('exam')) {
      pool = SHAYARI_BANK.filter((s) => s.genre === 'engineering');
    } else if (reqGenre.includes('proxy') || reqGenre.includes('attend') || reqGenre.includes('bunk') || reqGenre.includes('safe bunk')) {
      pool = SHAYARI_BANK.filter((s) => s.genre === 'attendance_proxy');
    } else if (reqGenre.includes('dard') || reqGenre.includes('breakup') || reqGenre.includes('sad') || reqGenre.includes('dhokha') || reqGenre.includes('dil toot')) {
      pool = SHAYARI_BANK.filter((s) => s.genre === 'dard_breakup');
    } else if (reqGenre.includes('dost') || reqGenre.includes('yaar') || reqGenre.includes('bhai') || reqGenre.includes('maggi') || reqGenre.includes('backbench')) {
      pool = SHAYARI_BANK.filter((s) => s.genre === 'dosti_yaari');
    } else if (reqGenre.includes('death') || reqGenre.includes('ryuk') || reqGenre.includes('boss') || reqGenre.includes('shinigami') || reqGenre.includes('note')) {
      pool = SHAYARI_BANK.filter((s) => s.genre === 'shinigami_boss');
    }
  }

  // Find items in the pool that haven't been seen recently
  const unseen = pool.filter((s) => !seenIds.includes(s.id));

  let chosen: ShayariItem;
  if (unseen.length > 0) {
    // Pick randomly among unseen to keep it unpredictable yet strictly non-repeating
    const randIdx = Math.floor(Math.random() * unseen.length);
    chosen = unseen[randIdx];
  } else {
    // If all in this pool were seen, pick the least recently seen one
    const sorted = [...pool].sort((a, b) => {
      const idxA = seenIds.indexOf(a.id);
      const idxB = seenIds.indexOf(b.id);
      return (idxA === -1 ? 0 : idxA) - (idxB === -1 ? 0 : idxB);
    });
    chosen = sorted[0] || pool[0];
  }

  // Update seen list
  const nextSeen = [...seenIds.filter((id) => id !== chosen.id), chosen.id];
  saveSeenIds(nextSeen);

  const buddyName = options?.userName || 'Mere Sher';

  // Construct dynamic rich Hinglish response
  const poemBlock = chosen.lines.map((line) => `> *${line}*`).join('\n');
  const formattedText = `🎙️✨ **${chosen.emoji} [${chosen.genreLabel}] — "${chosen.title}"** 🔥\n\n*Irshaad farmaiye ${buddyName}... Dil tham ke suniye:* 🥀\n\n${poemBlock}\n\n💡 **Punchline:** *${chosen.punchline}*\n\n*(Ye shayari collection ka **#${chosen.id} / 113** hai — har baar naya sher milega!)* 😎`;

  // Dynamic next suggestions cycling across genres
  const suggestionsPool = [
    'Crush ke liye ek aur nayi shayari sunao 💖',
    'Ek kadak engineering shayari sunao ⚡',
    'Bhai proxy lagane ka koi ninja hack bata 🤫',
    'Dard bhari breakup shayari sunao 💔',
    'Dosti aur hostel yaari wali shayari sunao 🤝',
    'Boss ikA ki Shinigami Death Note shayari sunao 🍎',
    'Ek aur kadak campus shayari sunao 🔥'
  ].filter((sugg) => {
    // Don't suggest the exact genre we just showed
    if (chosen.genre === 'crush' && sugg.includes('Crush')) return false;
    return true;
  });

  const nextSugg = suggestionsPool[Math.floor(Math.random() * suggestionsPool.length)] || 'Crush ke liye ek aur nayi shayari sunao 💖';

  return {
    shayari: chosen,
    formattedText,
    nextSugg
  };
}
