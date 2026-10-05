import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Trash2, X } from "lucide-react"
import type { UserRole, UserStatus } from "../types"

interface UsersToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  role: UserRole | "all"
  onRoleChange: (role: UserRole | "all") => void
  status: UserStatus | "all"
  onStatusChange: (status: UserStatus | "all") => void
  hasActiveFilters: boolean
  onResetFilters: () => void
  selectedCount: number
  totalCount: number
  onBulkDelete: () => void
}

export function UsersToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  hasActiveFilters,
  onResetFilters,
  selectedCount,
  totalCount,
  onBulkDelete,
}: UsersToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Search & Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search users or email..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-8 text-xs"
              aria-label="Search users by name or email"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute right-1 top-1.5 size-5"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X className="size-3" />
              </Button>
            )}
          </div>

          {/* Role Filter */}
          <div className="w-36">
            <Select
              value={role}
              onValueChange={(val) => onRoleChange(val as UserRole | "all")}
            >
              <SelectTrigger className="h-8 text-xs w-full" aria-label="Filter by role">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={status}
              onValueChange={(val) => onStatusChange(val as UserStatus | "all")}
            >
              <SelectTrigger className="h-8 text-xs w-full" aria-label="Filter by status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="size-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Bulk Action when selected */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs">
            <span className="font-medium text-foreground">
              {selectedCount} of {totalCount} selected
            </span>
            <Button
              variant="destructive"
              size="xs"
              onClick={onBulkDelete}
              aria-label="Delete selected users"
              className="gap-1"
            >
              <Trash2 className="size-3" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
