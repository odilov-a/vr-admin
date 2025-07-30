import { DatePicker, Radio } from "antd";
import { FieldProps } from "formik";
import dayjs, { Dayjs } from "dayjs";

interface IProps extends FieldProps {
  rootClassName?: string;
  size?: "large" | "middle" | "small";
  label?: string;
  options: any;
  buttonStyle: "outline" | "solid";
  defaultValue?: any;
  optionType: "default" | "button";
  onChange?: (arg0: Dayjs | null, arg2?: number) => void;
  disabled?: boolean;
}

const index = (props: IProps) => {

  const {
    field: { name, value },
    form: { setFieldValue, setFieldTouched, errors, touched },
    rootClassName = "",
    size = "large",
    options,
    optionType = "default",
    defaultValue,
    label,
    buttonStyle="solid",
    onChange = () => { },
    disabled = false,
  } = props;

  return (
    <div className={rootClassName + " flex flex-col items-start"}>
      {label ? <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px]">{label}</p> : null}
      <Radio.Group
        defaultValue={defaultValue}
        options={options}
        buttonStyle={buttonStyle}
        disabled={disabled}
        size={size}
        onChange={() => setFieldValue(name, value)}
        optionType={optionType}
      />
    </div>
  );
};

export default index;
