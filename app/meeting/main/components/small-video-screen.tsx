import { MicOff } from "lucide-react";

export default function SmallVideoForScreen({ user, isVideoEnabled, videoRef }: { user: { name: string, avatar: string, id: string }, isVideoEnabled: boolean, videoRef: React.RefObject<HTMLVideoElement | null> }) {
    return (
        <div className="bg-[#121722] flex-1 !h-full flex justify-center items-center relative rounded-[20px]">
            <span className="absolute bottom-[8px] left-[8px] px-[8px] py-[4px] rounded-[8px] bg-[#000000A3] text-white text-[14px]/[20px] font-semibold">{user.name}</span>
            <button className="w-[32px] h-[32px] cursor-pointer absolute top-[8px] right-[8px] rounded-[8px] bg-[#000000A3] flex justify-center items-center">
                <MicOff className="text-white size-[16px]" />
            </button>
            {!isVideoEnabled ? <div className="w-[60px] h-[60px] bg-[#eb4747] rounded-full flex justify-center items-center">
                <span className="text-[24px]/[30px] font-semibold text-white">{user.name.charAt(0).toUpperCase() + user.name.charAt(1).toUpperCase()}</span>
            </div> : <video key="small-video" ref={videoRef} autoPlay playsInline muted className="h-full object-cover rounded-[20px]" />}
        </div>
    )
}