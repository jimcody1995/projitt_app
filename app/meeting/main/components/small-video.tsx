import { EllipsisVertical } from "lucide-react";

export default function SmallVideo({ isVideoEnabled, videoRef }: { isVideoEnabled: boolean, videoRef: React.RefObject<HTMLVideoElement | null> }) {
    return (
        <div className="bg-[#11131A] flex-1 !h-full flex justify-center items-center relative rounded-[20px]">

            <button className="cursor-pointer absolute w-[28px] z-[6] bottom-[8px] right-[8px] h-[28px] rounded-[8px] bg-[#000000A3] flex justify-center items-center">
                <EllipsisVertical className="text-white size-[20px]" />
            </button>
            <span className="absolute bottom-[8px] left-[8px] px-[8px] py-[4px] rounded-[8px] bg-[#000000A3] text-white text-[14px]/[20px] font-semibold">John Doe</span>

            {!isVideoEnabled ? <div className="w-[88px] h-[88px] bg-[#eb4747] rounded-full flex justify-center items-center">
                <span className="text-[34px]/[40px] font-semibold text-white">KA</span>
            </div> : <video key="small-video" ref={videoRef} autoPlay playsInline muted className="h-full object-cover rounded-[20px]" />}
        </div>
    )
}