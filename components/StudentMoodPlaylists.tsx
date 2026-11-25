'use client';

import React, { useMemo, useState } from 'react';

export type SongIndustry = 'Bollywood' | 'Hindi Singles' | 'English Famous';

export type MoodId =
  | 'romantic'
  | 'motivation'
  | 'focus'
  | 'heartbreak'
  | 'party'
  | 'calm'
  | 'beast'
  | 'nostalgia';

export interface PlaylistSong {
  id: string;
  title: string;
  artist: string;
  sourceInfo: string;
  industry: SongIndustry;
  tag?: string;
  featured?: boolean;
  query: string;
}

export interface MoodPlaylist {
  id: MoodId;
  name: string;
  icon: string;
  tagline: string;
  studentScene: string;
  accentGradient: string;
  borderAccent: string;
  badgeClass: string;
  mixQuery: string;
  songs: PlaylistSong[];
}

export const STUDENT_MOOD_PLAYLISTS: MoodPlaylist[] = [
  {
    id: 'romantic',
    name: 'Love & Romantic',
    icon: '❤️',
    tagline: 'Soft dil waale vibes, late evening walks & crush energy',
    studentScene: 'Campus Sunset • Crush Daydream',
    accentGradient: 'from-rose-950/75 via-pink-950/55 to-black/75',
    borderAccent: 'border-rose-400/45 hover:border-rose-300/75',
    badgeClass: 'bg-rose-500/25 text-rose-200 border-rose-400/40',
    mixQuery: 'Ishq Di Baaziyaan Diljit Dosanjh Romantic Bollywood Hindi Love Songs',
    songs: [
      {
        id: 'rom-1',
        title: 'Ishq Di Bajiyaan',
        artist: 'Diljit Dosanjh',
        sourceInfo: 'Soorma • Must-Play Romantic Anthem',
        industry: 'Bollywood',
        tag: '🔥 MUST PLAY',
        featured: true,
        query: 'Ishq Di Baaziyaan Diljit Dosanjh Soorma',
      },
      {
        id: 'rom-2',
        title: 'Tum Se Hi',
        artist: 'Mohit Chauhan',
        sourceInfo: 'Jab We Met',
        industry: 'Bollywood',
        tag: 'Evergreen',
        query: 'Tum Se Hi Mohit Chauhan Jab We Met',
      },
      {
        id: 'rom-3',
        title: 'Apna Bana Le',
        artist: 'Arijit Singh & Sachin-Jigar',
        sourceInfo: 'Bhediya',
        industry: 'Bollywood',
        query: 'Apna Bana Le Arijit Singh Bhediya',
      },
      {
        id: 'rom-4',
        title: 'Kesariya',
        artist: 'Arijit Singh & Pritam',
        sourceInfo: 'Brahmāstra',
        industry: 'Bollywood',
        query: 'Kesariya Arijit Singh Brahmastra',
      },
      {
        id: 'rom-5',
        title: 'Tera Ban Jaunga',
        artist: 'Akhil Sachdeva & Tulsi Kumar',
        sourceInfo: 'Kabir Singh',
        industry: 'Bollywood',
        query: 'Tera Ban Jaunga Akhil Sachdeva Tulsi Kumar',
      },
      {
        id: 'rom-6',
        title: 'Raataan Lambiyan',
        artist: 'Jubin Nautiyal & Asees Kaur',
        sourceInfo: 'Shershaah',
        industry: 'Bollywood',
        query: 'Raataan Lambiyan Jubin Nautiyal Shershaah',
      },
      {
        id: 'rom-7',
        title: 'Ishq',
        artist: 'Faheem Abdullah & Rauhan Malik',
        sourceInfo: 'Viral Indie Single',
        industry: 'Hindi Singles',
        tag: 'Trending',
        query: 'Ishq Faheem Abdullah Rauhan Malik Lost Found',
      },
      {
        id: 'rom-8',
        title: 'Husn',
        artist: 'Anuv Jain',
        sourceInfo: 'Acoustic Indie Single',
        industry: 'Hindi Singles',
        query: 'Husn Anuv Jain Official',
      },
      {
        id: 'rom-9',
        title: 'Heeriye',
        artist: 'Jasleen Royal ft. Arijit Singh',
        sourceInfo: 'Indie Romance Single',
        industry: 'Hindi Singles',
        query: 'Heeriye Jasleen Royal Arijit Singh',
      },
      {
        id: 'rom-10',
        title: 'Maan Meri Jaan',
        artist: 'King',
        sourceInfo: 'Champagne Talk',
        industry: 'Hindi Singles',
        query: 'Maan Meri Jaan King',
      },
      {
        id: 'rom-11',
        title: 'Until I Found You',
        artist: 'Stephen Sanchez',
        sourceInfo: 'Global Classic Love Hit',
        industry: 'English Famous',
        tag: 'Classic',
        query: 'Until I Found You Stephen Sanchez',
      },
      {
        id: 'rom-12',
        title: 'Perfect',
        artist: 'Ed Sheeran',
        sourceInfo: 'Divide Album',
        industry: 'English Famous',
        query: 'Perfect Ed Sheeran',
      },
      {
        id: 'rom-13',
        title: 'Dandelions',
        artist: 'Ruth B.',
        sourceInfo: 'Global Viral Romantic',
        industry: 'English Famous',
        query: 'Dandelions Ruth B',
      },
      {
        id: 'rom-14',
        title: 'Golden Hour',
        artist: 'JVKE',
        sourceInfo: 'Dreamy Piano Romance',
        industry: 'English Famous',
        query: 'Golden Hour JVKE',
      },
    ],
  },
  {
    id: 'motivation',
    name: 'Motivation & Grind',
    icon: '🔥',
    tagline: 'Exam night power-up, placement prep & unstoppable comeback fuel',
    studentScene: 'MT-2 Night • DSA & Coding Sprint',
    accentGradient: 'from-amber-950/75 via-orange-950/55 to-black/75',
    borderAccent: 'border-amber-400/45 hover:border-amber-300/75',
    badgeClass: 'bg-amber-500/25 text-amber-200 border-amber-400/40',
    mixQuery: 'Kar Har Maidaan Fateh Zinda Bhaag Milkha Hall of Fame Believer Study Motivation',
    songs: [
      {
        id: 'mot-1',
        title: 'Kar Har Maidaan Fateh',
        artist: 'Sukhwinder Singh & Shreya Ghoshal',
        sourceInfo: 'Sanju • Pure Goosebumps',
        industry: 'Bollywood',
        tag: 'Anthem',
        query: 'Kar Har Maidaan Fateh Sukhwinder Singh',
      },
      {
        id: 'mot-2',
        title: 'Zinda',
        artist: 'Siddharth Mahadevan',
        sourceInfo: 'Bhaag Milkha Bhaag',
        industry: 'Bollywood',
        query: 'Zinda Bhaag Milkha Bhaag Siddharth Mahadevan',
      },
      {
        id: 'mot-3',
        title: 'Lakshya',
        artist: 'Shankar Mahadevan',
        sourceInfo: 'Lakshya',
        industry: 'Bollywood',
        query: 'Lakshya Title Track Shankar Mahadevan',
      },
      {
        id: 'mot-4',
        title: 'Apna Time Aayega',
        artist: 'Ranveer Singh & DIVINE',
        sourceInfo: 'Gully Boy',
        industry: 'Bollywood',
        query: 'Apna Time Aayega Gully Boy DIVINE',
      },
      {
        id: 'mot-5',
        title: 'Besabriyaan',
        artist: 'Armaan Malik',
        sourceInfo: 'M.S. Dhoni: The Untold Story',
        industry: 'Bollywood',
        query: 'Besabriyaan Armaan Malik MS Dhoni',
      },
      {
        id: 'mot-6',
        title: 'Aarambh Hai Prachand',
        artist: 'Piyush Mishra',
        sourceInfo: 'High-Focus Warrior Energy',
        industry: 'Hindi Singles',
        tag: 'Power',
        query: 'Aarambh Hai Prachand Piyush Mishra',
      },
      {
        id: 'mot-7',
        title: 'Kohinoor',
        artist: 'DIVINE',
        sourceInfo: 'Desi Hip-Hop Comeback',
        industry: 'Hindi Singles',
        query: 'Kohinoor DIVINE',
      },
      {
        id: 'mot-8',
        title: 'Parinda (Unplugged / Search)',
        artist: 'Sukhbir & Bilal',
        sourceInfo: 'Rise Up Single',
        industry: 'Hindi Singles',
        query: 'Zinda Hoon Yaar Kaafi Hai Amit Trivedi',
      },
      {
        id: 'mot-9',
        title: 'Hall of Fame',
        artist: 'The Script ft. will.i.am',
        sourceInfo: 'No. 1 Exam Comeback Hit',
        industry: 'English Famous',
        tag: 'GOAT',
        query: 'Hall of Fame The Script',
      },
      {
        id: 'mot-10',
        title: 'Believer',
        artist: 'Imagine Dragons',
        sourceInfo: 'Evolve',
        industry: 'English Famous',
        query: 'Believer Imagine Dragons',
      },
      {
        id: 'mot-11',
        title: 'Unstoppable',
        artist: 'Sia',
        sourceInfo: 'Confidence Booster',
        industry: 'English Famous',
        query: 'Unstoppable Sia',
      },
      {
        id: 'mot-12',
        title: 'Lose Yourself',
        artist: 'Eminem',
        sourceInfo: 'All-Time Grind Classic',
        industry: 'English Famous',
        query: 'Lose Yourself Eminem',
      },
    ],
  },
  {
    id: 'focus',
    name: 'Deep Focus & Coding',
    icon: '💻',
    tagline: '2 AM assignment completion, LeetCode grind & calm headphones zone',
    studentScene: 'Library • Lab Submission • Zero Distraction',
    accentGradient: 'from-cyan-950/75 via-blue-950/55 to-black/75',
    borderAccent: 'border-cyan-400/45 hover:border-cyan-300/75',
    badgeClass: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40',
    mixQuery: 'Kun Faya Kun Alag Aasmaan Sweater Weather Deep Study Focus Music',
    songs: [
      {
        id: 'foc-1',
        title: 'Kun Faya Kun',
        artist: 'A.R. Rahman, Javed Ali & Mohit Chauhan',
        sourceInfo: 'Rockstar • Soulful Focus',
        industry: 'Bollywood',
        tag: 'Peace',
        query: 'Kun Faya Kun AR Rahman Rockstar',
      },
      {
        id: 'foc-2',
        title: 'Safarnama',
        artist: 'Lucky Ali',
        sourceInfo: 'Tamasha',
        industry: 'Bollywood',
        query: 'Safarnama Lucky Ali Tamasha',
      },
      {
        id: 'foc-3',
        title: 'Ilahi (Reprise)',
        artist: 'Mohit Chauhan',
        sourceInfo: 'Yeh Jawaani Hai Deewani',
        industry: 'Bollywood',
        query: 'Ilahi Reprise Mohit Chauhan',
      },
      {
        id: 'foc-4',
        title: 'Alag Aasmaan',
        artist: 'Anuv Jain',
        sourceInfo: 'Soft Acoustic Study Single',
        industry: 'Hindi Singles',
        tag: 'Lofi Vibe',
        query: 'Alag Aasmaan Anuv Jain',
      },
      {
        id: 'foc-5',
        title: 'Kasoor',
        artist: 'Prateek Kuhad',
        sourceInfo: 'Indie Chill Single',
        industry: 'Hindi Singles',
        query: 'Kasoor Prateek Kuhad',
      },
      {
        id: 'foc-6',
        title: 'Gul',
        artist: 'Anuv Jain',
        sourceInfo: 'Acoustic Minimalist',
        industry: 'Hindi Singles',
        query: 'Gul Anuv Jain',
      },
      {
        id: 'foc-7',
        title: 'Sweater Weather',
        artist: 'The Neighbourhood',
        sourceInfo: 'Late Night Coding Iconic',
        industry: 'English Famous',
        query: 'Sweater Weather The Neighbourhood',
      },
      {
        id: 'foc-8',
        title: 'Sunflower',
        artist: 'Post Malone & Swae Lee',
        sourceInfo: 'Spider-Verse Chill Flow',
        industry: 'English Famous',
        query: 'Sunflower Post Malone Swae Lee',
      },
      {
        id: 'foc-9',
        title: 'Starboy',
        artist: 'The Weeknd ft. Daft Punk',
        sourceInfo: 'Dark Neon Coder Mode',
        industry: 'English Famous',
        tag: 'Cyber',
        query: 'Starboy The Weeknd Daft Punk',
      },
      {
        id: 'foc-10',
        title: 'Experience',
        artist: 'Ludovico Einaudi',
        sourceInfo: 'Pure Piano Study Flow',
        industry: 'English Famous',
        query: 'Experience Ludovico Einaudi',
      },
    ],
  },
  {
    id: 'heartbreak',
    name: 'Heartbreak & Midnight',
    icon: '💔',
    tagline: '2 AM hostel balcony, heavy feelings & soulful lyrics that hit deep',
    studentScene: '2:00 AM Balcony • Rainy Windowpane',
    accentGradient: 'from-purple-950/75 via-indigo-950/60 to-black/80',
    borderAccent: 'border-purple-400/45 hover:border-purple-300/75',
    badgeClass: 'bg-purple-500/25 text-purple-200 border-purple-400/40',
    mixQuery: 'Channa Mereya Agar Tum Saath Ho Jo Tum Mere Ho Glimpse of Us',
    songs: [
      {
        id: 'sad-1',
        title: 'Channa Mereya',
        artist: 'Arijit Singh & Pritam',
        sourceInfo: 'Ae Dil Hai Mushkil',
        industry: 'Bollywood',
        tag: 'Iconic',
        query: 'Channa Mereya Arijit Singh',
      },
      {
        id: 'sad-2',
        title: 'Agar Tum Saath Ho',
        artist: 'Alka Yagnik & Arijit Singh',
        sourceInfo: 'Tamasha',
        industry: 'Bollywood',
        query: 'Agar Tum Saath Ho Tamasha',
      },
      {
        id: 'sad-3',
        title: 'Tujhe Kitna Chahne Lage',
        artist: 'Arijit Singh',
        sourceInfo: 'Kabir Singh',
        industry: 'Bollywood',
        query: 'Tujhe Kitna Chahne Lage Arijit Singh',
      },
      {
        id: 'sad-4',
        title: 'Phir Bhi Tumko Chaahunga',
        artist: 'Arijit Singh & Shashaa Tirupati',
        sourceInfo: 'Half Girlfriend',
        industry: 'Bollywood',
        query: 'Phir Bhi Tumko Chaahunga Arijit Singh',
      },
      {
        id: 'sad-5',
        title: 'Jo Tum Mere Ho',
        artist: 'Anuv Jain',
        sourceInfo: 'Viral Emotional Single',
        industry: 'Hindi Singles',
        tag: 'Viral',
        query: 'Jo Tum Mere Ho Anuv Jain',
      },
      {
        id: 'sad-6',
        title: 'Tu Hai Kahan',
        artist: 'AUR',
        sourceInfo: 'Emotional Indie Single',
        industry: 'Hindi Singles',
        query: 'Tu Hai Kahan AUR',
      },
      {
        id: 'sad-7',
        title: 'Faasle',
        artist: 'Aditya Rikhari',
        sourceInfo: 'Indie Soul Single',
        industry: 'Hindi Singles',
        query: 'Faasle Aditya Rikhari',
      },
      {
        id: 'sad-8',
        title: 'Someone You Loved',
        artist: 'Lewis Capaldi',
        sourceInfo: 'Global Ballad',
        industry: 'English Famous',
        query: 'Someone You Loved Lewis Capaldi',
      },
      {
        id: 'sad-9',
        title: 'Let Her Go',
        artist: 'Passenger',
        sourceInfo: 'Acoustic Classic',
        industry: 'English Famous',
        query: 'Let Her Go Passenger',
      },
      {
        id: 'sad-10',
        title: 'Glimpse of Us',
        artist: 'Joji',
        sourceInfo: 'Midnight Piano Hit',
        industry: 'English Famous',
        query: 'Glimpse of Us Joji',
      },
    ],
  },
  {
    id: 'party',
    name: 'Party & Hostel Hype',
    icon: '🥳',
    tagline: 'Exam over celebration, car speakers full volume & hostel jam!',
    studentScene: 'Exam Over! • Night Out & Squad',
    accentGradient: 'from-fuchsia-950/75 via-violet-950/55 to-black/75',
    borderAccent: 'border-fuchsia-400/45 hover:border-fuchsia-300/75',
    badgeClass: 'bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-400/40',
    mixQuery: 'Badtameez Dil Tauba Tauba Brown Munde Blinding Lights Levitating Party Mix',
    songs: [
      {
        id: 'par-1',
        title: 'Badtameez Dil',
        artist: 'Benny Dayal & Shefali Alvares',
        sourceInfo: 'Yeh Jawaani Hai Deewani',
        industry: 'Bollywood',
        tag: 'Banger',
        query: 'Badtameez Dil Yeh Jawaani Hai Deewani',
      },
      {
        id: 'par-2',
        title: 'Tauba Tauba',
        artist: 'Karan Aujla',
        sourceInfo: 'Bad Newz • Dance Anthem',
        industry: 'Bollywood',
        query: 'Tauba Tauba Karan Aujla',
      },
      {
        id: 'par-3',
        title: 'Ghungroo',
        artist: 'Arijit Singh & Shilpa Rao',
        sourceInfo: 'War',
        industry: 'Bollywood',
        query: 'Ghungroo Song War Arijit Singh',
      },
      {
        id: 'par-4',
        title: 'Kala Chashma',
        artist: 'Amar Arshi, Badshah & Neha Kakkar',
        sourceInfo: 'Baar Baar Dekho',
        industry: 'Bollywood',
        query: 'Kala Chashma Badshah',
      },
      {
        id: 'par-5',
        title: 'Softly',
        artist: 'Karan Aujla & Ikky',
        sourceInfo: 'Making Memories',
        industry: 'Hindi Singles',
        tag: 'Vibe',
        query: 'Softly Karan Aujla Ikky',
      },
      {
        id: 'par-6',
        title: 'Brown Munde',
        artist: 'AP Dhillon, Gurinder Gill & Shinda Kahlon',
        sourceInfo: 'Global Punjabi Single',
        industry: 'Hindi Singles',
        query: 'Brown Munde AP Dhillon',
      },
      {
        id: 'par-7',
        title: 'Excuses',
        artist: 'AP Dhillon & Intense',
        sourceInfo: 'Desi Club Single',
        industry: 'Hindi Singles',
        query: 'Excuses AP Dhillon',
      },
      {
        id: 'par-8',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        sourceInfo: 'After Hours • Global Synth Hit',
        industry: 'English Famous',
        tag: 'No. 1',
        query: 'Blinding Lights The Weeknd',
      },
      {
        id: 'par-9',
        title: 'Levitating',
        artist: 'Dua Lipa',
        sourceInfo: 'Future Nostalgia',
        industry: 'English Famous',
        query: 'Levitating Dua Lipa',
      },
      {
        id: 'par-10',
        title: 'Uptown Funk',
        artist: 'Mark Ronson ft. Bruno Mars',
        sourceInfo: 'Ultimate Party Classic',
        industry: 'English Famous',
        query: 'Uptown Funk Mark Ronson Bruno Mars',
      },
    ],
  },
  {
    id: 'calm',
    name: 'Calm, Sukoon & Chai',
    icon: '🌧️',
    tagline: 'Stress relief after heavy lectures, rainy campus breeze & chai break',
    studentScene: 'Upper Canteen Tea • Evening Breeze',
    accentGradient: 'from-emerald-950/75 via-teal-950/55 to-black/75',
    borderAccent: 'border-emerald-400/45 hover:border-emerald-300/75',
    badgeClass: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40',
    mixQuery: 'Khaabon Ke Parinday Sham Iktara Kho Gaye Hum Kahan Fix You Coldplay',
    songs: [
      {
        id: 'cal-1',
        title: 'Khaabon Ke Parinday',
        artist: 'Mohit Chauhan & Alyssa Mendonsa',
        sourceInfo: 'Zindagi Na Milegi Dobara',
        industry: 'Bollywood',
        tag: 'Sukoon',
        query: 'Khaabon Ke Parinday ZNMD Mohit Chauhan',
      },
      {
        id: 'cal-2',
        title: 'Iktara',
        artist: 'Kavita Seth & Amitabh Bhattacharya',
        sourceInfo: 'Wake Up Sid',
        industry: 'Bollywood',
        query: 'Iktara Wake Up Sid Kavita Seth',
      },
      {
        id: 'cal-3',
        title: 'Sham',
        artist: 'Amit Trivedi & Nikhil D\'Souza',
        sourceInfo: 'Aisha',
        industry: 'Bollywood',
        query: 'Sham Aisha Amit Trivedi Nikhil DSouza',
      },
      {
        id: 'cal-4',
        title: 'Moh Moh Ke Dhaage',
        artist: 'Papon & Monali Thakur',
        sourceInfo: 'Dum Laga Ke Haisha',
        industry: 'Bollywood',
        query: 'Moh Moh Ke Dhaage Papon',
      },
      {
        id: 'cal-5',
        title: 'Kho Gaye Hum Kahan',
        artist: 'Jasleen Royal & Prateek Kuhad',
        sourceInfo: 'Peaceful Breeze',
        industry: 'Hindi Singles',
        query: 'Kho Gaye Hum Kahan Jasleen Royal Prateek Kuhad',
      },
      {
        id: 'cal-6',
        title: 'O Sanam',
        artist: 'Lucky Ali',
        sourceInfo: 'Timeless Indie Gem',
        industry: 'Hindi Singles',
        query: 'O Sanam Lucky Ali',
      },
      {
        id: 'cal-7',
        title: 'cold/mess',
        artist: 'Prateek Kuhad',
        sourceInfo: 'Indie Ballad',
        industry: 'Hindi Singles',
        query: 'cold mess Prateek Kuhad',
      },
      {
        id: 'cal-8',
        title: 'Yellow',
        artist: 'Coldplay',
        sourceInfo: 'Parachutes • Healing Acoustic',
        industry: 'English Famous',
        query: 'Yellow Coldplay',
      },
      {
        id: 'cal-9',
        title: 'Fix You',
        artist: 'Coldplay',
        sourceInfo: 'X&Y',
        industry: 'English Famous',
        query: 'Fix You Coldplay',
      },
      {
        id: 'cal-10',
        title: 'Vienna',
        artist: 'Billy Joel',
        sourceInfo: 'Slow Down Reminder',
        industry: 'English Famous',
        query: 'Vienna Billy Joel',
      },
    ],
  },
  {
    id: 'beast',
    name: 'Gym & Beast Mode',
    icon: '💪',
    tagline: 'Heavy sets, PR days, running track & pure adrenaline rush',
    studentScene: 'Hostel Gym • Evening Workout • PR Day',
    accentGradient: 'from-red-950/75 via-rose-950/55 to-black/80',
    borderAccent: 'border-red-400/50 hover:border-red-300/80',
    badgeClass: 'bg-red-500/25 text-red-200 border-red-400/40',
    mixQuery: 'Brothers Anthem Sultan Winning Speech Karan Aujla Till I Collapse Bones Imagine Dragons',
    songs: [
      {
        id: 'bst-1',
        title: 'Brothers Anthem',
        artist: 'Vishal Dadlani',
        sourceInfo: 'Brothers',
        industry: 'Bollywood',
        tag: 'PR Fuel',
        query: 'Brothers Anthem Vishal Dadlani',
      },
      {
        id: 'bst-2',
        title: 'Sultan Title Track',
        artist: 'Sukhwinder Singh & Shadab Faridi',
        sourceInfo: 'Sultan',
        industry: 'Bollywood',
        query: 'Sultan Title Track Sukhwinder Singh',
      },
      {
        id: 'bst-3',
        title: 'Malhari',
        artist: 'Vishal Dadlani',
        sourceInfo: 'Bajirao Mastani',
        industry: 'Bollywood',
        query: 'Malhari Bajirao Mastani Vishal Dadlani',
      },
      {
        id: 'bst-4',
        title: 'Sher Aaya Sher',
        artist: 'DIVINE',
        sourceInfo: 'Gully Boy',
        industry: 'Bollywood',
        query: 'Sher Aaya Sher DIVINE Gully Boy',
      },
      {
        id: 'bst-5',
        title: 'Winning Speech',
        artist: 'Karan Aujla & Mxrci',
        sourceInfo: 'Punjabi Hype Single',
        industry: 'Hindi Singles',
        tag: 'Heavy',
        query: 'Winning Speech Karan Aujla Mxrci',
      },
      {
        id: 'bst-6',
        title: '3:59 AM',
        artist: 'DIVINE',
        sourceInfo: 'Punya Paap',
        industry: 'Hindi Singles',
        query: '3 59 AM DIVINE',
      },
      {
        id: 'bst-7',
        title: 'Cheques',
        artist: 'Shubh',
        sourceInfo: 'Still Rollin',
        industry: 'Hindi Singles',
        query: 'Cheques Shubh',
      },
      {
        id: 'bst-8',
        title: 'Bones',
        artist: 'Imagine Dragons',
        sourceInfo: 'High Voltage Pop Rock',
        industry: 'English Famous',
        query: 'Bones Imagine Dragons',
      },
      {
        id: 'bst-9',
        title: 'Stronger',
        artist: 'Kanye West',
        sourceInfo: 'Graduation • Classic Workout',
        industry: 'English Famous',
        query: 'Stronger Kanye West',
      },
      {
        id: 'bst-10',
        title: 'Till I Collapse',
        artist: 'Eminem ft. Nate Dogg',
        sourceInfo: 'No. 1 Gym Anthem Worldwide',
        industry: 'English Famous',
        tag: 'Beast',
        query: 'Till I Collapse Eminem Nate Dogg',
      },
    ],
  },
  {
    id: 'nostalgia',
    name: 'Dosti & Campus Memories',
    icon: '🎓',
    tagline: 'Late-night canteen talks, best friends, roadtrips & college yaadein',
    studentScene: 'ABES Campus Yard • Squad Forever',
    accentGradient: 'from-sky-950/75 via-indigo-950/55 to-black/75',
    borderAccent: 'border-sky-400/45 hover:border-sky-300/75',
    badgeClass: 'bg-sky-500/25 text-sky-200 border-sky-400/40',
    mixQuery: 'Tera Yaar Hoon Main Yaaron KK Give Me Some Sunshine See You Again Counting Stars',
    songs: [
      {
        id: 'nos-1',
        title: 'Tera Yaar Hoon Main',
        artist: 'Arijit Singh',
        sourceInfo: 'Sonu Ke Titu Ki Sweety',
        industry: 'Bollywood',
        tag: 'Squad',
        query: 'Tera Yaar Hoon Main Arijit Singh',
      },
      {
        id: 'nos-2',
        title: 'Give Me Some Sunshine',
        artist: 'Suraj Jagan & Sharman Joshi',
        sourceInfo: '3 Idiots • Engineering Classic',
        industry: 'Bollywood',
        tag: 'B.Tech GOAT',
        query: 'Give Me Some Sunshine 3 Idiots',
      },
      {
        id: 'nos-3',
        title: 'Behti Hawa Sa Tha Woh',
        artist: 'Shaan & Shantanu Moitra',
        sourceInfo: '3 Idiots',
        industry: 'Bollywood',
        query: 'Behti Hawa Sa Tha Woh 3 Idiots',
      },
      {
        id: 'nos-4',
        title: 'Sooraj Dooba Hain',
        artist: 'Arijit Singh & Aditi Singh Sharma',
        sourceInfo: 'Roy',
        industry: 'Bollywood',
        query: 'Sooraj Dooba Hain Arijit Singh',
      },
      {
        id: 'nos-5',
        title: 'Yaaron',
        artist: 'KK',
        sourceInfo: 'Pal • Ultimate Friendship Anthem',
        industry: 'Hindi Singles',
        tag: 'Legend',
        query: 'Yaaron Dosti Badi Hi Haseen Hai KK',
      },
      {
        id: 'nos-6',
        title: 'Pal',
        artist: 'KK',
        sourceInfo: 'College Farewell & Memories',
        industry: 'Hindi Singles',
        query: 'Hum Rahen Ya Na Rahen Kal KK',
      },
      {
        id: 'nos-7',
        title: 'Purani Jeans',
        artist: 'Ali Haider',
        sourceInfo: 'Classic Hostel Nostalgia',
        industry: 'Hindi Singles',
        query: 'Purani Jeans Ali Haider',
      },
      {
        id: 'nos-8',
        title: 'Counting Stars',
        artist: 'OneRepublic',
        sourceInfo: 'Native',
        industry: 'English Famous',
        query: 'Counting Stars OneRepublic',
      },
      {
        id: 'nos-9',
        title: 'See You Again',
        artist: 'Wiz Khalifa ft. Charlie Puth',
        sourceInfo: 'Furious 7 Tribute',
        industry: 'English Famous',
        query: 'See You Again Wiz Khalifa Charlie Puth',
      },
      {
        id: 'nos-10',
        title: 'A Sky Full of Stars',
        artist: 'Coldplay',
        sourceInfo: 'Ghost Stories',
        industry: 'English Famous',
        query: 'A Sky Full of Stars Coldplay',
      },
    ],
  },
];

