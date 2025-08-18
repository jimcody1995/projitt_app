'use client';

import React from 'react';

export interface DialogProps {
    children: React.ReactNode;
    className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ children, className }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const DialogContent: React.FC<DialogProps> = ({ children, className }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const DialogHeader: React.FC<DialogProps> = ({ children, className }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const DialogFooter: React.FC<DialogProps> = ({ children, className }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};