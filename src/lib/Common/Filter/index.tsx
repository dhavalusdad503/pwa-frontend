import { useEffect, useMemo, useRef } from 'react';

import { FIELD_TYPE } from '@constant/index';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import {
  DefaultValues,
  FieldValues,
  Path,
  PathValue,
  useForm
} from 'react-hook-form';

import Button from '../Button';
import CustomDatePicker from '../CustomDatePicker';
import InputField from '../Input';
import Select, { CustomAsyncSelect } from '../Select';

import { OptionType } from './types';
import { getFilterValidationSchema } from './validation-schema';

export type CommonFilterField<T extends FieldValues> =
  | {
      type: typeof FIELD_TYPE.DATE_RANGE;
      name: Path<T>;
      label: string;
      maxDate?: Date;
    }
  | {
      type: typeof FIELD_TYPE.SELECT;
      name: Path<T>;
      label: string;
      options: OptionType[];
      isMulti?: boolean;
    }
  | {
      type: typeof FIELD_TYPE.TEXT;
      name: Path<T>;
      label: string;
      placeholder?: string;
    }
  | {
      type: typeof FIELD_TYPE.NUMBER;
      name: Path<T>;
      label: string;
      placeholder?: string;
    }
  | {
      type: typeof FIELD_TYPE.ASYNC_SELECT;
      name: Path<T>;
      label: string;
      queryKey: string;
      queryFn: () => Promise<{ data: OptionType[]; hasMore: boolean }>;
      isMulti?: boolean;
      showImage?: boolean;
    }
  | {
      type: typeof FIELD_TYPE.NUMBER_RANGE;
      name: Path<T>;
      label: string;
    };

