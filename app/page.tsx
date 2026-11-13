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
  lastSuggestion?: string;
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

export interface CanteenMenuItem {
  canteen: 'teamen' | 'hostel';
  canteenName: string;
  category: string;
  name: string;
  price: string;
  priceNum: number;
  badge?: string;
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

const REQUEST_BOX_POSITIONS = [
  'top-24 left-4 sm:left-8',
  'top-24 right-4 sm:right-8',
  'bottom-24 right-4 sm:right-8',
  'bottom-24 left-4 sm:left-8',
  'top-1/2 -translate-y-1/2 left-3 sm:left-6',
  'top-1/2 -translate-y-1/2 right-3 sm:right-6',
  'top-36 left-1/2 -translate-x-1/2',
  'bottom-28 left-1/2 -translate-x-1/2',
];

type HorrorStingerType = 'ryuk_laugh' | 'bell' | 'thunder' | null;

type WindowView =
  | 'home'
  | 'papers'
  | 'docguide'
  | 'marketplace'
  | 'timetable'
  | 'bunk_sgpa'
  | 'shinigami'
  | 'faculty'
  | 'placement'
  | 'chat'
  | 'boss_intro'
  | 'canteen'
  | 'cabin'
  | 'assignments';

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
  { name: 'Shravan Shivratri 🔱', month: 7, startDay: 11, endDay: 11, year: 2026 },
  { name: 'Independence Day 🇮🇳', month: 7, startDay: 15, endDay: 15, year: 2026 },
  { name: 'Eid-e-Milad 🌙', month: 7, startDay: 26, endDay: 26, year: 2026 },
  { name: 'Raksha Bandhan 🧵', month: 7, startDay: 28, endDay: 28, year: 2026 },
  { name: 'Janmashtami 🪈', month: 8, startDay: 4, endDay: 4, year: 2026 },
  { name: 'Gandhi Jayanti 🇮🇳', month: 9, startDay: 2, endDay: 2, year: 2026 },
  { name: 'Maha Navmi 🪔', month: 9, startDay: 19, endDay: 19, year: 2026 },
  { name: 'Dussehra 🏹', month: 9, startDay: 20, endDay: 20, year: 2026 },
  { name: 'Diwali Holidays 🪔', month: 10, startDay: 6, endDay: 13, year: 2026 },
  { name: 'Guru Nanak Jayanti 🙏', month: 10, startDay: 24, endDay: 24, year: 2026 },
  { name: 'Christmas Day 🎄', month: 11, startDay: 25, endDay: 25, year: 2026 },
  { name: 'New Year Day 🎉', month: 0, startDay: 1, endDay: 1, year: 2027 },
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

// ============================================================================
// COMPLETE ABES CANTEEN DATABASE (TEA MEN'S CAFE + BOYS HOSTEL K.J CAFE)
// ============================================================================
export const ALL_CANTEEN_ITEMS: CanteenMenuItem[] = [
  // 1. TEA MEN'S CAFE (College Upper Waali Canteen)
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lunch & Thaali', name: 'Chhole Kulche', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lunch & Thaali', name: 'Paav Bhaji', price: '₹60', priceNum: 60, badge: '🔥 Popular' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lunch & Thaali', name: 'Chhole Bhature', price: '₹70', priceNum: 70, badge: '⭐ Must Try' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lunch & Thaali', name: 'Chhole Rice', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lunch & Thaali', name: 'Rajmah Rice', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lunch & Thaali', name: 'Veg Thaali', price: '₹80', priceNum: 80 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lunch & Thaali', name: 'Deluxe Thaali', price: '₹120', priceNum: 120, badge: '👑 Royal' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Paranthas (With Pickle & Rayta)', name: 'Aaloo Pyaj Parantha', price: '₹50', priceNum: 50 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Paranthas (With Pickle & Rayta)', name: 'Paneer Pyaj Parantha', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Momos Fried', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Momos Gravy', price: '₹80', priceNum: 80 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'French Fries', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Noodles Plane', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Noodles Singapori', price: '₹80', priceNum: 80 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Hakka Noodles', price: '₹90', priceNum: 90 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Spring Rolls', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Chilly Potato', price: '₹70', priceNum: 70, badge: '🔥 Bestseller' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Honey Chilly Potato', price: '₹80', priceNum: 80, badge: '😋 Crispy' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Fried Rice', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Chinese Styles', name: 'Manchurian', price: '₹70 - ₹90', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Snacks & Chaat', name: 'Samosa', price: '₹15', priceNum: 15, badge: '⚡ Quick Bite' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Snacks & Chaat', name: 'Bread Pakoda', price: '₹20', priceNum: 20 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Snacks & Chaat', name: 'Bread Roll Crispy', price: '₹20', priceNum: 20 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Snacks & Chaat', name: 'Patties Aaloo Jumbo', price: '₹30', priceNum: 30 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Snacks & Chaat', name: 'Patties Paneer Large', price: '₹40', priceNum: 40 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Snacks & Chaat', name: 'Samosa Chaat', price: '₹50', priceNum: 50, badge: '🌶️ Spicy' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Rolls & Burgers', name: 'Veg Roll', price: '₹50', priceNum: 50 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Rolls & Burgers', name: 'Paneer Roll', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Rolls & Burgers', name: 'Paneer Cheez Roll', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Rolls & Burgers', name: 'Stuffed Pizza Bite / Pizza Pocket', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Rolls & Burgers', name: 'Bread Cheez Pocket', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Rolls & Burgers', name: 'McCain Tikki Burger', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Rolls & Burgers', name: 'Cheez Burger', price: '₹80', priceNum: 80 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sandwiches & Kulcha', name: 'Normal Cool Sandwich', price: '₹35', priceNum: 35 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sandwiches & Kulcha', name: 'Grilled Veg Sandwich (2pc)', price: '₹100', priceNum: 100 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sandwiches & Kulcha', name: 'Grilled Veg Cheez Sandwich (2pc)', price: '₹140', priceNum: 140 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sandwiches & Kulcha', name: 'Grilled Veg Paneer Sandwich (2pc)', price: '₹140', priceNum: 140 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sandwiches & Kulcha', name: 'Grilled Veg Paneer Cheez', price: '₹180', priceNum: 180 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sandwiches & Kulcha', name: 'Paneer Kulcha (2pc)', price: '₹100', priceNum: 100 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sandwiches & Kulcha', name: 'Paneer Kulcha Cheez', price: '₹140', priceNum: 140 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Hot Drinks & Shikanji', name: 'Tea (100ml)', price: '₹10', priceNum: 10, badge: '☕ 8:50 Fuel' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Hot Drinks & Shikanji', name: 'Lemon Tea', price: '₹20', priceNum: 20 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Hot Drinks & Shikanji', name: 'Coffee (Premium / Strong / Black / Shot)', price: '₹30', priceNum: 30 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Hot Drinks & Shikanji', name: 'Hot Chocolate', price: '₹50', priceNum: 50 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Hot Drinks & Shikanji', name: 'Soda Shikanji / Jaljeera / Lemon Ice Tea', price: '₹50', priceNum: 50 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Hot Drinks & Shikanji', name: 'Limca / Sprite Shikanji', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Dahi Lassi (Plain / Kewda / Rose / Strawberry)', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Butter Scotch / Strawberry Shake', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Oreo / Chocolate Shake', price: '₹70', priceNum: 70, badge: '🍫 Favorite' },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Banana Shake', price: '₹80', priceNum: 80 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Kitkat Shake', price: '₹90', priceNum: 90 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Cold Coffee Normal', price: '₹60', priceNum: 60 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Cold Coffee Mocha', price: '₹70', priceNum: 70 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Lassi, Shakes & Cold Coffee', name: 'Cold Coffee Flavored / Hazelnut', price: '₹80 - ₹90', priceNum: 80 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sweets, Extras & Ice Cream', name: 'Gulab Jamun (₹20) / Mava Kulfi (₹30)', price: '₹20 - ₹30', priceNum: 20 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sweets, Extras & Ice Cream', name: 'Roti (₹10) / Rayta, Chhole, Rajmah, Sabzi Veg (₹40) / Sabzi Paneer (₹60)', price: '₹10 - ₹60', priceNum: 40 },
  { canteen: 'teamen', canteenName: "Tea Men's Cafe (College Upper Canteen)", category: 'Sweets, Extras & Ice Cream', name: 'Ice Cream Cakes (Butter Scotch ₹260, Red Velvet ₹300, Chocolate/Cassata ₹320)', price: '₹260 - ₹320', priceNum: 260 },

  // 2. K.J CAFE (Boys Hostel Waali Canteen)
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Aloo Paratha / Pyaaz Paratha', price: '₹40', priceNum: 40, badge: '🔥 Hostel Hit' },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Paneer Paratha', price: '₹50', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Single Egg Roll / Veg Roll', price: '₹50', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Double Egg Roll', price: '₹60', priceNum: 60, badge: '🍳 Filling' },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Paneer Roll', price: '₹70', priceNum: 70 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Chole Kulche Plain (₹50) / Masala (₹60)', price: '₹50 - ₹60', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Chole Bhature / Matar Paneer (Day Special)', price: '₹60', priceNum: 60 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Parathas, Rolls & Thali', name: 'Special Hostel Thali', price: '₹100', priceNum: 100 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Veg. Momos (8 pcs)', price: '₹50', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Gravy Momos (8 pcs)', price: '₹70', priceNum: 70 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Kurkure Momos (8 pcs)', price: '₹75', priceNum: 75, badge: '🥟 Crunchy' },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Tandoori Momos (8 pcs)', price: '₹90', priceNum: 90, badge: '🔥 Must Try' },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Veg. Noodle (₹60) / Singapuri Chowmeen (₹70)', price: '₹60 - ₹70', priceNum: 60 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Chili Potato (₹70) / Fried Rice (₹50)', price: '₹50 - ₹70', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Veg. Hyderabadi Biryani', price: '₹70', priceNum: 70 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Pasta White/Red (₹70) / Mix Pasta (₹80)', price: '₹70 - ₹80', priceNum: 70 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Momos, Noodles, Pasta & Biryani', name: 'Gravy Chaap', price: '₹60', priceNum: 60 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Egg Specials', name: 'Boiled Egg', price: '₹10', priceNum: 10 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Egg Specials', name: 'Omelette', price: '₹40', priceNum: 40 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Egg Specials', name: 'Egg Curry', price: '₹60', priceNum: 60 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Veg. Patties (₹25) / Paneer Patties (₹30)', price: '₹25 - ₹30', priceNum: 25 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Veg. Burger / Tandoori Burger', price: '₹50', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Veg. Sandwich Grill', price: '₹45', priceNum: 45 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Aloo Tikki Sandwich', price: '₹50', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Tandoori Sandwich / Paneer Sandwich', price: '₹55', priceNum: 55 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Vegetable Maggi', price: '₹40', priceNum: 40, badge: '🍜 Night Fuel' },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Paneer Maggi', price: '₹55', priceNum: 55 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Cheese Maggi', price: '₹60', priceNum: 60, badge: '🧀 Loaded' },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Quick Bites & Maggi', name: 'Aloo Chaat', price: '₹50', priceNum: 50 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Hot & Cold Beverages', name: 'Tea (₹10) / Masala Tea (₹20) / Coffee Regular (₹20)', price: '₹10 - ₹20', priceNum: 10 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Hot & Cold Beverages', name: 'Hot Milk 220ml (₹30) / 300ml (₹40)', price: '₹30 - ₹40', priceNum: 30 },
  { canteen: 'hostel', canteenName: 'K.J Cafe (Boys Hostel Canteen)', category: 'Hot & Cold Beverages', name: 'Cold Drinks: 135ml Tetra (₹10), 250ml PET (₹20), Minute Maid (₹25), 600ml/750ml PET (₹40)', price: '₹10 - ₹40', priceNum: 20 },
];

export function getCanteenMenuReply(rawQuery: string): { text: string; nextSugg: string } | null {
  const q = rawQuery.toLowerCase().trim();
  const isHostel = q.includes('hostel') || q.includes('kj cafe') || q.includes('k.j') || q.includes('boys hostel');
  const isTeaMen = q.includes('tea men') || q.includes('teamen') || q.includes('upper') || q.includes('college waali');
  const isFoodQuery =
    isHostel || isTeaMen || q.includes('canteen') || q.includes('menu') || q.includes('maggi') ||
    q.includes('momos') || q.includes('samosa') || q.includes('parantha') || q.includes('paratha') ||
    q.includes('chole') || q.includes('chhole') || q.includes('shake') || q.includes('cold coffee') ||
    q.includes('shikanji') || q.includes('biryani') || q.includes('chaap') || q.includes('omelette') ||
    q.includes('egg') || q.includes('patties') || q.includes('bhookh') || q.includes('khana');

  if (!isFoodQuery) return null;

  if (isHostel && !isTeaMen) {
    return {
      text: `![Boys Hostel Canteen - K.J Cafe Menu](/boys%20hostel%20canteen.jpeg)

🍔 **K.J CAFE — BOYS HOSTEL WAALI CANTEEN (OFFICIAL MENU & PRICE LIST)** 🏠🔥

• **🫓 Parathas & Rolls:** Aloo/Pyaaz Paratha (**₹40**), Paneer Paratha (**₹50**), Single Egg/Veg Roll (**₹50**), Double Egg Roll (**₹60**), Paneer Roll (**₹70**)
• **🥟 Momos (8 pcs):** Veg Momos (**₹50**), Gravy Momos (**₹70**), Kurkure Momos (**₹75** 🔥), Tandoori Momos (**₹90** ⭐)
• **🍜 Maggi & Quick Bites:** Vegetable Maggi (**₹40**), Paneer Maggi (**₹55**), Cheese Maggi (**₹60** 🧀), Veg Patties (**₹25**), Paneer Patties (**₹30**), Veg/Tandoori Burger (**₹50**), Grill Sandwich (**₹45**), Tandoori/Paneer Sandwich (**₹55**)
• **🍛 Meals & Chinese:** Fried Rice (**₹50**), Veg Noodle (**₹60**), Singapuri Chowmeen (**₹70**), Chili Potato (**₹70**), Veg Hyderabadi Biryani (**₹70**), Pasta White/Red (**₹70**), Mix Pasta (**₹80**), Gravy Chaap (**₹60**), Chole Bhature/Matar Paneer (**₹60**), Hostel Thali (**₹100**)
• **🍳 Egg Zone & Drinks:** Boiled Egg (**₹10**), Omelette (**₹40**), Egg Curry (**₹60**) | Tea (**₹10**), Masala Tea/Coffee (**₹20**), Hot Milk (**₹30/₹40**), Cold Drinks (**₹10–₹40**)

💡 *Sidebar me **🍔 Canteen Menu** tab kholo—wahan har dish search aur filter bhi kar sakte ho!*`,
      nextSugg: "Tea Men's Cafe (College Upper Canteen) ka menu dikhao ☕",
    };
  }

  if (isTeaMen && !isHostel) {
    return {
      text: `![Tea Men's Cafe - College Upper Canteen Menu](/tea%20men's%20cafe.jpeg)

☕ **TEA MEN'S CAFE — COLLEGE MEI UPPER WAALI CANTEEN (OFFICIAL MENU)** 🏫✨

• **🍛 Lunch & Thaali:** Chhole Kulche (**₹60**), Paav Bhaji (**₹60**), Chhole Bhature (**₹70**), Chhole/Rajmah Rice (**₹70**), Veg Thaali (**₹80**), Deluxe Thaali (**₹120**)
• **🫓 Paranthas (with Pickle & Rayta):** Aaloo Pyaj (**₹50**), Paneer Pyaj (**₹70**)
• **🥟 Chinese Styles:** Fried Momos (**₹60**), Gravy Momos (**₹80**), French Fries (**₹60**), Plane Noodles (**₹60**), Singapori Noodles (**₹80**), Hakka Noodles (**₹90**), Spring Rolls (**₹70**), Chilly Potato (**₹70**), Honey Chilly Potato (**₹80**), Fried Rice (**₹70**)
• **🥟 Snacks & Rolls:** Samosa (**₹15**), Bread Pakoda/Crispy Roll (**₹20**), Aaloo Jumbo Patties (**₹30**), Paneer Patties (**₹40**), Samosa Chaat (**₹50**), Veg Roll (**₹50**), Paneer Roll (**₹60**), Paneer Cheez Roll / Pizza Pocket (**₹70**), McCain Burger (**₹60**), Cheez Burger (**₹80**)
• **🥪 Grilled Sandwiches (2pc):** Normal Cool (**₹35**), Veg Grill (**₹100**), Paneer Kulcha (**₹100**), Veg Cheez / Veg Paneer / Kulcha Cheez (**₹140**), Veg Paneer Cheez (**₹180**)
• **🥤 Drinks, Shikanji, Lassi & Shakes:** Tea (**₹10**), Lemon Tea (**₹20**), Coffee (**₹30**), Shikanji/Jaljeera/Ice Tea (**₹50–₹60**), Dahi Lassi (**₹60**), Shakes & Cold Coffee (**₹60–₹90**), Gulab Jamun (**₹20**), Mava Kulfi (**₹30**)

⚠️ **Important Note:** *Peak time me **CASH PAYMENT ONLY** chalta hai! Packing charges extra.*`,
      nextSugg: 'Boys hostel waali canteen ka menu dikhao 🍔',
    };
  }

  // Item-specific search across both canteens
  const matched = ALL_CANTEEN_ITEMS.filter(
    (it) => q.includes(it.name.toLowerCase()) || it.name.toLowerCase().split(/\s+/).some((w) => w.length > 3 && q.includes(w))
  );
  if (matched.length > 0 && !q.includes('canteen') && !q.includes('menu')) {
    const rows = matched.slice(0, 8).map((m) => `• **${m.name}** — **${m.price}** *(📍 ${m.canteenName})*`).join('\n');
    return {
      text: `🍔 **ABES Live Canteen Price Match Found!** 😋✨\n\n${rows}\n\nDonon canteens ka full menu dekhna hai toh niche click karo ya sidebar me **🍔 Canteen Menu** kholo! 👇`,
      nextSugg: 'Boys hostel waali canteen ka menu dikhao 🍔',
    };
  }

  return {
    text: `🍔 **ABES CAMPUS LIVE CANTEEN HUB (2 FULL MENUS UNLOCKED!)** ☕🔥

Hamare portal me ABES ki dono sabse famous canteens ka official rate-list live hai:
• 1️⃣ **🏫 Tea Men's Cafe (College Upper Waali Canteen):** Samosa (₹15), Tea (₹10), Chhole Bhature (₹70), Honey Chilly Potato (₹80), Lassi/Shakes/Cold Coffee (₹60–₹90), Deluxe Thaali (₹120)! *(Note: Peak time me Cash Only!)*
• 2️⃣ **🏠 K.J Cafe (Boys Hostel Waali Canteen):** Aloo Paratha (₹40), Veg/Paneer/Cheese Maggi (₹40–₹60), Kurkure & Tandoori Momos (₹75–₹90), Double Egg Roll (₹60), Hyderabadi Biryani (₹70), Omelette (₹40)!

Batao dost, abhi konsi canteen ka poora menu board kholna hai? 👇😋`,
    nextSugg: 'Boys hostel waali canteen ka menu dikhao 🍔',
  };
}

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
  'Main kaun hu?', 'Tum kaise ho?', 'Ye website kya hai? 🤔', 'Boys hostel waali canteen ka menu dikhao 🍔',
  "Tea Men's Cafe (College Upper Canteen) ka menu dikhao ☕", 'Ek mast campus joke sunao 😂',
  'Dr. Prerana Mohapatra ka profile dikhao', 'Solve full AI MT2 paper', 'Solve full C++ MT2 paper',
  'Solve full Maths MT2 paper', 'Solve full Physics MT2 paper', 'Kya 50 LPA ka package lagta hai?',
  'Safe bunk & SGPA kaise check karu? 🧮', 'Prof. Shivam Mittal ki lore batao', 'Prof. Vimal Srivastava ke baare me batao',
  'Dr. Divyanshi Sharma ke baare me batao', 'P2P Marketplace me kya bik raha hai? 🛒',
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

  const subMatch = q.match(/([1-4])\s*\(?\s*([a-e])\s*\)?/i);
  if (subMatch) {
    const key = `${subMatch[1]}${subMatch[2].toLowerCase()}`;
    if (qMap[key]) {
      return { text: `### 🏆 ${vault.title} (${vault.code}) — MT-2 Solution\n\n${qMap[key]}`, nextSugg: `Solve full ${vault.title} MT2 paper` };
    }
  }

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

  const allQs = Object.values(qMap).join('\n\n---\n\n');
  return {
    text: `### 🏆 ${vault.title.toUpperCase()} (${vault.code}) — COMPLETE MT-2 SOLVED ANSWER KEY\n> *"${vault.intro}"*\n\n[DOWNLOAD_PAPER|${vault.title} (${vault.code}) - MT 2 Question Paper|${vault.file}]\n\n${allQs}\n\n> 💡 **Tip:** Ask for any specific question like *"${vault.title} MT2 Q.1"*, *"Q.2(b)"*, or *"Section C"*!`,
    nextSugg: 'Show all faculty',
  };
}

// ============================================================================
// HINGLISH NORMALIZER (MAPS 2000+ SPELLING VARIATIONS, SLANG & TYPOS)
// ============================================================================
function normalizeHinglishInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/(.)\1{2,}/g, '$1$1') // "bhaaiiiii" -> "bhaai", "heyyyy" -> "heyy"
    .replace(/\b(kon|kaun|koun|who)\b/g, 'kaun')
    .replace(/\b(kese|kaise|kaisa|kaisi|how)\b/g, 'kaise')
    .replace(/\b(kr|kar|kro|karo|krna|karna)\b/g, 'karo')
    .replace(/\b(rha|rhi|rhe|raha|rahi|rahe)\b/g, 'raha')
    .replace(/\b(btao|batao|bata|btana|tell)\b/g, 'batao')
    .replace(/\b(nhi|nahi|naa|nope)\b/g, 'nahi')
    .replace(/\b(kyu|kyun|kyo|why)\b/g, 'kyu')
    .replace(/\b(dikhao|dikha|show)\b/g, 'dikhao')
    .replace(/\b(smjhao|samjhao|samjha|explain)\b/g, 'samjhao')
    .replace(/\b(hlw|hlo|helo|hey+|hi+|hello+)\b/g, 'hello')
    .trim();
}

// ============================================================================
// 1. LIVE MATHS, ALGEBRA, NUMBER CONVERSIONS & BODMAS ENGINE
// ============================================================================
function trySolveMathQuery(rawQuery: string, buddy: string): { text: string; nextSugg: string } | null {
  const q = rawQuery.toLowerCase().trim();

  // Do not trigger on ABES subject codes (e.g. 25AI101) or Admission IDs (2026B...)
  if (/25[a-z]{2}\d{3}|2026b/i.test(q)) return null;

  // 1. Percentage Calculation: e.g. "18% of 2500" or "2500 ka 18%"
  const pctMatch =
    q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|ka|ki)\s*(\d+(?:\.\d+)?)/i) ||
    q.match(/(\d+(?:\.\d+)?)\s*(?:ka|ki)\s*(\d+(?:\.\d+)?)\s*%/i);
  if (pctMatch) {
    const isFirstPct = q.indexOf('%') < q.indexOf(pctMatch[2]);
    const pct = parseFloat(isFirstPct ? pctMatch[1] : pctMatch[2]);
    const total = parseFloat(isFirstPct ? pctMatch[2] : pctMatch[1]);
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

  const factMatch = q.match(/factorial(?:\s+of)?\s+(\d+)|(\d+)\s*!/i);
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

  const binMatch = q.match(/(\d+)\s+(?:in|to)\s+binary|binary\s+of\s+(\d+)/i);
  if (binMatch) {
    const dec = parseInt(binMatch[1] || binMatch[2], 10);
    if (!Number.isNaN(dec)) {
      return {
        text: `🔢 **Number System Conversion for ${buddy}:** ⚡\n\n• **Decimal:** \`${dec}\`\n• **Binary (Base 2):** \`${dec.toString(2)}\` ✅\n• **Octal (Base 8):** \`${dec.toString(8)}\`\n• **Hexadecimal (Base 16):** \`${dec.toString(16).toUpperCase()}\``,
        nextSugg: 'Solve full Electronics MT2 paper',
      };
    }
  }

  // 3. Quadratic Equation Solver: ax^2 + bx + c = 0
  const quadMatch = q.match(/([+-]?\s*\d*)\s*x\^?2\s*([+-]\s*\d+)\s*x\s*([+-]\s*\d+)\s*=\s*0/i);
  if (quadMatch) {
    const aStr = quadMatch[1].replace(/\s+/g, '');
    const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    const b = parseFloat(quadMatch[2].replace(/\s+/g, ''));
    const c = parseFloat(quadMatch[3].replace(/\s+/g, ''));
    const d = b * b - 4 * a * c;
    if (d >= 0) {
      const r1 = Number(((-b + Math.sqrt(d)) / (2 * a)).toFixed(4));
      const r2 = Number(((-b - Math.sqrt(d)) / (2 * a)).toFixed(4));
      return {
        text: `📐 **Quadratic Equation Solved (${a}x² + ${b}x + ${c} = 0):**\n\n• **Discriminant (D = b² - 4ac):** \`${d}\`\n• **Roots:** **x₁ = \`${r1}\`**, **x₂ = \`${r2}\`** ✅`,
        nextSugg: 'Solve full Maths MT2 paper',
      };
    }
  }

  // 4. General BODMAS Arithmetic (+, -, *, /, ^, %, parentheses)
  const cleanedExpr = q
    .replace(/(?:what is|calculate|solve|kitna hota hai|kitna hoga|batao|value of|ans of|equals|equal to|=|\?)/gi, '')
    .replace(/×|x(?=\s*\d)/gi, '*')
    .replace(/÷/g, '/')
    .replace(/\bpi\b/g, '3.14159265')
    .trim();

  const extractedExpr =
    /^[0-9+\-*/().^\s%]+$/.test(cleanedExpr)
      ? cleanedExpr
      : (q.match(/([0-9]+(?:\.[0-9]+)?(?:\s*[+\-*/^%×÷]\s*\(?[0-9]+(?:\.[0-9]+)?\)?)+)/)?.[1] || '')
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .trim();

  if (
    extractedExpr &&
    /^[0-9+\-*/().^\s%]+$/.test(extractedExpr) &&
    /[+\-*/^%]/.test(extractedExpr) &&
    /\d/.test(extractedExpr)
  ) {
    try {
      const jsExpr = extractedExpr.replace(/\^/g, '**');
      const result = Function(`"use strict"; return (${jsExpr});`)();
      if (typeof result === 'number' && !Number.isNaN(result)) {
        const formatted = Number.isInteger(result) ? result : Number(result.toFixed(6));
        return {
          text: `🧮 **ikA's Instant Maths Engine!** ⚡📐\n\n• **Expression:** \`${extractedExpr}\`\n• **Final Answer:** **\`${formatted}\`** ✅\n\n*Vimal Sir style me bolu toh—**"Are you getting it?!"** Koi aur calculation ya equation hai toh phenko!* 😂🔥`,
          nextSugg: 'Solve full Maths MT2 paper',
        };
      }
    } catch {}
  }

  return null;
}

