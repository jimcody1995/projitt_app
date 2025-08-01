'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Questions() {
  return (
    <div>
      <p className="font-medium text-[22px]/[30px]">Applicant Questions</p>
      <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Add your contact information</p>

      <div className="mt-[16px]">
        <p className='text-[14px]/[22px] text-[#353535] font-medium'>Are you legally authorized to work in the US?</p>
        <Select>
          <SelectTrigger className="w-full h-[48px] mt-[8px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Yes</SelectItem>
            <SelectItem value="2">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-[16px]">
        <p className='text-[14px]/[22px] text-[#353535] font-medium'>Would you consider relocating for this role?</p>
       <Input className="mt-[8px] h-[48px]"/>
      </div>
      <div className="mt-[16px]">
        <p className='text-[14px]/[22px] text-[#353535] font-medium'>Are you authorized to work in the US?</p>
       <Textarea className="mt-[8px] h-[153px]"/>
      </div>
      <div className="mt-[16px]">
        <p className='text-[14px]/[22px] text-[#353535] font-medium'>What degree do you hold?</p>
        <Select>
          <SelectTrigger className="w-full h-[48px] mt-[8px]">
            <SelectValue placeholder="Select Degree" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Bachelor</SelectItem>
            <SelectItem value="2">Master</SelectItem>
            <SelectItem value="3">PhD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
