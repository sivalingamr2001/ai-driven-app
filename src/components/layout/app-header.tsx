import { Link, useRouterState } from "@tanstack/react-router"
import { Bell, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"
import { sidebarData } from "./data/sidebar-data"

export function AppHeader() {
  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  })

  // Format breadcrumb based on current path
  const isUsers = currentPath.startsWith("/users")
  const pageTitle = isUsers ? "Users" : "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm transition-[width,height] ease-linear">
      {/* Left: Sidebar trigger + Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar navigation" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {isUsers && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            {!isUsers && (
              <BreadcrumbItem className="md:hidden">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Actions, Theme, Notifications, User */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8"
              aria-label="View notifications"
            >
              <Bell className="size-4 text-foreground" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 text-xs">
            <DropdownMenuLabel className="font-medium text-xs">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-3 text-center text-muted-foreground">
              <Sparkles className="mx-auto size-5 mb-1.5 text-primary" />
              <p className="font-medium text-foreground">All caught up!</p>
              <p className="text-[0.6875rem]">No pending administrative alerts.</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              aria-label="User options"
            >
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  AR
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-xs">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {sidebarData.user.name}
                </span>
                <span className="text-[0.6875rem] text-muted-foreground">
                  {sidebarData.user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs cursor-pointer">
              Profile Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs cursor-pointer">
              System Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-destructive focus:text-destructive cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
