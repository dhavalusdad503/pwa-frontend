import { DateRangeFilterObjType, OptionType } from '@lib/Common/Filter/types';

export type FilterDataType = {
  caregiver?: OptionType;
  patient?: OptionType;
  dateRange?: DateRangeFilterObjType;
};
