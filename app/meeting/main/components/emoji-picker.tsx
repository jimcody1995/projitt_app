import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { EMOJI_ARRAY } from "@/constants/emojis";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleEmojiClick = (emoji: string) => {
        onEmojiSelect(emoji);
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="cursor-pointer w-[48px] h-[48px] border border-[#8f8f8f] rounded-[8px] flex justify-center items-center hover:bg-[#2e3038] transition-colors">
                    <Smile className="text-white size-[32px]" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] bg-[#11131A] border-[#2e3038] p-[16px] rounded-[12px] shadow-lg">
                <div className="grid grid-cols-8 gap-[8px]">
                    {EMOJI_ARRAY.map((emoji, index) => (
                        <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="w-[32px] h-[32px] flex items-center justify-center text-[20px] hover:bg-[#2e3038] rounded-[6px] transition-colors cursor-pointer"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}