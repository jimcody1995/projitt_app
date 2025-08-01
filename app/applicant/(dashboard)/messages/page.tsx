'use client';
import moment from 'moment';
import React from 'react';
export default function Messages() {
  const messages = [
    {
      id: '1',
      title: 'Thanks for applying! We’re reviewing your resume.',
      date: moment(new Date()).format('DD MMM'),
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      id: '2',
      title: 'Thanks for applying! We’re reviewing your resume.',
      date: moment(new Date()).format('DD MMM'),
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ',
    },
  ];
  return (
    <div className="pt-[40px] lg:px-[305px] md:px-[131px] sm:px-[20px] flex flex-col gap-[24px]">
      {messages.map((message) => (
        <>
          <div className="py-[17px] px-[27px] bg-white rounded-[8px] border border-[#e9e9e9]">
            <div className="flex justify-between">
              <p className="text-[16px]/[26px] font-medium text-[#353535]">
                Thanks for applying! We’re reviewing your resume.
              </p>
              <p className="text-[14px]/[22px] text-[#787878]">
                {moment(new Date()).format('DD MMM')}
              </p>
            </div>
            <p className="mt-[4px] text-[14px]/[22px] text-[#4B4B4B] xl:w-[585px] ">
              {message.message}
              <span className="text-[#0D978B] cursor-pointer"> Read Less</span>
            </p>
          </div>
        </>
      ))}
    </div>
  );
}