function getSpotifySearchUrl(query: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}

function getYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export default function StudentMoodPlaylists({
  userName,
  onBackToOverview,
}: {
  userName?: string;
  onBackToOverview?: () => void;
}) {
  const [selectedMoodId, setSelectedMoodId] = useState<MoodId>('romantic');
  const [industryFilter, setIndustryFilter] = useState<'ALL' | SongIndustry>('ALL');
  const [defaultPlayer, setDefaultPlayer] = useState<'spotify' | 'youtube'>('spotify');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchAcrossAll, setSearchAcrossAll] = useState<boolean>(false);
  const [pickedSongId, setPickedSongId] = useState<string>('rom-1');

  const activeMood = useMemo(
    () => STUDENT_MOOD_PLAYLISTS.find((m) => m.id === selectedMoodId) || STUDENT_MOOD_PLAYLISTS[0],
    [selectedMoodId]
  );

  const displayedSongs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const pool =
      q && searchAcrossAll
        ? STUDENT_MOOD_PLAYLISTS.flatMap((mood) =>
            mood.songs.map((s) => ({ ...s, moodName: mood.name, moodIcon: mood.icon }))
          )
        : activeMood.songs.map((s) => ({ ...s, moodName: activeMood.name, moodIcon: activeMood.icon }));

    return pool.filter((song) => {
      if (industryFilter !== 'ALL' && song.industry !== industryFilter) return false;
      if (!q) return true;
      return (
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.sourceInfo.toLowerCase().includes(q) ||
        song.industry.toLowerCase().includes(q) ||
        song.moodName.toLowerCase().includes(q)
      );
    });
  }, [activeMood, industryFilter, searchTerm, searchAcrossAll]);

  const openTrack = (song: PlaylistSong, platform: 'spotify' | 'youtube') => {
    setPickedSongId(song.id);
    const targetUrl =
      platform === 'spotify' ? getSpotifySearchUrl(song.query) : getYouTubeSearchUrl(song.query);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSurprisePick = () => {
    if (displayedSongs.length === 0) return;
    const randIndex = Math.floor(Math.random() * displayedSongs.length);
    const chosen = displayedSongs[randIndex];
    openTrack(chosen, defaultPlayer);
  };

  const industryCounts = useMemo(() => {
    const counts: Record<'ALL' | SongIndustry, number> = {
      ALL: activeMood.songs.length,
      Bollywood: 0,
      'Hindi Singles': 0,
      'English Famous': 0,
    };
    activeMood.songs.forEach((s) => {
      counts[s.industry] += 1;
    });
    return counts;
  }, [activeMood]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
      <div className="w-full max-w-5xl space-y-5 animate-in fade-in zoom-in-95 duration-200 pb-12">
        {/* TOP HERO GLOSSY PANEL */}
        <div className="glossy-accent-sheen p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0e1528]/90 via-[#150d24]/88 to-[#070b14]/92 border border-white/20 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-rose-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🎧 Campus Mood Jukebox • Bollywood • Hindi Singles • English Hits</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {userName ? `${userName.split(' ')[0]}'s Mood Song Playlists` : 'Student Mood Song Playlists'} 🎵
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Har mood ke hisaab se handpicked playlist! Kisi bhi gaane par click karo aur turant{' '}
                <strong className="text-emerald-300">Spotify</strong> ya{' '}
                <strong className="text-red-300">YouTube</strong> mein suno — Romantic mein{' '}
                <strong className="text-rose-300">Ishq Di Bajiyaan</strong> featured hai! ❤️
              </p>
            </div>

            {/* DEFAULT ONE-CLICK PLAYER SWITCHER */}
            <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-300">
                Tap Card Action (Default Open):
              </span>
              <div className="inline-flex items-center p-1 rounded-2xl bg-black/60 border border-white/20 shadow-inner">
                <button
                  type="button"
                  onClick={() => setDefaultPlayer('spotify')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    defaultPlayer === 'spotify'
                      ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span>🟢</span> Spotify
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultPlayer('youtube')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    defaultPlayer === 'youtube'
                      ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.55)]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span>▶️</span> YouTube
                </button>
              </div>
            </div>
          </div>

          {/* 8 EMOTION / MOOD SELECTOR GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {STUDENT_MOOD_PLAYLISTS.map((mood) => {
              const isSelected = mood.id === selectedMoodId;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => {
                    setSelectedMoodId(mood.id);
                    setSearchAcrossAll(false);
                  }}
                  className={`glossy-accent-sheen text-left p-3 rounded-2xl border transition cursor-pointer group ${
                    isSelected
                      ? `bg-gradient-to-br ${mood.accentGradient} ${mood.borderAccent} ring-2 ring-white/30 scale-[1.01]`
                      : 'bg-black/55 hover:bg-black/75 border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl group-hover:scale-110 transition-transform">{mood.icon}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border font-bold ${
                        isSelected
                          ? mood.badgeClass
                          : 'bg-white/10 text-gray-200 border-white/15'
                      }`}
                    >
                      {mood.songs.length} tracks
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-white mt-1.5 truncate">{mood.name}</div>
                  <div className="text-[10px] text-gray-300 truncate mt-0.5">{mood.studentScene}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE MOOD SPOTLIGHT BAR & FILTERS */}
        <div
          className={`glossy-accent-sheen p-5 rounded-3xl bg-gradient-to-r ${activeMood.accentGradient} border ${activeMood.borderAccent} space-y-4`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl">{activeMood.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-white">{activeMood.name}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${activeMood.badgeClass}`}>
                  {activeMood.studentScene}
                </span>
              </div>
              <p className="text-xs text-gray-200">{activeMood.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSurprisePick}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-extrabold transition cursor-pointer shadow-lg flex items-center gap-1.5"
              >
                <span>🎲</span> Shuffle &amp; Play
              </button>
              <a
                href={getSpotifySearchUrl(activeMood.mixQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-500/25 hover:bg-emerald-500 text-emerald-100 hover:text-black border border-emerald-400/50 text-xs font-extrabold transition flex items-center gap-1.5"
              >
                <span>🟢</span> Mood Mix Spotify ↗
              </a>
              <a
                href={getYouTubeSearchUrl(activeMood.mixQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-red-600/35 hover:bg-red-600 text-white border border-red-400/50 text-xs font-extrabold transition flex items-center gap-1.5"
              >
                <span>▶️</span> Mood Mix YouTube ↗
              </a>
            </div>
          </div>

          {/* INDUSTRY TABS + SEARCH */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-white/15">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'ALL', label: '🌐 All Mix' },
                  { id: 'Bollywood', label: '🎬 Bollywood' },
                  { id: 'Hindi Singles', label: '🎤 Hindi Singles' },
                  { id: 'English Famous', label: '🌍 English Famous' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setIndustryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    industryFilter === tab.id
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-black/50 text-gray-200 border-white/15 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      industryFilter === tab.id ? 'bg-black/15 text-black' : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {industryCounts[tab.id]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-1 md:max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search song, artist (e.g. Ishq Di Bajiyaan)..."
                className="w-full bg-black/65 border border-white/20 focus:border-white/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-400 outline-none"
              />
              {searchTerm.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchAcrossAll((prev) => !prev)}
                  className={`px-2.5 py-2 rounded-xl border text-[10px] font-bold whitespace-nowrap cursor-pointer transition ${
                    searchAcrossAll
                      ? 'bg-sky-500 text-black border-sky-300'
                      : 'bg-black/60 text-gray-200 border-white/20 hover:bg-white/10'
                  }`}
                  title="Toggle searching across all 8 mood playlists"
                >
                  {searchAcrossAll ? 'All Moods ✓' : 'All Moods'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GLOSSY SONG CARDS GRID */}
        {displayedSongs.length === 0 ? (
          <div className="glossy-tile p-8 rounded-3xl border text-center space-y-2">
            <p className="text-sm font-bold text-white">Koi gaana filter se match nahi hua 🎧</p>
            <p className="text-xs text-gray-300">
              Filter reset karke dekho ya &ldquo;All Moods&rdquo; search on karo!
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setIndustryFilter('ALL');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 cursor-pointer"
            >
              Show All Tracks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayedSongs.map((song, idx) => {
              const isPicked = pickedSongId === song.id;
              const industryBadgeColor =
                song.industry === 'Bollywood'
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/35'
                  : song.industry === 'Hindi Singles'
                  ? 'bg-sky-500/20 text-sky-200 border-sky-400/35'
                  : 'bg-purple-500/20 text-purple-200 border-purple-400/35';

              return (
                <div
                  key={song.id}
                  onClick={() => openTrack(song, defaultPlayer)}
                  className={`glossy-tile p-4 rounded-2xl border flex flex-col justify-between gap-3 cursor-pointer group transition-all duration-200 ${
                    song.featured
                      ? 'border-rose-400/60 ring-1 ring-rose-400/35 shadow-[0_0_28px_rgba(244,63,94,0.22)]'
                      : isPicked
                      ? 'border-emerald-400/60 ring-1 ring-emerald-400/30'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs flex-shrink-0 border ${
                          song.featured
                            ? 'bg-gradient-to-br from-rose-600 to-amber-500 text-white border-rose-300/60 shadow-lg'
                            : 'bg-white/10 text-white border-white/20 group-hover:bg-white/20'
                        }`}
                      >
                        {song.featured ? '❤️' : String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors truncate">
                            {song.title}
                          </h4>
                          {song.tag && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-100 border border-rose-400/45">
                              {song.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-200 truncate">{song.artist}</p>
                        <p className="text-[11px] text-gray-300 truncate mt-0.5">
                          {song.sourceInfo}
                          {searchTerm.trim() && searchAcrossAll ? ` • ${song.moodIcon} ${song.moodName}` : ''}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${industryBadgeColor}`}
                    >
                      {song.industry}
                    </span>
                  </div>

                  {/* DIRECT SPOTIFY & YOUTUBE OPEN BUTTONS */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono text-gray-300">
                      Click card → {defaultPlayer === 'spotify' ? 'Spotify' : 'YouTube'} ↗
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTrack(song, 'spotify');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-200 hover:text-black border border-emerald-400/40 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <span>🟢</span> Spotify
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTrack(song, 'youtube');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-600/25 hover:bg-red-600 text-red-100 hover:text-white border border-red-400/40 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <span>▶️</span> YouTube
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {onBackToOverview && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onBackToOverview}
              className="glossy-tile px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-white hover:text-sky-200 cursor-pointer transition"
            >
              ← Back to Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
