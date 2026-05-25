// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"

// export function SiteHeader() {
//   return (
//     <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-4"
//         />
//         <h1 className="text-base font-medium">Documents</h1>
//         {/* <div className="ml-auto flex items-center gap-2">
//           <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
//             <a
//               href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
//               rel="noopener noreferrer"
//               target="_blank"
//               className="dark:text-foreground"
//             >
//               GitHub
//             </a>
//           </Button>
//         </div> */}
//       </div>
//     </header>
//   )
// }


"use client"

import {
  Bell,
} from "lucide-react"

import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { Separator } from "@/components/ui/separator"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {

  type NotificationItem = {
    _id: string
    title: string
    message: string
    createdAt: string
    branchName?: string
    read?: boolean
  }

  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>([])

  const fetchNotifications = useCallback(async () => {

  try {

    const user =
      JSON.parse(
        localStorage.getItem(
          "user"
        ) || "{}"
      )

    if (!user.branchName) {
      return
    }

    const employeeId =
      user._id ||
      user.id ||
      user.employeeId

    if (!employeeId) {
      return
    }

    const res =
      await fetch(
        `/api/notification?branchName=${encodeURIComponent(
          user.branchName
        )}&employeeId=${encodeURIComponent(
          employeeId
        )}`
      )

    const data =
      await res.json()

    console.log(data)

    if (data.success) {

      const filtered =
        data.notifications.filter(
          (notification: NotificationItem) =>
            notification.branchName ===
              user.branchName &&
            notification.read !== true
        )

      setNotifications(
        filtered
      )
    }

  } catch (error) {
    console.log(error)
  }
}, [])

async function markAsRead(
  id: string
) {
  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    )

    const employeeId =
      user._id ||
      user.id ||
      user.employeeId

    if (!user.branchName || !employeeId) {
      return
    }

    const res =
      await fetch(
        "/api/notification",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
            employeeId,
            branchName:
              user.branchName,
          }),
        }
      );

    const data =
      await res.json();

    if (data.success) {

      setNotifications(
        notifications.filter(
          (item) =>
            item._id !== id
        )
      );
    }

  } catch (error) {
    console.log(error);
  }
}

  useEffect(() => {

  // INITIAL FETCH
  const timeout =
    window.setTimeout(() => {
      void fetchNotifications();
    }, 0)

  // AUTO REFRESH EVERY 5 SECONDS
  const interval =
    setInterval(() => {
      void fetchNotifications();
    }, 5000);

  return () => {
    clearTimeout(timeout)
    clearInterval(interval)
  }

}, [fetchNotifications]);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">

      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">

        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <h1 className="text-base font-medium">
          Documents
        </h1>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-3 relative">

          {/* NOTIFICATION BUTTON */}
          <button
            onClick={() =>
              setOpen(!open)
            }
            className="relative p-2 rounded-xl hover:bg-gray-100 transition"
          >

            <Bell size={22} />

            {notifications.length >
              0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {
                  notifications.length
                }
              </span>
            )}

          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">

              <div className="p-4 border-b font-bold">
                Notifications
              </div>

              <div className="max-h-96 overflow-y-auto">

                {notifications.length ===
                0 ? (

                  <div className="p-6 text-sm text-gray-400 text-center">
                    No notifications
                  </div>

                ) : (

                  notifications.map(
                    (
                      notification,
                      i
                    ) => (

                      <div
                        key={notification._id || i}
                        className="p-4 border-b hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900 leading-5 truncate">
                              {
                                notification.title
                              }
                            </p>

                            <p className="text-xs text-gray-500 mt-1 leading-5 wrap-break-word">
                              {
                                notification.message
                              }
                            </p>

                            <p className="text-[10px] text-gray-400 mt-2">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }
                            className="shrink-0 h-7 px-3 rounded-md border border-gray-300 text-[11px] font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition"
                          >
                            Mark as Read
                          </button>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  )
}