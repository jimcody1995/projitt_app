"use client";

import { AlignJustify, Disc2, EllipsisVertical, Hand, LogOut, MessageSquare, Mic, MicOff, ScreenShare, Smile, Users, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";


export default function MeetingMain() {
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const [hasMicPermission, setHasMicPermission] = useState(false);
    const [hasVideoPermission, setHasVideoPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Request microphone permission
    const requestMicPermission = async () => {
        try {
            setIsLoading(true);
            // Get both audio and video streams to combine them
            const constraints = {
                audio: true,
                video: hasVideoPermission ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } : false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setHasMicPermission(true);
            setIsMicEnabled(true);

            // If we already have video permission, update the video element
            if (hasVideoPermission && videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            streamRef.current = stream;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            setHasMicPermission(false);
            setIsMicEnabled(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Request video permission
    const requestVideoPermission = async () => {
        try {
            setIsLoading(true);
            // Get both audio and video streams to combine them
            const constraints = {
                audio: hasMicPermission ? true : false,
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setHasVideoPermission(true);
            setIsVideoEnabled(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // If we already have a stream with audio, merge the new video track
            if (streamRef.current && streamRef.current.getAudioTracks().length > 0) {
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack) {
                    streamRef.current.addTrack(videoTrack);
                    console.log("Added video track to existing audio stream");
                }
            } else {
                streamRef.current = stream;
                console.log("Set new stream as main stream");
            }
        } catch (error) {
            console.error('Camera permission denied:', error);
            setHasVideoPermission(false);
            setIsVideoEnabled(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle microphone
    const toggleMic = async () => {
        if (!hasMicPermission) {
            await requestMicPermission();
        } else {
            const newMicState = !isMicEnabled;
            setIsMicEnabled(newMicState);
            if (streamRef.current) {
                const audioTrack = streamRef.current.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = newMicState;
                }
            }
        }
    };

    // Toggle video
    const toggleVideo = async () => {
        if (!hasVideoPermission) {
            console.log("No video permission, requesting...");
            await requestVideoPermission();
        } else {
            const newVideoState = !isVideoEnabled;
            console.log("Toggling video to:", newVideoState);
            setIsVideoEnabled(newVideoState);

            if (streamRef.current) {
                console.log("streamRef.current", streamRef.current);
                const videoTrack = streamRef.current.getVideoTracks()[0];
                console.log("videoTrack", videoTrack);

                if (videoTrack) {
                    if (newVideoState) {
                        // Turning on video - enable the track
                        console.log("Enabling existing video track");
                        videoTrack.enabled = true;
                        if (videoRef.current) {
                            videoRef.current.srcObject = streamRef.current;
                        }
                    } else {
                        // Turning off video - stop the video track completely
                        console.log("Stopping and removing video track");
                        videoTrack.stop();
                        if (videoRef.current) {
                            videoRef.current.srcObject = null;
                        }

                        // Remove the stopped track from the stream
                        streamRef.current.removeTrack(videoTrack);

                        // If we still have audio, keep the stream, otherwise clear it
                        if (streamRef.current.getAudioTracks().length > 0) {
                            console.log("Keeping audio stream");
                        } else {
                            console.log("Clearing stream (no tracks left)");
                            streamRef.current = null;
                        }
                    }
                } else if (newVideoState) {
                    // No video track but trying to turn on - need to request new video permission
                    console.log("No video track found, requesting new video permission");
                    await requestVideoPermission();
                }
            } else if (newVideoState) {
                // No stream at all but trying to turn on video
                console.log("No stream found, requesting new video permission");
                await requestVideoPermission();
            }
        }
    };

    // Update video element when stream changes
    useEffect(() => {
        if (streamRef.current && videoRef.current && hasVideoPermission && isVideoEnabled) {
            videoRef.current.srcObject = streamRef.current;
        } else if (videoRef.current && (!isVideoEnabled || !hasVideoPermission)) {
            // Clear video when disabled or no permission
            videoRef.current.srcObject = null;
        }
    }, [hasVideoPermission, isVideoEnabled]);

    // Cleanup streams on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    return (
        <div className="w-full h-[100vh] flex flex-col justify-between bg-black p-[24px] gap-[24px]">
            <div className="w-full flex justify-between items-center">
                <img src="/images/logo-noletter.svg" alt="logo4meeting" className="w-[32px] h-[32px]" />
                <button className="w-[122px] h-[48px] bg-[#2e3038] rounded-[8px] flex justify-center items-center gap-[8px]">
                    <Disc2 className="text-white size-[30px]" />
                    <span className="text-[16px]/[24px] font-semibold text-[#ffffff]">Record</span>
                </button>
            </div>
            <div className="flex-1 ">
                <div className="bg-[#11131A] w-full md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex justify-center">
                    <video ref={videoRef} autoPlay playsInline muted className="h-full object-cover rounded-[20px]" />
                </div>
            </div>
            <div className="flex  justify-between gap-[24px] md:flex-row flex-col w-full items-center">
                <div className="flex gap-[16px]">
                    {/* Microphone Control */}
                    <div className="h-[48px] border border-[#8f8f8f] rounded-[8px] flex">
                        <button
                            onClick={toggleMic}
                            disabled={isLoading}
                            className={`cursor-pointer w-[49px] h-full border-r border-[#8f8f8f] rounded-l-[8px] flex justify-center items-center transition-colors ${isMicEnabled ? 'bg-green-500 bg-opacity-20' : ''
                                }`}
                        >
                            {isMicEnabled ? (
                                <Mic className="text-white size-[32px]" />
                            ) : (
                                <MicOff className="text-white size-[32px]" />
                            )}
                        </button>
                        <div className="w-[41px] h-full flex justify-center items-center">
                            <EllipsisVertical className="text-white size-[24px]" />
                        </div>
                    </div>

                    {/* Video Control */}
                    <div className="h-[48px] border border-[#8f8f8f] rounded-[8px] flex">
                        <button
                            onClick={toggleVideo}
                            disabled={isLoading}
                            className={`cursor-pointer w-[49px] h-full border-r border-[#8f8f8f] rounded-l-[8px] flex justify-center items-center transition-colors ${isVideoEnabled ? 'bg-green-500 bg-opacity-20' : ''
                                }`}
                        >
                            {isVideoEnabled ? (
                                <Video className="text-white size-[32px]" />
                            ) : (
                                <VideoOff className="text-white size-[32px]" />
                            )}
                        </button>
                        <div className="w-[41px] h-full flex justify-center items-center">
                            <EllipsisVertical className="text-white size-[24px]" />
                        </div>
                    </div>

                    <div className="w-[48px] h-[48px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <img src="/images/video/user-hidden.svg" alt="user-hidden" className="size-[32px]" />
                    </div>
                </div>
                <div className="flex gap-[16px]">
                    {/* Microphone Control */}
                    <div className="h-[48px] border border-[#8f8f8f] rounded-[8px] flex">
                        <button
                            className={`cursor-pointer w-[49px] h-full border-r border-[#8f8f8f] rounded-l-[8px] flex justify-center items-center transition-colors`}
                        >
                            <ScreenShare className="text-white size-[32px]" />
                        </button>
                        <div className="w-[41px] h-full flex justify-center items-center">
                            <EllipsisVertical className="text-white size-[24px]" />
                        </div>
                    </div>
                    <div className="w-[48px] h-[48px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <Hand className="text-white size-[32px]" />
                    </div>
                    <div className="w-[48px] h-[48px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <Smile className="text-white size-[32px]" />
                    </div>
                    <div className="h-[48px] border border-[#8f8f8f] rounded-[8px] flex bg-[#c30606]">
                        <button
                            className={`cursor-pointer w-[49px] h-full border-r border-[#270005] rounded-l-[8px] flex justify-center items-center transition-colors`}
                        >
                            <LogOut className="text-white size-[32px]" />
                        </button>
                        <div className="w-[41px] h-full flex justify-center items-center">
                            <EllipsisVertical className="text-white size-[24px]" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-[16px]">
                    <div className="w-[48px] h-[48px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <MessageSquare className="text-white size-[32px]" />
                    </div>
                    <div className="p-[8px] h-[48px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center gap-[8px]">
                        <Users className="text-white size-[32px]" />
                        <span className="text-[16px]/[24px] text-[#ffffff] font-semibold">5</span>
                    </div>
                    <div className="w-[48px] h-[48px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <AlignJustify className="text-white size-[32px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}