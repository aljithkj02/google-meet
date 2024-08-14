import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "./Navbar"
import toast, { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { SignalingManager } from "../managers/signaling.manager"
import { MessageTypes } from "../types"
import { Loader } from "./Loader"
import { useDispatch, useSelector } from "react-redux"
import { AppStoreType } from "../store/appStore"
import { setLoading } from "../store/slices/global.slice"

export const Layout = () => {
  const loading = useSelector((state: AppStoreType) => state.global.loading);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    SignalingManager.getInstance().setCallbacks(MessageTypes.ERROR, (msg: string) => {
      toast.dismiss();
      toast.error(msg);
      dispatch(setLoading(false));
    })
  }, [])

  return (
    <div>
        { pathname === '/' && <Navbar /> }
        { loading && <Loader /> }
        <div>
            <Outlet />
        </div>
        <Toaster />
    </div>
  )
}
