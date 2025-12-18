import { validationRules } from '@helper/validation';
import * as yup from 'yup';

export const UserSchema = yup.object({
  email: validationRules.email({
    fieldName: 'Email',
    isRequired: true,
    isTrim: true
  }),
  firstName: validationRules.string({
    fieldName: 'First Name',
    isRequired: true,
    isTrim: true
  }),
  lastName: validationRules.string({
    fieldName: 'Last Name',
    isRequired: true,
    isTrim: true
  }),
  phone: validationRules.string({
    fieldName: 'Phone',
    isRequired: false,
    isTrim: true
  }),
  password: validationRules.string({
    fieldName: 'Password',
    isRequired: true,
    isTrim: true
  }),

});