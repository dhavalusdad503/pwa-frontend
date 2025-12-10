import { useState } from 'react';

import { getCaregiverList, getPatientList } from '@api/supervisor';
import { DATE_FORMATS } from '@helper/dateUtils';
import Button from '@lib/Common/Button';
import CustomDatePicker from '@lib/Common/CustomDatePicker';
import { CustomAsyncSelect } from '@lib/Common/Select';
import moment from 'moment';

import { FilterStateType } from '../Dashboard/hooks';

type SelectedFilterStateType = {
  caregiver?: { label: string; value: string } | null;
  patient?: { label: string; value: string } | null;
  startDate?: string | null;
  endDate?: string | null;
};

interface VisitsFilterProps {
  setActiveFilter: React.Dispatch<React.SetStateAction<FilterStateType>>;
}

const VisitsFilter: React.FC<VisitsFilterProps> = ({ setActiveFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilterStateType>(
    {
      caregiver: null,
      patient: null,
      startDate: null,
      endDate: null
    }
  );

  const applyFilter = () => {
    setActiveFilter({
      ...(selectedFilter?.caregiver
        ? { caregiverId: selectedFilter.caregiver?.value }
        : {}),
      ...(selectedFilter?.patient
        ? { patientId: selectedFilter.patient?.value }
        : {}),
      ...(selectedFilter?.startDate
        ? { startDate: selectedFilter.startDate }
        : {}),
      ...(selectedFilter?.endDate ? { endDate: selectedFilter.endDate } : {})
    });
  };
  const clearFilter = () => {
    setActiveFilter({});
    setSelectedFilter({
      caregiver: null,
      patient: null,
      startDate: null,
      endDate: null
    });
  };

  return (
    <div className="p-5 border border-gray-300 rounded-xl bg-white shadow-sm">
      <h4 className="text-lg sm:text-xl font-semibold text-blackdark mb-5">
        Filter Visits
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-center">
        {/* Caregiver Select */}
        <CustomAsyncSelect
          label="Caregiver"
          labelClassName="!text-base !leading-6"
          isClearable={true}
          loadOptions={(page, searchTerm) =>
            getCaregiverList({
              page,
              search: searchTerm,
              limit: 20,
              sortColumn: 'firstName',
              sortOrder: 'asc'
            })
          }
          queryKey={['getCaregiverList']}
          pageSize={20}
          isMulti={false}
          onChange={(selectedOptions) => {
            setSelectedFilter((prev) => ({
              ...prev,
              caregiver: selectedOptions
            }));
          }}
          value={selectedFilter.caregiver || null}
          placeholder="Select Caregiver"
        />

        {/* Patient Select */}
        <CustomAsyncSelect
          label="Patient"
          labelClassName="!text-base !leading-6"
          isClearable={true}
          loadOptions={(page, searchTerm) =>
            getPatientList({
              page,
              search: searchTerm,
              limit: 10,
              sortColumn: 'name',
              sortOrder: 'asc'
            })
          }
          queryKey={['getPatientList']}
          pageSize={20}
          isMulti={false}
          onChange={(selectedOptions) => {
            setSelectedFilter((prev) => ({
              ...prev,
              patient: selectedOptions
            }));
          }}
          value={selectedFilter.patient || null}
          placeholder="Select Patient"
        />

        {/* Date Range */}
        <div className="flex flex-col gap-2">
          <label className="text-blackdark text-sm font-normal block leading-5">
            Date Range
          </label>
          <CustomDatePicker
            onChange={(update: [Date | null, Date | null]) => {
              const [start, end] = update;
              setSelectedFilter((prev) => ({
                ...prev,
                startDate: start
                  ? moment(start).format(DATE_FORMATS.ISO_DATE)
                  : null,
                endDate: end ? moment(end).format(DATE_FORMATS.ISO_DATE) : null
              }));
            }}
            isClearable
            parentClassName="!z-0"
            className="sm:text-base text-sm"
            selectsRange
            startDate={
              selectedFilter.startDate
                ? new Date(selectedFilter.startDate)
                : null
            }
            endDate={
              selectedFilter.endDate ? new Date(selectedFilter.endDate) : null
            }
            placeholderText="Select Date Range"
            maxDate={new Date()}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <Button
          variant="outline"
          type="button"
          title="Clear Filter"
          parentClassName="sm:w-auto w-full"
          className="rounded-10px font-bold sm:w-auto w-full"
          onClick={clearFilter}
        />
        <Button
          variant="filled"
          type="button"
          title="Apply Filter"
          parentClassName="sm:w-auto w-full"
          className="rounded-10px font-bold sm:w-auto w-full"
          onClick={applyFilter}
        />
      </div>
    </div>
  );
};

export default VisitsFilter;