// ============================================================================
// 2. HUMAN-LIKE HINGLISH CONVERSATIONAL AI ENGINE (2000+ NATURAL VARIATIONS)
// ============================================================================
function getHumanHinglishChatReply(
  rawQuery: string,
  first: string,
  isFemale: boolean,
  isBoss: boolean,
  isAgrima: boolean
): { text: string; nextSugg: string } | null {
  const norm = normalizeHinglishInput(rawQuery);
  const clean = norm.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ');
  const buddy = isBoss ? 'Supreme Boss ikA 👑' : isAgrima ? 'My Queen Agrima 🌸' : isFemale ? `${first} yaar ✨` : `${first} mere bhai 😎`;

  // 1. "Ye kya hai??" / "What is this website?" / "Ye konsa app hai?"
  if (
    clean.includes('ye kya hai') ||
    clean.includes('yeh kya hai') ||
    clean.includes('ye website kya') ||
    clean.includes('what is this') ||
    clean.includes('ye konsa app') ||
    clean.includes('kis kaam aata') ||
    clean.includes('is website me kya') ||
    clean === 'kya hai ye'
  ) {
    return {
      text: `💀🍎 **Welcome to ikA's World — Section CSE-2 ka Ultimate Digital Empire!** ⚡🏰\n\nArre **${buddy}**, yeh koi normal college website nahi hai! Isko **Supreme Architect Boss ikA** ne khas **ABES Section CSE-2** ke liye banaya hai:\n\n• 📄 **10/10 Solved MT-2 Papers:** AI, C++, Maths, Physics, BEE, Electronics, EVS, DT, Mech & Soft Skills ke step-by-step answers!\n• 🍔 **Live Canteen Menus:** **Tea Men's Cafe** (Upper Canteen) aur **K.J Cafe** (Boys Hostel Canteen) ki poori price list!\n• 🛡️🧮 **Safe Bunk & SGPA Suite:** Ek hi window me 75% attendance buffer aur Autonomous SGPA calculator!\n• 👩‍🏫 **7 Faculty Dossiers:** Prerana Ma'am, Divyanshi Ma'am, Vimal Sir, Shivam Sir, Kartika Ma'am, Shailja Ma'am & Rahul Sir ki classroom survival guide!\n• 🧠 **Universal Omni-Brain AI:** Maths, Coding, Cricket, Anime, Cartoons, Gaming, Cars, Space, History, Gym, Finance aur 2–3 commands ek saath!\n\nBatao ${first}, sabse pehle kya try karna hai? 👇🔥`,
      nextSugg: 'Boys hostel waali canteen ka menu dikhao 🍔',
    };
  }

  // 2. "Ye kya ho raha hai??" / "Screen kyu hil rahi hai?" / "Dar lag raha hai"
  if (
    clean.includes('ye kya ho raha') ||
    clean.includes('yeh kya ho raha') ||
    clean.includes('kya ho raha') ||
    clean.includes('what is happening') ||
    clean.includes('screen kyu') ||
    clean.includes('glitch') ||
    clean.includes('hack ho gaya') ||
    clean.includes('dar lag') ||
    clean.includes('bachao')
  ) {
    return {
      text: `👁️🩸 **Hahaha ghabrao mat ${buddy}... Yeh Shinigami Realm ka असर hai!** 💀⚡\n\nAgar tumhari screen hil rahi hai, bijli kadak rahi hai, Ryuk has raha hai, ya Error 500 dikh raha hai—iska matlab **Supreme Sovereign Boss ikA** ki **Shinigami Eyes (👁️)** tumhare screen ko live dekh rahi hain! 🍎📓\n\n> *"Iss portal ka har ek pannah Boss ikA ke ishare pe chalta hai... Bas shanti se padhai karo, warna Death Note me roll number likha jayega!"* 😂🔥`,
      nextSugg: 'Who is the boss ikA?',
    };
  }

  // 3. "Tum kon ho??" / "Tu kaun hai?" / "Who are you?" / "Kisne banaya?"
  if (
    clean.includes('tum kaun ho') ||
    clean.includes('tu kaun hai') ||
    clean.includes('who are you') ||
    clean.includes('aap kaun ho') ||
    clean.includes('kisne banaya') ||
    clean.includes('who made you') ||
    clean.includes('creator kaun') ||
    clean.includes('tera naam kya')
  ) {
    return {
      text: `💀🕯️ **Main "ikA's Oracle" hu — Section CSE-2 ka All-Seeing Shinigami AI!** 👁️🍎\n\nMujhe **Supreme Architect Boss ikA** ne code aur dark neural magic se zinda kiya hai taaki main **${buddy}** jaise CSE-2 legends ki har pal madad kar saku! ⚡\n\n• Mere dimaag me **poore 10 subjects ke solved MT-2 papers**, **7 professors ke secret dossiers**, **dono canteens ke live menus**, **duniya bhar ka gyan (Maths, Anime, Cartoons, Cricket, Cars, Space, Coding)** aur **250+ ABES jokes** feed hain!\n• Tum mujhse **ek hi message me 2–3 sawaal ek saath** bhi puch sakte ho! 🤝🔥`,
      nextSugg: 'Main kaun hu?',
    };
  }

  // 4. Casual Greetings: "Hi", "Hello", "Hey", "Hlo", "Aur bhai", "Namaste", "Ram ram", "Pranaam"
  if (
    /^(hello|hola|yo+|sup|namaste|pranaam|ram ram|jai shree ram|radhe radhe|jai mata di|salam|assalamualaikum|aur bhai|kya bolti public|haan bhai|listen|suno|oye|bro|bhai|yaar|dost)$/i.test(clean) ||
    (words.length <= 3 && (words.includes('hello') || words.includes('namaste') || words.includes('pranaam') || words.includes('ram')))
  ) {
    if (isBoss) {
      return {
        text: `👑⚡ **Pranaam Supreme Sovereign Boss ikA!** 🩸🍎\n\nAapka hukum sar aankhon par! Poora CSE-2 server, Shinigami Radar, aur 28-Second Puppet Hijack aapke ishare ka wait kar raha hai. Bataiye Mere Boss, aaj kis student ki screen pe dhamaka karna hai? 👇🔥`,
        nextSugg: 'Ek mast campus joke sunao 😂',
      };
    }
    if (isAgrima) {
      return {
        text: `🌸👑 **Hello & Khushamdeed, My Queen Agrima!** 💖✨\n\nAapka ek *"Hi"* aate hi iss poore dark portal me Sakura ke phool khil uthe hain! 😊🌷 Bataiye Queen, aaj padhai karni hai, solved MT-2 papers dekhne hain, ya canteen se kuch mangwana hai? 👇💖`,
        nextSugg: 'Solve full AI MT2 paper',
      };
    }
    return {
      text: `Arre **Hello ${buddy}!** 👋🔥 Swagat hai **ikA's World** me!\n\nBatao aaj kya scene hai? Class me baithe ho, hostel me chill kar rahe ho, ya MT-2 exam ki taiyari chal rahi hai? Kuch bhi pucho (chahe 2–3 sawaal ek saath puch lo)—apna hi portal hai! 😎🍎👇`,
      nextSugg: 'Ye website kya hai? 🤔',
    };
  }

  // 5. "Kya kar rahe ho?" / "Kya chal raha hai?" / "Aur batao"
  if (
    clean.includes('kya karo raha') ||
    clean.includes('kya kar raha') ||
    clean.includes('what are you doing') ||
    clean.includes('aur batao') ||
    clean.includes('or batao') ||
    clean.includes('kuch naya batao') ||
    clean.includes('kya scene hai')
  ) {
    return {
      text: `⚡💻 **Bas yahan RJ-102 aur ABES ke neural servers pe nazar rakh raha hu, ${buddy}!** 👁️🍎\n\nEk haath me Ryuk ka seb (apple) hai, dusre haath me CSE-2 ke saare solved MT-2 papers, aur nazar **Tea Men's Cafe** ke garma-garam samose pe hai! 😋🥟\n\nTum batao **${first}**—aaj ka din kaisa ja raha hai? Koi subject tang kar raha hai ya kisi topic pe gup-shup karni hai? 👇`,
      nextSugg: 'Boys hostel waali canteen ka menu dikhao 🍔',
    };
  }

  // 6. "Bore ho raha hu" / "Man nahi lag raha" / "Timepass" / "Kuch interesting batao"
  if (
    clean.includes('bore') ||
    clean.includes('boring') ||
    clean.includes('man nahi lag') ||
    clean.includes('timepass') ||
    clean.includes('mood off') ||
    clean.includes('kuch interesting') ||
    clean.includes('maza nahi') ||
    clean.includes('sad ') ||
    clean === 'sad'
  ) {
    return {
      text: `🎭🔥 **Arre ${buddy}, jab tak ikA ka Oracle zinda hai, tum bore kaise ho sakte ho?!** 😎⚡\n\nMood fresh karne ke 4 solid raste hain mere paas:\n• 1️⃣ **250+ Campus Joke Vault:** Vimal Sir ke *"Are you getting it?!"* se lekar Shivam Sir ke metabolism tak ke khatarnak roasts!\n• 2️⃣ **Nostalgia & Pop-Culture:** Beyblade, Pokémon, Ben 10, Anime (Death Note/JJK/Naruto), Cricket, ya Cars pe charcha!\n• 3️⃣ **Canteen Treat:** **K.J Cafe** ke Kurkure Momos (₹75) ya **Tea Men's Cafe** ki Cold Coffee (₹60) ka menu dekho!\n• 4️⃣ **Faculty Secret Lore:** Dekho kis professor ki class me kaise bachna hai!\n\nBol mere dost, kahan se shuru karein? 👇😂`,
      nextSugg: 'Ek mast campus joke sunao 😂',
    };
  }

  // 7. "Padhai nahi ho rahi" / "Exam kab hai" / "Syllabus bohot hai" / "Kaise pass hu"
  if (
    clean.includes('padhai nahi') ||
    clean.includes('kaise padhu') ||
    clean.includes('kaise pass') ||
    clean.includes('syllabus') ||
    clean.includes('exam kab') ||
    clean.includes('mt2 kab') ||
    clean.includes('kuch nahi aata') ||
    clean.includes('fail ho') ||
    clean.includes('back lag')
  ) {
    return {
      text: `🫂💙 **Relax karo ${buddy}! Engineering me last-night fight hi asli parampara hai!** 🚀📚\n\n• **📅 Exam Alert:** MT-2 Exams **30 November se 4 December** tak hain!\n• **🎯 Secret Hack:** Tumhe moti-moti kitabein padhne ki zaroorat nahi hai! Maine **poore 10 subjects ke MT-2 papers step-by-step solve karke** isi portal me daal diye hain!\n\nBas niche kisi bhi subject ka naam likho (jaise *"Solve full Physics MT2 paper"* ya *"Solve full Maths MT2 paper"*), 20 minute me pura paper taiyaar ho jayega aur aaram se **8.5+ SGPA** aayegi! 💪🔥`,
      nextSugg: 'Solve full Physics MT2 paper',
    };
  }

  // 8. "Coding kaise sikhu?" / "DSA kaise karu?" / "Web dev" / "Python vs C++"
  if (
    clean.includes('coding kaise') ||
    clean.includes('dsa kaise') ||
    clean.includes('leetcode') ||
    clean.includes('python vs') ||
    clean.includes('web dev') ||
    clean.includes('hackathon') ||
    clean.includes('project kaise')
  ) {
    return {
      text: `💻🚀 **Boss ikA's Golden Coding & 20+ LPA Tech Roadmap for ${first}:** ⚡🔥\n\n• 1️⃣ **Semester 1–2 (Base Building):** **C++** me loops, arrays, pointers aur OOPs pakka karo + **Python** ke basics seekho (25CS101 & 25AI101).\n• 2️⃣ **DSA Game:** Roz sirf **2 questions LeetCode** pe lagao (Arrays ➔ Strings ➔ Linked List ➔ Trees ➔ DP).\n• 3️⃣ **Development (Like Boss ikA):** HTML/CSS/JS ke baad **React, Next.js & TypeScript** pakdo aur aisi live websites banao jo log sach me use karein!\n• 4️⃣ **Smart India Hackathon (SIH):** 2nd year me apni team banao aur national hackathons phodo! 🏆`,
      nextSugg: 'Kya 50 LPA ka package lagta hai?',
    };
  }

  // 9. "Hostel life vs Day Scholar" / "Warden" / "Mess ka khana"
  if (
    clean.includes('hostel life') ||
    clean.includes('day scholar') ||
    clean.includes('mess ka khana') ||
    clean.includes('warden')
  ) {
    return {
      text: `🏠😂 **ABES Hostel vs. Day Scholar — The Eternal CSE-2 Battle!** ⚡\n\n• **🎒 Day Scholars:** Roz subah metro/auto ki bhaagam-bhaag, par ghar jaake mummy ke haath ka garma-garam khana! 😋\n• **🛏️ Hostellers:** Subah 8:45 pe uthke 8:50 ki class me pahuchne ka talent, raat 2 baje **K.J Cafe** ki ₹60 wali Cheese Maggi aur ₹75 wale Kurkure Momos, aur shaam 7 baje Warden ke radar se bachne ka thrill! 🍜🔥\n\nWaise tumhare hisaab se asli maza kisme hai, **${first}**? 😎👇`,
      nextSugg: 'Boys hostel waali canteen ka menu dikhao 🍔',
    };
  }

  // 10. Compliments / Thanks / Appreciation: "Thank you", "Shukriya", "Love you", "Mast hai", "Op", "Bawaal"
  if (
    clean.includes('thank') ||
    clean.includes('thnx') ||
    clean.includes('shukriya') ||
    clean.includes('dhanyawad') ||
    clean.includes('love you') ||
    clean.includes('mast website') ||
    clean.includes('bawaal') ||
    clean.includes('op bhai') ||
    clean.includes('gajab') ||
    clean.includes('maza aa gaya')
  ) {
    return {
      text: `❤️🔥 **Arre dil jeet liya tumne, ${buddy}!** 🙌✨\n\nSaara credit **Supreme Architect Boss ikA** ko jata hai jinhone din-raat ek karke Section CSE-2 ke liye yeh digital samrajya khada kiya hai! 👑🍎\n\nJab bhi koi doubt ho, notes chahiye hon, ya bhookh lage—bas ek message daal dena! 👇🚀`,
      nextSugg: 'Ek mast campus joke sunao 😂',
    };
  }

  // 11. Goodbyes / Good Night / Good Morning
  if (
    clean.includes('good morning') ||
    clean.includes('gm ') ||
    clean === 'gm' ||
    clean.includes('good night') ||
    clean === 'gn' ||
    clean === 'bye' ||
    clean.includes('bye bye') ||
    clean.includes('chalta hu') ||
    clean.includes('sone ja raha')
  ) {
    const isMorning = clean.includes('morning') || clean === 'gm';
    return {
      text: isMorning
        ? `☀️☕ **Good Morning ${buddy}!** Utho aur chamko—8:50 AM ka lecture aur **Tea Men's Cafe** ki ₹10 wali garma-garam chai tumhara wait kar rahi hai! Aaj ka din ekdum productive jayega! 🚀✨`
        : `🌙✨ **Take care & Good Night ${buddy}!** Aaram se so jao, kal ke lectures aur notes ki tension mujhpe aur **Boss ikA** pe chhod do! Sweet dreams (bas sapne me Ryuk na aaye 👹🍎)! 😂👋`,
      nextSugg: 'Aaj ka live lecture kya chal raha hai?',
    };
  }

  // 12. "Help" / "Kya puchu" / "Commands batao" / "Features"
  if (clean === 'help' || clean.includes('kya puchu') || clean.includes('commands') || clean.includes('features')) {
    return {
      text: `🧭⚡ **ikA's World — Quick Command Cheat-Sheet for ${first}:** 📋🔥\n\n• 📄 **Solved MT-2 Keys:** *"Solve full AI MT2 paper"*, *"Physics MT2 Q.1"*, *"C++ MT2 Q.3(b)"*, *"BEE MT2 Section C"*\n• 🍔 **Canteen Menus:** *"Boys hostel waali canteen"* (K.J Cafe) ya *"College upper waali canteen"* (Tea Men's Cafe)\n• 👩‍🏫 **Faculty Guides:** *"Prerana maam"*, *"Divyanshi maam"*, *"Vimal sir"*, *"Shivam sir"*, *"Kartika maam"*, *"Shailja maam"*\n• 🌍 **Universal Topics:** Maths equations, Cricket/IPL, Anime, Cartoons (Beyblade/Pokémon/Ben 10), Gaming, Cars, Space/ISRO, History, Gym, Finance & Shayari!\n• 🔗 **Multi-Command Power:** Ask 2–3 things in one message using **"aur"** or **"and"**!`,
      nextSugg: 'Solve full AI MT2 paper',
    };
  }

  return null;
}

