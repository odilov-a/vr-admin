import News from "pages/news";
import NewsUpdate from "pages/news/update";
import { lazy } from "react";
const User = lazy(() => import("pages/admin"));
const Default = lazy(() => import("pages/default"));

const Student = lazy(() => import("pages/student"));

const Book = lazy(() => import("pages/book"));
const BookCreate = lazy(() => import("pages/book/update"));
const BookUpdate = lazy(() => import("pages/book/update"));

const Organ = lazy(() => import("pages/organ"));
const OrganCreate = lazy(() => import("pages/organ/update"));
const OrganUpdate = lazy(() => import("pages/organ/update"));

const NotFound = lazy(() => import("pages/notFound"));

// const LocalizationPanel = lazy(() => import("pages/localizationPanel"));

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
    path: "/students",
    key: "students",
    title: "O'quvchilar",
    element: <Student />,
  },

  {
    path: "/books",
    key: "books",
    title: "Kitoblar",
    element: <Book />,
  },
  {
    path: "/books/create",
    key: "books-create",
    title: "Kitob qo'shish",
    element: <BookCreate />,
  },
  {
    path: "/books/update/:id",
    key: "books-update",
    title: "Kitob o'zgartirish",
    element: <BookUpdate />,
  },

   {
    path: "/news",
    key: "news",
    title: "Yangiliklar",
    element: <News />,
  },
  {
    path: "/news/create",
    key: "news-create",
    title: "Yangilik qo'shish",
    element: <NewsUpdate />,
  },
  {
    path: "/news/update/:id",
    key: "news-update",
    title: "Yangilikni o'zgartirish",
    element: <NewsUpdate />,
  },

  {
    path: "/organs",
    key: "organs",
    title: "Organlar",
    element: <Organ />,
  },
  {
    path: "/organs/create",
    key: "organs-create",
    title: "Organ qo'shish",
    element: <OrganCreate />,
  },
  {
    path: "/organs/update/:id",
    key: "organs-update",
    title: "Organ o'zgartirish",
    element: <OrganUpdate />,
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
