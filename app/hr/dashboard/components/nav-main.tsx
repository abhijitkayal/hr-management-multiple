"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import type { Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  // CURRENT ROUTE
  const pathname =
    usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-8">

        <SidebarMenu className="space-y-3">
          {items.map((item) => {

            // ACTIVE ROUTE
            const isActive =
              pathname === item.url ||
              pathname.startsWith(`${item.url}/`)

            return (
              <SidebarMenuItem
                key={item.title}
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}

                  className={`
                    transition-all duration-200  gap-4

                    ${
                      isActive
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <Link href={item.url}  className="text-lg font-medium">

                    {item.icon && (
                      <item.icon />
                    )}

                    <span className="text-lg font-medium">
                      {item.title}
                    </span>

                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}