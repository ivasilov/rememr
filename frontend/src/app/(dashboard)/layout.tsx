import { Layout } from '@/src/components/layout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
