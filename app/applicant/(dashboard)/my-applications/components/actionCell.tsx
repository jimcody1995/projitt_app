import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import React, { JSX } from 'react';
import CheckDialog from './checkDialog';

/**
 * ActionsCell Component
 * 
 * Renders a dropdown menu with various actions for a job posting,
 * including edit, view applicants, duplicate, close job, unpublish, and delete.
 */
export function ActionsCell(): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-7"
          mode="icon"
          variant="ghost"
          id="actions-trigger-button"
          data-testid="actions-trigger-button"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        id="actions-dropdown-menu"
        data-testid="actions-dropdown-menu"
      >
        {/* <div
          className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]"
          id="edit-option"
          data-testid="edit-option"
        >
          Edit
        </div>
        <div
          className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]"
          id="view-applicants-option"
          data-testid="view-applicants-option"
        >
          View Applicants
        </div>
        <div
          className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]"
          id="duplicate-option"
          data-testid="duplicate-option"
        >
          Duplicate
        </div>
        <CheckDialog
          action="close"
          trigger={
            <div
              className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]"
              id="close-job-option"
              data-testid="close-job-option"
            >
              Close Job
            </div>
          }
        />
        <CheckDialog
          action="unpublish"
          trigger={
            <div
              className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]"
              id="unpublish-option"
              data-testid="unpublish-option"
            >
              Unpublish
            </div>
          }
        /> */}
        <CheckDialog
          action="delete"
          trigger={
            <div
              className="cursor-pointer hover:bg-[#e9e9e9] text-[12px]/[18px] py-[7px] px-[12px] rounded-[8px]"
              id="delete-option"
              data-testid="delete-option"
            >
              Delete
            </div>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
