import { DatePicker } from "antd";
import { FieldProps } from "formik";
import dayjs, { Dayjs } from "dayjs";

interface IProps extends FieldProps {
  rootClassName?: string;
  className?: string;
  format?: string;
  size?: "large" | "middle" | "small";
  placeholder: string;
  label?: string;
  onChange?: (arg0: Dayjs | null, arg2?: number) => void;
  disabled?: boolean;
  type?: string;
}

const index = (props: IProps) => {

  const {
    field: { name, value },
    form: { setFieldValue, setFieldTouched, errors, touched },
    rootClassName = "",
    className = "",
    format = 'DD/MM/YYYY',
    size = "large",
    placeholder,
    label,
    type="date",
    disabled = false,
  } = props;

  const dateValue = value.toString().length > 10 ? (value / 1000) : value

  return (
    <div className={rootClassName + " flex flex-col items-start"}>
      {label ? <p className="py-[6px] inline-block mb-[8px] font-[500]">{label}</p> : null}
      <DatePicker
        defaultValue={dayjs.unix(dateValue)}
        value={dayjs.unix(dateValue)}
        format={format}
        size={size}
        //@ts-ignore
        picker={type}
        className={className}
        placeholder={placeholder}
        onBlur={() => {
          setFieldTouched(name, true);
        }}
        onChange={(date: any) => {
          if (date) {
            setFieldValue(name, dayjs(date).unix());
          } else {
            setFieldValue(name, dayjs())
          }
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default index;
