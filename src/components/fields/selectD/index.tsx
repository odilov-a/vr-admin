import Select from 'react-select';

const AsyncSelect: React.FC = (props: any) => {

  const {
    onChange = () => { },
    isSearchable = true,
    disableOptions = [],
    isClearable = false,
    isDisabled = false,
    required = false,
    placeholder = 'Выберите...',
    optionLabel,
    optionValue,
    rootClassName,
    defaultValue,
    label,
    options,
    isMulti,
    className,
    key
  } = props

  return (
    <div className={rootClassName + ' input relative'}>
      {label ? <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px]">{label}</p> : null}
      <Select
        value={options.find((option:any) => option.value === defaultValue)}
        getOptionLabel={option => option[optionLabel]}
        getOptionValue={option => option[optionValue]}
        key={key}
        required={required}
        options={options}
        placeholder={placeholder}
        className={className}
        onChange={option => {
          onChange(option)
        }}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isMulti={isMulti}
      />
    </div>
  );
};

export default AsyncSelect;