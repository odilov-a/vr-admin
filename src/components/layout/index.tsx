import React from "react";
import { Outlet } from "react-router-dom";
import cx from "classnames";

import { Header, Navigation } from "components";
import useStore from "store";

import './style.scss'

const App: React.FC = () => {
  const { system } = useStore();
  const isSidebarOpen = system.toggleSidebar !== "close";

  return (
    <div className="main-layout">
      <Navigation />
      <div className={cx("right-layout", { shifted: !isSidebarOpen })}>
        <Header />
        <div className="content-layout">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
