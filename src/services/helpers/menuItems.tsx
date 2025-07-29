interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  route?: string;
  border?: boolean;
}

const SuperAdminMenus: MenuItem[] = [
  {
    key: "books",
    label: "Kitoblar",
    route: "/books",
  },

  // {
  //   key: "transactions",
  //   label: "Tranzaksiyalar",
  //   // icon: <TransactionsIcon />,
  //   route: "/transactions",
  // },

  // {
  //   key: "products",
  //   label: "Mahsulotlar",
  //   icon: <ProductsIcon />,
  //   route: "/product",
  //   children: [
  //     {
  //       key: "products-inner",
  //       label: "Mahsulotlar",
  //       route: "/product",
  //     },
  //     {
  //       key: "categories-subcategories",
  //       label: "Kategoriyalar va subkategoriyalar",
  //       route: "/categories-subcategories",
  //     }
  //   ]
  // },
];

const getMenu = (role: string) => {
  switch (role) {
    case "admin":
      return SuperAdminMenus;
    default:
      return [];
  }
};

export default getMenu;
