import { Link, useRouterState } from "@tanstack/react-router"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavGroup as NavGroupType } from "./data/sidebar-data"

interface NavGroupProps {
  group: NavGroupType
}

export function NavGroup({ group }: NavGroupProps) {
  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/80">
        {group.title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map((item) => {
          const isActive =
            item.url === "/"
              ? currentPath === "/"
              : currentPath === item.url || currentPath.startsWith(`${item.url}/`)

          if (item.disabled) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  disabled
                  className="opacity-50 cursor-not-allowed"
                  aria-label={`${item.title} (disabled)`}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <SidebarMenuBadge className="text-[0.625rem]">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}
              >
                <Link to={item.url} aria-label={item.title}>
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <SidebarMenuBadge className="text-[0.625rem]">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
