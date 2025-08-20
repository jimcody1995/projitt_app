'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading,] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setEmailError("Email address is required");
            return false;
        }

        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return false;
        }

        setEmailError("");
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        // Clear error when user starts typing
        if (emailError && value.trim()) {
            setEmailError("");
        }
    };

    const handleContinue = async () => {
        if (!validateEmail(email)) {
            return;
        }

        router.push('/applicant/test/checkingCamera');

    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleContinue();
        }
    };
    return <div className="bg-white border border-[#bcbcbc] rounded-[16px] p-[40px] md:w-[544px] ">
        <p className="text-[22px]/[30px] font-semibold">Confirm your Email Address to continue</p>
        <p className="text-[14px]/[22px] text-[#353535] mt-[17px]">Email Address</p>
        <div className="mt-[12px]">
            <Input
                className={`h-[48px] ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter email address"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                type="email"
                disabled={isLoading}
            />
            {emailError && (
                <p className="text-red-500 text-[12px]/[18px] mt-[8px]">{emailError}</p>
            )}
        </div>
        <Button
            className="mt-[24px] h-[48px] w-full"
            onClick={handleContinue}
            disabled={isLoading || !email.trim()}
        >
            {isLoading ? "Verifying..." : "Continue"}
        </Button>
    </div>;
}