import { Button } from "@/components/ui/button"
import { AlertCircle, Plus, RotateCw } from "lucide-react"

interface UsersHeaderProps {
  onAddUser: () => void
  onRefresh: () => void
  isRefreshing?: boolean
  onToggleSimulateError?: () => void
  isErrorSimulated?: boolean
}

export function UsersHeader({
  onAddUser,
  onRefresh,
  isRefreshing = false,
  onToggleSimulateError,
  isErrorSimulated = false,
}: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage system users, invite team members, and manage their permissions.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onToggleSimulateError && (
          <Button
            variant={isErrorSimulated ? "destructive" : "outline"}
            size="sm"
            onClick={onToggleSimulateError}
            title={
              isErrorSimulated
                ? "Simulated error active (Click to restore)"
                : "Simulate API error state"
            }
            aria-label="Test Error"
          >
            <AlertCircle className="size-3.5" />
            <span className="hidden sm:inline">
              {isErrorSimulated ? "Disable Error" : "Test Error"}
            </span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh users"
        >
          <RotateCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button size="sm" onClick={onAddUser} aria-label="Add User">
          <Plus className="size-3.5" />
          <span>Add User</span>
        </Button>
      </div>
    </div>
  )
}
