import React from "react";
import Header from "../../partials/Header";
import Navigation from "../../partials/Navigation";
import ModalSuccess from "../../partials/modals/ModalSuccess";
import { StoreContext } from "../../store/StoreContext";
import { navList } from "../nav-functions";
import { navAdminList } from "../nav-admin-functions"; // Added Import

const Layout = ({ children, menu, submenu }) => {
  const { store } = React.useContext(StoreContext);

  // Switch navigation logic based on session role
  const role = store?.credentials?.role_name?.toLowerCase();
  const currentNavList = role === "admin" ? navAdminList : navList;

  return (
    <>
      <Header />
      <Navigation
        menu={menu}
        submenu={submenu}
        navigationList={currentNavList}
      />
      <div className="wrapper">{children}</div>
      {store?.success && <ModalSuccess />}
    </>
  );
};

export default Layout;
