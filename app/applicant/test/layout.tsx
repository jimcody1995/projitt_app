
export default function TestLayout({ children }: { children: React.ReactNode }) {
    return <>
        <div className="flex flex-col justify-between pt-[30px] h-full items-center">
            <img src="/images/zaidLLC.png" className="h-[48px]" alt="logo" />
            <div className="px-[10px] flex-1 w-full flex flex-col items-center justify-center">
                {children}
            </div>
            <img src="/images/poweredBy.png" className="h-[28px]" alt="logo" />
        </div>
    </>;
}