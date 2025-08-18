'use client';

import React, { JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

/**
 * Layout component for applicant dashboard pages.
 * Includes a header with navigation links and profile info.
 * Wraps routed child content in a consistent layout.
 */
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  /**
   * Controls navigation between tabs and tracks current route using pathname.
   */
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useSession();

  console.log(pathname);

  return (
    <div id="layout-container" data-test-id="layout-container">
      <div
        className="md:pl-[84px] md:pr-[100px] pb-[32px] flex md:flex-row flex-col md:justify-between justify-center items-center gap-[20px] border-b border-[#d2d2d2]"
        id="header"
        data-test-id="header"
      >
        <div id="logo-container" data-test-id="logo-container">
          <img
            src="/images/zaidLLC.png"
            alt="logo"
            className="h-[32px]"
            id="logo-image"
            data-test-id="logo-image"
          />
        </div>

        <div
          className="flex sm:gap-[64px] gap-[10px] sm:flex-row flex-col"
          id="nav-links"
          data-test-id="nav-links"
        >
          <button
            className={`text-[16px]/[24px] cursor-pointer ${pathname.startsWith('/applicant/my-applications') ? 'text-[#0D978B]' : 'text-[#787878]'
              }`}
            onClick={() => router.push('/applicant/my-applications')}
            id="nav-my-applications"
            data-test-id="nav-my-applications"
          >
            My Applications
          </button>
          <button
            className={`text-[16px]/[24px] cursor-pointer ${pathname.startsWith('/applicant/messages') ? 'text-[#0D978B]' : 'text-[#787878]'
              }`}
            onClick={() => router.push('/applicant/messages')}
            id="nav-messages"
            data-test-id="nav-messages"
          >
            Messages
          </button>
          <button
            className={`text-[16px]/[24px] cursor-pointer ${pathname.startsWith('/applicant/settings') ? 'text-[#0D978B]' : 'text-[#787878]'
              }`}
            onClick={() => router.push('/applicant/settings')}
            id="nav-settings"
            data-test-id="nav-settings"
          >
            Settings
          </button>
        </div>

        <div
          className="flex gap-[10px] items-center"
          id="profile-section"
          data-test-id="profile-section"
        >
          <div
            className="w-[32px] h-[32px] rounded-full bg-[#e9e9e9] flex items-center justify-center"
            id="avatar"
            data-test-id="avatar"
          >
            <span
              className="text-[#353535] text-[10px]/[17px]"
              id="avatar-initials"
              data-test-id="avatar-initials"
            >
              {session?.full_name ?
                (session.full_name.split(' ')[0]?.charAt(0)?.toUpperCase() || '') +
                (session.full_name.split(' ')[1]?.charAt(0)?.toUpperCase() || '')
                : ''}
            </span>
          </div>
          <span
            className="text-[#4b4b4b] text-[16px]/[24px]"
            id="profile-name"
            data-test-id="profile-name"
          >
            {session.full_name}
          </span>
        </div>
      </div>

      <div id="layout-children" data-test-id="layout-children">
        {children}
      </div>
    </div>
  );
}
