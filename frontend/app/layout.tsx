import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GameLobby - Gaming Platform',
  description: 'Discover the best games',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='#0A1628'/><text x='50' y='65' font-family='Arial' font-size='40' font-weight='bold' fill='#FECC02' text-anchor='middle'>GL</text></svg>"
        />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-[#0A1628]">{children}</main>
      </body>
    </html>
  );
}
