import * as yup from 'yup';

import { validationRules } from '../helper/validation';
export const imageMimeRegex = /^image\/.*/;

export const useLoginSchema = yup.object({
  email: validationRules.email({
    fieldName: 'Email',
    isRequired: true
  }),
  password: yup.string().trim().required('New password is required')
  // .min(8, 'New password must be at least 8 characters')
  // .max(20, 'New password cannot exceed 20 characters')
  // .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
  // .matches(/[0-9]/, 'New password must contain at least one number')
  // .matches(
  //   /[@$!%*?&#]/,
  //   'New password must contain at least one special character (@$!%*?&#)'
  // )
  //  start_time: yup.date().nullable(),
  //     end_time: yup
  //       .date()
  //       .nullable()
  //       .test('end-after-start', 'End time must be after start time', function (value) {
  //         const { start_time } = this.parent;
  //         if (!value || !start_time) return true;

  //         const start = moment.tz(start_time, timezone);
  //         const end = moment.tz(value, timezone);

  //         const startMinutes = start.hours() * 60 + start.minutes();
  //         const endMinutes = end.hours() * 60 + end.minutes();

  //         return endMinutes > startMinutes;
  //       }),
  //     reason: yup.string().when(['start_time', 'end_time'], {
  //       is: (start_time: Date | null, end_time: Date | null) => {
  //         const oldStartTime = oldStart ? moment(oldStart).toISOString() : null;
  //         const oldEndTime = oldEnd ? moment(oldEnd).toISOString() : null;

  //         const newStartTime = start_time ? moment(start_time).toISOString() : null;
  //         const newEndTime = end_time ? moment(end_time).toISOString() : null;

  //         // Require reason ONLY if modified
  //         return oldStartTime !== newStartTime || oldEndTime !== newEndTime;
  //       },
  //       then: schema => schema.required('Reason is required when modifying session times'),
  //       otherwise: schema => schema.optional(),
  //     }),
});
export type LoginSchemaType = yup.InferType<typeof useLoginSchema>;

export const newShiftSchema = yup.object().shape({
  start_time: validationRules
    .string({ fieldName: 'Start Time', isRequired: true })
    .test(
      'start-time-required',
      'Start time is required',
      function startTimeValidation(value) {
        const { end_time: endTime } = this.parent;
        return !endTime || !!value;
      }
    ),

  end_time: validationRules
    .string({ fieldName: 'End Time', isRequired: true })
    .test(
      'end-time-required',
      'End time is required',
      function endTimeValidation(value) {
        const { start_time: startTime } = this.parent;
        return !startTime || !!value;
      }
    ),
  // type: validationRules.object({
  //   fieldName: 'Type',
  //   isNullable: true,
  //   schema: {
  //     value: validationRules.string({
  //       fieldName: 'Type',
  //       isNullable: true
  //     }),
  //     label: validationRules.string({
  //       fieldName: 'Type',
  //       isNullable: true
  //     })
  //   }
  // }),
  type: yup
    .object({
      value: yup.string().nullable(),
      label: yup.string().nullable()
    })
    .nullable()
    .required(),
  notes: validationRules.string({
    fieldName: 'Notes',
    isRequired: false,
    isTrim: true,
    maxLength: 500
  }),
  image: yup
    .mixed<File | string>()
    .nullable()
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true;

      if (value instanceof File) {
        return imageMimeRegex.test(value.type);
      }

      if (typeof value === 'string') {
        return true;
      }

      return false;
    })
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true;

      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }

      return true;
    }),
  client_present: validationRules.boolean({
    fieldName: 'Client present',
    isRequired: false
  }),
  medication_reviewed: validationRules.boolean({
    fieldName: 'Medication Reviewed',
    isRequired: false
  }),
  safety_check: validationRules.boolean({
    fieldName: 'Safety Check',
    isRequired: false
  }),
  follow_up: validationRules.boolean({
    fieldName: 'Follow Up',
    isRequired: false
  }),
  attestation: validationRules.boolean({
    fieldName: 'Attesation',
    isRequired: false
  }),
  attestation_image: yup.mixed<File | string>().nullable(),
  name: validationRules.string({
    fieldName: 'Name',
    isRequired: false
  }),
  address: validationRules.string({
    fieldName: 'Name',
    isRequired: false
  })
});

export type NewShiftSchemaType = yup.InferType<typeof newShiftSchema>;
