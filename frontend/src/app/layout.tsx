// add fontawesome CSS so that the icons are don't cause layout shift
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import './globals.css';

export const metadata = {
  title: 'rememr',
  description: 'A stream of bookmarks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full bg-gray-100">
      <body className="font-sans">{children}</body>
    </html>
  );
}
