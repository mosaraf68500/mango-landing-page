import type { Metadata } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import './globals.css';

const hind = Hind_Siliguri({
  variable: '--font-hind',
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ফলের রাজা আম | Premium Mango Landing',
  description:
    '১০০% ফরমালিন মুক্ত প্রিমিয়াম আম — সরাসরি বাগান থেকে আপনার ঠিকানায়।',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${hind.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
