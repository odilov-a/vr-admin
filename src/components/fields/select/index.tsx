import Select from 'react-select';
import { get } from 'lodash'

const AsyncSelect: React.FC = (props: any) => {

  const {
    onChange = () => { },
    isSearchable = false,
    isClearable = false,
    disabled = false,
    required = false,
    placeholder = 'Выберите...',
    optionLabel,
    optionValue,
    rootClassName,
    label,
    options,
    isMulti,
    field: { name },
    form: { errors, setFieldValue, touched, values, },
    className,
  } = props

  return (
    <div className={rootClassName + ' input relative'}>
      {label ? <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px]">{label}</p> : null}
      <Select
        value={!isMulti ? options.find((option: any) => option.value === values[name]) : get(values, name)}
        getOptionLabel={option => option[optionLabel]}
        getOptionValue={option => option[optionValue]}
        key={name}
        required={required}
        options={options}
        placeholder={placeholder}
        className={className}
        onChange={option => {
          onChange(option)
          setFieldValue(name, option)
        }}
        isDisabled={disabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isMulti={isMulti}
      />
      <p className="mt-[5px] text-[#ff4d4f]">
        {errors[name] && touched[name] ? (
          <span>{errors[name]?.toString() ?? "Error"}</span>
        ) : null}
      </p>
    </div>
  );
};

export default AsyncSelect;