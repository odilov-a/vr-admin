
import { ChangeEvent } from "react";
import { FieldProps } from "formik";
import ReactQuill from "react-quill";
import cx from "classnames";
import "react-quill/dist/quill.snow.css";

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
    placeholder = "Type...",
    label,
    form: { setFieldValue, setFieldTouched, touched, errors, values },
    className = "",
    rootClassName = "",
    onChange = () => { },
  } = props;

  const onBlur = (e: any) => {
    setFieldTouched(name, !!e.index);
  };

  const classNames = cx("h-[150px] ");

  return (
    <div className={rootClassName + " input relative"}>
      {label ? <p className="py-[6px] inline-block mb-[8px]">{label}</p> : null}
      <ReactQuill
        value={value}
        
        className={classNames + className}
        onChange={(e: any) => {
          setFieldValue(name, e);
          onChange(e);
        }}
        placeholder={placeholder}
        key={name}
        onBlur={onBlur}
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
