'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import FileDropUpload from './file-drop-upload';
import { getApplicantInfo } from '@/api/applicant';
import { customToast } from '@/components/common/toastr';

/**
 * @description
 * This component handles the uploading of a resume and other documents.
 * It validates that a resume is provided and both files, if present, are in PDF format.
 * The component exposes `validate` and `getData` functions to its parent via a forwarded ref, allowing the parent to trigger validation and retrieve the uploaded files' data.
 */
interface ResumeData {
  resume: File | null;
  otherDocuments: File | null;
  resumeID: string | null;
  otherDocumentsID: string | null;
}

/**
 * @description
 * A ref interface for the Resume component, exposing validation and data retrieval methods to the parent component.
 */
interface ResumeRef {
  validate: () => boolean;
  getData: () => ResumeData;
}

const Resume = forwardRef<ResumeRef, {
  onValidationChange: (isValid: boolean, data: ResumeData) => void;
  jobId?: string | null;
  applicantId?: string | null;
  setLoading?: (loading: boolean) => void;
}>(({ onValidationChange, jobId, applicantId, setLoading }, ref) => {
  const [resume, setResume] = React.useState<File | null>(null);
  const [otherDocuments, setOtherDocuments] = React.useState<File | null>(null);
  const [resumeID, setResumeID] = React.useState<string | null>(null);
  const [otherDocumentsID, setOtherDocumentsID] = React.useState<string | null>(null);
  const [resumeError, setResumeError] = React.useState<boolean>(false);
  const [otherDocumentsError, setOtherDocumentsError] = React.useState<boolean>(false);
  const [applicantInfo, setApplicantInfo] = React.useState<{
    cv_media_id?: number;
    cover_media_id?: number;
    cv_media?: {
      original_name: string;
      base_url: string;
      unique_name: string;
    };
    cover_media?: {
      original_name: string;
      base_url: string;
      unique_name: string;
    };
  } | null>(null);

  // Fetch applicant info on component mount
  React.useEffect(() => {
    const getApplicantInfoData = async () => {
      if (setLoading) setLoading(true);
      if (!jobId || !applicantId) return;
      try {
        const response = await getApplicantInfo(jobId, applicantId);
        if (response.status === true) {
          setApplicantInfo(response.data);
          if (response.data.cv_media_id) {
            setResumeID(response.data.cv_media_id.toString());
            // Set the resume file URL if available
            if (response.data.cv_media && response.data.cv_media.base_url && response.data.cv_media.unique_name) {
              const url = response.data.cv_media.base_url + response.data.cv_media.unique_name;
              setResume({ url, name: response.data.cv_media.original_name, type: 'application/pdf' } as any); // setResume expects File | null, but we set URL as a string for preview
            }
          }
          if (response.data.cover_media_id) {
            setOtherDocumentsID(response.data.cover_media_id.toString());
            // Set the cover letter file URL if available
            if (response.data.cover_media && response.data.cover_media.base_url && response.data.cover_media.unique_name) {
              const url = response.data.cover_media.base_url + response.data.cover_media.unique_name;
              setOtherDocuments({ url, name: response.data.cover_media.original_name, type: 'application/pdf' } as any); // setOtherDocuments expects File | null, but we set URL as a string for preview
            }
          }
        }
        if (setLoading) setLoading(false);
      } catch (error: any) {
        customToast('Error fetching applicant info', error?.response?.data?.message as string, 'error');
      } finally {
        if (setLoading) setLoading(false);
      }
    };
    getApplicantInfoData();
  }, [jobId, applicantId,]);

  /**
   * @description
   * This function validates the uploaded resume and other documents.
   * It checks if a resume file has been uploaded and that it is a PDF.
   * It also checks if any other documents uploaded are PDFs.
   * It updates the error states and notifies the parent component of the validation status via the `onValidationChange` prop.
   * @returns {boolean} - Returns `true` if validation passes, otherwise `false`.
   */
  const validate = (): boolean => {
    let isValid = true;

    // Check if resume exists and is PDF
    if (!resume) {
      setResumeError(true);
      isValid = false;
    } else if (resume.type !== 'application/pdf') {
      setResumeError(true);
      isValid = false;
    } else {
      setResumeError(false);
    }

    // Check if other document is PDF (if provided)
    if (otherDocuments && otherDocuments.type !== 'application/pdf') {
      setOtherDocumentsError(true);
      isValid = false;
    } else {
      setOtherDocumentsError(false);
    }

    onValidationChange(isValid, { resume, otherDocuments, resumeID, otherDocumentsID });

    return isValid;
  };

  /**
   * @description
   * Retrieves the current state of the uploaded files and their IDs.
   * @returns {ResumeData} - An object containing the resume file, other document file, and their corresponding IDs.
   */
  const getData = (): ResumeData => ({
    resume,
    otherDocuments,
    resumeID,
    otherDocumentsID,
  });

  // Expose validation and data retrieval methods to the parent component
  useImperativeHandle(ref, () => ({
    validate,
    getData,
  }));

  /**
   * @description
   * A memoized callback function to handle changes to the resume file.
   * It updates the `resume` state and clears the `resumeError` if a file is provided.
   * @param {File | null | ((prev: File | null) => File | null)} file - The new resume file or a state-updating function.
   */
  const handleResumeChange = React.useCallback((file: File | null | ((prev: File | null) => File | null)) => {
    if (typeof file === 'function') {
      setResume(file);
    } else {
      setResume(file);
      if (file) {
        setResumeError(false);
      }
    }
  }, []);

  /**
   * @description
   * A memoized callback function to handle changes to the other documents file.
   * It updates the `otherDocuments` state and clears the `otherDocumentsError` if a file is provided.
   * @param {File | null | ((prev: File | null) => File | null)} file - The new other document file or a state-updating function.
   */
  const handleOtherDocumentsChange = React.useCallback((file: File | null | ((prev: File | null) => File | null)) => {
    if (typeof file === 'function') {
      setOtherDocuments(file);
    } else {
      setOtherDocuments(file);
      if (file) {
        setOtherDocumentsError(false);
      }
    }
  }, []);

  return (
    <div>
      <p className="font-medium text-[22px]/[30px]">Resume & Cover Letter</p>
      <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Upload resume and other attachments such as a cover letter below.</p>
      <div className="mt-[40px]">
        <FileDropUpload
          label="Resume"
          setFile={handleResumeChange}
          setID={setResumeID}
          file={resume}
          hasError={resumeError}
          data-testid="resume-upload"
        />
        <FileDropUpload
          label="Other document"
          setFile={handleOtherDocumentsChange}
          setID={setOtherDocumentsID}
          file={otherDocuments}
          hasError={otherDocumentsError}
          data-testid="other-documents-upload"
        />
      </div>
    </div>
  );
});

Resume.displayName = 'Resume';

export default Resume;
