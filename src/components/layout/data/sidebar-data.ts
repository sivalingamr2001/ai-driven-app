import {
  Command,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  badge?: string
  disabled?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SidebarData {
  user: {
    name: string
    email: string
    avatar: string
    role: string
  }
  team: {
    name: string
    logo: LucideIcon
    plan: string
  }
  navGroups: NavGroup[]
}

export const sidebarData: SidebarData = {
  user: {
    name: "Alex Rivera",
    email: "alex.rivera@acme.corp",
    avatar: "",
    role: "Admin",
  },
  team: {
    name: "Acme Corp",
    logo: Command,
    plan: "Enterprise",
  },
  navGroups: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
          badge: "12",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
          disabled: true,
          badge: "Soon",
        },
        {
          title: "Products",
          url: "/products",
          icon: Package,
          disabled: true,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Permissions",
          url: "/permissions",
          icon: ShieldCheck,
          disabled: true,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          disabled: true,
        },
      ],
    },
  ],
}
