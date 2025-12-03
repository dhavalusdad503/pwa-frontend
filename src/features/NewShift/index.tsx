import { useCreateShift } from '@api/newShift';
import { ROUTES } from '@constant/routesPath';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@lib/Common/Button';
import InputField from '@lib/Common/Input';
import Select from '@lib/Common/Select';
import TextArea from '@lib/Common/Textarea';
import TimeSelect from '@lib/Common/TimeSelect';
import { NewShiftFormSchemaType, newShiftSchema } from '@schema/shiftSchema';
import moment from 'moment';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import type { NewShiftSchemaType, OptionTypeGlobal } from '@/types';
import { saveFormOffline } from '@/db';
import { logger } from '@sentry/react';


const defaultValues = {
  startedAt: '',
  endedAt: '',
  serviceType: undefined,
  notes: '', // Default value provided
  patientName: '', // Default value provided
  address: '', // Default value provided
  submittedAt: new Date().toISOString(), // Default value provided
};

const typeOptions: OptionTypeGlobal[] = [
  { label: 'Morning Shift', value: 'morning' },
  { label: 'Afternoon Shift', value: 'afternoon' },
  { label: 'Night Shift', value: 'night' },
  { label: 'Full Day', value: 'full_day' },
  { label: 'Half Day', value: 'half_day' }
];
const Shift = () => {
  const Navigate = useNavigate();
  const methods = useForm<NewShiftSchemaType>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues,
    resolver: yupResolver(newShiftSchema)
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    // reset,
    getValues,
    control
  } = methods;
  const { mutateAsync: createShift, isPending: isCreatePending } =
    useCreateShift();

  const saveForm = async (data: Omit<NewShiftSchemaType, 'synced'>) => {
    try {
      let synced = 0;
      let id = null;
      if (navigator.onLine) {
        try {
          const response = await createShift(data);

          // Check if the response indicates success
          // Backend typically returns { success: boolean, data: {...}, message: string }
          if (response && response.success !== false) {
            const responseData = response.data;
            if (responseData) {
              id = responseData.id;
            }
            synced = 1; // Mark as synced only if API call succeeds
          } else {
            synced = 0;
          }
        } catch (apiError) {
          logger.error("Error in createShift");
          synced = 0; // API failed, mark as not synced
        }
      }
      // Save to IndexedDB after API response (or if offline)
      await saveFormOffline({
        ...data,
        ...(id && { id }),
        synced,
      });

      logger.info(`Form saved to IndexedDB with synced.`);
    } catch (error) {
      logger.error('Error in saveForm');
    }
  }

  const handleFormSubmit: SubmitHandler<NewShiftFormSchemaType> = async (
    formData
  ) => {

    const data: Omit<NewShiftSchemaType, 'synced'> = {
      ...formData,
      endedAt: moment(formData.endedAt).toISOString(),
      startedAt: moment(formData.startedAt).toISOString(),
      orgName: 'organization1',
      serviceType: formData.serviceType?.value || null,
    }

    await saveForm(data);
    Navigate(ROUTES.HOME_VISIT.path);
  };
  return (
    <>
      <div className="max-w-438px w-full m-auto">
        <div className=" flex flex-col gap-30px items-center  m-5">
          <div className="flex flex-col gap-2.5 w-full items-center ">
            <h4 className="text-2xl font-bold text-blackdark">NEW SHIFT</h4>
          </div>
          <div className="flex flex-col gap-5 border border-primarylight p-2 rounded-lg">
            <div className="grid grid-cols-2 gap-5">
              <TimeSelect
                control={control}
                name="startedAt"
                error={errors?.startedAt?.message}
                key="startedAt"
                // id="start_time"
                label="Start Time"
                // timezone={timezone}
                placeholder="Select Start Time"
                portalId="end-session"
                // isDisabled={isFormDisabled}
                isClearable
              />
              <TimeSelect
                control={control}
                name="endedAt"
                error={errors?.endedAt?.message}
                key="endedAt"
                // id="end_time"
                label="End Time"
                // timezone={timezone}
                placeholder="Select End Time"
                portalId="end-session"
                // isDisabled={isFormDisabled}
                isClearable
              />
            </div>

            <Select
              label="Select Type"
              labelClassName="block text-Primary-900"
              parentClassName=" w-full sm:w-2/4"
              className="w-full"
              isClearable={true}
              value={(() => {
                const serviceType = getValues('serviceType') as OptionTypeGlobal | null | undefined;
                return serviceType
                  ? ({
                    value: serviceType.value,
                    label: serviceType.label
                  } as OptionTypeGlobal)
                  : null;
              })()}
              placeholder="Select Type"
              onChange={(data) => {
                setValue('serviceType', data as OptionTypeGlobal, {
                  shouldValidate: true
                });
              }}
              name="serviceType"
              options={typeOptions}
              StylesConfig={{
                control: () => ({
                  width: '100%',
                  background: 'var(--Gray-400) !important',
                  borderColor: 'var(--Gray-300) !important',
                  border: '1px solid var(--Gray-300) !important',
                  minHeight: '42px'
                }),
                valueContainer: () => ({
                  padding: '2px 8px'
                }),
                placeholder: () => ({
                  color: 'var(--Gray-600)'
                }),
                singleValue: () => ({
                  color: 'var(--Primary-900)'
                }),
                dropdownIndicator: () => ({
                  color: 'var(--Gray-600)',
                  '&:hover': {
                    color: 'var(--Gray-600)'
                  }
                })
              }}
              error={errors?.serviceType?.message}
              errorClass=""
            />
            <TextArea
              label="Notes"
              placeholder="Optional visit notes"
              name="notes"
              error={errors?.notes?.message}
              //   isDisabled={isFormDisabled}
              value={getValues('notes') || ''}
              onChange={(e) =>
                setValue('notes', e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true
                })
              }
            />
          </div>
          {/* <div className="flex flex-col gap-5 border border-primarylight p-2 rounded-lg w-full">
            <FileUpload
              label="Upload Photo"
              name="image"
              isMulti={false}
              //   isEdit={isEdit}
              allowedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
              value={[
                {
                  file_path: getValues('image') as string | File,
                  file_name: getValues('start_time') as string
                }
              ]}
              error={errors.image?.message}
              onChange={(selectedFile) => {
                if (selectedFile?.length) {
                  clearErrors?.('image');
                }
                setValue(
                  'image',
                  selectedFile?.[0]?.file_path as string | File
                );
              }}
              onError={(error: string) => {
                setError('image', {
                  type: 'custom',
                  message: error
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-5 border border-primarylight p-2 rounded-lg w-full">
            <div className="flex flex-col gap-2.5 w-full items-start ">
              <h4 className="text-2xl font-bold text-blackdark">Check List</h4>
            </div>
            <CheckboxField
              id={'client_present'}
              isChecked={watch('client_present')}
              onChange={(e) => setValue('client_present', e.target.checked)}
              label="Client Present"
              labelClass="!text-base !leading-5"
            />
            <CheckboxField
              id={'medication_reviewed'}
              isChecked={watch('medication_reviewed')}
              onChange={(e) =>
                setValue('medication_reviewed', e.target.checked)
              }
              label="Medication Reviewed"
              labelClass="!text-base !leading-5"
            />
            <CheckboxField
              id={'follow_up'}
              isChecked={watch('follow_up')}
              onChange={(e) => setValue('follow_up', e.target.checked)}
              label="Follow Up Required"
              labelClass="!text-base !leading-5"
            />
            <CheckboxField
              id={'safety_check'}
              isChecked={watch('safety_check')}
              onChange={(e) => setValue('safety_check', e.target.checked)}
              label="Safety Check Complete"
              labelClass="!text-base !leading-5"
            />
          </div>
          <div className="flex flex-col gap-5 border border-primarylight p-2 rounded-lg w-full">
            <div className="flex flex-col gap-2.5 w-full items-start ">
              <h4 className="text-2xl font-bold text-blackdark">ATTESTATION</h4>
            </div>
            <CheckboxField
              id={'attestation'}
              isChecked={watch('attestation')}
              onChange={(e) => setValue('attestation', e.target.checked)}
              label="I certify the information is accurate to the best of knowledge."
              labelClass="!text-base !leading-5"
            />
            <InputField
              name="name"
              register={register}
              type="text"
              label="Your Name (type to sign)"
              placeholder="Type full legal name"
              //   icon="email"
              //   iconFirst
              inputClass="!border-primarylight"
              error={errors.name?.message}
            />
            <FileUpload
              label=""
              name="attestation_image"
              isMulti={false}
              //   isEdit={isEdit}
              allowedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
              value={[
                {
                  file_path: getValues('attestation_image') as string | File,
                  file_name: getValues('start_time') as string
                }
              ]}
              error={errors.attestation_image?.message}
              onChange={(selectedFile) => {
                if (selectedFile?.length) {
                  clearErrors?.('attestation_image');
                }
                setValue(
                  'attestation_image',
                  selectedFile?.[0]?.file_path as string | File
                );
              }}
              onError={(error: string) => {
                setError('attestation_image', {
                  type: 'custom',
                  message: error
                });
              }}
            />
          </div> */}
          <div className="w-full flex flex-col gap-5 border border-primarylight p-2 rounded-lg">
            <InputField
              name="patientName"
              register={register}
              type="text"
              label="Patient ID / Name"
              placeholder="e.g., P-1024 Johnson, Mary"
              //   icon="email"
              //   iconFirst
              inputClass=" !border-primarylight"
              error={errors.patientName?.message}
            />
            <InputField
              name="address"
              register={register}
              type="text"
              label="Address"
              placeholder="123 Oak St ,Springfield"
              //   icon="email"
              //   iconFirst
              inputClass="!border-primarylight"
              error={errors.address?.message}
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* <Button
              type="submit"
              variant="outline"
              // isLoading={isLoading}
              title="Save Draft"
              className="w-full rounded-10px ! !font-bold !leading-5"
              // isDisabled={isLoading}
              // onClick={handleSubmit(handleFormSubmit)}
            /> */}
            <Button
              type="submit"
              variant="filled"
              isLoading={isCreatePending}
              title={isCreatePending ? 'Submitting...' : 'Submit'}
              className="w-sm rounded-10px ! !font-bold !leading-5"
              isDisabled={isCreatePending}
              onClick={handleSubmit(handleFormSubmit)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Shift;