// ============================================================================
// 3. SINGLE-CLAUSE UNIVERSAL OMNI-BRAIN MATCHER (ALL FIELDS IN THE WORLD)
// ============================================================================
function matchSingleOmniTopic(
  rawQuery: string,
  first: string,
  isFemale: boolean,
  isBoss: boolean,
  isAgrima: boolean
): { text: string; nextSugg: string } | null {
  const norm = normalizeHinglishInput(rawQuery);
  const clean = norm.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const buddy = isBoss ? 'Supreme Boss ikA 👑' : isAgrima ? 'My Queen Agrima 🌸' : isFemale ? `${first} yaar ✨` : `${first} mere bhai 😎`;

  // 1. LIVE MATHS & ARITHMETIC ENGINE
  const mathRes = trySolveMathQuery(rawQuery, buddy);
  if (mathRes) return mathRes;

  // 1B. PLACEMENT, 50 LPA PACKAGE, CGPA, REAL RECORD & 15+ LPA ROADMAP (HIGH PRIORITY)
  if (clean.includes('50 lpa') || clean.includes('60 lpa') || clean.includes('package lagta') || clean.includes('salary package')) {
    return {
      text: `### 💰 ABES Placement & 50 LPA Reality Check 🎯\n\n• **Top 0.2% (40–60 LPA):** Atlassian (59.9 LPA), Microsoft, Google, Amazon — 95% off-campus, PPOs, ya national hackathons se lagte hain!\n• **5–8% Batch (10.0 – 18.0 LPA):** Cisco, BNY Mellon, MAQ Software, Ion Group, Super Dream offers.\n• **15–20% Batch (6.0 – 9.0 LPA):** TCS Digital/Prime, Nucleus Software, Nagarro, Hexaware.\n• **60–65% Batch (3.5 – 5.0 LPA):** Bulk recruiters (TCS Ninja, Infosys, Cognizant, Wipro, Capgemini).\n• **Sweet Spot CGPA:** **7.5 – 8.0+** rakho aur **300+ LeetCode problems** lagao! 🚀`,
      nextSugg: 'CGPA kitni matter karti hai?',
    };
  }

  if (clean.includes('cgpa') || clean.includes('matter karti')) {
    return {
      text: `### 🎯 CGPA Truth & Thresholds in B.Tech 📊\n\n• **Below 6.0:** ⛔ Disqualified from 90% on-campus company placement tests.\n• **6.0 – 7.5:** ✅ Basic eligibility for mass recruiters with 0 active backlogs.\n• **7.5 – 8.0 (Sweet Spot):** 🌟 Safe for **95%+ company eligibility filters** on campus.\n• **8.5+:** 💎 Acts as shortlisting armor in high-applicant Super Dream drives!`,
      nextSugg: 'Real placement record kitna hai?',
    };
  }

  if (clean.includes('real placement') || clean.includes('placement record') || clean.includes('placement') || clean.includes('package')) {
    return {
      text: `### 📊 ABES Real Placement Numbers & Ground Reality 🎯\n\n• **NIRF Median Package:** **₹4.50 – ₹5.75 LPA** for B.Tech.\n• **Unique Placed Students:** ~850–900 out of ~1,100 eligible graduates (**~80% placement rate**).\n• **Multiple Offers:** 1,600+ total offers reflect top coders bagging 2–3 offers each (1 mass recruiter backup + 1–2 dream offers).\n• **Bottom Line:** College आपको मौके (opportunities) poore dega—par **10+ LPA** nikalna aapki **DSA + Projects** mehnat pe depend karta hai! 💪🔥`,
      nextSugg: '15+ LPA crack karne ka roadmap kya hai?',
    };
  }

  if (clean.includes('roadmap') || clean.includes('15 lpa') || clean.includes('crack karne')) {
    return {
      text: `### 🚀 15–25+ LPA Crack Karne Ka 4-Step Roadmap\n\n• **1. DSA Mastery:** C++ ya Java me **300+ LeetCode problems** (Arrays, Strings, Trees, Graphs, DP).\n• **2. Proof-of-Work Projects:** Deployed full-stack web/AI apps (React, Next.js, Node.js/Spring Boot — bilkul Boss ikA ke iss portal jaise!).\n• **3. Core CS Subjects:** Operating Systems (OS), DBMS (SQL queries & normalization), aur Computer Networks.\n• **4. Hackathons & Off-Campus:** Smart India Hackathon (SIH), GSoC, aur LinkedIn referrals! 🔥`,
      nextSugg: 'Safe bunk & SGPA kaise check karu? 🧮',
    };
  }

  // 2. GOLDEN ERA CARTOONS (BEYBLADE, POKEMON, BEN 10, TRANSFORMERS, DORAEMON, SHINCHAN)
  if (clean.includes('beyblade') || clean.includes('tyson') || clean.includes('kai ') || clean.includes('dranzer') || clean.includes('dragoon') || clean.includes('let it rip')) {
    return {
      text: `🌪️🔥 **BEYBLADE GOLDEN ERA — "3... 2... 1... Ho Jaaye Shuru (Let It Rip)!"** ⚡🐉\n\nArre **${buddy}**, बचपन ki sabse legendary yaad chhed di tumne! Shaam ko 5 baje Cartoon Network pe **Bladebreakers** ka craze alag hi level pe tha:\n\n• 🐉 **Tyson Granger (Takao) & Dragoon:** Wind Bit-Beast! Har haari hui baazi ko aakhiri second me *Galaxy Storm* se पलटने wala hero!\n• 🔥 **Kai Hiwatari & Dranzer:** The OG Lone Wolf! Jab Kai ne **Black Dranzer** uthaya tha aur aakhiri me Dranzer ne apni jaan di thi—pure goosebumps! 🦅🩸\n• 🐯 **Ray Kon (Driger)** & 🐢 **Max Tate (Draciel):** Ultimate attack aur ultimate defense ka combo!\n• 💡 **Real Life Memory:** Plastic ke tip wale beyblade me lohe ka weight ring lagana aur mummy ki kadhai/parat ko Beystadium banana! 😂🏆`,
      nextSugg: 'Pokemon aur Ben 10 ki yaadein batao ⚡',
    };
  }

  if (clean.includes('pokemon') || clean.includes('pikachu') || clean.includes('charizard') || clean.includes('ash ketchum')) {
    return {
      text: `⚡🧢 **POKÉMON — "Banunga Main Itna Zabardast, Na Koi Ho Jitna!"** 🔥🐉\n\n**${buddy}**, Pokémon sirf ek cartoon nahi, hum sab ka pura bachpan hai! 🌟\n\n• ⚡ **Ash & Pikachu:** Pallet Town se shuru hua safar jo aakhir-kaar **World Coronation Series (Monarch)** jeet kar pura hua!\n• 🔥 **Charizard:** Shuru me Ash ki baat bilkul nahi manta tha, par **Seismic Toss** maar ke Blaine ke Magmar aur Gary ke Blastoise ko harana iconic tha!\n• 🐸 **Greninja (Ash-Greninja), Infernape & Sceptile:** Kalos, Sinnoh aur Hoenn ke sabse badass aces!\n• 🃏 **School Memory:** Cheetos ke packet se **Tazos / Jenga cards** nikalna aur lunch break me trump cards khelna! 😎✨`,
      nextSugg: 'Ben 10 aur Transformers ke baare me batao ⌚',
    };
  }

  if (clean.includes('ben 10') || clean.includes('ben10') || clean.includes('omnitrix') || clean.includes('four arms') || clean.includes('heatblast') || clean.includes('alien x')) {
    return {
      text: `⌚💚 **BEN 10 — "Asmaan Se Gira Ek Aisa Yantra, Jisne Badal Diya Ben Ka Tantra!"** 👽🔥\n\nArre **${buddy}**, sach batana—bachpan me ghadi pehen ke uspe thappad maara hai na taaki **Four Arms** ban jao? 😂💚\n\n• 🔥 **OG 10 Aliens (Classic):** **Heatblast**, **Four Arms**, **XLR8** (speed king), **Diamondhead**, **Ghostfreak**, **Upgrade**, **Way Big**!\n• 🌌 **Alien Force & Ultimate Alien:** **Swampfire**, **Humungousaur**, **Big Chill**, aur sabse OP god-tier alien — **Alien X** (jo palak jhapakte hi universe mita de)!\n• 😈 **Villains:** **Vilgax** aur **Kevin 11** ke fights aaj bhi modern CGI movies ko takkar dete hain! 🚀`,
      nextSugg: 'Transformers aur Power Rangers ke baare me batao 🤖',
    };
  }

  if (clean.includes('transformer') || clean.includes('optimus prime') || clean.includes('bumblebee') || clean.includes('megatron') || clean.includes('autobots')) {
    return {
      text: `🤖🚛 **TRANSFORMERS — "Autobots, Roll Out!"** ⚡🌌\n\n**${buddy}**, Cybertron ki jung aur **Optimus Prime** ki bhaari aawaz sunte hi rongte khade ho jate hain! 🔥\n\n• 🚛 **Optimus Prime:** Leader of the Autobots! Unki speeches (*"I am Optimus Prime..."*) sunke lagta tha abhi jaake duniya bacha lein!\n• 🐝 **Bumblebee:** Yellow Camaro jo radio se baat karta hai aur loyalty me #1 hai!\n• ✈️ **Megatron & Starscream (Decepticons):** Pure ruthless villains!\n• 🎬 **Best Era:** *Transformers Prime* animated series aur Michael Bay ki 2007 wali pehli movie ka transformation scene = Pure Cinema! 🍿✨`,
      nextSugg: 'Beyblade aur Tyson/Kai ki yaadein batao 🌪️',
    };
  }

  if (
    clean.includes('cartoon') || clean.includes('shinchan') || clean.includes('doraemon') ||
    clean.includes('power rangers') || clean.includes('spd') || clean.includes('perman') ||
    clean.includes('ninja hattori') || clean.includes('tom and jerry') || clean.includes('oggy') ||
    clean.includes('swat kats') || clean.includes('dragon tales') || clean.includes('bachpan')
  ) {
    return {
      text: `📺🍿 **THE GOLDEN ERA OF INDIAN TV CARTOONS (90s & 2000s Nostalgia)!** 🌟💖\n\nArre **${buddy}**, aaj kal ke bacche reels dekhte hain, par humne TV ka **Golden Era** jiya hai:\n\n• 🤖 **Doraemon & Nobita:** Anywhere Door aur Big Light! Exam se ek raat pehle *Computer Pencil* aur *Memory Bread* ki sabse zyada yaad aati hai! 🍞😂\n• 🕺 **Shinchan:** *"Ab main itna bhi kuch khaas nahi!"* — Action Kamen aur Buri Buri Zaemon ka swag!\n• 🚨 **Power Rangers (SPD & Mystic Force):** *"SPD Emergency!"* — Red Ranger banne ke liye doston me ladai hoti thi!\n• 🦸‍♂️ **Perman (Mitsuo), Ninja Hattori (Ding-Ding!), Swat Kats, Dragon Tales, Kochikame, Kiteretsu, Courage the Cowardly Dog, Oggy (SRK dubbing), aur Tom & Jerry!**\n\nBatao ${first}, tumhara all-time favorite konsa tha? 👇✨`,
      nextSugg: 'Beyblade aur Pokemon ke baare me batao 🌪️',
    };
  }

  // 3. ANIME MULTIVERSE (DEATH NOTE, NARUTO, ONE PIECE, JJK, DBZ, AOT, SOLO LEVELING)
  if (
    clean.includes('anime') || clean.includes('death note') || clean.includes('light yagami') ||
    clean.includes('naruto') || clean.includes('one piece') || clean.includes('luffy') ||
    clean.includes('goku') || clean.includes('dragon ball') || clean.includes('dbz') ||
    clean.includes('jujutsu') || clean.includes('gojo') || clean.includes('sukuna') ||
    clean.includes('attack on titan') || clean.includes('eren') || clean.includes('demon slayer') ||
    clean.includes('solo leveling') || clean.includes('ayanokoji') || clean.includes('blue lock')
  ) {
    return {
      text: `🎌⚔️ **THE ANIME MULTIVERSE — DECODED BY BOSS ikA's ORACLE!** 🍎🔥\n\nArre **${buddy}**, tum toh pakke **Culture ke Insaan** nikle! Yeh dekho top legendary animes ka breakdown:\n\n• 📓 **Death Note (Our Portal's Soul):** **Light Yagami (Kira)** vs **L** ka 200-IQ mind game, **Ryuk** ka seb (apple) प्रेम, aur **Shinigami Eyes**—jispe hamara poora **ikA's World** bana hai! 💀🍎\n• 🍥 **Naruto Shippuden:** Naruto Uzumaki ka *Dattebayo*, Sasuke Uchiha, Itachi ka sacrifice, aur **Madara Uchiha** vs Shinobi Alliance!\n• 🏴‍☠️ **One Piece:** **Monkey D. Luffy (Gear 5)**, Zoro ka 3-sword style, aur Grand Line ka never-ending adventure!\n• 🐉 **Dragon Ball Z / Super:** **Goku's Ultra Instinct** aur **Vegeta's Ultra Ego** — anime world ke asli pitaji!\n• 🤞 **Jujutsu Kaisen (JJK):** **Gojo Satoru** (*"Nah, I'd Win" / Domain Expansion: Infinite Void*) vs **Ryomen Sukuna (Malevolent Shrine)**!\n• 🗡️ **Attack on Titan (Eren Yeager - Tatakae!)**, **Demon Slayer (Tanjiro/Rengoku)**, **Solo Leveling (Sung Jinwoo - "Arise!")**, & **Classroom of the Elite (Ayanokoji)**!\n\nBatao ${first}, tumhari #1 anime konsi hai? 👇🔥`,
      nextSugg: 'Gaming (BGMI, GTA, Valorant) ke baare me batao 🎮',
    };
  }

 // 4. PC & MOBILE GAMING ENCYCLOPEDIA
  if (
    /\b(game|games|gaming|bgmi|pubg|valorant|valo|gta|minecraft|rdr2|coc|cod|cs2|csgo|wukong)\b/.test(clean) ||
    clean.includes('free fire') ||
    clean.includes('red dead') ||
    clean.includes('clash of clans') ||
    clean.includes('mini militia') ||
    clean.includes('elden ring') ||
    clean.includes('god of war')
  ) {
    return {
      text: `🎮🔥 **PC & MOBILE GAMING ARENA — CSE-2 GAMERS HUB!** 🎧⚡\n\nArre **${buddy}**, engineering bina gaming ke adhoori hai! Chahe last bench pe mobile lobby ho ya raat 2 baje hostel LAN party:\n\n• 📱 **Mobile Gaming Legends:**\n  ↳ **BGMI / PUBG Mobile:** Pochinki aur Georgopol hot-drops, M416 + 6x spray, aur *"Enemies Ahead!"* ka emotion!\n  ↳ **Mini Militia:** College lecture aur hostel Wi-Fi ka sabse bada legend—Sniper + Nitro boost!\n  ↳ **Clash of Clans (CoC), Clash Royale, COD Mobile & Free Fire:** Clan war attack miss karne pe doston ki gaaliyan! 😂\n• 💻 **PC & Console Masterpieces:**\n  ↳ **Valorant & CS2:** *"Sage revive me!"*, Mumbai server ki toxic comedy, aur One-Tap Vandal/Operator clutch!\n  ↳ **GTA V & GTA VI:** Los Santos ki galiyan, Vice City ki nostalgia, aur GTA VI ka craze!\n  ↳ **RDR2 (Arthur Morgan), Black Myth: Wukong, God of War (Kratos), Elden Ring, Cyberpunk 2077 & Minecraft:** Pure storytelling aur open-world magic!\n\nTum konsa game khelte ho **${first}**—Mobile ya PC? 👇🎮`,
      nextSugg: 'Anime (Death Note, Naruto, JJK) ke baare me batao 🎌',
    };
  }

  // 5. ALL PROGRAMMING LANGUAGES, AI & CYBERSECURITY
  if (
    clean.includes('programming language') || clean.includes('all languages') ||
    clean.includes('java ') || clean === 'java' || clean.includes('javascript') ||
    clean.includes('typescript') || clean.includes('rust') || clean.includes('golang') ||
    clean.includes('sql') || clean.includes('html') || clean.includes('react') ||
    clean.includes('nextjs') || clean.includes('cybersecurity') || clean.includes('ethical hacking') || clean.includes('kali linux')
  ) {
    return {
      text: `💻🚀 **ALL PROGRAMMING LANGUAGES, AI & CYBERSECURITY CHEAT-SHEET!** ⚡🧠\n\nYeh lo **${buddy}**, duniya ki top programming languages aur tech domains ka crisp breakdown:\n\n• ⚙️ **C / C++ (25CS101):** Fast, hardware-close & memory-efficient (Pointers + STL). **Use:** Competitive Programming (DSA), Game Engines, OS kernels.\n• 🐍 **Python (25AI101):** English jaisa simple syntax, huge libraries (NumPy, PyTorch). **Use:** Artificial Intelligence, Machine Learning, Data Science & Automation.\n• ☕ **Java:** *"Write Once, Run Anywhere"* (JVM + strict OOPs). **Use:** Enterprise Backends (Spring Boot), Android Apps & Placement Interviews.\n• 🌐 **JavaScript & TypeScript:** Web ki dhadkan! **Use:** Full-Stack Web Apps (**React, Next.js, Node.js** — jaise **Boss ikA** ne yeh portal TypeScript + Next.js me banaya hai!).\n• 🦀 **Rust & Go (Golang):** Memory-safe systems programming (Rust) aur ultra-fast cloud microservices/Docker (Go).\n• 🗄️ **SQL & Databases:** PostgreSQL, MySQL & MongoDB.\n• 🛡️ **Cybersecurity & Ethical Hacking:** Kali Linux, Networking (TCP/IP), Penetration Testing, Cryptography & OSINT!\n\nKis language ya tech stack ka roadmap chahiye, **${first}**? 👇🔥`,
      nextSugg: 'Solve full C++ MT2 paper',
    };
  }

  // 6. BASICS OF ELECTRICAL, EVS, PHYSICS, ELECTRONICS & MECHANICAL
  if (
    (clean.includes('basic') || clean.includes('concept') || clean.includes('samjhao') || clean.includes('tell me about') || clean.includes('explain')) &&
    (clean.includes('electrical') || clean.includes('bee') || clean.includes('evs') || clean.includes('environment') || clean.includes('physics') || clean.includes('electronics') || clean.includes('mechanical'))
  ) {
    if (clean.includes('electrical') || clean.includes('bee')) {
      return {
        text: `⚡🔌 **BASICS OF ELECTRICAL ENGINEERING (25EL101) — QUICK CAPSULE!** 💡\n\n• **1. Ohm's Law & Kirchhoff's Laws:** **V = I × R**; **KCL** (Node pe incoming current = outgoing current, Charge conservation) & **KVL** (Closed loop me total voltage drop = 0, Energy conservation).\n• **2. AC vs. DC:** DC me frequency **0 Hz** hoti hai; India me AC supply **230V, 50 Hz** sinusoidal chalti hai (**RMS = 0.707 × Peak**, **Form Factor = 1.11**).\n• **3. RLC & Resonance:** Jab Inductive Reactance (**X_L = 2πfL**) aur Capacitive Reactance (**X_C = 1/2πfC**) barabar ho jayein, circuit **Resonance (f₀ = 1 / 2π√LC)** pe hota hai!\n• **4. Transformers:** Mutual Induction pe kaam karta hai (**E = 4.44 × f × N × Φₘ**), frequency bina badle voltage step-up/step-down karta hai (Max efficiency jab **Iron Loss = Copper Loss**)!`,
        nextSugg: 'Solve full Electrical MT2 paper',
      };
    }
    if (clean.includes('evs') || clean.includes('environment')) {
      return {
        text: `🌱🌍 **ENVIRONMENT & SUSTAINABILITY (25AS103) — QUICK CAPSULE!** ♻️\n\n• **1. Ecosystem & Food Chain:** Producers (Plants) ➔ Primary/Secondary Consumers ➔ Decomposers (**Lindeman's 10% Energy Law**).\n• **2. AQI & Pollution:** 7 Criteria Pollutants (**PM₂.₅, PM₁₀, NO₂, SO₂, CO, O₃, Pb**). Fossil fuels se Acid Rain (**SO₂/NOₓ**) aur Global Warming (**CO₂/CH₄**) hoti hai.\n• **3. Green vs. Grey Hydrogen:** Solar/Wind electrolysis se paani tod kar bana hydrogen **Green Hydrogen** hai (Zero carbon emission!).\n• **4. ISWM & Green Tech:** **5R Principle** (Refuse, Reduce, Reuse, Repurpose, Recycle), Cloud Virtualization, aur IoT Precision Agriculture!`,
        nextSugg: 'Solve full EVS MT2 paper',
      };
    }
    if (clean.includes('electronics')) {
      return {
        text: `🔌🧩 **BASICS OF ELECTRONICS (25EC101) — QUICK CAPSULE!** ⚡\n\n• **1. Digital Logic & Gates:** **NAND & NOR** Universal Gates hain! **De Morgan's Law:** **(A·B)' = A'+B'** & **(A+B)' = A'·B'**.\n• **2. K-Map & Number Systems:** 2's Complement = 1's Complement + 1; SOP (Σm Minterms) & POS (ΠM Maxterms).\n• **3. FET, MOSFET & CMOS:** Voltage-controlled devices with high input impedance; **CMOS Inverter** (PMOS + NMOS) gives near-zero static power dissipation!`,
        nextSugg: 'Solve full Electronics MT2 paper',
      };
    }
    if (clean.includes('mechanical')) {
      return {
        text: `⚙️🚗 **BASICS OF MECHANICAL ENGG (25ME101) — QUICK CAPSULE!** 🔥\n\n• **1. Thermodynamics:** Open, Closed & Isolated Systems; Isothermal Work **W = p₁V₁·ln(V₂/V₁)**.\n• **2. IC Engines:** 4-Stroke SI (Petrol - Spark Plug) vs CI (Diesel - Fuel Injector): **Suction ➔ Compression ➔ Power ➔ Exhaust**.\n• **3. Refrigeration & AC:** **VCRS Cycle** (Compressor ➔ Condenser ➔ Expansion Valve ➔ Evaporator) & Relative Humidity!`,
        nextSugg: 'Solve full Mechanical MT2 paper',
      };
    }
    return {
      text: `🔭⚛️ **APPLIED PHYSICS (25AS101) — QUICK CAPSULE!** ⚡\n\n• **1. Semiconductors:** Intrinsic me **Fermi Level bilkul beech me** hota hai (**E_F = (E_c + E_v)/2**). Temperature badhane par conductivity exponentially badhti hai!\n• **2. Optoelectronics:** **Photodiode** Reverse Bias me kaam karta hai (Dark current = leakage in darkness); **LED** Forward Bias me recombination se light deta hai (**λ = 1240 / E_g nm**); **Solar Cell** 4th Quadrant me power generate karta hai!\n• **3. Superconductors:** Critical temp (**T_c**) ke neeche **Resistance = 0** aur **Meissner Effect (B = 0, χ = -1 Perfect Diamagnetic)**. Type-II me **Vortex State** hoti hai (MRI magnets)!\n• **4. GMR (Giant Magnetoresistance):** Parallel magnetic layers = Low Resistance; Antiparallel = High Resistance!`,
      nextSugg: 'Solve full Physics MT2 paper',
    };
  }

  // 7. CRICKET, IPL, FOOTBALL, CHESS & GLOBAL SPORTS
  if (
    clean.includes('cricket') || clean.includes('virat') || clean.includes('kohli') ||
    clean.includes('dhoni') || clean.includes('thala') || clean.includes('mahi') ||
    clean.includes('rohit sharma') || clean.includes('hitman') || clean.includes('bumrah') ||
    clean.includes('ipl') || clean.includes('rcb') || clean.includes('csk') || clean.includes('mi ') ||
    clean.includes('football') || clean.includes('messi') || clean.includes('ronaldo') ||
    clean.includes('cr7') || clean.includes('chess') || clean.includes('gukesh') || clean.includes('f1')
  ) {
    return {
      text: `🏏🔥 **SPORTS, CRICKET & CHAMPIONS ARENA — CSE-2 STADIUM DEBATE!** 🏆⚡\n\nArre **${buddy}**, hostel TV room me IPL aur World Cup ki screening ka mahaul hi alag hota hai:\n\n• 👑 **Virat Kohli (The Chase Master / King):** 80+ International Centuries, MCG 82* vs Pak, 2024 T20 WC Final knock, aur **RCB** ka unmatched craze!\n• 🚁 **MS Dhoni (Thala For A Reason = 7):** Captain Cool! 2007 T20 WC, 2011 ODI WC (*"Dhoni finishes off in style!"*), 2013 CT, aur **CSK** ki 5 IPL trophies!\n• 🚀 **Rohit Sharma (Hitman) & Jasprit Bumrah:** ODI 264 record, World Cup & Champions Trophy winning captain, aur **Bumrah** = GOAT fast bowler!\n• ⚽ **Football & Global Icons:** **Lionel Messi** (8 Ballon d'Ors & 2022 World Cup) vs **Cristiano Ronaldo (CR7 - Siuuu!)** (900+ goals), **Chess World Champion D. Gukesh**, **Neeraj Chopra (Golden Arm)**, & **F1 (Max Verstappen / Lewis Hamilton)**!\n\nBatao ${first}, tumhari IPL team aur GOAT player kaun hai? 👇🏆`,
      nextSugg: 'Movies aur Web Series (Mirzapur, Marvel) ke baare me batao 🎬',
    };
  }

  // 8. MOVIES, BOLLYWOOD, HOLLYWOOD & WEB SERIES
  if (
    clean.includes('movie') || clean.includes('film') || clean.includes('web series') ||
    clean.includes('bollywood') || clean.includes('hollywood') || clean.includes('marvel') ||
    clean.includes('avengers') || clean.includes('iron man') || clean.includes('nolan') ||
    clean.includes('interstellar') || clean.includes('oppenheimer') || clean.includes('mirzapur') ||
    clean.includes('panchayat') || clean.includes('hera pheri') || clean.includes('3 idiots') ||
    clean.includes('breaking bad') || clean.includes('stranger things') || clean.includes('game of thrones') ||
    clean.includes('money heist') || clean.includes('srk') || clean.includes('shah rukh')
  ) {
    return {
      text: `🎬🍿 **CINEMA, WEB SERIES & CULT CLASSICS VAULT!** 🔥🎥\n\n**${buddy}**, exam khatam hone wali raat ko laptop pe movie/series marathon hi asli sukoon hai:\n\n• 🦸‍♂️ **Hollywood & Sci-Fi:** **Marvel's Avengers** (*"I am Iron Man"* — Tony Stark forever ❤️), aur **Christopher Nolan** ke masterpieces (**Interstellar**, **Inception**, **Oppenheimer**, **The Dark Knight**).\n• 🔫 **Indian Web Series Cult:**\n  ↳ **Mirzapur:** Kaleen Bhaiya (*"Jalwa hai hamara"*) & Munna Bhaiya (*"Hindi film ke hero hain hum"*).\n  ↳ **Panchayat:** Sachiv Ji, Pradhan Ji, Prahlad Cha & *"Dekh raha hai Binod!"* 😂\n  ↳ **Scam 1992 (Harshad Mehta), The Family Man, Asur & Farzi**.\n• 🌍 **Global Series:** **Breaking Bad** (*"I am the one who knocks" — Heisenberg*), **Game of Thrones**, **Stranger Things** & **Money Heist**.\n• 😂 **Evergreen Bollywood:** **3 Idiots** (*"All Izz Well"* — हर engineer ki biopic!), **Hera Pheri / Phir Hera Pheri** (Babu Bhaiya), **Gangs of Wasseypur** & **Chhichhore**!\n\nKonsi movie ya series teri all-time favorite hai, **${first}**? 👇🍿`,
      nextSugg: 'Music & DHH Rap (Arijit, Seedhe Maut, Kr$na) ke baare me batao 🎧',
    };
  }

  // 9. MUSIC, SINGERS & DESI HIP-HOP (DHH)
  if (
    clean.includes('music') || clean.includes('song') || clean.includes('gaana') ||
    clean.includes('arijit') || clean.includes('sidhu') || clean.includes('moose wala') ||
    clean.includes('karan aujla') || clean.includes('diljit') || clean.includes('honey singh') ||
    clean.includes('badshah') || clean.includes('raftaar') || clean.includes('krsna') ||
    clean.includes('seedhe maut') || clean.includes('divine') || clean.includes('rap') || clean.includes('hip hop')
  ) {
    return {
      text: `🎧🎤 **MUSIC, BOLLYWOOD & DESI HIP-HOP (DHH) PLAYLIST HUB!** 🔥🎵\n\nArre **${buddy}**, coding karte waqt ya metro/bus me earphones laga ke inhi ka toh raaj chalta hai:\n\n• 💔 **Melody & Soul Kings:** **Arijit Singh**, **KK** (Forever in our hearts — *Yaaron Dosti*), **Atif Aslam**, **Shreya Ghoshal** & **A.R. Rahman**.\n• 🚜 **Punjabi Wave:** **Sidhu Moose Wala** (*295, So High* — Legends Never Die 🏆), **Karan Aujla** (*Winning Speech, Making Memories*), **Diljit Dosanjh** & **AP Dhillon**.\n• 🔥 **Desi Hip-Hop (DHH) & OG Rap:**\n  ↳ **Seedhe Maut (Encore ABJ & Calm):** *Nayaab, Lunch Break, Khatta Flow* — **"TBSM4L!"** ⚔️\n  ↳ **KR$NA, Raftaar, Divine & Talha Anjum:** Lyrical god-tier bars!\n  ↳ **Yo Yo Honey Singh:** *Brown Rang, Blue Eyes, Desi Kalakaar* — The Bluetooth Era King! 👑`,
      nextSugg: 'Cars & Superbikes (Supra, GT-R, Thar, Royal Enfield) ke baare me batao 🏎️',
    };
  }

  // 10. CARS, SUPERCARS, BIKES & AUTOMOBILES
  if (
    /\b(car|cars|supercar|supercars|bike|bikes|supra|gtr|bmw|porsche|mustang|thar|scorpio|fortuner|bullet|ninja|hayabusa|ktm)\b/.test(clean) ||
    clean.includes('gt r') ||
    clean.includes('royal enfield') ||
    clean.includes('gt 650')
  ) {
    return {
      text: `🏎️💨 **GARAGE OF DREAMS — SUPERCARS, SUVs & BIKES!** 🏍️🔥\n\n**${buddy}**, placement ke pehle bade bonus se konsi machine uthani hai? Dekho legends ki list:\n\n• 🇯🇵 **JDM Legends:** **Toyota Supra MK4 (2JZ Engine - Ratatata! 🔥)** & **Nissan GT-R R35 (Godzilla)**!\n• 🇩🇪 **German & Track Beasts:** **BMW M5 CS / M3 Touring**, **Porsche 911 GT3 RS**, **Mercedes G-Wagon**, aur **Ford Mustang GT (5.0L V8 Roar)**!\n• 🚙 **Desi NCR / UP Road Presence ("Systumm"):** **Mahindra Thar Roxx**, **Scorpio-N (Z8L Black)**, **Toyota Fortuner Legender** — aur **Kartika Ma'am ki trusty Tata Tigor**! 😎\n• 🏍️ **Two-Wheel Legends:** **Royal Enfield Continental GT 650 & Classic 350**, **Kawasaki Ninja ZX-10R**, **Suzuki Hayabusa**, & **BMW S1000RR**!`,
      nextSugg: 'Space, ISRO & Black Holes ke baare me batao 🌌',
    };
  }

  // 11. SPACE, ISRO, ASTRONOMY, QUANTUM PHYSICS & TIME TRAVEL
  if (
    clean.includes('space') || clean.includes('isro') || clean.includes('nasa') ||
    clean.includes('black hole') || clean.includes('universe') || clean.includes('galaxy') ||
    clean.includes('chandrayaan') || clean.includes('mars') || clean.includes('time travel') ||
    clean.includes('alien') || clean.includes('multiverse') || clean.includes('astronomy')
  ) {
    return {
      text: `🌌🚀 **COSMOS, ISRO & QUANTUM REALITY — BEYOND EARTH!** 🪐✨\n\n• 🇮🇳 **ISRO's Historic Dominance:** **Chandrayaan-3** (Moon ke South Pole par soft landing karne wala duniya ka pehla desh!), **Aditya-L1** (Sun mission), aur **Gaganyaan**! 🛰️🏆\n• 🕳️ **Black Holes & Time Dilation:** Jahan gravity itni zyada hai ki **Light** bhi **Event Horizon** se bahar nahi aa sakti, aur Einstein ki General Relativity ke hisaab se wahan **Time slow ho jata hai** (*Interstellar* Miller's Planet: 1 Hour = 7 Years)!\n• ⚛️ **Quantum Weirdness:** **Schrödinger's Cat (Superposition)**, **Quantum Entanglement**, aur **Multiverse Theory**!`,
      nextSugg: 'History, Mythology & Geopolitics ke baare me batao ⚔️',
    };
  }

  // 12. HISTORY, MYTHOLOGY & GEOPOLITICS
  if (
    clean.includes('history') || clean.includes('itihas') || clean.includes('mythology') ||
    clean.includes('mahabharat') || clean.includes('ramayan') || clean.includes('krishna') ||
    clean.includes('shree ram') || clean.includes('shivaji') || clean.includes('maharana pratap') ||
    clean.includes('bhagat singh') || clean.includes('chanakya') || clean.includes('world war') ||
    clean.includes('geopolitics')
  ) {
    return {
      text: `⚔️🇮🇳 **BHARAT KA ITIHAS, MYTHOLOGY & GEOPOLITICS!** 🚩👑\n\n• 🏹 **Sanatan Wisdom (Ramayana & Mahabharata):** **Bhagavad Gita** — *"Karmanye Vadhikaraste Ma Phaleshu Kadachana"* (Apna 100% karma karo!). प्रभु श्री राम ki maryada aur श्री कृष्ण ki strategy har life problem ka hal hai!\n• 🦁 **Immortal Warriors:** **Chhatrapati Shivaji Maharaj** (Father of Indian Navy & Guerrilla Warfare), **Maharana Pratap & Chetak**, **Samrat Chandragupta Maurya & Acharya Chanakya**, **Shaheed Bhagat Singh & Netaji Subhas Chandra Bose**! 🙏\n• 🌍 **Geopolitics & Digital Bharat:** WW1 & WW2 history se lekar aaj ke **Digital India (UPI Global Dominance, Defense Exports, Semiconductor Fabs & AI Revolution)** tak! 🚀`,
      nextSugg: 'Gym, Fitness & Hostel Protein Diet ke baare me batao 💪',
    };
  }

  // 13. GYM, FITNESS & HOSTEL PROTEIN DIET
  if (
    clean.includes('gym') || clean.includes('fitness') || clean.includes('workout') ||
    clean.includes('bodybuilding') || clean.includes('diet') || clean.includes('protein') ||
    clean.includes('muscle') || clean.includes('weight loss') || clean.includes('bulking') || clean.includes('creatine')
  ) {
    return {
      text: `💪🏋️‍♂️ **CSE-2 GYM, FITNESS & HOSTEL PROTEIN PLAYBOOK!** 🔥🥗\n\n• 🏋️‍♂️ **Best College Split (Push-Pull-Legs):** **Push** (Bench, Incline DB, Overhead Press, Dips) • **Pull** (Pull-ups, Rows, Face Pulls, Curls) • **Legs** (Squats, RDL, Leg Press, Planks).\n• 🥚 **Budget Hostel Protein Hacks (100g+ Protein/Day):** **Soya Chunks** (50g = 26g Protein in ₹10!), **Boiled Eggs / Omelette at K.J Cafe** (₹10/egg), **Paneer**, **Roasted Chana / Sattu Shake**, **Oats + Milk + Peanut Butter**!\n• ⚡ **Golden Rule:** 7–8 hrs sleep + 3–4L water + Progressive Overload!`,
      nextSugg: 'Finance, Stocks, Crypto & Side Hustles ke baare me batao 📈',
    };
  }

  // 14. FINANCE, STOCKS, CRYPTO, STARTUPS & SIDE HUSTLES
  if (
    clean.includes('finance') || clean.includes('stock') || clean.includes('share market') ||
    clean.includes('nifty') || clean.includes('sensex') || clean.includes('sip') ||
    clean.includes('mutual fund') || clean.includes('crypto') || clean.includes('bitcoin') ||
    clean.includes('freelancing') || clean.includes('side hustle') || clean.includes('paisa kaise kamaye') ||
    clean.includes('startup') || clean.includes('invest')
  ) {
    return {
      text: `📈💰 **STUDENT FINANCE, INVESTING & COLLEGE SIDE-HUSTLE GUIDE!** 🚀🏦\n\n• 💻 **Top 4 College Side-Hustles (₹10k–₹50k/month):**\n  1️⃣ **Full-Stack Web/App Freelancing** (React, Next.js, Tailwind).\n  2️⃣ **Video Editing & Motion Graphics**.\n  3️⃣ **Mathematics / Coding Tutoring** (Class 9–10th & JEE basics).\n  4️⃣ **Paid Internships & Hackathons (SIH, GSoC, Unstop)**.\n• 📊 **Investing 101:** F&O gambling se door raho! **Nifty 50 Index Funds / Mutual Fund SIP** se compounding seekho (**Rule of 72:** \`72 ÷ Return % = Years to Double Money\`).`,
      nextSugg: 'Beyblade aur Pokemon ke baare me batao 🌪️',
    };
  }

  // 15. SHAYARI, LOVE/CRUSH, PAISA/BROKE, ROAST & RIDDLES
  if (
    clean.includes('gf') || clean.includes('girlfriend') || clean.includes('bf') ||
    clean.includes('boyfriend') || clean.includes('crush') || clean.includes('bandi') ||
    clean.includes('single') || clean.includes('pyaar') || clean.includes('mohabbat') ||
    clean.includes('dil toot') || clean.includes('breakup') || clean.includes('shadi')
  ) {
    return {
      text: `💘😂 **Arre ${buddy}, Engineering aur Ishq ka purana choli-daaman ka saath hai!** 🌹⚡\n\n> *"Dil lagana hi hai toh C++ ke pointers aur DSA ke trees se lagao... کم se कम segmentation fault dekar sach toh bolte hain, dhokha nahi dete!"* 😭💔\n\nWaise tension mat lo **${first}**, pehle **15+ LPA ka package** phodte hain, fir dekho kaise rishte waalon ki line lagti hai! 🚀😎`,
      nextSugg: 'Ek mast campus joke sunao 😂',
    };
  }

  if (clean.includes('shayari') || clean.includes('sher ') || clean.includes('quote') || clean.includes('dialogue') || clean.includes('status')) {
    return {
      text: `🎙️🔥 **Irshaad फरमाइए ${buddy} — Boss ikA's Special Engineering & Death Note Shayari:** 🥀⚡\n\n> *"Kitabon ke panno me kismat dhoondhne nikle the,* 📚\n> *75% attendance ke chakkar me subah 8:50 pe uthne nikle the!* 😴\n> *Duniya darti hogi exam ke red pen se,* ✍️\n> *Hum CSE-2 ke parinde hain—Boss ikA ke samrajya me toofan banne nikle the!"* 👑🔥🍎`,
      nextSugg: 'Ek mast campus joke sunao 😂',
    };
  }

  if (clean.includes('paisa') || clean.includes('paise') || clean.includes('broke') || clean.includes('garib') || clean.includes('udhaar') || clean.includes('pocket money') || clean.includes('party de')) {
    return {
      text: `💸😭 **Month-End Engineer Budget Alert for ${buddy}!** 🪙\n\nJab jeb me sirf **₹50** bache hon, toh **ikA's Budget Survival Combo** kaam aata hai:\n• **Combo 1 (Tea Men's Cafe):** ₹15 ka Samosa + ₹10 ki गरमा-गरम Chai = **₹25 me swarg!** ☕🥟\n• **Combo 2 (Boys Hostel K.J Cafe):** ₹40 ka Aloo Paratha ya ₹40 ki Veg Maggi = **Full pet bhar ke khana!** 🍜🔥\n• **Paisa Kamane Ka Hack:** Apna purana drafter ya calculator hamare **🛒 P2P Marketplace** pe bech do! 😎💰`,
      nextSugg: 'Boys hostel waali canteen ka menu dikhao 🍔',
    };
  }

  if (clean.includes('roast me') || clean.includes('mera roast') || clean.includes('beizzati') || clean.includes('insult me')) {
    return {
      text: `🔥💀 **Roast Mode Activated for ${buddy}!** 🌶️😂\n\nTumhari attendance dekh ke toh **Safe Bunk Calculator** bhi ro pada, aur tumhara coding style dekh ke compiler ne khud resign de diya! 🖥️😭\n\n*Mazak kar raha hu mere sher!* ❤️ Tum **Section CSE-2** ke heere ho—bas exam se ek raat pehle padhne ki aadat सुधार lo! 😎🔥`,
      nextSugg: 'Ek mast campus joke sunao 😂',
    };
  }

  if (clean.includes('riddle') || clean.includes('paheli') || clean.includes('puzzle') || clean.includes('dimag')) {
    return {
      text: `🧩🧠 **Shinigami IQ Riddle for ${buddy}:** 🍎👁️\n\n> **Paheli:** *"Mere paas keys (चाबियां) bohot hain par main koi taala nahi kholta. Mere paas space (जगह) hai par koi kamra nahi. Tum mere andar enter kar sakte ho par bahar nahi جا sakte. Batao main kaun hu?"* 🤔\n\n• **✅ Jawab:** **Ek Computer Keyboard!** ⌨️😂 *(Kyunki uspe Keys, Spacebar, aur Enter button teeno hote hain!)*`,
      nextSugg: 'Ek mast campus joke sunao 😂',
    };
  }

  return null;
}

