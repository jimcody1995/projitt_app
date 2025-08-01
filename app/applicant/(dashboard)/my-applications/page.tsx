'use client';
import { BriefcaseBusiness, Clock, Dot, MapPin } from 'lucide-react';
import React from 'react';
import { ActionsCell } from './components/actionCell';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function MyApplications() {
  const router = useRouter();
  const data = [
    {
      id: '1',
      title: 'Senior Data Analyst',
      location: 'United States',
      type: 'Fulltime',
      status: 'Not Submitted',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Senior Data Analyst',
      location: 'United States',
      type: 'Fulltime',
      status: 'Under Review',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Senior Data Analyst',
      location: 'United States',
      type: 'Fulltime',
      status: 'Interviewing',
      createdAt: new Date(),
    },

    {
      id: '4',
      title: 'Senior Data Analyst',
      location: 'United States',
      type: 'Fulltime',
      status: 'Rejected',
      createdAt: new Date(),
    },
  ];

  const colors = {
    'Not Submitted': 'bg-[#e9e9e9]',
    'Under Review': 'bg-[#8f8f8f]',
    Interviewing: 'bg-[#ff8914]',
    Rejected: 'bg-[#c30606]',
  };
  return (
    <div className="lg:pl-[209px] md:pl-[131px] sm:pl-[20px] lg:pr-[131px] md:pr-[20px] sm:pr-[20px] pt-[71px]">
      <p className="text-[21px]/[30px] font-semibold text-[#1c1c1c] text-center">Welcome Alice,</p>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[22px] mt-[22px]">
        {data.map((item, index) => (
          <>
            <div
              className="w-full border border-[#e9e9e9] bg-white pt-[20px] pb-[24px] px-[24px] rounded-[8px]"
              key={index}
            >
              <div className="w-full flex justify-between">
                <span
                  className={`pl-[3px] pr-[8px] py-[1px] ${item.status != 'Not Submitted' ? 'text-white' : 'text-[#1c1c1c]'} text-[12px]/[22px] ${colors[item.status]} rounded-[30px] flex items-center`}
                >
                  <Dot className="size-[20px]" /> {item.status}
                </span>
                <ActionsCell />
              </div>
              <p className="mt-[10px] text-[18px]/[30px] font-semibold">{item.title}</p>
              <div className="mt-[4px] flex gap-[8px]">
                <span className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]">
                  <BriefcaseBusiness className="size-[16px]" />
                  {item.type}
                </span>
                <span className="text-[12px]/[18px] flex items-center gap-[2px] text-[#787878]">
                  <MapPin className="size-[16px]" />
                  {item.location}
                </span>
              </div>
              <div className="mt-[8px] flex gap-[4px]">
                <Clock className="size-[16px] text-[#8f8f8f]" />
                <span className="text-[12px]/[18px] text-[#8f8f8f]">
                  {' '}
                  Applied : {moment(item.createdAt).format('MMMM DD YYYY')}
                </span>
              </div>
              {item.status === 'Not Submitted' ? (
                <Button className="mt-[18px] w-full h-[32px]">Continue Application</Button>
              ) : (
                <Button
                  variant="outline"
                  className="mt-[18px] w-full h-[32px]"
                  onClick={() => router.push(`/applicant/my-applications/${item.id}`)}
                >
                  View Application
                </Button>
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
