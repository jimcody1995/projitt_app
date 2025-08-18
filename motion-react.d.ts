declare module 'motion/react' {
    export interface HTMLMotionProps<T extends keyof JSX.IntrinsicElements> extends React.HTMLAttributes<T> {
        initial?: any;
        animate?: any;
        exit?: any;
        variants?: any;
        transition?: any;
        whileHover?: any;
        whileTap?: any;
        whileFocus?: any;
        whileDrag?: any;
        whileInView?: any;
        style?: React.CSSProperties;
    }

    export interface MotionProps {
        initial?: any;
        animate?: any;
        exit?: any;
        variants?: any;
        transition?: any;
        whileHover?: any;
        whileTap?: any;
        whileFocus?: any;
        whileDrag?: any;
        whileInView?: any;
    }

    export interface Transition {
        duration?: number;
        delay?: number;
        ease?: string | number[];
        times?: number[];
        repeat?: number;
        repeatDelay?: number;
        repeatType?: 'loop' | 'reverse' | 'mirror';
        type?: string;
    }

    export interface Variants {
        [key: string]: any;
    }

    export interface UseInViewOptions {
        root?: React.RefObject<Element>;
        margin?: string;
        amount?: 'some' | 'all' | number;
        once?: boolean;
    }

    export interface SpringOptions {
        stiffness?: number;
        damping?: number;
        mass?: number;
        velocity?: number;
        restSpeed?: number;
        restDelta?: number;
    }

    export const motion: {
        [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<HTMLMotionProps<K>>;
    };

    export function useInView(ref: React.RefObject<Element>, options?: UseInViewOptions): boolean;
    export function useMotionValue<T>(initial: T): { get: () => T; set: (v: T) => void };
    export function useSpring<T>(value: any, options?: SpringOptions): { get: () => T; set: (v: T) => void };
    export function animate(from: number, to: number, options?: any): { stop: () => void };
}