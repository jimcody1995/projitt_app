'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, Clock, Dot, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

/**
 * ApplicationDetails Component
 * 
 * Displays a detailed view of a job application, including job title,
 * job type, location, submission date, application status, contact information,
 * resume/cover letter, experience, and applicant question responses.
 */
export default function ApplicationDetails() {
  /**
   * Retrieves dynamic route parameter for application ID.
   */
  const { id } = useParams();

  /**
   * Provides navigation functionality, such as going back to the previous page.
   */
  const router = useRouter();

  return (
    <div
      className="lg:px-[420px] px-[10px] pt-[32px] pb-[57px]"
      id="application-details-container"
      data-testid="application-details-container"
    >
      <div
        className="flex text-[#353535] items-center gap-[10px] cursor-pointer"
        id="back-button"
        data-testid="back-button"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-[20px]" />
        <span className="text-[14px]/[20px]">Back to Applications</span>
      </div>

      <div
        className="mt-[20px] bg-white border border-[#e9e9e9] w-full md:min-w-[350px] rounded-[16px]"
        id="application-card"
        data-testid="application-card"
      >
        <div
          className="pt-[32px] pb-[27px] px-[40px] border-b border-[#e9e9e9] flex items-center justify-between"
          id="application-header"
          data-testid="application-header"
        >
          <div>
            <p
              className="text-[18px]/[30px] text-[#0D978B] underline"
              id="job-title"
              data-testid="job-title"
            >
              Senior Data Analyst
            </p>
            <div className="mt-[4px] flex gap-[8px]">
              <span
                className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]"
                id="job-type"
                data-testid="job-type"
              >
                <BriefcaseBusiness className="size-[16px]" />
                Fulltime
              </span>
              <span
                className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]"
                id="job-location"
                data-testid="job-location"
              >
                <MapPin className="size-[16px]" />
                United States
              </span>
              <span
                className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]"
                id="submission-date"
                data-testid="submission-date"
              >
                <Clock className="size-[16px]" />
                {moment(new Date()).format('MMMM DD YYYY')}
              </span>
            </div>
          </div>
          <span
            className="pl-[3px] pr-[8px] py-[1px] bg-[#8f8f8f] text-[#fff] text-[12px]/[22px] rounded-[30px] flex items-center"
            id="application-status"
            data-testid="application-status"
          >
            <Dot className="size-[20px]" />
            Under Review
          </span>
        </div>

        <div
          className="pl-[40px] pr-[77px] pt-[30px] flex flex-col gap-[36px] pb-[20px]"
          id="application-sections"
          data-testid="application-sections"
        >
          {/* Contact Info Section */}
          <div id="contact-info-section" data-testid="contact-info-section">
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

          {/* Resume/Cover Letter Section */}
          <div id="resume-section" data-testid="resume-section">
            <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Resume/Cover Letter</p>
          </div>

          {/* Experience Section */}
          <div id="experience-section" data-testid="experience-section">
            <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Experience</p>
          </div>

          {/* Applicant Questions Section */}
          <div id="applicant-questions-section" data-testid="applicant-questions-section">
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
