import { useForm } from "react-hook-form";
import { useLoginSchema, type LoginSchemaType } from "../../../schema/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const useLoginHook = () => {
    // Add your login logic here
    const defaultValues = {
        email: '',
        password: '',
    };
     const {
        setValue,
        getValues,
        reset,
        clearErrors,
        formState: { errors },
        handleSubmit,
        control
      } = useForm<LoginSchemaType>({
        mode: 'onChange',
        defaultValues: defaultValues,
        resolver: yupResolver(useLoginSchema),
      });
    return {};
}