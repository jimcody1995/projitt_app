'use client';

import React from 'react';
import { JSX } from 'react';
import { useEffect } from 'react';
import { getCountry, getSkills } from '@/api/basic';
import { useBasic } from '@/context/BasicContext';
import { useSession } from '@/context/SessionContext';

/**
 * ApplicantLayout component loads necessary basic data such as country and skills
 * once the user session is authenticated. It wraps around child components to provide
 * context and layout styling for applicant-related pages.
 *
 * @param children - React nodes to be rendered within the layout.
 * @returns JSX.Element wrapping the children with layout styles.
 */
export default function ApplicantLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const { setCountry } = useBasic();
  const { session } = useSession();

  /**
   * Loads country data when the session is authenticated.
   * Runs once on component mount or when session changes.
   */
  useEffect(() => {
    if (session.authenticated) {
      const loadCountry = async () => {
        const response = await getCountry();
        setCountry(response.data.data);
      };
      loadCountry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]); // Runs only once on mount

  const { setSkills } = useBasic();

  /**
   * Loads skills data when the session is authenticated.
   * Runs once on component mount or when session changes.
   */
  useEffect(() => {
    if (session.authenticated) {
      const loadSkills = async () => {
        const response = await getSkills();
        setSkills(response.data.data);
      };
      loadSkills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]); // Runs only once on mount
  return (
    <main
      className="grow w-full box-border py-[30px] bg-[#fafafa] overflow-y-auto"
      role="content"
      id="applicant-layout-main"
      data-testid="applicant-layout-main"
      data-test-id="applicant-layout-main"
    >
      {children}
    </main>
  );
}
