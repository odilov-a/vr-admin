import { Spin } from "antd";

import { useGet } from "hooks";
import RoutesWrapper from "routes";
import useStore from "store";

import "assets/styles/index.scss";

function App() {
  const {
    getMe,
    logOut,
  } = useStore((state) => state);
  const { isLoading } = useGet({
    name: "me",
    url: "admins/me",
    onSuccess: (data) => {
      getMe(data);
    },
    onError: (error) => {
      logOut();
    },
  });

  return (
    <>
      {isLoading ? (
        <div className="w-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-8">
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </div>
      ) : (
        <RoutesWrapper />
      )}
    </>
  );
}

export default App;
