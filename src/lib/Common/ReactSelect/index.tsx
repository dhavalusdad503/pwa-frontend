import React, { forwardRef, JSX } from 'react';

import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';
import ReactSelect, {
  GroupBase,
  SelectInstance,
  StylesConfig
} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import SectionLoader from '../Loader/Spinner';
// import SectionLoader from '../Loader/Spinner';

/**
 * Base type for select options. This is the minimum structure required for any option
 * in the select component.
 * @property label - Optional display text for the option
 * @property value - Unique identifier for the option
 */
export type OptionTypeGlobal = { label?: string; value: string };

/**
 * Type for grouping options in the select component.
 * Extends react-select's GroupBase with our OptionTypeGlobal.
 * Used when options need to be organized into categories/groups.
 */
export type SelectGroup = GroupBase<OptionTypeGlobal>;

/**
 * Type alias for react-select's StylesConfig.
 * Used for maintaining consistent styling across different instances of the select component.
 * @template OptionType - The type of data each option contains
 */
export type DefaultStylesConfig<OptionType> = StylesConfig<
  OptionType,
  boolean,
  GroupBase<OptionType>
>;

/**
 * Props interface for the AdvancedSelect component.
 * Extends react-select's base props to add custom functionality.
 *
 * @template Option - Type of the option data
 * @template IsMulti - Boolean type parameter for multi-select functionality
 * @template Group - Type for option grouping, extends GroupBase
 *
 * @extends React.ComponentProps<typeof ReactSelect> - Inherits all react-select props
 */
export interface SelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> extends React.ComponentProps<typeof ReactSelect<Option, IsMulti, Group>> {
  /** Label text to display above the select. Used for form accessibility */
  label?: string;

  /** Class name for the parent container. Allows custom styling of the wrapper */
  parentClassName?: string;

  /** Class name for the label element. Allows custom styling of the label */
  labelClassName?: string;

  /** Error message to display. Used for form validation feedback */
  error?: string;

  /** Indicates if the field is required. Adds visual indicator (*) next to label */
  isRequired?: boolean;

  /**
   * When true, uses CreatableSelect instead of regular ReactSelect.
   * Allows users to create new options if they don't exist
   */
  isCreatable?: boolean;

  /**
   * Controls the open/closed state of the dropdown menu.
   * Useful for programmatically controlling the menu state
   */
  isMenuIsOpen?: boolean;

  /**
   * Custom styles configuration that extends react-select's StylesConfig.
   * Allows complete customization of component appearance
   */
  StylesConfig?: StylesConfig<Option, IsMulti, Group>;

  /**
   * React Hook Form register object.
   * Enables integration with React Hook Form for form handling
   */
  register?: UseFormRegisterReturn;

  /** Class name for error message styling */
  errorClass?: string;

  /**
   * ID of the DOM element where the dropdown menu should be rendered.
   * Used for controlling menu positioning and z-index stacking
   */
  portalRootId?: string | true;
}

/**
 * Advanced select component that enhances react-select with additional features.
 * Uses forwardRef to allow parent components to access the internal select instance.
 *
 * @template Option - Type of the option data
 * @template IsMulti - Boolean type parameter for multi-select functionality
 * @template Group - Type for option grouping
 *
 * Key Features:
 * - Customizable styling with theme support
 * - Form validation and error handling
 * - Optional creation of new options (CreatableSelect)
 * - Accessible label and required field support
 * - Portal support for better dropdown positioning
 * - Loading states for async operations
 * - React Hook Form integration
 * - TypeScript support with generic types
 *
 * Implementation Notes:
 * - Uses forwardRef to maintain ref forwarding compatibility
 * - Implements controlled component pattern with value/onChange
 * - Supports both single and multi-select modes
 * - Handles disabled states and loading indicators
 * - Manages custom styling through StylesConfig prop
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AdvancedSelect
 *   label="Select User"
 *   options={[
 *     { value: '1', label: 'John Doe' },
 *     { value: '2', label: 'Jane Smith' }
 *   ]}
 *   onChange={handleChange}
 *   isRequired
 * />
 *
 * // With custom styling
 * <AdvancedSelect
 *   label="Select Category"
 *   options={categories}
 *   StylesConfig={{
 *     control: (base) => ({
 *       ...base,
 *       borderColor: 'blue'
 *     })
 *   }}
 *   isCreatable
 * />
 *
 * // With React Hook Form
 * <AdvancedSelect
 *   {...register('category')}
 *   label="Category"
 *   options={categories}
 *   error={errors.category?.message}
 * />
 * ```
 */
