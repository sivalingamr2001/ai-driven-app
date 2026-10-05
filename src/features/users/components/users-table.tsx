import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  RotateCw,
  Trash2,
  UserX,
  AlertTriangle,
} from "lucide-react"
import type {
  SortOrder,
  User,
  UserRole,
  UserSortField,
  UserStatus,
} from "../types"

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  error: string | null
  selectedIds: Set<string>
  sortBy: UserSortField
  sortOrder: SortOrder
  onSort: (field: UserSortField) => void
  onToggleSelectAll: () => void
  onToggleSelectRow: (id: string) => void
  onEditUser: (user: User) => void
  onDeleteUser: (user: User) => void
  onRetry: () => void
  onResetFilters?: () => void
}

function getInitials(name: string) {
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function RoleBadge({ role }: { role: UserRole }) {
  switch (role) {
    case "owner":
      return <Badge variant="default">Owner</Badge>
    case "admin":
      return <Badge variant="secondary">Admin</Badge>
    case "editor":
      return <Badge variant="outline" className="border-blue-500/40 text-blue-600 dark:text-blue-400">Editor</Badge>
    case "member":
    default:
      return <Badge variant="outline">Member</Badge>
  }
}

function StatusBadge({ status }: { status: UserStatus }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          Active
        </span>
      )
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium bg-muted text-muted-foreground">
          <span className="size-1.5 rounded-full bg-muted-foreground" />
          Inactive
        </span>
      )
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
          Pending
        </span>
      )
    case "suspended":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium bg-destructive/10 text-destructive">
          <span className="size-1.5 rounded-full bg-destructive" />
          Suspended
        </span>
      )
  }
}

function SortHeaderButton({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
}: {
  label: string
  field: UserSortField
  currentSort: UserSortField
  currentOrder: SortOrder
  onSort: (field: UserSortField) => void
}) {
  const isSorted = currentSort === field
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-7 gap-1 text-xs font-semibold text-foreground hover:bg-muted"
      onClick={() => onSort(field)}
      aria-label={`Sort by ${label} in ${isSorted && currentOrder === "asc" ? "descending" : "ascending"} order`}
    >
      <span>{label}</span>
      {isSorted ? (
        currentOrder === "asc" ? (
          <ArrowUp className="size-3 text-primary" />
        ) : (
          <ArrowDown className="size-3 text-primary" />
        )
      ) : (
        <ArrowUpDown className="size-3 text-muted-foreground/60" />
      )}
    </Button>
  )
}

export function UsersTable({
  users,
  isLoading,
  error,
  selectedIds,
  sortBy,
  sortOrder,
  onSort,
  onToggleSelectAll,
  onToggleSelectRow,
  onEditUser,
  onDeleteUser,
  onRetry,
  onResetFilters,
}: UsersTableProps) {
  const isAllSelected = users.length > 0 && selectedIds.size === users.length
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < users.length

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
          <AlertTriangle className="size-6" />
        </div>
        <h3 className="text-base font-medium text-foreground">Something went wrong.</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          {error}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-1.5"
          aria-label="Try again, retry loading users"
        >
          <RotateCw className="size-3.5" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 px-3">
              <Checkbox
                checked={isAllSelected || (isIndeterminate ? "indeterminate" : false)}
                onCheckedChange={onToggleSelectAll}
                aria-label="Select all users on current page"
                disabled={isLoading || users.length === 0}
              />
            </TableHead>
            <TableHead className="min-w-[200px]">
              <SortHeaderButton
                label="User"
                field="name"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="min-w-[180px]">
              <SortHeaderButton
                label="Email"
                field="email"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="w-28">
              <SortHeaderButton
                label="Role"
                field="role"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="w-28">
              <SortHeaderButton
                label="Status"
                field="status"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="w-32">
              <SortHeaderButton
                label="Joined"
                field="createdAt"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="w-12 text-right pr-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Skeleton loading rows
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`} className="h-14">
                <TableCell className="px-3">
                  <Skeleton className="size-4 rounded-sm" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-20" />
                </TableCell>
                <TableCell className="text-right pr-4">
                  <Skeleton className="size-7 rounded-md ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                    <UserX className="size-6" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">No users found</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                    Try adjusting your search or filters to find what you&apos;re looking for, or add a new user.
                  </p>
                  {onResetFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onResetFilters}
                      className="mt-4"
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // Populated rows
            users.map((user) => {
              const isSelected = selectedIds.has(user.id)
              const joinedFormatted = new Date(user.createdAt).toLocaleDateString(
                undefined,
                { year: "numeric", month: "short", day: "numeric" }
              )

              return (
                <TableRow
                  key={user.id}
                  data-state={isSelected ? "selected" : undefined}
                  className="group hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="px-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelectRow(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs text-foreground group-hover:text-primary transition-colors">
                          {user.name}
                        </span>
                        <span className="text-[0.6875rem] text-muted-foreground">
                          {user.department || "General"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {user.email}
                  </TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {joinedFormatted}
                  </TableCell>

                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={`Open actions menu for ${user.name}`}
                        >
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel className="text-xs">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onEditUser(user)}
                          className="text-xs cursor-pointer"
                        >
                          <Pencil className="size-3.5 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteUser(user)}
                          className="text-xs text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-3.5 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
