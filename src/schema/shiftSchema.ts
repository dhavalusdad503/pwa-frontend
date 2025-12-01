import * as yup from 'yup';

import { validationRules } from '@/helper/validation';

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
  serviceType: validationRules.object({
    fieldName: 'Service type',
    isNullable: true,
    schema: {
      value: validationRules.string({
        fieldName: 'Service type',
        isNullable: true
      }),
      label: validationRules.string({
        fieldName: 'Service type',
        isNullable: true
      })
    }
  }),
  //   serviceType: yup
  //     .object({
  //       value: yup.string().nullable(),
  //       label: yup.string().nullable()
  //     })
  //     .nullable()
  //     .required(),
  notes: validationRules.string({
    fieldName: 'Notes',
    isRequired: false,
    isTrim: true,
    maxLength: 500
  }),
  // image: yup
  //   .mixed<File | string>()
  //   .nullable()
  //   .test('fileType', 'Only image files are allowed', (value) => {
  //     if (!value) return true;

  //     if (value instanceof File) {
  //       return imageMimeRegex.test(value.type);
  //     }

  //     if (typeof value === 'string') {
  //       return true;
  //     }

  //     return false;
  //   })
  //   .test('fileSize', 'File size must be less than 5MB', (value) => {
  //     if (!value) return true;

  //     if (value instanceof File) {
  //       return value.size <= 5 * 1024 * 1024;
  //     }

  //     return true;
  //   }),
  // client_present: validationRules.boolean({
  //   fieldName: 'Client present',
  //   isRequired: false
  // }),
  // medication_reviewed: validationRules.boolean({
  //   fieldName: 'Medication Reviewed',
  //   isRequired: false
  // }),
  // safety_check: validationRules.boolean({
  //   fieldName: 'Safety Check',
  //   isRequired: false
  // }),
  // follow_up: validationRules.boolean({
  //   fieldName: 'Follow Up',
  //   isRequired: false
  // }),
  // attestation: validationRules.boolean({
  //   fieldName: 'Attesation',
  //   isRequired: false
  // }),
  // attestation_image: yup.mixed<File | string>().nullable(),
  patientName: validationRules.string({
    fieldName: 'Patient name',
    isRequired: false
  }),
  address: validationRules.string({
    fieldName: 'Address',
    isRequired: false
  })
});

export type NewShiftSchemaType = yup.InferType<typeof newShiftSchema>;
