import { ScreenShare, X } from "lucide-react";

interface ScreenShareIndicatorProps {
    onStopScreenShare: () => void;
}

export default function ScreenShareIndicator({ onStopScreenShare }: ScreenShareIndicatorProps) {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-[#11131A] flex justify-center items-center flex-col relative rounded-[20px] px-6 py-4 shadow-lg border border-gray-700">
                <ScreenShare className="text-white size-[80px]" />
                <p className="text-white text-[24px]/[32px] font-semibold mt-[16px]">You are sharing your screen</p>
                <button
                    onClick={onStopScreenShare}
                    className="w-[217px] h-[48px] cursor-pointer bg-[#c30606] hover:bg-[#c30606]/[0.8] rounded-[8px] flex justify-center items-center mt-[32px] gap-[8px]"
                >
                    <X className="text-white size-[24px]" />
                    <span className="text-[16px]/[24px] text-white font-semibold">Stop Screenshare</span>
                </button>
            </div>
        </div>
    );
}
