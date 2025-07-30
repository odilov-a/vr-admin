import { lazy } from "react";
const User = lazy(() => import("pages/admin"));
const Chart = lazy(() => import("pages/chart"));
const Default = lazy(() => import("pages/default"));
const Student = lazy(() => import("pages/student"));
const Subject = lazy(() => import("pages/subject"));
const Teacher = lazy(() => import("pages/teacher"));
const Problem = lazy(() => import("pages/problem"));
const ProblemCreate = lazy(() => import("pages/problem/update"));
const ProblemUpdate = lazy(() => import("pages/problem/update"));
const NotFound = lazy(() => import("pages/notFound"));
const Feedback = lazy(() => import("pages/feedback"));
const Test = lazy(() => import("pages/test"));
const TestUpdate = lazy(() => import("pages/test/update"));
const Difficulty = lazy(() => import("pages/difficulty"));
const Product = lazy(() => import("pages/product"));
const Resource = lazy(() => import("pages/resource"));
const Order = lazy(() => import("pages/order"));
const Passed = lazy(() => import("pages/passed"));
// const Arena = lazy(() => import("pages/arena"));
const LocalizationPanel = lazy(() => import("pages/localizationPanel"));

export interface IRoute {
  path: string;
  key?: string | "*";
  element: JSX.Element;
  inner?: IRoute[];
  index?: boolean;
  title: string;
}

const privateRoutes: IRoute[] = [
  {
    path: "/",
    key: "welcome",
    title: "",
    element: <Default />,
  },
  {
    path: "/profile",
    key: "profile",
    title: "Profile",
    element: <User />,
  },
  {
    path: "/difficulties",
    key: "difficulties",
    title: "Qiyinliklar",
    element: <Difficulty />,
  },
  {
    path: "/subjects",
    key: "subjects",
    title: "Fanlar",
    element: <Subject />,
  },
  {
    path: "/students",
    key: "students",
    title: "O'quvchilar",
    element: <Student />,
  },
  {
    path: "/teachers",
    key: "teachers",
    title: "O'qituvchilar",
    element: <Teacher />,
  },
  {
    path: "/problems",
    key: "problems",
    title: "problems",
    element: <Problem />,
  },
  {
    path: "/problems/create",
    key: "problem-create",
    title: "problem-create",
    element: <ProblemCreate />,
  },
  {
    path: "/problems/update/:id",
    key: "problem-update",
    title: "problem-update",
    element: <ProblemUpdate />,
  },
  {
    path: "/feedbacks",
    key: "feedbacks",
    title: "Fikrlar",
    element: <Feedback />,
  },
  {
    path: "/charts",
    key: "charts",
    title: "Hisobotlar",
    element: <Chart />,
  },
  {
    path: "/test",
    key: "test",
    title: "Testlar",
    element: <Test />,
  },
  {
    path: "/test/create",
    key: "test-create",
    title: "Test qo'shish",
    element: <TestUpdate />,
  },
  {
    path: "/test/update/:id",
    key: "test-update",
    title: "Testni O'zgartirish",
    element: <TestUpdate />,
  },
  {
    path: "/products",
    key: "products",
    title: "Mahsulotlar",
    element: <Product />,
  },
  {
    path: "/resources",
    key: "resources",
    title: "Resurslar",
    element: <Resource />,
  },
  {
    path: "/orders",
    key: "orders",
    title: "Buyurtmalar",
    element: <Order />,
  },
  {
    path: "/passed",
    key: "passed",
    title: "Testlar natijalari",
    element: <Passed />,
  },
  // {
  //   path: "/arena",
  //   key: "arena",
  //   title: "Arena",
  //   element: <Arena />,
  // },
  {
    path: "/translations",
    key: "translations",
    title: "Tarjimalar",
    element: <LocalizationPanel />,
  },
  {
    path: "*",
    key: "*",
    title: "",
    element: <NotFound />,
  },
];

const publicRoutes: IRoute[] = [
  // {
  //   path: "/login",
  //   access: [],
  //   title: "Login",
  //   element: <Login />,
  // },
];

export { privateRoutes, publicRoutes };
