declare module 'input-otp' {
    import * as React from 'react';

    export interface OTPInputProps {
        maxLength?: number;
        value?: string;
        onChange?: (value: string) => void;
        pattern?: RegExp;
        disabled?: boolean;
        children: React.ReactNode;
        className?: string;
        containerClassName?: string;
    }

    export interface OTPInputContextType {
        slots: {
            [key: number]: {
                char: string;
                hasFakeCaret: boolean;
                isActive: boolean;
            };
        };
        pattern?: RegExp;
        disabled?: boolean;
        setValue: (value: string) => void;
        setSlotFocus: (index: number) => void;
    }

    export const OTPInput: React.FC<OTPInputProps>;
    export const OTPInputContext: React.Context<OTPInputContextType>;
}