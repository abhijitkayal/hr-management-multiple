"use client"

import {
  type Icon,
} from "@tabler/icons-react"

import Link from "next/link"

import { usePathname } from "next/navigation"

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

  const pathname =
    usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items.map((item) => {

            const isActive =
              pathname === item.url

            return (
              <SidebarMenuItem
                key={item.title}
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`
                    transition-all
                    duration-200
                    gap-4

                    ${
                      isActive
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "hover:bg-gray-100 text-black"
                    }
                  `}
                >
                  <Link
                    href={item.url}
                    className="text-lg font-medium"
                  >
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