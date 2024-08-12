import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Toaster } from "react-hot-toast"

export const Layout = () => {
  return (
    <div>
        <Navbar />

        <div>
            <Outlet />
        </div>
        <Toaster />
    </div>
  )
}
