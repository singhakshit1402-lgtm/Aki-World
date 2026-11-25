'use client';

import React, { useState, useEffect, useRef } from 'react';
import { subscribeDeviceForAnnouncements } from '@/lib/clientPush';

export interface StudentUser {
  name: string;
  email: string;
  admissionNo: string;
  rollNo: number;
  section: 'CSE-2' | 'CSE-8';
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

// Complete Verified CSE-8 Roster (1 to 77) — Cyber Analysis Track
export const CSE8_ROSTER: Record<string, RosterEntry> = {
  '2026B01010748': { rollNo: 1, name: 'KASHISH GOSWAMI', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010103': { rollNo: 2, name: 'KASHISH SOAM', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010679': { rollNo: 3, name: 'KAUSHLENDRA KUMAR', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011063': { rollNo: 4, name: 'KESHAV DIXIT', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010457': { rollNo: 5, name: 'KHEMCHAND SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011038': { rollNo: 6, name: 'KHUSHI CHAUDHARY', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010116': { rollNo: 7, name: 'KHUSHI MAURYA', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010300': { rollNo: 8, name: 'KHUSHI SINGH', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010142': { rollNo: 9, name: 'KISHAN PATEL', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011148': { rollNo: 10, name: 'KISHAN RAJ', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010514': { rollNo: 11, name: 'KISMITA GUPTA', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01011047': { rollNo: 12, name: 'KOMAL JINDAL', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010065': { rollNo: 13, name: 'KOUSTUBH SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010343': { rollNo: 14, name: 'KRISH AGRAWAL', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010863': { rollNo: 15, name: 'KRISH KUMAR', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010160': { rollNo: 16, name: 'KRISHABH MAURYA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010801': { rollNo: 17, name: 'KRISHAN PRATAP', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010820': { rollNo: 18, name: 'KRISHNA AGRAHARI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010622': { rollNo: 19, name: 'KRISHNA BHARDWAJ', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010838': { rollNo: 20, name: 'KRISHNA CHAUHAN', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010173': { rollNo: 21, name: 'KRISHNA GOYAL', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010507': { rollNo: 22, name: 'KRISHNA GUPTA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010870': { rollNo: 23, name: 'KRISHNA GUPTA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010966': { rollNo: 24, name: 'KRISHNA JHA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010562': { rollNo: 25, name: 'KRISHNA RAI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010489': { rollNo: 26, name: 'KRISHNA RUHELA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010614': { rollNo: 27, name: 'KRISHNA SAINI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010161': { rollNo: 28, name: 'KRISHNA SHARMA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010888': { rollNo: 29, name: 'KRISHNA SHARMA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010717': { rollNo: 30, name: 'KRISHNA SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010609': { rollNo: 31, name: 'KRISHNA SINGH YADAV', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010223': { rollNo: 32, name: 'KRISHNA SONI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010639': { rollNo: 33, name: 'KRISHNA TIWARI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010321': { rollNo: 34, name: 'KRITIKA SHARMA', group: 'G1', gender: 'F', residency: 'Day Scholar' },
  '2026B01010383': { rollNo: 35, name: 'KRRISH GAIROLA', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010462': { rollNo: 36, name: 'KUMAR ARTHAV', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010939': { rollNo: 37, name: 'KUMAR MANGALAM YADUVANSHI', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01011157': { rollNo: 38, name: 'KUNAL KAUSHIK', group: 'G1', gender: 'M', residency: 'Day Scholar' },
  '2026B01010924': { rollNo: 39, name: 'KUNAL YADAV', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010474': { rollNo: 40, name: 'KUSHAGRA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010412': { rollNo: 41, name: 'KUSHAGRA AGRAWAL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010635': { rollNo: 42, name: 'KUSHAGRA PATEL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010961': { rollNo: 43, name: 'KUSHAGRA RAJPUT', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010815': { rollNo: 44, name: 'KUSHAGRA SINGH', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010869': { rollNo: 45, name: 'KUSHAL TRIPATHI', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010670': { rollNo: 46, name: 'LAKSHAY AGARWAL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011015': { rollNo: 47, name: 'LAKSHAY RAWAT', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010772': { rollNo: 48, name: 'LAKSHITA SINGH', group: 'G2', gender: 'F', residency: 'Day Scholar' },
  '2026B01010401': { rollNo: 49, name: 'LAKSHY CHAUHAN', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010440': { rollNo: 50, name: 'LAKSHYA KHARE', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010201': { rollNo: 51, name: 'LAKSHYA PANDEY', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010860': { rollNo: 52, name: 'LAKSHYA TRIPATHI', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010017': { rollNo: 53, name: 'LALIT KUMAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010697': { rollNo: 54, name: 'LALIT YADAV', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010661': { rollNo: 55, name: 'LAVEEZA TAYYAB', group: 'G2', gender: 'F', residency: 'Hosteller' },
  '2026B01010813': { rollNo: 56, name: 'LAVIT', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010965': { rollNo: 57, name: 'LAVIT VIDHURI', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010729': { rollNo: 58, name: 'LOVEKESH DIWAKAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011112': { rollNo: 59, name: 'LUCKY SHARMA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010715': { rollNo: 60, name: 'LUCKY SINGH', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010351': { rollNo: 61, name: 'LUCKY YADAV', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010120': { rollNo: 62, name: 'MADHAV RAJBHAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010589': { rollNo: 63, name: 'MAHAK CHAUHAN', group: 'G2', gender: 'F', residency: 'Day Scholar' },
  '2026B01010558': { rollNo: 64, name: 'MAHI DUBEY', group: 'G2', gender: 'F', residency: 'Day Scholar' },
  '2026B01010218': { rollNo: 65, name: 'MAHIMA KATIYAR', group: 'G2', gender: 'F', residency: 'Day Scholar' },
  '2026B01011151': { rollNo: 66, name: 'MANAN GABA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011074': { rollNo: 67, name: 'MANAS SAJWAN', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010969': { rollNo: 68, name: 'MANAS SINGH', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010782': { rollNo: 69, name: 'MANAS TIWARI', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010188': { rollNo: 70, name: 'MANIKARNIKA', group: 'G2', gender: 'F', residency: 'Day Scholar' },
  '2026B01010811': { rollNo: 71, name: 'MANKESH KUMAR GOLA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010238': { rollNo: 72, name: 'MANTOO GUPTA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010279': { rollNo: 73, name: 'MANVI DHIMAN', group: 'G2', gender: 'F', residency: 'Day Scholar' },
  '2026B01010555': { rollNo: 74, name: 'MAYANK MISHRA', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01010029': { rollNo: 75, name: 'MAYANK PATEL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011202': { rollNo: 76, name: 'LAKSHYA GOAYL', group: 'G2', gender: 'M', residency: 'Day Scholar' },
  '2026B01011199': { rollNo: 77, name: 'MOHIT KUMAR', group: 'G2', gender: 'M', residency: 'Day Scholar' },
};

function doesEmailNameMatchRosterName(emailNameStr: string, rosterNameStr: string): boolean {
  const emailTokens = emailNameStr.toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 2);
  const rosterTokens = rosterNameStr.toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 2);

  if (emailTokens.length === 0 || rosterTokens.length === 0) return false;

  const primaryEmailName = emailTokens[0];
  const primaryRosterFirst = rosterTokens[0];

  const firstNameMatches =
    primaryEmailName === primaryRosterFirst ||
    (primaryEmailName.length >= 3 && primaryRosterFirst.startsWith(primaryEmailName)) ||
    (primaryRosterFirst.length >= 3 && primaryEmailName.startsWith(primaryRosterFirst));

  const allTokensBelong = emailTokens.every((eToken) =>
    rosterTokens.some(
      (rToken) =>
        rToken === eToken ||
        (eToken.length >= 3 && rToken.startsWith(eToken)) ||
        (rToken.length >= 3 && eToken.startsWith(rToken))
    )
  );

  return firstNameMatches && allTokensBelong;
}

function parseEmailParts(cleanEmail: string): { isBoss: boolean; namePart: string; admPart: string } {
  if (cleanEmail.startsWith('1402akshit')) {
    return { isBoss: true, namePart: 'akshit', admPart: '2026b01010274' };
  }
  const prefix = cleanEmail.split('@')[0];

  // Pattern: name.admNo or name.mid.admNo
  const dotSplit = prefix.split('.');
  if (dotSplit.length >= 2) {
    const lastPart = dotSplit[dotSplit.length - 1];
    if (/\d{4,}/.test(lastPart)) {
      const namePart = dotSplit.slice(0, -1).join('.');
      return { isBoss: false, namePart, admPart: lastPart };
    }
  }

  // Fallback regex: name followed by admission number
  const match = prefix.match(/^([a-z\s._-]+?)[._-]?((?:20)?26[a-z]?\d{6,8}|\d{7,8})$/i);
  if (match) {
    return { isBoss: false, namePart: match[1], admPart: match[2] };
  }

  return { isBoss: false, namePart: '', admPart: '' };
}

export default function RegisterModal({ onSuccess }: { onSuccess: (user: StudentUser) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [animationType, setAnimationType] = useState<'none' | 'popper' | 'boss'>('none');
  const [matchedUser, setMatchedUser] = useState<StudentUser | null>(null);
  const loginTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (loginTimerRef.current !== null) {
        window.clearTimeout(loginTimerRef.current);
      }
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (animationType !== 'none') return;
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@abes.ac.in')) {
      setError('Please apna official college email ID daalo (e.g. firstname.26b01010***@abes.ac.in)!');
      return;
    }

    const { isBoss, namePart, admPart } = parseEmailParts(cleanEmail);

    let foundAdmNo = '';
    let foundEntry: RosterEntry | null = null;
    let detectedSection: 'CSE-2' | 'CSE-8' = 'CSE-2';

    if (isBoss) {
      foundAdmNo = '2026B01010274';
      foundEntry = CSE2_ROSTER[foundAdmNo] || { rollNo: 7, name: 'AKSHIT SINGH', group: 'G1', gender: 'M', residency: 'Day Scholar' };
      detectedSection = 'CSE-2';
    } else {
      if (!namePart || !admPart) {
        setError('Email format invalid! Format must be: firstname.admissionNo@abes.ac.in (e.g. akshit.26b01010274@abes.ac.in)');
        return;
      }

      const cleanAdm = admPart.replace(/[^0-9a-z]/gi, '').toLowerCase();
      const digitsList = cleanAdm.match(/\d{4,}/g) || [];
      const digits = digitsList.sort((a, b) => b.length - a.length)[0] || cleanAdm;

      // 1. Search Section CSE-2
      for (const [admNo, entry] of Object.entries(CSE2_ROSTER)) {
        const kClean = admNo.toLowerCase();
        if (kClean.includes(cleanAdm) || kClean.endsWith(cleanAdm) || (digits.length >= 4 && (kClean.endsWith(digits) || kClean.includes(digits)))) {
          foundAdmNo = admNo;
          foundEntry = entry;
          detectedSection = 'CSE-2';
          break;
        }
      }

      // 2. Search Section CSE-8
      if (!foundEntry) {
        for (const [admNo, entry] of Object.entries(CSE8_ROSTER)) {
          const kClean = admNo.toLowerCase();
          if (kClean.includes(cleanAdm) || kClean.endsWith(cleanAdm) || (digits.length >= 4 && (kClean.endsWith(digits) || kClean.includes(digits)))) {
            foundAdmNo = admNo;
            foundEntry = entry;
            detectedSection = 'CSE-8';
            break;
          }
        }
      }

      if (!foundEntry || !foundAdmNo) {
        setError(`Admission number "${admPart}" kisi bhi official student roster me nahi mila! Kripya admission number check karein.`);
        return;
      }

      // STRICT DUAL VERIFICATION: Check that the name in the email matches the student registered with this admission number!
      const nameMatches = doesEmailNameMatchRosterName(namePart, foundEntry.name);
      if (!nameMatches) {
        setError(`Invalid Credentials! Email me diya gaya name "${namePart}" iss admission number (${foundAdmNo}) ke registered student (${foundEntry.name}) se match nahi karta.`);
        return;
      }
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
      section: detectedSection,
      group: foundEntry.group,
      gender: foundEntry.gender,
      residency: foundEntry.residency,
    };

    setMatchedUser(detectedUser);

    // Use the Login button click gesture to request device notification permission & subscribe to Web Push
    void subscribeDeviceForAnnouncements(detectedUser);

    if (foundAdmNo === '2026B01010274') {
      setAnimationType('boss');
    } else {
      setAnimationType('popper');
    }

    loginTimerRef.current = window.setTimeout(() => {
      localStorage.setItem('campus_user', JSON.stringify(detectedUser));
      onSuccess(detectedUser);
    }, 3400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 overflow-hidden select-none">
      
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

      {/* 🎉 PARTY POPPER FOR STUDENTS */}
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
              Verified {matchedUser.section || 'CSE-2'} • {matchedUser.group} {matchedUser.section === 'CSE-8' ? '• Cyber Analysis' : '• Data Analytics'}
            </div>
            <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-red-400 via-white to-red-300 bg-clip-text text-transparent">
              Our Boss invites you! 🥳🚀
            </h3>
            <p className="text-sm text-gray-200 font-medium leading-relaxed">
              Swagat hai <strong className="text-white">{matchedUser.name}</strong> ({matchedUser.admissionNo})! Boss <strong className="text-red-500">ikA</strong> welcomes you to the official Section {matchedUser.section || 'CSE-2'} realm! ⚡
            </p>
          </div>
        </div>
      )}

      {/* EMAIL-ONLY LOGIN BOX WITH RED & BLACK ikA EMBLEM */}
      {animationType === 'none' && (
        <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#090c14]/75 backdrop-blur-xl border border-red-500/35 shadow-[0_0_70px_rgba(220,38,38,0.22)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            {/* RED & BLACK ikA BOX */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-black via-zinc-950 to-red-900 border-2 border-red-600 flex items-center justify-center text-2xl font-black text-red-500 shadow-[0_0_25px_rgba(220,38,38,0.5)]">
              ikA
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-bold text-red-400 uppercase tracking-widest">
              Section CSE-2 &amp; CSE-8 Smart Auto-Login
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Enter College Email</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Naam likhne ki zaroorat nahi! Bas apni ABES email ID daalo, <strong className="text-red-400">ikA&apos;s Neural Roster</strong> tumhara Section (CSE-2 / CSE-8), Naam aur Lab Group khud pehchan lega! ✨
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="abes-email-input" className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>Official ABES Email ID</span>
                <span className="text-[10px] text-red-400 font-mono">@abes.ac.in</span>
              </label>
              <input
                id="abes-email-input"
                type="email"
                required
                autoComplete="email"
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