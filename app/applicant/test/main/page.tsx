
'use client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, EllipsisVertical, Play } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Main() {
    const router = useRouter();
    const [testType, setTestType] = useState('cognitive'); //cognitive, coding
    const params = useSearchParams();
    const camera = params.get('camera');
    const microphone = params.get('microphone');
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: "I prefer working on one task at a time rather than multitasking.",
            type: 'single',
            options: [
                { id: 1, text: "Strongly Disagree", isCorrect: false },
                { id: 2, text: "Disagree", isCorrect: false },
                { id: 3, text: "Neutral", isCorrect: true },
                { id: 4, text: "Agree", isCorrect: false },
                { id: 5, text: "Strongly Agree", isCorrect: false },
            ],
            answer: null as number | string | null,
        },
        {
            id: 2,
            question: "Describe how you would handle an overbearing superior at work.",
            type: 'longText',
            answer: null as number | string | null,
        },
        {
            id: 3,
            question: "Describe how you would handle an overbearing superior at work.",
            type: 'longText',
            answer: null as number | string | null,
        },
    ]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [remainTime, setRemainTime] = useState(2700);
    const [allTime, setAllTime] = useState(2700);
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainTime((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleNext = () => {
        setCurrentQuestion((prev) => prev + 1);
    };
    const handlePrevious = () => {
        setCurrentQuestion((prev) => prev - 1);
    };

    const handleSubmit = () => {
        router.push('/applicant/test/completed');
    }

    const [hasVideoPermission, setHasVideoPermission] = useState(false);
    const [hasMicPermission, setHasMicPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Drag functionality state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [videoPosition, setVideoPosition] = useState({ x: 40, y: 40 });

    // Set initial position to bottom-right corner after component mounts
    useEffect(() => {
        const setInitialPosition = () => {
            setVideoPosition({
                x: window.innerWidth - 307 - 40, // 40px from right edge
                y: window.innerHeight - 197 - 40  // 40px from bottom edge
            });
        };

        setInitialPosition();

        // Update position on window resize to maintain relative positioning
        const handleResize = () => {
            setVideoPosition(prev => ({
                x: Math.min(prev.x, window.innerWidth - 307),
                y: Math.min(prev.y, window.innerHeight - 197)
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            await requestVideoPermission();
        } else {
            const newVideoState = !isVideoEnabled;
            setIsVideoEnabled(newVideoState);

            if (streamRef.current) {
                const videoTrack = streamRef.current.getVideoTracks()[0];

                if (videoTrack) {
                    if (newVideoState) {
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

    const handleTurnOffCamera = () => {
        if (!streamRef.current) return;
        const videoTrack = streamRef.current.getVideoTracks()[0];
        console.log(videoTrack + "safsdf");

        videoTrack.stop();
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        // Remove the stopped track from the stream
        streamRef.current?.removeTrack(videoTrack);

        // If we still have audio, keep the stream, otherwise clear it
    }

    useEffect(() => {
        if (camera === 'true' && !isVideoEnabled) {
            requestVideoPermission();
        }
        return () => handleTurnOffCamera()
    }, [videoRef.current, camera]);

    // Drag functionality handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - videoPosition.x,
            y: e.clientY - videoPosition.y
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Optional: Add boundary constraints to keep video within viewport
        const maxX = window.innerWidth - 307; // video width
        const maxY = window.innerHeight - 197; // video height

        setVideoPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);


    // Toggle microphone


    return <div className="xl:w-[1163px] w-full h-full flex flex-col max-h-[700px] bg-white border border-[#e7e9ed] rounded-[12px]">
        {camera === 'true' && <div
            className={`fixed overflow-hidden border border-[#293042] flex justify-center items-center z-[4] w-[307px] h-[197px] rounded-[16px] bg-[#11131A] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
            style={{
                left: `${videoPosition.x}px`,
                top: `${videoPosition.y}px`
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="absolute bottom-[8px] left-[8px] py-[4px] px-[8px] text-[14px]/[20px]  text-white bg-[#000000A3] rounded-[8px] pointer-events-none">
                James Lee
            </div>
            <div className="absolute bottom-[8px] right-[8px] p-[4px] text-[14px]/[20px]  text-white bg-[#000000A3] rounded-[8px] pointer-events-auto cursor-pointer"
                onClick={(e) => e.stopPropagation()}>
                <Popover>
                    <PopoverTrigger asChild>
                        <EllipsisVertical className="size-[20px]"></EllipsisVertical>
                    </PopoverTrigger>
                    <PopoverContent className="w-[150px] p-0 py-[10px]">
                        <div className="flex flex-col gap-[8px]">
                            <div className="py-[8px] px-[10px] text-[14px]/[20px] hover:bg-[#a5a5a5a3]" onClick={toggleVideo}>
                                Show Video
                            </div>
                            <div className="py-[8px] px-[10px] text-[14px]/[20px] hover:bg-[#a5a5a5a3]" onClick={toggleMic}>
                                Show Microphone
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <video ref={videoRef} autoPlay playsInline muted className="h-full object-cover pointer-events-none" />
        </div>
        }
        <div className="pt-[28px] px-[52px] pb-[24px] w-full flex justify-between items-center">
            <p className="text-[#2a2a2a] font-medium text-[16px]/[140%]">{testType === 'cognitive' ? 'Cognitive Test' : 'Coding Test'}</p>
            <p className="text-[#2a2a2a] font-semibold text-[18px]/[140%]">{Math.floor(remainTime / 60) + ':' + (remainTime % 60 < 10 ? '0' + remainTime % 60 : remainTime % 60)}</p>
            <p className="text-[#2a2a2a]  text-[16px]/[140%]">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className="w-full h-[4px] bg-[#e9e9e9]">
            <div className="h-full  bg-[#0d978b]" style={{ width: (remainTime / allTime) * 100 + '%' }}></div>
        </div>
        {testType === 'cognitive' && <div className="py-[43px] px-[48px]">
            <p className="text-[#8a8a8a] text-[14px]">Quesion {currentQuestion + 1}</p>
            <p className="text-[#1c1c1c] font-medium text-[16px] mt-[22px]">{questions[currentQuestion].question}</p>
            {questions[currentQuestion].type === 'single' && (
                <div className="mt-[11px] flex flex-col gap-[8px]">
                    {(questions[currentQuestion].options || []).map((option) => (
                        <div key={option.id} className="flex items-center gap-[8px]">
                            <div className={`border border-[#e2e4e2] w-[28px] h-[28px] rounded-full flex justify-center items-center cursor-pointer ${questions[currentQuestion].answer === option.id ? 'bg-[#0d978b] text-white' : ''}`} onClick={() => {
                                setQuestions(prevQuestions => {
                                    const updatedQuestions = [...prevQuestions];
                                    updatedQuestions[currentQuestion] = {
                                        ...updatedQuestions[currentQuestion],
                                        answer: option.id
                                    };
                                    return updatedQuestions;
                                });
                            }}>{String.fromCharCode(96 + option.id)}</div>
                            <p className="text-[#1c1c1c] text-[16px]">{option.text}</p>
                        </div>
                    ))}
                </div>
            )}
            {questions[currentQuestion].type === 'longText' && (
                <div className="mt-[22px]">
                    <Textarea name="" id="" cols={30} rows={10} value={questions[currentQuestion].answer || ''} onChange={(e) => {
                        setQuestions(prevQuestions => {
                            const updatedQuestions = [...prevQuestions];
                            updatedQuestions[currentQuestion] = {
                                ...updatedQuestions[currentQuestion],
                                answer: e.target.value
                            };
                            return updatedQuestions;
                        });
                    }}></Textarea>
                </div>
            )}

            <div className="mt-[22px] flex gap-[20px]">
                {currentQuestion > 0 && <Button variant="outline" className="w-[108px] h-[42px]" onClick={handlePrevious}>Previous</Button>}
                {currentQuestion < questions.length - 1 ? <Button className="w-[108px] h-[42px]" onClick={handleNext}>Next </Button> : <Button className="w-[108px] h-[42px]" onClick={handleSubmit}>Submit</Button>}
            </div>
        </div>}
        {testType === 'coding' && <div className="bg-black flex-1 w-full p-[20px] flex gap-[20px] md:flex-row flex-col">
            <div className="flex-1 order-2 md:order-1 h-full flex flex-col gap-[10px]">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="py-[14px] px-[20px] bg-[#353535] text-white text-[14px]/[20px] font-medium rounded-[8px]">
                            Instructions
                        </div>
                        <div className="py-[14px] px-[20px] text-[#d2d2d2] text-[14px]/[20px] font-medium rounded-[8px]">
                            Output
                        </div>
                    </div>
                    <button className="bg-[#683400] text-white text-[14px]/[20px] font-medium py-[4px] px-[15px] cursor-pointer rounded-[8px]">Finish Task</button>
                </div>
                <div className="bg-[#1c1c1c] p-[20px] rounded-[12px] flex-1">

                </div>
            </div>
            <div className="md:w-[663px] w-full order-1 md:order-2 h-full flex flex-col">
                <div className="flex justify-between bg-[#353535] py-[6px] px-[20px] items-center rounded-t-[12px]">
                    <p className="text-white text-[14px]/[20px] font-medium">Solution</p>
                    <div className="flex gap-[20px]">
                        <button className="bg-[#626262] text-white text-[14px]/[20px] font-medium py-[4px] px-[15px] cursor-pointer w-[90px] h-[28px] rounded-[4px] flex items-center justify-between">
                            React
                            <ChevronDown className="size-[14px]" />
                        </button>
                        <Button className="bg-[#0d978b] text-white text-[14px]/[20px] font-medium py-[4px] px-[15px] cursor-pointer flex items-center gap-[4px] w-[104px] h-[28px]">
                            <Play className="size-[10px]" />
                            Run Code</Button>
                    </div>
                </div>
                <div className="bg-[#1c1c1c] flex-1 overflow-y-auto max-h-[570px] [scrollbar-width:thin] 
  [scrollbar-color:white#11131a]">
                    <CodeMirror
                        value="console.log('Hello CodeMirror!');"
                        className="h-full"
                        extensions={[javascript()]}
                        theme="dark"
                        onChange={(value) => {
                            console.log("Code changed:", value);
                        }}
                    />
                </div>
            </div>
        </div>}
    </div>;
}
