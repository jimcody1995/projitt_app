import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import React, { JSX } from 'react';
import CheckDialog from '../../../../(protected)/recruitment/job-postings/components/checkDialog';

export function ActionsCell(): JSX.Element {
  /**
   * Copies job ID to clipboard and shows toast notification
   * @returns {void}
   */

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <div className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]">
          Edit
        </div>
        <div className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]">
          View Applicants
        </div>
        <div className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]">
          Duplicate
        </div>
        <CheckDialog
          action="close"
          trigger={
            <div className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]">
              Close Job
            </div>
          }
        />
        <CheckDialog
          action="unpublish"
          trigger={
            <div className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]">
              Unpublish
            </div>
          }
        />
        <CheckDialog
          action="delete"
          trigger={
            <div className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]">
              Delete
            </div>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
