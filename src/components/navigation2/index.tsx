import React from "react";
import { Link } from "react-router-dom";
import useStore from "store";
import { helpers } from "services";
import logo from "assets/images/logo.png";
import { useHooks } from "hooks";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  route?: string;
}


const Navigation2: React.FC = () => {
  const { get, t, location } = useHooks()
  const { auth } = useStore((state) => state);

  const data = get(auth, "data")

  const pathSegments = location.pathname.split('/');
  const pathname = `/${pathSegments[1]}`;

  const filterKeys = get(data, "role.access", []).map((item: any) => (item.value));

  const filterMenuItems = (menuItems: MenuItem[], filterKeys: string[]): MenuItem[] => {
    return menuItems.reduce((filteredItems: MenuItem[], item) => {
      if (filterKeys.includes(item.key)) {
        filteredItems.push(item);
      } else if (item.children) {
        const filteredChildren = item.children.filter(child => filterKeys.includes(child.key));
        if (filteredChildren.length > 0) {
          filteredItems.push({ ...item, children: filteredChildren });
        }
      }
      return filteredItems;
    }, []);
  };

  return (
    <div className="h-full bg-no-repeat bg-cover bg-left">
      <div className="flex justify-center text-center cursor-pointer pt-[20px] text-[#9EA3B5]">
        <Link to="/">
          <img className="w-[205px]" src={logo} alt="logo" />
        </Link>
      </div>
      <div className={"h-[80vh] overflow-y-scroll no-scrollbar"}>
        {/* {filterMenuItems(helpers.menuItems, filterKeys).map((menuItem, i) => ( */}
        {helpers.menuItems.map((menuItem, i) => (
          <React.Fragment key={menuItem.key + i}>
            {/* @ts-ignore */}
            <Link to={get(menuItem, "route")} className={pathname === menuItem.route ? "navbar-menuitem navbar-menuitem-actived" : "navbar-menuitem"}>
              <div>
                {menuItem.icon}
              </div>
              {/* @ts-ignore */}
              <p>{t(get(menuItem, "label"))}</p>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Navigation2;
