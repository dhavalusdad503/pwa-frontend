import { CreateUserSchemaType } from "@/types";
import { USER_ROLE } from "@api/types/user.dto";
import { useCreateUser } from "@api/user";
import { AuthProvider } from "@constant/index";
import { ROUTES } from "@constant/routesPath";
import { formDataToDBObject } from "@helper/index";
import { yupResolver } from "@hookform/resolvers/yup";
import Breadcrumb from "@lib/Common/BreadCrumb";
import Button from "@lib/Common/Button";
import InputField from "@lib/Common/Input";
import PasswordField from "@lib/Common/PasswordField";
import { UserSchema } from "@schema/userSchema";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import {  useLocation, useNavigate } from "react-router-dom";


const CreateUser = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;
  const newUserRole = from === ROUTES.ADMIN_CAREGIVERS.path ? USER_ROLE.CAREGIVER : USER_ROLE.SUPERVISOR

  const { mutateAsync: createUser, isPending: isCreatePending } = useCreateUser();

  const defaultValues = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: ''
  }

  const methods = useForm<CreateUserSchemaType>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues,
    resolver: yupResolver(UserSchema) as unknown as Resolver<CreateUserSchemaType>
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    getValues,
  } = methods;

  const saveForm = async (formData: FormData) => {
    try {
      const dataObj = await formDataToDBObject<CreateUserSchemaType>(formData);

      if (navigator.onLine) {
        try {
          const response = await createUser(dataObj)// API expects FormData
          if (response && response.success !== false) {
              navigate(from); 
          }
        } catch (err) {
          console.error('Error in Create User', err);
        }
      }

    } catch (err) {
      console.error('Error in saveForm', err);
    }
  };

  const handleFormSubmit: SubmitHandler<CreateUserSchemaType> = async (
    data
  ) => {
    const formData = new FormData();
    const fields: (keyof CreateUserSchemaType)[] = [
      'email',
      'firstName',
      'lastName',
      'phone',
      'password',
    ];
    fields.forEach((field) => {
      const value = data[field];
      if (value !== undefined && value !== null) {
        formData.append(field, String(value));
      }
    });

    formData.append('authProvider', AuthProvider.EMAIL)
    formData.append('role', newUserRole)

    await saveForm(formData);
  };

  const handleFormError = (errors: any) => {
    console.error('❌ FORM VALIDATION FAILED:', errors);
    console.log('Current form values:', getValues());
  };

  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          { label: newUserRole, path: from },
          {
            label: 'New User',
            isActive: true
          }
        ]}
      />
      <div className="max-w-438px w-full m-auto">
        <div className=" flex flex-col gap-30px items-center  m-5">
          <div className="flex flex-col gap-2.5 w-full items-center ">
            <h4 className="text-2xl font-bold text-blackdark">Create {newUserRole === USER_ROLE.CAREGIVER ? 'Caregiver' : 'Supervisor'}</h4>
          </div>
          <div className="w-full flex flex-col gap-5 border border-primarylight p-2 rounded-lg">
            <InputField
              name="email"
              register={register}
              type="text"
              label="Email"
              placeholder="e.g., Johnson@yopmail.com"
              inputClass=" !border-primarylight"
            error={errors.email?.message}
            />
            <InputField
              name="firstName"
              register={register}
              type="text"
              label="First Name"
              placeholder="e.g., Johnson"
              inputClass=" !border-primarylight"
            error={errors.firstName?.message}
            />
            <InputField
              name="lastName"
              register={register}
              type="text"
              label="Last Name"
              placeholder="e.g., Mary"
              inputClass="!border-primarylight"
            error={errors.lastName?.message}
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
            <InputField
              name="phone"
              register={register}
              type="text"
              label="Phone"
              placeholder="e.g., 1234567890"
              inputClass="!border-primarylight"
            error={errors.phone?.message}
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Button
              type="submit"
              variant="filled"
              isLoading={isCreatePending}
              title={isCreatePending ? 'Submitting...' : 'Submit'}
              className="w-sm rounded-10px ! !font-bold !leading-5"
              isDisabled={isCreatePending}
              onClick={handleSubmit(handleFormSubmit, handleFormError)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUser;