import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLoginSchema, type LoginSchemaType } from '../../schema/loginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import Icon from '@/lib/Common/Icon';
import InputField from '@/lib/Common/Input';
import PasswordField from '@/lib/Common/PasswordField';
import Button from '@/lib/Common/Button';

const Login = () => {
  const defaultValues = {
    email: '',
    password: ''
  };
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<LoginSchemaType>({
    mode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(useLoginSchema)
  });
  const handleFormSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    console.log('Form Data', data);
  };
  const isLoading = false;
  return (
    <>
      <div className="max-w-438px w-full m-auto">
        <div className=" flex flex-col gap-30px items-center  m-5">
          <Icon
            name="AddUser"
            width={50}
            height={50}
            className="text-primary "
          />

          <div className="flex flex-col gap-2.5 w-full items-center ">
            <h4 className="text-2xl font-bold text-blackdark">
              Sign In to your Account
            </h4>
            <p className="text-base font-normal text-blackdark/60">
              Welcome Back! Please Enter Your Detail
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <InputField
              name="email"
              register={register}
              type="email"
              label="Email"
              placeholder="Email"
              icon="email"
              iconFirst
              inputClass="!border-primarylight"
              error={errors.email?.message}
            />

            <PasswordField
              name="password"
              register={register}
              label="Password"
              placeholder="Password"
              icon="lock"
              iconFirst
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="none"
                title="Forgot Password?"
                className="font-bold text-primary !p-0"
                // onClick={handleForgotPassword}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Button
              type="submit"
              variant="filled"
              // isLoading={isLoading}
              title={isLoading ? 'Signing In...' : 'Sign In'}
              className="w-full rounded-10px ! !font-bold !leading-5"
              // isDisabled={isLoading}
              onClick={handleSubmit(handleFormSubmit)}
            />

            <div className="relative">
              <div className="h-1px bg-primarylight w-full my-2.5" />
              <div className="absolute left-2/4 -translate-x-2/4 bg-white rounded-full px-3.5 -top-0.5">
                <span className="text-xl leading-4">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              title="Sign in with Organization (SSO)"
              className="w-full rounded-10px !font-semibold !border-primarylight"
              onClick={handleSubmit(handleFormSubmit)}
              icon={<Icon name="amd" />}
              isIconFirst
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
