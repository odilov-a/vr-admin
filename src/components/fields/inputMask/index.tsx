import InputMask from "react-input-mask";
import { Input } from "antd";
import { FieldProps } from "formik";

interface IProps extends FieldProps<any, any> {
  name: string;
  label?: string;
  className?: string;
  mask?: string;
  antdProps?: any;
  type?: string;
  placeholder?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputMaskComponent = (props: IProps) => {
  const {
    field: { value, name },
    className,
    type,
    mask = "+999 (99) 999-99-99",
    placeholder = "Введите",
    label = "",
    form: { setFieldValue, setFieldTouched, errors, touched },
    onChange = () => { },
  } = props;

  const touchedV = touched[name];
  const hasError = errors[name];
  const touchedError = hasError && touchedV;
  const onBlur = (e: any) => {
    setFieldTouched(name, !!e.target.value);
  };

  return (
    <div className={className + " input relative"}>
      {label ? <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px]">{label}</p> : null}
      <InputMask
        formatChars={{
          '9': '[0-9]',
          'A': '[A-Z]'
        }}
        size='large'
        mask={mask}
        type={type}
        placeholder={placeholder}
        status={touchedError ? "error" : ""}
        onBlur={onBlur}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e);
          setFieldValue(name, e.target.value);
        }}
      >
        {(inputProps: any) => <Input {...inputProps} />}
      </InputMask>

      <p className="mt-[5px] text-[#ff4d4f]">
        {errors[name] && touched[name] ? (
          <span>{errors[name]?.toString() ?? "Error"}</span>
        ) : null}
      </p>
    </div>
  );
};

export default InputMaskComponent;
