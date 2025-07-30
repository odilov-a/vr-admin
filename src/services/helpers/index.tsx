import { AppstoreOutlined } from "@ant-design/icons";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  route?: string;
}

const menuItems: MenuItem[] = [
    {
    key: "dashboard",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
    route: "/",
  },
  {
    key: "students",
    label: "O'quvchilar",
    icon: <AppstoreOutlined />,
    route: "/students",
  },
];

function gen4() {
  return Math.random()
    .toString(16)
    .slice(-4);
}

export default {
  menuItems,
};

export { gen4 };
