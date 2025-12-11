import { useState } from 'react';

import { useCreateShift } from '@api/newShift';
import { ROUTES } from '@constant/routesPath';
import { formDataToDBObject } from '@helper/index';
import { yupResolver } from '@hookform/resolvers/yup';
import Breadcrumb from '@lib/Common/BreadCrumb';
import Button from '@lib/Common/Button';
import CheckboxField from '@lib/Common/CheckBox';
import FileUpload from '@lib/Common/FileUpload';
import InputField from '@lib/Common/Input';
import Select from '@lib/Common/Select';
import TextArea from '@lib/Common/Textarea';
import TimeSelect from '@lib/Common/TimeSelect';
import { NewShiftFormSchemaType, newShiftSchema } from '@schema/shiftSchema';
import clsx from 'clsx';
import moment from 'moment';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { saveFormOffline } from '@/db';
import type { NewShiftSchemaType, OptionTypeGlobal } from '@/types';

const defaultValues = {
  startedAt: '',
  endedAt: '',
  serviceType: undefined,
  notes: '', // Default value provided
  patientName: '', // Default value provided
  address: '', // Default value provided
  submittedAt: moment().toISOString()
  // attestation: false,
  // attestationName: '',
  // followUp: false,
  // clientPresent: false,
  // latitude: '',
  // longitude: '',
  // medicationReviewed: false,
  // safetyCheck: false,
};
interface AddressType {
  latitude: number;
  longitude: number;
  accuracy: number;
}
const typeOptions: OptionTypeGlobal[] = [
  { label: 'Morning Shift', value: 'morning' },
  { label: 'Afternoon Shift', value: 'afternoon' },
  { label: 'Night Shift', value: 'night' },
  { label: 'Full Day', value: 'full_day' },
  { label: 'Half Day', value: 'half_day' }
];
const Shift = () => {
  const Navigate = useNavigate();
  const [coordinates, setCoordinates] = useState<AddressType | null>();

  const methods = useForm<NewShiftSchemaType>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues,
    resolver: yupResolver(newShiftSchema)
  });
  const { mutateAsync: createShift, isPending: isCreatePending } =
    useCreateShift();
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    getValues,
    watch,
    setError,
    clearErrors,
    control
  } = methods;
  const saveForm = async (formData: FormData) => {
    try {
      const dataObj = await formDataToDBObject<NewShiftSchemaType>(formData);
      let synced = 0;
      let id: string | null = null;
      if (navigator.onLine) {
        try {
          const response = await createShift(formData); // API expects FormData

          if (response && response.success !== false) {
            const responseData = response.data;
            if (responseData?.id) id = responseData.id;
            synced = 1;
          } else synced = 0;
        } catch (err) {
          console.error('Error in createShift', err);
          synced = 0;
        }
      }

      // Save to IndexedDB (plain object, not FormData)
      await saveFormOffline({
        ...dataObj,
        ...(id && { id }),
        synced
      });

      console.log('Form saved to IndexedDB.');
    } catch (err) {
      console.error('Error in saveForm', err);
    }
  };

  const handleFormSubmit: SubmitHandler<NewShiftFormSchemaType> = async (
    data
  ) => {
    const formData = new FormData();
    if (getValues('image') && data?.image) {
      formData.append('image', data?.image);
    }
    const fields: (keyof NewShiftFormSchemaType)[] = [
      'startedAt',
      'endedAt',
      'address',
      'attestation',
      'attestationName',
      'followUp',
      'clientPresent',
      'latitude',
      'longitude',
      'patientName',
      'medicationReviewed',
      'notes',
      'safetyCheck',
      'serviceType',
      'submittedAt'
    ];
    fields.forEach((field) => {
      const value = data[field];
      if (value !== undefined && value !== null) {
        formData.append(field, String(value));
      }
    });
    formData.append('orgName', 'organization1');
    if (data?.serviceType?.value) {
      formData.set('serviceType', data?.serviceType?.value);
    }
    if (data?.submittedAt) {
      formData.set('submittedAt', moment().toISOString());
    }
    // const SubmitData: Omit<NewShiftSchemaType, 'synced'> = {
    //   ...formData,
    //   // endedAt: moment(formData.endedAt).toISOString(),
    //   // startedAt: moment(formData.startedAt).toISOString(),
    //   orgName: 'organization1',
    //   serviceType: data?.serviceType?.value || null,
    // }

    await saveForm(formData);
    Navigate(ROUTES.HOME_VISIT.path);
  };
  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };
  const handleLocation = async () => {
    try {
      const position: GeolocationPosition = await getLocation(); // <-- NOW you can await!
      const { latitude, longitude, accuracy } = position.coords;

      // update state
      setCoordinates({ latitude, longitude, accuracy });

      // update form (or anything)
      setValue('latitude', latitude);
      setValue('longitude', longitude);
    } catch (err) {
      console.error('Location error:', err);
    }
  };

  const handleFormError = (errors: any) => {
    console.error('❌ FORM VALIDATION FAILED:', errors);
    console.log('Current form values:', getValues());
  };
  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          { label: 'Caregiver', path: ROUTES.CAREGIVER_DASHBOARD.path },
          {
            label: 'New Visit',
            isActive: true
          }
        ]}
      />
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
                const serviceType = getValues('serviceType') as
                  | OptionTypeGlobal
                  | null
                  | undefined;
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
              error={
                errors?.serviceType?.message ||
                errors?.serviceType?.value?.message
              }
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
          <div className="flex flex-col gap-5 border border-primarylight p-2 rounded-lg w-full">
            <FileUpload
              label="Upload Photo"
              NumberOfFileAllowed={1}
              multiple={false}
              accept="image/*"
              className="w-full col-span-2 bg-Graylight"
              handelSubmit={(files) => {
                const selectedFile = files[0].file;

                if (!selectedFile) return;
                const sizeMB =
                  selectedFile &&
                  (selectedFile.size / (1024 * 1024)).toFixed(2);
                const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];

                if (Number(sizeMB) >= 2) {
                  setError('image', {
                    message: 'File size should be less than 2MB'
                  });
                  return;
                }
                if (!allowedTypes.includes(selectedFile.type)) {
                  setError('image', {
                    message:
                      'Unsupported file format. Only jpg, jpeg, png allowed'
                  });
                  return;
                }
                clearErrors('image');

                setValue('image', selectedFile, { shouldDirty: true });
              }}
              onFileRemove={() => clearErrors('image')}
              autoUpload={true}
              // disabled={readOnly}
              canRemoveExisting={true}
            />
          </div>
          <div className="flex flex-col gap-5 border border-primarylight p-2 rounded-lg w-full">
            <div className="flex flex-col gap-2.5 w-full items-start ">
              <h4 className="text-2xl font-bold text-blackdark">Check List</h4>
            </div>
            <CheckboxField
              id={'clientPresent'}
              isChecked={watch('clientPresent')}
              onChange={(e) => setValue('clientPresent', e.target.checked)}
              label="Client Present"
              labelClass="!text-base !leading-5"
            />
            <CheckboxField
              id={'medicationReviewed'}
              isChecked={watch('medicationReviewed')}
              onChange={(e) => setValue('medicationReviewed', e.target.checked)}
              label="Medication Reviewed"
              labelClass="!text-base !leading-5"
            />
            <CheckboxField
              id={'followUp'}
              isChecked={watch('followUp')}
              onChange={(e) => setValue('followUp', e.target.checked)}
              label="Follow Up Required"
              labelClass="!text-base !leading-5"
            />
            <CheckboxField
              id={'safetyCheck'}
              isChecked={watch('safetyCheck')}
              onChange={(e) => setValue('safetyCheck', e.target.checked)}
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
              error={errors?.attestation?.message}
            />
            <InputField
              name="attestationName"
              register={register}
              type="text"
              label="Your Name (type to sign)"
              placeholder="Type full legal name"
              //   icon="email"
              //   iconFirst
              inputClass="!border-primarylight"
              error={errors.attestationName?.message}
            />
          </div>
          <div className="w-full flex flex-col gap-5 border border-primarylight p-2 rounded-lg">
            <InputField
              name="patientName"
              register={register}
              type="text"
              label="Patient ID / Name"
              placeholder="e.g., P-1024 Johnson, Mary"
              inputClass=" !border-primarylight"
              error={errors.patientName?.message}
            />
            <InputField
              name="address"
              register={register}
              type="text"
              label="Address"
              placeholder="123 Oak St ,Springfield"
              inputClass="!border-primarylight"
              error={errors.address?.message}
            />
            <div className="flex flex-row items-center  gap-2 m-0">
              <div>
                <Button
                  type="submit"
                  variant="filled"
                  // isLoading={isLoading}
                  // title={isCreatePending ? 'Submitting...' : 'Submit'}
                  title={'Use Current GPS'}
                  className="w-xxs rounded-10px ! !font-bold !leading-5"
                  isDisabled={!!coordinates}
                  onClick={handleLocation}
                />
                {(errors.latitude?.message || errors?.longitude?.message) && (
                  <p className={clsx('text-xs text-red mt-1.5')}>
                    {`${errors.latitude?.message} &
                    ${errors?.longitude?.message}`}
                  </p>
                )}
              </div>

              <div>
                <p className="text-blackdark text-sm font-normal  block leading-5">
                  Accuracy: ~25m{' '}
                </p>
                {coordinates && (
                  <>
                    <p>Lat: {coordinates.latitude} </p>
                    <p>Long: {coordinates.longitude}</p>
                  </>
                )}
              </div>
            </div>
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
              onClick={handleSubmit(handleFormSubmit, handleFormError)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Shift;
