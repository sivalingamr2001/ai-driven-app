import { Link, createFileRoute } from "@tanstack/react-router"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, UserCheck, Users, UserX } from "lucide-react"

export const Route = createFileRoute("/")({ component: DashboardPage })

function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Welcome Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back to Acme Enterprise Administration Console.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/users">
              Go to Users Management <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Users</span>
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Users className="size-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">12</div>
            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
              Enterprise accounts configured
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active Users</span>
              <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <UserCheck className="size-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">7</div>
            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
              Currently active and verified
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Pending / Inactive</span>
              <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <UserX className="size-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">4</div>
            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
              Awaiting confirmation or idle
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">System Security</span>
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">Optimal</div>
            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
              Role-based access enforced
            </p>
          </div>
        </div>

        {/* Quick Links Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-5">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">User & Team Access Management</h2>
            <p className="text-xs text-muted-foreground">
              Create, edit, search, filter, and assign roles for organization members.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/users">Manage Users</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
