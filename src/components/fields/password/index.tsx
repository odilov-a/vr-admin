import { useState } from "react";
import { Input } from "antd";
import { FieldProps } from "formik";

interface IProps extends FieldProps<any, any> {
  placeholder?: string;
  name: string;
  size?: "large" | "small";
  label: string;
  className?: string;
  required?: boolean;
  rootClassName?: string;
}

const MyInput = (props: IProps) => {
  const {
    field: { value, name },
    placeholder = "Basic Input",
    label,
    form: { setFieldValue, setFieldTouched, touched, errors },
    size = "large",
    className = "",
    required = false,
    rootClassName = "",
  } = props;

  const touchedV = touched[name];
  const hasError = errors[name];
  const touchedError = hasError && touchedV;
  const onBlur = (e: any) => {
    setFieldTouched(name, !!e.target.value);
  };

  return (
    <div className={rootClassName + " input"}>
      {label ? <p className="py-[6px] inline-block mb-[8px] font-[500]">{label}</p> : null}
      <Input.Password
        size={size}
        required={required}
        placeholder={placeholder}
        name={name}
        status={touchedError ? "error" : ""}
        value={value}
        onChange={(e) => {
          setFieldValue(name, e.target.value);
        }}
        onBlur={onBlur}
        className={className}
      />
      <p className="mt-[5px] text-[#ff4d4f]">
        {errors[name] && touched[name] ? (
          <span>{errors[name]?.toString() ?? "Error"}</span>
        ) : null}
      </p>
    </div>
  );
};

export default MyInput;
