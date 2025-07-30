import { Button } from "antd";

interface IProps {
  title: string;
  size?: "large" | "small";
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  htmlType?: "button" | "submit" | "reset";
  icon?: any;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MyButton = (props: IProps) => {
  const {
    title = "Button",
    size = "large",
    className = "",
    isLoading = false,
    disabled = false,
    htmlType = "button",
    onClick = () => {},
    icon = null,
  } = props;
  return (
    <div>
      <Button
        disabled={disabled}
        onClick={onClick}
        icon={icon}
        size={size}
        htmlType={htmlType}
        loading={isLoading}
        className="w-full bg-[#002855] border-[#002855] hover:bg-[#fff] hover:border-[#fff]"
        style={{
          backgroundColor: disabled ? "#002855" : "#002855",
          borderColor: disabled ? "#002855" : "#002855",
          color: "#fff",
        }}
      >
        {title}
      </Button>
    </div>
  );
};

export default MyButton;
