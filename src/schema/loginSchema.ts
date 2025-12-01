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

