import { Maximize2, ScreenShare, X } from "lucide-react";
import { useRef, useEffect } from "react";
import SmallVideo from "./small-video";
import SmallVideoForScreen from "./small-video-screen";

interface ScreenShareLargeProps {
    screenStream: MediaStream | null;
    onStopScreenShare: () => void;
    currentUsers: {
        name: string;
        avatar: string;
        id: string;
    }[];
    showChat: boolean;
}

export default function ScreenShareLarge({ screenStream, showChat, onStopScreenShare, currentUsers }: ScreenShareLargeProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (screenStream && videoRef.current) {
            videoRef.current.srcObject = screenStream;
            videoRef.current.play().catch(console.error);
        }
    }, [screenStream]);

    if (!screenStream) {
        return (
            <div className={`${(showChat && showChat === true) ? "md:flex hidden" : "flex"} bg-[#11131A] flex-1 md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex justify-center items-center flex-col relative rounded-[20px]`}>
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
        <div className={`${(showChat && showChat === true) ? "md:flex hidden" : "flex"} bg-[#11131A] flex-1 md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex justify-center items-center flex-col gap-[24px] relative rounded-[20px] overflow-hidden`}>
            <div className="relative w-full flex-1 min-h-0">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full flex-1 min-h-0 h-full object-contain bg-black"
                />
                <div className="absolute bottom-[16px] left-[16px] px-[8px] py-[4px] bg-[#000000A3] rounded-[8px] text-white text-[14px]/[20px] font-semibold flex items-center gap-[6px]">
                    <ScreenShare className="text-white size-[24px]" /> Karen A is sharing their screen
                </div>
            </div>
            <div className="w-full lg:flex hidden gap-[24px] h-[154px] items-center justify-center overflow-x-auto">
                {currentUsers && currentUsers.slice(0, 4).map((user, index) =>
                    <div key={index} className="w-[240px] h-[154px]">
                        <SmallVideoForScreen user={user} isVideoEnabled={false} videoRef={useRef<HTMLVideoElement>(null)} />
                    </div>
                )}
            </div>

            <button className="cursor-pointer absolute top-[16px] right-[16px] p-[8px] bg-[#000000A3] rounded-[8px] text-white text-[14px]/[20px] font-semibold flex items-center gap-[6px]">
                <Maximize2 className="text-white size-[24px]" />
            </button>
        </div>
    );
}