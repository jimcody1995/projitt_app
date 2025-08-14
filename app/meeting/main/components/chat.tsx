import { Button } from "@/components/ui/button";
import { ChartNoAxesColumn, ChevronUp, EllipsisVertical, MicOff, Search, Users, Wifi } from "lucide-react";
import { X } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Send } from "lucide-react";
import { Smile } from "lucide-react";
import { useState } from "react";

export default function Chat({ setShowChat }: { setShowChat: (showChat: boolean) => void }) {
    const [selectedTab, setSelectedTab] = useState('chat');
    return (
        <div className="w-[400px] transition-all duration-300 ease-in-out  h-full bg-[#11131A] rounded-[8px] p-[24px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
                <div className="p-[4px] flex gap-[8px] bg-[#191B23]">
                    <div className={`cursor-pointer w-[148px] h-[36px] rounded-[4px] ${selectedTab === "chat" ? 'bg-[#272A31] text-white' : 'text-[#8F9099]'} flex justify-center items-center text-[14px]/[20px] font-semibold text-white`} onClick={() => setSelectedTab('chat')}>
                        Chat
                    </div>
                    <div className={`cursor-pointer w-[148px] h-[36px] rounded-[4px] ${selectedTab === "participants" ? 'bg-[#272A31] text-white' : 'text-[#8F9099]'} flex justify-center items-center text-[14px]/[20px] font-semibold text-white`} onClick={() => setSelectedTab('participants')}>
                        Participants
                    </div>
                </div>
                <button className="cursor-pointer " onClick={() => setShowChat(false)}>
                    <X className="text-white size-[24px]" />
                </button>
            </div>
            {selectedTab === "chat" && <div className="flex flex-col gap-[8px]">
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
            </div>}
            {selectedTab === "participants" && <div className="flex flex-col gap-[8px] h-full">
                <div className="w-full h-[48px] flex items-center bg-[#191b23] gap-[16px] py-[12px] px-[16px] mt-[16px]">
                    <Search className="size-[24px] text-white" />
                    <input type="text" placeholder="Find what you’re looking for" className="flex-1  text-white focus:outline-none" />
                </div>
                <div className="border border-[#272a31] rounded-[8px] w-full mt-[16px]">
                    <div className="border-b border-[#272a31] w-full py-[14px] px-[16px] flex justify-between items-center">
                        <span className="text-[14px]/[20px] font-semibold text-[#c5c6d0]">Host (1)</span>
                        <ChevronUp className="size-[24px] text-white" />
                    </div>
                    <div className="w-full py-[18px] px-[16px] flex justify-between items-center">
                        <span className="text-[14px]/[20px] font-semibold text-[#c5c6d0]">Participants (1)</span>
                        <div className="flex gap-[16px]">
                            <button className="cursor-pointer rounded-full w-[24px] h-[24px] bg-[#293042] flex justify-center items-center">
                                <ChartNoAxesColumn className="size-[18px] text-white" />
                            </button>
                            <button className="cursor-pointer">
                                <EllipsisVertical className="size-[24px] text-white" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border border-[#272a31] rounded-[8px] w-full mt-[16px]">
                    <div className="border-b border-[#272a31] w-full py-[14px] px-[16px] flex justify-between items-center">
                        <span className="text-[14px]/[20px] font-semibold text-[#c5c6d0]">Participant (3)</span>
                        <div className="flex gap-[16px]">
                            <button className="cursor-pointer">
                                <EllipsisVertical className="size-[24px] text-white" />
                            </button>
                            <ChevronUp className="size-[24px] text-white" />
                        </div>
                    </div>
                    <div className="w-full py-[18px] px-[16px] flex justify-between items-center">
                        <span className="text-[14px]/[20px] font-semibold text-[#c5c6d0]">Alex K</span>
                        <div className="flex gap-[16px]">
                            <button className="cursor-pointer rounded-full w-[24px] h-[24px] bg-[#293042] flex justify-center items-center">
                                <Wifi className="size-[18px] text-white" />
                            </button>
                            <button className="cursor-pointer rounded-full w-[24px] h-[24px] bg-[#293042] flex justify-center items-center">
                                <ChartNoAxesColumn className="size-[18px] text-white" />
                            </button>
                            <button className="cursor-pointer">
                                <EllipsisVertical className="size-[24px] text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full py-[18px] px-[16px] flex justify-between items-center">
                        <span className="text-[14px]/[20px] font-semibold text-[#c5c6d0]">Alex K</span>
                        <div className="flex gap-[16px]">
                            <button className="cursor-pointer rounded-full w-[24px] h-[24px] bg-[#293042] flex justify-center items-center">
                                <MicOff className="size-[18px] text-white" />
                            </button>
                            <button className="cursor-pointer">
                                <EllipsisVertical className="size-[24px] text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full py-[18px] px-[16px] flex justify-between items-center">
                        <span className="text-[14px]/[20px] font-semibold text-[#c5c6d0]">Anna</span>
                        <div className="flex gap-[16px]">
                            <button className="cursor-pointer rounded-full w-[24px] h-[24px] bg-[#293042] flex justify-center items-center">
                                <ChartNoAxesColumn className="size-[18px] text-white" />
                            </button>
                            <button className="cursor-pointer">
                                <EllipsisVertical className="size-[24px] text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}