export const AdvancedSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    {
      label = '',
      placeholder,
      parentClassName = '',
      labelClassName = '',
      error = '',
      components,
      isRequired = false,
      options = [],
      className,
      onChange,
      onMenuOpen,
      name = '',
      value,
      isCreatable = false,
      isDisabled = false,
      isClearable = false,
      isSearchable = true,
      isMenuIsOpen,
      StylesConfig: stylesConfigProp,
      register,
      onMenuScrollToBottom,
      onMenuClose,
      onInputChange,
      isLoading,
      errorClass,
      filterOption,
      portalRootId,
      getOptionLabel,
      formatOptionLabel,
      menuPlacement,
      ...otherProps
    }: SelectProps<Option, IsMulti, Group>,
    ref: React.LegacyRef<SelectInstance<Option, IsMulti, Group>>
  ) => {
    const customStyles: StylesConfig<Option, IsMulti, Group> = {
      singleValue: (base, state) => ({
        ...base,
        color: '#fff',
        width: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...(stylesConfigProp?.singleValue
          ? stylesConfigProp.singleValue(base, state)
          : {})
      }),
      control: (base, state) => ({
        ...base,
        background: '#F9F9F91A',
        border: '1px solid #EAECF01A',
        borderRadius: '6px',
        '&:hover': { borderColor: '#EAECF01A' },
        outline: state.isFocused
          ? '2px solid var(--Primary-400)'
          : error
            ? '1px solid red'
            : '2px solid transparent',
        boxShadow: 'none !important',
        ...(isDisabled
          ? { opacity: '0.5', cursor: 'not-allowed', pointerEvents: 'auto' }
          : {}),
        ...(stylesConfigProp?.control
          ? stylesConfigProp.control(base, state)
          : {})
      }),
      placeholder: (base, state) => ({
        ...base,
        ...(stylesConfigProp?.placeholder
          ? stylesConfigProp.placeholder(base, state)
          : {})
      }),
      valueContainer: (base, state) => ({
        ...base,
        ...(stylesConfigProp?.valueContainer
          ? stylesConfigProp.valueContainer(base, state)
          : {})
      }),
      input: (base, state) => ({
        ...base,
        color: 'var(--Primary-900)', // Text color of the search input
        ...(stylesConfigProp?.input ? stylesConfigProp.input(base, state) : {})
      }),
      indicatorSeparator: (base) => ({ ...base, display: 'none' }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: 'var(--Primary-900)',
        '&:hover': { color: 'var(--Primary-900)' },
        transform: state.selectProps.menuIsOpen
          ? 'rotate(180deg)'
          : 'rotate(0deg)',
        transition: 'transform 0.3s ease-in-out',
        ...(stylesConfigProp?.dropdownIndicator
          ? stylesConfigProp.dropdownIndicator(base, state)
          : {})
      }),
      menu: (base, state) => ({
        ...base,
        padding: '0px',
        overflow: 'hidden',
        ...(stylesConfigProp?.menu ? stylesConfigProp.menu(base, state) : {})
      }),
      menuList: (base, state) => ({
        ...base,
        padding: '0px',
        ...(stylesConfigProp?.menuList
          ? stylesConfigProp.menuList(base, state)
          : {})
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? 'var(--Primary-300)'
          : state.isFocused
            ? 'var(--Primary-300-opacity-30)'
            : '',
        color: state.isSelected ? '#fff' : '#000',
        '&:hover': {
          backgroundColor: state.isSelected
            ? 'var(--Primary-300)'
            : 'var(--Primary-300-opacity-30)', // Prevent hover effect on selected option
          color: state.isSelected ? '#fff' : '#000'
        },
        ...(stylesConfigProp?.option
          ? stylesConfigProp.option(base, state)
          : {})
      }),
      noOptionsMessage: (base) => ({
        ...base
      }),
      multiValue: (base, state) => ({
        ...base,
        ...(stylesConfigProp?.multiValue
          ? stylesConfigProp.multiValue(base, state)
          : {})
      }),
      multiValueLabel: (base, state) => ({
        ...base,
        ...(stylesConfigProp?.multiValueLabel
          ? stylesConfigProp.multiValueLabel(base, state)
          : {})
      }),
      multiValueRemove: (base, state) => ({
        ...base,
        ...(stylesConfigProp?.multiValueRemove
          ? stylesConfigProp.multiValueRemove(base, state)
          : {})
      }),
      loadingIndicator: (base, state) => ({
        ...base,
        ...(stylesConfigProp?.loadingIndicator
          ? stylesConfigProp.loadingIndicator(base, state)
          : {})
      })
    };

    // useEffect(() => {
    //   if (value && !Array.isArray(value) && value.value) {
    //     const tempValue = options?.filter(
    //       (op: { value: string }) => op.value === value.value
    //     );
    //     setSelectedValue?.(tempValue[0]);
    //   } else {
    //     setSelectedValue?.(null);
    //   }
    // }, [value, options]);

    const getPortalTarget = () =>
      typeof portalRootId === 'string'
        ? document.getElementById(portalRootId) || undefined
        : typeof portalRootId === 'boolean'
          ? document.body
          : undefined;

    return (
      <div className={`relative flex flex-col gap-2.5 ${parentClassName}`}>
        {label && (
          <label
            className={`flex items-center gap-1 text-base font-normal leading-18px ${labelClassName}`}>
            {label}
            {isRequired && <span className="text-red-500 font-medium">*</span>}
          </label>
        )}
        <div className={clsx(error && 'border-red', 'w-full')}>
          <input
            type="text"
            name={name}
            className="w-0 h-0 invisible absolute -z-1"
          />
          {!isCreatable ? (
            <ReactSelect
              getOptionLabel={getOptionLabel}
              formatOptionLabel={formatOptionLabel}
              placeholder={placeholder}
              isLoading={isLoading}
              loadingMessage={() => (
                <SectionLoader
                  className="relative h-6"
                  size="h-5 w-5 !border-[3px]"
                />
              )}
              styles={customStyles}
              options={options}
              // isMulti={isMulti}
              {...register}
              name={name}
              filterOption={filterOption}
              menuPlacement={menuPlacement || 'auto'}
              onMenuClose={onMenuClose}
              onMenuOpen={onMenuOpen}
              onMenuScrollToBottom={onMenuScrollToBottom}
              onInputChange={onInputChange}
              ref={ref}
              components={components}
              onChange={onChange}
              // value={selectedValue || value}
              value={value}
              isDisabled={isDisabled}
              isClearable={isClearable}
              isSearchable={isSearchable}
              menuIsOpen={isMenuIsOpen}
              className={className}
              menuPortalTarget={getPortalTarget()}
              {...otherProps}
            />
          ) : (
            <CreatableSelect
              placeholder={placeholder}
              styles={customStyles}
              options={options}
              // isMulti={isMulti}
              onMenuOpen={onMenuOpen}
              {...register}
              components={components}
              ref={ref}
              onChange={onChange}
              value={value}
              // value={selectedValue || value}
              className={className}
              isDisabled={isDisabled}
              isClearable={isClearable}
              menuIsOpen={isMenuIsOpen}
              menuPortalTarget={getPortalTarget()}
              {...otherProps}
            />
          )}
          {error && (
            <p className={`text-red-500 text-xs mt-1.5 ${errorClass}`}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
) as <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: SelectProps<Option, IsMulti, Group>
) => JSX.Element;

export default AdvancedSelect;
export * from './AsyncSelect';
export type { ValueType } from './AsyncSelect';
export * from './DropdownSelect';
