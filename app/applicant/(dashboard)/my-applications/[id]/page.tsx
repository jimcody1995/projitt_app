'use client';

import React from 'react';
import { ArrowLeft, BriefcaseBusiness, Clock, Dot, Loader, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { getApplicantInfo, getQuestions } from '@/api/applicant';
import { customToast } from '@/components/common/toastr';
import { useEffect, useState } from 'react';
import { useBasic } from '@/context/BasicContext';

/**
 * ApplicationDetails Component
 * 
 * Displays a detailed view of a job application, including job title,
 * job type, location, submission date, application status, contact information,
 * resume/cover letter, experience, and applicant question responses.
 */
export default function ApplicationDetails({ params }: { params: Promise<{ id: string }> }) {
  /**
   * Retrieves dynamic route parameter for application ID.
   */
  const [applicantInfo, setApplicantInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string>('');
  const [applicantId, setApplicantId] = useState<string>('');
  const { country } = useBasic()

  // Handle async params and localStorage
  useEffect(() => {
    const initializeData = async () => {
      try {
        const resolvedParams = await params;
        setJobId(resolvedParams.id);

        // Access localStorage only on client side
        if (typeof window !== 'undefined') {
          const storedApplicantId = localStorage.getItem('applicantId');
          setApplicantId(storedApplicantId || '');
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!jobId || !applicantId) return;
        // Fetch applicant info
        const applicantResponse = await getApplicantInfo(jobId, applicantId);
        if (applicantResponse.status === true) {
          setApplicantInfo(applicantResponse.data);
        }

        // Fetch questions
        const questionsResponse = await getQuestions(jobId, applicantId);
        if (questionsResponse.status) {
          setQuestions(questionsResponse.data);
        }
      } catch (error: any) {
        customToast('Error fetching data', error?.response?.data?.message as string, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, applicantId, setLoading]);

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
              {applicantInfo?.job?.title}
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
                {country.find((item: any) => item.id === applicantInfo?.job?.country_id)?.name}
              </span>
              <span
                className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]"
                id="submission-date"
                data-testid="submission-date"
              >
                <Clock className="size-[16px]" />
                {moment(applicantInfo?.job?.deadline).format('MMMM DD YYYY')}
              </span>
            </div>
          </div>
          <span
            className="pl-[3px] pr-[8px] py-[1px] bg-[#8f8f8f] text-[#fff] text-[12px]/[22px] rounded-[30px] flex items-center"
            id="application-status"
            data-testid="application-status"
          >
            <Dot className="size-[20px]" />
            {applicantInfo?.status.charAt(0).toUpperCase() + applicantInfo?.status.slice(1)}
          </span>
        </div>

        {loading ? <>
          <div className="flex items-center justify-center mt-[30px] pb-[20px]">
            <Loader className="size-[20px] animate-spin" />
          </div>
        </> : <div
          className="pl-[40px] pr-[77px] pt-[30px] flex flex-col gap-[36px] pb-[20px]"
          id="application-sections"
          data-testid="application-sections"
        >
          {/* Contact Info Section */}
          <div>
            <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Contact Info</p>
            <p className="text-[14px]/[22px] text-[#a5a5a5]">Full Name</p>
            <p className="text-[14px]/[22px] text-[#353535]">
              {applicantInfo?.applicant?.first_name} {applicantInfo?.applicant?.last_name}
            </p>
            <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Email Address</p>
            <p className="text-[14px]/[22px] text-[#353535]">{applicantInfo?.applicant?.email}</p>
            <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Address</p>
            <p className="text-[14px]/[22px] text-[#353535]">
              {applicantInfo?.address}, {applicantInfo?.city}, {applicantInfo?.state} {applicantInfo?.zip_code}
            </p>
            <p className="text-[14px]/[22px] text-[#a5a5a5] mt-[14px]">Phone Number</p>
            <p className="text-[14px]/[22px] text-[#353535]">
              {applicantInfo?.contact_code} {applicantInfo?.contact_number}
            </p>
          </div>

          <div>
            <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Resume/Cover Letter</p>
            {applicantInfo?.cv_media && (
              <p className="text-[14px]/[22px] text-[#353535]">CV: {applicantInfo.cv_media.original_name}</p>
            )}
            {applicantInfo?.cover_media && (
              <p className="text-[14px]/[22px] text-[#353535]">Cover Letter: {applicantInfo.cover_media.original_name}</p>
            )}
          </div>

          <div>
            <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Experience</p>
            {applicantInfo?.work_experience?.map((work: any, index: number) => (
              <div key={index} className="mt-[8px]">
                <p className="text-[14px]/[22px] text-[#a5a5a5]">Experience {index + 1}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">{work.job_title} at {work.company}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">{work.location}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">
                  {new Date(work.from_date).toLocaleDateString()} - {work.is_currently_working ? 'Present' : new Date(work.to_date).toLocaleDateString()}
                </p>
                <p className="text-[14px]/[22px] text-[#4b4b4b]">{work.role_description}</p>
              </div>
            ))}
            {applicantInfo?.education?.map((edu: any, index: number) => (
              <div key={index} className="mt-[8px]">
                <p className="text-[14px]/[22px] text-[#a5a5a5]">Education {index + 1}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">{edu.school}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">{edu.degree.name}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">
                  {edu.field_of_study}
                </p>
              </div>
            ))}
            {applicantInfo?.certificate?.map((cert: any, index: number) => (
              <div key={index} className="mt-[8px]">
                <p className="text-[14px]/[22px] text-[#a5a5a5]">Certification {index + 1}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">{cert.title}</p>
                <p className="text-[14px]/[22px] text-[#353535] font-medium">{cert.number}</p>

              </div>
            ))}
            <div className="mt-[8px]">
              <p className="text-[14px]/[22px] text-[#a5a5a5]">Skills</p>
              <p className="text-[14px]/[22px] text-[#353535] font-medium">{applicantInfo?.skills.map((skill: any, index: number) => <span key={index}>{skill.name}</span>)}</p>
            </div>
            <div className="mt-[8px]">
              <p className="text-[14px]/[22px] text-[#a5a5a5]">LinkedIn</p>
              <p className="text-[14px]/[22px] text-[#353535] font-medium">{applicantInfo?.linkedin_link}</p>
            </div>
            <div className="mt-[8px]">
              <p className="text-[14px]/[22px] text-[#a5a5a5]">Website/Portfolio Link</p>
              <p className="text-[14px]/[22px] text-[#353535] font-medium">{applicantInfo?.portfolio_link}</p>
            </div>
          </div>

          <div>
            <p className="text-[16px]/[24px] font-medium text-[#1c1c1c]">Applicant Questions</p>
            {questions.map((question: any) => {
              let answer = '';
              if (question.applicant_answer) {
                try {
                  const finalAnswer = question.applicant_answer.split('\"')[1]
                  answer = finalAnswer;
                } catch (error) {
                  answer = question.applicant_answer;
                }
              }

              return (
                <div key={question.id} className="mt-[8px]">
                  <p className="text-[14px]/[22px] text-[#a5a5a5]">{question.question_name}</p>
                  <p className="text-[14px]/[22px] text-[#353535] wrap-anywhere">{answer}</p>
                </div>
              );
            })}
          </div>
        </div>}
      </div>
    </div>
  );
}
