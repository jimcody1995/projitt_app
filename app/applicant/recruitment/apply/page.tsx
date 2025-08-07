'use client';
import { ArrowRight, Loader } from 'lucide-react';
import React, { useState } from 'react';
import Stepper from './components/steper';
import { Button } from '@/components/ui/button';
import ContactInfo from './components/contact-info';
import Resume from './components/resume';
import Qualifications from './components/qualifications';
import Questions from './components/questions';
import Review from './components/review';
import { applicantContactInfo, applicantResume } from '@/api/applicant';
import { useSearchParams } from 'next/navigation';
import { customToast } from '@/components/common/toastr';
import { QualificationsRef } from './components/qualifications';
import { useEffect } from 'react';
import { getQuestions } from '@/api/applicant';
import { QuestionsRef } from './components/questions';

/**
 * Apply component manages the multi-step job application process.
 * It controls step navigation, validation, and data submission.
 * Renders different form components based on the current step.
 */
export default function Apply() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const applicantId = searchParams.get('applicantId');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepData, setStepData] = useState({
    contactInfo: null,
    resume: null,
    qualifications: null,
    questions: null,
  });
  const [questions, setQuestions] = useState<any>([]);
  // Refs for each step component
  const contactInfoRef = React.useRef<{ validate: () => boolean }>(null);
  const resumeRef = React.useRef<{ validate: () => boolean; getData: () => any }>(null);
  const qualificationsRef = React.useRef<QualificationsRef>(null);
  const questionsRef = React.useRef<QuestionsRef>(null);

  /**
   * Validates the current step and attempts to submit its data.
   * On success, advances to the next step.
   */

  const getQuestionsData = async () => {
    const response = await getQuestions(jobId as string, applicantId as string);
    if (response) {
      setQuestions(response);
    }
  };

  useEffect(() => {
    getQuestionsData();
  }, []);

  // Handle validation for current step
  const handleNextStep = async () => {
    let isValid = true;

    // Validate current step based on step number
    switch (currentStep) {
      case 1:
        if (contactInfoRef.current) {
          try {
            setLoading(true);
            isValid = contactInfoRef.current.validate();
            if (isValid) {
              const response = await applicantContactInfo({ ...(stepData.contactInfo as any), job_id: jobId, applicant_id: applicantId })
              if (response.data.status) {
                setCurrentStep(currentStep + 1);
              }
            }
          } catch (error) {
            customToast(
              'Please fill all required fields',
              'Missing details',
              'error'
            );
            return;
          } finally {
            setLoading(false);
          }
        }
        break;
      case 2:
        if (resumeRef.current) {
          try {
            setLoading(true);
            isValid = resumeRef.current.validate();
            if (!isValid) {
              customToast(
                'Please fill all required fields',
                'Missing details',
                'error'
              );
            }
            else {
              const resumeData = resumeRef.current.getData();
              const response = await applicantResume({ cv_media_id: resumeData.resumeID, cover_media_id: resumeData.otherDocumentsID, job_id: jobId, applicant_id: applicantId })
              if (response.data.status) {
                setCurrentStep(currentStep + 1);
              }
            }
          } catch (error) {
            customToast(
              'Please fill all required fields',
              'Missing details',
              'error'
            );
            return;
          } finally {
            setLoading(false);
          }
        }
        break;
      case 3:
        if (qualificationsRef.current) {
          try {
            setLoading(true);
            const response = await qualificationsRef.current.saveQualifications();
            if (response.data.status) {
              setCurrentStep(currentStep + 1);
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            customToast(
              'Please fill all required fields',
              'Missing details',
              'error'
            );
            return;
          }
        }
        break;
      case 4:
        if (questionsRef.current) {
          try {
            setLoading(true);
            await questionsRef.current?.saveAnswers();
            setLoading(false);
            setCurrentStep(currentStep + 1);
          } catch (error) {
            setLoading(false);
            customToast(
              'Please fill all required fields',
              'Missing details',
              'error'
            );
            return;
          }
        }
        break;
      default:
        isValid = true;
    }

    // Only proceed if validation passes
    if (isValid && currentStep !== 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Updates stored step data when changes occur in child components.
   * @param step - The step identifier (e.g., 'contactInfo', 'resume')
   * @param data - The new data from the step component
   */
  const handleStepDataChange = (step: string, data: any) => {
    setStepData(prev => ({ ...prev, [step]: data }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="pb-[30px] flex justify-between pl-[84px] pr-[100px] border-b border-[#e9e9e9] sm:flex-row flex-col items-center gap-[10px]">
        <img src="/images/zaidLLC.png" alt="logo" className="h-[32px]" />
        <button className="flex gap-[10px] text-[#0D978B] cursor-pointer text-[14px]/[20px]" id="go-to-dashboard-link"
          data-testid="go-to-dashboard-link">
          <p>Go to Dashboard</p>
          <ArrowRight className="size-[20px]" />
        </button>
      </div>
      {currentStep !== 6 && (
        <div className="lg:w-[865px] w-full flex bg-white mx-auto mt-[44px]">
          <div className="w-[321px] border-r border-[#e9e9e9] md:block hidden" id="sidebar" data-testid="sidebar">
            <div className="pl-[40px] pt-[36px] pb-[21px] border-b border-[#e9e9e9] ">
              <p className="text-[18px]/[30px] text-[#353535]" id="job-title" data-testid="job-title">Senior Data Analyst</p>
              <p className="text-[14px]/[22px] text-[#8f8f8f]" id="company-location" data-testid="company-location">
                Big and Small Enterprise Ltd ~ USA
              </p>
            </div>
            <div className="pt-[40px] pl-[40px]">
              <Stepper currentStep={currentStep} />
            </div>
          </div>
          <div className="flex-1 relative">
            {loading && <div className="absolute top-0 left-0 z-[3] w-full h-full flex justify-center items-center bg-[#bebebe22]">
              <Loader className="size-[30px] spinner animate-spin z-[4]" />
            </div>}
            <div className="pl-[40px] pt-[36px] pb-[21px] border-b border-[#e9e9e9] md:hidden block" id="mobile-header" data-testid="mobile-header">
              <p className="text-[18px]/[30px] text-[#353535]">Senior Data Analyst</p>
              <p className="text-[14px]/[22px] text-[#8f8f8f]">
                Big and Small Enterprise Ltd ~ USA
              </p>
            </div>
            <div className="pt-[33px] px-[40px] pb-[19px] relative">

              {currentStep === 1 && (
                <ContactInfo
                  ref={contactInfoRef}
                  onValidationChange={(isValid, data) => handleStepDataChange('contactInfo', data)}
                  id="contact-info-step"
                  data-testid="contact-info-step"
                />
              )}
              {currentStep === 2 && <Resume ref={resumeRef} onValidationChange={(isValid, data) => handleStepDataChange('resume', data)} />}
              {currentStep === 3 && <Qualifications ref={qualificationsRef} jobId={jobId} applicantId={applicantId} />}
              {currentStep === 4 && <Questions ref={questionsRef} jobId={jobId} applicantId={applicantId} />}
              {currentStep === 5 && <Review />}
            </div>
            <div className="px-[40px] pt-[28px] pb-[32px] border-t border-[#e9e9e9] flex gap-[16px] sm:flex-row flex-col">
              {currentStep !== 1 && (
                <Button
                  disabled={loading}
                  variant="outline"
                  className="h-[48px] w-full  sm:order-1 order-2"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  id="back-button"
                  data-testid="back-button"
                >
                  Back
                </Button>
              )}
              {currentStep !== 5 && (
                <Button disabled={loading} className="h-[48px] w-full sm:order-2 order-1" onClick={handleNextStep}
                  id="save-continue-button"
                  data-testid="save-continue-button">
                  {loading ? 'Saving...' : 'Save & Continue'}
                </Button>
              )}
              {currentStep === 5 && (
                <Button disabled={loading} className="h-[48px] w-full sm:order-2 order-1" onClick={() => setCurrentStep(currentStep + 1)}
                  id="submit-application-button"
                  data-testid="submit-application-button">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {currentStep === 6 && (
        <div className="flex-1">
          <div className="w-full h-full flex justify-center items-center px-[10px]">
            <div
              className="w-[622px] border border-[#e9e9e9] rounded-[16px] bg-white py-[63px] px-[40px] flex flex-col items-center"
              id="reset-success-container"
              data-testid="reset-success-container"
            >
              <div className="relative w-[100px] h-[100px] flex items-center justify-center">
                <div className="absolute w-[100px] h-[100px] rounded-full bg-[#0D978B33] ripple"></div>
                <div className="absolute w-[70px] h-[70px] rounded-full bg-[#0D978B] opacity-[20%] ripple delay-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <img
                    src="/images/icons/check-double.svg"
                    alt="check-icon"
                    className="w-[40px] h-[40px]"
                    id="check-success-icon"
                    data-testid="check-success-icon"
                  />
                </div>
              </div>

              <p
                className="text-[22px]/[30px] font-semibold tracking-tight text-[#353535] text-center mt-[13px]"
                id="reset-success-title"
                data-testid="reset-success-title"
              >
                Application Submitted!
              </p>
              <p
                className="text-[18px]/[30px] mt-[19px] text-[#4B4B4B] text-center"
                id="reset-success-subtext1"
                data-testid="reset-success-subtext1"
              >
                Thanks for trusting us with your time and application. Our team is reviewing all
                candidates carefully, and if you're a strong fit, you'll hear from us soon.
              </p>
              <div className="flex justify-center">
                <Button
                  className="w-[284px] h-[48px] font-semibold text-[16px]/[24px] mt-[36px]"
                  id="go-to-dashboard-button"
                  data-testid="go-to-dashboard-button"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-[51px] pb-[20px]">
        <img src="/images/poweredBy.png" alt="logo" className="h-[28px]" id="powered-by-logo" data-testid="powered-by-logo" />
      </div>
    </div>
  );
}
