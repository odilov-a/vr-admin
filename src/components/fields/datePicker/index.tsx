import { DatePicker } from "antd";
import { FieldProps } from "formik";
import dayjs, { Dayjs } from "dayjs";

interface IProps extends FieldProps {
  rootClassName?: string;
  format?: string;
  size?: "large" | "middle" | "small";
  placeholder: string;
  label?: string;
  onChange?: (arg0: Dayjs | null, arg2?: number) => void;
  disabled?: boolean;
}

const index = (props: IProps) => {

  const {
    field: { name, value },
    form: { setFieldValue, setFieldTouched, errors, touched },
    rootClassName = "",
    format = 'DD/MM/YYYY',
    size = "large",
    placeholder,
    label,
    onChange = () => { },
    disabled = false,
  } = props;

  return (
    <div className={rootClassName + " flex flex-col items-start"}>
      {label ? <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px]">{label}</p> : null}
      <DatePicker
        defaultValue={dayjs.unix(value)}
        format={format}
        size={size}
        placeholder={placeholder}
        onBlur={() => {
          setFieldTouched(name, true);
        }}
        onChange={(date: any) => {
          if (date) {
            setFieldValue(name, dayjs(date).unix());
          } else {
            setFieldValue(name, "")
          }
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default index;
