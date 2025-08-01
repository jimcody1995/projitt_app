'use client';

import React from 'react';
import FileDropUpload from './file-drop-upload';

export default function Resume() {
  return (
    <div>
      <p className="font-medium text-[22px]/[30px]">Review</p>
      <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Add your contact information</p>
      <div className="mt-[25px] flex flex-col gap-[36px]">
        <div>
          <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Contact Info</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5]">Full Name</p>
          <p className="text-[14px]/[22px] text-[#353535]">Alice Fernadez</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Email Address</p>
          <p className="text-[14px]/[22px] text-[#353535]">alice.fernadez@gmail.com</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Address Line 1</p>
          <p className="text-[14px]/[22px] text-[#353535]">123 Main St</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Phone Number</p>
          <p className="text-[14px]/[22px] text-[#353535]">+1 (555) 123-4567</p>
        </div>
        <div>
          <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Resume/Cover Letter</p>
        </div>
        <div>
          <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Experience</p>
        </div>
        
        <div>
          <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Applicant Questions</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[8px]">Are you legally authorized to work in the US?</p>
          <p className="text-[14px]/[22px] text-[#353535]">Yes</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Would you consider relocating for this role?</p>
          <p className="text-[14px]/[22px] text-[#353535]">Yes</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Are you authorized to work in the US?</p>
          <p className="text-[14px]/[22px] text-[#353535]">Yes</p>
          <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">What degree do you hold?</p>
          <p className="text-[14px]/[22px] text-[#353535]">Bachelor</p>
        </div>
      </div>
    </div>
  );
}
