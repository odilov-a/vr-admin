import { lazy } from "react";

const NotFound = lazy(() => import("pages/notFound"));
const Profile = lazy(() => import("pages/profile"));

const Book = lazy(() => import("pages/book"));
const BookCreate = lazy(() => import("pages/book/update"));
const BookUpdate = lazy(() => import("pages/book/update"));

const LogOut = lazy(() => import("pages/logOut"));
// const LocalizationPanel = lazy(() => import("pages/localizationPanel"));

export interface IRoute {
  path: string;
  key?: string | "*";
  element: JSX.Element;
  inner?: IRoute[];
  index?: boolean;
  title: string;
  access?: string[];
}

const privateRoutes: IRoute[] = [
  {
    path: "/profile",
    key: "profile",
    title: "Profil",
    element: <Profile />,
    access: ["admin"],
  },

  {
    path: "/books",
    key: "books",
    title: "Kitoblar",
    element: <Book />,
    access: ["admin"],
  },
  {
    path: "/books/create",
    key: "books-create",
    title: "Kitob qo'shish",
    element: <BookCreate />,
    access: ["admin"],
  },
  {
    path: "/books/update/:id",
    key: "books-update",
    title: "Kitob o'zgartirish",
    element: <BookUpdate />,
    access: ["admin"],
  },

  {
    path: "/logout",
    key: "logout",
    title: "Profildan chiqish",
    element: <LogOut />,
    access: ["admin"],
  },
  {
    path: "*",
    key: "*",
    title: "",
    element: <NotFound />,
    access: ["admin"],
  },
  // {
  //   path: "/localization",
  //   key: "localization",
  //   title: "Tarjimalar paneli",
  //   element: <LocalizationPanel />,
  //   access: ["admin"],
  // },
];

const publicRoutes: IRoute[] = [
  // {
  //   path: "/login",
  //   element: <Login />,
  //   key: "inner-settings",
  //   title: "Welcome",
  // },
];

export { privateRoutes, publicRoutes };
