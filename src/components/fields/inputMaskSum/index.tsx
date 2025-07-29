import { Input } from 'antd';
import React, { ChangeEvent, useState } from 'react';
import InputMask from 'react-input-mask';
import { FieldProps } from "formik";

interface IProps extends FieldProps<any, any> {
  name: string;
  label?: string;
  className?: string;
  mask?: string;
  antdProps?: any;
  placeholder?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatNumber = (value: any) => {
  if (!value) return value;
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const NumberInput = (props: IProps) => {
  const {
    field: { value, name },
    className,
    // mask = "999 999 999 999",
    placeholder = "Введите",
    label = "",
    form: { setFieldValue, setFieldTouched, errors, touched },
    onChange = () => { },
    onBlur = () => { },
  } = props;

  const [error, setError] = useState(false);

  const handleChange = (e: any) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    onChange(rawValue);
    setFieldValue(name, e.target.value, true);
  };

  return (
    <div className={className + " input relative"}>
      {label ? <p className="text-[#9EA3B5] font-[500] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px]">{label}</p> : null}
      <InputMask
        // mask={mask}
        placeholder={placeholder}
        value={formatNumber(value)}
        onChange={handleChange}
        status={
          touched[name] && touched[name] && (errors[name] || error)
            ? "error"
            : ""
        }
        // onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
        //   if (e.target.value.replace(/_|_/g, "").length < mask.length) {
        //     setError(true);
        //   } else {
        //     setError(false);
        //   }
        //   setFieldTouched(name, true);
        //   onBlur(e);
        // }}
      >
        {(inputProps: any) => <Input {...inputProps} type="text" />}
      </InputMask>

      <p className="mt-[5px] text-[#ff4d4f]">
        {errors[name] && touched[name] ? (
          <span>{errors[name]?.toString() ?? "Error"}</span>
        ) : null}
      </p>
    </div>
  );
};

export default NumberInput;