import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import cx from "classnames";

import { Navigation, Header, Navigation2 } from "components";
import useStore from "store";

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { system } = useStore();

  return (
    <Layout className="h-full">
      <Sider
        trigger={null}
      >
        <Navigation2 />
      </Sider>
      <Layout>
        <Header />
        <Content className="overflow-auto p-[16px] min-h-[280px]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
