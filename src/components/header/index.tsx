import { Dropdown, Layout, Select } from "antd";
import type { MenuProps } from 'antd';
import i18next from "i18next";

import config from "config";
import { useHooks } from "hooks";
import useStore from "store";
import { privateRoutes, IRoute } from "routes/data";

import { Logout } from "assets/images/icons";
import { utils } from "services";
import './style.scss'

const { Header } = Layout;

const HeaderComponent = () => {
  const { get, location, t, navigate, params } = useHooks();
  const {
    system,
    auth: { data },
  } = useStore();
  const { Option } = Select;

  const id = get(params, "id")

  const changeLang = (langCode: string) => {
    i18next.changeLanguage(langCode);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const items: MenuProps['items'] = [
    {
      label: 'Profile',
      key: '/profile',
      // icon: <UserCircle />,
    },
    {
      label: 'Logout',
      key: '/logout',
      icon: <Logout />,
    }
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const findRouteTitle = (pathname: string, routes: IRoute[]): string => {
    const cleanPath = pathname.includes('/') && /\/\d+$/.test(pathname)
      ? pathname.substring(0, pathname.lastIndexOf('/'))
      : pathname;
    const route = routes.find(route => {
      const routePath = route.path.includes(':')
        ? route.path.substring(0, route.path.lastIndexOf('/'))
        : route.path;
      return routePath === cleanPath;
    });
    return route?.title || '';
  };

  const pathname = get(location, "pathname");
  const title = findRouteTitle(pathname, privateRoutes);

  return (
    <Header className="header flex justify-between items-center px-[30px] bgc-[#fff]">
      <div className="relative tabs-icons">
        <span className="header-title font-[500] text-[16px] text-[#77828A]">
          {title}
        </span>
      </div>
    </Header>
  );
};

export default HeaderComponent;
