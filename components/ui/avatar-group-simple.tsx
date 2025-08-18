'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface AvatarGroupProps {
    size?: string;
    group: Array<{
        path?: string;
        fallback?: string;
        variant?: string;
    }>;
    className?: string;
}

export function AvatarGroup({ size = 'size-8', group, className }: AvatarGroupProps) {
    return (
        <div className={cn('flex -space-x-2', className)}>
            {group.map((item, index) => (
                <Avatar key={index} className={cn(size, item.variant)}>
                    {item.path && <AvatarImage src={item.path} alt="avatar" />}
                    {item.fallback && <AvatarFallback>{item.fallback}</AvatarFallback>}
                </Avatar>
            ))}
        </div>
    );
}