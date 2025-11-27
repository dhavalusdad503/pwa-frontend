import { parsePhoneNumberFromString } from 'libphonenumber-js';
import * as yup from 'yup';
// import { emailRegex, phonenoPlusAdd } from '.';
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// // Define common schema argument types
interface BaseSchemaArgs {
  isRequired?: boolean;
  isNullable?: boolean;
}

// Specific arguments for each schema type
interface StringSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  isTrim?: boolean;
}

interface NumberSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  min?: number;
  max?: number;
}

interface BooleanSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
}

interface ArraySchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  min?: number;
}

interface ObjectSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  schema: yup.ObjectShape;
  requiredMessage?: string;
}

interface EmailSchemaArgs extends BaseSchemaArgs {
  fieldName?: string;
  requiredMessage?: string;
}

interface PhoneSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  isValidKey?: string;
}

// Dynamically infer the correct type for Yup's schemas
type DynamicStringSchema<T extends StringSchemaArgs> =
  T['isRequired'] extends true
    ? T['isNullable'] extends true
      ? yup.StringSchema<string | null, yup.AnyObject, undefined, ''>
      : yup.StringSchema<string, yup.AnyObject, undefined, ''>
    : T['isNullable'] extends true
      ? yup.StringSchema<
          string | null | undefined,
          yup.AnyObject,
          undefined,
          ''
        >
      : yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>;

type DynamicNumberSchema<T extends NumberSchemaArgs> =
  T['isRequired'] extends true
    ? T['isNullable'] extends true
      ? yup.NumberSchema<number | null, yup.AnyObject, undefined, ''>
      : yup.NumberSchema<number, yup.AnyObject, undefined, ''>
    : T['isNullable'] extends true
      ? yup.NumberSchema<
          number | null | undefined,
          yup.AnyObject,
          undefined,
          ''
        >
      : yup.NumberSchema<number | undefined, yup.AnyObject, undefined, ''>;

type DynamicBooleanSchema<T extends BooleanSchemaArgs> =
  T['isRequired'] extends true
    ? T['isNullable'] extends true
      ? yup.BooleanSchema<boolean | null, yup.AnyObject, undefined, ''>
      : yup.BooleanSchema<boolean, yup.AnyObject, undefined, ''>
    : T['isNullable'] extends true
      ? yup.BooleanSchema<
          boolean | null | undefined,
          yup.AnyObject,
          undefined,
          ''
        >
      : yup.BooleanSchema<boolean | undefined, yup.AnyObject, undefined, ''>;

type DynamicArraySchema<
  T extends ArraySchemaArgs,
  ItemType = unknown
> = T['isRequired'] extends true
  ? T['isNullable'] extends true
    ? yup.ArraySchema<ItemType[] | null, yup.AnyObject, undefined, ''>
    : yup.ArraySchema<ItemType[], yup.AnyObject, undefined, ''>
  : T['isNullable'] extends true
    ? yup.ArraySchema<
        ItemType[] | null | undefined,
        yup.AnyObject,
        undefined,
        ''
      >
    : yup.ArraySchema<ItemType[] | undefined, yup.AnyObject, undefined, ''>;

type DynamicObjectSchema<T extends ObjectSchemaArgs> =
  T['isRequired'] extends true
    ? T['isNullable'] extends true
      ? yup.ObjectSchema<yup.TypeFromShape<T['schema'], T['schema']> | null>
      : yup.ObjectSchema<yup.TypeFromShape<T['schema'], T['schema']>>
    : T['isNullable'] extends true
      ? yup.ObjectSchema<yup.TypeFromShape<T['schema'], T['schema']>>
      : yup.ObjectSchema<yup.TypeFromShape<T['schema'], T['schema']>>;

type DynamicEmailSchema<T extends EmailSchemaArgs> =
  T['isRequired'] extends true
    ? yup.StringSchema<string, yup.AnyObject, undefined, ''>
    : T['isNullable'] extends true
      ? yup.StringSchema<string | null, yup.AnyObject, undefined, ''>
      : yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>;

type DynamicPhoneSchema<T extends PhoneSchemaArgs> =
  T['isRequired'] extends true
    ? yup.StringSchema<string, yup.AnyObject, undefined, ''>
    : T['isNullable'] extends true
      ? yup.StringSchema<string | null, yup.AnyObject, undefined, ''>
      : yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>;