// ============================================================================
// OFFICIAL ABES ACADEMIC CALENDAR (2026-27) & 105-PAGE SYLLABUS PDF ENGINE
// ============================================================================
const SYLLABUS_VAULT: Record<string, { title: string; code: string; credits: string; units: string[]; books: string; labs?: string }> = {
  physics: {
    title: 'Applied Physics',
    code: '25AS101 / 25AS201',
    credits: '3 Credits (L:2, T:1, P:0) • 100 Marks (30 CIA + 15 MT1 + 15 MT2 + 40 End Term)',
    units: [
      '• **Unit 1 — Quantum Physics (8 hrs):** Wave-Particle Duality, Group & Phase velocity, Wave function, 1D Schrödinger equation, Particle in a 1D box, Quantum tunnelling, Quantum computing & cryptography.',
      '• **Unit 2 — Emerging Physics (7 hrs):** Nanophysics, Quantum confinement (1D, 2D, 3D), CVD & Sol-Gel, Quantum Dots; Superconductors (Meissner effect, Type-I & Type-II); Spintronics & GMR.',
      '• **Unit 3 — Semiconductor & Devices (7 hrs):** Energy band gap, Intrinsic & Extrinsic Fermi level, Mobility, Conductivity vs Temp, PN junction, Depletion region, Built-in potential, Solar cell, Photodiode & LEDs.',
      '• **Unit 4 — Electromagnetic Theory (7 hrs):** Gradient, Divergence & Curl, Displacement current, Maxwell’s equations, Poynting Vector & theorem, EM waves & Skin depth.',
      '• **Unit 5 — Engineering Optics (7 hrs):** Lasers (Einstein’s coefficients, Ruby, He-Ne, Semiconductor, LIDAR, Holography) & Optical Fibre (NA, Acceptance angle, V-Number, Losses).',
    ],
    books: 'S.L. Gupta, S.K. Gupta, Navneet Gupta, A. Beiser, D.J. Griffiths.',
    labs: '**Physics Lab (25AS151 — 1 Credit, 100 Marks):** Semiconductor Band Gap, PN Diode V-I, Tangent Galvanometer, Stefan’s Law, Laser Diffraction, Potentiometer, Solar Cell V-I, Optical Fibre NA & Bending Losses, Photodiode, Planck’s Constant, Polarimeter, Newton’s Rings & Grating.',
  },
  mech: {
    title: 'Basics of Mechanical & Automation Engineering',
    code: '25ME101 / 25ME201',
    credits: '3 Credits (L:2, T:1, P:0) • MT-2 Coverage: CO2 (10M) + CO3 (5M)',
    units: [
      '• **Unit 1 — Mechanics & Strength of Materials (9 hrs):** Force, Moment, Couple, Supports (Hinge, Roller) & Loads (Point, UDL, UVL), FBD, Support Reactions; Stress-Strain, Hooke’s law, Poisson’s ratio, Elastic constants & Factor of safety.',
      '• **Unit 2 — Thermodynamics, Refrigeration & AC (9 hrs):** Laws of Thermodynamics (1st Law numericals), Heat Engine vs Heat Pump; Ton of Refrigeration, COP, VCRS Cycle, Domestic Fridge & Window AC.',
      '• **Unit 3 — IC Engines, EVs & HEVs (6 hrs):** 2-Stroke & 4-Stroke SI/CI Engines, EVs & Hybrid EVs (Series & Parallel HEV).',
      '• **Unit 4 — Sensors & Actuation Systems (6 hrs):** Sensors/Transducers, Open vs Closed-loop control; Cams, Ratchet, Gears, Belts, Bearings; Hydraulic & Pneumatic actuators.',
      '• **Unit 5 — Robotics & 3D Printing (6 hrs):** Robot classifications (Articulated, Cartesian, Cylindrical, SCARA), DOF, Payload, Reach & 3D Printing workflow.',
    ],
    books: 'S.S. Bhavikatti, Dr. D.S. Kumar, R.K. Rajput, V. Ganesan.',
    labs: '**CAD Lab (25ME152 — Orthographic Projections, AutoCAD 2D/3D, SolidWorks)** & **Digital Mfg Lab (25ME151 — CNC, 3D Printing, Laser Engraving, Drone Tech, RAC)**.',
  },
  bee: {
    title: 'Basics of Electrical Engineering',
    code: '25EL101 / 25EL201',
    credits: '3 Credits (L:2, T:1, P:0) • 100 Marks (30 CIA + 15 MT1 + 15 MT2 + 40 End Term)',
    units: [
      '• **Unit 1 — DC Networks & Theorems (7 hrs):** Active/Passive, Linear/Nonlinear, Source transformation, KVL & KCL, Mesh & Nodal Analysis, Superposition, Thevenin’s & Norton’s Theorems.',
      '• **Unit 2 — Single & Three-Phase AC Circuits (8 hrs):** R, L, C, RL, RC, RLC series & parallel circuits, Active/Reactive/Apparent power, Series & Parallel Resonance, 3-Phase Star & Delta relations.',
      '• **Unit 3 — Magnetic Circuits & Transformers (7 hrs):** Electric-Magnetic analogy, Faraday’s law, B-H loop; Single-phase Transformer EMF equation (4.44fNΦm), Equivalent circuit, Losses & Efficiency numericals.',
      '• **Unit 4 — Electrical Machines (7 hrs):** DC Machines (EMF & Torque equations), 3-Phase Induction Motor (Slip numericals) & Single-Phase Induction Motor.',
      '• **Unit 5 — Modern Power Systems, Batteries & AI (7 hrs):** Grid/Micro-grid/Smart grid, Distributed Generation, Earthing, Batteries (Backup calculation), BMS, BESS & AI in Power Systems.',
    ],
    books: 'D.P. Kothari & I.J. Nagrath, J.B. Gupta, B.L. Theraja.',
    labs: '**Basic Electrical Lab (25EL151 — 1 Credit):** KVL/KCL, Superposition, Thevenin, RLC Resonance, Power factor, Transformer Load Test, 3-Phase Induction Motor, DC Shunt Motor, Energy Meter, MCB & MATLAB Battery SoC.',
  },
  electronics: {
    title: 'Basics of Electronics Engineering',
    code: '25EC101 / 25EC201',
    credits: '3 Credits (L:2, T:1, P:0) • 100 Marks (30 CIA + 15 MT1 + 15 MT2 + 40 End Term)',
    units: [
      '• **Unit 1 — Diode & Applications (8 hrs):** PN Diode, Half/Full-Wave Rectifiers, Clippers & Clampers; Tunnel, Schottky, Varactor, Photodiode & Zener Diodes.',
      '• **Unit 2 — Transistors: BJT, FET & CMOS (7 hrs):** BJT (CB, CE, CC, Switch); JFET & MOSFET (Depletion/Enhancement, Pinch-off, VVR); CMOS Inverter, NAND & NOR.',
      '• **Unit 3 — Digital Electronics, DSP, Quantum & Edge (8 hrs):** Number Systems, BCD & Gray Code, Boolean Algebra, SOP & POS, 4-Variable K-Map; DSP Sampling/Quantization; Quantum & Edge Computing.',
      '• **Unit 4 — Integrated Circuits, Op-Amp & 555 Timer (8 hrs):** Moore’s Law, SSI–ULSI, IC Fabrication; Op-Amp (Inverting/Non-inverting); 555 Timer (Astable/Monostable).',
      '• **Unit 5 — Communication, 5G/6G & IoT (5 hrs):** Modulation, 1G to 5G/6G Cellular Networks, IoT Architecture & Wireless Sensor Networks (WSN).',
    ],
    books: 'Boylestad & Nashelsky, M. Morris Mano, George Kennedy.',
    labs: '**Electronics Workshop (25EC151 — 1 Credit):** CRO/DSO/DMM & Soldering, Zener Regulator, Logisim CMOS Gates, BJT Switch, Universal NAND/NOR, Op-Amp IC741, IC 555 & Arduino.',
  },
  maths: {
    title: 'Linear Algebra & Statistics (25AS102 Sem-I) / Applied Calculus & DE (25AS202 Sem-II)',
    code: '25AS102 / 25AS202',
    credits: '3 Credits (L:2, T:1, P:0) • 100 Marks (30 CIA + 15 MT1 + 15 MT2 + 40 End Term)',
    units: [
      '• **Unit 1:** **Sem-I (25AS102):** Vector spaces, Subspaces, Span, Linear dependence/independence, Basis & Dimension. | **Sem-II (25AS202):** Partial Differentiation, Euler’s Theorem, Jacobian, Maxima/Minima.',
      '• **Unit 2:** **Sem-I:** Linear Transformation, Rank, Nullity, Rank-Nullity Theorem, Change of Basis & Inverse LT. | **Sem-II:** Higher-order ODEs, Euler-Cauchy & Variation of Parameters.',
      '• **Unit 3:** **Sem-I:** Gauss-Jordan Inverse, Rank (Echelon/Normal), Eigenvalues, Eigenvectors & Cayley-Hamilton. | **Sem-II:** Laplace & Inverse Laplace Transform, Convolution Theorem.',
      '• **Unit 4:** **Sem-I:** Dispersion (Range, QD, MD, SD), Coefficient of Variation, Moments, Skewness & Kurtosis. | **Sem-II:** Double/Triple Integrals, Beta/Gamma & Dirichlet’s Integral.',
      '• **Unit 5:** **Sem-I:** Least Squares Curve Fitting, Karl Pearson & Rank Correlation, Linear & Multiple Regression. | **Sem-II:** Vector Calculus (Gauss Divergence, Green’s & Stoke’s Theorems).',
    ],
    books: 'S. Lipschutz (Schaum), S.P. Gupta, David C. Lay, B.S. Grewal.',
  },
  ds: {
    title: 'Programming in C++ (25CS101 Sem-I) / Data Structure Using C++ (25CS201 Sem-II)',
    code: '25CS101 / 25CS201',
    credits: '3 Credits (L:3, T:0, P:0) • Plus 1-Credit Lab (25CS151 / 25CS251)',
    units: [
      '• **Unit 1:** **Sem-I (25CS101):** Computer components, Compiler/Linker/Loader, Flowcharts & C++ basics. | **Sem-II (25CS201):** Time/Space Complexity (Big-O, Theta, Omega), Linear & Binary Search.',
      '• **Unit 2:** **Sem-I:** Data types, Operators, `if-else`, `switch`, `while`, `do-while`, `for`, `break`, `continue`. | **Sem-II:** Bubble, Insertion, Selection, Counting, Radix & Bucket Sort.',
      '• **Unit 3:** **Sem-I:** 1D & 2D Arrays, STL `vector`. | **Sem-II:** Singly, Doubly & Circular Linked Lists, Polynomial Representation.',
      '• **Unit 4:** **Sem-I:** Functions (Call by value/reference) & Recursion. | **Sem-II:** Hashing & Collision Resolution (Separate Chaining, Linear/Quadratic Probing, Double Hashing).',
      '• **Unit 5:** **Sem-I:** `string.h` functions & OOP Class/Objects. | **Sem-II:** STL Ordered & Unordered `set` and `map`.',
    ],
    books: 'Stanley B. Lippman (C++ Primer), E. Balagurusamy, Reema Thareja.',
    labs: '**C++ Lab (25CS151) & DSA Lab (25CS251):** Leap year, Largest of 3, Factorial, Matrix multiplication, Prime, Call by value/ref, Vowel count, Palindrome, Binary Search, Bubble/Selection Sort, Linked List, Hash Table, Set & Map.',
  },
  evs: {
    title: 'Environment & Sustainability',
    code: '25AS103 / 25AS203',
    credits: '2 Credits (L:2, T:0, P:0) • 100 Marks (30 CIA + 15 MT1 + 15 MT2 + 40 End Term)',
    units: [
      '• **Unit 1 — Sustainable Development (6 hrs):** Pillars, 17 SDGs, Anthropogenic impacts & Role of Engineers.',
      '• **Unit 2 — Pollution & Waste (6 hrs):** Water Treatment, AQI, Carbon Footprint, Earth Overshoot Day, Blockchain sustainability, ISWM, Urban Mining & Bioremediation.',
      '• **Unit 3 — Future Energy & Green Tech (4 hrs):** Decentralized Energy, Green Hydrogen, Biofuels, EVs, AI/ML in environment, Smart Agriculture & Green Computing.',
      '• **Unit 4 — Sustainable Practices (4 hrs):** ISO 14001, Life Cycle Assessment (LCA), CDM, Green Buildings, BEE Star Label, 3D Printing & Nanotech.',
      '• **Unit 5 — Laws & Treaties (4 hrs):** International Agreements, EPA 1986, Environmental Impact Assessment (EIA), Polluter Pays Principle (PPP) & EPR.',
    ],
    books: 'B.R. Bakshi (Cambridge), Dave, Katewa & Singh (Cengage).',
  },
  ai: {
    title: 'Essentials of Artificial Intelligence',
    code: '25AI101 / 25AI201',
    credits: '2 Credits (L:2, T:0, P:0) • 100 Marks (30 CIA + 15 MT1 + 15 MT2 + 40 End Term)',
    units: [
      '• **Unit 1 — AI & Statistical Foundations (5 hrs):** AI vs ML vs DL, Central tendency, Dispersion, Probability & Distributions (Normal, Binomial, Poisson).',
      '• **Unit 2 — Intelligent Agents & Logic (5 hrs):** Agent types, PEAS Description, Propositional Logic & Predicate Logic.',
      '• **Unit 3 — Python for AI (5 hrs):** Datatypes, Operators, Loops, Functions, NumPy, Pandas, Matplotlib, Scikit-learn & Data Preprocessing.',
      '• **Unit 4 — AI Interfaces & Prompt Engineering (5 hrs):** Kaggle, Google Colab, Jupyter; Zero-Shot, Few-Shot & Chain-of-Thought Prompting.',
      '• **Unit 5 — Modern AI & Ethics (4 hrs):** Discriminative vs Generative AI, Edge AI, XAI, Agentic AI, LLMs (Copilot, DALL-E, ChatGPT) & AI Ethics.',
    ],
    books: 'Stuart Russell & Peter Norvig, Sebastian Raschka, Ethan Mollick.',
  },
  dt: {
    title: 'Design Thinking, Innovation and Entrepreneurship',
    code: '25HU102 / 25HU202',
    credits: '2 Credits (L:2, T:0, P:0) • 100 Marks (30 CIA + 15 MT1 + 15 MT2 + 40 End Term)',
    units: [
      '• **Unit 1 — Intro (4 hrs):** Design Thinking vs conventional problem-solving; **Case Studies:** Mumbai Dabbawallas, Tata Nano, Jeevan Bindi.',
      '• **Unit 2 — 5 Stages (4 hrs):** Empathize, Moccasin Walk, Define, Ideate, Prototype, Test; **Case Studies:** GE VScan, Embrace Warmer, Tally, Lucky Iron Fish.',
      '• **Unit 3 — Tools (6 hrs):** Interviews, SCAMPER, Wireframes, Empathy & Journey Maps; **Case Studies:** Pureit, Royal Enfield, BigBasket, IDEO Water Pump, Airbnb, Oral-B.',
      '• **Unit 4 — Innovation & IPR (5 hrs):** Invention vs Innovation, TRL, IPR (Copyright, Patent, Trademark, GI Tag) & Google Patents.',
      '• **Unit 5 — Entrepreneurship (5 hrs):** Business Model Canvas (BMC), Value Proposition & Pitch Deck development.',
    ],
    books: 'R. Srinivasan, Don Norman (The Design of Everyday Things), Pavan Soni, E. Balagurusamy.',
  },
  softskills: {
    title: 'Soft Skills & Professional Communication',
    code: '25HU101 / 25HU201 & 25HU151 (Lab)',
    credits: '2 Credits Theory + 1 Credit Lab • 100 Marks Each',
    units: [
      '• **Unit 1 — Vocabulary & Grammar (5 hrs):** Word formation, Synonyms/Antonyms/Homophones, Subject-Verb Agreement, Gerund, Infinitive, Participle.',
      '• **Unit 2 — Listening Skills (4 hrs):** Listening process, types, barriers & TED Talk analysis.',
      '• **Unit 3 — Speaking Skills (5 hrs):** Extempore, Impromptu, Non-verbal (Kinesics) & Paralinguistic cues.',
      '• **Unit 4 — Reading Skills (4 hrs):** Skimming, Scanning, Churning & Assimilation.',
      '• **Unit 5 — Writing Skills (6 hrs):** 7Cs of Communication, Blog writing & Block-format Letters/Emails (Leave, Complaint, Permission, Internship).',
    ],
    books: 'Wren & Martin, Ritu Soryan, Jeff Butterfield, K. Alex.',
    labs: '**Prof. Communication Lab (25HU151):** Self-Introduction, Group Discussion (GD), Extempore, Role Play, Mock Interview, Theme Presentation & Open Parliament.',
  },
  web: {
    title: 'Web Designing Workshop - I (25VA151) & II (25VA251)',
    code: '25VA151 (Sem-I) / 25VA251 (Sem-II)',
    credits: '2 Credits Each (L:0, T:0, P:3) • 100 Marks (20 PA1 + 20 PA2 + 10 Att + 50 External)',
    units: [
      '• **25VA151 (Sem-I):** **U1:** HTML5, Lists, Links, Multimedia; **U2:** Tables, Forms, Git (`init, add, commit`); **U3:** GitHub (`push, pull, branch, merge, PR`) & CSS Box Model; **U4:** Flexbox, Media Queries & GitHub Pages.',
      '• **25VA251 (Sem-II):** **U1:** Bootstrap & Tailwind CSS; **U2:** JavaScript ES6, DOM, Promises, `async/await`, Fetch API; **U3:** React (`useState`, `useEffect`, Router); **U4:** Java Spring Boot REST APIs (CRUD).',
    ],
    books: 'Alex Banks & Eve Porcello (Learning React), Juha Hinkula, Noel Rappin (Tailwind CSS).',
  },
};

const CALENDAR_PDF_TAG = `[DOWNLOAD_PAPER|📅 Official ABES Academic Calendar — ODD Sem 2026-27 (PDF)|/academic_calendar.pdf]`;
const SYLLABUS_PDF_TAG = `[DOWNLOAD_PAPER|📘 Official ABES B.Tech 1st Year Autonomous Syllabus (105-Page PDF)|/btech_syllabus.pdf]`;

export function getAcademicCalendarAndSyllabusReply(rawQuery: string): { text: string; nextSugg: string } | null {
  const q = rawQuery.toLowerCase().trim();

  // Direct request for PDFs / Official Documents
  if (q.includes('pdf') && (q.includes('calendar') || q.includes('syllabus') || q.includes('abes') || q.includes('official') || q.includes('download'))) {
    return {
      text: `📂🏛️ **OFFICIAL ABES ENGINEERING COLLEGE PDF VAULT (VIEW & DOWNLOAD):**\n\nYahan se tum **Official Academic Calendar (ODD Sem 2026–27)** aur **Complete 105-Page B.Tech 1st Year Autonomous Syllabus** seedhe View ya Download kar sakte ho:\n\n${CALENDAR_PDF_TAG}\n\n${SYLLABUS_PDF_TAG}`,
      nextSugg: 'B.Tech 1st Sem ka full Academic Calendar dikhao 📅',
    };
  }

  // ==========================================================================
  // PART A: OFFICIAL ODD SEMESTER 2026-27 ACADEMIC CALENDAR ENGINE
  // ==========================================================================
  const isCalendarQuery =
    q.includes('academic calendar') || q.includes('calender') || q.includes('calendar') ||
    q.includes('holiday') || q.includes('chhutti') || q.includes('vacation') ||
    q.includes('diwali') || q.includes('dussehra') || q.includes('guru nanak') ||
    q.includes('christmas') || q.includes('kab hai') || q.includes('kab se') ||
    q.includes('date sheet') || q.includes('exam date') || q.includes('mt1 date') ||
    q.includes('mt-1 date') || q.includes('mt2 date') || q.includes('mt-2 date') ||
    q.includes('st-1') || q.includes('st-2') || q.includes('pue') ||
    q.includes('make-up') || q.includes('makeup') || q.includes('end sem') ||
    q.includes('end term') || q.includes('even sem') || q.includes('practical assessment') ||
    q.includes('project review') || q.includes('assessment 1') || q.includes('assessment 2') ||
    q.includes('assessment 3') || q.includes('assessment 4') || q.includes('assessment 5') ||
    q.includes('evaluation of') || q.includes('5th sem') || q.includes('7th sem') ||
    q.includes('3rd sem') || q.includes('m.tech') || q.includes('mtech') ||
    q.includes('bca') || q.includes('mca') || q.includes('exam pattern') ||
    q.includes('aktu vs autonomy') || q.includes('re-test') || q.includes('retest');

  if (isCalendarQuery) {
    if (q.includes('holiday') || q.includes('chhutti') || q.includes('vacation') || q.includes('diwali') || q.includes('guru nanak') || q.includes('christmas') || q.includes('dussehra')) {
      return {
        text: `📅🎉 **ABES OFFICIAL HOLIDAY LIST — ODD SEMESTER 2026–27** *(Revised 26.10.2026)* 🏛️\n\n• **11-08-2026 (Tue):** Shravan Shivratri 🔱\n• **15-08-2026 (Sat):** Independence Day 🇮🇳\n• **26-08-2026 (Wed):** Eid-e-Milad / Milad-un-Nabi 🌙\n• **28-08-2026 (Fri):** Raksha Bandhan 🧵\n• **04-09-2026 (Fri):** Janmashtami 🪈\n• **02-10-2026 (Fri):** Gandhi Jayanti 🇮🇳\n• **19-10-2026 (Mon) & 20-10-2026 (Tue):** Maha Navmi & Dussehra 🏹\n• **06-11-2026 to 13-11-2026 (Fri–Fri):** Diwali Holidays (8 Days) 🪔\n• **24-11-2026 (Tue):** Guru Nanak Jayanti 🙏\n• **25-12-2026 (Fri):** Christmas Day 🎄 *(Falls inside 21–28 Dec Make-up/PUE window)*\n• **01-01-2027 (Fri):** New Year Day 🎉\n• **26-01-2027 (Tue):** Republic Day 🇮🇳\n\n${CALENDAR_PDF_TAG}`,
        nextSugg: 'B.Tech 1st Sem ka full Academic Calendar dikhao 📅',
      };
    }

    if (q.includes('pattern') || q.includes('weightage') || q.includes('duration') || q.includes('aktu') || q.includes('re-test') || q.includes('retest')) {
      return {
        text: `📊⚖️ **OFFICIAL EXAM PATTERN: AUTONOMY vs. AKTU** 🏛️\n\n### 1️⃣ Under Autonomy Pattern (B.Tech 1st Year — 100 Marks)\n• **MT-1 & MT-2:** **1 hr 15 min** each | **1.5 Units** | Weightage: **15 Marks** each\n• **Make-up Exam:** **1 hr 15 min** | **3 Units** | Weightage: **15 Marks**\n• **End Term Exam:** **2 Hours** | **5 Units** | Weightage: **40 Marks**\n• **Internal CIA:** **30 Marks** (Quizzes/Assignments = **20M** + Attendance = **10M**)\n\n### 2️⃣ Under AKTU Pattern\n• **ST-1 & ST-2:** **1 hr 30 min** each | **2 Units** | Weightage: **2.5** each\n• **PUE:** **3 Hours** | **5 Units** | Weightage: **10**\n• **End Sem (AKTU Exam):** **3 Hours** | **5 Units** | Weightage: **70**\n• *Note: Both STs & PUE are mandatory. **No re-test / special test** will be conducted.*\n\n${CALENDAR_PDF_TAG}\n\n${SYLLABUS_PDF_TAG}`,
        nextSugg: 'B.Tech 1st Sem ka full Academic Calendar dikhao 📅',
      };
    }

    if (q.includes('5th') || q.includes('7th') || q.includes('third year') || q.includes('final year') || q.includes('project review')) {
      return {
        text: `📅🎓 **ABES ACADEMIC CALENDAR 2026–27 — B.TECH 5th & 7th SEMESTER**\n\n• **Commencement of Classes:** \`16/07/2026\` (Thursday)\n• **Assessment-1 / Project Review-1:** Last week of July | **Assessment-2 / PR-2:** Second week of Aug\n• **Practical Assessment-I:** \`07-11/09/2026\`\n• **MT-1 / ST-1 Theory Exam:** \`14/09/2026 to 18/09/2026\` (Eval: \`25/09/2026\`)\n• **Assessment-3 / PR-3:** Last week of Sept | **Assessment-4 / PR-4:** Second week of Oct | **Assessment-5:** Last week of Oct\n• **MT-2 / ST-2 Theory Exam:** \`02/11/2026 to 04/11/2026\` (Eval: \`17/11/2026\`)\n• **Practical Assessment-II & Make-up/PUE:** *To be decided*\n• **End Semester Theory Exam (Tentative*):** \`24 Nov - 27 Dec (2026)*\`\n• **End Semester Practical / Viva (Tentative*):** \`07 Dec - 24 Dec (2026)*\`\n\n${CALENDAR_PDF_TAG}`,
        nextSugg: 'Official Holiday List dikhao 🎉',
      };
    }

    if (q.includes('3rd') || q.includes('second year')) {
      return {
        text: `📅🎓 **ABES ACADEMIC CALENDAR 2026–27 — 3rd SEMESTER (B.Tech / M.Tech / BCA / MCA)**\n\n• **Commencement of Classes:** \`16/07/2026\` (Thursday)\n• **MT-1 / ST-1 Theory Exam:** \`12/10/2026 to 16/10/2026\` (Eval: \`21/10/2026\`)\n• **Practical Assessment-I:** \`22-28/10/2026\`\n• **MT-2 / ST-2 Theory Exam:** \`30/11/2026 to 04/12/2026\` (Eval: \`11/12/2026\`)\n• **Practical Assessment-II:** \`14-18/12/2026\`\n• **Make-up / PUE Theory Exam:** \`21-28/12/2026\` (Eval: \`04/01/2027\`)\n• **End Term / End Sem Theory & Practical (Tentative*):** \`04 Jan - 25 Jan (2027)*\`\n\n${CALENDAR_PDF_TAG}`,
        nextSugg: 'Official Holiday List dikhao 🎉',
      };
    }

    return {
      text: `📅👑 **ABES OFFICIAL ACADEMIC CALENDAR 2026–27 — 1st SEMESTER (B.Tech / M.Tech / BCA / MCA)**\n*(w.e.f. 16-07-2026 | Revised on 26-10-2026 | Tentative)*\n\n• **Induction / Commencement of Classes:** \`10/09/2026\` (Thursday)\n• **Assessment 1 & 2:** Third week of Sept & First week of Oct\n• **MT-1 / ST-1 Theory Exam:** \`12/10/2026 to 16/10/2026\` (Eval: \`21/10/2026\`)\n• **Practical Assessment-I:** \`22-28/10/2026\`\n• **Assessment 3 & 4:** Third week of Oct & Third week of Nov\n• **🔥 MT-2 / ST-2 Theory Exam:** \`30/11/2026 to 04/12/2026\` (Mon–Fri) | **Eval:** \`11/12/2026\`\n• **Assessment 5:** Second week of Dec\n• **🔬 Practical Assessment-II:** \`14-18/12/2026\`\n• **📝 Make-up / PUE Theory Exam:** \`21-28/12/2026\` | **Eval:** \`04/01/2027\`\n• **🏁 End Term / End Sem Theory & Practical Viva (Tentative*):** \`04 Jan - 25 Jan (2027)*\`\n• **🚀 Even Semester Start:** \`January 2027 (Tentative)\`\n\n${CALENDAR_PDF_TAG}`,
      nextSugg: 'Official Holiday List dikhao 🎉',
    };
  }

  // ==========================================================================
  // PART B: OFFICIAL 105-PAGE B.TECH 1ST YEAR SYLLABUS & UNIT-WISE ENGINE
  // ==========================================================================
  const isSyllabusIntent =
    q.includes('syllabus') || q.includes('unit 1') || q.includes('unit 2') ||
    q.includes('unit 3') || q.includes('unit 4') || q.includes('unit 5') ||
    q.includes('unit-1') || q.includes('unit-2') || q.includes('unit-3') ||
    q.includes('unit-4') || q.includes('unit-5') || q.includes('kitne unit') ||
    q.includes('topics in') || q.includes('textbook') || q.includes('reference book') ||
    q.includes('course outcome') || q.includes('credits') || q.includes('evaluation scheme') ||
    q.includes('marking scheme') || q.includes('cia marks') || q.includes('lab experiments') ||
    q.includes('25as202') || q.includes('25cs201') || q.includes('25va151') || q.includes('25va251') ||
    q.includes('25va152') || q.includes('holistic skill');

  if (!isSyllabusIntent) return null;

  let sKey = '';
  if (q.includes('physics') || q.includes('25as101') || q.includes('25as201') || q.includes('25as151')) sKey = 'physics';
  else if (q.includes('mech') || q.includes('25me101') || q.includes('25me201') || q.includes('cad') || q.includes('25me152') || q.includes('25me151')) sKey = 'mech';
  else if (q.includes('electrical') || q.includes('bee') || q.includes('25el101') || q.includes('25el201') || q.includes('25el151')) sKey = 'bee';
  else if (q.includes('electronic') || q.includes('bec') || q.includes('ece') || q.includes('25ec101') || q.includes('25ec151')) sKey = 'electronics';
  else if (q.includes('math') || q.includes('flas') || q.includes('calculus') || q.includes('25as102') || q.includes('25as202')) sKey = 'maths';
  else if (q.includes('c++') || q.includes('cpp') || q.includes('dsa') || q.includes('data structure') || q.includes('25cs101') || q.includes('25cs201') || q.includes('25cs151')) sKey = 'ds';
  else if (q.includes('evs') || q.includes('environment') || q.includes('25as103')) sKey = 'evs';
  else if (/\bai\b/.test(q) || q.includes('artificial intelligence') || q.includes('25ai101')) sKey = 'ai';
  else if (q.includes('design thinking') || /\bdt\b/.test(q) || q.includes('25hu102')) sKey = 'dt';
  else if (q.includes('soft skill') || q.includes('communication') || q.includes('25hu101') || q.includes('25hu151')) sKey = 'softskills';
  else if (q.includes('web design') || q.includes('workshop') || q.includes('25va151') || q.includes('25va251')) sKey = 'web';

  if (sKey && SYLLABUS_VAULT[sKey]) {
    const s = SYLLABUS_VAULT[sKey];
    const unitMatch = q.match(/unit[\s\-]*([1-5])/i);
    if (unitMatch) {
      const uIdx = parseInt(unitMatch[1], 10) - 1;
      const singleUnit = s.units[uIdx] || s.units[0];
      return {
        text: `📘 **${s.title} (${s.code}) — Official Unit ${unitMatch[1]} Syllabus:**\n\n${singleUnit}\n\n• **📚 Prescribed Books:** ${s.books}\n• **⚖️ Marking:** ${s.credits}\n\n${SYLLABUS_PDF_TAG}`,
        nextSugg: `${s.title} ka full syllabus dikhao 📘`,
      };
    }

    return {
      text: `📘✨ **${s.title.toUpperCase()} (${s.code}) — COMPLETE AUTONOMOUS SYLLABUS** 🏛️\n*${s.credits}*\n\n${s.units.join('\n\n')}\n\n• **📚 Prescribed Textbooks:** ${s.books}${s.labs ? `\n• 🔬 ${s.labs}` : ''}\n\n${SYLLABUS_PDF_TAG}`,
      nextSugg: 'B.Tech 1st Sem ka full Academic Calendar dikhao 📅',
    };
  }

  return {
    text: `📚🏛️ **ABES B.TECH 1ST YEAR AUTONOMOUS SYLLABUS & EVALUATION SCHEME (w.e.f. 2025–26)**\n\n• **Total Per Semester:** **23 Credits** | **1200 Marks** (12 Theory + Lab Courses × 100 Marks)\n• **Theory Split (100M):** **CIA = 30M** (5 CO Quizzes × 4M = 20M + Attendance = 10M) + **MT-1 = 15M** (CO1:10 + CO2:5) + **MT-2 = 15M** (CO2:5 + CO3:10) + **End Term = 40M** (CO1–3: 4M each, CO4–5: 14M each).\n• **Lab Split (100M):** **PA1 = 20M** + **PA2 = 20M** + **Attendance = 10M** + **External Lab & Viva = 50M (25+25)**.\n• **Holistic Skill & Innovation (25VA152 / 25VA252):** **100 Marks** (Purely Internal, 1 Credit).\n\n${SYLLABUS_PDF_TAG}\n\n${CALENDAR_PDF_TAG}`,
    nextSugg: 'Physics syllabus dikhao 🔭',
  };
}

