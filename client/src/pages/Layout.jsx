import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { Loader2Icon } from "lucide-react"
import { useUser, useAuth, SignIn, CreateOrganization } from "@clerk/clerk-react"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { loadTheme } from "../features/themeSlice"
import { fetchWorkspaces } from "../features/workspaceSlice"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { loading, workspaces } = useSelector((state) => state.workspace)
  const dispatch = useDispatch()

  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  
  // Load theme on first mount
  useEffect(() => {
    dispatch(loadTheme())
  }, [])

  // Load workspaces after user loads
  useEffect(() => {
    if (isLoaded && user && workspaces.length === 0) {
      dispatch(fetchWorkspaces({ getToken }))
    }
  }, [user, isLoaded])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <SignIn />
      </div>
    )
  }

  if (user && workspaces.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-zinc-950">
        <CreateOrganization />
      </div>
    )
  }

  return (
    <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout