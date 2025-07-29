import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cx from "classnames";

import useStore from "store";
import { Logout, MenuArrow, MenuClose, MenuOpen, MoreVertical, UserIcon } from "assets/images/icons";
import getMenu from "services/helpers/menuItems";
import { useGet, useHooks } from "hooks";
import { utils } from "services";
import AnimatedModal from "components/modalRight";
import Edit from "pages/profile/edit";
import NoPhoto from 'assets/images/icons/noPhoto.png'
import "./style.scss";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  route?: string;
  border?: boolean;
}

const Sidebar: React.FC = () => {
  const { auth, system, toggleSidebar } = useStore();
  const role = auth?.data?.data?.role || auth?.data?.role;
  const { get, t } = useHooks();
  const location = useLocation();
  const navigate = useNavigate();

  const [opened, setOpened] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(system.toggleSidebar !== "close");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useGet({
    name: "profileData",
    url: "/admins/me",
    onSuccess: () => { },
    onError: () => { }
  });

  const userData = get(data, "data");

  const name = `${get(userData, 'firstName', "Profile")} ${get(userData, 'lastName', "")}`;
  const imageUrl = get(userData, 'photo_url', NoPhoto);

  const changeSidebarState = () => {
    const nextState = isOpen ? "close" : "open";
    setIsOpen(!isOpen);
    toggleSidebar(nextState);
    if (isOpen) setOpened(null);
  };

  const toggleSubmenu = (key: string) => {
    setOpened((prev) => (prev === key ? null : key));
  };

  const menu = getMenu(role);

  const closeAll = () => {
    setIsOpen(false);
    toggleSidebar("close");
    setIsProfileOpen(false);
    setOpened(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleParentClick = (menu: MenuItem) => {
    const hasChildren = !!menu.children?.length;
    if (!isOpen && hasChildren) {
      setIsOpen(true);
      toggleSidebar("open");
      setTimeout(() => setOpened(menu.key), 200);
    } else if (hasChildren) {
      toggleSubmenu(menu.key);
    }
  };

  return (
    <>
      <AnimatedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        position="right"
        height="100vh"
        width="30%"
      >
        <Edit onClose={() => setModalOpen(false)} />
      </AnimatedModal>

      <aside className={cx("sidebar", { "--closed": !isOpen })}>
        <div className="sidebar-wrapper">
          <div className="sidebar-header">
            <Link to="/">
              <p className="logo-text">Admin dashboard</p>
            </Link>
            <div className="sidebar-arrow" onClick={changeSidebarState}>
              {system.toggleSidebar === "close" ? <MenuOpen /> : <MenuClose />}
            </div>
          </div>

          <div className="navigation-bar">
            <ul>
              {menu.map((item) => {
                const isActiveSubmenu = opened === item.key
                const hasChildren = item.children?.length;

                return (
                  <li key={item.key} className={cx({ "active-menu": isActiveSubmenu })}>
                    {hasChildren ? (
                      <>
                        <div
                          className={cx("sidebar-item sidebar-item-name", { "menu-active": isActiveSubmenu })}
                          onClick={() => handleParentClick(item)}
                        >
                          <div className="flex items-center">
                            {item.icon}
                            <span className="sidebar-item__label ml-4">{item.label}</span>
                          </div>
                          <div
                            className={cx("sidebar-item-arrow", {
                              rotated: isActiveSubmenu,
                            })}
                          >
                            <MenuArrow />
                          </div>
                        </div>
                        <div className="submenu-wrapper">
                          <ul
                            className={isActiveSubmenu ? "submenu-opened" : "submenu-closed"}
                          >
                            {item.children?.map((sub) => (
                              <li key={sub.key} className="submenu-item-wrapper">
                                <Link
                                  to={sub.route || "#"}
                                  className={
                                    location.pathname === sub.route
                                      ? "sidebar-subitem--actived"
                                      : "sidebar-subitem"
                                  }
                                >
                                  <span className="submenu-line" />
                                  <p>{sub.label}</p>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={item.route || "#"}
                        className={cx("sidebar-item sidebar-item-name", {
                          active:
                            utils.extractFirstPathSegment(location.pathname) ===
                            utils.extractFirstPathSegment(item.route),
                        })}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-4 sidebar-item__label">{item.label}</span>
                        </div>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div
              ref={dropdownRef}
              className={`flex bg-white rounded-lg  shadow-sm absolute bottom-1 left-0 right-0 z-50 
              transition-all duration-300 ${isOpen ? "p-2 mx-[1.5vw]" : "p-1 mx-3"}`}
            >
              <div
                className="profile-img  flex items-center justify-between w-full cursor-pointer "
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                {imageUrl ? (
                  <img
                    // src={NoPhoto}
                    src={imageUrl}
                    alt="Profile-image"
                    className={`rounded-full object-cover ${isOpen ? "w-8 h-8" : "w-[5vw] h-auto"} "}`}
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white text-xs font-bold">
                    {name}
                  </div>
                )}

                {isOpen && (
                  <>
                    <span className=" text-sm whitespace-nowrap">{name}</span>
                    <MoreVertical />
                  </>
                )}
              </div>

              {isProfileOpen && (
                <div className={`${isOpen ? "absolute top-[-5vw] right-0 w-40" : "absolute top-[-4vw] left-16"} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="py-1">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="profile-img flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon />
                      {t("Profil")}
                    </button>
                    <button
                      onClick={() => navigate("/logout")}
                      className="profile-img flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Logout />
                      {t("Chiqish")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
