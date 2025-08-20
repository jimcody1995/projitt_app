export default function Completed() {
    return <div
        className="md:w-[545px] w-full border border-[#e9e9e9] rounded-[16px] bg-white py-[38px] px-[40px] flex flex-col"
    >
        <div className="relative w-[100px] h-[100px] flex items-center justify-center">
            <div className="absolute w-[100px] h-[100px] rounded-full bg-[#0D978B33] ripple"></div>
            <div className="absolute w-[70px] h-[70px] rounded-full bg-[#0D978B] opacity-[20%] ripple delay-300"></div>
            <div className="relative z-10 flex items-center justify-center">
                <img
                    src="/images/icons/check-double.svg"
                    alt="check-icon"
                    className="w-[40px] h-[40px]"
                    id="check-success-icon"
                    data-testid="check-success-icon"
                />
            </div>
        </div>

        <p
            className="text-[22px]/[30px] font-semibold tracking-tight text-[#353535]  mt-[20px]"
            id="reset-success-title"
            data-testid="reset-success-title"
        >
            Assessment Completed
        </p>
        <p
            className="text-[15px]/[22px] mt-[10px] text-[#353535]"
            id="reset-success-subtext1"
            data-testid="reset-success-subtext1"
        >
            Thanks again for completing your assessment. Our team is currently reviewing your responses and will get back to you with the necessary information soon.
        </p>
    </div>;
}