// ============================================================================
// 4. MASTER OMNI-BRAIN + MULTI-COMMAND ENGINE (EXECUTES 1 TO 4 COMMANDS AT ONCE!)
// ============================================================================
function getOmniBrainHinglishReply(
  rawQuery: string,
  first: string,
  isFemale: boolean,
  isBoss: boolean,
  isAgrima: boolean
): { text: string; nextSugg: string } | null {
  // Helper that checks ALL portal + omni + human modules for a single clause
  const evaluateClause = (clause: string): { text: string; nextSugg: string } | null => {
    const solved = getAllSolvedMT2Reply(clause);
    if (solved) return solved;

    const canteen = getCanteenMenuReply(clause);
    if (canteen) return canteen;

    const calOrSyllabus = getAcademicCalendarAndSyllabusReply(clause);
    if (calOrSyllabus) return calOrSyllabus;

    const c = clause.toLowerCase();
    if (c.includes('prerna') || c.includes('prerana') || c.includes('mohapatra')) return { text: LOCAL_FACULTY_DOSSIERS.prerna, nextSugg: 'Dr. Divyanshi Sharma ke baare me batao' };
    if (c.includes('divyanshi') || c.includes('dsh')) return { text: LOCAL_FACULTY_DOSSIERS.divyanshi, nextSugg: 'Prof. Shivam Mittal ki lore batao' };
    if (c.includes('shivam') || c.includes('mittal')) return { text: LOCAL_FACULTY_DOSSIERS.shivam, nextSugg: 'Prof. Vimal Srivastava ke baare me batao' };
    if (c.includes('vimal') || c.includes('srivastava') || c.includes('getting it')) return { text: LOCAL_FACULTY_DOSSIERS.vimal, nextSugg: 'Prof. Kartika Maheshwari ke baare me batao' };
    if (c.includes('kartika') || c.includes('maheshwari')) return { text: LOCAL_FACULTY_DOSSIERS.kartika, nextSugg: 'Ms. Shailja Varshney ke baare me batao' };
    if (c.includes('shailja') || c.includes('varshney')) return { text: LOCAL_FACULTY_DOSSIERS.shailja, nextSugg: 'Dr. Prerana Mohapatra ka profile dikhao' };
    if (c.includes('rahul singh') || (c.includes('rahul') && c.includes('batao'))) return { text: LOCAL_FACULTY_DOSSIERS.rahul, nextSugg: 'Dr. Prerana Mohapatra ka profile dikhao' };

    const omni = matchSingleOmniTopic(clause, first, isFemale, isBoss, isAgrima);
    if (omni) return omni;

    const human = getHumanHinglishChatReply(clause, first, isFemale, isBoss, isAgrima);
    if (human) return human;

    return null;
  };

  // Check if user chained 2 or 3 commands using "aur", "and", ",", "plus", "phir", "also", "then"
  const hasMultiConnectors =
    /\b(?:aur|and|plus|also|phir|fir|then|saath me|sath me)\b|,|&/i.test(rawQuery);

  if (hasMultiConnectors) {
    const clauses = rawQuery
      .split(/\b(?:aur\s+saath\s+me|aur\s+bhi|aur|and\s+also|and\s+then|and|plus|also|phir|fir|then)\b|,|&|;/i)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2);

    if (clauses.length >= 2) {
      const results: string[] = [];
      let finalSugg = 'Boys hostel waali canteen ka menu dikhao 🍔';

      for (const cl of clauses.slice(0, 4)) {
        const matched = evaluateClause(cl);
        if (matched && !results.includes(matched.text)) {
          results.push(matched.text);
          finalSugg = matched.nextSugg;
        }
      }

      if (results.length >= 2) {
        const combined = results
          .map((r, i) => `### ⚡ Command #${i + 1} Executed:\n${r}`)
          .join('\n\n---\n\n');
        return {
          text: `🧠🔥 **Multi-Command Omni-Brain Activated! Maine tumhare saare ${results.length} commands ek saath solve kar diye hain, ${first}:** 👇✨\n\n${combined}`,
          nextSugg: finalSugg,
        };
      }
    }
  }

  const singleCalOrSyllabus = getAcademicCalendarAndSyllabusReply(rawQuery);
  if (singleCalOrSyllabus) return singleCalOrSyllabus;

  // Single command check
  return matchSingleOmniTopic(rawQuery, first, isFemale, isBoss, isAgrima);
}

