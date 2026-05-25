"use client";

import { Bell, Check } from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
};

export default function NotificationBell() {

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>([]);

  async function fetchNotifications() {

    try {

      const user = JSON.parse(
        localStorage.getItem(
          "user"
        ) || "{}"
      );

      if (!user.branchName || !user.id) {
        return;
      }

      const res = await fetch(
        `/api/notification?branchName=${encodeURIComponent(user.branchName)}&employeeId=${encodeURIComponent(user.id)}`
      );

      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications);
      }

    } catch (error) {
      console.log(error);
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (!user.id) {
        return;
      }

      const res = await fetch("/api/notification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: notificationId,
          employeeId: user.id,
          branchName: user.branchName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setNotifications((currentNotifications) =>
          currentNotifications.filter(
            (notification) =>
              notification._id !== notificationId
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="relative">

      {/* ICON */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative rounded-xl p-2 transition hover:bg-gray-100"
      >
        <Bell size={22} />

        {notifications.length >
          0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

          <div className="border-b p-4 font-bold">
            Notifications
          </div>

          <div className="max-h-96 overflow-y-auto">

            {notifications.length ===
            0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map(
                (
                  notification,
                  i
                ) => (
                  <div
                    key={i}
                    className="border-b p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-[10px] text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium text-gray-600 transition hover:bg-gray-100"
                      >
                        <Check size={12} />
                        Mark as read
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
  );
}