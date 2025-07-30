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
    key: "problems",
    label: "Masalalar",
    icon: <AppstoreOutlined />,
    route: "/problems",
  },
  {
    key: "test",
    label: "Testlar",
    icon: <AppstoreOutlined />,
    route: "/test",
  },
  // {
  //   key: "arena",
  //   label: "Arena",
  //   icon: <AppstoreOutlined />,
  //   route: "/arena",
  // },
  {
    key: "passed",
    label: "Test natijalari",
    icon: <AppstoreOutlined />,
    route: "/passed",
  },
  {
    key: "students",
    label: "O'quvchilar",
    icon: <AppstoreOutlined />,
    route: "/students",
  },
  {
    key: "teachers",
    label: "O'qituvchilar",
    icon: <AppstoreOutlined />,
    route: "/teachers",
  },
  {
    key: "products",
    label: "Mahsulotlar",
    icon: <AppstoreOutlined />,
    route: "/products",
  },
  {
    key: "resources",
    label: "Resurslar",
    icon: <AppstoreOutlined />,
    route: "/resources",
  },
  {
    key: "orders",
    label: "Buyurtmalar",
    icon: <AppstoreOutlined />,
    route: "/orders",
  },
  {
    key: "difficulties",
    label: "Qiyinliklar",
    icon: <AppstoreOutlined />,
    route: "/difficulties",
  },
  {
    key: "subjects",
    label: "Fanlar",
    icon: <AppstoreOutlined />,
    route: "/subjects",
  },
  // {
  //   key: "charts",
  //   label: "Hisobotlar",
  //   icon: <AppstoreOutlined />,
  //   route: "/charts",
  // },
  {
    key: "feedbacks",
    label: "Fikrlar",
    icon: <AppstoreOutlined />,
    route: "/feedbacks",
  },
  {
    key: "translations",
    label: "Tarjimalar",
    icon: <AppstoreOutlined />,
    route: "/translations",
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
