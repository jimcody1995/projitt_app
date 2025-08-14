import { ScreenShare, X } from "lucide-react";
import { useRef, useEffect } from "react";

interface ScreenShareLargeProps {
    screenStream: MediaStream | null;
    onStopScreenShare: () => void;
}

export default function ScreenShareLarge({ screenStream, onStopScreenShare }: ScreenShareLargeProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (screenStream && videoRef.current) {
            videoRef.current.srcObject = screenStream;
            videoRef.current.play().catch(console.error);
        }
    }, [screenStream]);

    if (!screenStream) {
        return (
            <div className="bg-[#11131A] flex-1 md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex justify-center items-center flex-col relative rounded-[20px]">
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
        );
    }

    return (
        <div className="bg-[#11131A] flex-1 md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex justify-center items-center relative rounded-[20px] overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain bg-black"
            />
            <div className="absolute top-[16px] right-[16px] flex gap-[8px]">
                <div className="px-[12px] py-[6px] bg-[#000000A3] rounded-[8px] text-white text-[14px]/[20px] font-semibold">
                    Screen Share
                </div>
                <button
                    onClick={onStopScreenShare}
                    className="w-[40px] h-[32px] cursor-pointer bg-[#c30606] hover:bg-[#c30606]/[0.8] rounded-[8px] flex justify-center items-center"
                >
                    <X className="text-white size-[16px]" />
                </button>
            </div>
        </div>
    );
}