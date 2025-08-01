'use client'
import React, { JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    console.log(pathname);
    
    
  return (
    <div>
      <div className="md:pl-[84px] md:pr-[100px] pb-[32px] flex md:flex-row flex-col md:justify-between justify-center items-center gap-[20px] border-b border-[#d2d2d2]">
        <div>
          <img src="/images/zaidLLC.png" alt="logo" className="h-[32px]" />
        </div>
        <div className="flex sm:gap-[64px] gap-[10px] sm:flex-row flex-col">
          <button className={`text-[16px]/[24px] cursor-pointer ${pathname.startsWith('/applicant/my-applications') ? 'text-[#0D978B]' : 'text-[#787878] '}`} onClick={() => router.push('/applicant/my-applications')}>
            My Applications
          </button>
          <button className={`text-[16px]/[24px] cursor-pointer ${pathname.startsWith('/applicant/messages') ? 'text-[#0D978B]' : 'text-[#787878] '}`} onClick={() => router.push('/applicant/messages')}>Messages</button>
          <button className={`text-[16px]/[24px] cursor-pointer ${pathname.startsWith('/applicant/settings') ? 'text-[#0D978B]' : 'text-[#787878] '}`} onClick={() => router.push('/applicant/settings')}>Settings</button>
        </div>
        <div className="flex gap-[10px] items-center">
          <div className="w-[32px] h-[32px] rounded-full bg-[#e9e9e9] flex items-center justify-center">
            <span className="text-[#353535] text-[10px]/[17px]">AF</span>
          </div>
          <span className="text-[#4b4b4b] text-[16px]/[24px]">Ahmed Farouk</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
