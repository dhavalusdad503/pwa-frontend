import OtpConfirmation from "@features/ForgetPassword/OtpConfirmation"

const OtpConfirmationPage = () => {

    return (<OtpConfirmation
        title="Enter Verification Code"
        subtitle="We sent a 6-digit code to your email."
        handleFormSubmit={(otp) => console.log("OTP:", otp)}
        isLoading={false}
        onResend={() => console.log("Resend")}
    />)
}
export default OtpConfirmationPage