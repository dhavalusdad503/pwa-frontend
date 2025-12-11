import { validationRules } from '@helper/validation';
import * as yup from 'yup';
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];
export const newShiftSchema = yup.object().shape({
  startedAt: validationRules
    .string({ fieldName: 'Start Time', isRequired: true })
    .test(
      'start-time-required',
      'Start time is required',
      function startTimeValidation(value) {
        const { endedAt } = this.parent;
        return !endedAt || !!value;
      }
    ),

  endedAt: validationRules
    .string({ fieldName: 'End Time', isRequired: true })
    .test(
      'end-time-required',
      'End time is required',
      function endTimeValidation(value) {
        const { startedAt } = this.parent;
        return !startedAt || !!value;
      }
    ),
  serviceType: validationRules.object({
    fieldName: 'Service type',
    isRequired: true,
    // isNullable: false,
    schema: {
      value: validationRules.string({
        fieldName: 'Service type',
        isRequired: true

        // isNullable: false
      }),
      label: validationRules.string({
        fieldName: 'Service type',
        isRequired: true

        // isNullable: false
      })
    }
  }),
  notes: validationRules.string({
    fieldName: 'Notes',
    isRequired: false,
    isTrim: true,
    maxLength: 500
  }),
  image: yup
    .mixed<File>()
    .nullable()
    .test('fileSize', 'File size should be less than 2MB', (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test(
      'fileFormat',
      'Unsupported file format. Only jpg, jpeg, png allowed',
      (value) => {
        if (!value || !(value instanceof File)) return true;
        return SUPPORTED_FORMATS.includes(value.type);
      }
    ),
  clientPresent: validationRules.boolean({
    fieldName: 'Client present',
    isRequired: false
  }),
  medicationReviewed: validationRules.boolean({
    fieldName: 'Medication Reviewed',
    isRequired: false
  }),
  safetyCheck: validationRules.boolean({
    fieldName: 'Safety Check',
    isRequired: false
  }),
  followUp: validationRules.boolean({
    fieldName: 'Follow Up',
    isRequired: false
  }),
  attestation: validationRules
    .boolean({
      fieldName: 'Attesation checkbox',
      isRequired: true
    })
    .test('Checked', 'Attesation checkbox is required', (value) => {
      return !!value;
    }),
  attestationName: validationRules.string({
    fieldName: 'Attestation name',
    isRequired: true
  }),
  // attestation_image: yup.mixed<File | string>().nullable(),
  patientName: validationRules.string({
    fieldName: 'Patient name',
    isRequired: true
  }),
  address: validationRules.string({
    fieldName: 'Address',
    isRequired: true
  }),
  submittedAt: validationRules.string({
    fieldName: 'Submitted At',
    isRequired: false
  }),
  latitude: validationRules.number({
    fieldName: 'Latitude',
    isRequired: false
  }),
  longitude: validationRules.number({
    fieldName: 'Longitude',
    isRequired: false
  })
});

export type NewShiftFormSchemaType = yup.InferType<typeof newShiftSchema>;
