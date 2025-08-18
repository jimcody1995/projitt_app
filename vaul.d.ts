declare module 'vaul' {
    import * as React from 'react';

    export interface DrawerProps {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        modal?: boolean;
        nested?: boolean;
        dismissible?: boolean;
        shouldScaleBackground?: boolean;
        snapPoints?: number[];
        activeSnapPoint?: number | null;
        setActiveSnapPoint?: (snapPoint: number | null) => void;
        children: React.ReactNode;
    }

    export interface DrawerContentProps {
        children: React.ReactNode;
        className?: string;
    }

    export interface DrawerTriggerProps {
        children: React.ReactNode;
    }

    export interface DrawerPortalProps {
        children: React.ReactNode;
    }

    export interface DrawerOverlayProps {
        children?: React.ReactNode;
        className?: string;
    }

    export interface DrawerCloseProps {
        children?: React.ReactNode;
    }

    export interface DrawerTitleProps {
        children?: React.ReactNode;
        className?: string;
    }

    export interface DrawerDescriptionProps {
        children?: React.ReactNode;
        className?: string;
    }

    export const Drawer: React.FC<DrawerProps> & {
        Root: React.FC<DrawerProps>;
        Content: React.FC<DrawerContentProps>;
        Trigger: React.FC<DrawerTriggerProps>;
        Portal: React.FC<DrawerPortalProps>;
        Overlay: React.FC<DrawerOverlayProps>;
        Close: React.FC<DrawerCloseProps>;
        Title: React.FC<DrawerTitleProps>;
        Description: React.FC<DrawerDescriptionProps>;
    };
}