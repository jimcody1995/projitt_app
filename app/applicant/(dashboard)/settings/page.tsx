import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Settings component allows the user to view and update their email address.
 * It displays the current email and an input field to enter a new one.
 * UI elements are annotated with test IDs for automation.
 */
export default function Settings() {
  /**
   * Renders the settings form to change the user's email address.
   * Includes current email, new email input, and a submission button.
   */
  return (
    <div
      className="lg:px-[283px] md:px-[131px] sm:px-[20px] pt-[55px]"
      id="settings-container"
      data-test-id="settings-container"
    >
      <div
        className="w-full bg-white rounded-[16px] px-[47px] pt-[43px] pb-[57px] flex lg:flex-row flex-col justify-between"
        id="change-email-card"
        data-test-id="change-email-card"
      >
        <p
          className="font-medium text-[22px]/[30px] text-[#1c1c1c]"
          id="settings-heading"
          data-test-id="settings-heading"
        >
          Change Email
        </p>
        <div
          className="lg:w-[464px] w-full"
          id="email-settings-section"
          data-test-id="email-settings-section"
        >
          <p
            className="text-[14px]/[22px] text-[#a5a5a5]"
            id="label-current-email"
            data-test-id="label-current-email"
          >
            Current Email
          </p>
          <p
            className="text-[14px]/[22px] text-[#353535]"
            id="current-email"
            data-test-id="current-email"
          >
            alicefernadez@gmail.com
          </p>

          <p
            className="mt-[32px] text-[14px]/[22px] text-[#353535]"
            id="label-new-email"
            data-test-id="label-new-email"
          >
            New Email Address
          </p>
          <Input
            className="h-[52px] mt-[8px]"
            value="afernadez@gmail.com"
            id="input-new-email"
            data-test-id="input-new-email"
          />
          <Button
            className="mt-[23px] h-[48px] w-full"
            id="change-email-button"
            data-test-id="change-email-button"
          >
            Change Emal Address
          </Button>
        </div>
      </div>
    </div>
  );
}
