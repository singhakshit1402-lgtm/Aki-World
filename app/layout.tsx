import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "ikA's World | ABES Section CSE-2 Sovereign Portal",
  description:
    'Official Section CSE-2 Hub at ABES Engineering College. All 10 Solved MT-2 Papers, Live Canteen Menus (Tea Men Cafe & Boys Hostel KJ Cafe), Safe Bunk & SGPA Suite, Faculty Dossiers, and P2P Marketplace.',
  keywords: [
    'ABES Engineering College',
    'ABES CSE-2',
    'ikA Portal',
    'ABES MT-2 Solved Papers',
    'Tea Mens Cafe ABES',
    'KJ Cafe Boys Hostel ABES',
    'Safe Bunk Calculator ABES',
  ],
  openGraph: {
    title: "👑 ikA's World — ABES Section CSE-2 Portal 💀🍎",
    description:
      '10/10 Solved MT-2 Papers, Faculty Survival Dossiers, Live Hostel & Campus Canteen Menus, Safe Bunk & SGPA Calculator.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090b10] text-gray-100 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}