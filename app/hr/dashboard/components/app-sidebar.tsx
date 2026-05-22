"use client";

import * as React from "react"
import {
  IconCalendarEvent,
  IconCamera,
  IconChartBar,
  IconCurrencyRupee,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSchool,
  IconSearch,
  IconSettings,
  IconUsers,
  IconUserSearch,
  IconWallet,
} from "@tabler/icons-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type SidebarUser = {
  name?: string
  email?: string
  avatar?: string
  role?: string
  id?: string
}

const emptySidebarUser = {
  name: "",
  email: "",
  avatar: "",
  branchName: "",
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/hr/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Employees",
      url: "/hr/employee",
      icon: IconListDetails,
    },
    {
      title: "Tasks Management",
      url: "/hr/tasks",
      icon: IconChartBar,
    },
    {
      title: "Meeting",
      url: "/hr/eventmeeting",
      icon: IconCalendarEvent,
    },
    {
      title: "Job Posting",
      url: "/hr/jobposting",
      icon: IconUsers,
    },
    {
      title: "Expense",
      url: "/hr/expense",
      icon: IconWallet,
    },
     {
      title: "Payroll",
      url: "/hr/payroll",
      icon: IconCurrencyRupee,
    },
    {
      title: "Training",
      url: "/hr/training",
      icon: IconSchool,
    },
    {
      title: "Interview",
      url: "/hr/interview",
      icon: IconUserSearch,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
    const [user, setUser] =
      useState<SidebarUser | null>(null);
  
    useEffect(() => {
      const storedUser =
        localStorage.getItem(
          "user"
        );
  
      if (!storedUser) {
        router.push("/login");
  
        return;
      }
  
      const parsedUser =
        JSON.parse(storedUser);
  
      // ROLE CHECK
      if (
        parsedUser.role !==
        "hr"
      ) {
        router.push("/login");
  
        return;
      }
  
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(parsedUser);
      console.log(parsedUser);
    }, [router]);

  const loginId = user?.id || "";

  const basePath = loginId
    ? `/hr/${loginId}`
    : "/hr";

  const navItems = data.navMain.map((item) => ({
    ...item,
    url: `${basePath}${item.url.replace("/hr", "")}`,
  }));

  const sidebarUser = user
    ? {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        branchName: "",
      }
    : emptySidebarUser;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
