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
    <div className={rootClassName + ' input relative my-select-wrapper'}>
      {label ? <p className="py-[6px] inline-block mb-[8px] font-[500]">{label}</p> : null}
      <Select
        value={options.find((option: any) => option.value === values[name])}
        // value={!isMulti ? options.find((option: any) => option.value === values[name]) : get(values, name)}
        getOptionLabel={option => option[optionLabel]}
        getOptionValue={option => option[optionValue]}
        key={name}
        required={required}
        options={options}
        placeholder={placeholder}
        className={"my-select " + className}
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