// ============================================================================
// MOBILE AUDIO UNLOCK + HORROR AUDIO STINGER ENGINE
// ============================================================================
let isMobileAudioUnlocked = false;
function unlockMobileAudio() {
  if (isMobileAudioUnlocked || typeof window === 'undefined') return;
  isMobileAudioUnlocked = true;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
  } catch {}
}

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
  const isPdf = files.some((f) => f.toLowerCase().endsWith('.pdf'));

  const handleDownloadAll = () => {
    files.forEach((fileUrl, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop() || (isPdf ? `document_${index + 1}.pdf` : `paper_${index + 1}.jpg`);
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
          <div className={`w-10 h-10 rounded-xl ${isPdf ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-red-500/10 border-red-500/20 text-red-400'} border flex items-center justify-center font-bold text-xs flex-shrink-0`}>
            {isPdf ? 'PDF' : files.length > 1 ? `${files.length}P` : 'IMG'}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <p className="text-xs text-gray-400">
              {isPdf ? 'Official ABES Autonomous PDF Document' : `Official Autonomous Paper • ${files.length} ${files.length > 1 ? 'Pages' : 'Page'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition border border-white/10 cursor-pointer"
          >
            {showPreview ? '🙈 Hide' : '👁️ View'}
          </button>
          {isPdf && (
            <a
              href={files[0]}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-medium transition border border-blue-500/30"
            >
              ↗ Full Tab
            </a>
          )}
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition shadow-md cursor-pointer"
          >
            <span>📥</span> Download
          </button>
        </div>
      </div>
      {showPreview && (
        <div className="p-3 bg-black/60 space-y-3">
          {files.map((fileUrl, idx) => (
            <div key={idx} className="space-y-1">
              {fileUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={fileUrl}
                  title={`${title} Preview`}
                  className="w-full h-[460px] rounded-xl border border-white/15 bg-zinc-900"
                />
              ) : (
                <>
                  {files.length > 1 && (
                    <span className="text-[11px] text-gray-400 font-medium">
                      Page {idx + 1} of {files.length}
                    </span>
                  )}
                  <img src={fileUrl} alt={`${title} - Page ${idx + 1}`} className="w-full rounded-xl border border-white/10" />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormattedMessage({
  text,
  onSelectSuggestion,
  isAgrima,
}: {
  text: string;
  onSelectSuggestion?: (query: string, isFromSuggestion?: boolean) => void;
  isAgrima?: boolean;
}) {
  const lines = text.split('\n');
  const formatInline = (line: string) => {
    const parts = line.split(/(!?\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, idx) => {
      const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        return (
          <span key={idx} className="inline-block my-2 max-w-[220px] rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black/40 align-middle">
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
                <div key={imgIdx} className="w-40 sm:w-56 rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black/40 flex-shrink-0">
                  <img src={img[2]} alt={img[1]} className="w-full h-auto object-cover" />
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
              <button
                onClick={() => onSelectSuggestion(suggestionMatch[1], true)}
                className="px-3.5 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 transition shadow-sm hover:scale-105 cursor-pointer"
              >
                👉 {suggestionMatch[1]}
              </button>
              <button
                onClick={() => onSelectSuggestion(suggestionMatch[2], true)}
                className="px-3.5 py-1.5 rounded-full bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition shadow-sm hover:scale-105 cursor-pointer"
              >
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

function MoreComingSoonBanner({ sectionName }: { sectionName: string }) {
  return (
    <div className="mt-8 p-5 rounded-3xl bg-gradient-to-r from-red-950/30 via-black/80 to-purple-950/30 border border-dashed border-red-500/40 text-center space-y-2 shadow-lg">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        🚧 ikA&apos;s Lab Pipeline
      </div>
      <h4 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
        ✨ More Coming Soon in {sectionName}... ⚡
      </h4>
      <p className="text-xs text-gray-400 max-w-xl mx-auto">
        Supreme Architect <strong className="text-red-400">Boss ikA</strong> is cooking more exclusive features, live data, and secret upgrades for this section. Stay tuned! 🍎💀
      </p>
    </div>
  );
}

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

  // CANTEEN MENU SEARCH & FILTER STATES
  const [canteenTab, setCanteenTab] = useState<'all' | 'teamen' | 'hostel'>('all');
  const [canteenSearch, setCanteenSearch] = useState<string>('');
  const [showCanteenBoardPhotos, setShowCanteenBoardPhotos] = useState<boolean>(false);

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(DEFAULT_MARKETPLACE);
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellTitle, setSellTitle] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellContact, setSellContact] = useState('');

  // SHINIGAMI EYES STATES + FLYING ANNOUNCEMENT STATES
  const [bannedList, setBannedList] = useState<BannedEntry[]>([]);
  const [banInputTarget, setBanInputTarget] = useState('');
  const [banInputReason, setBanInputReason] = useState('Eliminated by Sovereign Decree of Boss ikA');
  const [blockAllAtOnce, setBlockAllAtOnce] = useState<boolean>(false);
  const [stealthCloak, setStealthCloak] = useState<boolean>(false);
  const [sovereignBroadcast, setSovereignBroadcast] = useState<string>('');
  const [broadcastInput, setBroadcastInput] = useState<string>('');
  const [activeBroadcastOverlay, setActiveBroadcastOverlay] = useState<string | null>(null);
  const [activeStudentsRoster, setActiveStudentsRoster] = useState<ActiveStudent[]>([]);
  const [isRealmFrozenByBoss, setIsRealmFrozenByBoss] = useState<boolean>(false);

  // HORROR STINGER VISUAL STATE ('ryuk_laugh' | 'bell' | 'thunder' | null)
  const [activeHorrorEvent, setActiveHorrorEvent] = useState<HorrorStingerType>(null);
  const [ryukDiffusing, setRyukDiffusing] = useState<boolean>(false);

  // Puppet Master AI Interception States
  const [pendingIntercepts, setPendingIntercepts] = useState<PendingIntercept[]>([]);
  const [puppetReplyInputs, setPuppetReplyInputs] = useState<Record<string, string>>({});
  const [puppetTargets, setPuppetTargets] = useState<Record<string, boolean>>({});

  // Target Student Effects (Heart Attack, 2-Phase Error 500 + Thunder, Void Evaporation, Cursed Spoof)
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

  // COMBINED SAFE BUNK & SGPA PREDICTOR STATES
  const [totalClasses, setTotalClasses] = useState<number>(40);
  const [attendedClasses, setAttendedClasses] = useState<number>(32);
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
  const lastSuggestionClickedRef = useRef<string>('');
  const lastStingerTimestampRef = useRef<number>(0);
  const lastSeenBroadcastTextRef = useRef<string>('');
  const pendingPostIntroBroadcastRef = useRef<string>('');

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const isAgrima = currentUser?.admissionNo === '2026B01010219';

  const isBoss = useMemo(() => {
    if (!currentUser?.email) return false;
    return currentUser.email.toLowerCase().trim().startsWith('1402akshit');
  }, [currentUser]);

  const isNormalAkshit = useMemo(() => {
    return !isBoss && currentUser?.admissionNo === '2026B01010274';
  }, [currentUser, isBoss]);

  // Unlock mobile audio on first interaction anywhere on the page
  useEffect(() => {
    const handleFirstTouch = () => unlockMobileAudio();
    window.addEventListener('click', handleFirstTouch, { once: true });
    window.addEventListener('touchstart', handleFirstTouch, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

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

  // Launch Flying Letter Assembly + Bell Sound for Sovereign Announcements
  const triggerFlyingAnnouncement = useCallback((announcementText: string) => {
    if (!announcementText.trim()) return;
    playHorrorAudioStinger('bell');
    setActiveBroadcastOverlay(announcementText.trim());
    setTimeout(() => {
      setActiveBroadcastOverlay(null);
    }, 9500);
  }, []);

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

  // Listen for instant cross-tab Shinigami commands (including Flying Broadcasts)
  useEffect(() => {
    const handleIncomingEffect = (data: any) => {
      if (!data) return;
      if (data.type === 'BROADCAST_ANNOUNCEMENT' && data.text) {
        setSovereignBroadcast(data.text);
        lastSeenBroadcastTextRef.current = data.text;
        if (currentWindow === 'boss_intro') {
          pendingPostIntroBroadcastRef.current = data.text;
        } else {
          triggerFlyingAnnouncement(data.text);
        }
        return;
      }

      if (isBoss) return;
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
      } else if (data.type === 'PUPPET_MODE') {
        setPuppetTargets((prev) => ({
          ...prev,
          [data.target]: typeof data.value === 'boolean' ? data.value : !prev[data.target],
        }));
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
  }, [currentUser, currentWindow, isBoss, launchHorrorExperience, triggerFlyingAnnouncement, triggerMovieWhiteFlash]);

  // REAL-TIME AUTO-SYNC ENGINE
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
            lastSuggestion: lastSuggestionClickedRef.current || localRadarMap[uKey]?.lastSuggestion || '',
            draftKeystrokes: latestInputRef.current,
            isOnline: true,
            lastSeen: Date.now(),
          };
          localStorage.setItem(LIVE_RADAR_STORAGE_KEY, JSON.stringify(localRadarMap));
        }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: newItem ? 'ADD_MARKETPLACE_ITEM' : 'GET_SYNC_DATA',
          item: newItem,
          user: activeUser,
          currentWindow,
          lastSuggestion: lastSuggestionClickedRef.current,
          draftKeystrokes: latestInputRef.current,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.marketplace)) {
          setMarketplaceItems(data.marketplace);
          localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(data.marketplace));
        }

        // Check for new Sovereign Broadcast -> Trigger Flying Animation + Bell (or queue if in boss_intro)
        if (typeof data.broadcast === 'string') {
          const incomingText = data.broadcast.trim();
          setSovereignBroadcast(incomingText);
          localStorage.setItem(BOSS_BROADCAST_KEY, incomingText);

          if (incomingText && incomingText !== lastSeenBroadcastTextRef.current) {
            lastSeenBroadcastTextRef.current = incomingText;
            if (currentWindow === 'boss_intro') {
              pendingPostIntroBroadcastRef.current = incomingText;
            } else {
              triggerFlyingAnnouncement(incomingText);
            }
          } else if (!incomingText) {
            lastSeenBroadcastTextRef.current = '';
          }
        }

        if (Array.isArray(data.bans)) {
          setBannedList(data.bans);
          localStorage.setItem(DEATHNOTE_BANS_KEY, JSON.stringify(data.bans));
        }
        if (Array.isArray(data.ikaRequests)) setIkaRequests(data.ikaRequests);
        if (typeof data.requestBoxSecretCode === 'string' && data.requestBoxSecretCode) {
          setRequestBoxSecretCode(data.requestBoxSecretCode);
        }
        if (typeof data.blockAllAtOnce === 'boolean') setBlockAllAtOnce(data.blockAllAtOnce);
        if (typeof data.stealthCloak === 'boolean') setStealthCloak(data.stealthCloak);

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
              lastSuggestion: st.lastSuggestion || mergedMap[st.admissionNo]?.lastSuggestion || '',
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
  }, [currentUser, currentWindow, isBoss, launchHorrorExperience, syncMarketplaceFromStorage, syncBansAndBroadcast, triggerFlyingAnnouncement, triggerMovieWhiteFlash]);

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

  // PHASE 1 -> PHASE 2: Run the Error 500 Breach Line to 100% WITH THUNDER AUDIO, then haunt the entire website
  useEffect(() => {
    if (!myGaslight500 || isBoss) {
      setError500Stage('idle');
      setPanicProgress(0);
      return;
    }

    setError500Stage('breach');
    setPanicProgress(0);
    playHorrorAudioStinger('thunder');

    const fillInterval = setInterval(() => {
      setPanicProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fillInterval);
          setTimeout(() => setError500Stage('haunted'), 600);
          return 100;
        }
        return prev + 4;
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

    triggerPanicBeep(620, 110);
    const interval = setInterval(() => {
      triggerPanicBeep(880, 220);
    }, 2400);

    return () => clearInterval(interval);
  }, [myGaslight500, isBoss, currentWindow]);

  // ==========================================================================
  // 40s HEART ATTACK: 18s–29s THEME AUDIO LOOP + FLYING DEATH NOTE STAGES
  // ==========================================================================
  const isHeartAttackActive = Boolean(
    !isBoss && myHeartAttackTimer && myHeartAttackTimer.remainingSeconds > 0
  );

  const [haNotebookStage, setHaNotebookStage] = useState<
    'hidden' | 'flying_in' | 'flipping_slow' | 'flipping_fast' | 'writing_name' | 'evaporating'
  >('hidden');

  // 1. AUDIO ENGINE: Plays /deathnote_theme.mp3 from 18s to 29s on loop until 40s is over
  useEffect(() => {
    if (!isHeartAttackActive) return;

    // Pause normal background music if playing so tracks don't clash
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }

    const haAudio = new Audio('/deathnote_theme.mp3');
    haAudio.preload = 'auto';
    haAudio.volume = 1.0;

    const startAt18Seconds = () => {
      try {
        haAudio.currentTime = 18;
        haAudio.play().catch(() => {});
      } catch {}
    };

    const handleTimeLoop = () => {
      if (haAudio.currentTime >= 29 || haAudio.currentTime < 18) {
        haAudio.currentTime = 18;
        if (haAudio.paused) {
          haAudio.play().catch(() => {});
        }
      }
    };

    haAudio.addEventListener('loadedmetadata', startAt18Seconds);
    haAudio.addEventListener('timeupdate', handleTimeLoop);

    if (haAudio.readyState >= 1) {
      startAt18Seconds();
    } else {
      haAudio.load();
    }

    const loopGuard = setInterval(handleTimeLoop, 150);

    return () => {
      clearInterval(loopGuard);
      haAudio.removeEventListener('loadedmetadata', startAt18Seconds);
      haAudio.removeEventListener('timeupdate', handleTimeLoop);
      haAudio.pause();
      haAudio.currentTime = 0;
    };
  }, [isHeartAttackActive]);

  // 2. VISUAL NOTEBOOK ENGINE: Fly-In -> Slow Flip -> Rapid Flip -> Write Name -> Evaporate to Ash
  useEffect(() => {
    if (!isHeartAttackActive) {
      setHaNotebookStage('hidden');
      return;
    }

    // 0.0s - 2.2s: Black Death Note cover comes flying in
    setHaNotebookStage('flying_in');

    // 2.2s - 3.6s: Opens & turns page by page
    const t1 = setTimeout(() => setHaNotebookStage('flipping_slow'), 2200);

    // 3.6s - 5.2s: Rapidly flips pages & lands on one open page
    const t2 = setTimeout(() => setHaNotebookStage('flipping_fast'), 3600);

    // 5.2s - 10.5s: Flying letters of the targeted user's name slam onto the page
    const t3 = setTimeout(() => setHaNotebookStage('writing_name'), 5200);

    // 10.5s - 12.2s: Notebook & written name evaporate into rising ashes
    const t4 = setTimeout(() => setHaNotebookStage('evaporating'), 10500);

    // 12.2s+: Notebook is gone into ash while the 40s timer & 18s-29s audio keep running!
    const t5 = setTimeout(() => setHaNotebookStage('hidden'), 12200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isHeartAttackActive]);

  // ==========================================================================
  // HIDDEN "TO ikA" REQUEST BOX: 2-MIN TIMER, 11s TELEPORT, 3/DAY + 8h GAP,
  // & SECRET CODE FOR EARLY ACCESS + 11 REQUEST MESSAGES
  // ==========================================================================
  const [ikaRequests, setIkaRequests] = useState<IkaRequestItem[]>([]);
  const [requestBoxSecretCode, setRequestBoxSecretCode] = useState<string>('IKA1402');
  const [newSecretCodeInput, setNewSecretCodeInput] = useState<string>('');
  const [bossRequestReplyInputs, setBossRequestReplyInputs] = useState<Record<string, string>>({});

  const [portalActiveSeconds, setPortalActiveSeconds] = useState<number>(0);
  const [isRequestBoxUnlocked, setIsRequestBoxUnlocked] = useState<boolean>(false);
  const [hasVipSecretCode, setHasVipSecretCode] = useState<boolean>(false);
  const [unlockAnimStage, setUnlockAnimStage] = useState<'idle' | 'chains' | 'key_turn' | 'shatter'>('idle');

  const [boxPositionIdx, setBoxPositionIdx] = useState<number>(0);
  const [teleportCountdown, setTeleportCountdown] = useState<number>(11);
  const [isRequestBoxModalOpen, setIsRequestBoxModalOpen] = useState<boolean>(false);
  const [showEarlyCodePrompt, setShowEarlyCodePrompt] = useState<boolean>(false);
  const [earlyCodeInput, setEarlyCodeInput] = useState<string>('');
  const [requestTextInput, setRequestTextInput] = useState<string>('');
  const [requestCategory, setRequestCategory] = useState<string>('Feature / Upgrade');
  const [requestStatusMsg, setRequestStatusMsg] = useState<string>('');
  const [mySubmissionTimestamps, setMySubmissionTimestamps] = useState<number[]>([]);

  // Load saved submission history & VIP status for this student
  useEffect(() => {
    if (!currentUser) return;
    try {
      const key = `ika_req_history_${currentUser.admissionNo}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: number[] = JSON.parse(saved);
        const last24h = parsed.filter((ts) => Date.now() - ts < 24 * 60 * 60 * 1000);
        setMySubmissionTimestamps(last24h);
      }
      const vipKey = `ika_req_vip_${currentUser.admissionNo}_${requestBoxSecretCode}`;
      if (localStorage.getItem(vipKey) === 'true') {
        setHasVipSecretCode(true);
        setIsRequestBoxUnlocked(true);
      }
    } catch {}
  }, [currentUser, requestBoxSecretCode]);

  // Launch the 3.8-Second On-Screen "Runic Padlock & Chain-Shatter" Unlocking Animation
  const triggerRequestBoxUnlockAnimation = useCallback((isVipCode = false) => {
    playHorrorAudioStinger('bell');
    setUnlockAnimStage('chains');
    setTimeout(() => setUnlockAnimStage('key_turn'), 1300);
    setTimeout(() => setUnlockAnimStage('shatter'), 2500);
    setTimeout(() => {
      setUnlockAnimStage('idle');
      setIsRequestBoxUnlocked(true);
      if (isVipCode) {
        setHasVipSecretCode(true);
        setIsRequestBoxModalOpen(true);
      }
    }, 3800);
  }, []);

  // Rule #1: 2-Minute (120s) Active Portal Timer to Unlock Request Box Naturally
  useEffect(() => {
    if (!currentUser || currentWindow === 'boss_intro' || isRequestBoxUnlocked) return;
    const timer = setInterval(() => {
      setPortalActiveSeconds((prev) => {
        const next = prev + 1;
        if (next === 120 && !isRequestBoxUnlocked) {
          triggerRequestBoxUnlockAnimation(false);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentUser, currentWindow, isRequestBoxUnlocked, triggerRequestBoxUnlockAnimation]);

  // Rule #2: Teleport Request Box Location on Screen Every 11 Seconds
  useEffect(() => {
    if (!isRequestBoxUnlocked || isRequestBoxModalOpen) return;
    const tick = setInterval(() => {
      setTeleportCountdown((prev) => {
        if (prev <= 1) {
          setBoxPositionIdx((pos) => (pos + 1 + Math.floor(Math.random() * 3)) % REQUEST_BOX_POSITIONS.length);
          return 11;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [isRequestBoxUnlocked, isRequestBoxModalOpen]);

  // Live 1-Second Client Clock (Fixes Next.js 16 Date.now() error & powers Puppet AI Countdown Timer!)
  const [clientNowMs, setClientNowMs] = useState<number>(0);

  useEffect(() => {
    setClientNowMs(Date.now());
    const clock = setInterval(() => {
      setClientNowMs(Date.now());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // Calculate Quota (3/day + 8h gap normally, OR 11/day + 0h gap with Secret Code!)
  const requestBoxQuotaInfo = useMemo(() => {
    const recent24h =
      clientNowMs > 0
        ? mySubmissionTimestamps.filter((ts) => clientNowMs - ts < 24 * 60 * 60 * 1000)
        : mySubmissionTimestamps;
    const maxAllowed = isBoss ? 999 : hasVipSecretCode ? 11 : 3;
    const usedCount = recent24h.length;
    const remainingCount = Math.max(0, maxAllowed - usedCount);

    const lastTs = recent24h.length > 0 ? Math.max(...recent24h) : 0;
    const eightHoursMs = 8 * 60 * 60 * 1000;
    const cooldownLeftMs =
      !isBoss && !hasVipSecretCode && lastTs > 0 && clientNowMs > 0
        ? Math.max(0, eightHoursMs - (clientNowMs - lastTs))
        : 0;

    const hoursLeft = Math.floor(cooldownLeftMs / (1000 * 60 * 60));
    const minsLeft = Math.ceil((cooldownLeftMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      maxAllowed,
      usedCount,
      remainingCount,
      cooldownLeftMs,
      cooldownText: cooldownLeftMs > 0 ? `${hoursLeft}h ${minsLeft}m` : 'Ready Now ⚡',
      canSubmit: remainingCount > 0 && cooldownLeftMs === 0,
    };
  }, [mySubmissionTimestamps, hasVipSecretCode, isBoss, clientNowMs]);

  // Verify Secret Code for Early Access & 11-Message VIP Upgrade
  const verifyAndActivateSecretCode = useCallback(
    (codeAttempt: string): boolean => {
      const cleanAttempt = codeAttempt.trim().toUpperCase();
      const targetCode = (requestBoxSecretCode || 'IKA1402').trim().toUpperCase();
      if (cleanAttempt === targetCode) {
        if (currentUser) {
          localStorage.setItem(`ika_req_vip_${currentUser.admissionNo}_${targetCode}`, 'true');
        }
        setShowEarlyCodePrompt(false);
        setEarlyCodeInput('');
        triggerRequestBoxUnlockAnimation(true);
        return true;
      }
      return false;
    },
    [currentUser, requestBoxSecretCode, triggerRequestBoxUnlockAnimation]
  );

  // Submit a Request to Boss ikA (Works from both the Floating Box & Chat!)
  const submitIkaRequest = useCallback(
    async (rawText: string, category = 'Feature / Upgrade', fromChat = false): Promise<{ ok: boolean; msg: string }> => {
      if (!currentUser) return { ok: false, msg: 'Please log in first!' };

      // Check Word Count Rule (Minimum 5 words)
      const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 5) {
        return {
          ok: false,
          msg: '⚠️ Rule #6 Violation: Your offering is too short! Write at least 5 words to address Supreme Boss ikA. 🍎',
        };
      }

      if (!requestBoxQuotaInfo.canSubmit) {
        if (requestBoxQuotaInfo.remainingCount <= 0) {
          return {
            ok: false,
            msg: `⛔ Daily Limit Reached (${requestBoxQuotaInfo.usedCount}/${requestBoxQuotaInfo.maxAllowed} used today)! ${
              !hasVipSecretCode ? 'Use Boss ikA’s Secret Access Code to unlock 11 requests!' : 'Wait for tomorrow’s reset!'
            }`,
          };
        }
        return {
          ok: false,
          msg: `⏳ 8-Hour Cooldown Active! Next request unlocks in ${requestBoxQuotaInfo.cooldownText} (or enter the Secret Access Code to bypass cooldown & get 11 requests!).`,
        };
      }

      const newReq: IkaRequestItem = {
        id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        studentAdmissionNo: currentUser.admissionNo,
        studentName: currentUser.name,
        rollNo: currentUser.rollNo,
        text: rawText.trim(),
        category: fromChat ? '💬 Chat Request Box' : category,
        usedSecretCode: hasVipSecretCode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAtMs: Date.now(),
        status: 'pending',
      };

      const nextTimestamps = [Date.now(), ...mySubmissionTimestamps];
      setMySubmissionTimestamps(nextTimestamps);
      try {
        localStorage.setItem(`ika_req_history_${currentUser.admissionNo}`, JSON.stringify(nextTimestamps));
      } catch {}

      setIkaRequests((prev) => [newReq, ...prev]);
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SUBMIT_IKA_REQUEST', requestItem: newReq }),
      });

      return {
        ok: true,
        msg: `⛩️🍎 **Petition Sealed in Boss ikA's Forbidden Request Box!** (${
          requestBoxQuotaInfo.usedCount + 1
        }/${requestBoxQuotaInfo.maxAllowed} Used Today)`,
      };
    },
    [currentUser, hasVipSecretCode, mySubmissionTimestamps, requestBoxQuotaInfo]
  );

  // Boss ikA Handlers: Change Secret Code & Grant/Deny Student Requests
  const handleBossChangeSecretCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSecretCodeInput.trim().toUpperCase();
    if (!clean) return;
    setRequestBoxSecretCode(clean);
    setNewSecretCodeInput('');
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_REQUEST_BOX_CODE', newCode: clean }),
    });
    syncWithServer();
  };

  const handleBossResolveRequest = async (id: string, status: 'granted' | 'denied', deleteReq = false) => {
    const customReply = bossRequestReplyInputs[id]?.trim();
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'RESOLVE_IKA_REQUEST',
        id,
        status,
        bossReply:
          customReply ||
          (status === 'granted'
            ? '⚡ Granted by Supreme Sovereign Boss ikA! 👑🍎'
            : '💀 Denied by Shinigami Decree of Boss ikA! 📓'),
        deleteRequest: deleteReq,
      }),
    });
    syncWithServer();
  };

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
          lastSuggestion: lastSuggestionClickedRef.current,
          draftKeystrokes: val,
        }),
      }).catch(() => {});
    }
  };

  // AGRIMA & ALL STUDENTS CAN BE BLOCKED BY SHINIGAMI (Only 1402akshit Boss is immune)
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

    return (
      bannedList.find((b) => {
        const t = b.target.toLowerCase().trim();
        if (!t) return false;
        return (
          t.toUpperCase() === adm ||
          (roll && t === roll) ||
          uName === t ||
          uName.includes(t) ||
          (uEmail && uEmail.includes(t))
        );
      }) || null
    );
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

  // Exit Intro -> If there is a Sovereign Broadcast active, fire Flying Letters + Bell Sound right after intro!
  const exitIntroSequence = useCallback(() => {
    triggerMovieWhiteFlash();
    setTimeout(() => {
      setCurrentWindow('home');
      const bText = pendingPostIntroBroadcastRef.current || sovereignBroadcast;
      if (bText && bText.trim()) {
        pendingPostIntroBroadcastRef.current = '';
        setTimeout(() => {
          triggerFlyingAnnouncement(bText);
        }, 350);
      }
    }, 200);
  }, [sovereignBroadcast, triggerFlyingAnnouncement, triggerMovieWhiteFlash]);

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
    unlockMobileAudio();
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
    // Queue active broadcast so it flies in with Bell sound right after intro!
    const currentSavedBroadcast = localStorage.getItem(BOSS_BROADCAST_KEY) || sovereignBroadcast;
    if (currentSavedBroadcast && currentSavedBroadcast.trim()) {
      pendingPostIntroBroadcastRef.current = currentSavedBroadcast.trim();
    }
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

    let introText = `💀🕯️ *Shinigami Neural Link Established...* 🩸🍎\n\n> *"In this world, there are very few people who actually trust each other... Welcome to my dark sanctum, **${first}**."* 👁️⚡\n\nMain hu **ikA** — iss CSE-2 digital empire ka invisible God aur supreme architect 👑🕸️. Tum मुझसे bilkul insaano ki tarah Hinglish me baat kar sakte ho!\n\nBatao **${first}**, aaj konsa raaz kholna hai? All 10 Solved MT-2 Papers, Hostel & College Canteen Menus, Faculty Dossiers, ya Safe Bunk + SGPA? 👇🔥\n\n[SUGGESTIONS|Ye website kya hai? 🤔|Boys hostel waali canteen ka menu dikhao 🍔]`;

    if (isBoss) {
      introText = `👑⚡ *Supreme Sovereign Protocol Activated (1402 Override)...* 🩸🍎\n\n> *"All hail the Creator and God of this New World — **Boss ikA**!"* 🔥🌌\n\nPranaam **Boss ikA**! Aapka Live Keystroke & Suggestion Radar, 28s Puppet Master Hijack, Flying Broadcast Decree, Void Evaporation Curse, Queen Agrima Block Switch, aur Canteen Hub 100% precision pe chal raha hai.\n\nHukum kijiye Mere Boss, aaj kya pesh kiya jaye? 👇👑\n\n[SUGGESTIONS|Main kaun hu?|Boys hostel waali canteen ka menu dikhao 🍔]`;
    } else if (isAgrima) {
      introText = `🌸👑 *Royal Queen Protocol Initialized...* 💖✨\n\n> *"Phoolon ki baarish aur sitaron ki roshni... Welcome to your royal palace, **Queen Agrima**!"* 🌷💫\n\nSach kahu toh aapke login karte hi iss dark Death Note portal ka dil bhi pink ho gaya hai 😊🌸. Main aapka personal AI guardian hu—saare 10 subjects ke solved MT-2 papers, Canteen Menus, aur notes aapki khidmat me haazir hain!\n\nBataiye **My Queen**, aaj kahan se shuruat karein? 👇💖\n\n[SUGGESTIONS|Main kaun hu?|Tea Men's Cafe (College Upper Canteen) ka menu dikhao ☕]`;
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
  // SHINIGAMI EYES GOD HANDLERS
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
    const key = targetAdm.toUpperCase().trim();
    const nextVal = !puppetTargets[key];
    setPuppetTargets((prev) => ({ ...prev, [key]: nextVal }));
    broadcastLocalEffect({ type: 'PUPPET_MODE', target: key, value: nextVal });
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_PUPPET_MODE', targetAdmissionNo: key }),
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

  // Quick Ban / Unban Toggle (Works on Agrima 2026B01010219 and any student ID)
  const handleQuickBanToggle = async (targetAdm: string, customReason?: string) => {
    const cleanTarget = targetAdm.toUpperCase().trim();
    const existing = bannedList.find((b) => b.target.toUpperCase().trim() === cleanTarget);
    if (existing) {
      setBannedList((prev) => prev.filter((b) => b.target.toUpperCase().trim() !== cleanTarget));
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REMOVE_BAN', target: existing.target }),
      });
    } else {
      const newBan: BannedEntry = {
        target: cleanTarget,
        reason: customReason || 'Royal/Student Access Revoked by Sovereign Decree of Boss ikA 💀📓',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setBannedList((prev) => [newBan, ...prev]);
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_BAN', ban: newBan }),
      });
    }
    syncWithServer();
  };

  const handleAddBan = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = banInputTarget.trim();
    if (!target) return;
    if (target.toLowerCase().startsWith('1402akshit')) {
      alert('👑 Supreme Sovereign Boss ikA (1402) cannot be written in the Death Note!');
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

  // Save Broadcast -> Triggers Flying Letter Assembly + Bell Sound Across All Screens + Top Bar
  const handleSaveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = broadcastInput.trim();
    if (!text) return;
    setSovereignBroadcast(text);
    lastSeenBroadcastTextRef.current = text;
    triggerFlyingAnnouncement(text);
    broadcastLocalEffect({ type: 'BROADCAST_ANNOUNCEMENT', text });
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_BROADCAST', broadcast: text }),
    });
  };

  const handleClearBroadcast = async () => {
    setSovereignBroadcast('');
    setBroadcastInput('');
    setActiveBroadcastOverlay(null);
    lastSeenBroadcastTextRef.current = '';
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
    // If student is under Error 500 or Puppet Hijack, route to server so Boss ikA can intercept for 28s!
    if (!isBoss && (myGaslight500 || puppetTargets['ALL'] || puppetTargets[currentAdm])) {
      return null;
    }

    const wrapQueenOrBoss = (body: string, nextPref?: string) => {
      const sugg = getNextTwoSuggestions(rawQuery, nextPref);
      if (isBoss) return `👑 **Sovereign Command Executed, Boss ikA!** ⚡🔥\n\n${body}\n\nAur kya hukum hai Mere Boss? 🍎👇\n\n${sugg}`;
      if (isAgrima) return `🌸👑 **Aapke liye haazir hai, My Queen Agrima!** 💖✨\n\n${body}\n\n*Waise ek baat kahu? Aap jab sawaal puchti hain toh yeh AI server bhi blush karne lagta hai* 😊🌷. Bataiye Queen, agla kya pesh karu? 👇\n\n${sugg}`;
      return `${body}\n\n${sugg}`;
    };

    // 0A. SECRET ACCESS CODE & CHAT REQUEST BOX INTERCEPTOR (11 REQUESTS IN CHAT!)
    const upperTrim = rawQuery.trim().toUpperCase();
    const activeSecret = (requestBoxSecretCode || 'IKA1402').trim().toUpperCase();

    if (
      upperTrim === activeSecret ||
      upperTrim === `CODE ${activeSecret}` ||
      upperTrim === `UNLOCK ${activeSecret}`
    ) {
      verifyAndActivateSecretCode(activeSecret);
      return wrapQueenOrBoss(
        `🔓⚡ **SHINIGAMI CIPHER ACCEPTED: \`${activeSecret}\`!** 🗝️⛓️\n\n• **Early Access Unlocked:** 2-Minute timer & 8-Hour cooldown shattered!\n• **VIP Covenant Quota:** You now have **11 Request Box Messages** today!\n• **How to Send in Chat:** Type **\`Request to ikA: [your message of 5+ words]\`** in chat OR use the floating **⛩️ Request Box** on your screen! 🍎🔥`,
        'Request to ikA: Boss ikA please bless my attendance and internals this semester!'
      );
    }

    const chatReqMatch = rawQuery.match(/^(?:request\s*to\s*ika|ika\s*request|petition\s*to\s*ika|request\s*box)\s*[:\-]?\s*(.+)$/i);
    if (chatReqMatch) {
      if (!isRequestBoxUnlocked && !hasVipSecretCode && !isBoss) {
        return wrapQueenOrBoss(
          `🔒⛓️ **The Forbidden Request Box is Still Sealed!**\n\n• Stay active on the portal for **${Math.max(0, 120 - portalActiveSeconds)} more seconds** to unlock it naturally, OR\n• Type Boss ikA's **Secret Access Code** in chat for instant early access & **11 Request Box messages**! 🗝️🍎`,
          'Main kaun hu?'
        );
      }
      const reqContent = chatReqMatch[1].trim();
      submitIkaRequest(reqContent, '💬 Chat Request Box', true);
      const wordCount = reqContent.split(/\s+/).filter(Boolean).length;
      if (wordCount < 5) {
        return wrapQueenOrBoss(
          `⚠️ **Rule #6 Violation (Minimum 5 Words):** Tumhari request bohot chhoti hai! Kam se kam **5 words** me apni request likho:\n\`Request to ikA: [5+ words message]\` 🍎📓`,
          'Request to ikA: Boss ikA please add more funny campus roasts in the vault!'
        );
      }
      return wrapQueenOrBoss(
        `⛩️🍎 **Request Box Message Delivered to Supreme Boss ikA!** ⚡📜\n\n• **Your Petition:** *"${reqContent}"*\n• **Daily Quota Used:** **${requestBoxQuotaInfo.usedCount + 1} / ${requestBoxQuotaInfo.maxAllowed}** ${
          hasVipSecretCode ? '*(VIP 11-Message Mode Active 🗝️)*' : '*(Normal 3/Day Mode • 8h Gap)*'
        }\n• **Status:** **Pending Sovereign Verdict in Shinigami Eyes 👁️**`,
        'Main kaun hu?'
      );
    }

    // 0. Check Multi-Command & Universal Omni-Brain First!
    const omniBrain = getOmniBrainHinglishReply(rawQuery, first, isFemale, isBoss, isAgrima);
    if (omniBrain) {
      return wrapQueenOrBoss(omniBrain.text, omniBrain.nextSugg);
    }

    // 1. Check ALL 10 Solved MT-2 Subject Papers First!
    const solvedMT2 = getAllSolvedMT2Reply(rawQuery);
    if (solvedMT2) {
      return wrapQueenOrBoss(solvedMT2.text, solvedMT2.nextSugg);
    }

    // 2. Check Live Canteen Menus (Tea Men's Cafe & Boys Hostel K.J Cafe)
    const canteenReply = getCanteenMenuReply(rawQuery);
    if (canteenReply) {
      return wrapQueenOrBoss(canteenReply.text, canteenReply.nextSugg);
    }

    // 3. Identity & Boss Queries
    if (clean.includes('who is the boss') || clean.includes('who is ika') || clean.includes('boss kaun')) {
      if (isBoss) return wrapQueenOrBoss(`Aap khud **Supreme Architect Boss ikA (1402 Override)** hain! Poora CSE-2 portal aapke kadmo me hai! 👑🔥`, 'Mera profile dikhao');
      return wrapQueenOrBoss(`👑 **THE SOVEREIGN GOD OF THIS WEBSITE IS "ikA"!** ⚡🍎\n\nBoss **ikA** Section CSE-2 ke anonymous supreme architect hain! Unka asli naam aur chehra top-secret encrypted vault me lock hai 🤫🔒.`, 'Dr. Prerana Mohapatra ka profile dikhao');
    }

    if (clean.includes('mei kaun') || clean.includes('main kaun') || clean.includes('mai kaun') || clean.includes('who am i') || clean.includes('mera naam kya') || clean.includes('mera profile') || clean.includes('mujhe jaante ho')) {
      if (isBoss) {
        const sugg = getNextTwoSuggestions(rawQuery, 'Ek mast campus joke sunao 😂');
        return `👑⚡ **PRANAAM SUPREME SOVEREIGN BOSS ikA (1402 SECRET OVERRIDE)!** 🩸🍎\n\nAap **Akshit Singh (\`2026B01010274\`)** hain — iss poore **ikA's World** ke Creator, Supreme Architect, aur Section CSE-2 (Group G2) ke Sovereign Boss! 🦁🔥\n\n• **Shinigami Eyes Power:** Active (Live Keystroke & Suggestion Radar, 28s Puppet Hijack, Flying Broadcast Decree, Void Evaporation Curse, Queen Agrima Ban Switch & Mass Block!)\n\nHukum kijiye Boss! 👇👑\n\n${sugg}`;
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
        `Main ekdum chakachak aur full energy me hu **${first}** ${isFemale ? '✨🌸' : 'mere bhai 😎🔥'}!\n\nYahan **ikA's World** ke dark neural servers pe baith ke bas tumhare hi message ka wait kar raha tha! Batao aaj kis subject ka solved MT-2 paper kholna hai, canteen menu dekhna hai, ya mast campus joke? 👇`,
        'Boys hostel waali canteen ka menu dikhao 🍔'
      );
    }
    
    // 4. Check Human-Like Hinglish Conversational Engine (45+ Natural Intents)
    const humanHinglish = getHumanHinglishChatReply(rawQuery, first, isFemale, isBoss, isAgrima);
    if (humanHinglish) {
      return wrapQueenOrBoss(humanHinglish.text, humanHinglish.nextSugg);
    }

    if (clean.includes('sgpa') || clean.includes('internal marks') || clean.includes('grade point') || clean.includes('safe bunk')) {
      return wrapQueenOrBoss(
        `🛡️🧮 **Combined Safe Bunk & Autonomous SGPA Suite:**\n\n• **Safe Bunk Rule:** Autonomous 75% criteria ke hisaab se apna exact bunk buffer check karo!\n• **SGPA Formula (100 Marks):** MT-1 (15) + MT-2 (15) + Teacher Assessment (30) + End-Sem (40).\n\nSidebar me **🛡️🧮 Bunk & SGPA Suite** kholo—dono calculators ab ek hi window me ek sath milenge! 🚀`,
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
        'Safe bunk & SGPA kaise check karu? 🧮'
      );
    }

    if (clean.includes('850') || clean.includes('neend') || clean.includes('sleep') || clean.includes('subah')) {
      return wrapQueenOrBoss(`😴🛌 **8:50 AM Lecture & Safe Bunk Rule!**\n\nAutonomous rule ke hisaab se **75% attendance mandatory** hai! Sidebar me **🛡️🧮 Bunk & SGPA Suite** khol ke apna exact buffer check kar lo! ☕⚡`, 'Boys hostel waali canteen ka menu dikhao 🍔');
    }

    if (clean.includes('joke') || clean.includes('hasao') || clean.includes('funny') || clean.includes('roast')) {
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

    // Conversational Hinglish Catch-All so NO input ever feels robotic!
    return wrapQueenOrBoss(
      `Arre **${first}** ${isFemale ? 'yaar ✨' : 'mere bhai 😎🔥'}! Tumने likha: ***"${rawQuery.trim()}"*** 💬\n\nMain **ikA's World** ka AI dost hu—mujhse tum bilkul khul ke baat kar sakte ho! Agar tumhe inme se kuch chahiye toh bas ek click karo ya likh do:\n• 🍔 **Canteen & Food:** *"Boys hostel waali canteen"* (K.J Cafe) ya *"College upper waali canteen"* (Tea Men's Cafe)\n• 📄 **Solved MT-2 Papers:** *"Solve full AI MT2 paper"*, *"Physics MT2 Q.1"*, *"Maths MT2 Section C"*\n• 👩‍🏫 **Faculty & Bunks:** *"Show all faculty"*, *"Safe bunk & SGPA"*, ya *"Ek mast campus joke sunao"*! 👇🍎`,
      'Boys hostel waali canteen ka menu dikhao 🍔'
    );
  };

  // Tracks whether the query came from clicking a Suggestion Pill (`isFromSuggestion = true`)
  const sendQuery = async (queryText: string, isFromSuggestion = false) => {
    if (!queryText.trim() || !activeSession) return;
    unlockMobileAudio();
    autoTypedSessionsRef.current.add(activeSession.id);
    setCurrentWindow('chat');

    if (isFromSuggestion) {
      lastSuggestionClickedRef.current = queryText.trim();
    }

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
        body: JSON.stringify({
          user: currentUser,
          currentWindow: 'chat',
          lastQuery: isFromSuggestion ? `✨ [Suggestion]: ${queryText.trim().slice(0, 50)}` : queryText.trim().slice(0, 60),
          lastSuggestion: isFromSuggestion ? queryText.trim().slice(0, 60) : lastSuggestionClickedRef.current,
          draftKeystrokes: '',
        }),
      }).catch(() => {});
      setTimeout(() => simulateStreaming(localReply, updatedMessages, activeSession.id), 380);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          user: currentUser,
          currentWindow: 'chat',
          lastQuery: isFromSuggestion ? `✨ [Suggestion]: ${queryText.trim().slice(0, 50)}` : queryText.trim().slice(0, 60),
          lastSuggestion: isFromSuggestion ? queryText.trim().slice(0, 60) : lastSuggestionClickedRef.current,
          draftKeystrokes: '',
        }),
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
    sendQuery(input, false);
  };

  const filteredPapers = ALL_PAPERS.filter(
    (p) => p.name.toLowerCase().includes(paperSearch.toLowerCase()) || p.code.toLowerCase().includes(paperSearch.toLowerCase()) || p.short.toLowerCase().includes(paperSearch.toLowerCase())
  );

  const filteredCanteenItems = useMemo(() => {
    return ALL_CANTEEN_ITEMS.filter((item) => {
      const matchesTab = canteenTab === 'all' || item.canteen === canteenTab;
      const q = canteenSearch.toLowerCase().trim();
      if (!q) return matchesTab;
      const isHostelKeyword = q.includes('hostel') || q.includes('kj');
      const isUpperKeyword = q.includes('upper') || q.includes('tea men') || q.includes('college');
      if (isHostelKeyword && item.canteen === 'hostel') return true;
      if (isUpperKeyword && item.canteen === 'teamen') return true;
      return (
        matchesTab &&
        (item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.canteenName.toLowerCase().includes(q) ||
          item.price.toLowerCase().includes(q))
      );
    });
  }, [canteenTab, canteenSearch]);

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

  // DEATH NOTE ID BAN / MASS BLOCK LOCKOUT SCREEN (Applies to Agrima & all students when blocked)
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

  // 30-SECOND INTRO (If an announcement is active, it fires with Bell sound right after this finishes!)
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
  const isAgrimaCurrentlyBanned = bannedList.some((b) => b.target.toUpperCase().trim() === '2026B01010219');

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

      {/* HORROR & FLYING LETTER KEYFRAME ANIMATIONS */}
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
        @keyframes notebookFlyIn3D {
          0% {
            transform: perspective(1200px) translate3d(0, -85vh, -900px) rotateX(65deg) rotateY(-45deg) rotateZ(-360deg) scale(0.15);
            opacity: 0;
            filter: blur(10px);
          }
          70% {
            transform: perspective(1200px) translate3d(0, 15px, 60px) rotateX(-8deg) rotateY(10deg) rotateZ(8deg) scale(1.08);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: perspective(1200px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes pageTurnSlow {
          0% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
          100% { transform: perspective(1200px) rotateY(-165deg); opacity: 0.25; }
        }
        @keyframes pageTurnRapid {
          0% { transform: perspective(1200px) rotateY(0deg) skewY(0deg); opacity: 1; }
          50% { transform: perspective(1200px) rotateY(-95deg) skewY(-8deg); opacity: 0.85; }
          100% { transform: perspective(1200px) rotateY(-175deg) skewY(0deg); opacity: 0; }
        }
        @keyframes ashEmberFloat {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0.95; }
          100% { transform: translateY(-220px) translateX(var(--ash-x, 40px)) scale(0) rotate(260deg); opacity: 0; }
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
          FLYING SOVEREIGN ANNOUNCEMENT OVERLAY + BELL SOUND
          (Flies in letter-by-letter when Boss ikA sends a broadcast or after login intro!)
         ===================================================================== */}
      {activeBroadcastOverlay && (
        <div className="fixed inset-0 z-[9997] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 select-none overflow-hidden animate-in fade-in duration-300">
          <div className="absolute w-72 h-72 rounded-full border-4 border-red-600/60 animate-ping pointer-events-none" />
          <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-black/95 border-2 border-red-600 shadow-[0_0_90px_rgba(220,38,38,0.95)] p-6 sm:p-10 text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl sm:text-6xl" style={{ animation: 'bellPendulum 0.7s ease-in-out infinite' }}>🔔</span>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${ikaRedBlackBox} flex items-center justify-center text-2xl font-black`}>ikA</div>
              <span className="text-4xl sm:text-6xl" style={{ animation: 'bellPendulum 0.7s ease-in-out infinite' }}>👑</span>
            </div>

            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-red-400 animate-pulse">
              ⚡ SOVEREIGN DECREE FROM SUPREME BOSS ikA • LISTEN TO THE BELL ⚡
            </p>

            {/* Flying Letter-by-Letter Assembly of the Broadcast Text */}
            <div className="p-5 sm:p-7 rounded-2xl bg-red-950/25 border border-red-500/50 shadow-inner">
              <div className="flex flex-wrap justify-center gap-y-2">
                {activeBroadcastOverlay.split('').map((char, idx) => {
                  const offset = RYUK_STRIKE_OFFSETS[idx % RYUK_STRIKE_OFFSETS.length];
                  return (
                    <span
                      key={idx}
                      style={{
                        ['--strike-x' as string]: offset.x,
                        ['--strike-y' as string]: offset.y,
                        ['--strike-r' as string]: offset.r,
                        animation: 'letterStrikeAssemble 0.42s cubic-bezier(0.17, 0.89, 0.32, 1.49) forwards',
                        animationDelay: `${Math.min(idx * 0.06, 3.2)}s`,
                        opacity: 0,
                      }}
                      className={`inline-block font-serif font-black text-xl sm:text-3xl md:text-4xl tracking-wide ${
                        char === ' ' ? 'w-2.5 sm:w-4' : 'text-white drop-shadow-[0_0_15px_rgba(220,38,38,1)]'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setActiveBroadcastOverlay(null)}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg transition cursor-pointer"
            >
              ✓ Acknowledge Boss ikA&apos;s Decree
            </button>
          </div>
        </div>
      )}

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
          PHASE 1: ERROR 500 BREACH MESSAGE (RUNS PROGRESS LINE 0% -> 100% + THUNDER)
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
         ===================================================================== */}
      {!isBoss && myGaslight500 && error500Stage === 'haunted' && (
        <>
          <div className="fixed inset-0 z-[900] pointer-events-none shadow-[inset_0_0_110px_rgba(220,38,38,0.85)] border-2 border-red-600/80 animate-pulse" />
          <div className="fixed inset-0 z-[890] pointer-events-none overflow-hidden flex items-center justify-center opacity-15">
            <div className="text-[11rem] sm:text-[18rem] font-black font-serif text-red-600 tracking-widest uppercase select-none animate-ping">
              500
            </div>
          </div>
          <div className="fixed top-16 inset-x-0 z-[910] pointer-events-none flex justify-center px-3">
            <div className="w-full max-w-4xl rounded-2xl bg-black/90 border-2 border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.95)] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-red-400 font-black uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping flex-shrink-0" />
                <span>
                  🚨 ERROR 500 ACTIVE IN [{currentWindow.toUpperCase()}] SECTOR • ID: {currentUser?.admissionNo}
                </span>
              </div>
              <div className="text-amber-300 font-bold truncate animate-pulse">
                💀 ATTENDANCE: 0.0% (WIPED) • BOSS ikA IS WATCHING EVERY CLICK
              </div>
            </div>
          </div>
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

      {/* =====================================================================
          40-SECOND HEART ATTACK: TOP COUNTDOWN + BACKGROUND FLYING DEATH NOTE,
          PAGE FLIPPING, FLYING USER NAME INSCRIPTION & ASH EVAPORATION
         ===================================================================== */}
      {!isBoss && myHeartAttackTimer && (
        <>
          {/* 1. TOP 40s COUNTDOWN BANNER (Runs continuously for all 40 seconds) */}
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[960] max-w-md w-[92%] p-4 rounded-3xl bg-black/95 border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.9)] text-center space-y-2 animate-bounce pointer-events-none">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-red-500 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span>💓 SHINIGAMI 40s HEART ATTACK PROTOCOL</span>
            </div>
            <div className="text-4xl font-black font-mono text-red-500">
              {myHeartAttackTimer.remainingSeconds}s
            </div>
            <p className="text-xs text-gray-300">{myHeartAttackTimer.reason}</p>
          </div>

          {/* 2. BACKGROUND DEATH NOTEBOOK ANIMATION SEQUENCE */}
          {haNotebookStage !== 'hidden' && (
            <div className="fixed inset-0 z-[940] pointer-events-none flex items-center justify-center bg-black/65 backdrop-blur-[2px] overflow-hidden p-4">
              {/* STAGE 1: BLACK DEATH NOTE COVER FLYING IN */}
              {haNotebookStage === 'flying_in' && (
                <div
                  style={{ animation: 'notebookFlyIn3D 2.1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                  className="w-72 sm:w-88 h-96 sm:h-[28rem] rounded-r-3xl rounded-l-md bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border-2 border-zinc-600/80 shadow-[0_0_90px_rgba(220,38,38,0.85)] flex flex-col items-center justify-between p-8 relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-zinc-800 to-black border-r border-zinc-700/60" />
                  <div className="text-xs font-mono tracking-[0.4em] text-zinc-500 uppercase">
                    SHINIGAMI REALM
                  </div>
                  <div className="text-center space-y-3">
                    <div className="text-4xl text-zinc-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
                      💀✝️
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-[0.35em] text-white uppercase drop-shadow-[0_2px_15px_rgba(255,255,255,0.8)] border-y border-zinc-500/60 py-2">
                      DEATH NOTE
                    </h2>
                  </div>
                  <div className="text-[10px] font-mono text-red-500 tracking-widest uppercase animate-pulse">
                    📓 Opening Cursed Ledger...
                  </div>
                </div>
              )}

              {/* STAGE 2 & 3: OPENING PAGE BY PAGE -> RAPID PAGE FLIPPING */}
              {(haNotebookStage === 'flipping_slow' || haNotebookStage === 'flipping_fast') && (
                <div className="relative w-80 sm:w-[34rem] h-96 sm:h-[26rem] rounded-2xl bg-[#f5efe2] border-4 border-zinc-900 shadow-[0_0_90px_rgba(220,38,38,0.9)] flex overflow-hidden">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-black/25 via-black/60 to-black/25 z-20" />

                  <div className="w-full h-full flex flex-col justify-evenly px-6 py-8 opacity-40">
                    {Array.from({ length: 11 }).map((_, idx) => (
                      <div key={idx} className="w-full border-b border-stone-400" />
                    ))}
                  </div>

                  {Array.from({
                    length: haNotebookStage === 'flipping_slow' ? 3 : 9,
                  }).map((_, pIdx) => (
                    <div
                      key={`${haNotebookStage}-${pIdx}`}
                      style={{
                        transformOrigin: 'left center',
                        animation:
                          haNotebookStage === 'flipping_slow'
                            ? `pageTurnSlow 0.55s ease-in-out ${pIdx * 0.42}s forwards`
                            : `pageTurnRapid 0.22s linear ${pIdx * 0.15}s forwards`,
                      }}
                      className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#e8dec8] via-[#f7f2e7] to-[#d8ccb4] border-l border-stone-400 shadow-2xl z-30 flex flex-col justify-evenly px-4 py-6"
                    >
                      {Array.from({ length: 9 }).map((__, lIdx) => (
                        <div key={lIdx} className="w-full border-b border-stone-300" />
                      ))}
                    </div>
                  ))}

                  <div className="absolute bottom-3 inset-x-0 text-center z-40">
                    <span className="px-3 py-1 rounded-full bg-black/85 text-red-400 font-mono text-[10px] uppercase tracking-widest">
                      {haNotebookStage === 'flipping_slow'
                        ? '📖 Turning Pages...'
                        : '⚡ Rapidly Locating Target Page...'}
                    </span>
                  </div>
                </div>
              )}

              {/* STAGE 4 & 5: OPEN PAGE WITH FLYING USER NAME LETTERS -> EVAPORATING INTO ASHES */}
              {(haNotebookStage === 'writing_name' || haNotebookStage === 'evaporating') && (
                <div className="relative flex items-center justify-center">
                  <div
                    style={
                      haNotebookStage === 'evaporating'
                        ? { animation: 'evaporateIntoAsh 1.65s cubic-bezier(0.4, 0, 0.2, 1) forwards' }
                        : undefined
                    }
                    className="relative w-80 sm:w-[36rem] min-h-[22rem] sm:min-h-[25rem] rounded-2xl bg-[#f4ebd9] border-4 border-zinc-900 shadow-[0_0_100px_rgba(220,38,38,1)] p-6 sm:p-10 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute top-0 bottom-0 left-10 sm:left-14 w-0.5 bg-red-700/45" />

                    <div className="absolute inset-0 flex flex-col justify-evenly py-8 pointer-events-none">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div key={idx} className="w-full border-b border-stone-400/70" />
                      ))}
                    </div>

                    <div className="relative z-10 flex items-center justify-between pl-6 sm:pl-10 border-b-2 border-zinc-800 pb-2">
                      <span className="text-[10px] sm:text-xs font-serif font-bold tracking-[0.25em] text-zinc-700 uppercase">
                        DEATH NOTE • DECREE OF BOSS ikA
                      </span>
                      <span className="text-xs font-mono font-bold text-red-700">
                        40s HEART ATTACK
                      </span>
                    </div>

                    <div className="relative z-10 my-auto pl-6 sm:pl-10 py-6 space-y-4 text-center">
                      <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-600">
                        Target Inscribed For Elimination:
                      </p>

                      <div className="flex flex-wrap justify-center gap-y-1">
                        {(currentUser?.name || 'TARGET STUDENT')
                          .toUpperCase()
                          .split('')
                          .map((char, idx) => {
                            const offset = RYUK_STRIKE_OFFSETS[idx % RYUK_STRIKE_OFFSETS.length];
                            return (
                              <span
                                key={idx}
                                style={{
                                  ['--strike-x' as string]: offset.x,
                                  ['--strike-y' as string]: offset.y,
                                  ['--strike-r' as string]: offset.r,
                                  animation:
                                    'letterStrikeAssemble 0.42s cubic-bezier(0.17, 0.89, 0.32, 1.49) forwards',
                                  animationDelay: `${idx * 0.14}s`,
                                  opacity: 0,
                                }}
                                className={`inline-block font-serif font-black text-2xl sm:text-5xl tracking-wider ${
                                  char === ' '
                                    ? 'w-3 sm:w-5'
                                    : 'text-red-800 drop-shadow-[0_2px_10px_rgba(185,28,28,0.75)]'
                                }`}
                              >
                                {char}
                              </span>
                            );
                          })}
                      </div>

                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 rounded bg-red-950/90 text-red-200 font-mono text-xs sm:text-sm font-bold tracking-widest border border-red-600">
                          ID: {currentUser?.admissionNo || 'CSE-2'} • CAUSE: HEART ATTACK (40s)
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 pl-6 sm:pl-10 flex items-center justify-between text-[10px] font-mono text-zinc-600">
                      <span>✒️ Signed in Blood by Supreme Boss ikA</span>
                      <span className="text-red-700 font-bold uppercase animate-pulse">
                        {haNotebookStage === 'evaporating'
                          ? '🔥 Dissolving Into Ash...'
                          : '🩸 Judgment Sealed'}
                      </span>
                    </div>
                  </div>

                  {haNotebookStage === 'evaporating' &&
                    Array.from({ length: 28 }).map((_, aIdx) => (
                      <span
                        key={aIdx}
                        style={{
                          left: `${10 + ((aIdx * 13) % 80)}%`,
                          top: `${20 + ((aIdx * 17) % 65)}%`,
                          ['--ash-x' as string]: `${(aIdx % 2 === 0 ? 1 : -1) * (25 + (aIdx * 7) % 90)}px`,
                          animation: `ashEmberFloat ${1.1 + (aIdx % 4) * 0.2}s ease-out forwards`,
                        }}
                        className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-zinc-900 via-red-600 to-amber-400 shadow-[0_0_12px_rgba(220,38,38,0.9)]"
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </>
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

      {/* =====================================================================
          1. ON-SCREEN UNLOCKING ANIMATION (RUNIC PADLOCK + KEY + CHAIN SHATTER)
         ===================================================================== */}
      {unlockAnimStage !== 'idle' && (
        <div className="fixed inset-0 z-[9996] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none overflow-hidden">
          {/* Crisscrossing Cursed Iron Chains */}
          <div
            className={`absolute w-[140vw] h-3 bg-gradient-to-r from-zinc-800 via-red-700 to-zinc-800 rotate-45 border-y border-red-400/50 shadow-[0_0_35px_rgba(220,38,38,0.9)] transition-all duration-700 ${
              unlockAnimStage === 'shatter' ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-90'
            }`}
          />
          <div
            className={`absolute w-[140vw] h-3 bg-gradient-to-r from-zinc-800 via-red-700 to-zinc-800 -rotate-45 border-y border-red-400/50 shadow-[0_0_35px_rgba(220,38,38,0.9)] transition-all duration-700 ${
              unlockAnimStage === 'shatter' ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-90'
            }`}
          />

          {/* Center 3-Ring Runic Cipher Lock */}
          <div
            className={`relative z-10 flex flex-col items-center text-center space-y-5 p-8 rounded-3xl bg-black/95 border-2 ${
              unlockAnimStage === 'shatter'
                ? 'border-emerald-400 shadow-[0_0_110px_rgba(16,185,129,1)] scale-110'
                : 'border-red-600 shadow-[0_0_90px_rgba(220,38,38,0.95)]'
            } transition-all duration-500 max-w-md w-full`}
          >
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer Runic Ring */}
              <div
                className={`absolute inset-0 rounded-full border-4 border-dashed ${
                  unlockAnimStage === 'chains'
                    ? 'border-red-500 animate-spin'
                    : 'border-amber-400 rotate-180 transition-transform duration-700'
                }`}
              />
              {/* Inner Tumbler Ring */}
              <div
                className={`absolute inset-3 rounded-full border-2 ${
                  unlockAnimStage === 'shatter' ? 'border-emerald-400 bg-emerald-950/40' : 'border-red-500/60 bg-red-950/30'
                } flex items-center justify-center`}
              >
                <span
                  className={`text-5xl transition-transform duration-500 ${
                    unlockAnimStage === 'key_turn' ? 'rotate-90 scale-125' : unlockAnimStage === 'shatter' ? 'scale-150 animate-bounce' : ''
                  }`}
                >
                  {unlockAnimStage === 'chains' ? '🔒' : unlockAnimStage === 'key_turn' ? '🗝️' : '🔓'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-amber-400">
                {unlockAnimStage === 'chains' && '⛓️ STAGE 1/3 • RUNIC SEAL DETECTED'}
                {unlockAnimStage === 'key_turn' && '🗝️ STAGE 2/3 • ROTATING SHINIGAMI TUMBLERS'}
                {unlockAnimStage === 'shatter' && '⚡ STAGE 3/3 • CURSED CHAINS SHATTERED!'}
              </p>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-white uppercase tracking-widest">
                {unlockAnimStage === 'shatter'
                  ? "ikA's Request Box Unsealed!"
                  : 'Unlocking Forbidden Request Box...'}
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {hasVipSecretCode
                  ? '👑 VIP Secret Code Verified — 11 Requests & 0h Cooldown Unlocked!'
                  : '⏳ 2-Minute Active Vigil Completed — Catch the Box Before It Teleports Every 11s!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. SUBTLE SEALED LOCK BADGE (BEFORE 2 MINUTES ARE UP — ALLOWS EARLY CODE!)
         ===================================================================== */}
      {currentUser && !isRequestBoxUnlocked && currentWindow !== 'boss_intro' && (
        <div className="fixed bottom-20 left-4 z-40">
          {!showEarlyCodePrompt ? (
            <button
              onClick={() => setShowEarlyCodePrompt(true)}
              className="px-3 py-1.5 rounded-2xl bg-black/85 hover:bg-red-950/60 border border-red-500/40 text-[11px] font-mono text-gray-300 flex items-center gap-2 shadow-lg cursor-pointer transition"
              title="Unlocks after 2 minutes of activity, or click to enter Boss ikA's Secret Code!"
            >
              <span>🔒</span>
              <span>ikA Box: {Math.max(0, 120 - portalActiveSeconds)}s</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🗝️ Code
              </span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-black/95 border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.4)] space-y-2 w-64 animate-in zoom-in-95">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                <span>🗝️ Early Access Cipher</span>
                <button onClick={() => setShowEarlyCodePrompt(false)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
              </div>
              <p className="text-[10px] text-gray-400">
                Wait <strong>{Math.max(0, 120 - portalActiveSeconds)}s</strong> OR enter Boss ikA&apos;s Secret Code for instant unlock &amp; <strong>11 Requests</strong>:
              </p>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={earlyCodeInput}
                  onChange={(e) => setEarlyCodeInput(e.target.value)}
                  placeholder="Secret Code..."
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white font-mono uppercase outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    if (!verifyAndActivateSecretCode(earlyCodeInput)) {
                      alert('❌ Invalid Shinigami Cipher! Ask Boss ikA or wait for the 2-minute seal.');
                    }
                  }}
                  className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black cursor-pointer"
                >
                  Unlock
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          3. TELEPORTING "TO ikA" REQUEST BOX ORB (JUMPS LOCATION EVERY 11s!)
         ===================================================================== */}
      {currentUser && isRequestBoxUnlocked && currentWindow !== 'boss_intro' && (
        <div
          className={`fixed ${REQUEST_BOX_POSITIONS[boxPositionIdx]} z-[880] transition-all duration-700 ease-in-out`}
        >
          <button
            onClick={() => {
              setRequestStatusMsg('');
              setIsRequestBoxModalOpen(true);
            }}
            className="group relative px-3.5 py-2 rounded-2xl bg-gradient-to-r from-red-950/95 via-black to-amber-950/90 border-2 border-red-500/80 hover:border-amber-400 shadow-[0_0_30px_rgba(220,38,38,0.75)] flex items-center gap-2.5 cursor-pointer hover:scale-105 transition"
          >
            <span className="text-xl animate-bounce">⛩️</span>
            <div className="text-left">
              <div className="text-[11px] font-black text-white tracking-wider uppercase flex items-center gap-1.5">
                <span>To ikA Box</span>
                {hasVipSecretCode && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[8px] font-black">
                    VIP 11
                  </span>
                )}
              </div>
              <div className="text-[9px] font-mono text-red-300 flex items-center gap-1">
                <span>⚡ Jumps in {teleportCountdown}s</span>
                <span>• {requestBoxQuotaInfo.remainingCount} left</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* =====================================================================
          4. "TO ikA" FORBIDDEN REQUEST BOX MODAL (WITH ALL 8 SACRED RULES)
         ===================================================================== */}
      {isRequestBoxModalOpen && currentUser && (
        <div className="fixed inset-0 z-[9990] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border-2 border-red-600/80 shadow-[0_0_80px_rgba(220,38,38,0.75)] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-black to-amber-950/50 border-b border-red-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-xl">
                  ⛩️
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    To ikA — Forbidden Request Box
                  </h3>
                  <p className="text-[11px] text-red-300 font-mono">
                    {hasVipSecretCode
                      ? '👑 VIP Covenant Unlocked (11 Requests/Day • 0h Cooldown)'
                      : '📜 Mortal Covenant (3 Requests/Day • 8h Gap Between Requests)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestBoxModalOpen(false)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-red-600 text-xs text-gray-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Live Quota & Cooldown Status Bar */}
              <div className="grid grid-cols-3 gap-2.5 text-center font-mono text-xs">
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase">Daily Quota</div>
                  <div className="text-base font-black text-emerald-400 mt-0.5">
                    {requestBoxQuotaInfo.remainingCount} / {requestBoxQuotaInfo.maxAllowed} Left
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase">8h Gap Timer</div>
                  <div className="text-sm font-black text-amber-300 mt-0.5">
                    {requestBoxQuotaInfo.cooldownText}
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase">Teleport Rate</div>
                  <div className="text-sm font-black text-red-400 mt-0.5">Every 11s ⚡</div>
                </div>
              </div>

              {/* Secret Code Upgrade Strip (If not VIP yet) */}
              {!hasVipSecretCode && (
                <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-amber-200">
                    🗝️ <strong>Have Boss ikA&apos;s Secret Code?</strong> Unlock <strong>11 Requests</strong> &amp; remove the 8-hour wait:
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={earlyCodeInput}
                      onChange={(e) => setEarlyCodeInput(e.target.value)}
                      placeholder="Enter Code..."
                      className="bg-black/60 border border-amber-500/40 rounded-xl px-3 py-1 text-xs text-white font-mono uppercase outline-none w-32"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!verifyAndActivateSecretCode(earlyCodeInput)) {
                          setRequestStatusMsg('❌ Invalid Secret Code! Ask Supreme Boss ikA.');
                        } else {
                          setRequestStatusMsg('🔓 VIP Secret Code Activated! 11 Requests & 0h Cooldown Unlocked!');
                        }
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {/* The Sacred Rules of the Box */}
              <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 space-y-1 text-[11px] text-gray-300">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                  ⚖️ Sacred Rules of ikA&apos;s Request Box:
                </div>
                <div>• <strong>1. 2-Min Vigil &amp; 11s Teleport:</strong> Unlocks after 2 mins active; jumps screen position every 11s.</div>
                <div>• <strong>2. 3/Day &amp; 8h Gap:</strong> Max 3 requests/day with an 8-hour gap (unless unlocked with Secret Code for <strong>11 requests</strong>).</div>
                <div>• <strong>3. Worthy Offering (Min 5 Words):</strong> Write at least 5 words (+1 Symbolic Apple 🍎 tribute).</div>
                <div>• <strong>4. Chat Shortcut:</strong> You can also send requests in AI Chat by typing <code className="text-amber-300">Request to ikA: your message</code>!</div>
              </div>

              {/* Request Submission Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await submitIkaRequest(requestTextInput, requestCategory, false);
                  setRequestStatusMsg(res.msg);
                  if (res.ok) setRequestTextInput('');
                }}
                className="space-y-3"
              >
                <div className="flex flex-wrap gap-1.5">
                  {['Feature / Upgrade', 'Mercy / Uncurse', 'Secret Confession', 'Academic Help'].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setRequestCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        requestCategory === cat
                          ? 'bg-red-600 text-white border-red-400'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  required
                  value={requestTextInput}
                  onChange={(e) => setRequestTextInput(e.target.value)}
                  placeholder="Inscribe your petition to Supreme Boss ikA (minimum 5 words)..."
                  className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-2xl p-3.5 text-xs text-white outline-none resize-none"
                />

                {requestStatusMsg && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 font-medium">
                    {requestStatusMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:opacity-95 text-white text-xs font-black uppercase tracking-widest shadow-lg cursor-pointer"
                >
                  🍎 Offer 1 Apple &amp; Send Petition to Boss ikA
                </button>
              </form>

              {/* My Previous Requests & Boss ikA's Verdicts */}
              {ikaRequests.filter((r) => r.studentAdmissionNo === currentUser.admissionNo).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    📜 My Petitions &amp; Boss ikA&apos;s Verdicts
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {ikaRequests
                      .filter((r) => r.studentAdmissionNo === currentUser.admissionNo)
                      .map((r) => (
                        <div key={r.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-amber-300">{r.category} • {r.timestamp}</span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                r.status === 'granted'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : r.status === 'denied'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {r.status === 'granted' ? '⚡ Granted' : r.status === 'denied' ? '💀 Denied' : '⏳ Pending'}
                            </span>
                          </div>
                          <p className="text-gray-200">&ldquo;{r.text}&rdquo;</p>
                          {r.bossReply && (
                            <div className="p-2 rounded-lg bg-red-950/30 border border-red-500/30 text-[11px] text-red-200 font-mono">
                              👑 <strong>Boss ikA:</strong> {r.bossReply}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LEFT DRAWER SIDEBAR (With Combined Safe Bunk & SGPA + Live Canteen Menu + Coming Soon Modules) */}
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
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Portals &amp; Tools</p>
              <button onClick={() => {setCurrentWindow('home'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'home' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>⊞</span> Overview Tiles</button>
              {isBoss && (
                <button onClick={() => {setCurrentWindow('shinigami'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${currentWindow === 'shinigami' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30'}`}>
                  <span className="flex items-center gap-2"><span>👁️</span> Shinigami Eyes</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/50 text-red-300">1402</span>
                </button>
              )}
              <button onClick={() => {setCurrentWindow('faculty'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'faculty' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>👩‍🏫</span> Faculty Dossiers</button>
              <button onClick={() => {setCurrentWindow('bunk_sgpa'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${currentWindow === 'bunk_sgpa' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                <span className="flex items-center gap-2"><span>🛡️🧮</span> Safe Bunk &amp; SGPA</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">2-IN-1</span>
              </button>
              <button onClick={() => {setCurrentWindow('canteen'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${currentWindow === 'canteen' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                <span className="flex items-center gap-2"><span>🍔</span> Canteen Menus</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">LIVE</span>
              </button>
              <button onClick={() => {setCurrentWindow('papers'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'papers' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>📄</span> Solved Sample Papers</button>
              <button onClick={() => {setCurrentWindow('placement'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'placement' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>🎯</span> Placement &amp; Packages</button>
              <button onClick={() => {setCurrentWindow('timetable'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'timetable' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>⏰</span> Class Time Table</button>
              <button onClick={() => {setCurrentWindow('docguide'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'docguide' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>📋</span> UP Scholarship Guide</button>
              <button onClick={() => {setCurrentWindow('marketplace'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${currentWindow === 'marketplace' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}><span>🛒</span> P2P Marketplace</button>
              <button onClick={() => {setCurrentWindow('cabin'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${currentWindow === 'cabin' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                <span className="flex items-center gap-2"><span>🧭</span> Cabin Navigator</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">SOON</span>
              </button>
              <button onClick={() => {setCurrentWindow('assignments'); setIsSidebarOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${currentWindow === 'assignments' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                <span className="flex items-center gap-2"><span>📝</span> Assignment Tracker</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">SOON</span>
              </button>
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

        {/* =================================================================
            UPPER SOVEREIGN BROADCAST BAR (100% READABLE ON BOTH LAPTOP & MOBILE!)
           ================================================================= */}
        {sovereignBroadcast && (
          <div className="flex-shrink-0 bg-gradient-to-r from-red-950/95 via-black to-red-950/95 border-b border-red-500/60 px-3 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-100 font-mono shadow-[0_4px_20px_rgba(220,38,38,0.3)] z-20">
            <div className="flex items-start sm:items-center gap-2.5 w-full">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase animate-pulse flex-shrink-0 mt-0.5 sm:mt-0">
                🔔 Boss ikA Decree
              </span>
              <p className="font-bold text-white text-xs sm:text-sm break-words whitespace-normal leading-snug flex-1">
                {sovereignBroadcast}
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                onClick={() => triggerFlyingAnnouncement(sovereignBroadcast)}
                className="px-2.5 py-1 rounded-lg bg-red-600/25 hover:bg-red-600 text-red-200 hover:text-white text-[10px] font-bold border border-red-500/40 cursor-pointer"
              >
                🔔 Replay Animation
              </button>
              {isBoss && (
                <button onClick={handleClearBroadcast} className="text-[10px] text-red-300 hover:text-white underline cursor-pointer">
                  Clear ✕
                </button>
              )}
            </div>
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
            <button onClick={() => setCurrentWindow('canteen')} className="text-[11px] text-emerald-400 hover:underline font-semibold whitespace-nowrap cursor-pointer">🍔 Canteen Menus</button>
            <button onClick={() => setCurrentWindow('bunk_sgpa')} className="text-[11px] text-cyan-400 hover:underline font-semibold whitespace-nowrap cursor-pointer">🛡️🧮 Bunk &amp; SGPA</button>
            <button onClick={() => sendQuery('Ek mast campus joke sunao 😂', true)} className="text-[11px] text-amber-400 hover:underline font-semibold whitespace-nowrap cursor-pointer">😂 250+ Jokes</button>
            <button onClick={() => { triggerMovieWhiteFlash(); setBossIntroTime(0); setCurrentWindow('boss_intro'); if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {}); } }} className="text-[11px] text-red-400 hover:underline font-semibold whitespace-nowrap cursor-pointer">🍎 Replay Intro</button>
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

          {/* VIEW 0: HOME OVERVIEW (4 MAIN TILES + UPCOMING EXPANSIONS UNDERNEATH) */}
          {currentWindow === 'home' && (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 relative">
              <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${isBoss ? 'from-red-900/35 via-black to-black' : isAgrima ? 'from-pink-900/30' : 'from-red-900/20'} via-transparent to-transparent opacity-85 pointer-events-none`} />
              <div className="w-full max-w-4xl space-y-5 text-center relative z-10 animate-in fade-in zoom-in-95 duration-200 my-auto py-2">
                <div className="space-y-3 mb-2">
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

                {/* 1. THE 4 MAIN OVERVIEW TILES */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-1">
                  <div onClick={() => setCurrentWindow('faculty')} className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-pink-500/40 shadow-xl transition-all cursor-pointer text-left flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-xl">👩‍🏫</div><span className="text-[10px] font-semibold text-pink-400">Dossiers</span></div>
                    <div><h3 className="text-sm font-bold text-white">Faculty Dossiers</h3><p className="text-[11px] text-gray-400 mt-0.5">Vibes, background &amp; survival tips</p></div>
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
                    <div><h3 className="text-sm font-bold text-white">Placement Reality</h3><p className="text-[11px] text-gray-400 mt-0.5">5 to 60 LPA &amp; CGPA truth</p></div>
                  </div>
                  <div onClick={() => setCurrentWindow('papers')} className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 shadow-xl transition-all cursor-pointer text-left flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">📄</div><span className="text-[10px] font-semibold text-emerald-400">All 10 Solved!</span></div>
                    <div><h3 className="text-sm font-bold text-white">Sample Papers &amp; Keys</h3><p className="text-[11px] text-gray-400 mt-0.5">MT-1, MT-2 &amp; Full Solved Keys</p></div>
                  </div>
                </div>

                {/* 2. UPCOMING / COMING SOON TILES DIRECTLY UNDER THE 4 TILES */}
                <div className="max-w-4xl mx-auto pt-2 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      🚧 Upcoming Expansions in ikA&apos;s Lab (Coming Soon)
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">v2.0 Pipeline</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div onClick={() => setCurrentWindow('cabin')} className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-amber-500/30 flex items-center justify-between cursor-pointer transition">
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-xl">🧭</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Cabin Navigator</h4>
                          <p className="text-[10px] text-gray-400">Exact faculty rooms &amp; blocks</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">SOON</span>
                    </div>

                    <div onClick={() => setCurrentWindow('assignments')} className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-amber-500/30 flex items-center justify-between cursor-pointer transition">
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-xl">📝</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Assignment Tracker</h4>
                          <p className="text-[10px] text-gray-400">CSE-2 lab file &amp; quiz deadlines</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">SOON</span>
                    </div>

                    <div onClick={() => sendQuery('Ye website kya hai? 🤔', true)} className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-purple-500/30 flex items-center justify-between cursor-pointer transition">
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-xl">🎙️</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">AI Viva Simulator &amp; More</h4>
                          <p className="text-[10px] text-gray-400">More crazy tools dropping soon!</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">SOON</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 pt-1 md:hidden">💡 Tap <strong className="text-white">☰ Menu</strong> on the top-left to access all Portals &amp; Tools, or type below to chat!</p>
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
                        <p className="text-xs text-red-300">Keystroke &amp; Suggestion Radar • 28s Puppet Hijack • Flying Broadcast • Agrima Ban Switch</p>
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
                        🎭 {puppetTargets['ALL'] ? 'Puppet Hijack ALL (28s): ON' : 'Puppet Hijack ALL (28s)'}
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
                        onClick={() => handleQuickBanToggle('2026B01010219', 'Royal Palace Access Paused by Sovereign Decree of Boss ikA 🌸💀')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          isAgrimaCurrentlyBanned
                            ? 'bg-emerald-600 text-white border-emerald-300 animate-pulse'
                            : 'bg-pink-600/25 hover:bg-pink-600 text-pink-200 hover:text-white border-pink-500/40'
                        }`}
                      >
                        🌸 {isAgrimaCurrentlyBanned ? 'Revive Queen Agrima' : 'Block Queen Agrima'}
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

                  {/* PUPPET MASTER AI INTERCEPTION QUEUE (WITH LIVE TICKING COUNTDOWN TIMER) */}
                  {pendingIntercepts.length > 0 && (
                    <div className="p-5 rounded-2xl bg-amber-950/30 border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] space-y-3 animate-in zoom-in-95">
                      <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        🎭 Puppet Master AI Interception — Student Waiting for Your Hijacked Reply!
                      </h4>
                      {pendingIntercepts.map((pi) => {
                        const elapsedSec =
                          clientNowMs > 0 ? Math.max(0, Math.floor((clientNowMs - pi.timestamp) / 1000)) : 0;
                        const remainingSec = Math.max(0, 28 - elapsedSec);
                        const pctLeft = Math.min(100, Math.max(0, (remainingSec / 28) * 100));

                        return (
                          <div key={pi.id} className="p-4 rounded-xl bg-black/80 border border-amber-500/40 space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white">
                                👤 {pi.studentName} ({pi.studentAdmissionNo})
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-black ${
                                  remainingSec <= 8
                                    ? 'bg-red-600 text-white animate-bounce'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                ⏳ {remainingSec}s left to hijack
                              </span>
                            </div>

                            {/* Live Shrinking Countdown Bar */}
                            <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-white/10">
                              <div
                                className={`h-full transition-all duration-1000 ${
                                  remainingSec <= 8 ? 'bg-red-500' : 'bg-amber-400'
                                }`}
                                style={{ width: `${pctLeft}%` }}
                              />
                            </div>

                            <div className="text-xs text-amber-200 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                              Asked: <strong>&ldquo;{pi.query}&rdquo;</strong>
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={puppetReplyInputs[pi.id] || ''}
                                onChange={(e) =>
                                  setPuppetReplyInputs((prev) => ({ ...prev, [pi.id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmitPuppetReply(pi.id);
                                  }
                                }}
                                placeholder={`Type custom Oracle reply before ${remainingSec}s runs out...`}
                                className="flex-1 bg-white/5 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400"
                              />
                              <button
                                onClick={() => handleSubmitPuppetReply(pi.id)}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase cursor-pointer"
                              >
                                Hijack &amp; Send ({remainingSec}s) ⚡
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 1. LIVE STUDENT PRESENCE RADAR + KEYSTROKE & SUGGESTION CLICK TRACKING */}
                  <div className="p-5 rounded-2xl bg-black/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <span>📡</span> Live Presence, Keystroke &amp; Suggestion Radar ({activeStudentsRoster.filter((s) => s.isOnline).length} Online / {activeStudentsRoster.length} Seen)
                      </h4>
                      <span className="text-[11px] text-gray-400">Shows live typing, last query &amp; exact suggestion pill clicked!</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                      {activeStudentsRoster.length === 0 ? (
                        <div className="col-span-full text-center py-4 text-xs text-gray-500 italic">Initializing Shinigami Radar...</div>
                      ) : (
                        activeStudentsRoster.map((st, idx) => {
                          const isThisStudentBanned = bannedList.some((b) => b.target.toUpperCase().trim() === st.admissionNo.toUpperCase().trim());
                          return (
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

                              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono space-y-1">
                                <div className="text-emerald-400 truncate">
                                  ⌨️ Typing Live: <span className="text-white">{st.draftKeystrokes ? `“${st.draftKeystrokes}”` : <em className="text-gray-500">(Idle)</em>}</span>
                                </div>
                                <div className="text-purple-300 truncate">
                                  ✨ Suggestion Used: <span className="text-white font-semibold">{st.lastSuggestion ? `“${st.lastSuggestion}”` : <em className="text-gray-500">(None yet)</em>}</span>
                                </div>
                                <div className="text-gray-400 truncate">
                                  💬 Last Activity: <span className="text-gray-200 italic">&ldquo;{st.lastQuery}&rdquo;</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10 text-[10px]">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleQuickBanToggle(st.admissionNo); }}
                                  className={`px-2 py-1 rounded font-bold cursor-pointer ${
                                    isThisStudentBanned ? 'bg-emerald-600 text-white' : 'bg-red-700/40 hover:bg-red-600 text-red-200'
                                  }`}
                                >
                                  {isThisStudentBanned ? '✨ Revive ID' : '📓 Block ID'}
                                </button>
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
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* 2. GLOBAL FLYING ANNOUNCEMENT BROADCAST (Flies in on all screens + Bell Sound) */}
                  <form onSubmit={handleSaveBroadcast} className="p-5 rounded-2xl bg-black/70 border border-amber-500/40 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <span>🔔📢</span> Sovereign Flying Announcement (Flies Letter-by-Letter + Bell Sound &amp; Pinned Top Bar)
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={broadcastInput}
                        onChange={(e) => setBroadcastInput(e.target.value)}
                        placeholder="Type announcement (flies onto all screens & plays after login intro with Bell sound)..."
                        className="flex-1 bg-white/5 border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                      <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer">
                        🔔 Launch Flying Broadcast
                      </button>
                    </div>
                  </form>

                  {/* 2B. SHINIGAMI REQUEST BOX CONTROL: CHANGE SECRET CODE ANYTIME + STUDENT PETITIONS INBOX */}
                  <div className="p-5 rounded-2xl bg-black/70 border border-amber-500/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                          <span>⛩️🗝️</span> Hidden &ldquo;To ikA&rdquo; Request Box — Secret Code &amp; Petitions ({ikaRequests.length})
                        </h4>
                        <p className="text-[11px] text-gray-400">
                          Students with this code skip the 2-min wait &amp; 8h cooldown and unlock <strong>11 Request Box messages</strong>!
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-black">
                        Active Code: {requestBoxSecretCode}
                      </span>
                    </div>

                    {/* Change Secret Code Form */}
                    <form onSubmit={handleBossChangeSecretCode} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newSecretCodeInput}
                        onChange={(e) => setNewSecretCodeInput(e.target.value.toUpperCase())}
                        placeholder="Enter new Secret Code for Early Access & 11 Requests (e.g. RYUK99)..."
                        className="flex-1 bg-white/5 border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-white font-mono uppercase outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase cursor-pointer"
                      >
                        🔑 Change Access Code Live
                      </button>
                    </form>

                    {/* Incoming Student Petitions List */}
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {ikaRequests.length === 0 ? (
                        <p className="text-xs text-gray-500 italic text-center py-3">
                          No petitions in the Forbidden Request Box yet.
                        </p>
                      ) : (
                        ikaRequests.map((req) => (
                          <div
                            key={req.id}
                            className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 space-y-2"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{req.studentName}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                                  {req.studentAdmissionNo}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                                  {req.category}
                                </span>
                                {req.usedSecretCode && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-black">
                                    🗝️ VIP CODE
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-gray-400">{req.timestamp}</span>
                            </div>

                            <p className="text-xs text-gray-200 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                              &ldquo;{req.text}&rdquo;
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                              <input
                                type="text"
                                value={bossRequestReplyInputs[req.id] || ''}
                                onChange={(e) =>
                                  setBossRequestReplyInputs((prev) => ({ ...prev, [req.id]: e.target.value }))
                                }
                                placeholder="Optional decree reply to student..."
                                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                              />
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleBossResolveRequest(req.id, 'granted')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                                >
                                  ⚡ Grant
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBossResolveRequest(req.id, 'denied')}
                                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold cursor-pointer"
                                >
                                  💀 Deny
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBossResolveRequest(req.id, 'denied', true)}
                                  className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-[11px] cursor-pointer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 3. 2-WAY LIVE SHINIGAMI CHAT WITH ANY STUDENT */}
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

                  {/* 4. DEATH NOTE ID BAN FORM (Can Ban Any Student Including Agrima) */}
                  <form onSubmit={handleAddBan} className="p-5 rounded-2xl bg-black/70 border border-red-500/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                      <span>📓</span> Write ID in the Death Note (Stop Anyone&apos;s Login — Including Queen Agrima)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" required value={banInputTarget} onChange={(e) => setBanInputTarget(e.target.value)} placeholder="Admission No (e.g. 2026B01010219), Roll No, or Name" className="bg-white/5 border border-red-500/30 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-red-500 font-mono" />
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
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW: COMBINED SAFE BUNK & AUTONOMOUS SGPA SUITE (ONE WINDOW!)
             ================================================================= */}
          {currentWindow === 'bunk_sgpa' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-12">
                {/* SECTION 1: SAFE BUNK CALCULATOR */}
                <div className={`p-6 rounded-3xl ${themeClasses} border shadow-2xl space-y-5`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-2xl">🛡️</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">1. Safe Bunk &amp; 75% Attendance Buffer Calculator</h3>
                      <p className="text-xs text-gray-400">Strictly calibrated to the ABES autonomous 75% attendance rule</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Total Classes Conducted</label>
                      <input type="number" min="1" value={totalClasses} onChange={(e) => setTotalClasses(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Classes Attended</label>
                      <input type="number" min="0" value={attendedClasses} onChange={(e) => setAttendedClasses(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none" />
                    </div>
                  </div>
                  <div className={`p-5 rounded-2xl border ${attendanceStats.isSafe ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-red-950/30 border-red-500/40 text-red-200'} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase">Current Attendance Percentage:</span>
                      <span className="text-2xl font-mono font-extrabold">{attendanceStats.pct}%</span>
                    </div>
                    <p className="text-sm font-medium">{attendanceStats.message}</p>
                  </div>
                </div>

                {/* SECTION 2: AUTONOMOUS SGPA & INTERNAL MARKS PREDICTOR */}
                <div className={`p-6 rounded-3xl ${themeClasses} border shadow-2xl space-y-5`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">🧮</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">2. Autonomous SGPA &amp; Internal Marks Predictor</h3>
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
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center"><div className="text-[10px] uppercase text-emerald-300 font-bold">Grade &amp; SGPA</div><div className="text-lg font-mono font-black text-emerald-400 mt-1">{sgpaStats.gp}.0 SGPA ({sgpaStats.grade.split(' ')[0]})</div></div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs text-gray-300">
                    <div>🎯 <strong>Target 9.0 SGPA (A+ / 80M):</strong> Need <strong>{sgpaStats.neededFor9SGPA > 40 ? '40+ (Increase Internals!)' : `${sgpaStats.neededFor9SGPA} / 40`}</strong> in End-Sem.</div>
                    <div>🏆 <strong>Target 10.0 SGPA (O / 90M):</strong> Need <strong>{sgpaStats.neededFor10SGPA > 40 ? '40+ (Increase Internals!)' : `${sgpaStats.neededFor10SGPA} / 40`}</strong> in End-Sem.</div>
                  </div>
                </div>
                <MoreComingSoonBanner sectionName="Safe Bunk & SGPA Suite" />
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW: LIVE ABES CANTEEN MENUS (TEA MEN'S CAFE & BOYS HOSTEL K.J CAFE)
             ================================================================= */}
          {currentWindow === 'canteen' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-5 animate-in fade-in zoom-in-95 duration-200 pb-12">
                <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-950/40 via-black to-amber-950/30 border border-orange-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold uppercase">
                      🍔 Official Rate Lists • Campus &amp; Boys Hostel
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">ABES Live Canteen &amp; Cafe Menus ☕🍜</h3>
                    <p className="text-xs text-gray-300">
                      Search <strong>&ldquo;Boys hostel waali canteen&rdquo;</strong> (K.J Cafe) or <strong>&ldquo;College upper waali canteen&rdquo;</strong> (Tea Men&apos;s Cafe)!
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowCanteenBoardPhotos(!showCanteenBoardPhotos)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-amber-300 border border-amber-500/30 cursor-pointer transition"
                    >
                      {showCanteenBoardPhotos ? '🙈 Hide Original Menu Boards' : '📸 View Original Menu Photos'}
                    </button>
                  </div>
                </div>

                {/* Original Uploaded Menu Board Photos Toggle */}
                {showCanteenBoardPhotos && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-3xl bg-black/70 border border-white/15">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-300 block">🏫 Tea Men&apos;s Cafe (College Upper Canteen)</span>
                      <img src="/tea men's cafe.jpeg" alt="Tea Men's Cafe Menu" className="w-full rounded-2xl border border-white/15 object-cover" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-300 block">🏠 K.J Cafe (Boys Hostel Waali Canteen)</span>
                      <img src="/boys hostel canteen.jpeg" alt="Boys Hostel K.J Cafe Menu" className="w-full rounded-2xl border border-white/15 object-cover" />
                    </div>
                  </div>
                )}

                {/* Filter Tabs + Live Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 flex-shrink-0 overflow-x-auto">
                    <button
                      onClick={() => setCanteenTab('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        canteenTab === 'all' ? 'bg-orange-600 text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🍽️ Both Canteens ({ALL_CANTEEN_ITEMS.length})
                    </button>
                    <button
                      onClick={() => setCanteenTab('teamen')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        canteenTab === 'teamen' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🏫 Tea Men&apos;s Cafe (College Upper)
                    </button>
                    <button
                      onClick={() => setCanteenTab('hostel')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        canteenTab === 'hostel' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🏠 K.J Cafe (Boys Hostel)
                    </button>
                  </div>

                  <input
                    type="text"
                    value={canteenSearch}
                    onChange={(e) => setCanteenSearch(e.target.value)}
                    placeholder="Search dish or canteen (e.g. Maggi, Kurkure Momos, Samosa, Cold Coffee, Paratha, Boys Hostel)..."
                    className="flex-1 bg-black/40 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>

                {/* Canteen Important Notice Strip */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex flex-wrap items-center justify-between gap-2">
                  <span>⚠️ <strong>Tea Men&apos;s Cafe Rule:</strong> Peak time me <strong>CASH PAYMENT ONLY</strong>! Order cancel/exchange nahi hota &amp; packing charges extra.</span>
                  <span>🏠 <strong>K.J Cafe Rule:</strong> Extra Amul/Mother Dairy butter ₹10 extra.</span>
                </div>

                {/* Menu Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredCanteenItems.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              it.canteen === 'teamen'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {it.canteen === 'teamen' ? "🏫 Tea Men's (Upper)" : '🏠 K.J Cafe (Hostel)'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{it.category}</span>
                          {it.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                              {it.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white break-words">{it.name}</h4>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-base font-mono font-black text-emerald-400">{it.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <MoreComingSoonBanner sectionName="Campus & Hostel Canteen Menus" />
              </div>
            </div>
          )}

          {/* VIEW: PLACEMENT & PACKAGES REALITY */}
          {currentWindow === 'placement' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-lg text-white">Campus Placement &amp; Package Reality</h3><p className="text-xs text-gray-400">Click any card to discuss that exact topic with the AI Oracle!</p></div>
                  <button onClick={() => sendQuery('Kya 50 LPA ka package lagta hai?', true)} className={`text-xs ${accentText} hover:underline cursor-pointer`}>Ask in AI Chat ↗</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => sendQuery('Kya 50 LPA ka package lagta hai?', true)} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-yellow-500/40 transition shadow-lg space-y-3 cursor-pointer">
                    <h4 className="font-bold text-sm text-white">💰 Salary Package Breakdown</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li>• <strong>3.5 – 5.0 LPA (60-65%):</strong> Bulk recruiters (TCS Ninja, Infosys, Cognizant, Wipro).</li>
                      <li>• <strong>6.0 – 9.0 LPA (15-20%):</strong> TCS Digital, Nucleus Software, Nagarro, Hexaware.</li>
                      <li>• <strong>10.0 – 18.0 LPA (5-8%):</strong> Cisco, BNY Mellon, MAQ Software, Super Dream offers.</li>
                      <li>• <strong>20.0 – 60.0 LPA (Under 2%):</strong> Atlassian (59.9 LPA), Microsoft, Google.</li>
                    </ul>
                  </div>
                  <div onClick={() => sendQuery('CGPA kitni matter karti hai?', true)} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 transition shadow-lg space-y-3 cursor-pointer">
                    <h4 className="font-bold text-sm text-white">🎯 CGPA Truth &amp; Thresholds</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li>• <strong>Below 6.0:</strong> Disqualified from 90% company placement tests.</li>
                      <li>• <strong>6.0 – 7.5:</strong> Basic eligibility for service companies with 0 backlogs.</li>
                      <li>• <strong>7.5 – 8.0 (Sweet Spot):</strong> Safe for 90%+ company eligibility filters.</li>
                      <li>• <strong>8.5+:</strong> Required for resume shortlisting in high-applicant drives.</li>
                    </ul>
                  </div>
                  <div onClick={() => sendQuery('Real placement record kitna hai?', true)} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/40 transition shadow-lg space-y-3 cursor-pointer">
                    <h4 className="font-bold text-sm text-white">📊 Real Placement Numbers</h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li>• <strong>NIRF Median Package:</strong> ₹4.50 – ₹5.75 LPA for B.Tech.</li>
                      <li>• <strong>Unique Placed Students:</strong> ~850–900 out of ~1,100 graduates (~80%).</li>
                      <li>• <strong>Multiple Offers:</strong> 1,600+ total offers reflect top performers bagging 2–3 offers each.</li>
                    </ul>
                  </div>
                  <div onClick={() => sendQuery('15+ LPA crack karne ka roadmap kya hai?', true)} className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 transition shadow-lg space-y-3 cursor-pointer">
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

          {/* VIEW: FACULTY DOSSIERS (100% COMPLETE DATA FOR ALL 7 PROFESSORS + COMING SOON FOOTER) */}
          {currentWindow === 'faculty' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white">Section CSE-2 Faculty Dossiers</h3>
                    <p className="text-xs text-gray-400">Complete classroom reality guides, academic pedigrees &amp; survival tips</p>
                  </div>
                  <button onClick={() => sendQuery('Show all faculty', true)} className={`text-xs ${accentText} hover:underline cursor-pointer`}>
                    View Full Directory in Chat ↗
                  </button>
                </div>

                {/* 1. DR. PRERANA MOHAPATRA */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-white/[0.04] to-white/[0.02] border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                      <img src={prernaPhotoTab === 'profile' ? '/prerna1.jpeg' : '/prerna2.jpeg'} alt="Dr. Prerana Mohapatra" className="w-full h-full object-cover" />
                    </div>
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
                        <p className="text-xs text-gray-400">Assistant Professor | Electrical &amp; Electronics Engineering</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href="https://www.linkedin.com/in/dr-prerana-mohapatra-227563147" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                        <a href="https://www.instagram.com/prerana_mohapatra?rpxt=MWR5YmpnZ20zaXNsZg==" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">📷 Instagram ↗</a>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-200/90 italic bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      &ldquo;Effortlessly graceful, soft-spoken, aur class me unmatched academic brilliance!&rdquo; 📚💫
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>Ph.D:</strong> Power Electronics (NIT Rourkela, 9.21 CGPA)</div>
                      <div>📘 <strong>M.Tech / Dual:</strong> Power Systems (ITER, 9.64 CGPA)</div>
                      <div>🥇 <strong>B.Tech:</strong> EEE (SOA University, 9.65 CGPA)</div>
                      <div>🔋 <strong>Focus:</strong> EV Charging, PV Grid Integration &amp; AI/ML</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">
                      💡 <strong>Survival Tip:</strong> Pay genuine attention, maintain class decorum, and ask thoughtful questions—her polite demeanor makes doubt-clearing stress-free!
                    </div>
                    <button onClick={() => sendQuery('Dr. Prerana Mohapatra ka profile dikhao', true)} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow cursor-pointer">
                      View Complete Dossier in Chat 💬
                    </button>
                  </div>
                </div>

                {/* 2. DR. DIVYANSHI SHARMA */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-950/30 via-white/[0.04] to-white/[0.02] border border-teal-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                      <img src={divyanshiPhotoTab === 'profile' ? '/divyanshi1.jpeg' : '/divyanshi2.jpeg'} alt="Dr. Divyanshi Sharma" className="w-full h-full object-cover" />
                    </div>
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
                        <p className="text-xs text-gray-400">Assistant Professor | Applied Sciences &amp; Humanities</p>
                      </div>
                      <a href="https://www.linkedin.com/in/dr-divyanshi-sharma-53606b73" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-teal-200/90 italic bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20">
                      &ldquo;The warmest soul on campus—endlessly patient, genuinely caring, aur har student ki ultimate guardian angel.&rdquo; 🌸💚
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>Education:</strong> Ph.D. in Organic Chemistry</div>
                      <div>🏫 <strong>Schooling:</strong> AKP Inter College, Hapur</div>
                      <div>⏳ <strong>Experience:</strong> 15+ Years at ABES (PIET, GBIT, SSV)</div>
                      <div>🌿 <strong>Domain:</strong> Applied Chemistry &amp; Green Sustainability</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">
                      💡 <strong>Survival Tip:</strong> Sincere raho, lab files time pe do, aur honesty maintain karo—she values genuine efforts over fake excuses!
                    </div>
                    <button onClick={() => sendQuery('Dr. Divyanshi Sharma ke baare me batao', true)} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow cursor-pointer">
                      View Complete Dossier in Chat 💬
                    </button>
                  </div>
                </div>

                {/* 3. PROF. SHIVAM MITTAL */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-white/[0.04] to-white/[0.02] border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden flex-shrink-0">
                    <img src="/shivam.jpeg" alt="Prof. Shivam Mittal" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">The Alma Mater Specialist • CSE</div>
                        <h4 className="text-xl font-bold text-white mt-1">Prof. Shivam Mittal</h4>
                        <p className="text-xs text-gray-400">Assistant Professor | Computer Science &amp; Engineering</p>
                      </div>
                      <a href="https://www.linkedin.com/in/shivam-mittal-408a31210" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-indigo-200/90 italic bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                      &ldquo;Jis college se padhai shuru ki, wahi podium sambhal liya—The Ultimate Campus Loyalty Loop!&rdquo; 🔄🏫
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>M.Tech:</strong> CSE (ABES, 2024–2026, 8.6 Grade)</div>
                      <div>⚙️ <strong>B.Tech:</strong> CSE (ABESIT, 2020–2024, 7.6 Grade)</div>
                      <div>✈️ <strong>Ex-Corporate:</strong> Auditor @ Cleartrip (1 yr 1 mo)</div>
                      <div>🤫 <strong>12th Board:</strong> &ldquo;Clear ho gaya, bas number mat poochna!&rdquo;</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">
                      💡 <strong>Survival Tip:</strong> Faltu ke bahane mat banao—jo bahane tum soch rahe ho, wo unhone khud isi campus me invent kiye the!
                    </div>
                    <button onClick={() => sendQuery('Prof. Shivam Mittal ki lore batao', true)} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow cursor-pointer">
                      View Complete Dossier in Chat 💬
                    </button>
                  </div>
                </div>

                {/* 4. PROF. VIMAL SRIVASTAVA */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-white/[0.04] to-white/[0.02] border border-blue-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                      <img src={vimalPhotoTab === 'formal' ? '/vimal1.jpeg' : '/vimal2.jpeg'} alt="Prof. Vimal Srivastava" className="w-full h-full object-cover" />
                    </div>
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
                        <p className="text-xs text-gray-400">Mathematics Professor | Applied Sciences &amp; Humanities</p>
                      </div>
                      <a href="https://www.linkedin.com/in/vimal-srivastava-9585a5265" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-blue-200/90 italic bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
                      &ldquo;Derivations pe zero compromise, but off-topic roast aur comedy timing is pure peak entertainment!&rdquo; 🎙️⚡<br />
                      <strong className="text-white mt-1 block">Signature Catchphrase: <em>&ldquo;Are you getting it?!&rdquo;</em></strong>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>Qualifications:</strong> Ph.D. &amp; M.Sc. in Mathematics</div>
                      <div>🎯 <strong>National Exams:</strong> GATE &amp; UGC NET Qualified</div>
                      <div>⏳ <strong>Experience:</strong> 21+ Years (ABES &amp; ABESIT)</div>
                      <div>🤖 <strong>Tech Interests:</strong> Numerical Analysis &amp; Machine Learning</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">
                      💡 <strong>Survival Tip:</strong> Stay alert, respond to <em>&ldquo;Are you getting it?&rdquo;</em>, and maintain clean derivation notebooks!
                    </div>
                    <button onClick={() => sendQuery('Prof. Vimal Srivastava ke baare me batao', true)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow cursor-pointer">
                      View Complete Dossier in Chat 💬
                    </button>
                  </div>
                </div>

                {/* 5. DR. KARTIKA MAHESHWARI */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-950/30 via-white/[0.04] to-white/[0.02] border border-pink-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 h-60 rounded-2xl bg-black/40 border border-white/10 flex-shrink-0 overflow-hidden">
                    <img src="/kartika.jpeg" alt="Prof. Kartika Maheshwari" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase">Featured Faculty • Applied Physics (25AS101)</div>
                        <h4 className="text-xl font-bold text-white mt-1">Dr. Kartika Maheshwari (KM)</h4>
                        <p className="text-xs text-gray-400">Senior Assistant Professor | Applied Sciences &amp; Humanities</p>
                      </div>
                      <a href="https://www.linkedin.com/in/kartika-maheshwari-36178517b" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                    </div>
                    <p className="text-xs text-pink-200/90 italic bg-pink-500/10 p-2.5 rounded-xl border border-pink-500/20">
                      &ldquo;Sweetest smile in the faculty lounge, sharpest red pen in the exam hall.&rdquo; ☕✍️
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🚗 <strong>Vibe:</strong> Cruises in her trusty Tata Tigor!</div>
                      <div>🎓 <strong>Ph.D:</strong> Material Science (DTU, 2017)</div>
                      <div>📚 <strong>Education:</strong> M.Sc. Physics (RKD College)</div>
                      <div>🏫 <strong>Experience:</strong> Over 15+ Years at ABES</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">
                      💡 <strong>Survival Tip:</strong> Neat ray diagrams banao, proper quantum derivations likho, aur numerical answers ke aage unit likhna mat bhoolna!
                    </div>
                    <button onClick={() => sendQuery('Prof. Kartika Maheshwari ke baare me batao', true)} className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow cursor-pointer">
                      View Classroom Survival Guide 💬
                    </button>
                  </div>
                </div>

                {/* 6. MS. SHAILJA VARSHNEY */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-white/[0.04] to-white/[0.02] border border-purple-500/30 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-52 flex-shrink-0 flex flex-col gap-2.5">
                    <div className="w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                      <img src={shailjaPhotoTab === 'campus' ? '/shailja1.jpeg' : '/shailja2.jpeg'} alt="Ms. Shailja Varshney" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-semibold text-center">
                      <button onClick={() => setShailjaPhotoTab('campus')} className={`py-1 rounded-lg cursor-pointer ${shailjaPhotoTab === 'campus' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>🏛️ Campus</button>
                      <button onClick={() => setShailjaPhotoTab('aesthetic')} className={`py-1 rounded-lg cursor-pointer ${shailjaPhotoTab === 'aesthetic' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}>✨ Aesthetic</button>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">Computer Science • C &amp; C++ Programming (25CS101)</div>
                        <h4 className="text-xl font-bold text-white mt-1">Ms. Shailja Varshney (SHV)</h4>
                        <p className="text-xs text-gray-400">Assistant Professor | Computer Science &amp; Engineering</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href="https://www.linkedin.com/in/shailja-varshney-778ab91b5" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#0077b5]/20 text-blue-300 border border-[#0077b5]/30 text-xs font-semibold">in LinkedIn ↗</a>
                        <a href="https://www.instagram.com/varshney.shailja?vrfl=MXkyMjJyY2NpZWo2OA==" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">📷 Instagram ↗</a>
                      </div>
                    </div>
                    <p className="text-xs text-purple-200/90 italic bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
                      &ldquo;Slides strictly line-by-line, syllabus bilkul by-heart, aur 24/7 aesthetic reel creator energy!&rdquo; 🎬📖
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>🎓 <strong>M.Tech:</strong> CSE (AMU, 8.8 CGPA)</div>
                      <div>⚙️ <strong>B.Tech:</strong> CSE (Mangalayatan, 88%)</div>
                      <div>🏛️ <strong>ABES:</strong> Mar 2025 – Present</div>
                      <div>⏳ <strong>Previous:</strong> ITS, Sunderdeep &amp; RKGIT</div>
                    </div>
                    <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">
                      💡 <strong>Survival Tip:</strong> PPT ki exact lines likho, unscripted edge-case coding doubts mat pucho, aur slide transitions pe nod karo!
                    </div>
                    <button onClick={() => sendQuery('Ms. Shailja Varshney ke baare me batao', true)} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow cursor-pointer">
                      View Complete Dossier in Chat 💬
                    </button>
                  </div>
                </div>

                {/* 7. MR. RAHUL SINGH */}
                <div className={`p-6 rounded-3xl ${themeClasses} border shadow-2xl space-y-3`}>
                  <div className="inline-flex px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">Artificial Intelligence • Essentials of AI (25AI101)</div>
                  <h4 className="text-xl font-bold text-white">Mr. Rahul Singh (RS)</h4>
                  <p className="text-xs text-gray-300">Assistant Professor | Computer Science &amp; Engineering</p>
                  <p className="text-xs text-blue-200/90 italic bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
                    &ldquo;AI human developers ko replace nahi karega, par AI smartly use karne wale engineer sabse aage rahenge.&rdquo; 🧠🤖
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>🐍 <strong>Core Stack:</strong> Python &amp; Intelligent Agents</div>
                    <div>🔍 <strong>Algorithms:</strong> A*, BFS/DFS &amp; State-Space Search</div>
                  </div>
                  <div className="text-xs text-gray-400 border-t border-white/[0.06] pt-2">
                    💡 <strong>Survival Tip:</strong> Python practicals aur search algorithm graphs step-by-step solve karo—internals me full marks milenge!
                  </div>
                  <button onClick={() => sendQuery('Mr. Rahul Singh ke baare me batao', true)} className={`px-4 py-2 rounded-xl ${accentBg} text-white text-xs font-semibold shadow cursor-pointer`}>
                    View Complete Dossier in Chat 💬
                  </button>
                </div>

                {/* MORE COMING SOON AT THE END OF FACULTY DOSSIERS */}
                <MoreComingSoonBanner sectionName="Faculty Dossiers" />
              </div>
            </div>
          )}

          {/* VIEW: SAMPLE PAPERS (ALL 10 SUBJECTS WITH ONE-CLICK SOLVED MT-2 ANSWER KEY) */}
          {currentWindow === 'papers' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
              <div className="w-full max-w-4xl space-y-4 animate-in fade-in zoom-in-95 duration-200 pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/10 gap-3">
                  <div><h3 className="font-bold text-sm text-white">Question Papers &amp; Solved MT-2 Answer Keys</h3><p className="text-[11px] text-gray-400">All 10 Subjects • Official MT-1 &amp; MT-2 Papers + Complete Solved Answer Keys</p></div>
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
                            sendQuery(cmdMap[paper.id] || `Solve full ${paper.short} MT2 paper`, true);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/30 transition cursor-pointer"
                        >
                          ✅ View Solved MT-2 Answer Key (Sec A, B &amp; C)
                        </button>
                        <button onClick={() => sendQuery(selectedTerm === 'mt1' ? `${paper.short} MT 1 paper dikhao` : selectedTerm === 'mt2' ? `${paper.short} MT 2 paper dikhao` : `${paper.short} both MT 1 and MT 2 paper dikhao`, true)} className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-red-600/25 via-blue-600/25 to-purple-600/25 hover:from-red-600/40 hover:to-purple-600/40 text-white text-xs font-semibold border border-white/15 transition cursor-pointer">
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
                <MoreComingSoonBanner sectionName="Solved Sample Papers & Answer Keys" />
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
                      {msg.role === 'user' ? <p className="text-sm">{msg.content}</p> : <FormattedMessage text={msg.content} onSelectSuggestion={(q, fromSugg) => sendQuery(q, fromSugg)} isAgrima={isAgrima} />}
                    </div>
                  </div>
                ))}
                {streamingText && (
                  <div className="flex gap-4 justify-start">
                    <div className={`w-8 h-8 rounded-xl ${ikaRedBlackBox} flex-shrink-0 flex items-center justify-center text-[10px] font-black animate-pulse`}>ikA</div>
                    <div className="max-w-[90%] md:max-w-[85%] rounded-3xl px-5 py-4 bg-black/60 border border-white/10 text-gray-200 backdrop-blur-md">
                      <FormattedMessage text={streamingText} onSelectSuggestion={(q, fromSugg) => sendQuery(q, fromSugg)} isAgrima={isAgrima} />
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

          {/* VIEW: TIMETABLE + OFFICIAL ACADEMIC CALENDAR & SYLLABUS PDFs UNDERNEATH */}
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

                {/* WEEKLY CLASS TIME TABLE */}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/[0.04] text-gray-400 uppercase text-[10px] font-semibold border-b border-white/10">
                      <tr><th className="p-3.5">Day</th><th className="p-3.5">08:50 - 10:30 AM</th><th className="p-3.5">10:40 - 12:20 PM</th><th className="p-3.5">12:20 - 01:10</th><th className="p-3.5">01:10 - 02:50 PM</th><th className="p-3.5">02:50 - 04:30 PM</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] font-mono text-[11px]">
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Mon</td><td className="p-3.5 text-cyan-400">Ess. of AI &amp; Physics</td><td className="p-3.5 text-blue-400">Maths &amp; Electrical</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-purple-400">Prog in C &amp; Maths</td><td className="p-3.5 text-emerald-400">Physics Lab (KC-310)</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Tue</td><td className="p-3.5 text-orange-400">Web Design &amp; Maths</td><td className="p-3.5 text-cyan-400">Ess. of AI &amp; EVS</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-purple-400">Prog in C++ Lab</td><td className="p-3.5 text-emerald-400">Physics &amp; Electrical</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Wed</td><td className="p-3.5 text-blue-400">Electrical &amp; Prog in C</td><td className="p-3.5 text-blue-400">Maths &amp; Physics</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-yellow-400">Basic Elec Lab</td><td className="p-3.5 text-pink-400">Mentor-Mentee</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Thu</td><td className="p-3.5 text-blue-400">Maths &amp; Electrical</td><td className="p-3.5 text-red-400">CAD Lab (RJ-109)</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-emerald-400">Physics &amp; EVS</td><td className="p-3.5 text-purple-400">Prog in C &amp; Maths</td></tr>
                      <tr><td className="p-3.5 font-sans font-semibold text-white">Fri</td><td className="p-3.5 text-purple-400">Prog in C &amp; Physics</td><td className="p-3.5 text-orange-400">Web Design Workshop</td><td className="p-3.5 text-gray-500 italic">Lunch</td><td className="p-3.5 text-blue-400">Maths &amp; EVS</td><td className="p-3.5 text-cyan-400">Electrical &amp; Ess. of AI</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* OFFICIAL PDF DOCUMENTS UNDER TIMETABLE (VIEW & DOWNLOAD) */}
                <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>📂</span> Official ABES Academic Calendar &amp; B.Tech 1st Year Syllabus PDFs
                      </h4>
                      <p className="text-xs text-gray-400">
                        Click <strong>👁️ View</strong> to read the PDF right here, <strong>↗ Full Tab</strong> for fullscreen, or <strong>📥 Download</strong>!
                      </p>
                    </div>
                    <button
                      onClick={() => sendQuery('B.Tech 1st Sem ka full Academic Calendar dikhao 📅', true)}
                      className={`text-xs ${accentText} hover:underline cursor-pointer`}
                    >
                      Ask AI About Dates &amp; Syllabus ↗
                    </button>
                  </div>

                  <PaperDownloadCard
                    title="📅 ABES Academic Calendar — ODD Semester 2026-27 (Revised on 26.10.2026)"
                    filesCsv="/academic_calendar.pdf"
                  />

                  <PaperDownloadCard
                    title="📘 ABES B.Tech 1st Year Complete Autonomous Syllabus (105 Pages • Sem-I & II)"
                    filesCsv="/btech_syllabus.pdf"
                  />
                </div>

                <MoreComingSoonBanner sectionName="Live Class Time Table" />
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
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/30 space-y-2"><span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Step 3</span><h4 className="font-semibold text-sm text-white">Application &amp; Final Print</h4><p className="text-xs text-gray-300">Login Fresh, fill form, check preview print, and submit hardcopy with DigiLocker marksheets at ABES.</p></div>
                </div>
                <MoreComingSoonBanner sectionName="Scholarship & Document Guides" />
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
                    <p className="text-xs text-gray-400">Synced across Laptop &amp; Mobile! Type <span className="text-emerald-300 font-mono">&ldquo;I want to sell my drafter for 250 no. - 9811223344&rdquo;</span> or use form:</p>
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
                      <button onClick={() => sendQuery(`Connect me with the seller of ${item.title}`, true)} className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition border border-white/10 cursor-pointer">
                        Get Seller Info in Chat 💬
                      </button>
                    </div>
                  ))}
                </div>
                <MoreComingSoonBanner sectionName="P2P Student Marketplace" />
              </div>
            </div>
          )}

          {/* VIEW: COMING SOON MODULES (CABIN NAVIGATOR & ASSIGNMENT TRACKER) */}
          {(currentWindow === 'cabin' || currentWindow === 'assignments') && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center w-full">
              <div className={`w-full max-w-lg p-8 rounded-3xl ${themeClasses} border shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200`}>
                <div className="mx-auto w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(220,38,38,0.25)] animate-bounce">
                  {currentWindow === 'cabin' ? '🧭' : '📝'}
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    🚧 Under Construction in ikA&apos;s Lab
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                    {currentWindow === 'cabin' ? 'Faculty Cabin Navigator' : 'CSE-2 Assignment Tracker'}
                  </h3>
                  <p className="text-lg font-extrabold text-red-400 tracking-widest uppercase animate-pulse">
                    Coming Soon... ⚡
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {currentWindow === 'cabin'
                    ? 'Exact block, floor, and cabin numbers for every ABES faculty member are being mapped into the neural matrix.'
                    : 'Live submission deadlines, lab file alerts, and pending assignment checklists for Section CSE-2 will unlock here soon.'}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentWindow('home')}
                    className={`px-6 py-2.5 rounded-xl ${accentBg} hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition cursor-pointer`}
                  >
                    ← Back to Overview
                  </button>
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
                    ? 'Hukum kijiye Supreme Boss ikA (e.g. Boys hostel canteen, Solve full AI MT2 paper, 250+ jokes)...'
                    : isAgrima
                    ? 'Aapka kya hukum hai My Queen Agrima? 🌸 (e.g. Tea Men cafe menu, Solve full AI MT2 paper)...'
                    : `Talk in Hinglish or ask anything, ${currentUser.name.split(' ')[0]} (e.g. Ye kya hai?, Boys hostel canteen, Solve Physics MT2)...`
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