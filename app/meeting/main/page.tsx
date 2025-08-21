"use client";

import { AlignJustify, Disc2, EllipsisVertical, Hand, LogOut, MessageSquare, Mic, MicOff, ScreenShare, ScreenShareOff, Smile, Star, TriangleAlert, Users, Video, VideoOff, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Chat from "./components/chat";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SmallVideo from "./components/small-video";
import ScreenShareLarge from "./components/screen-share";
import DialogContent, { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function MeetingMain() {
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const [hasMicPermission, setHasMicPermission] = useState(false);
    const [hasVideoPermission, setHasVideoPermission] = useState(false);
    const [currentUsers, setCurrentUsers] = useState<Array<{ name: string; avatar: string; id: string }>>([
    ]);
    const [isShareScreen, setIsShareScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string>("");
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [isScreenSharePopoverOpen, setIsScreenSharePopoverOpen] = useState(false);
    const [animatedEmojis, setAnimatedEmojis] = useState<Array<{ id: number, emoji: string, x: number, y: number }>>([]);
    const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const router = useRouter();

    const handleEmojiSelect = (emoji: string) => {
        setSelectedEmoji(emoji);

        // Create a new animated emoji with random position near bottom center
        const newEmojiAnimation = {
            id: Date.now() + Math.random(),
            emoji: emoji,
            x: Math.random() * 5 + 2, // Random x position between 30% and 70% (center area)
            y: 110 // Random y position between 70% and 90% (bottom area)
        };

        setAnimatedEmojis(prev => [...prev, newEmojiAnimation]);

        // Remove the emoji after animation completes (3 seconds)
        setTimeout(() => {
            setAnimatedEmojis(prev => prev.filter(e => e.id !== newEmojiAnimation.id));
        }, 3000);

        // Close the emoji popover

        console.log("Selected emoji:", emoji);
    };

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

    // Ensure video stream is properly set when switching modes
    useEffect(() => {
        if (videoRef.current && streamRef.current && hasVideoPermission && isVideoEnabled) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                if (videoRef.current && streamRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                    // Force video to play
                    videoRef.current.play().catch(console.error);
                }
            }, 100);
        }
    }, [isShareScreen, hasVideoPermission, isVideoEnabled]);

    // Start screen sharing
    const startScreenShare = async () => {
        if (window.innerWidth < 1024) {
            alert('Screen sharing is not supported on mobile devices');
            return;
        }
        try {
            setIsLoading(true);
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false
            });

            setScreenStream(stream);
            setIsShareScreen(true);

            // Handle stream ending
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                stopScreenShare();
            });

        } catch (error) {
            console.error('Screen sharing failed:', error);
            setIsShareScreen(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Stop screen sharing
    const stopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }
        setIsShareScreen(false);
    };

    // Cleanup streams on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [screenStream]);

    const updateGrid = (participants: number) => {
        const grid = document.getElementById("videoGrid");
        if (!grid) return;
        let cols = Math.ceil(Math.sqrt(participants));
        let rows = Math.ceil(participants / cols);

        if (participants === 1) { cols = 1; rows = 1; }
        else if (participants === 2) { cols = 2; rows = 1; }
        else if (participants === 3) { cols = 2; rows = 2; }
        else if (participants === 4) { cols = 2; rows = 2; }
        else if (participants === 5) { cols = 3; rows = 2; }

        grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        grid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
    }

    useEffect(() => {
        updateGrid(currentUsers.length);
    }, [currentUsers]);

    useEffect(() => {
        // Update grid when screen share state changes
        if (!isShareScreen) {
            // Small delay to ensure DOM is updated
            // setTimeout(() => {
            updateGrid(currentUsers.length);
            // }, 0);
        }
    }, [isShareScreen, currentUsers.length]);
    return (
        <div className="w-full h-[100vh] flex flex-col justify-between bg-black p-[24px] gap-[24px]">
            <div className="flex-1 flex justify-between items-center">
                <div className="flex gap-[24px] items-center">
                    <img src="/images/logo-noletter.svg" alt="logo4meeting" className="w-[32px] h-[32px]" />
                    <div className="flex gap-[8px] items-center">
                        <Volume1 className="size-[24px] text-white" />
                        <span className="text-[16px]/[24px]  text-[#eff0fa]">Joy Banks, Iwobi (You)</span>
                    </div>
                </div>
                <button className="w-[122px] h-[48px] bg-[#2e3038] rounded-[8px] flex justify-center items-center gap-[8px]">
                    <Disc2 className="text-white size-[30px]" />
                    <span className="text-[16px]/[24px] font-semibold text-[#ffffff]">Record</span>
                </button>
            </div>
            <div className={`flex-1 w-full flex ${(showChat || isShareScreen) ? 'gap-[24px]' : ''} `}>
                {!isShareScreen ?
                    <div id="videoGrid" className={`${showChat ? 'md:grid hidden' : 'grid'} relative md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex-1 grid gap-[16px]`}>
                        {currentUsers.map((user, index) => (
                            <div key={index} className="bg-[#11131A] flex-1 h-full  flex justify-center items-center relative rounded-[20px]">
                                <div className="absolute top-[8px] right-[8px] flex  z-10">
                                    {hasMicPermission && (
                                        <div onClick={toggleMic} className={`cursor-pointer w-[32px] h-[32px] ${isMicEnabled ? 'bg-white' : 'bg-[#293042]'} rounded-full flex justify-center items-center`}>
                                            {isMicEnabled ? (
                                                <Mic className="text-[#353535] size-[16px]" />
                                            ) : (
                                                <MicOff className="text-white size-[16px]" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button className="cursor-pointer absolute w-[28px] z-[6] bottom-[8px] right-[8px] h-[28px] rounded-[8px] bg-[#000000A3] flex justify-center items-center">
                                    <EllipsisVertical className="text-white size-[20px]" />
                                </button>
                                <span className="absolute bottom-[8px] left-[8px] px-[8px] py-[4px] rounded-[8px] bg-[#000000A3] text-white text-[14px]/[20px] font-semibold">{user.name}</span>

                                <div className="w-[88px] h-[88px] bg-[#eb4747] rounded-full flex justify-center items-center">
                                    <span className="text-[34px]/[40px] font-semibold text-white">{user.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()}</span>
                                </div>
                            </div>
                        ))}
                        <div id="me" className="bg-[#11131A] flex-1 h-full  flex justify-center items-center relative rounded-[20px]">
                            <div id="emoji-show" className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                                {animatedEmojis.map((emojiData, index) => (
                                    <div
                                        key={emojiData.id}
                                        className="emoji-animation absolute"
                                        style={{
                                            left: `${emojiData.x}%`,
                                            top: `${emojiData.y}%`,
                                            animation: `emojiFloat 6s linear `,
                                        }}
                                    >
                                        {emojiData.emoji}
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-[8px] right-[8px] flex  z-10">
                                {hasMicPermission && (
                                    <div onClick={toggleMic} className={`cursor-pointer w-[32px] h-[32px] ${isMicEnabled ? 'bg-white' : 'bg-[#293042]'} rounded-full flex justify-center items-center`}>
                                        {isMicEnabled ? (
                                            <Mic className="text-[#353535] size-[16px]" />
                                        ) : (
                                            <MicOff className="text-white size-[16px]" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <button className="cursor-pointer absolute w-[28px] z-[6] bottom-[8px] right-[8px] h-[28px] rounded-[8px] bg-[#000000A3] flex justify-center items-center">
                                <EllipsisVertical className="text-white size-[20px]" />
                            </button>
                            <span className="absolute bottom-[8px] left-[8px] px-[8px] py-[4px] rounded-[8px] bg-[#000000A3] text-white text-[14px]/[20px] font-semibold">James Lee</span>

                            <div className="w-[88px] h-[88px] bg-[#eb4747] rounded-full flex justify-center items-center">
                                <span className="text-[34px]/[40px] font-semibold text-white">JL</span>
                            </div>
                        </div >
                        <div className="absolute bottom-[16px] border border-[#293042] right-[16px] flex justify-center items-center z-[4] w-[240px] h-[154px] rounded-[16px] bg-[#11131A]">
                            {!isVideoEnabled ? <div>
                                <div className="absolute top-[8px] left-[8px] z-[8]  bg-[#293042] w-[32px] h-[32px] text-white rounded-full text-[12px] flex justify-center items-center">
                                    BRB
                                </div>
                                <div className="absolute bottom-[8px] left-[8px] py-[4px] px-[8px] text-[14px]/[20px]  text-white bg-[#000000A3] rounded-[8px]">
                                    James Lee
                                </div>
                                <div className="w-[58px] h-[58px] bg-[#7e47eb] rounded-full flex justify-center items-center">
                                    <span className="text-[24px]/[32px] font-semibold text-white">JL</span>
                                </div>
                            </div> :
                                <video key={`grid-video-${isShareScreen}`} ref={videoRef} autoPlay playsInline muted className="h-full object-cover rounded-[20px]" />}
                        </div>
                    </div >
                    :
                    <ScreenShareLarge
                        showChat={showChat}
                        currentUsers={currentUsers}
                        screenStream={screenStream}
                        onStopScreenShare={stopScreenShare}
                    />
                }
                {
                    <div className={`${isShareScreen && showChat === false ? "md:flex hidden" : "flex"} ${(showChat || isShareScreen) ? "md:w-[400px] w-full" : "w-0"} overflow-hidden transition-all ease-in-out duration-500   md:h-[calc(100vh-192px)] h-[calc(100vh-326px)] flex-col gap-[24px]`}>
                        {isShareScreen && <div className="h-[225px]">
                            <SmallVideo isVideoEnabled={isVideoEnabled} videoRef={videoRef} />
                        </div>}
                        <div className="flex-1 h-full">
                            <Chat setShowChat={setShowChat} />
                        </div>
                    </div>
                }
            </div >
            <div className="flex  justify-between md:gap-[24px] gap-[12px] md:flex-row flex-col w-full items-center">
                <div className="flex gap-[16px]">
                    <div className={`md:h-[48px] h-[36px] border  rounded-[8px] flex  ${isMicEnabled ? 'border-[#8f8f8f]' : 'border-[#2e3038] bg-[#2E3038]'}`}>
                        <button
                            onClick={toggleMic}
                            disabled={isLoading}
                            className={`cursor-pointer md:w-[49px] w-[33px] h-full border-r border-[#8f8f8f] rounded-l-[8px] flex justify-center items-center transition-colors ${isMicEnabled ? '' : 'bg-[#2E3038]'}`}
                        >
                            {isMicEnabled ? (
                                <Mic className="text-white md:size-[32px] size-[24px]" />
                            ) : (
                                <MicOff className="text-white md:size-[32px] size-[24px]" />
                            )}
                        </button>
                        <div className="md:w-[41px] w-[33px] h-full flex justify-center items-center">
                            <EllipsisVertical className="text-white md:size-[24px] size-[20px]" />
                        </div>
                    </div>

                    {/* Video Control */}
                    <div className={`md:h-[48px] h-[36px] border  rounded-[8px] flex  ${isVideoEnabled ? 'border-[#8f8f8f]' : 'border-[#2e3038] bg-[#2E3038]'}`}>
                        <button
                            onClick={toggleVideo}
                            disabled={isLoading}
                            className="cursor-pointer md:w-[49px] w-[38px] h-full border-r border-[#8f8f8f] rounded-l-[8px] flex justify-center items-center transition-colors"
                        >
                            {isVideoEnabled ? (
                                <Video className="text-white md:size-[32px] size-[24px]" />
                            ) : (
                                <VideoOff className="text-white md:size-[32px] size-[24px]" />
                            )}
                        </button>
                        <div className="md:w-[41px] w-[33px] h-full flex justify-center items-center">
                            <EllipsisVertical className="text-white md:size-[24px] size-[20px]" />
                        </div>
                    </div>

                    <div className="md:w-[48px] w-[38px] md:h-[48px] h-[36px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <img src="/images/video/user-hidden.svg" alt="user-hidden" className="size-[32px]" />
                    </div>
                </div>
                <div className="flex gap-[16px]">
                    {/* Microphone Control */}
                    <div className="md:h-[48px] h-[36px] border border-[#8f8f8f] rounded-[8px] flex">
                        <button
                            className={`cursor-pointer md:w-[49px] w-[38px] h-full border-r border-[#8f8f8f] rounded-l-[8px] flex justify-center items-center transition-colors`}
                            onClick={isShareScreen ? stopScreenShare : startScreenShare}
                            disabled={isLoading}
                        >
                            {isShareScreen ? <ScreenShare className="text-white md:size-[32px] size-[24px]" /> : <ScreenShareOff className="text-white md:size-[32px] size-[24px]" />}
                        </button>
                        <div className="md:w-[41px] w-[33px] h-full flex justify-center items-center">
                            <Popover open={isScreenSharePopoverOpen} onOpenChange={setIsScreenSharePopoverOpen}>
                                <PopoverTrigger asChild>
                                    <button className="cursor-pointer w-[49px] h-full rounded-l-[8px] flex justify-center items-center transition-colors">
                                        <EllipsisVertical className="text-white size-[24px]" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[402px] bg-[#11131A] border-none p-[24px] rounded-[16px]">
                                    <div className="w-full">
                                        <p className="text-[20px]/[24px] text-white font-semibold">Start Sharing</p>
                                        <p className="text-[14px]/[20px] text-[#C5C6D0]">Choose what you want to share</p>
                                        <div className="flex gap-[24px] mt-[24px]">
                                            <div className="w-full flex flex-col items-center cursor-pointer group" onClick={() => {
                                                startScreenShare();
                                                setIsScreenSharePopoverOpen(false);
                                            }}>
                                                <div className="w-full pt-[16px] px-[16px] rounded-[16px] bg-[#272A31] group-hover:border-2 group-hover:border-[#8f8f8f] transition-all duration-200">
                                                    <img src="/images/video/screen.png" alt="" className="w-[133px] h-[88px]" />
                                                </div>
                                                <p className="text-[14px]/[20px] text-[#eff0fa] font-semibold mt-[16px]">Share Screen</p>
                                                <p className="text-[12px]/[16px] text-[#8f9099] text-center">Share a tab, window or your entire screen</p>
                                            </div>
                                            <div className="w-full flex flex-col items-center relative cursor-pointer group">
                                                <div className="absolute top-[8px] left-[8px]  w-[66px] h-[24px] rounded-[24px] bg-[#0d978b] flex justify-center items-center">
                                                    <Star className="size-[16px] text-white" />
                                                    <p className="text-[12px]/[16px] text-white font-semibold">New!</p>
                                                </div>
                                                <div className="w-full pt-[16px] px-[16px] rounded-[16px] bg-[#272A31] group-hover:border-2 group-hover:border-[#8f8f8f] transition-all duration-200">
                                                    <img src="/images/video/pdf.png" alt="" className="w-[133px] h-[88px]" />
                                                </div>
                                                <p className="text-[14px]/[20px] text-[#eff0fa] font-semibold mt-[16px]">Share PDF</p>
                                                <p className="text-[12px]/[16px] text-[#8f9099]  text-center">Annotate, draw shapes and more over PDFs</p>
                                            </div>
                                        </div>
                                    </div>

                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="md:w-[48px] w-[38px] md:h-[48px] h-[36px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <Hand className="text-white md:size-[32px] size-[24px]" />
                    </div>
                    <Popover open={isEmojiPopoverOpen} onOpenChange={setIsEmojiPopoverOpen}>
                        <PopoverTrigger asChild>
                            <button className="cursor-pointer md:w-[48px] w-[38px] md:h-[48px] h-[36px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center hover:bg-[#2e3038] transition-colors">
                                <Smile className="text-white md:size-[32px] size-[24px]" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] bg-[#11131A] border-[#2e3038] p-[16px] rounded-[12px] shadow-lg">
                            <div className="grid grid-cols-8 gap-[8px]">
                                {["👍", "👎", "👏", "🙌", "🤝", "👋", "✌️", "🤞", "❤️", "💙", "💚", "💛", "💜", "🧡", "🖤", "🤍", "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠"].map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="w-[32px] h-[32px] flex items-center justify-center text-[20px] hover:bg-[#2e3038] rounded-[6px] transition-colors cursor-pointer"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <div className="md:h-[48px] h-[36px] border border-[#c30606] rounded-[8px] flex bg-[#c30606]">
                        <button
                            className={`cursor-pointer md:w-[49px] w-[38px] h-full border-r border-[#270005] rounded-l-[8px] flex justify-center items-center transition-colors`}
                            onClick={() => setIsLeaveDialogOpen(true)}
                        >
                            <LogOut className="text-white md:size-[32px] size-[24px]" />
                        </button>
                        <div className="md:w-[41px] w-[33px] h-full flex justify-center items-center">
                            <EllipsisVertical className="text-white size-[24px]" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-[16px]">
                    <div onClick={() => setShowChat(!showChat)} className="cursor-pointer md:w-[48px] w-[38px] md:h-[48px] h-[36px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <MessageSquare className="text-white md:size-[32px] size-[24px]" />
                    </div>
                    <div className="p-[8px] md:h-[48px] h-[36px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center gap-[8px]">
                        <Users className="text-white md:size-[32px] size-[24px]" />
                        <span className="text-[16px]/[24px] text-[#ffffff] font-semibold">{currentUsers.length}</span>
                    </div>
                    <div className="md:w-[48px] w-[38px] md:h-[48px] h-[36px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center">
                        <AlignJustify className="text-white md:size-[32px] size-[24px]" />
                    </div>
                </div>
            </div>
            <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <DialogContent className="w-[360px] bg-[#11131A] rounded-[16px] p-[24px] border-none">
                    <div className="flex gap-[8px] items-center">
                        <TriangleAlert className="text-[#C30606] size-[18px]" />
                        <p className="text-[20px]/[24px] text-[#C30606] font-semibold">Leave Session</p>
                    </div>
                    <p className="text-[14px]/[20px] text-white mt-[8px]">Others will continue after you leave. You can join the session again.</p>
                    <div className="flex gap-[16px] mt-[16px]">
                        <Button variant="outline" className="w-full h-[48px] bg-transparent hover:bg-transparent cursor-pointer rounded-[8px] flex justify-center items-center gap-[8px]"
                            onClick={() => setIsLeaveDialogOpen(false)}
                        >
                            <span className="text-[16px]/[24px] text-white font-semibold">Cancel</span>
                        </Button>
                        <Button className="w-full h-[48px] cursor-pointer bg-[#c30606] hover:bg-[#c30606]/[0.8] rounded-[8px] flex justify-center items-center gap-[8px]"
                            onClick={() => router.push('/meeting')}
                        >
                            <span className="text-[16px]/[24px] text-white font-semibold">Leave Session</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}