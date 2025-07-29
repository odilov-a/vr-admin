import { useTranslation } from "react-i18next";
import { Button } from "antd";
import cx from "classnames";

import { Edit, Plus } from "assets/images/icons"
import './style.scss'

interface IProps {
  title: string;
  size?: "large" | "small";
  type?: "primary" | "default" | "secondary";
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  edit?: boolean;
  create?: boolean;
  htmlType?: "button" | "submit" | "reset";
  icon?: any;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MyButton = (props: IProps) => {

  const {
    title = "Button",
    size = "large",
    className = "",
    type = "primary",
    isLoading = false,
    disabled = false,
    htmlType = "button",
    onClick = () => { },
    icon = null,
    edit = false,
    create = false
  } = props;

  const { t } = useTranslation();

  const classNames = cx(
    type == "primary" && " primary-button",
    type == "default" && " default-button",
    type == "secondary" && " secondary-button"
  );

  return (
    <Button disabled={disabled} onClick={onClick} icon={icon} size={size} htmlType={htmlType} loading={isLoading} className={className + classNames}>
      <div className={(!edit && !create && !icon) ? "ml-[-5px]" : ""}>{edit ? <div><Edit /></div> : create ? <div><Plus /></div> : icon ? icon : <p className="ml-[-5px]"></p>}</div>{t(title)}
    </Button>
  );
};

export default MyButton;
