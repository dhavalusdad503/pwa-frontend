import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@lib/Common/Button";
import Icon from "@lib/Common/Icon";

const OTP_LENGTH = 6;
const INITIAL_COUNTDOWN = 30;

interface OtpConfirmationProps {
    title: string;
    subtitle?: string;
    handleFormSubmit: (otp: string) => void | Promise<void>;
    isLoading?: boolean;
    onResend?: () => void | Promise<void>;
}

const OtpConfirmation: React.FC<OtpConfirmationProps> = ({
    title,
    subtitle = "We sent a 6-digit code to your email. Enter it below.",
    handleFormSubmit,
    isLoading = false,
    onResend,
}) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState<number>(INITIAL_COUNTDOWN);
    const timerRef = useRef<number | null>(null);

    const startTimer = useCallback(() => {
        // clear any existing timer
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setCountdown(INITIAL_COUNTDOWN);
        timerRef.current = window.setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);
    }, []);

    useEffect(() => {
        // start countdown on mount
        startTimer();
        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [startTimer]);

    useEffect(() => {
        // stop timer when reaches zero
        if (countdown <= 0 && timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
            setCountdown(0);
        }
    }, [countdown]);

    const handleOtpChange = useCallback((value: string, index: number) => {
        setOtp((prevOtp) => {
            const newOtp =
                prevOtp.substring(0, index) + value + prevOtp.substring(index + 1);

            // Auto move to next field
            if (value && index < OTP_LENGTH - 1) {
                inputsRef.current[index + 1]?.focus();
            }

            // Auto move to previous field on backspace
            if (!value && index > 0) {
                inputsRef.current[index - 1]?.focus();
            }

            return newOtp;
        });
    }, []);

    const handleBackspace = useCallback((e: React.KeyboardEvent, index: number) => {
        if (e.key !== "Backspace") return;

        setOtp((prevOtp) => {
            const otpArray = prevOtp.split("");

            if (!otpArray[index] && index > 0) {
                otpArray[index - 1] = "";
                inputsRef.current[index - 1]?.focus();
            } else {
                otpArray[index] = "";
            }

            return otpArray.join("");
        });
    }, []);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();

        const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pasted) return;

        const finalOtp = pasted.slice(0, OTP_LENGTH);
        setOtp(finalOtp);

        // Show digits in UI inputs
        finalOtp.split("").forEach((digit, idx) => {
            if (inputsRef.current[idx]) {
                inputsRef.current[idx]!.value = digit;
            }
        });

        // Clear remaining inputs
        for (let i = finalOtp.length; i < OTP_LENGTH; i++) {
            if (inputsRef.current[i]) {
                inputsRef.current[i]!.value = "";
            }
        }

        // Focus last filled field
        inputsRef.current[Math.min(finalOtp.length - 1, OTP_LENGTH - 1)]?.focus();
    }, []);

    const handleSubmit = useCallback(async () => {
        if (otp.length === OTP_LENGTH) {
            await handleFormSubmit(otp);
        }
    }, [otp, handleFormSubmit]);

    const handleResendClick = useCallback(async () => {
        if (!onResend) return;
        try {
            await onResend();
        } catch (err) {
            // handle or log the error so the try has a catch branch
            console.error('Resend failed:', err);
        } finally {
            // restart countdown regardless of onResend success/failure
            startTimer();
        }
    }, [onResend, startTimer]);

    return (
        <div className="max-w-438px w-full m-auto">
            <div className="flex flex-col gap-30px items-center m-5">
                <Icon name="email" width={50} height={50} className="text-primary" />

                <div className="flex flex-col gap-2.5 w-full items-center">
                    <h4 className="text-2xl font-bold text-blackdark">{title}</h4>
                    <p className="text-base font-normal text-blackdark/60 text-center">
                        {subtitle}
                    </p>
                </div>

                {/* OTP Input Boxes */}
                <div className="flex gap-3 justify-center">
                    {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            maxLength={1}
                            autoComplete="off"
                            type="text"
                            inputMode="numeric"
                            className="w-12 h-12 border text-xl text-center rounded-md"
                            value={otp[index] || ""}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            onKeyDown={(e) => handleBackspace(e, index)}
                            onPaste={handlePaste}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between w-full px-2">
                    {onResend ? (
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="none"
                                title="Resend Code"
                                className="font-bold text-primary !p-0"
                                onClick={handleResendClick}
                                isDisabled={isLoading || countdown > 0}
                            />
                            {countdown > 0 ? (
                                <span className="text-sm text-blackdark/60">
                                    Resend in {countdown}s
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <Button
                        type="button"
                        variant="filled"
                        title="Verify OTP"
                        isDisabled={otp.length !== OTP_LENGTH || isLoading}
                        className="w-full rounded-10px !font-bold !leading-5"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default OtpConfirmation;