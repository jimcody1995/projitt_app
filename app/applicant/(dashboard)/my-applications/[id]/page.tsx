'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, Clock, Dot, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

export default function ApplicationDetails() {
  const { id } = useParams();
  const router = useRouter();
  return (
    <div className="px-[420px] pt-[32px] pb-[57px]">
      <div
        className="flex text-[#353535] items-center gap-[10px] cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-[20px] " />
        <span className="text-[14px]/[20px]">Back to Applications</span>
      </div>
      <div className="mt-[20px] bg-whtie border border-[#e9e9e9] w-full rounded-[16px]">
        <div className="pt-[32px] pb-[27px] px-[40px] border-b border-[#e9e9e9] flex items-center justify-between">
          <div>
            <p className="text-[18px]/[30px] text-[#0D978B] underline">Senior Data Analyst</p>
            <div className="mt-[4px] flex gap-[8px]">
              <span className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]">
                <BriefcaseBusiness className="size-[16px]" />
                Fulltime
              </span>
              <span className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]">
                <MapPin className="size-[16px]" />
                United States
              </span>
              <span className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]">
                <Clock className="size-[16px]" />
                {moment(new Date()).format('MMMM DD YYYY')}
              </span>
            </div>
          </div>
          <span
            className={`pl-[3px] pr-[8px] py-[1px] bg-[#8f8f8f] text-[#fff] text-[12px]/[22px] rounded-[30px] flex items-center`}
          >
            <Dot className="size-[20px]" />
            Under Review
          </span>
        </div>
        <div className="pl-[40px] pr-[77px] pt-[30px] flex flex-col gap-[36px]">
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
            <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[8px]">
              Are you legally authorized to work in the US?
            </p>
            <p className="text-[14px]/[22px] text-[#353535]">Yes</p>
            <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">
              Would you consider relocating for this role?
            </p>
            <p className="text-[14px]/[22px] text-[#353535]">Yes</p>
            <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">
              Are you authorized to work in the US?
            </p>
            <p className="text-[14px]/[22px] text-[#353535]">Yes</p>
            <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">What degree do you hold?</p>
            <p className="text-[14px]/[22px] text-[#353535]">Bachelor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