export const validationRules = {
  string: <T extends StringSchemaArgs>({
    fieldName,
    isRequired = false,
    requiredMessage,
    isTrim = true,
    isNullable = false
  }: T): DynamicStringSchema<T> => {
    let schema = yup.string().nullable();

    if (isTrim) schema = schema.trim();

    if (isRequired) {
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    }

    if (isNullable) {
      schema = schema.nullable();
    }

    return schema as DynamicStringSchema<T>;
  },

  /**
   * Number Validation (Fixed for TypeScript)
   */
  number: <T extends NumberSchemaArgs>({
    fieldName,
    isRequired = false,
    requiredMessage,
    min,
    max,
    isNullable = false
  }: T): DynamicNumberSchema<T> => {
    let schema = yup.number().nullable();

    if (isRequired)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (isNullable) schema = schema.nullable();
    if (min !== undefined)
      schema = schema.min(min, `${fieldName} must be at least ${min}`);
    if (max !== undefined)
      schema = schema.max(max, `${fieldName} must not exceed ${max}`);

    return schema as DynamicNumberSchema<T>;
  },

  /**
   * Boolean Validation (Fixed for TypeScript)
   */
  boolean: <T extends BooleanSchemaArgs>({
    fieldName,
    isRequired = false,
    requiredMessage,
    isNullable = false
  }: T): DynamicBooleanSchema<T> => {
    let schema = yup.boolean().nullable();
    
    if (isRequired)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (isNullable) schema = schema.nullable();

    return schema as DynamicBooleanSchema<T>;
  },

  /**
   * Array Validation (Fully Fixed)
   */
  array: <T extends ArraySchemaArgs>({
    fieldName,
    min = 1,
    isRequired = false,
    requiredMessage,
    isNullable = false
  }: T): DynamicArraySchema<T> => {
    let schema = yup.array().of(yup.mixed()).nullable();

    if (isRequired)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (isNullable) schema = schema.nullable();
    schema = schema.min(
      min,
      requiredMessage || `${fieldName} must have at least ${min} item(s)`
    );

    return schema as unknown as DynamicArraySchema<T>;
  },

  /**
   * Object Validation (Fully Fixed)
   */
  object: <T extends ObjectSchemaArgs>({
    fieldName,
    schema,
    isRequired = false,
    requiredMessage,
    isNullable = true
  }: T): DynamicObjectSchema<T> => {
    let objectSchema = yup.object(schema).nullable();

    if (isNullable) objectSchema = objectSchema.nullable();
    if (isRequired)
      objectSchema = objectSchema.required(
        requiredMessage || `${fieldName} is required`
      );

    return objectSchema as DynamicObjectSchema<T>;
  },

  /**
   * Email Validation (Fully Fixed)
   */
  email: <T extends EmailSchemaArgs>({
    fieldName = 'email',
    isRequired = false,
    requiredMessage,
    isNullable = false
  }: T): DynamicEmailSchema<T> => {
    let schema = yup
      .string()
      .matches(emailRegex, `Invalid ${fieldName} address`)
      .nullable();

    if (isRequired)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (isNullable) schema = schema.nullable();

    return schema as DynamicEmailSchema<T>;
  },
  phone: <T extends PhoneSchemaArgs>({
    fieldName,
    isRequired = false,
    requiredMessage,
    isValidKey = 'isValid',
    isNullable = false
  }: T): DynamicPhoneSchema<T> => {
    let schema = yup.string().nullable();

    if (isRequired)
      schema = schema
        .required(requiredMessage || `${fieldName} is required`)
        .min(5, requiredMessage || `${fieldName} is required`);
    if (isNullable) schema = schema.nullable();

    return schema.test(
      'is-valid-phone',
      `${fieldName || 'Phone number'} is invalid`,
      function isValidPhone(value) {
        // If value is empty, do not apply the validation test
        if (!value) return !isRequired;
        return this.parent?.[isValidKey] ?? false;
      }
    ) as DynamicPhoneSchema<T>;
  },

//   usPhoneNumber: <T extends PhoneSchemaArgs>({
//     fieldName,
//     isRequired = false,
//     requiredMessage,
//     isNullable = false
//   }: T): DynamicPhoneSchema<T> => {
//     let schema = yup.string().nullable();

//     if (isRequired)
//       schema = schema.required(requiredMessage || `${fieldName} is required`);
//     if (isNullable) schema = schema.nullable();

//     return schema.test(
//       'is-valid-phone',
//       `Please Enter a Valid ${fieldName || 'Phone number'}`,
//       function isValidPhone(value) {
//         if (!value) return !isRequired;
//         try {
//           // Parse and validate number
//           const phoneValue = phonenoPlusAdd(value) || '';
//           const phoneNumber = parsePhoneNumberFromString(phoneValue, 'US');

//           // Check: must be a valid US number
//           if (!phoneNumber || phoneNumber?.nationalNumber?.length < 10)
//             return false;

//           return phoneNumber?.isPossible();
//         } catch {
//           return false;
//         }
//       }
//     ) as DynamicPhoneSchema<T>;
//   }
};
