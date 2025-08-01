'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import FileDropUpload from './file-drop-upload';

interface ResumeData {
  resume: File | null;
  otherDocuments: File | null;
  resumeID: string | null;
  otherDocumentsID: string | null;
}

interface ResumeRef {
  validate: () => boolean;
  getData: () => ResumeData;
}

const Resume = forwardRef<ResumeRef, { onValidationChange: (isValid: boolean, data: ResumeData) => void }>(({ onValidationChange }, ref) => {
  const [resume, setResume] = React.useState<File | null>(null);
  const [otherDocuments, setOtherDocuments] = React.useState<File | null>(null);
  const [resumeID, setResumeID] = React.useState<string | null>(null);
  const [otherDocumentsID, setOtherDocumentsID] = React.useState<string | null>(null);
  const [resumeError, setResumeError] = React.useState<boolean>(false);
  const [otherDocumentsError, setOtherDocumentsError] = React.useState<boolean>(false);

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
    if (!otherDocuments) {
      setOtherDocumentsError(true);
      isValid = false;
    } else if (otherDocuments && otherDocuments.type !== 'application/pdf') {
      setOtherDocumentsError(true);
      isValid = false;
    } else {
      setOtherDocumentsError(false);
    }

    onValidationChange(isValid, { resume, otherDocuments, resumeID, otherDocumentsID });

    return isValid;
  };

  const getData = (): ResumeData => ({
    resume,
    otherDocuments,
    resumeID,
    otherDocumentsID,
  });

  // Expose validation method to parent component
  useImperativeHandle(ref, () => ({
    validate,
    getData,
  }));

  // Clear error when file is selected
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

  // Clear error when other document is selected
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
        />
        <FileDropUpload
          label="Other document"
          setFile={handleOtherDocumentsChange}
          setID={setOtherDocumentsID}
          file={otherDocuments}
          hasError={otherDocumentsError}
        />
      </div>
    </div>
  );
});

Resume.displayName = 'Resume';

export default Resume;
