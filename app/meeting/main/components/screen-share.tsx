import { ScreenShare, X } from "lucide-react";

export default function ScreenShareLarge() {
    return (
        <div className="bg-[#11131A] flex-1 md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex justify-center items-center flex-col relative rounded-[20px]">
            <ScreenShare className="text-white size-[80px]" />
            <p className="text-white text-[24px]/[32px] font-semibold mt-[16px]">You are sharing your screen</p>
            <button className="w-[217px] h-[48px] cursor-pointer bg-[#c30606] hover:bg-[#c30606]/[0.8] rounded-[8px] flex justify-center items-center mt-[32px] gap-[8px]">
                <X className="text-white size-[24px]" />
                <span className="text-[16px]/[24px] text-white font-semibold">Stop Screenshare</span>
            </button>
        </div>
    )
}