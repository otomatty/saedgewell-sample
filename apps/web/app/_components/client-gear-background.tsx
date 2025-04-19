'use client';

import dynamic from 'next/dynamic';

const GearBackground = dynamic(
  () => import('@kit/ui/gear-background').then((mod) => mod.GearBackground),
  { ssr: false }
);

export function ClientGearBackground() {
  return <GearBackground />;
}