interface CommonFilterProps<T extends FieldValues> {
  fields: CommonFilterField<T>[];
  isLoading?: boolean;
  onApply: (filters: T) => void;
  onClear?: () => void;
  defaultValues: DefaultValues<T>;
  onClose?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

const getLoadingMessages = (label: string) => {
  let plural: string;

  if (label.endsWith('y')) {
    plural = `${label.slice(0, -1)}ies`;
  } else {
    plural = `${label.endsWith('s') ? label : label}s`;
  }
  plural = plural.toLocaleLowerCase();

  return {
    loadingMessage: `Loading ${plural}...`,
    loadingMoreMessage: `Loading more ${plural}...`
  };
};

const CommonFilter = <T extends FieldValues>({
  fields,
  isLoading = false,
  onApply,
  onClear,
  defaultValues,
  onClose,
  buttonRef
}: CommonFilterProps<T>) => {
  // ** Validation Schema **
  const filterSchema = useMemo(() => {
    const schema = getFilterValidationSchema(fields);
    return schema;
  }, [fields]);

  const {
    setValue,
    getValues,
    reset,
    clearErrors,
    formState: { errors },
    handleSubmit
  } = useForm<T>({
    mode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(filterSchema)
  });
  const values = getValues();

  const ref = useRef<HTMLDivElement>(null);

  const handleApply = handleSubmit(() => {
    onApply(getValues());
  });

  const handleClear = () => {
    reset();
    onClear?.();
  };

  const setFormValue = (name: Path<T>, value: unknown) => {
    setValue(name, value as PathValue<T, typeof name>, {
      shouldDirty: true,
      shouldValidate: true
    });
    clearErrors(name);
  };

  useEffect(() => {
    const safeSelectors = [
      '.react-datepicker',
      '.css-tj5bde-Svg',
      '.css-15lsz6c-indicatorContainer',
      '.css-1xc3v61-indicatorContainer'
    ];

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (ref.current?.contains(target)) return;
      if (buttonRef?.current?.contains(target)) return;

      if (safeSelectors.some((sel) => target.closest(sel))) return;

      onClose?.();
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, buttonRef]);

  return (
    <div
      ref={ref}
      className="absolute md:right-0 left-0 md:left-auto z-10 mt-2 sm:min-w-438px min-w-260px bg-white rounded-lg sm:p-5 px-3 py-5 border border-solid border-surface shadow-dropdown">
      <div className="flex flex-col gap-5">
        {fields.map((field) => {
          switch (field.type) {
            case FIELD_TYPE.DATE_RANGE:
              return (
                <CustomDatePicker
                  key={field.name}
                  label={field.label}
                  onChange={(update: [Date | null, Date | null]) => {
                    const [start, end] = update;
                    setFormValue(field.name, {
                      startDate: start
                        ? moment(start).format('YYYY-MM-DD')
                        : null,
                      endDate: end ? moment(end).format('YYYY-MM-DD') : null
                    });
                  }}
                  isClearable
                  parentClassName="!z-0"
                  className="sm:text-base text-sm"
                  selectsRange
                  startDate={
                    values?.[field.name]?.startDate
                      ? new Date(values[field.name].startDate)
                      : null
                  }
                  endDate={
                    values?.[field.name]?.endDate
                      ? new Date(values[field.name].endDate)
                      : null
                  }
                  placeholderText="Select Date Range"
                  error={errors[field.name]?.message}
                  {...(field.maxDate && { maxDate: field.maxDate })}
                />
              );

            case FIELD_TYPE.SELECT:
              return (
                <Select
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  options={field.options}
                  isMulti={field.isMulti}
                  onChange={(selected) => {
                    setFormValue(field.name, selected);
                  }}
                  placeholder={`Select ${field.label}`}
                  labelClassName="!text-base"
                  className="sm:text-base text-sm"
                  StylesConfig={{
                    control: () => ({
                      minHeight: '46px'
                      // fontSize: '14px',
                    }),
                    option: () => ({
                      fontSize: '16px'
                    })
                  }}
                  isClearable
                  value={values[field.name]}
                />
              );

            case FIELD_TYPE.TEXT:
              return (
                <InputField
                  key={field.name}
                  type="text"
                  label={field.label}
                  placeholder={field.placeholder}
                  value={getValues(field.name) || ''}
                  onChange={(e) => setFormValue(field.name, e.target.value)}
                  inputClass="!sm:text-base !text-sm"
                />
              );

            case FIELD_TYPE.NUMBER:
              return (
                <InputField
                  key={field.name}
                  type="number"
                  label={field.label}
                  placeholder={field.placeholder}
                  value={getValues(field.name) || ''}
                  onChange={(e) => setFormValue(field.name, e.target.value)}
                  inputClass="!sm:text-base !text-sm"
                />
              );

            case FIELD_TYPE.ASYNC_SELECT: {
              const { loadingMessage, loadingMoreMessage } = getLoadingMessages(
                field.label
              );
              return (
                <CustomAsyncSelect
                  queryKey={field.queryKey}
                  label={field.label}
                  isClearable
                  labelClassName="!text-base"
                  loadOptions={field.queryFn}
                  onChange={(selected) => {
                    setFormValue(field.name, selected);
                  }}
                  loadingMessage={loadingMessage}
                  loadingMoreMessage={loadingMoreMessage}
                  className="sm:text-base text-sm"
                  placeholder={`Select ${field.label}`}
                  StylesConfig={{
                    control: () => ({
                      minHeight: '46px'
                    }),
                    option: () => ({
                      fontSize: '16px'
                    })
                  }}
                  isMulti={field.isMulti}
                  name={field.name}
                  value={values[field.name]}
                  key={field.name}
                />
              );
            }

            case FIELD_TYPE.NUMBER_RANGE:
              return (
                <div key={field.name} className="flex flex-col gap-2">
                  <span className="text-blackdark text-base font-normal mb-1.5 block leading-22px">
                    {field.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <InputField
                      key={`${field.name}_min`}
                      type="number"
                      placeholder="Enter Min"
                      value={values[field.name]?.min ?? ''}
                      onChange={(e) => {
                        const minVal =
                          e.target.value === '' ? null : Number(e.target.value);
                        setFormValue(field.name, {
                          ...values[field.name],
                          min: minVal
                        });
                      }}
                      inputClass="sm:!text-base sm:!leading-5 !text-sm !py-3"
                    />
                    <span className="text-blackdark text-base font-normal mb-1.5 block leading-22px">
                      to
                    </span>
                    <InputField
                      key={`${field.name}_max`}
                      type="number"
                      placeholder="Enter Max"
                      value={values[field.name]?.max ?? ''}
                      onChange={(e) => {
                        const maxVal =
                          e.target.value === '' ? null : Number(e.target.value);
                        setFormValue(field.name, {
                          ...values[field.name],
                          max: maxVal
                        });
                      }}
                      inputClass="sm:!text-base sm:!leading-5 !text-sm !py-3"
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name]?.message}
                  </p>
                </div>
              );

            default:
              return null;
          }
        })}

        {/* Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-4">
          <Button
            variant="outline"
            title="Clear Filters"
            parentClassName="sm:w-2/4"
            className="px-6 sm:py-3.5 rounded-10px w-full"
            onClick={handleClear}
            type="button"
          />
          <Button
            variant="filled"
            title="Apply Filter"
            parentClassName="sm:w-2/4"
            className="px-6 sm:py-3.5 rounded-10px w-full"
            onClick={handleApply}
            type="button"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CommonFilter;
