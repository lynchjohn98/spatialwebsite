'use client';
import { useRouter } from 'next/navigation';

export default function Help() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold">Help</h1>
      <p className="text-xl">This is the help page.</p>
    </div>
  );
}
