import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Achados e Perdidos',
  description: 'Objetos encontrados no campus. Procure o seu e saiba como pegar de volta.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
