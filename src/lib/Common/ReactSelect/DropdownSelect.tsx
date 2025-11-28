import { useEffect, useRef, useState } from 'react';

import { GroupBase } from 'react-select';

import Icon from '../Icon';

import CustomAsyncSelect from './AsyncSelect';

import AdvancedSelect, { AsyncSelectProps } from '.';

export type ValueType =
  | {
      value?: string | boolean | number | null | undefined; // The actual value stored
      label?: string | React.ReactNode; // Display text/element
      isSelected?: boolean | undefined; // Selection state
      email?: string;
    }
  | ValueType[]
  | null
  | undefined;
export interface DropdownSelectProps<
  Option extends ValueType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  TQueryFnData = unknown
> extends Omit<
    AsyncSelectProps<Option, IsMulti, Group, TQueryFnData>,
    'getNextPageParam'
  > {
  selectedOption?: Option | null;
}

export const DropdownSelect = <
  Option extends ValueType | ValueType[],
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  TQueryFnData = unknown
>({
  parentClassName,
  label,
  placeholder = 'Select',
  isMulti = false as IsMulti,
  onChange,
  value,
  queryFn,
  queryKey,
  selectedOption,
  isClearable = false,
  select,
  ...props
}: DropdownSelectProps<Option, IsMulti, Group, TQueryFnData>) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className={`relative ${parentClassName}`} ref={dropdownRef}>
      {label && (
        <label className="text-base font-normal leading-6 text-Primary-900-opacity-80 mb-2.5 block">
          {label}
        </label>
      )}
      <div className="w-full relative mb-5">
        <AdvancedSelect<Option, IsMulti, Group>
          {...props}
          parentClassName="w-full"
          isMenuIsOpen={false}
          isMulti={isMulti}
          options={[]}
          onMenuOpen={toggleVisibility}
          placeholder={placeholder}
          className=""
          StylesConfig={{
            singleValue: (provided) => ({
              ...provided,
              color: '#000',
              padding: '6px 10px 6px 10px'
            }),
            multiValue: () => ({
              margin: '5px 2px 5px 2px',
              background: 'var(--Primary-300)',
              ':hover': {
                background: 'var(--Primary-300)'
              }
            }),
            multiValueLabel: () => ({
              color: '#fff'
            }),
            multiValueRemove: () => ({
              color: '#fff',
              background: 'var(--Primary-300)',
              ':hover': {
                background: 'var(--Primary-300)'
              }
            }),
            placeholder: () => ({
              padding: '6px 10px 6px 10px'
            }),
            input: () => ({
              padding: '6px 10px 6px 10px'
            }),
            valueContainer: () => ({
              paddingRight: '0'
            }),
            control: () => ({
              backgroundColor: '#F9F9F9 !important',
              borderColor: '#F2F2F2 !important'
            }),
            loadingMessage: () => ({
              display: 'none'
            }),
            menu: () => ({
              position: 'relative',
              background: 'transparent',
              boxShadow: 'none',
              borderRadius: '0'
            }),
            menuList: () => ({
              paddingRight: '15px',
              maxHeight: '250px'
            }),
            option: () => ({
              marginRight: '0px',
              width: '100%'
            })
          }}
          isSearchable={false}
          onChange={onChange}
          value={selectedOption || value}
          isClearable={isClearable}
        />
      </div>
      {isVisible && (
        <div className="bg-white shadow-dropdown_shadow py-4 pl-4 rounded-md absolute w-full top-full mt-5 z-10">
          <div className="relative">
            <Icon name="search" className="absolute left-3 z-10 top-3" />
            <CustomAsyncSelect<Option, IsMulti, Group, TQueryFnData>
              queryKey={[...queryKey]}
              queryFn={queryFn}
              isOnFocusApiCall={false}
              getNextPageParam={(lastPage, allPages) => {
                const nextOffset = allPages.length * 1;
                const { total = 10 } = lastPage as { total: number };
                return nextOffset * 25 < total ? nextOffset : undefined;
              }}
              isMenuIsOpen={true}
              isMulti={isMulti}
              className=""
              StylesConfig={{
                singleValue: (provided) => ({
                  ...provided,
                  color: '#000',
                  padding: '6px 10px 6px 30px',
                  display: 'none'
                }),
                placeholder: () => ({
                  padding: '6px 10px 6px 30px'
                }),
                input: () => ({
                  padding: '6px 10px 6px 30px'
                }),
                valueContainer: () => ({
                  paddingRight: '0'
                }),
                dropdownIndicator: () => ({
                  display: 'none'
                }),
                control: () => ({
                  backgroundColor: '#F9F9F9 !important',
                  borderColor: '#F2F2F2 !important',
                  marginRight: '22px'
                }),
                loadingIndicator: () => ({
                  display: 'none'
                }),
                loadingMessage: () => ({
                  display: 'none'
                }),
                menu: () => ({
                  position: 'relative',
                  background: 'transparent',
                  boxShadow: 'none',
                  borderRadius: '0'
                }),
                menuList: () => ({
                  paddingRight: '10px',
                  maxHeight: '233px'
                }),
                option: () => ({
                  marginRight: '0px',
                  width: '100%'
                }),
                multiValue: (base) => ({
                  ...base,
                  display: 'none'
                })
              }}
              placeholder="Search "
              isSearchable
              select={select}
              onChange={(...data) => {
                onChange?.(...data);
                setIsVisible(false);
              }}
              value={selectedOption || value}
              isInitialLoadApi={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
