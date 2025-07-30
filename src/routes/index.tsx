import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "components";
import { useHooks } from "hooks";
import { privateRoutes, publicRoutes } from "./data";
import PrivateRoute from "./privateRoute";
import PublicRoute from "./publicRoute";
import Login from "pages/login";
import NotFound from "pages/notFound";
import useStore from "store";
import { Spin } from "antd";
const Default = lazy(() => import("pages/default"));


interface IRoute {
  path: string;
  key?: string | "*";
  element: JSX.Element;
  inner?: IRoute[];
  index?: boolean;
  title: string;
}

const RoutesWrapper = () => {
  const { get, t } = useHooks();
  const { auth } = useStore((state) => state);

  const data = get(auth, "data")

  const filterKeys = get(data, "role.access", []).map((item: any) => (item.value));

  const filterMenuItems = (menuItems: IRoute[], filterKeys: string[]): IRoute[] => {
    return menuItems.reduce((filteredItems: IRoute[], item) => {
      //@ts-ignore
      if (filterKeys.includes(item.key)) {
        filteredItems.push(item);
      }
      return filteredItems.length > 0 ? filteredItems : [{
        path: "/",
        key: "inner-settings",
        title: "Welcome",
        element: <Default />,
      }]
    }, []);
  };

  return (
    <div className='h-full'>
      <Routes>
        <Route
          path={"/login"}
          element={
            <Suspense
              fallback={<div className="flex justify-center items-center">
                <Spin spinning={true} tip={t("Verifying")} />
              </div>}
            >
              <PublicRoute children={<Login />} />
            </Suspense>
          }
        />
        <Route
          path={"*"}
          element={
            <Suspense
              fallback={<div className="flex justify-center items-center">
                <Spin spinning={true} tip={t("Verifying")} />
              </div>}
            >
              <PrivateRoute children={<> <NotFound /> </>} />
            </Suspense>
          }
        />
        <Route path='/' element={<Layout />}>
          {/* Private protected routes */}
          {privateRoutes.length > 0 &&
            // filterMenuItems(privateRoutes, filterKeys).map((route, idx) => {
            privateRoutes.map((route, idx) => {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    <Suspense
                      fallback={
                        <div className='flex justify-center items-center h-[80vh]'>
                          <Spin spinning={true} tip={t("Loading...")} />
                        </div>
                      }
                    >
                      <PrivateRoute children={route.element} />
                    </Suspense>
                  }
                >
                  {get(route, "inner")?.map((innerRoute, innerKey) => (
                    <Route
                      key={innerKey}
                      path={innerRoute.path}
                      element={
                        <Suspense
                          fallback={
                            <div className='flex justify-center items-center h-[80vh]'>
                              <Spin spinning={true} tip={t("Loading...")} />
                            </div>
                          }
                        >
                          {innerRoute.element}
                        </Suspense>
                      }
                    />
                  ))}
                </Route>
              );
            })}

          {/* Public routes */}
          {publicRoutes.length > 0 &&
            publicRoutes.map((route, idx) => {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    <Suspense
                      fallback={
                        <div className='flex justify-center items-center h-[80vh]'>
                          <Spin spinning={true} tip={t("Loading...")} />
                        </div>
                      }
                    >
                      <PublicRoute children={route.element} />
                    </Suspense>
                  }
                >
                  {get(route, "inner")?.map((innerRoute, innerKey) => (
                    <Route
                      key={innerKey}
                      path={innerRoute.path}
                      element={
                        <Suspense
                          fallback={
                            <div className='flex justify-center items-center h-[80vh]'>
                              <Spin spinning={true} tip={t("Loading...")} />
                            </div>
                          }
                        >
                          {innerRoute.element}
                        </Suspense>
                      }
                    />
                  ))}
                </Route>
              );
            })}
        </Route>
      </Routes>
    </div>
  );
};

export default RoutesWrapper;
