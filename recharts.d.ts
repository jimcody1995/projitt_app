declare module 'recharts' {
    import * as React from 'react';

    export interface LineProps {
        type?: string;
        dataKey?: string;
        name?: string;
        stroke?: string;
        strokeWidth?: number;
        dot?: boolean | object;
        activeDot?: boolean | object;
        legendType?: string;
        connectNulls?: boolean;
        [key: string]: any;
    }

    export interface AreaProps {
        type?: string;
        dataKey?: string;
        name?: string;
        stroke?: string;
        fill?: string;
        fillOpacity?: number;
        stackId?: string;
        [key: string]: any;
    }

    export interface BarProps {
        dataKey?: string;
        name?: string;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        stackId?: string;
        barSize?: number;
        [key: string]: any;
    }

    export interface PieProps {
        dataKey?: string;
        nameKey?: string;
        cx?: string | number;
        cy?: string | number;
        innerRadius?: number | string;
        outerRadius?: number | string;
        fill?: string;
        [key: string]: any;
    }

    export interface TooltipProps {
        content?: React.ReactNode | ((props: any) => React.ReactNode);
        cursor?: boolean | object;
        offset?: number;
        [key: string]: any;
    }

    export interface LegendProps {
        align?: 'left' | 'center' | 'right';
        verticalAlign?: 'top' | 'middle' | 'bottom';
        layout?: 'horizontal' | 'vertical';
        [key: string]: any;
    }

    export interface CartesianGridProps {
        strokeDasharray?: string;
        [key: string]: any;
    }

    export interface XAxisProps {
        dataKey?: string;
        type?: 'number' | 'category';
        allowDecimals?: boolean;
        domain?: [number | string, number | string];
        [key: string]: any;
    }

    export interface YAxisProps {
        dataKey?: string;
        type?: 'number' | 'category';
        allowDecimals?: boolean;
        domain?: [number | string, number | string];
        [key: string]: any;
    }

    export const Line: React.FC<LineProps>;
    export const Area: React.FC<AreaProps>;
    export const Bar: React.FC<BarProps>;
    export const Pie: React.FC<PieProps>;
    export const Tooltip: React.FC<TooltipProps>;
    export const Legend: React.FC<LegendProps>;
    export const CartesianGrid: React.FC<CartesianGridProps>;
    export const XAxis: React.FC<XAxisProps>;
    export const YAxis: React.FC<YAxisProps>;
    export const LineChart: React.FC<any>;
    export const AreaChart: React.FC<any>;
    export const BarChart: React.FC<any>;
    export const PieChart: React.FC<any>;
    export const ResponsiveContainer: React.FC<any>;
}