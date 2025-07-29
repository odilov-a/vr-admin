import { Switch } from "antd";
import { FieldProps, FormikProps } from "formik";

interface CustomSwitchProps extends FieldProps {
  form: FormikProps<any>;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  field,
  form,
  ...props
}) => {
  const { name, value } = field;
  const handleChange = (checked: boolean) => {
    form.setFieldValue(name, checked);
  };

  const isChecked = () => {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1";
    }
    if (typeof value === "number") {
      return value === 1;
    }
    return Boolean(value);
  };

  return <Switch checked={isChecked()} onChange={handleChange} {...props} />;
};

export default CustomSwitch;
