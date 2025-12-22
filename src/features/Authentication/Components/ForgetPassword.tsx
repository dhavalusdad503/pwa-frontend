import { useForgetPassword } from "@api/auth";
import { ROUTES } from "@constant/routesPath";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@lib/Common/Button";
import Icon from "@lib/Common/Icon";
import InputField from "@lib/Common/Input";
import { forgetPasswordSchema, ForgetPasswordType } from "@schema/authSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";



const defaultValues = {
    email: ""
};

const ForgetPassword = () => {
    const navigate = useNavigate();

    const {
        formState: { errors },
        register,
        handleSubmit
    } = useForm<ForgetPasswordType>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(forgetPasswordSchema)
    });
    const { mutateAsync: forgetPassword, isPending: isSubmitted } = useForgetPassword()

    const handleFormSubmit: SubmitHandler<ForgetPasswordType> = async ({
        email
    }) => {
        await forgetPassword({ email })
        navigate(ROUTES.LOGIN.path);
    };

    return (
        <div className="max-w-438px w-full m-auto">
            <div className="flex flex-col gap-30px items-center m-5">
                <Icon name="email" width={50} height={50} className="text-primary" />

                <div className="flex flex-col gap-2.5 w-full items-center">
                    <h4 className="text-2xl font-bold text-blackdark">
                        Forgot Password?
                    </h4>
                    <p className="text-base font-normal text-blackdark/60 text-center">
                        Enter your registered email and we’ll send you instructions.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <InputField
                        name="email"
                        register={register}
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        icon="email"
                        iconFirst
                        inputClass="!border-primarylight"
                        error={errors.email?.message}
                    />
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="none"
                            title="Back to Login"
                            className="font-bold text-primary !p-0"
                            isDisabled={isSubmitted}
                            onClick={() => navigate(ROUTES.LOGIN.path)}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="filled"
                        title="Send Reset Link"
                        isDisabled={isSubmitted}
                        className="w-full rounded-10px !font-bold !leading-5"
                        onClick={handleSubmit(handleFormSubmit)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
