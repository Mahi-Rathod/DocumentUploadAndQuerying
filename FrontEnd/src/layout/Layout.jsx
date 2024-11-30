import Navbar from "../components/navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import React from 'react'

function Layout() {
  return (
    <>
        <Navbar />
        <Outlet />
    </>
  )
}

export default Layout