import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import toast, { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { SignalingManager } from "../managers/signaling.manager"
import { MessageTypes } from "../types"

export const Layout = () => {

  useEffect(() => {
    SignalingManager.getInstance().setCallbacks(MessageTypes.ERROR, (msg: string) => {
      toast.dismiss();
      toast.error(msg);
    })
  }, [])

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
