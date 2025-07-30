import React, { useState } from "react";
import { Menu } from "antd";
import { useHooks } from "hooks";
import { Link } from "react-router-dom";
import { Translation } from "assets/images/icons";
import logo from "assets/images/logo.png";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  route?: string;
}

const rootSubmenuKeys = ["sub1", "sub2", "sub4"];
const Navigation: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>(["sub1"]);
  const { t } = useHooks();
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const items: MenuItem[] = [
    {
      key: "translations",
      label: t("Tarjimalar"),
      icon: <Translation />,
      route: "/translations",
    },
  ];

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      className="h-full w-[280px] dark:bg-[#002855]"
      style={{ transition: "none" }}
    >
      <div className="flex items-center justify-center text-center text-[20px] font-[500] mt-[30px] mb-[25px] cursor-pointer dark:text-[#002855]">
        <img
          src={logo}
          alt="Logo"
          className="mr-2 w-6 h-6 inline-block align-middle"
        />
      </div>
      {items.map((menuItem, i) => (
        <React.Fragment key={menuItem.key + i}>
          {menuItem.children ? (
            <Menu.SubMenu
              key={menuItem.key + i}
              icon={menuItem.icon}
              title={menuItem.label}
            >
              {menuItem.children.map((childItem) => (
                <Menu.Item
                  key={childItem.key}
                  className="left-sidebar text-[#002855] text-[17px]"
                >
                  {childItem.route ? (
                    // @ts-ignore
                    <Link to={childItem.route}>{t(childItem.label)}</Link>
                  ) : (
                    <>{childItem.route}</>
                  )}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item
              key={menuItem.key}
              className="left-sidebar text-[#9EA3B5] text-[17px]"
              icon={menuItem.icon}
            >
              {menuItem.route ? (
                <Link to={menuItem.route}>{menuItem.label}</Link>
              ) : (
                <>{menuItem.route}</>
              )}
            </Menu.Item>
          )}
        </React.Fragment>
      ))}
    </Menu>
  );
};

export default Navigation;
