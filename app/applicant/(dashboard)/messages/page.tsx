'use client';

import moment from 'moment';
import React from 'react';

/**
 * Messages Component
 * 
 * This component renders a list of system messages, each showing a title,
 * formatted date, and a descriptive message body. It also includes test IDs
 * and HTML IDs for UI automation testing.
 */
export default function Messages() {
  /**
   * List of hardcoded messages for display in the UI.
   * Each message has an ID, title, date, and full message content.
   */
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
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ",
    },
  ];

  return (
    <div
      className="pt-[40px] lg:px-[305px] md:px-[131px] sm:px-[20px] flex flex-col gap-[24px]"
      id="messages-container"
      data-testid="messages-container"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className="py-[17px] px-[27px] bg-white rounded-[8px] border border-[#e9e9e9]"
          id={`message-card-${message.id}`}
          data-testid={`message-card-${message.id}`}
        >
          <div
            className="flex justify-between"
            id={`message-header-${message.id}`}
            data-testid={`message-header-${message.id}`}
          >
            <p
              className="text-[16px]/[26px] font-medium text-[#353535]"
              id={`message-title-${message.id}`}
              data-testid={`message-title-${message.id}`}
            >
              {message.title}
            </p>
            <p
              className="text-[14px]/[22px] text-[#787878]"
              id={`message-date-${message.id}`}
              data-testid={`message-date-${message.id}`}
            >
              {message.date}
            </p>
          </div>
          <p
            className="mt-[4px] text-[14px]/[22px] text-[#4B4B4B] xl:w-[585px]"
            id={`message-body-${message.id}`}
            data-testid={`message-body-${message.id}`}
          >
            {message.message}
            <span
              className="text-[#0D978B] cursor-pointer"
              id={`read-less-${message.id}`}
              data-testid={`read-less-${message.id}`}
            >
              {' '}
              Read Less
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
