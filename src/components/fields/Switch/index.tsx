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
  return <Switch checked={Boolean(value)} onChange={handleChange} {...props} />;
};

export default CustomSwitch;
