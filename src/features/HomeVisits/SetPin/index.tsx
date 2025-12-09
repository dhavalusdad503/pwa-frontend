import { yupResolver } from "@hookform/resolvers/yup"
import Button from "@lib/Common/Button"
import Modal from "@lib/Common/Modal"
import PasswordField from "@lib/Common/PasswordField"
import { useSecurity } from "@pages/SecurityProvide"
import { confirmPasswordSchema, confirmPasswordType, resetPasswordSchema, ResetPasswordType } from "@schema/authSchema"
import { SubmitHandler, useForm } from "react-hook-form"
const defaultValues = {
    password: "",
    confirmPassword: ""
};
interface setPinProps {
    isOpen: boolean;
    isSetPassword: boolean
    setIsSetProps: React.Dispatch<React.SetStateAction<boolean>>;
}
const SetPin = ({ isOpen, isSetPassword = true, setIsSetProps }: setPinProps) => {
    // const [isOpen, setIsOpen] = useState<boolean>(true)
    const security = useSecurity();

    const {
        formState: { errors },
        register,
        handleSubmit
    } = useForm<ResetPasswordType>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(resetPasswordSchema)
    });

    const {
        formState: { errors: confirmPasswordError },
        register: confirmRegister,
        handleSubmit: confirmHandleSubmit
    } = useForm<confirmPasswordType>({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(confirmPasswordSchema)
    });

    const handleFormSubmit: SubmitHandler<ResetPasswordType> = async ({
        password
    }) => {
        try {
            if (isSetPassword) {
                await security.setup(password);
                setIsSetProps(false);
            }
        } catch (error) {
            console.log({ error });
        }
    };
    const handleConfirmFormSubmit: SubmitHandler<confirmPasswordType> = async ({ password }) => {
        try {
            await security.unlock(password)
        } catch (error) {
            console.log(error);
        }
    }
    return (<>
        <Modal
            isOpen={isOpen}
            onClose={() => undefined}
            id='appointment-edit-modal'
            title={isSetPassword ? 'Set Password' : 'Password Verification'}
            size='xs'
            closeButton={false}
            // footer={
            //     <div className='flex items-center justify-end gap-5'>
            //         <Button
            //             type='button'
            //             variant='outline'
            //             title='Cancel'
            //             onClick={() => setIsOpen(false)}
            //             className='rounded-10px !leading-5 !px-6'
            //         />
            //         <Button
            //             variant='filled'
            //             title='Save Changes'
            //             onClick={() => console.log('Submits')}
            //             className='rounded-10px !leading-5 !px-6'
            //         />
            //     </div>
            // }s
            children={
                <>
                    <div className="flex flex-col gap-4 w-full">
                        {/* Password */}
                        {isSetPassword ? (
                            <>
                                <PasswordField
                                    name="password"
                                    register={register}
                                    label="New Password"
                                    placeholder="Enter new password"
                                    icon="lock"
                                    iconFirst
                                    error={errors.password?.message}
                                />

                                <PasswordField
                                    name="confirmPassword"
                                    register={register}
                                    label="Confirm Password"
                                    placeholder="Re-enter new password"
                                    icon="lock"
                                    iconFirst
                                    error={errors.confirmPassword?.message}
                                />
                            </>

                        ) : (<PasswordField
                            name="password"
                            register={confirmRegister}
                            label="Password"
                            placeholder="Enter  password"
                            icon="lock"
                            iconFirst
                            error={confirmPasswordError.password?.message}
                        />
                        )}
                        {/* <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="none"
                                title="Back to Login"
                                className="font-bold text-primary !p-0"
                                onClick={() => navigate(ROUTES.LOGIN.path)}
                            />
                        </div> */}
                        <Button
                            type="submit"
                            variant="filled"
                            title={isSetPassword ? "Set Password" : "Submit Password"}
                            // isDisabled={isRestorePending}
                            className="w-full rounded-10px !font-bold !leading-5"
                            onClick={isSetPassword ? handleSubmit(handleFormSubmit) : confirmHandleSubmit(handleConfirmFormSubmit)}
                        />
                    </div>
                </>
            }
        ></Modal>
    </>)
}
export default SetPin
