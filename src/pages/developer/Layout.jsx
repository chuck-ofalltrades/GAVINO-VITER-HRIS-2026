import React from "react";
import Header from "../../partials/Header"; 
import { navList } from "../nav-functions";
import Navigation from "../../partials/Navigation";

const Layout = ({ children, menu, submenu }) => {
  return (
    <>
        {/* HEADER */}
        <Header />
        
        {/* NAVIGATION */}
        <Navigation menu={menu} submenu={submenu} navigationList={navList} />

        {/* BODY */}
        {children}

        {/* FOOTER */}
    </>
  );
};

export default Layout;