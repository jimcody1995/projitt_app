'use client';

import React, { useEffect, useState } from 'react';
import FileDropUpload from './file-drop-upload';
import { getApplicantInfo, getQuestions } from '@/api/applicant';
import loading from '@/components/common/loading';

interface ReviewProps {
  jobId?: string;
  applicantId?: string;
  setLoading: (loading: boolean) => void;
}

export default function Review({ jobId, applicantId, setLoading }: ReviewProps) {
  const [applicantInfo, setApplicantInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!jobId || !applicantId) return;
      try {
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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, applicantId]);

  return (
    <div>
      <p className="font-medium text-[22px]/[30px]">Review</p>
      <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Review your application</p>
      <div className="mt-[25px] flex flex-col gap-[36px]">
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
                <p className="text-[14px]/[22px] text-[#353535]">{answer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
