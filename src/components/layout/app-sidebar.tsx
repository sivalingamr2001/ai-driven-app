import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavGroup } from "./nav-group"
import { NavUser } from "./nav-user"
import { sidebarData } from "./data/sidebar-data"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Brand Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <sidebarData.team.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-semibold">
                  {sidebarData.team.name}
                </span>
                <span className="truncate text-[0.6875rem] text-muted-foreground">
                  {sidebarData.team.plan}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Groups */}
      <SidebarContent className="gap-0">
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} group={group} />
        ))}
      </SidebarContent>

      {/* User Section */}
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>

      {/* Rail for desktop toggle */}
      <SidebarRail />
    </Sidebar>
  )
}
