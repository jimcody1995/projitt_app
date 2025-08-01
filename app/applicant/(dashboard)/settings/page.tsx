import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Settings() {
  return (
    <div className="lg:px-[283px] md:px-[131px] sm:px-[20px] pt-[55px]">
      <div className=" w-full bg-white rounded-[16px] px-[47px] pt-[43px] pb-[57px] flex lg:flex-row flex-col justify-between">
        <p className="font-medium text-[22px]/[30px] text-[#1c1c1c]">Change Email</p>
        <div className="lg:w-[464px] w-full">
          <p className="text-[14px]/[22px] text-[#a5a5a5]">Current Email</p>
          <p className="text-[14px]/[22px] text-[#353535]">alicefernadez@gmail.com</p>
          <p className="mt-[32px] text-[14px]/[22px] text-[#353535]"> New Email Address</p>
          <Input className="h-[52px] mt-[8px]" value="afernadez@gmail.com" />
          <Button className="mt-[23px] h-[48px] w-full">Change Emal Address</Button>
        </div>
      </div>
    </div>
  );
}
