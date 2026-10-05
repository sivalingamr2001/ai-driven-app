import { createFileRoute } from "@tanstack/react-router"
import { AppLayout } from "@/components/layout/app-layout"
import { UsersPage } from "@/features/users/users-page"

export const Route = createFileRoute("/users")({
  component: UsersRouteComponent,
})

function UsersRouteComponent() {
  return (
    <AppLayout>
      <UsersPage />
    </AppLayout>
  )
}
