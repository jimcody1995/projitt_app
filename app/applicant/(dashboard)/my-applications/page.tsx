'use client';

import { BriefcaseBusiness, Clock, Dot, MapPin } from 'lucide-react';
import React, { useEffect } from 'react';
import { ActionsCell } from './components/actionCell';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getJobInfo } from '@/api/applicant';
import { useSession } from '@/context/SessionContext';
/**
 * MyApplications component renders a list of job applications with status and metadata.
 * Each application card includes title, type, location, created date, status, and action buttons.
 * Unique attributes are provided for test automation support.
 */
export default function MyApplications() {
  /**
   * Renders a list of application cards and handles navigation.
   * Applies dynamic styles and conditions based on application status.
   */
  const [data, setData] = React.useState([]);
  const router = useRouter();
  const { session } = useSession();
  const [applicant_id, setApplicantId] = React.useState<string | null>(null);

  const getJobData = async () => {
    if (!applicant_id) return;
    const response = await getJobInfo(undefined, applicant_id);
    setData(response.data);
  }

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedApplicantId = localStorage.getItem('applicantId');
      setApplicantId(storedApplicantId);
    }
  }, []);

  useEffect(() => {
    if (applicant_id) {
      getJobData();
    }
  }, [applicant_id]);

  const colors: Record<string, string> = {
    'Not Submitted': 'bg-[#e9e9e9]',
    'Under Review': 'bg-[#8f8f8f]',
    'Interviewing': 'bg-[#ff8914]',
    'Rejected': 'bg-[#c30606]',
    "submitted": "bg-[#0d978b]"
  };

  return (
    <div
      className="lg:pl-[209px] md:pl-[131px] sm:pl-[20px] lg:pr-[131px] md:pr-[20px] sm:pr-[20px] pt-[71px]"
      id="my-applications-container"
      data-test-id="my-applications-container"
    >
      <p
        className="text-[21px]/[30px] font-semibold text-[#1c1c1c] text-center"
        id="welcome-message"
        data-test-id="welcome-message"
      >
        Welcome {session.full_name},
      </p>
      <div
        className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[22px] mt-[22px]"
        id="applications-grid"
        data-test-id="applications-grid"
      >
        {data.map((item, index) => (
          <div
            className="w-full border border-[#e9e9e9] bg-white pt-[20px] pb-[24px] px-[24px] rounded-[8px]"
            key={index}
            id={`application-card-${item.id}`}
            data-test-id={`application-card-${item.id}`}
          >
            <div className="w-full flex justify-between">
              <span
                className={`pl-[3px] pr-[8px] py-[1px] ${item.status !== 'Not Submitted' ? 'text-white' : 'text-[#1c1c1c]'
                  } text-[12px]/[22px] ${colors[item.status]} rounded-[30px] flex items-center`}
                id={`status-pill-${item.id}`}
                data-test-id={`status-pill-${item.id}`}
              >
                <Dot className="size-[20px]" /> {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <ActionsCell />
            </div>
            <p
              className="mt-[10px] text-[18px]/[30px] font-semibold"
              id={`job-title-${item.id}`}
              data-test-id={`job-title-${item.id}`}
            >
              {item?.job?.title}
            </p>
            <div className="mt-[4px] flex gap-[8px]">
              <span
                className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]"
                id={`job-type-${item.id}`}
                data-test-id={`job-type-${item.id}`}
              >
                <BriefcaseBusiness className="size-[16px]" />
                {item?.job?.location_type?.name}
              </span>
              <span
                className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]"
                id={`job-location-${item.id}`}
                data-test-id={`job-location-${item.id}`}
              >
                <MapPin className="size-[16px]" />
                {item?.job?.country?.name}
              </span>
            </div>
            <div className="mt-[8px] flex gap-[4px]">
              <Clock className="size-[16px] text-[#8f8f8f]" />
              <span
                className="text-[12px]/[18px] text-[#8f8f8f]"
                id={`applied-date-${item.id}`}
                data-test-id={`applied-date-${item.id}`}
              >
                Applied : {moment(item.created_at).format('MMMM DD YYYY')}
              </span>
            </div>
            {item.status === 'Not Submitted' ? (
              <Button
                className="mt-[18px] w-full h-[32px]"
                id={`continue-btn-${item.id}`}
                data-test-id={`continue-btn-${item.id}`}
              >
                Continue Application
              </Button>
            ) : (
              <Button
                variant="outline"
                className="mt-[18px] w-full h-[32px]"
                id={`view-btn-${item.id}`}
                data-test-id={`view-btn-${item.id}`}
                onClick={() => router.push(`/applicant/my-applications/${item.job_id}`)}
              >
                View Application
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
