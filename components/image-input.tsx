'use client';

import React from 'react';

export interface ImageInputFile {
    url: string;
    name: string;
    type: string;
}

export interface ImageInputProps {
    onChange: (file: ImageInputFile | null) => void;
    children: React.ReactNode | ((props: { onImageUpload: () => void }) => React.ReactNode);
}

export const ImageInput: React.FC<ImageInputProps> = ({ onChange, children }) => {
    const handleImageUpload = () => {
        // Implementation would go here
        console.log('Image upload triggered');
    };

    return (
        <div>
            {typeof children === 'function'
                ? children({ onImageUpload: handleImageUpload })
                : children}
        </div>
    );
};