"use client";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
export default function Ready() {
    const router = useRouter();
    const params = useSearchParams();
    return <div className="bg-white border border-[#e9e9e9] rounded-[16px] p-[40px] md:w-[545px] ">
        <p className="text-[22px]/[30px] font-semibold">Welcome to Your Psychometric Assessment</p>
        <div className="flex gap-[4px] mt-[5px] items-center">
            <Clock3 className="size-[15px] text-[#626262]" />
            <p className="text-[14px]/[22px] text-[#626262]">15:00</p>
        </div>
        <p className="text-[15px]/[22px] text-[#353535] mt-[18px] font-normal">Before we begin, make sure you’re in a quiet place with a stable internet connection. This test is timed and cannot be paused.</p>
        <ul className="mt-[8px] list-disc text-[15px]/[25px] text-[#353535] font-medium ml-[20px]">
            <li className="text-[15px]/[25px] text-[#353535] font-medium">No pause/resume</li>
            <li className="text-[15px]/[25px] text-[#353535] font-medium">You’ll only take this once</li>
            <li className="text-[15px]/[25px] text-[#353535] font-medium">Avoid refreshing the page</li>
        </ul>
        <Button className="mt-[46px] w-full h-[48px]" onClick={() => router.push(`/applicant/test/main?camera=${params.get('camera')}&microphone=${params.get('microphone')}`)}>I’m Ready, Start Now</Button>
    </div>;
}