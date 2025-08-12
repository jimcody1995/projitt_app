import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { X } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Send } from "lucide-react";
import { Smile } from "lucide-react";

export default function Chat(setShowChat: (showChat: boolean) => void) {
    return (
        <div className="w-[400px] transition-all duration-300 ease-in-out h-full bg-[#11131A] rounded-[8px] p-[24px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
                <div className="p-[4px] flex gap-[8px] bg-[#191B23]">
                    <div className="w-[148px] h-[36px] rounded-[4px] bg-[#272A31] flex justify-center items-center text-[14px]/[20px] font-semibold text-white">
                        Chat
                    </div>
                    <div className="w-[148px] h-[36px] rounded-[4px]  flex justify-center items-center text-[14px]/[20px] font-semibold text-white">
                        Participants
                    </div>
                </div>
                <button className="cursor-pointer " onClick={() => setShowChat(false)}>
                    <X className="text-white size-[24px]" />
                </button>
            </div>
            <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[4px] items-center">
                    <span className="text-[12px]/[16px]  text-[#C5C6D0]">To</span>
                    <Button className="h-[24px] rounded-[4px] flex gap-[4px]">
                        <Users className="size-[16px]" />
                        <span className="text-[12px]/[16px]  text-[#ccdaff]">Everyone</span>
                        <ChevronRight className="size-[12px] text-white" />
                    </Button>
                </div>
                <div className="w-full flex gap-[4px] items-center py-[12px] px-[16px] rounded-[8px] bg-[#191b23]">
                    <input type="text" placeholder="Send a message..." className="flex-1  text-white focus:outline-none" />
                    <div className="flex gap-[16px]">
                        <button className="cursor-pointer">
                            <Smile className="size-[24px] text-white" />
                        </button>
                        <button className="cursor-pointer">
                            <Send className="size-[24px] text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}