import React from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const isChat = location.pathname === "/chat";

  return (
    <div className="min-h-screen flex flex-col">
      {!isChat && <Header />}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
