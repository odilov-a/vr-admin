import { ChangeEvent, useState } from "react";
import { Input } from "antd";
import { FieldProps } from "formik";

import { User } from 'assets/images/icons'
// import cx from "classnames";
// import useStore from "store";

interface IProps extends FieldProps<any, any> {
  placeholder?: string;
  defaultValue?: string;
  name: string;
  size?: "large" | "small";
  label: string;
  myValue: any;
  className?: string;
  rootClassName?: string;
  isLoginPage?: boolean;
  required?: boolean;
  disabled?: boolean;
  type?: "file" | "password" | "text";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const MyInput = (props: IProps) => {
  const {
    field: { value, name },
    placeholder = "Basic Input",
    label,
    form: { setFieldValue, setFieldTouched, touched, errors },
    size = "large",
    className = "",
    rootClassName = "",
    isLoginPage = false,
    required = false,
    type = "text",
    disabled = false,
    onChange = () => { },
  } = props;

  const touchedV = touched[name];
  const hasError = errors[name];
  const touchedError = hasError && touchedV;
  const onBlur = (e: any) => {
    setFieldTouched(name, !!e.target.value);
  };

  // const onChangeInner = (value: any) => setFieldValue(name, value);
  // const onInputChange = ({ target: { value } }: any) => setFieldValue(name, value);

  // const { system } = useStore((state) => state);
  // const classNames = cx(
  //   // " py-[10px] px-[15px] border-2 rounded-[12px] dark:bg-[#30354E] placeholder-[#9EA3B5] border-[#9EA3B5]",
  //   system.layoutColor == "black" && "focus:border-[#000] hover:border-[#000]",
  //   system.layoutColor == "red" && "focus:border-[#92082F] hover:border-[#92082F]",
  //   // system.layoutColor == "red" && "focus:border-[#92082F] hover:border-[#92082F]",
  //   system.layoutColor == "blue" && "focus:border-[#0104a0] hover:border-[#0104a0]",
  //   system.layoutColor == "green" && "focus:border-[#005041] hover:border-[#005041]"
  // );

  return (
    <div className={rootClassName + " input relative"}>
      {label ? <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px]">{label}</p> : null}
      <Input
        type={type}
        size={size}
        placeholder={placeholder}
        name={name}
        required={required}
        disabled={disabled}
        status={touchedError ? "error" : ""}
        value={value}
        onChange={(e) => {
          setFieldValue(name, e.target.value);
          onChange(e);
        }}
        onBlur={onBlur}
        className={className}
      />
      <p className="mt-[5px] text-[#ff4d4f]">
        {errors[name] && touched[name] ? (
          <span>{errors[name]?.toString() ?? "Error"}</span>
        ) : null}
      </p>
      {isLoginPage && (
        <div className="absolute right-[16px] top-[15px]">
          <User />
        </div>
      )}
    </div>
  );
};

export default MyInput;
