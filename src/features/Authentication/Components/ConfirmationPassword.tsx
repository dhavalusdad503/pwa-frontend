import { useResetPassword, useValidateLink } from "@api/auth";
import { tokenStorage } from "@api/tokenStorage";
import { getDefaultRouteByRole } from "@config/defaultRoutes";
import { ROUTES } from "@constant/routesPath";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@lib/Common/Button";
import Icon from "@lib/Common/Icon";
import SectionLoader from "@lib/Common/Loader/Spinner";
import PasswordField from "@lib/Common/PasswordField";
import { dispatchSetUser } from "@redux/dispatch/user.dispatch";
import { resetPasswordSchema, ResetPasswordType } from "@schema/authSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";



const defaultValues = {
    password: "",
    confirmPassword: ""
};

const ResetPassword = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const {
        formState: { errors },
        register,
        handleSubmit
    } = useForm<ResetPasswordType>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(resetPasswordSchema)
    });

    const { data: validLinkData, isLoading: isLinkValidated } = useValidateLink({ token })

    const { mutateAsync: resetPassword, isPending: isRestorePending } = useResetPassword()

    const handleFormSubmit: SubmitHandler<ResetPasswordType> = async ({
        password
    }) => {
        const response = await resetPassword({ token, new_password: password });
        const { success, data } = response;
        if (success && data) {
            const { user, token, refreshToken } = data;
            if (token) {
                await tokenStorage.setTokens({ accessToken: token });
                if (refreshToken) await tokenStorage.setRefreshToken(refreshToken);
                dispatchSetUser({ ...user, token, refreshToken });
                navigate(getDefaultRouteByRole(user?.role?.name));
            }
        }
    };
    if (!token) navigate(ROUTES.FORGET_PASSWORD.path)
    if (isLinkValidated) return <SectionLoader />
    return (
        <>
            {validLinkData ? (<div className="max-w-438px w-full m-auto">
                <div className="flex flex-col gap-30px items-center m-5">
                    <Icon name="lock" width={50} height={50} className="text-primary" />

                    <div className="flex flex-col gap-2.5 w-full items-center">
                        <h4 className="text-2xl font-bold text-blackdark">
                            Reset Your Password
                        </h4>
                        <p className="text-base font-normal text-blackdark/60 text-center">
                            Enter your new password below.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        {/* Password */}
                        <PasswordField
                            name="password"
                            register={register}
                            label="New Password"
                            placeholder="Enter new password"
                            icon="lock"
                            iconFirst
                            error={errors.password?.message}
                        />

                        {/* Confirm Password */}
                        <PasswordField
                            name="confirmPassword"
                            register={register}
                            label="Confirm Password"
                            placeholder="Re-enter new password"
                            icon="lock"
                            iconFirst
                            error={errors.confirmPassword?.message}
                        />
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="none"
                                title="Back to Login"
                                className="font-bold text-primary !p-0"
                                onClick={() => navigate(ROUTES.LOGIN.path)}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="filled"
                            title="Reset Password"
                            isDisabled={isRestorePending}
                            className="w-full rounded-10px !font-bold !leading-5"
                            onClick={handleSubmit(handleFormSubmit)}
                        />
                    </div>
                </div>
            </div>) : (
                <div className="absolute left-2/4 top-2/4 -translate-2/4">
                    <div className="flex flex-col items-center gap-5 max-w-md">
                        <Icon name="error" className="icon-wrapper w-20 h-20 text-red" />
                        <h3 className="text-2xl leading-6 sm:text-3xl font-bold sm:leading-8 text-blackdark capitalize text-center">
                            This reset link is invalid or has expired. Please request a new one.
                        </h3>
                        <Button
                            variant='filled'
                            type='button'
                            onClick={() => navigate(ROUTES.FORGET_PASSWORD.path)}
                            title='Request a new link'
                            parentClassName='w-full'
                            className='w-full rounded-10px !font-bold !leading-5'
                        />
                    </div>
                </div>
            )
            }
        </>
    );
};

export default ResetPassword;
