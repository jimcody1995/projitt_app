import { Button } from "@/components/ui/button";
import { ChartNoAxesColumn, ChevronUp, EllipsisVertical, MicOff, Search, Users, Wifi } from "lucide-react";
import { X } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Send } from "lucide-react";
import { Smile } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import moment from "moment";

export default function Chat({ setShowChat }: { setShowChat: (showChat: boolean) => void }) {
    const [selectedTab, setSelectedTab] = useState('chat');
    const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string; timestamp: Date }>>([]); // Add messages state
    const [newMessage, setNewMessage] = useState('');
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const newMessageObject = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'You',
            timestamp: new Date()
        };
        setMessages([...messages, newMessageObject]);
        setNewMessage('');
    };
    return (
        <div className="md:w-[400px] w-full transition-all duration-300 ease-in-out  h-full bg-[#11131A] rounded-[8px] p-[24px] flex flex-col gap-[12px]">
            <div className="flex  justify-between items-center">
                <div className="p-[4px] flex gap-[8px] bg-[#191B23]">
                    <div className={`cursor-pointer sm:w-[148px] px-[10px] w-full h-[36px] rounded-[4px] ${selectedTab === "chat" ? 'bg-[#272A31] text-white' : 'text-[#8F9099]'} flex justify-center items-center text-[14px]/[20px] font-semibold text-white`} onClick={() => setSelectedTab('chat')}>
                        Chat
                    </div>
                    <div className={`cursor-pointer sm:w-[148px] px-[10px] w-full h-[36px] rounded-[4px] ${selectedTab === "participants" ? 'bg-[#272A31] text-white' : 'text-[#8F9099]'} flex justify-center items-center text-[14px]/[20px] font-semibold text-white`} onClick={() => setSelectedTab('participants')}>
                        Participants
                    </div>
                </div>
                <button className="cursor-pointer " onClick={() => setShowChat(false)}>
                    <X className="text-white size-[24px]" />
                </button>
            </div>
            {selectedTab === "chat" && (
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Messages area */}
                    <div className="flex-1 flex flex-col justify-center !overflow-y-auto [scrollbar-width:thin] 
  [scrollbar-color:white#11131a]
  ">
                        {messages.length === 0 ? (
                            // Empty state
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <div className="mb-6">
                                    <Image
                                        src="/images/video/chat-empty.png"
                                        alt="Empty chat"
                                        width={120}
                                        height={120}
                                        className="opacity-80"
                                    />
                                </div>
                                <h3 className="text-white text-[24px]/[32px] font-semibold mb-2">
                                    Start a conversation
                                </h3>
                                <p className="text-[#8F9099] text-[14px]/[20px] max-w-[344px]">
                                    There are no messages here yet. Start a conversation by sending a message.
                                </p>
                            </div>
                        ) : (
                            // Messages list would go here
                            <div className="flex-1 flex flex-col justify-end gap-[16px]">
                                {
                                    messages.map((message, index) => (
                                        <div key={index} className="p-[8px] bg-[#191b23] rounded-[8px] w-full">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[14px]/[20px] font-semibold text-white">{message.sender}</p>
                                                <p className="text-[12px]/[16px] text-[#c5c6d0]">{moment(message.timestamp).format('hh:mm A')}</p>
                                            </div>
                                            <p className="mt-[4px] text-[#eff0fa]">
                                                {message.text}
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>

                    <div className="flex gap-[4px] items-center h-[56px]">
                        <span className="text-[12px]/[16px]  text-[#C5C6D0]">To</span>
                        <Button className="h-[24px] rounded-[4px] flex gap-[4px]">
                            <Users className="size-[16px]" />
                            <span className="text-[12px]/[16px]  text-[#ccdaff]">Everyone</span>
                            <ChevronRight className="size-[12px] text-white" />
                        </Button>
                    </div>

                    <div className="w-full flex gap-[4px] h-[56px] items-center py-[12px] px-[16px] rounded-[8px] bg-[#191b23]">
                        <input type="text" value={newMessage} placeholder="Send a message..." className="flex-1  text-white focus:outline-none" onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                        <div className="flex gap-[16px]">
                            <button className="cursor-pointer">
                                <Smile className="size-[24px] text-white" />
                            </button>
                            <button className="cursor-pointer" onClick={() => handleSendMessage()}>
                                <Send className="size-[24px] text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedTab === "participants" && <div className="flex flex-col gap-[8px] h-full overflow-y-auto">
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