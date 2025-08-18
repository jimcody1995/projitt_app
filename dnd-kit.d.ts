declare module '@dnd-kit/core' {
    import * as React from 'react';

    export interface DndContextProps {
        sensors?: any[];
        collisionDetection?: any;
        modifiers?: any[];
        onDragStart?: (event: any) => void;
        onDragMove?: (event: any) => void;
        onDragEnd?: (event: any) => void;
        onDragCancel?: (event: any) => void;
        children: React.ReactNode;
        id?: string;
    }

    export type DragEndEvent = any;
    export const closestCenter: any;
    export const MouseSensor: any;
    export const TouchSensor: any;
    export type UniqueIdentifier = string | number;

    export const DndContext: React.FC<DndContextProps>;
    export const useDraggable: (options: any) => any;
    export const useDroppable: (options: any) => any;
    export const DragOverlay: React.FC<any>;
    export const KeyboardSensor: any;
    export const PointerSensor: any;
    export const useSensor: (sensor: any, options?: any) => any;
    export const useSensors: (...sensors: any[]) => any;
}

declare module '@dnd-kit/modifiers' {
    export const restrictToVerticalAxis: any;
    export const restrictToParentElement: any;
}

declare module '@dnd-kit/sortable' {
    export const SortableContext: React.FC<any>;
    export const useSortable: (options: any) => any;
    export const verticalListSortingStrategy: any;
    export const horizontalListSortingStrategy: any;
}

declare module '@dnd-kit/utilities' {
    export const CSS: {
        Transform: {
            toString: (transform: any) => string;
        };
        Translate: {
            toString: (transform: any) => string;
        };
    };
}